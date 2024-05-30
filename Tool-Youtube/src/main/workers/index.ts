import puppeteer, { Page, Browser, KeyboardTypeOptions, WaitForSelectorOptions } from 'puppeteer'
import axios from 'axios'

export const createBrowser = async (): Promise<{
  browser: Browser
  page: Page
}> => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--force-device-scale-factor=1',
      '--window-size=320,480',
      '--lang=vi'
    ]
  })

  const page = (await browser.pages())[0]

  return { browser, page }
}

const customAxios = axios.create({
  baseURL: 'https://anticaptcha.top/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const delay = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

// cspell: disable
export const getCodeCaptcha = async (imageUrl: string): Promise<string | null> => {
  if (!imageUrl) return null

  try {
    const response = await customAxios.post('/captcha', {
      apikey: 'bc62ddaa19ce77193fbaac0036ddb77a',
      img: imageUrl,
      type: 14
    })

    return response.data.captcha
  } catch (error) {
    return null
  }
}
// cspell: enable

const delay_time = 2000
const timeout = 3000

export const checkSelector = async (
  page: Page,
  selector: string,
  options?: WaitForSelectorOptions
): Promise<boolean> => {
  try {
    await delay(delay_time)
    await page.waitForSelector(selector, { timeout, ...options })

    const elements = await page.$$eval(selector, (els) => {
      return els
    })

    return elements.length > 0 ? true : false
  } catch (error) {
    return false
  }
}

export const writeText = async (
  page: Page,
  selector: string,
  text: string,
  options?: KeyboardTypeOptions,
  enter: boolean = true
): Promise<boolean> => {
  try {
    await delay(delay_time)
    await page.type(selector, text, options)
    if (enter) await page.keyboard.press('Enter')
    return true
  } catch (error) {
    return false
  }
}

export const clickSelector = async (page: Page, selector: string): Promise<boolean> => {
  try {
    await delay(delay_time)
    await page.click(selector)
    return true
  } catch (error) {
    return false
  }
}

export const decodedCaptchaImage = async (page: Page, selector: string): Promise<string> => {
  try {
    const imageSrc = await page.evaluate((selector) => {
      const element = document.querySelector(selector) as HTMLImageElement
      return element ? element.src : ''
    }, selector)

    if (!imageSrc) return ''

    const captcha = await getCodeCaptcha(imageSrc)

    console.log({ imageSrc, captcha })

    if (!captcha) return ''

    return captcha
  } catch (error) {
    return ''
  }
}
