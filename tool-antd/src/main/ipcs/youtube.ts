import { eventKeys } from '@preload/event-keys'
import { AccountYoutube } from '@system/database/entities'
import { dialog, ipcMain } from 'electron'
import { AccountYoutubeModel } from '@system/database/models'
import XlsxFile from '@system/helpers/XlsxFile'
import { delay } from '@system/helpers'
import loginWorkerApi from '@main/workers/youtube/youtube?nodeWorker'
import fastq from 'fastq'
import fs from 'fs'

const createWorker = async (data, cb): Promise<void> => {
  loginWorkerApi({
    workerData: data
  })
    .on('message', (message) => {
      console.log(message)
    })
    .on('error', (error) => {
      console.log(error)
    })
    .on('exit', () => {
      cb()
    })
    .postMessage('')
}

export const IpcMainYoutube = (): void => {
  ipcMain.handle(eventKeys.youtube.getAllAccount, async (): Promise<AccountYoutube[]> => {
    return await AccountYoutubeModel.getAllAccount()
  })
  ipcMain.handle(
    eventKeys.youtube.importExcel,
    async (_, payload: string): Promise<IDataExcel[]> => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'XLSX', extensions: ['xlsx', 'xls'] }]
      })

      if (result.canceled || result.filePaths.length === 0) return []

      const filePath = result.filePaths[0]

      const xlsx = new XlsxFile(filePath)

      const data = await xlsx.readFile('Google', payload)

      if (!data) return []

      return data
    }
  )
  ipcMain.handle(
    eventKeys.youtube.importText,
    async (_, payload: string): Promise<IDataExcel[]> => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'TXT', extensions: ['txt'] }]
      })

      if (result.canceled || result.filePaths.length === 0) return []

      const filePath = result.filePaths[0]

      const data = fs.readFileSync(filePath, 'utf-8')

      if (!data) return []

      const lines = data.trim().split('\n')
      const type = payload.split('|')

      const formattedData = lines.map((line) => {
        const [email, password, phone] = line.split('|')
        return {
          [type[0]]: email,
          [type[1]]: password,
          [type[2]]: phone
        }
      })

      return formattedData
    }
  )
  ipcMain.handle(eventKeys.youtube.createNewDataExcel, async (_, payload): Promise<boolean> => {
    await delay(1000)
    return await AccountYoutubeModel.createNewDataExcel(payload)
  })
  ipcMain.handle(
    eventKeys.youtube.seedingVideo,
    async (_, payload: ISeedingNew): Promise<boolean> => {
      const { links, comments, stream, accounts, actions, max_time_video } = payload

      const queue = fastq(createWorker, stream)

      const account_list = await AccountYoutubeModel.getAccountById(accounts)

      const totalTasks = links.length * account_list.length

      for (let index = 0; index < totalTasks; ++index) {
        const indexLink = Math.floor(index / account_list.length)
        const indexAcc = index % account_list.length

        queue.push({
          link: links[indexLink],
          comment: comments[Math.floor(Math.random() * comments.length)],
          account: account_list[indexAcc],
          actions,
          max_time_video
        })
      }

      return true
    }
  )
  ipcMain.handle(eventKeys.youtube.deleteAccount, async (_, payload): Promise<boolean> => {
    await delay(1000)
    return await AccountYoutubeModel.deleteAccount(payload)
  })
  ipcMain.handle(eventKeys.youtube.editAccount, async (_, payload): Promise<boolean> => {
    await delay(1000)
    return await AccountYoutubeModel.editAccount(payload)
  })
}
