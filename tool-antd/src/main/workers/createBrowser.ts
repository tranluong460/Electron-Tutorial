import { workerData } from 'node:worker_threads'
import puppeteer, { Page, Browser } from 'puppeteer'

export const createBrowser = async (): Promise<{ browser: Browser; page: Page }> => {
  let positionY = 0
  const bIndex = workerData.index > 2 ? workerData.index - 3 : workerData.index

  if (workerData.index > 2) positionY = 435

  const newPositionX = -8 + bIndex * 500

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--force-device-scale-factor=1',
      `--window-size=320,440`,
      `--window-position=${newPositionX},${positionY}`,
      // '--start-maximized'
      '--lang=vi'
    ]
  })

  const page = await browser.pages()

  return { browser, page: page[0] }
}
