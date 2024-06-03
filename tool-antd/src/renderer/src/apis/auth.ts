export const Auth = {
  isAuth: async (): Promise<boolean> => {
    return await window.api.auth.isAuth()
  },
  login: async (payload: ILoginNew): Promise<boolean> => {
    return await window.api.auth.login(payload)
  },
  logout: async (): Promise<boolean> => {
    return await window.api.auth.logout()
  }
}
