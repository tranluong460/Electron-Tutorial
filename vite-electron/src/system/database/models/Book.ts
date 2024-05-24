import { bookQB } from '../data-source'
import { Book } from '../entities'

export const BookModel = {
  createBook: async (payload: IDataChapter): Promise<void> => {
    await bookQB().insert().into(Book).values(payload).execute()
  },
  findBookByIndexChapter: async (indexChapter: number): Promise<Book[]> => {
    return await bookQB().select().where('indexChapter = :indexChapter', { indexChapter }).execute()
  }
}
