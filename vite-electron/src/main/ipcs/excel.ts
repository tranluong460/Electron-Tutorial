import { dialog, ipcMain } from 'electron'
import eventKeys from '../../preload/event-keys'
import ExcelJS from 'exceljs'
import { Demo } from '../../system/database/entities'
import { APP_DIR } from '../../system/helpers'
import fs from 'fs'
import { DemoModel } from '../../system/database/models/Demo'

export const IpcMainExcel = (): void => {
  ipcMain.handle(eventKeys.excel.exportFile, async (_, payload): Promise<void> => {
    const workbook = new ExcelJS.Workbook()

    workbook.creator = 'Alone'
    workbook.lastModifiedBy = ''
    workbook.created = new Date(2018, 6, 19)
    workbook.modified = new Date()
    workbook.lastPrinted = new Date(2016, 9, 27)

    const accountSheet = workbook.addWorksheet('Account')

    accountSheet.columns = [
      { header: 'id', key: 'id' },
      { header: 'name', key: 'name' },
      { header: 'password', key: 'password' }
    ]

    payload.map((data: Demo) =>
      accountSheet.addRow({ id: data.id, name: data.name, password: data.password })
    )

    workbook.xlsx.writeFile(`${APP_DIR}/files/Account.xlsx`).then(() => console.log('Success'))
  })

  ipcMain.handle(eventKeys.excel.exportJson, async (_, payload): Promise<void> => {
    fs.writeFileSync(`${APP_DIR}/files/Account.json`, JSON.stringify(payload))
  })

  ipcMain.handle(eventKeys.excel.importTxt, async (): Promise<void> => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'TXT', extensions: ['txt'] }]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return console.log('Error import txt!!!')
    }

    const filePath = result.filePaths[0]

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return console.log('Error read txt!!!')
      } else {
        const lines = data.split('\n')

        lines.map(async (line) => {
          const [name, password] = line.trim().split('|')

          await DemoModel.create({ name, password })
        })
      }
    })
  })
}
