import { BrowserWindow } from 'electron'

export const sendToast = (toast: Toast): void => {
  BrowserWindow.getAllWindows()[0].webContents.send('toast', toast)
}
