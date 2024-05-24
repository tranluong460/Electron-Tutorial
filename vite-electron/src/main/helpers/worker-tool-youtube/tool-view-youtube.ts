import puppeteer from 'puppeteer'
import { workerData, parentPort } from 'worker_threads'

const port = parentPort

if (!port) throw new Error('IllegalState')

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const toolViewYoutube = async (): Promise<void> => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  })

  const page = await browser.newPage()

  await page.goto('https://www.youtube.com/', {
    waitUntil: ['networkidle0']
  })

  await page.type('#search-input input', workerData.keyword)

  await page.click('#search-icon-legacy')

  await page.waitForSelector('a#video-title')

  const urlFirstVideo = await page.$eval('a#video-title', (el) => el.href)

  await page.goto(urlFirstVideo, {
    waitUntil: ['networkidle0']
  })

  await page.click('button.ytp-large-play-button.ytp-button')

  for (let i = 0; i < workerData.loop; i++) {
    await delay(1000)

    await page.mouse.wheel({ deltaY: 200 })
  }

  await delay(workerData.delay * 5000)

  browser.close()
}

toolViewYoutube()
