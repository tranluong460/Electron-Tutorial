import puppeteer, { Page, Browser } from 'puppeteer'

export const createBrowser = async (): Promise<{ browser: Browser; page: Page }> => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--lang=vi']
  })

  const page = await browser.pages()

  return { browser, page: page[0] }
}
