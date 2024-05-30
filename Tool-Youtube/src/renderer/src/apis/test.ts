export const Test = {
  ipcHandle: (payload: ITestNew): Promise<void> => window.api.test.ipcHandle(payload),
  openYoutube: (): Promise<void> => window.api.test.openYoutube(),
  registerGoogle: (): Promise<void> => window.api.test.registerGoogle()
}
