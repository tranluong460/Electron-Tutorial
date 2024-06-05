import { eventKeys } from '@preload/event-keys'
import { ipcMain } from 'electron'
import worker from '../ipcs/createBrowser?nodeWorker'

export const IpcMainYoutube = (): void => {
  ipcMain.handle(eventKeys.youtube.seedingYoutube, async () => {
    for (let index = 0; index < 3; index++) {
      worker({})
        .on('message', (message) => console.log(message))
        .on('error', (error) => console.log(error))
        .postMessage('')
    }
  })
}
