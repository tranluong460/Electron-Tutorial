import { eventKeys } from '@preload/event-keys'
import { Category as ICategory } from '@system/database/entities'
import { CategoryYoutubeModel } from '@system/database/models'
import { delay } from '@system/helpers'
import { ipcMain } from 'electron'

export const IpcMainCategory = (): void => {
  ipcMain.handle(eventKeys.category.create, async (_, payload): Promise<boolean> => {
    await delay(1000)
    return CategoryYoutubeModel.create(payload)
  })
  ipcMain.handle(eventKeys.category.getAll, async (): Promise<ICategory[]> => {
    return CategoryYoutubeModel.getAllCategory()
  })
  ipcMain.handle(eventKeys.category.edit, async (_, payload): Promise<boolean> => {
    await delay(1000)
    return CategoryYoutubeModel.edit(payload)
  })
  ipcMain.handle(eventKeys.category.delete, async (_, payload): Promise<boolean> => {
    await delay(1000)
    return CategoryYoutubeModel.delete(payload)
  })
  ipcMain.handle(eventKeys.category.setCategory, async (_, payload): Promise<boolean> => {
    await delay(1000)
    return CategoryYoutubeModel.setCategory(payload)
  })
}
