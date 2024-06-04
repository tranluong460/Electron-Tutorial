import { categoryQB } from '../data-source'
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
  }
}
