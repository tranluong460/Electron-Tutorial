import { eventKeys } from '@preload/event-keys'
import { ipcRenderer } from 'electron'
import { AccountYoutube } from '@system/database/entities'

export const ipcRendererYoutube = {
  getAllAccount: async (): Promise<AccountYoutube> => {
    return await ipcRenderer.invoke(eventKeys.youtube.getAllAccount)
  },
  importExcel: async (payload: string): Promise<IDataExcelYoutube[]> => {
    return await ipcRenderer.invoke(eventKeys.youtube.importExcel, payload)
  },
  importText: async (payload: string): Promise<IDataExcel[]> => {
    return await ipcRenderer.invoke(eventKeys.youtube.importText, payload)
  },
  createNewDataExcel: async (payload: IDataExcelYoutube): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.youtube.createNewDataExcel, payload)
  },
  seedingVideo: async (payload: ISeedingNew): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.youtube.seedingVideo, payload)
  },
  deleteAccount: async (payload: string[]): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.youtube.deleteAccount, payload)
  },
  editAccount: async (payload: AccountYoutube): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.youtube.editAccount, payload)
  }
}
