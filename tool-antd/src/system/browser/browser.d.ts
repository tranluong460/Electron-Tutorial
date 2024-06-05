import { Browser, Page } from 'puppeteer-core'
import { Account } from 'src/main/entity'

declare global {
  interface ILaunchOption {
    proxy?: string
    browserDir: string
    profileDir: string
    position?: string
    isWinOS?: boolean
    timeout?: number
  }
  interface IBrowserLauncher {
    page: Page
    browser: Browser
    port?: number
    account?: Account
    position?: string
  }
  interface IResolution {
    x: number
    y: number
  }
  interface IProxy {
    autoProxyRegion?: string
    host?: string
    mode?: string
    password: string
    port?: number
    torProxyRegion?: string
    username: string
  }
  interface IOptionProfile {
    id: number | string
    name: string
    platform: 'mac m1' | NodeJS.Platform
    Proxy?: IProxy
    userAgent?: string
    mobile?: boolean
    cookie?: string
    browserDir?: string
    startup_url?: string
  }
}
