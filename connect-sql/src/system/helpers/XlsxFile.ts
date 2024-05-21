import ExcelJS, { Column, Workbook } from 'exceljs'

export default class XlsxFile {
  private static wb: Workbook
  private path: string

  private columns: Array<Partial<Column>>

  constructor(path: string) {
    this.columns = []
    this.path = path
    XlsxFile.wb = new ExcelJS.Workbook()
  }

  async readFile(): Promise<void> {
    await XlsxFile.wb.xlsx.readFile(this.path)
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
