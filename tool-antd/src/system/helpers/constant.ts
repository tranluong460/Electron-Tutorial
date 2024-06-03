import path from 'node:path'

export const APP_ID = import.meta.env.MAIN_VITE_APP_ID
export const APP_NAME = import.meta.env.MAIN_VITE_APP_NAME
export const APP_TITLE = import.meta.env.MAIN_VITE_APP_TITLE
export const APP_AUTHOR = import.meta.env.MAIN_VITE_APP_AUTHOR
export const APP_VERSION = import.meta.env.MAIN_VITE_APP_VERSION

const getPathApp = (dir: string[] = ['']): string => {
  return path.join(process.cwd(), ...dir)
}

const getPathUser = (dir: string[]): string => {
  return path.join(process.cwd(), 'libs', 'data', ...dir)
}

// App Path
export const APP_DIR = getPathApp()

// Path file
export const DB_FILE = getPathUser([`${APP_ID}.db`])
export const AUTH_FILE = getPathUser(['auth.json'])
export const LANGUAGES_FILE = getPathUser(['languages.json'])
