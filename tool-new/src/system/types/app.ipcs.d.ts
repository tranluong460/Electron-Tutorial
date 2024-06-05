export {}

declare global {
  interface IpcRendererYoutube {
    seedingYoutube: () => Promise<void>
  }
}
