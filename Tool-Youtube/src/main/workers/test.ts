import { parentPort } from 'worker_threads'
import { createBrowser } from '.'
import { loginYoutube } from './login'
import { commentYoutube } from './comment'

const port = parentPort
if (!port) throw new Error('IllegalState')

const testWorker = async (): Promise<void> => {
  const { browser, page } = await createBrowser()

  const resultLogin = await loginYoutube(page)

  if (!resultLogin) await browser.close()

  await commentYoutube(page)
}

testWorker()
