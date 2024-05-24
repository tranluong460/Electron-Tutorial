const puppeteer = require('puppeteer')
const { workerData, parentPort } = require('worker_threads')

async function workerDownloadElement(workerData) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
  })

  const page = await browser.newPage()

  await page.goto(`${workerData.payload.bookUrl}/chuong-${workerData.iChapter}`)

  await page.waitForSelector('body > .min-h-screen.bg-auto > main > #chapter-detail > .break-words')

  const data = await page.$eval('body > .min-h-screen.bg-auto > main', (el) => ({
    indexChapter: Number(
      el
        .querySelector('.flex.justify-center.space-x-2.items-center.px-2 > div > h2')
        ?.innerHTML.split(' ')[2]
        .replace(':', '')
    ),
    name: el.querySelector('.mx-2 > h1 > a')?.innerHTML,
    title: el.querySelector('.flex.justify-center.space-x-2.items-center.px-2 > div > h2')
      ?.innerHTML,
    chapterDetail: Array.from(el.querySelectorAll('#chapter-detail > .break-words'))
      .map((e) => e?.innerHTML)
      .join('')
  }))

  await browser.close()

  return data
}

workerDownloadElement(workerData).then((data) => parentPort.postMessage(data))
