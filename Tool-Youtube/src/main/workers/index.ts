import puppeteer, { Page, Browser } from 'puppeteer'
import axios from 'axios'
import { workerData } from 'worker_threads'

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
      workerData?.language ? `--lang=${workerData.language}` : '--lang=vi',
      workerData?.proxy &&
        `--proxy-server=${workerData.proxy.SERVER_IP}:${workerData.proxy.SERVER_PORT}`
    ]
  })

  const page = (await browser.pages())[0]

  if (workerData?.proxy) {
    await page.authenticate({
      username: workerData.proxy.USERNAME,
      password: workerData.proxy.PASSWORD
    })
  }

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
