export {}

declare global {
  type ILoginNew = {
    username: string
    password: string
    his?: string
  }
  interface IDataExcelYoutube {
    [key: string]: CellValue
  }
  interface ISeedingNew {
    stream: number
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
