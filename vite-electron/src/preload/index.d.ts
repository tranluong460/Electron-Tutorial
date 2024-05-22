import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
  interface Api {
    auth: IpcRendererAuth
    demo: IpcRendererDemo
    excel: IpcRendererExcel
  }
}
