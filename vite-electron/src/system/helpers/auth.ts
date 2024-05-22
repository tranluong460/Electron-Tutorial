import { User } from '@system/database/entities'
import { createHmac } from 'node:crypto'
import { AUTH_INFO_FILE, KEY_SHA256, MASP } from './constant'

const makeLicense = (his: string, userId: string | number): string => {
  return `${MASP}.${his}.${userId}`
}

const hashCodeProduct = (license: string | undefined): string => {
  const msg = `${MASP}.${license}`
  return createHmac('sha256', KEY_SHA256).update(msg).digest('hex').toUpperCase()
}

const getAuthInfo = (): User | undefined => {
  try {
    const user = require(AUTH_INFO_FILE) as unknown as User
    return user
  } catch (error) {
    //
  }
  return undefined
}

export { getAuthInfo, hashCodeProduct, makeLicense }
