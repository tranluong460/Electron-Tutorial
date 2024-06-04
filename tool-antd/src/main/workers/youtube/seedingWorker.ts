import { Page } from 'puppeteer'
import { parentPort, workerData } from 'worker_threads'

const port = parentPort
if (!port) throw new Error('IllegalState')

// cspell: disable
const selectors = {
  placeholderArea: '#placeholder-area',
  commentInput: '#creation-box #contenteditable-root',
  submitButton: '#submit-button',
  likeButton: '.YtLikeButtonViewModelHost button',
  dislikeButton: '.YtDislikeButtonViewModelHost button',
  subscribeButton: '#subscribe-button-shape button'
}
// cspell: enable

export const seedingWorker = async (page: Page): Promise<boolean> => {
  await page.goto(workerData.link, { waitUntil: 'networkidle0' })

  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let scrollTop = -1
        const interval = setInterval(() => {
          window.scrollBy(0, 100)
          if (document.documentElement.scrollTop !== scrollTop) {
            scrollTop = document.documentElement.scrollTop
            return
          }
          clearInterval(interval)
          resolve()
        }, 10)
      })
  )

  if (workerData.actions.includes('like')) {
    await page.waitForSelector(selectors.likeButton)
    await page.click(selectors.likeButton)
  }

  if (workerData.actions.includes('dislike')) {
    await page.waitForSelector(selectors.dislikeButton)
    await page.click(selectors.dislikeButton)
  }

  if (workerData.actions.includes('subscribe')) {
    await page.waitForSelector(selectors.subscribeButton)
    await page.click(selectors.subscribeButton)
  }

  await page.waitForSelector(selectors.placeholderArea)
  await page.click(selectors.placeholderArea)
  await page.waitForSelector(selectors.commentInput)
  await page.type(selectors.commentInput, workerData.comment, { delay: 120 })
  await page.waitForSelector(selectors.submitButton)
  await page.click(selectors.submitButton)

  return true
}
