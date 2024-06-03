import { delay } from '@system/helpers'
import { ipcMain } from 'electron'
import { eventKeys } from '@preload/event-keys'
import { AuthModel } from '@system/database/models'

export const IpcMainAuth = (): void => {
  ipcMain.handle(eventKeys.auth.isAuth, async (): Promise<boolean> => {
    return await AuthModel.isAuth()
  })

  ipcMain.handle(eventKeys.auth.login, async (_, payload: ILoginNew): Promise<boolean> => {
    await delay(1000)
    return await AuthModel.login(payload)
  })

  ipcMain.handle(eventKeys.auth.logout, async (): Promise<boolean> => {
    await delay(1000)
    return await AuthModel.logout()
  })
}
