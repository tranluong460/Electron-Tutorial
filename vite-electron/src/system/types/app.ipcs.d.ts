export {}
declare global {
  interface IpcRendererAuth {
    getHis(): Promise<string>
    login(payload: ILoginFormNew): Promise<boolean>
    logout(): Promise<void>
    verifyToken(): Promise<boolean>
    getUser(): Promise<User>
    acceptTerm(payload: boolean): Promise<boolean>
  }
  interface IpcRendererDemo {
    createNewDemo(payload: IDemoNew): Promise<Demo>
    getAllDemosBase(): Promise<Demo[]>
    deleteOneDemo(id: number): Promise<void>
    updateOneDemo(payload: IDemoNew): Promise<Demo>
  }
  interface IpcRendererExcel {
    exportOneFileExcel(payload: Demo): Promise<void>
    exportOneFileJson(payload: Demo): Promise<void>
    importOneTxt(): Promise<void>
  }
}
