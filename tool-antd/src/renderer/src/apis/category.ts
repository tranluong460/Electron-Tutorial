import { Category as ICategory } from '@system/database/entities'

export const Category = {
  create: async (payload: ICategoryNew): Promise<boolean> => {
    return await window.api.category.create(payload)
  },
  getAll: async (): Promise<ICategory[]> => {
    return await window.api.category.getAll()
  }
}
