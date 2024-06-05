export {}

declare global {
  interface ILaunchOption {
    proxy?: string
    browserDir: string
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
}
