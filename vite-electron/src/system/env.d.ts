/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_APP_NAME: string
  readonly MAIN_VITE_APP_AUTHOR: string
  readonly MAIN_VITE_APP_TITLE: string
  readonly MAIN_VITE_APP_ID: string
  readonly MAIN_VITE_APP_KEY_API_DOMAIN: string
  readonly MAIN_VITE_APP_KEY_API_URL: string
  readonly MAIN_VITE_APP_VERSION: string
  readonly MAIN_VITE_APP_MASP: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
