import { eventKeys } from '@preload/event-keys'
import { ipcRenderer } from 'electron'

export const ipcRendererYoutube = {
  seedingYoutube: async (): Promise<void> => {
    return await ipcRenderer.invoke(eventKeys.youtube.seedingYoutube)
  }
}
