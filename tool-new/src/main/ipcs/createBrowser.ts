import { connectBrowser, launchProcessBrowser } from '@system/browsers/connect'
import { parentPort } from 'worker_threads'

const port = parentPort

if (!port) throw new Error('IllegalState')

const createBrowser = async () => {
  const browserPort = await launchProcessBrowser('0:0')

  if (!browserPort) return

  const launcher = await connectBrowser(browserPort)

  if (!launcher) return

  port.postMessage(browserPort)

  await launcher.page.goto('https://www.youtube.com/watch?v=WgiXJ47Civ4')
}

createBrowser()
