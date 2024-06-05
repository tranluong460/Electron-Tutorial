import axios from 'axios'
import fs from 'fs'
import os from 'os'
import { join } from 'path'
import { connect } from 'puppeteer-core'
import { Account } from '../database/entities'
import { AccountModel } from '../database/models/account'
import { FbAuth } from '../fb'
import { BROWSER_DIR, PROFILE_DIR } from '../helpers'
import { execFileProcess, getAccountProfileName } from '../helpers'
import { findAvailablePort, logger } from '../utils'
import { createProfileWithOptions, getIPInfo } from './profiles'

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

export const resizeProfile = (
  options: ILaunchOption,
  nameProfile: string,
  size: IResolution
): boolean => {
  try {
    if (options.profileDir) {
      if (fs.existsSync(`${options.profileDir}\\${nameProfile}\\Default\\Preferences`)) {
        const profilePref = fs.readFileSync(
          `${options.profileDir}\\${nameProfile}\\Default\\Preferences`
        )
        const jsonPref = JSON.parse(profilePref as unknown as string)
        jsonPref.gologin.screenWidth = size.x
        jsonPref.gologin.screenHeight = size.y
        fs.writeFileSync(
          `${options.profileDir}\\${nameProfile}\\Default\\Preferences`,
          JSON.stringify(jsonPref)
        )
      }
    }
  } catch {
    return false
  }
  return true
}

export const changeUserAgent = (
  options: ILaunchOption,
  nameProfile: string,
  userAgent: string
): boolean => {
  try {
    if (options.profileDir) {
      if (fs.existsSync(`${options.profileDir}\\${nameProfile}\\Default\\Preferences`)) {
        const profilePref = fs.readFileSync(
          `${options.profileDir}\\${nameProfile}\\Default\\Preferences`
        )
        const jsonPref = JSON.parse(profilePref as unknown as string)
        jsonPref.gologin.userAgent = userAgent
        fs.writeFileSync(
          `${options.profileDir}\\${nameProfile}\\Default\\Preferences`,
          JSON.stringify(jsonPref)
        )
      }
    }
  } catch {
    return false
  }
  return true
}

export const addProxyAuthenticate = (
  options: ILaunchOption,
  nameProfile: string,
  proxy: IProxy
): boolean => {
  try {
    if (options.profileDir) {
      if (fs.existsSync(`${options.profileDir}\\${nameProfile}\\Default\\Preferences`)) {
        const profilePref = fs.readFileSync(
          `${options.profileDir}\\${nameProfile}\\Default\\Preferences`
        )
        const jsonPref = JSON.parse(profilePref as unknown as string)
        jsonPref.gologin.proxy = {
          username: proxy.username,
          password: proxy.password
        }
        fs.writeFileSync(
          `${options.profileDir}\\${nameProfile}\\Default\\Preferences`,
          JSON.stringify(jsonPref)
        )
      }
    }
  } catch {
    return false
  }
  return true
}

export const changeStartupUrl = (nameProfile: string, url: string): boolean => {
  try {
    if (fs.existsSync(`${PROFILE_DIR}\\${nameProfile}\\Default\\Preferences`)) {
      const profilePref = fs.readFileSync(`${PROFILE_DIR}\\${nameProfile}\\Default\\Preferences`)
      const jsonPref = JSON.parse(profilePref as unknown as string)
      jsonPref.gologin.startup_urls = [url]
      jsonPref.gologin.startUrl = url
      fs.writeFileSync(
        `${PROFILE_DIR}\\${nameProfile}\\Default\\Preferences`,
        JSON.stringify(jsonPref)
      )
    }
  } catch (e) {
    return false
  }
  return true
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
  } catch (e) {
    logger.error(e)
  }
  return undefined
}

