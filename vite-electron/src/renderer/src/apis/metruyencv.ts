export const MetruyencvCrud = {
  scratchBookToElement: async (payload: IScratch): Promise<void> => {
    return await window.api.metruyencv.scratchBookToElement(payload)
  },
  scratchBookToApi: async (payload: IScratchApi): Promise<void> => {
    return await window.api.metruyencv.scratchBookToApi(payload)
  }
}
