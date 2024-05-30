import { Page } from 'puppeteer'
import { workerData } from 'worker_threads'
import { checkSelector, clickSelector, decodedCaptchaImage, writeText } from '.'

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
  phoneInput: 'input#phoneNumberId',
  avatar: 'button#avatar-btn'
}
// cspell: enable

export const loginYoutube = async (page: Page): Promise<boolean> => {
  try {
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

      await page.goto('https://www.youtube.com/watch?v=GY_tGI76CrU')
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
  } catch {
    return false
  }
}
