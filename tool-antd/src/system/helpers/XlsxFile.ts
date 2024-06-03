import ExcelJS, { CellValue, Column, Workbook } from 'exceljs'

export default class XlsxFile {
  private static wb: Workbook
  private path: string

  private columns: Array<Partial<Column>>

  constructor(path: string) {
    this.columns = []
    this.path = path

    XlsxFile.wb = new ExcelJS.Workbook()
  }

  async readFile(sheet: string): Promise<IDataExcelYoutube[]> {
    return await XlsxFile.wb.xlsx.readFile(this.path).then((workbook) => {
      const ws = workbook.getWorksheet(sheet)

      if (!ws) return []

      const data: IDataExcelYoutube[] = []
      const columns = ['email', 'password', 'phone']
      const rowCount = ws.rowCount

      for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
        const rowData: { [key: string]: CellValue } = {}

        columns.forEach((colName, colIndex) => {
          const cellValue = ws.getCell(rowIndex, colIndex + 1).value
          rowData[colName] = cellValue
        })

        data.push(rowData)
      }

      return data
    })
  }

  setColumns(cols: Array<Partial<Column>>): void {
    this.columns = cols
  }

  append(rows): void {
    const ws = XlsxFile.wb.getWorksheet(1)

    if (!ws) return

    ws.columns = this.columns

    const lastRow = ws.lastRow

    ws.insertRows(lastRow!.number + 1, rows)

    XlsxFile.wb.xlsx.writeFile(this.path)
  }
}
