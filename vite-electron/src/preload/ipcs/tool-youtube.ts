import eventKeys from '@preload/event-keys'
import { ipcRenderer } from 'electron'

export const ipcRendererToolYoutube = {
  increaseViews: async (payload: IIncreaseViewYoutube): Promise<void> => {
    return await ipcRenderer.invoke(eventKeys.toolYoutube.increaseViews, payload)
  }
}
