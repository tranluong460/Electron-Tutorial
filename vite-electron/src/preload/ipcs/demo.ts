import { ipcRenderer } from 'electron'
import { crud } from '../event-keys'
import { Demo } from '../../system/database/entities'

export const ipcRendererDemo = {
  createNewDemo: async (payload: Demo): Promise<Demo> => {
    return await ipcRenderer.invoke(crud('demo').create, payload)
  },
  getAllDemosBase: async (): Promise<Demo[]> => {
    return await ipcRenderer.invoke(crud('demo').read)
  },
  deleteOneDemo: async (id: number): Promise<void> => {
    return await ipcRenderer.invoke(crud('demo').delete, id)
  },
  updateOneDemo: async (payload: Demo): Promise<Demo> => {
    return await ipcRenderer.invoke(crud('demo').update, payload)
  }
}
