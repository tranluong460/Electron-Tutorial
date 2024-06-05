import type { Page } from 'puppeteer-core'

type EvaluateReturnType<T = unknown> = () => T

export const evaluate = async <T>(page: Page, fn: string): Promise<Awaited<T>> => {
  return page.evaluate<[], EvaluateReturnType<T>>(`(${fn.toString()})()`)
}

export const evaluateWithParams = <T>(
  page: Page,
  fn: string,
  params: unknown[]
): Promise<Awaited<T>> => {
  const paramsAsString = params.map((val) => JSON.stringify(val)).join()
  return page.evaluate<[], EvaluateReturnType<T>>(`(${fn.toString()})(${paramsAsString})`)
}

export const getPageProperty = async <T>(page: Page, property: string): Promise<Awaited<T>> => {
  return page.evaluate<[], EvaluateReturnType<T>>(`(() => ${property})()`)
}

export const getDocumentOuterOfPage = async (page: Page): Promise<string> => {
  return getPageProperty<string>(page, 'document.documentElement.outerHTML')
}
