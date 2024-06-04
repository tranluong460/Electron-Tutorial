import { parentPort, workerData } from 'worker_threads'
import { createBrowser } from '../createBrowser'
import { KeyboardTypeOptions, Page, WaitForSelectorOptions } from 'puppeteer'
import { delay } from '@system/helpers'
import axios from 'axios'

const port = parentPort
if (!port) throw new Error('IllegalState')

// cspell: disable
const selectors = {
  loginButton: '#buttons [button-next]',
  emailInput: 'input#identifierId',
  passwordInput: 'input[name="Passwd"]',
  captchaImage: 'img#captchaimg',
  captchaInput: 'input#ca',
  phoneVerify: 'div[data-challengeid="8"]',
  countryList: '#countryList [aria-live="polite"]',
  valueSelect: 'li[data-value="vn"]',
  phoneInput: 'input#phoneNumberId',
  emailVerify: '[data-challengetype="12"]',
  emailVerifyInput: '#knowledge-preregistered-email-response',
  avatar: 'button#avatar-btn'
}

const getCodeCaptcha = async (imageBase64: string): Promise<string | null> => {
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
// cspell: enable

const delay_time = 2000
const timeout = 3000

const checkSelector = async (
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

const writeText = async (
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

const seedingWorker = async (): Promise<void> => {
  const { page } = await createBrowser()

  await page.goto('https://www.youtube.com/', { waitUntil: 'networkidle0' })
  await page.click(selectors.loginButton)

  const isEmailInput = await checkSelector(page, selectors.emailInput)
  if (isEmailInput) {
    await writeText(page, selectors.emailInput, workerData.account.email, { delay: 120 })

    const isCaptchaImage = await checkSelector(page, selectors.captchaImage)
    if (isCaptchaImage) {
      const captcha = await decodedCaptchaImage(page, selectors.captchaImage)

      if (captcha) {
        await writeText(page, selectors.captchaInput, captcha, { delay: 120 })
      }
    }
  }

  const isPasswordInput = await checkSelector(page, selectors.passwordInput)
  if (isPasswordInput) {
    await writeText(page, selectors.passwordInput, workerData.account.password, {
      delay: 120
    })

    const isCaptchaImage = await checkSelector(page, selectors.captchaImage)
    if (isCaptchaImage) {
      const captcha = await decodedCaptchaImage(page, selectors.captchaImage)

      if (captcha) {
        await writeText(
          page,
          selectors.passwordInput,
          workerData.account.password,
          { delay: 120 },
          false
        )
        await writeText(page, selectors.captchaInput, captcha, { delay: 120 })
      }
    }
  }

  if (workerData.account.phone) {
    const isVerifySelect = await checkSelector(page, selectors.phoneVerify)
    if (isVerifySelect) {
      await clickSelector(page, selectors.phoneVerify)
    }

    const isCountrySelect = await checkSelector(page, selectors.countryList)
    if (isCountrySelect) {
      await clickSelector(page, selectors.countryList)

      const isValueSelect = await checkSelector(page, selectors.valueSelect)
      if (isValueSelect) {
        await clickSelector(page, selectors.valueSelect)

        const isPhoneInput = await checkSelector(page, selectors.phoneInput)
        if (isPhoneInput) {
          await writeText(page, selectors.phoneInput, workerData.account.phone, { delay: 120 })
        }
      }
    }
  }

  if (workerData.account.emailRecovery) {
    const emailVerify = await checkSelector(page, selectors.emailVerify)
    if (emailVerify) {
      await clickSelector(page, selectors.emailVerify)
      const emailVerifyInput = await checkSelector(page, selectors.emailVerifyInput)
      if (emailVerifyInput) {
        await writeText(page, selectors.emailVerifyInput, workerData.account.emailRecovery, {
          delay: 120
        })
      }
    }
  }
}

seedingWorker()
