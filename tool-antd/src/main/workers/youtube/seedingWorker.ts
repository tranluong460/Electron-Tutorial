import { parentPort, workerData } from 'worker_threads'
import { createBrowser } from '../createBrowser'

const port = parentPort
if (!port) throw new Error('IllegalState')

const seedingWorker = async (): Promise<void> => {
  const { browser, page } = await createBrowser()

  await page.goto('https://www.youtube.com/')

  port.postMessage(workerData)

  setTimeout(() => browser.close(), 3000)
}

seedingWorker()
