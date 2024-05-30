import { Page } from 'puppeteer'
import { delay } from '.'

// cspell: disable
const selectors = {
  placeholderArea: '#placeholder-area',
  commentInput: '#creation-box #contenteditable-root',
  submitButton: '#submit-button'
}
// cspell: enable

export const commentYoutube = async (page: Page): Promise<boolean> => {
  try {
    await page.goto('https://www.youtube.com/watch?v=GY_tGI76CrU&t=1s', {
      waitUntil: 'networkidle0'
    })

    for (let i = 0; i < 5; i++) {
      await delay(1000)

      await page.mouse.wheel({ deltaY: 100 })
    }

    await page.waitForSelector(selectors.placeholderArea)
    await page.click(selectors.placeholderArea)
    await page.waitForSelector(selectors.commentInput)
    await page.type(
      selectors.commentInput,
      'Xem lại lần 2 và muốn nói với những bạn đang có ý định xem là phim cực hay',
      { delay: 120 }
    )
    await page.waitForSelector(selectors.submitButton)
    await page.click(selectors.submitButton)

    return true
  } catch (error) {
    return false
  }
}
