import { APP_DIR } from './../../system/helpers/constant'
import slugify from 'slugify'
import fs from 'fs'
import ExcelJS from 'exceljs'

export const downloadChapter = async (
  dataChapter: IDataChapter,
  payload: IScratch
): Promise<void> => {
  const fileName = slugify(dataChapter.title || '', { locale: 'vi', strict: true })
  const folderName = slugify(dataChapter.name || '', { locale: 'vi', strict: true })
  const urlFolder = `${APP_DIR}\\metruyencv\\${folderName}`
  const urlFileFolder = `${APP_DIR}\\metruyencv\\${folderName}\\${fileName}`

  if (!fs.existsSync(urlFolder)) {
    fs.mkdirSync(urlFolder, { recursive: true })
  }

  if (!fs.existsSync(`${urlFolder}\\${fileName}`)) {
    fs.mkdirSync(`${urlFolder}\\${fileName}`, { recursive: true })
  }

  if (payload.fileExtension === 'txt') {
    const dataTxt = `${dataChapter.indexChapter}|${dataChapter.name}|${dataChapter.title}|${dataChapter.chapterDetail}`

    fs.writeFileSync(`${urlFileFolder}\\${fileName}.${payload.fileExtension}`, dataTxt, 'utf8')
  }

  if (payload.fileExtension === 'excel') {
    const workbook = new ExcelJS.Workbook()

    workbook.creator = 'Alone'
    workbook.lastModifiedBy = ''
    workbook.created = new Date(2018, 6, 19)
    workbook.modified = new Date()
    workbook.lastPrinted = new Date(2016, 9, 27)

    const accountSheet = workbook.addWorksheet(folderName)

    accountSheet.columns = [
      { header: 'index', key: 'index' },
      { header: 'title', key: 'title' },
      { header: 'name', key: 'name' },
      { header: 'chapterDetail', key: 'chapterDetail' }
    ]

    accountSheet.addRow({
      indexChapter: dataChapter.indexChapter,
      name: dataChapter.name,
      title: dataChapter.title,
      chapterDetail: dataChapter.chapterDetail
    })

    workbook.xlsx.writeFile(`${urlFileFolder}\\${fileName}.xlsx`)
  }

  if (payload.fileExtension === 'json') {
    fs.writeFileSync(
      `${urlFileFolder}\\${fileName}.${payload.fileExtension}`,
      JSON.stringify(dataChapter),
      'utf8'
    )
  }
}
