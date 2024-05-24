import { Worker } from 'worker_threads'
import { ipcMain } from 'electron'
import eventKeys from '../../preload/event-keys'
import puppeteer from 'puppeteer'
import { APP_DIR } from '../../system/helpers'
import { downloadChapter } from '../helpers'
import { BookModel } from '../../system/database/models'
import workerAPI from '../helpers/worker-download-api?nodeWorker'

export const IpcMainMetruyencv = (): void => {
  ipcMain.handle(eventKeys.metruyencv.scratchToElement, async (_, payload): Promise<void> => {
    let workerQuantity = 0

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null
    })

    const page = await browser.newPage()

    await page.goto(payload.bookUrl)

    await page.waitForSelector(
      'body > .min-h-screen.bg-auto > main > .space-y-5 > .pb-3 > .pt-6 > a > .text-sm'
    )

    const lastChapter = await page.$eval(
      'body > .min-h-screen.bg-auto > main > .space-y-5 > .pb-3 > .pt-6 > a > .text-sm',
      (el) => Number(el.innerHTML.replace(':', '').split(' ')[1])
    )

    await browser.close()

    if (lastChapter) {
      const start = payload.firstChapter > lastChapter ? lastChapter : payload.firstChapter || 1

      const end =
        payload.lastChapter > lastChapter ? lastChapter : payload.lastChapter || lastChapter

      for (let i = start; i <= end; i++) {
        workerQuantity++

        const workerFileUrl = `${APP_DIR}\\src\\main\\helpers\\worker-download-element.js`

        const worker = new Worker(workerFileUrl, {
          workerData: { payload, iChapter: i }
        })

        worker.on('message', async (data) => {
          await downloadChapter(data, payload).then(async () => {
            const book = await BookModel.findBookByIndexChapter(data.indexChapter)

            if (book.length === 0) await BookModel.createBook(data)
          })
        })

        worker.on('exit', () => {
          workerQuantity--

          console.log(workerQuantity)
        })
      }
    }
  })

  ipcMain.handle(eventKeys.metruyencv.scratchToApi, async (_, payload): Promise<void> => {
    const url = `${payload.apiUrl}?limit=${payload.limit}&page=${payload.page}`

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null
    })

    const page = await browser.newPage()

    await page.setRequestInterception(true)

    page.on('request', (request) => {
      if (request.url().includes(url)) {
        request.continue()
      } else {
        request.abort()
      }
    })

    page.on('response', async (response) => {
      if (response.url().includes(url)) {
        const data = await response.json()

        workerAPI({ workerData: { bookData: data.data, payload } }).on('error', (err) => {
          console.log(err)
        })
      }
    })

    await page.goto(url, { waitUntil: 'networkidle0' })

    await browser.close()
  })
}
