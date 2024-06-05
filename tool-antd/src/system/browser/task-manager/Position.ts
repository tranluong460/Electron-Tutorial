import { queueAsPromised } from 'fastq'
import _ from 'lodash'
import { Account } from '../../db/entity'
import { logger } from '../../utils'
type IPosition<T> = {
  positions: string[]
  q: queueAsPromised<T>
}

// type IPositionPick<T> = Exclude<T, Pick<ScanTask, 'position'>>
export default class Position<T extends { position?: string; account: Account }> {
  public taskQueue: T[] = []
  public accountsIdle: Account[] = []
  public accountsBusy: Account[] = []
  public positions: string[] = []
  private readonly concurency: number
  public q: queueAsPromised<T, boolean>
  constructor(props: IPosition<T>) {
    this.q = props.q
    this.q.drain = (): void => {
      process.exit()
    }
    this.positions = props.positions
    this.concurency = this.positions.length
  }

  public tranferPosition(position: string): void {
    const task = this.taskQueue.shift()!
    if (!task) {
      logger.error('task queue is empty')
      return
    }
    task.position = position
    logger.info(`[tranfer position]`)
    this.q.push(task)
  }
  public tranferTask(task: T): void {
    logger.info(`[tranfer task]`)
    this.q.push(task)
  }

  public pushTask(task: T): void {
    if (this.positions.length === 0) {
      this.taskQueue.push(task)
      return
    }
    task.position = this.positions.shift()!
    this.q.push(task)
  }

  public setBusyAccount(account: Account): void {
    this.accountsBusy.push(account)
    _.remove(this.accountsIdle, (item) => item === account)
  }

  public setIdleAccount(account: Account): void {
    this.accountsIdle.push(account)
    _.remove(this.accountsBusy, (item) => item === account)
  }

  public getIdleAccount(acc: Account): Account | undefined {
    return this.concurency > 1
      ? _.sample(_.filter(this.accountsIdle, (account) => account.uid !== acc.uid))
      : _.sample(this.accountsIdle)
  }
}
