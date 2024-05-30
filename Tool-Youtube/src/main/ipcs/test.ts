import createWorker from '@main/workers/test?nodeWorker'
import googleWorker from '@main/workers/google?nodeWorker'
import { eventKeys } from '@preload/event-keys'
import { ACCOUNT_FILE, ACCOUNTs_FILE } from '@system/helpers'
import XlsxFile from '@system/helpers/XlsxFile'
import { ipcMain } from 'electron'

export const IpcMainTest = (): void => {
  ipcMain.handle(eventKeys.test.ipcHandle, (_, payload: ITestNew): void =>
    console.log(payload.text)
  )

  ipcMain.handle(eventKeys.test.openYoutube, async (): Promise<void> => {
    const account_list = require(ACCOUNTs_FILE)

    for (let index = 0; index < 1; index++) {
      const account = account_list[Math.floor(Math.random() * account_list.length)]

      createWorker({
        workerData: { account }
      })
        .on('message', (message) => {
          console.log(message)
        })
        .on('error', (error) => {
          console.log(error)
        })
        .postMessage('')
    }
  })

  ipcMain.handle(eventKeys.test.registerGoogle, async (): Promise<void> => {
    const xlsxFile = new XlsxFile(ACCOUNT_FILE)

    const excel = await xlsxFile.readFile('Google')

    googleWorker({
      workerData: { excel }
    })
      .on('message', (message) => {
        console.log(message)
      })
      .on('error', (error) => {
        console.log(error)
      })
      .postMessage('')
  })
}
