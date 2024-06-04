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
    dataAccount: IDataExcel[] | IDataExcel
  }
  interface ISeedingNew {
    delay_time: number
    stream: number
    max_time_video: number
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
