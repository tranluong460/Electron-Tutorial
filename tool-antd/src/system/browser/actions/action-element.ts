import { ElementHandle, Page, Browser, FileChooser } from 'puppeteer-core'
import { getElementsBySelector, waitElementExistScreen } from './element'
import { delay } from '../../utils'
import { evaluateWithParams } from './evaluate'

/**
 * will click element have index selector in list selectors
 * @param page the puppeteer page
 * @param options {object}:{
 * selector {string} get list selectors
 * index {number} index selector of element need to click
 * timeout {number} 0 to disable timeout
 * }
 */
export const clickForSelector = async (
  page: Page,
  options: {
    selector: string
    index: number
    timeout: number
  }
): Promise<boolean> => {
  const { selector, index, timeout } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    await elements?.click()
  } catch {
    return false
  }
  return true
}
/**
 * will click element have index selector in list selectors
 * @param page the puppeteer page
 * @param options {object}:{
 * selector {string} get list selectors
 * index {number} index selector of element need to click
 * timeout {number} 0 to disable timeout
 * }
 */
export const tapForXpath = async (
  page: Page,
  options: {
    xpath: string
    index: number
    timeout: number
  }
): Promise<boolean> => {
  const { xpath, index, timeout } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const elements = await page.$x(xpath)
      if (elements) {
        await (elements as ElementHandle<Element>[])[index].tap()
        return true
      }
    } catch {
      return false
    }
    await delay(1000)
  }
  return false
}

export const findElementsByTextWaitTap = async (
  page: Page,
  options: {
    xpathText: string
    index: number
    timeout: number
    caseSensitive: boolean
  }
): Promise<boolean> => {
  const { xpathText, index, timeout, caseSensitive } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const regex = new RegExp(xpathText, caseSensitive ? 'g' : 'gi')
      const matchingElements = await page.$x(`//*[contains(text(), "${xpathText}")]`)
      if (matchingElements) {
        const filteredElements = await Promise.all(
          matchingElements.map(async (element) => {
            const elementText = await element.evaluate((el) => el.textContent)
            if (elementText?.match(regex)) {
              return element
            }
            return
          })
        )
        await (filteredElements as ElementHandle<Element>[])[index].tap()
        return true
      }
    } catch {
      return false
    }
    await delay(1000)
  }
  return false
}
/**
 * will click element have index selector in list selectors
 * @param page the puppeteer page
 * @param options {object}:{
 * selector {string} get list selectors
 * index {number} index selector of element need to click
 * timeout {number} 0 to disable timeout
 * }
 */
export const tapForSelector = async (
  page: Page,
  options: {
    selector: string
    index: number
    timeout: number
  }
): Promise<boolean> => {
  const { selector, index, timeout } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    await elements?.tap()
  } catch {
    return false
  }
  return true
}

/**
 * will type text in element have index selector in list selectors
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string} to get list selectors
 *   index {number} index selector of element need to type
 *   text {string} text need to type in element
 *   timeout {number} 0 to disable timeout
 *   clearTextBefore {boolean} set to true if you want to clear the text box before (manual clear)
 * }
 */
export const typeTextToSelector = async (
  page: Page,
  options: {
    selector: string
    index: number
    text: string
    timeout: number
    shouldClearText: boolean
  }
): Promise<boolean> => {
  const { selector, index, text, timeout, shouldClearText } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })

    if (shouldClearText) {
      await elements?.focus()
      await page.keyboard.down('Control')
      await page.keyboard.press('A')
      await page.keyboard.up('Control')
      await page.keyboard.press('Backspace')
    }
    await elements?.type(text, { delay: 39 })
  } catch {
    return false
  }
  return true
}
/**
 * will scroll page window
 * @param page the puppeteer page
 * @param scrollValue {number} distance need to scroll
 */
export const scrollWindow = async (page: Page, scrollValue: number): Promise<boolean> => {
  try {
    const fn = `(scroll) =>
      window.scroll({
        top: window.scrollY + scroll,
        behavior: 'smooth',
      })`
    await evaluateWithParams(page, fn, [scrollValue])
  } catch {
    return false
  }
  return true
}
/**
 * scroll with behavior smooth
 * @param page the puppeteer page
 * @param distance {number} distance need to scroll
 */
export const scrollSmooth = async (page: Page, distance: number): Promise<boolean> => {
  try {
    const fn = `(top) =>
      window.scroll({
        top,
        behavior: 'smooth',
      })`
    await evaluateWithParams(page, fn, [distance])
    return true
  } catch {
    return false
  }
}

