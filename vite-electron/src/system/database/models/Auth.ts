import { MASP, hashCodeProduct, makeLicense, osHelper } from '@system/helpers'
import { HttpsAuth } from '@system/https'
import { logger } from '@system/utils'
import { userQB } from '../data-source'
import { User, localUser } from '../entities'

export const AuthModel = {
  login: async (payload: Pick<ILoginNew, 'username' | 'password'>): Promise<boolean> => {
    const his = await osHelper()
    try {
      const { userId } = await HttpsAuth.getUserId(payload.username)
      const hash = hashCodeProduct(makeLicense(his, userId))
      const payloadLogin: ILoginNew = {
        ...payload,
        his,
        masp: MASP,
        hash
      }
      const auth = await HttpsAuth.login(payloadLogin)
      if (auth.refreshToken && auth.refreshToken.value) {
        const existUser = await localUser()
        const expiresAt = new Date(Date.now() + auth.accessToken.expiresIn)
        if (existUser?.id) {
          await userQB()
            .where('id = :id', { id: existUser.id })
            .update()
            .set({
              email: payload.username,
              password: payload.password,
              apiToken: auth.accessToken.value,
              refeshToken: auth.refreshToken.value,
              expiresAt,
              // userId_new: auth.userId,
              his: his,
              hash,
              remainingDay: auth.remainingDay,
              isVinhVien: auth.isVinhVien,
              expiresAccessIn: auth.accessToken.expiresIn
            })
            .execute()
        } else {
          await userQB()
            .insert()
            .into(User)
            .values({
              email: payload.username,
              password: payload.password,
              apiToken: auth.accessToken.value,
              refeshToken: auth.refreshToken.value,
              expiresAt,
              // userId_new: auth.userId,
              his: his,
              hash,
              remainingDay: auth.remainingDay,
              isVinhVien: auth.isVinhVien
            })
            .execute()
        }
        const newUser = await localUser()
        const infoUser = await HttpsAuth.getInfo(newUser.apiToken!)
        await User.update(
          { id: newUser.id },
          {
            name: infoUser.fullName
          }
        )
        return true
      }
    } catch (error) {
      logger.error(`error: ${error}`)
    }
    return false
  },

  verifyToken: async (): Promise<boolean> => {
    const user = await localUser()
    try {
      const token = await HttpsAuth.verifyToken(user.his!)
      user.apiToken = token.accessToken.value
      await user.save()
      return true
    } catch (error) {
      logger.error('AuthModel.verifyToken : ' + error + '')
      user.apiToken = null
      user.refeshToken = null
      await user.save()
      return false
    }
  },

  logout: async (): Promise<void> => {
    // await logout()
    const existingUser = await localUser()
    if (existingUser?.id) {
      await userQB()
        .where('id = :id', { id: existingUser.id })
        .update()
        .set({ apiToken: null })
        .execute()
    }
  }
}
