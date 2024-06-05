/* eslint-disable @typescript-eslint/no-explicit-any */
import { queueAsPromised } from 'fastq'
import _ from 'lodash'
import { EventEmitter } from 'node:events'
import { Account } from '../db/entity'
import { AccountModel } from '../db/model/Account'
import { logger } from '../utils'

const kPositionFreedEvent = Symbol('kPositionFreedEvent')

export default class PositionPool<
	T extends { position?: string; account?: Account }
> extends EventEmitter {
	freePositions: string[]
	tasks: T[]
	q: queueAsPromised<T>
	constructor(positions: string[], q: queueAsPromised<T>) {
		super()
		const positionCount = positions.length
		this.freePositions = positions
		this.tasks = []
		this.q = q

		this.on(kPositionFreedEvent, (position: string) => {
			if (this.tasks.length > 0) {
				const task = this.tasks.shift()!
				console.log('🚀 ~ this.on ~ task:', task)
				task.position = position
				this.runTask(task)
			}
			_.delay(() => {
				if (positionCount === this.freePositions.length) {
					AccountModel.existsPort().then((exists: boolean) => {
						if (!exists) {
							process.exit()
						}
					})
				}
			}, 5000)
		})
	}

	makeFreePosition(position: string): void {
		this.freePositions.push(position)
		this.emit(kPositionFreedEvent, position)
	}

	runTask(task: T): void {
		if (this.freePositions.length === 0) {
			logger.info('No free position')
			this.tasks.push(task)
			return
		}

		const position = task.position ?? this.freePositions.shift()!
		task.position = position
		this.q.push(task)
	}

	reTask(task: T): void {
		this.makeFreePosition(task.position!)
		this.runTask(task)
	}
}
