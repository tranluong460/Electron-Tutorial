import { DB_FILE } from '@system/helpers'
import 'reflect-metadata'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Book, Demo, User } from './entities'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: DB_FILE,
  synchronize: true,
  logging: false,
  entities: [User, Demo, Book],
  migrations: [],
  subscribers: []
})

export const userRepo = (): Repository<User> => AppDataSource.getRepository(User)
export const userQB = (): SelectQueryBuilder<User> => userRepo().createQueryBuilder()

export const demoRepo = (): Repository<Demo> => AppDataSource.getRepository(Demo)
export const demoQB = (): SelectQueryBuilder<Demo> => demoRepo().createQueryBuilder()

export const bookRepo = (): Repository<Book> => AppDataSource.getRepository(Book)
export const bookQB = (): SelectQueryBuilder<Book> => bookRepo().createQueryBuilder()
