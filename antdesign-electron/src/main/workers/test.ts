import { parentPort, workerData } from 'worker_threads'
import { createBrowser } from '.'

const port = parentPort

if (!port) throw new Error('IllegalState')

const testWorker = async (): Promise<void> => {
  const { browser, page } = await createBrowser()

  try {
    port.postMessage(workerData)

    await page.goto('https://www.youtube.com/', {
      waitUntil: ['networkidle2']
    })
  } catch (error) {
    port.postMessage(error)
  } finally {
    browser.close()
  }
}

testWorker()
