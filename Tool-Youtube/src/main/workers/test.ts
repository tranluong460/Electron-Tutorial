import { parentPort, workerData } from 'worker_threads'
import { createBrowser } from '.'

const port = parentPort
if (!port) throw new Error('IllegalState')

// cspell: disable
const selectors = {
  loginButton: '#buttons [button-next]',
  emailInput: 'input#identifierId',
  emailNextButton: '#identifierNext button',
  captchaImage: 'img[id="captchaimg"]',
  captchaInput: 'input[id="ca"]',
  passwordInput: '#password input',
  passwordNextButton: '#passwordNext button',
  challengeSelect: 'div[data-challengeid="8"]',
  countryListSelect: 'div[id="countryList"]',
  vnValue: 'li[data-value="vn"]',
  phoneInput: 'input[id="phoneNumberId"]'
}
// cspell: enable

const testWorker = async (): Promise<void> => {
  const { page } = await createBrowser()

  // Đến trang đăng nhập
  await page.goto('https://www.youtube.com/', { waitUntil: 'networkidle0' })
  await page.click(selectors.loginButton)

  // Nhập email
  await page.waitForSelector(selectors.emailInput, { visible: true })
  await page.type(selectors.emailInput, workerData.account.email, { delay: 120 })
  await page.click(selectors.emailNextButton)

  // Kiểm tra xem có captcha không

  // Giải captcha

  // Nhập captcha

  // Nhập mật khẩu
  await page.waitForSelector(selectors.passwordInput, { visible: true })
  await page.type(selectors.passwordInput, workerData.account.password, { delay: 120 })
  await page.click(selectors.passwordNextButton)

  // Chọn cách đăng nhập

  // Chọn quốc gia

  // Nhập số điện thoại

  // Passkey
}

testWorker()
