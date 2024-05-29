import { ipcRenderer } from 'electron'
import { eventKeys } from '@preload/event-keys'

export const ipcRendererTest = {
  ipcHandle: (payload: ITestNew): Promise<void> =>
    ipcRenderer.invoke(eventKeys.test.ipcHandle, payload),
  openYoutube: (): Promise<void> => ipcRenderer.invoke(eventKeys.test.openYoutube)
}
