export const ToolYoutube = {
  increaseViews: async (payload: IIncreaseViewYoutube): Promise<void> => {
    return await window.api.toolYoutube.increaseViews(payload)
  }
}
