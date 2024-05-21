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
}
