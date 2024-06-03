import { AccountYoutube } from '@system/database/entities'

export const Youtube = {
  getAllAccount: async (): Promise<AccountYoutube[]> => {
    return await window.api.youtube.getAllAccount()
  },
  importExcel: async (): Promise<IDataExcelYoutube[]> => {
    return await window.api.youtube.importExcel()
  },
  createNewDataExcel: async (payload: IDataExcelYoutube[]): Promise<boolean> => {
    return await window.api.youtube.createNewDataExcel(payload)
  }
}
