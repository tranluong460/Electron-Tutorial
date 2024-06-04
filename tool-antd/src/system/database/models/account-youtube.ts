import { AccountYoutube } from './../entities'
import { accountYoutubeQB, accountYoutubeRepo } from '../data-source'
import { In } from 'typeorm'

export const AccountYoutubeModel = {
  getAllAccount: async (): Promise<AccountYoutube[]> => {
    return await accountYoutubeRepo().find({
      relations: {
        categoryId: true
      }
    })
  },
  getAccountById: async (payload: number[]): Promise<AccountYoutube[]> => {
    return await accountYoutubeQB()
      .where({
        id: In(payload)
      })
      .getMany()
  },
  createNewDataExcel: async (payload: IDataExcelYoutube): Promise<boolean> => {
    try {
      await accountYoutubeRepo().upsert(payload, { conflictPaths: ['email'] })

      return true
    } catch (error) {
      console.log('account youtube modal - create new data excel', error)
    }

    return false
  },
  deleteAccount: async (payload: string[]): Promise<boolean> => {
    try {
      await accountYoutubeQB()
        .delete()
        .from(AccountYoutube)
        .where('email IN(:...emails)', { emails: payload })
        .execute()

      return true
    } catch (error) {
      console.log('account youtube modal - delete account', error)
    }

    return false
  },
  editAccount: async (payload: AccountYoutube): Promise<boolean> => {
    try {
      await accountYoutubeQB().where('id = :id', { id: payload.id }).update().set(payload).execute()

      return true
    } catch (error) {
      console.log('account youtube modal - edit account', error)
    }

    return false
  }
}
