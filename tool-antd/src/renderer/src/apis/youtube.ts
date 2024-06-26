import { AccountYoutube } from '@system/database/entities'

export const Youtube = {
  getAllAccount: async (): Promise<AccountYoutube[]> => {
    return await window.api.youtube.getAllAccount()
  },
  importExcel: async (payload: string): Promise<IDataExcelYoutube[]> => {
    return await window.api.youtube.importExcel(payload)
  },
  importText: async (payload: string): Promise<IDataExcel[]> => {
    return await window.api.youtube.importText(payload)
  },
  createNewDataExcel: async (payload: IDataExcelYoutube | AccountYoutube): Promise<boolean> => {
    return await window.api.youtube.createNewDataExcel(payload)
  },
  seedingVideo: async (payload: ISeedingNew): Promise<boolean> => {
    return await window.api.youtube.seedingVideo(payload)
  },
  deleteAccount: async (payload: string[]): Promise<boolean> => {
    return await window.api.youtube.deleteAccount(payload)
  },
  editAccount: async (payload: AccountYoutube): Promise<boolean> => {
    return await window.api.youtube.editAccount(payload)
  }
}
