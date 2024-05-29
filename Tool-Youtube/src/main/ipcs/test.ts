import createWorker from '@main/workers/test?nodeWorker'
import { eventKeys } from '@preload/event-keys'
import { ACCOUNT_FILE } from '@system/helpers'
import { ipcMain } from 'electron'

export const IpcMainTest = (): void => {
  ipcMain.handle(eventKeys.test.ipcHandle, (_, payload: ITestNew): void =>
    console.log(payload.text)
  )

  ipcMain.handle(eventKeys.test.openYoutube, (): void => {
    const account_list = require(ACCOUNT_FILE)

    for (let index = 0; index < 3; index++) {
      const account = account_list[Math.floor(Math.random() * account_list.length)]

      createWorker({ workerData: { account } })
        .on('message', (message) => {
          console.log(message)
        })
        .on('error', (error) => {
          console.log(error)
        })
        .postMessage('')
    }
  })
}
