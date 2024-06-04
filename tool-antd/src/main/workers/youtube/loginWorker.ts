import { parentPort, workerData } from 'worker_threads'
import { checkSelector, clickSelector, decodedCaptchaImage, writeText } from '.'
import { Page } from 'puppeteer'

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
  avatar: 'button#avatar-btn',
  passkeyButton: 'button[type="button"]'
}
// cspell: enable

export const loginWorker = async (page: Page): Promise<boolean> => {
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

  const isPasskeyButton = await checkSelector(page, selectors.passkeyButton)
  if (isPasskeyButton) {
    const buttons = await page.$$(selectors.passkeyButton)
    if (buttons.length > 1) await buttons[1].click()
  }

  const isLoggedIn = await page
    .waitForSelector(selectors.avatar)
    .then(() => {
      return true
    })
    .catch(() => {
      return false
    })

  return isLoggedIn
}
