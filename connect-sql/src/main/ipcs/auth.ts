import eventKeys from '@preload/event-keys'
import { User, localUser } from '@system/database/entities'
import { AuthModel } from '@system/database/models/Auth'
import { osHelper } from '@system/helpers'
import { ipcMain } from 'electron'

export const IpcMainAuth = (): void => {
  ipcMain.handle(eventKeys.auth.get_his, async (): Promise<string> => {
    return await osHelper()
  })
  ipcMain.handle(eventKeys.auth.login, async (_, payload: ILoginFormNew): Promise<boolean> => {
    return await AuthModel.login(payload)
  })
  ipcMain.handle(eventKeys.auth.logout, async (): Promise<void> => {
    await AuthModel.logout()
  })
  ipcMain.handle(eventKeys.auth.verify_token, async (): Promise<boolean> => {
    return await AuthModel.verifyToken()
  })

  ipcMain.handle(eventKeys.auth.get_user, async (): Promise<User> => {
    return await localUser()
  })
  ipcMain.handle(eventKeys.auth.accept_term, async (_, payload: boolean): Promise<boolean> => {
    const user = await localUser()
    user.isTerms = payload
    return !!(await User.update({ id: user.id }, user))
  })
}
