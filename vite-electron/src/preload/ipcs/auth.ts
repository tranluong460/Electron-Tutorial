import { User } from '@system/database/entities'
import { ipcRenderer } from 'electron'
import eventKeys from '../event-keys'

export const ipcRendererAuth = {
  getHis: async (): Promise<string> => {
    return await ipcRenderer.invoke(eventKeys.auth.get_his)
  },

  login: async (payload: ILoginFormNew): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.auth.login, payload)
  },

  logout: async (): Promise<void> => {
    return await ipcRenderer.invoke(eventKeys.auth.logout)
  },

  verifyToken: async (): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.auth.verify_token)
  },

  getUser: async (): Promise<User> => {
    return await ipcRenderer.invoke(eventKeys.auth.get_user)
  },

  acceptTerm: async (payload: boolean): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.auth.accept_term, payload)
  }
}
