import { accountYoutubeQB, categoryQB } from '../data-source'
import { Category } from '../entities'

export const CategoryYoutubeModel = {
  create: async (payload: ICategoryNew): Promise<boolean> => {
    try {
      await categoryQB().insert().into(Category).values(payload).execute()

      return true
    } catch (error) {
      console.log('category youtube modal - create', error)
    }

    return false
  },
  getAllCategory: async (): Promise<Category[]> => {
    return await categoryQB().getMany()
  },
  edit: async (payload: Category): Promise<boolean> => {
    try {
      await categoryQB().where('id = :id', { id: payload.id }).update().set(payload).execute()

      return true
    } catch (error) {
      console.log('category youtube modal - edit', error)
    }

    return false
  },
  delete: async (payload: number[]): Promise<boolean> => {
    try {
      await categoryQB().delete().from(Category).where('id IN(:...ids)', { ids: payload }).execute()

      return true
    } catch (error) {
      console.log('category youtube modal - delete', error)
    }

    return false
  },
  setCategory: async (payload: ISetCategoryNew): Promise<boolean> => {
    try {
      await accountYoutubeQB()
        .update()
        .set({
          categoryId: payload.category
        })
        .where('email IN (:...emails)', { emails: payload.dataAccount })
        .execute()

      return true
    } catch (error) {
      console.log('category youtube modal - set category', error)
    }

    return false
  }
}
