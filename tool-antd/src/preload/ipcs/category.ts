import { eventKeys } from '@preload/event-keys'
import { Category as ICategory } from '@system/database/entities'
import { ipcRenderer } from 'electron'

export const ipcRendererCategory = {
  create: async (payload: ICategoryNew): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.category.create, payload)
  },
  getAll: async (): Promise<ICategory[]> => {
    return await ipcRenderer.invoke(eventKeys.category.getAll)
  },
  edit: async (payload: ICategory): Promise<boolean> => {
    return await ipcRenderer.invoke(eventKeys.category.edit, payload)
  }
}
