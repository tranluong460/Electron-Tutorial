export {}

declare global {
  interface IpcRendererTest {
    ipcHandle(payload: ITestNew): Promise<void>
    openYoutube(): Promise<void>
  }
}
