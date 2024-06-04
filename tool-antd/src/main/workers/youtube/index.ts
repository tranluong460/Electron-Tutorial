import { delay } from '@system/helpers'
import axios from 'axios'
import { workerData } from 'node:worker_threads'
import { KeyboardTypeOptions, Page, WaitForSelectorOptions } from 'puppeteer'

const delay_time = workerData.delay_time * 1000
const timeout = 2000

export const getCodeCaptcha = async (imageBase64: string): Promise<string | null> => {
  if (!imageBase64) return null

  const apiUrl = 'https://omocaptcha.com'
  const apiToken =
    'apitokenb4wnrg6nlpfefkqawatrbvhzyn4ni23ovmtt2hh9px44j75dtqlwjjq7sspjn41716803272'
  try {
    const response = await axios.post(`${apiUrl}/captcha`, {
      api_token: apiToken,
      data: {
        type_job_id: '30',
        image_base64: imageBase64
      }
    })
    return response.data.captcha
  } catch (error) {
    return null
  }
}

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

    if (!captcha) return ''

    return captcha
  } catch (error) {
    return ''
  }
}
