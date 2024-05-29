import { Page } from 'puppeteer'

export const commentYoutube = async (page: Page): Promise<boolean> => {
  try {
    await page.goto('https://www.youtube.com/watch?v=GY_tGI76CrU&t=1s')

    return true
  } catch (error) {
    return false
  }
}
