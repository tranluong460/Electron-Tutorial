import { parentPort, workerData } from 'worker_threads'
import { createBrowser, delay, getCodeCaptcha } from '.'
import { KeyboardTypeOptions, Page, WaitForSelectorOptions } from 'puppeteer'

const port = parentPort
if (!port) throw new Error('IllegalState')

// cspell: disable
const selectors = {
  loginButton: '#buttons [button-next]',
  emailInput: 'input#identifierId',
  passwordInput: 'input[name="Passwd"]',
  captchaImage: 'img#captchaimg',
  captchaInput: 'input#ca',
  verifySelect: 'div[data-challengeid="8"]',
  countryList: '#countryList [aria-live="polite"]',
  valueSelect: 'li[data-value="vn"]',
  phoneInput: 'input#phoneNumberId'
}
// cspell: enable

const checkSelector = async (
  page: Page,
  selector: string,
  options?: WaitForSelectorOptions
): Promise<boolean> => {
  try {
    await delay(3000)
    await page.waitForSelector(selector, options)

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
    await delay(3000)
    await page.type(selector, text, options)
    if (enter) await page.keyboard.press('Enter')
    return true
  } catch (error) {
    return false
  }
}

const clickSelector = async (page: Page, selector: string): Promise<boolean> => {
  try {
    await delay(3000)
    await page.click(selector)
    return true
  } catch (error) {
    return false
  }
}

const decodedCaptchaImage = async (page: Page, selector: string): Promise<string> => {
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

const testWorker = async (): Promise<void> => {
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
    await writeText(page, selectors.passwordInput, workerData.account.password, { delay: 120 })

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

  const isVerifySelect = await checkSelector(page, selectors.verifySelect)
  if (isVerifySelect) {
    await clickSelector(page, selectors.verifySelect)
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

testWorker()
