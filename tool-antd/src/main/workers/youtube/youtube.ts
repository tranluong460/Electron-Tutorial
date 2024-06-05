import { parentPort } from 'worker_threads'
import { seedingWorker } from './seedingWorker'
import { connectBrowser, launchProcessBrowser } from '..'
import { loginWorker } from './loginWorker'

const port = parentPort
if (!port) throw new Error('IllegalState')

const youtubeWorker = async (): Promise<void> => {
  const port = await launchProcessBrowser('')

  if (!port) throw new Error('No Port')

  console.log({ port })

  const launcher = await connectBrowser(port)

  if (!launcher) throw new Error('No Launcher')

  const { page, browser } = launcher

  const isLogin = await loginWorker(page)

  if (!isLogin) return launcher.browser.close()

  await seedingWorker(page, browser)
}

youtubeWorker()