/**
 * click element use querySelectorAll to get list elements
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string} to get list elements
 *   timeout {number} 0 to disable timeout
 *   index {number} index element need to click
 * }
 */
export const evaluateClickSelector = async (
  page: Page,
  options: {
    selector: string
    timeout: number
    index: number
  }
): Promise<boolean> => {
  const { selector, timeout, index } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const fn = `(selectorTarget, indexElement) => {
        const elementTarget = document.querySelectorAll(selectorTarget);
        if (elementTarget.length > indexElement) {
          elementTarget[indexElement].click();
          return true;
        }
        return false;
      }`

      const result = await evaluateWithParams<boolean>(page, fn, [selector, index])
      if (result) return true
    } catch {
      return false
    }
    await delay(1000)
  }
  return false
}
/**
 * will scroll to element
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string} to get list elements
 *   scrollTime {number} number scroll
 *   scrollValue {number} distance need to scroll
 *   index {number} index element in list elements
 * }
 */
export const scrollToElement = async (
  page: Page,
  options: {
    selector: string | ElementHandle<Element>
    scrollTime: number
    scrollValue: number
    index: number
  }
): Promise<boolean> => {
  const { selector, scrollTime, scrollValue, index } = options
  const timeout = 1000
  try {
    for (let i = 0; i < scrollTime; i++) {
      await scrollWindow(page, scrollValue)
      if (
        (await waitElementExistScreen(page, {
          selector,
          timeout,
          index
        })) === 1
      )
        return true
      await delay(1000)
    }
    const fn = `(selectorTarget, indexElement) => {
      const elements =
        document.querySelectorAll(selectorTarget)[indexElement];
      if (elements)
        elements.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }`

    await evaluateWithParams(page, fn, [selector, index])
    return true
  } catch {
    return false
  }
}

/**
 * Will clear text from selector
 *
 * @param page the current page
 * @param selector {string} the selector to write upon. For example: input[id="username"]
 */
export const clearText = async (page: Page, selector: string): Promise<void> => {
  const input = await page.$(selector)
  await input?.click()
  await page.keyboard.press('Backspace')
}

/**
 * will upload file
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string}to get list elements
 *   path {string} file path
 *   timeout {number} 0 to disable timeout
 *   index {number} index element in list elements need to upload file
 * }
 */
export const uploadFile = async (
  page: Page,
  options: {
    selector: string
    path: string
    timeout: number
    index: number
  }
): Promise<boolean> => {
  const { selector, path, timeout, index } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    if (elements) {
      await (elements as ElementHandle<HTMLInputElement>).uploadFile(path)
      return true
    }
  } catch {
    return false
  }
  return false
}
/**
 * will upload file by Accept method
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string}to get list elements
 *   path {string} file path
 *   timeout {number} 0 to disable timeout
 *   index {number} index element in list elements need to upload file
 * }
 */
/**
 * will upload file by Accept method
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string}to get list elements
 *   path {string} file path
 *   timeout {number} 0 to disable timeout
 *   index {number} index element in list elements need to upload file
 * }
 */
export const waitForFileChooser = async (page: Page): Promise<FileChooser | undefined> => {
  try {
    return await page.waitForFileChooser({ timeout: 10000 })
  } catch (e) {
    return undefined
  }
}
export const uploadFileByAccept = async (
  page: Page,
  options: {
    element: ElementHandle<Element>
    path: string
  }
): Promise<boolean> => {
  try {
    const [fileChooser] = await Promise.all([waitForFileChooser(page), options.element.tap()])
    await fileChooser?.accept([options.path])
    return true
  } catch (e) {
    return false
  }
}
/**
 *
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string} to get list elements
 *   value {number} value need to get in tag
 *   timeout {number} 0 to disable timeout
 *   index {number} index element in list elements
 * }
 */
export const selectOption = async (
  page: Page,
  options: {
    selector: string
    value: string
    timeout: number
    index: number
  }
): Promise<boolean> => {
  const { selector, value, timeout, index } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    if (elements != null) {
      await elements.select(value)
      return true
    }
  } catch {
    return false
  }
  return false
}
/**
 * Will close the browser
 */
export const close = async (browser: Browser): Promise<boolean> => {
  try {
    await browser.close()
    return true
  } catch {
    return false
  }
}