const launchBrowserArgs = async (
  port: number,
  nameProfile: string,
  options: ILaunchOption
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const optionPosition = `--window-position=${options.position}`
  // const ipInfo = await getIPInfo()
  const args = [
    '--force-device-scale-factor=0.65',
    '--enable-chrome-browser-cloud-management',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${join(options.profileDir, nameProfile)}`,
    '--password-store=basic',
    // `--tz=${ipInfo!.timezone || 'Asia/Bangkok'}`,
    '--lang=en-US'
  ]
  // const iconPath = `${options.browserDir}\\data\\mkt.html`
  let fontMasking = '--font-masking-mode=2'
  if ('win32' !== process.platform) {
    fontMasking = '--font-masking-mode=3'
    // args.push(`--app="${iconPath}"`)
  }
  if ('android' !== process.platform) {
    fontMasking = '--font-masking-mode=1'
  }
  args.push(optionPosition, fontMasking)
  // Handling proxies
  const env = {}

  if (options.proxy && options.proxy.split(':').length > 1) {
    const ipAddress = options.proxy.split(':')[0]
    const portNumber = options.proxy.split(':')[1]
    if (options.proxy.split(':').length > 3) {
      const [, , username, password] = options.proxy.split(':')
      addProxyAuthenticate(options, nameProfile, {
        username,
        password
      })
    }
    options.proxy = `${ipAddress}:${portNumber}`
    const hr_rules = `"MAP * 0.0.0.0 , EXCLUDE ${ipAddress}"`
    const ipInfo = await getIPInfo(ipAddress)
    args.push(`--tz=${ipInfo!.timezone}`)
    args.push(`--proxy-server=${options.proxy}`)
    args.push(`--host-resolver-rules=${hr_rules}`)
    env['TZ'] = ipInfo!.timezone
  } else {
    args.push(`--tz='Asia/Bangkok'`)
    env['TZ'] = 'Asia/Bangkok'
  }
  Object.keys(process.env).forEach((key) => {
    env[key] = process.env[key]
  })
  return [args, env]
}

const getBrowserExec = (browserDir: string): string => {
  // return 'C:\\Users\\HUNGTRINH\\.gologin\\browser\\orbita-browser\\chrome.exe'
  if (process.platform === 'darwin') {
    return join(browserDir, 'Orbita-Browser.app', 'Contents', 'MacOS', 'Orbita')
  }
  if (process.platform === 'win32') {
    return join(browserDir, 'chrome.exe')
  }
  return join(browserDir, 'chrome')
}

export const launchProcessBrowser = async (
  uid: string,
  position: string
): Promise<number | undefined> => {
  try {
    await createProfileWithOptions(uid, PROFILE_DIR, BROWSER_DIR)
    // const account = await Account.findOneBy({
    // 	uid
    // })
    const port = await findAvailablePort()
    const profileName = getAccountProfileName(uid)
    const options: ILaunchOption = {
      browserDir: BROWSER_DIR,
      profileDir: PROFILE_DIR,
      position: position
    }
    const [args, env] = await launchBrowserArgs(port, profileName, options)
    const MKT_BROWSER = getBrowserExec(options.browserDir)
    // if (account && !account.port) {
    await Account.update({ uid: uid }, { port: port })
    execFileProcess(MKT_BROWSER, args, { env })
    // } else {
    // logger.error(`Chrome profile being used`)
    // return undefined
    // }
    return port
  } catch (error) {
    logger.error(error, '[Launch Process Browser]')
    return undefined
  }
}

export const openChromeFacebook = async (
  account: Account,
  position: string
): Promise<IBrowserLauncher | undefined> => {
  try {
    os.setPriority(os.constants.priority.PRIORITY_HIGH)
    const port = await launchProcessBrowser(account.uid, position)
    if (!port) return undefined
    const chrome = await connectBrowser(port)
    if (!chrome) return undefined
    if (chrome.page) {
      const isLogin = await FbAuth.login(account, chrome.page)
      if (isLogin && port) {
        chrome.port = port
        chrome.account = account
        chrome.position = position
      } else {
        await chrome.browser.close()
        return undefined
      }
      return chrome
    }
  } catch (error) {
    logger.error(error, '[Open Chrome Facebook]')
    return undefined
  }
  return undefined
}

export const closeChromeFacebook = async (
  chrome: IBrowserLauncher,
  account: Account
): Promise<void> => {
  const updated = await Account.update({ uuid: account.uuid }, { port: null, used: false })
  if (updated.affected && updated.affected > 0) {
    await chrome.browser.close()
  }
}

export const closeAllChrome = async (): Promise<boolean> => {
  try {
    const accounts = await AccountModel.read()
    const closes = accounts.map(async (account: Account) => {
      const chrome = await connectBrowser(account.port!)
      if (chrome?.browser) {
        await Account.update({ uuid: account.uuid }, { port: null, used: false })
        return await chrome.browser.close()
      }
    })
    return Promise.all(closes).then(() => true)
  } catch (error) {
    logger.error(error)
  }
  return false
}
