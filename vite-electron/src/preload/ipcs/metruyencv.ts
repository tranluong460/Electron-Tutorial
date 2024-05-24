import { ipcRenderer } from 'electron'
import eventKeys from '../event-keys'

export const ipcRendererMetruyencv = {
  scratchBookToElement: async (payload: IScratch): Promise<void> => {
    return await ipcRenderer.invoke(eventKeys.metruyencv.scratchToElement, payload)
  },
  scratchBookToApi: async (payload: IScratch): Promise<void> => {
    return await ipcRenderer.invoke(eventKeys.metruyencv.scratchToApi, payload)
  }
}
