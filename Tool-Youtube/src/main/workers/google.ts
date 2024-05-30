import { parentPort } from 'worker_threads'
import { checkSelector, clickSelector, createBrowser, writeText } from '.'

const port = parentPort
if (!port) throw new Error('IllegalState')

const selectors = {
  lastNameInput: '#lastName',
  firstNameInput: '#firstName',
  dayInput: '#day',
  monthSelect: '#month',
  monthValue: '#month option[value="9"]',
  yearInput: '#year'
}

const googleWorker = async (): Promise<void> => {
  const { page } = await createBrowser()

  page.goto('https://accounts.google.com/signup', { waitUntil: 'networkidle0' })

  const isLastName = await checkSelector(page, selectors.lastNameInput)
  if (isLastName) {
    await writeText(page, selectors.lastNameInput, 'Trần Văn', { delay: 120 }, false)
  }
  const isFirstName = await checkSelector(page, selectors.firstNameInput)
  if (isFirstName) {
    await writeText(page, selectors.firstNameInput, 'Lương', { delay: 120 })
  }
  const isDayInput = await checkSelector(page, selectors.dayInput)
  if (isDayInput) {
    await writeText(page, selectors.dayInput, '9', { delay: 120 }, false)
  }
  const isMonthSelect = await checkSelector(page, selectors.monthSelect)
  if (isMonthSelect) {
    await clickSelector(page, selectors.monthSelect)
  }
  const isMonthValue = await checkSelector(page, selectors.monthValue)
  if (isMonthValue) {
    await clickSelector(page, selectors.monthValue)
  }
  const isYearInput = await checkSelector(page, selectors.yearInput)
  if (isYearInput) {
    await writeText(page, selectors.yearInput, '2003', { delay: 120 }, false)
  }
}

googleWorker()
