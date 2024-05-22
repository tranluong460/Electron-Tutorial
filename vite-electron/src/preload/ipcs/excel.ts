import { ipcRenderer } from 'electron'
import { Demo } from '../../system/database/entities'
import eventKeys from '../event-keys'

export const ipcRendererExcel = {
  exportOneFileExcel: async (payload: Demo): Promise<void> => {
    return await ipcRenderer.invoke(eventKeys.excel.exportFile, payload)
  },
  exportOneFileJson: async (payload: Demo): Promise<void> => {
    return await ipcRenderer.invoke(eventKeys.excel.exportJson, payload)
  },
  importOneTxt: async (): Promise<void> => {
    return await ipcRenderer.invoke(eventKeys.excel.importTxt)
  }
}
