import { AUTH_FILE, osHelper } from '@system/helpers'
import { User, localUser } from '../entities'
import { userQB } from '../data-source'

export const AuthModel = {
  isAuth: async (): Promise<boolean> => {
    try {
      const user = await localUser()

      if (!user.isLogin) return false

      return true
    } catch (error) {
      console.log('auth modal - isAuth', error)
    }

    return false
  },
  login: async (payload: ILoginNew): Promise<boolean> => {
    const his = await osHelper()
    const auth = require(AUTH_FILE)

    try {
      let user = await localUser()

      if (!user) {
        await userQB().insert().into(User).values(auth).execute()
        user = await localUser()
      }

      if (payload.username !== user.username || payload.password !== user.password) return false

      await userQB()
        .where('username = :username', { username: payload.username })
        .update()
        .set({
          his,
          isLogin: true
        })
        .execute()

      return true
    } catch (error) {
      console.log('auth modal - login', error)
    }

    return false
  },
  logout: async (): Promise<boolean> => {
    try {
      await userQB()
        .where('id = :id', { id: 1 })
        .update()
        .set({
          his: null,
          isLogin: false
        })
        .execute()

      return true
    } catch (error) {
      console.log('auth modal - logout', error)
    }

    return false
  }
}
