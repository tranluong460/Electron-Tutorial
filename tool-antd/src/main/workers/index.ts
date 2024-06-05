import axios from 'axios'
import { join } from 'path'
import puppeteer, { connect } from 'puppeteer-core'
import { findAvailablePort } from '@system/utils'
import { BROWSER_DIR } from '@system/helpers'

const getWSEndPoint = async (port: number, retry = 5): Promise<string | undefined> => {
  const findWSEndPoint = (): Promise<string> => {
    return new Promise<string>((resolve) => {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:${port}/json/version`)
          if (response.status === 200) {
            clearInterval(interval)
            resolve(response.data.webSocketDebuggerUrl)
          }
        } catch {
          //
        }
      }, 500)
    })
  }

  const ws = await Promise.any([
    findWSEndPoint(),
    new Promise<string>((resolve) => setTimeout(() => resolve(''), retry * 1000))
  ])

  return ws !== '' ? ws : undefined
}

export const connectBrowser = async (port: number): Promise<IBrowserLauncher | undefined> => {
  try {
    const WSEndPoint = await getWSEndPoint(port)

    if (WSEndPoint) {
      const browser = await connect({
        browserWSEndpoint: WSEndPoint,
        ignoreHTTPSErrors: true,
        defaultViewport: null
      })

      const pages = await browser.pages()

      let pagesCount = pages.length
      while (pagesCount > 1) {
        await pages[pagesCount - 1].close()
        pagesCount--
      }

      const launcher: IBrowserLauncher = {
        browser,
        page: pages[0],
        port: port
      }

      return launcher
    }
  } catch (error) {
    console.error(error, ['Connect Browser'])
  }

  return undefined
}

const launchBrowserArgs = async (
  port: number,
  options: ILaunchOption
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const optionPosition = `--window-position=${options.position}`

  const args = [
    '--force-device-scale-factor=0.65',
    `--remote-debugging-port=${port}`,
    '--lang=en-US'
  ]

  let fontMasking = '--font-masking-mode=2'
  if ('win32' !== process.platform) {
    fontMasking = '--font-masking-mode=3'
  }
  if ('android' !== process.platform) {
    fontMasking = '--font-masking-mode=1'
  }
  args.push(optionPosition, fontMasking)

  const env = {}

  args.push(`--tz='Asia/Bangkok'`)
  env['TZ'] = 'Asia/Bangkok'

  Object.keys(process.env).forEach((key) => {
    env[key] = process.env[key]
  })
  return [args, env]
}

const getBrowserExec = (browserDir: string): string => {
  if (process.platform === 'darwin') {
    return join(browserDir, 'Orbita-Browser.app', 'Contents', 'MacOS', 'Orbita')
  }

  if (process.platform === 'win32') {
    return join(browserDir, 'chrome.exe')
  }

  return join(browserDir, 'chrome')
}

export const launchProcessBrowser = async (position: string): Promise<number | undefined> => {
  try {
    const port = await findAvailablePort()

    const options: ILaunchOption = {
      browserDir: BROWSER_DIR,
      position: position
    }

    const [args, env] = await launchBrowserArgs(port, options)

    const MKT_BROWSER = getBrowserExec(options.browserDir)

    await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: args,
      env: env,
      executablePath: MKT_BROWSER
    })

    return port
  } catch (error) {
    console.error(error, '[Launch Process Browser]')
  }

  return undefined
}
