import { ipcMain } from 'electron'
import { crud } from '../../preload/event-keys'
import { DemoModel } from '../../system/database/models/Demo'
import { Demo } from '../../system/database/entities'

export const IpcMainDemo = (): void => {
  ipcMain.handle(crud('demo').create, async (_, payload): Promise<void> => {
    await DemoModel.create(payload)
  })

  ipcMain.handle(crud('demo').read, async (): Promise<Demo[]> => {
    return await DemoModel.getAllD()
  })

  ipcMain.handle(crud('demo').delete, async (_, id): Promise<void> => {
    await DemoModel.deleteOneDemo(id)
  })

  ipcMain.handle(crud('demo').update, async (_, payload): Promise<void> => {
    await DemoModel.updateOneDemo(payload)
  })
}
