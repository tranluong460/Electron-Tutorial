import { eventKeys } from '@preload/event-keys'
import { ipcMain } from 'electron'
import createWorker from '@main/workers/test?nodeWorker'

export const IpcMainTest = (): void => {
  ipcMain.handle(eventKeys.test.ipcHandle, (_, payload: ITestNew): void =>
    console.log(payload.text)
  )

  ipcMain.handle(eventKeys.test.openYoutube, (): void => {
    createWorker({ workerData: 'Open Youtube' })
      .on('message', (message) => {
        console.log(message)
      })
      .on('error', (error) => {
        console.log(error)
      })
      .on('exit', () => {
        console.log('Exit worker')
      })
      .postMessage('')
  })
}
