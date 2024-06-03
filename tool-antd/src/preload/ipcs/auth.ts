import { ipcRenderer } from 'electron'
import { eventKeys } from '@preload/event-keys'

export const ipcRendererAuth = {
  isAuth: async (): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.auth.isAuth)
  },
  login: async (payload: ILoginNew): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.auth.login, payload)
  },
  logout: async (): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.auth.logout)
  }
}
