import { User } from '@system/database/entities'

export const Auth = {
  getHis: async (): Promise<string> => {
    return await window.api.auth.getHis()
  },

  login: async (payload: ILoginFormNew): Promise<boolean> => {
    return await window.api.auth.login(payload)
  },

  logout: async (): Promise<void> => {
    await window.api.auth.logout()
  },

  verifyToken: async (): Promise<boolean> => {
    return await window.api.auth.verifyToken()
  },

  getUser: async (): Promise<User> => {
    return await window.api.auth.getUser()
  },

  acceptTerm: async (payload: boolean): Promise<boolean> => {
    return await window.api.auth.acceptTerm(payload)
  }
}
