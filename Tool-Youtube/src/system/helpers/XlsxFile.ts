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

  async readFile(sheetName: string): Promise<CellValue[][] | undefined> {
    const dataFile = await XlsxFile.wb.xlsx.readFile(this.path)

    if (!dataFile) return

    const ws = dataFile.getWorksheet(sheetName)

    if (!ws) return

    const data: CellValue[][] = []

    for (let i = 1; i <= ws.columnCount; i++) {
      const columnData: CellValue[] = []
      const column = ws.getColumn(i)

      column.eachCell((cell) => {
        columnData.push(cell.value)
      })

      data.push(columnData)
    }

    return data
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
