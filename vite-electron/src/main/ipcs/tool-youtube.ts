import eventKeys from '@preload/event-keys'
import { ipcMain } from 'electron'
import workerAPI from '../helpers/worker-tool-youtube/tool-view-youtube?nodeWorker'

export const IpcMainToolYoutube = (): void => {
  ipcMain.handle(eventKeys.toolYoutube.increaseViews, async (_, payload): Promise<void> => {
    let currentIndex = 0

    const { stream, loop, delay, keyword } = payload
    const limitWorkerCreate = stream > keyword.length ? keyword.length : stream

    const createWorker = (index: number): void => {
      workerAPI({
        workerData: { keyword: keyword[index], loop, delay }
      })
        .on('error', (err) => console.log(err))
        .on('exit', () => {
          if (currentIndex < keyword.length) {
            createWorker(currentIndex++)
          }
        })
    }

    for (let i = 0; i < limitWorkerCreate; i++) createWorker(currentIndex++)
  })
}
