import { Demo } from '../../../system/database/entities'

export const ExportExcel = {
  exportFileExcel: async (payload: Demo[]): Promise<void> => {
    return await window.api.excel.exportOneFileExcel(payload)
  },
  exportFileJson: async (payload: Demo[]): Promise<void> => {
    return await window.api.excel.exportOneFileJson(payload)
  },
  importTxt: async (): Promise<void> => {
    return await window.api.excel.importOneTxt()
  }
}
