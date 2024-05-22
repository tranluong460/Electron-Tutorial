import { MASP } from '@system/helpers'
import http from './axios-client'
export const HttpsAuth = {
  login: async (payload: ILoginNew): Promise<IResponseLogin> =>
    await http.post('/auth/tool/login', payload),
  getInfo: async (apiToken: string): Promise<IUser> =>
    await http.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    }),
  verifyToken: async (his: string): Promise<{ accessToken: { value: string } }> =>
    await http.post('/auth/tool/verify-token', {
      his,
      prefixKey: MASP
    }),
  register: async (payload: IRegisterNew): Promise<boolean> => {
    return await http.post('/auth/register', payload)
  },
  getUserId: async (email: string): Promise<{ userId: string }> =>
    await http.post('/auth/tool/userId', { email })
}
