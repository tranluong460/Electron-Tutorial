import { Page, ElementHandle } from 'puppeteer-core'
import { evaluateWithParams } from './evaluate'
import { delay } from '../../utils'

/**
 * will wait element appear
 * @param page the puppeteer page
 * @param selector {string} the selector of element to search for
 * @param timeout {number} the delay wait for selector
 */
export const waitForSelector = async (
  page: Page,
  selector: string,
  timeout: number
): Promise<boolean> => {
  try {
    await page.waitForSelector(selector, { timeout })
  } catch {
    return false
  }
  return true
}

/**
 * will wait element appear
 * @param page the puppeteer page
 * @param selector {string} the selector of element to search for
 * @param timeout {number} the delay wait for selector
 */
export const waitForXpath = async (
  page: Page,
  xpath: string,
  timeout: number
): Promise<boolean> => {
  try {
    await page.waitForXPath(xpath, { timeout })
  } catch {
    return false
  }
  return true
}
/**
 * will wait element appear
 * @param page the puppeteer page
 * @param selector {string} the selector of element to search for
 * @param timeout {number} the delay wait for selector
 */
export const elementWaitForSelector = async (
  element: ElementHandle<Element>,
  selector: string,
  timeout: number
): Promise<boolean> => {
  try {
    await element.waitForSelector(selector, { timeout })
  } catch {
    return false
  }
  return true
}
/**
 * will wait element appear
 * @param page the puppeteer page
 * @param selector {string} the selector of element to search for
 * @param timeout {number} the delay wait for selector
 */
export const waitLostForSelector = async (
  page: Page,
  selector: string,
  timeout: number
): Promise<boolean> => {
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      if (!(await waitForSelector(page, selector, 1000))) {
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
 * will wait element appear
 * @param page the puppeteer page
 * @param selector {string} the selector of element to search for
 * @param timeout {number} the delay wait for selector
 */
export const waitLostForXpath = async (
  page: Page,
  xpath: string,
  timeout: number
): Promise<boolean> => {
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      if (!(await waitForXpath(page, xpath, 1000))) {
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
 * will wait element appear
 * @param page the puppeteer page
 * @param selector {string} the selector of element to search for
 * @param timeout {number} the delay wait for selector
 */
export const elementWaitLostForSelector = async (
  element: ElementHandle<Element>,
  selector: string,
  timeout: number
): Promise<boolean> => {
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      await element.waitForSelector(selector, { timeout: 1000 })
    } catch {
      return true
    }
    await delay(1000)
  }
  return false
}
/**
 * will wait element appear
 * @param page the puppeteer page
 * @param selector {string} the selector of element to search for
 * @param timeout {number} the delay wait for selector
 */
export const waitForElement = async (
  element: ElementHandle<Element>,
  selector: string,
  timeout: number
): Promise<boolean> => {
  try {
    await element.waitForSelector(selector, { timeout })
  } catch {
    return false
  }
  return true
}
/**
 * will get element in list elements
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string} to get list elements
 *   index {number} index element need to get in list elements
 *   timeout {number} 0 to disable timeout
 * }
 */
export const getElementsBySelector = async (
  page: Page,
  options: {
    selector: string
    index: number
    timeout: number
  }
): Promise<ElementHandle<Element> | null> => {
  const { selector, index, timeout } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const elements = await page.$$(selector)
      if (elements.length > index) {
        return elements[index]
      }
    } catch {
      return null
    }
    await delay(1000)
    return null
  }
  return null
}

export const getAllElementsBySelector = async (
  page: Page,
  options: {
    selector: string
    timeout: number
  }
): Promise<ElementHandle<Element>[] | []> => {
  const { selector, timeout } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const elements = await page.$$(selector)
      await delay(1000)
      return elements
    } catch {
      return []
    }
  }
  return []
}
/**
 * will get element in list elements
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string} to get list elements
 *   index {number} index element need to get in list elements
 *   timeout {number} 0 to disable timeout
 * }
 */
export const getElementsByXpath = async (
  page: Page,
  options: {
    xpath: string
    index: number
    timeout: number
  }
): Promise<ElementHandle<Element> | null> => {
  const { xpath, index, timeout } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const elements = (await page.$x(xpath)) as ElementHandle<Element>[]
      if (elements.length > index) {
        return elements[index]
      }
    } catch {
      return null
    }
    await delay(1000)
    return null
  }
  return null
}
/**
 *
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string} to get list elements
 *   timeout {number} 0 to disable timeout
 *   index {number} index element in list elements
 * }
 */
export const waitElementExistScreen = async (
  page: Page,
  options: {
    selector: string | ElementHandle<Element>
    timeout: number
    index: number
  }
): Promise<0 | 1 | 2> => {
  const { selector, timeout, index } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }

  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const result = await evaluateWithParams<0 | 1 | 2>(
        page,
        `(selectorTarget, indexElement) => {
          const element =
            document.querySelectorAll(selectorTarget)[indexElement];
          if (
            element === undefined ||
            element?.getBoundingClientRect().top <= 0
          ) {
            return 0;
          }
          if (
            element?.getBoundingClientRect().top +
              element?.getBoundingClientRect().height >
            window.innerHeight
          ) {
            return 2;
          }
          return 1;
        }`,
        [selector, index]
      )
      if (result !== 0) {
        return result
      }
    } catch {
      return 0
    }
    await delay(1000)
  }
  return 0
}
/**
 *
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string} to get list elements
 *   timeout {number} 0 to disable timeout
 *   index {number} index element in list elements
 * }
 */
export const waitElementLostScreen = async (
  page: Page,
  options: {
    selector: string
    timeout: number
    index: number
  }
): Promise<0 | 1 | 2> => {
  const { selector, timeout, index } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }

  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const result = await evaluateWithParams<number>(
        page,
        `(selectorTarget, indexElement) => {
          const element =
            document.querySelectorAll(selectorTarget)[indexElement];
          if (
            element === undefined ||
            element?.getBoundingClientRect().top <= 0
          ) {
            return 0;
          }
          if (
            element?.getBoundingClientRect().top +
              element?.getBoundingClientRect().height >
            window.innerHeight
          ) {
            return 2;
          }
          return 1;
        }`,
        [selector, index]
      )
      if (result === 0) {
        return result
      }
    } catch {
      return 1
    }
    await delay(1000)
  }
  return 1
}
export const checkExistElements = async (
  page: Page,
  timeout: number,
  querySelectors: string[]
): Promise<number> => {
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      let num = 0

      num = await evaluateWithParams<number>(
        page,
        `(selectors) => {
          let output = 0;
          for (let i = 0; i < selectors.length; i++) {
            if (document.querySelectorAll(selectors[i]).length > 0) {
              output = i + 1;
              break;
            }
          }
          return output;
        }`,
        [querySelectors]
      )

      return num
    } catch {
      return 0
    }
  }
  return 0
}
