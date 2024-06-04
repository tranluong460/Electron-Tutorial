import { createBrowser } from '../createBrowser'
import { loginWorker } from './loginWorker'
import { seedingWorker } from './seedingWorker'

const youtubeWorker = async (): Promise<void> => {
  const { page, browser } = await createBrowser()

  const isLogin = await loginWorker(page)

  if (!isLogin) return browser.close()

  await seedingWorker(page)
}

youtubeWorker()
