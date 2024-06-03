import { AccountYoutube } from './../entities'
import { accountYoutubeQB, accountYoutubeRepo } from '../data-source'

export const AccountYoutubeModel = {
  getAllAccount: async (): Promise<AccountYoutube[]> => {
    return await accountYoutubeQB().getMany()
  },
  createNewDataExcel: async (payload: IDataExcelYoutube): Promise<boolean> => {
    try {
      await accountYoutubeRepo().upsert(payload, { conflictPaths: ['email'] })

      return true
    } catch (error) {
      console.log('account youtube modal - create new data excel', error)
    }

    return false
  }
}
