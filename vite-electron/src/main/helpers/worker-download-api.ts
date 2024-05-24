import { workerData, parentPort } from 'worker_threads'
import { downloadChapter } from './download-chapter'
import { BookModel } from '@system/database/models'
import { AppDataSource } from '@system/database/data-source'

const port = parentPort

if (!port) throw new Error('IllegalState')

workerData.bookData.map(async (data) => {
  const newData = {
    indexChapter: data.id,
    name: data.name,
    title: data.slug,
    chapterDetail: data.synopsis
  }

  await downloadChapter(newData, workerData.payload)

  AppDataSource.initialize().then(async () => {
    const book = await BookModel.findBookByIndexChapter(newData.indexChapter)

    if (book.length === 0) await BookModel.createBook(newData)
  })
})
