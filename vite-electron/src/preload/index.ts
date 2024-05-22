import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import { ipcRendererAuth, ipcRendererDemo, ipcRendererExcel } from './ipcs'

// Custom APIs for renderer
const api = {
  auth: ipcRendererAuth,
  demo: ipcRendererDemo,
  excel: ipcRendererExcel
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
