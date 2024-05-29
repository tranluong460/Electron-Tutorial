import puppeteer, { Page, Browser } from 'puppeteer'
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
      '--start-maximized',
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
export const decodeCaptchaImage = async (imageUrl: string): Promise<string | null> => {
  if (!imageUrl) return null

  const key = '8e74bd7ce443e11fec525995bad4b6bd'
  const type = 14

  try {
    const response = await customAxios.post('/captcha', {
      apikey: key,
      img: imageUrl,
      type
    })

    return response.data.captcha
  } catch (error) {
    return null
  }
}
// cspell: enable
