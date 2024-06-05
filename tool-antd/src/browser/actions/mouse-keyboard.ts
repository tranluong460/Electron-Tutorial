import { getElementsBySelector } from './element'
import { Page } from 'puppeteer-core'

/**
 * will click mouse
 * @param page the puppeteer page
 * @param options {object}: {
 *   selector {string} to get list elements have element need to click
 *   timeout {number} 0 to disable timeout
 *   index {number} index element in list elements
 * }
 */

export const clickMouse = async (
	page: Page,
	options: {
		selector: string
		timeout: number
		index: number
	}
): Promise<boolean> => {
	const { selector, timeout, index } = options
	try {
		const elements = await getElementsBySelector(page, {
			selector,
			index,
			timeout
		})
		if (elements != null) {
			const boundingBox = await elements.boundingBox()
			if (boundingBox != null) {
				await page.mouse.click(
					boundingBox.x + boundingBox.width / 2,
					boundingBox.y + boundingBox.height / 2
				)
				return true
			}
		}
	} catch {
		return false
	}
	return false
}
/**
 * Will type alpha/numerical on the keyboard
 *
 * @param page the current page
 * @param text {string} the text to write
 * @param delay {number} the delay between letters
 * @param delayAfter {number} the delay after the whole type
 */
export const typeOnKeyboard = async (page: Page, text: string, delay: number): Promise<void> => {
	await page.keyboard.type(text, { delay })
}
/**
 * keyboard press enter
 * @param page the puppeteer page
 */
export const keyboardPressEnter = async (page: Page): Promise<void> => {
	await page.keyboard.press('Enter')
}
export const clickMouseByBoundingBox = async (
	page: Page,
	boundingBox: {
		x: number
		width: number
		y: number
		height: number
	}
): Promise<boolean> => {
	try {
		if (boundingBox) {
			await page.mouse.click(
				boundingBox.x + boundingBox.width / 2,
				boundingBox.y + boundingBox.height / 2
			)
			return true
		}
	} catch {
		return false
	}
	return false
}
