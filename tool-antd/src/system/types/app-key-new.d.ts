export {}

declare global {
  type ILoginNew = {
    username: string
    password: string
    his?: string
  }
  interface IDataExcel {
    [key: string]: CellValue
  }
  interface IDataExcelYoutube {
    type: string
    dataAccount: IDataExcel[]
  }
  interface ISeedingNew {
    stream: number
    accounts: number[]
    links: string[]
    actions: string[]
    comments: string[]
  }
  interface ICategoryNew {
    name: string
  }
  interface ISetCategoryNew {
    category: ICategory
    dataAccount: string[]
  }
}
