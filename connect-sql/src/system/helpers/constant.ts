import { homedir } from 'node:os'
import path from 'node:path'

export const APP_TITLE = import.meta.env.MAIN_VITE_APP_TITLE
export const APP_ID = import.meta.env.MAIN_VITE_APP_ID
export const KEY_SHA256 = 'abc@#$%^&&$'
export const KEY_API_DOMAIN = import.meta.env.MAIN_VITE_APP_KEY_API_DOMAIN
export const KEY_API_URL = import.meta.env.MAIN_VITE_APP_KEY_API_URL
export const APP_VERSION = import.meta.env.MAIN_VITE_APP_VERSION
export const MASP = import.meta.env.MAIN_VITE_APP_MASP
export const KEY_API_URL_NEW = import.meta.env.MAIN_VITE_APP_KEY_API_URL_NEW
const getPathApp = (dir: string[] = ['']): string => {
  return path.join(process.cwd(), ...dir)
}

const getPathUser = (dir: string[]): string => {
  return path.join(process.cwd(), 'libs', 'data', ...dir)
}

export const getHostFile = (): string => {
  if (process.platform === 'win32') {
    return path.join(homedir(), '../..', 'Windows/System32/drivers/etc/hosts')
  }
  return '/etc/hosts'
}
export const AUTH_INFO_FILE = getPathUser(['auth-info.json'])
// App Path
export const APP_DIR = getPathApp()
export const AUTH_INFO = getPathUser(['auth-info.json'])
// Path file
export const DB_FILE = getPathUser([`${APP_ID}.db`])
export const LOGGER_FILE = getPathUser(['Logs'])
