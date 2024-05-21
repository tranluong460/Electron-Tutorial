import { BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

const sendUpdateToWindow = (browserWindow: BrowserWindow, type: string, message): void => {
  browserWindow.webContents.send(type, message)
}

export const checkUpdateEvent = (browserWindow: BrowserWindow): void => {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  // autoUpdater.on('checking-for-update', () => {
  //   logger.info('Checking for update...')
  // })
  autoUpdater.on('update-available', (info) => {
    sendUpdateToWindow(browserWindow, 'update-available', info)
  })
  // autoUpdater.on('update-not-available', (info) => {
  // 	sendUpdateToWindow(browserWindow, 'Update not available.')
  // })
  autoUpdater.on('error', () => {
    // sendUpdateToWindow(browserWindow, 'Error in auto-updater. ' + err)
  })
  autoUpdater.on('download-progress', (progressObj) => {
    sendUpdateToWindow(browserWindow, 'download-progress', progressObj)
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendUpdateToWindow(browserWindow, 'update-downloaded', info)
  })
}
