import { AccountYoutube } from '@system/database/entities'

export {}

declare global {
  interface IpcRendererAuth {
    isAuth(): Promise<boolean>
    login(payload: ILoginNew): Promise<boolean>
    logout(): Promise<boolean>
  }
  interface IpcRendererYoutube {
    getAllAccount(): Promise<AccountYoutube[]>
    importExcel(): Promise<IDataExcelYoutube[]>
    createNewDataExcel(payload: IDataExcelYoutube[] | AccountYoutube): Promise<boolean>
    seedingVideo(payload: ISeedingNew): Promise<boolean>
    deleteAccount(payload: string[]): Promise<boolean>
    editAccount(payload: AccountYoutube): Promise<boolean>
  }
}
