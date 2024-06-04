import { eventKeys } from '@preload/event-keys'
import { AccountYoutube } from '@system/database/entities'
import { dialog, ipcMain } from 'electron'
import { AccountYoutubeModel } from '@system/database/models'
import XlsxFile from '@system/helpers/XlsxFile'
import { delay } from '@system/helpers'
import workerApi from '@main/workers/youtube/seedingWorker?nodeWorker'
import fastq from 'fastq'

const createWorker = async ({ link, comment }, cb): Promise<void> => {
  workerApi({
    workerData: { link, comment }
  })
    .on('message', (message) => {
      console.log(message)
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
  ipcMain.handle(eventKeys.youtube.importExcel, async (): Promise<IDataExcelYoutube[]> => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'XLSX', extensions: ['xlsx', 'xls'] }]
    })

    if (result.canceled || result.filePaths.length === 0) return []

    const filePath = result.filePaths[0]

    const xlsx = new XlsxFile(filePath)

    const data = await xlsx.readFile('Google')

    if (!data) return []

    return data
  })
  ipcMain.handle(eventKeys.youtube.createNewDataExcel, async (_, payload): Promise<boolean> => {
    await delay(1000)
    return await AccountYoutubeModel.createNewDataExcel(payload)
  })
  ipcMain.handle(
    eventKeys.youtube.seedingVideo,
    async (_, payload: ISeedingNew): Promise<boolean> => {
      const { links, comments, stream } = payload
      const run = links.length > stream ? stream : links.length

      const queue = fastq(createWorker, run)

      for (let index = 0; index < links.length; index++) {
        queue.push({ link: links[index], comment: comments[index] })
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
