import 'reflect-metadata'
import { DB_FILE } from '@system/helpers'
import { AccountYoutube, User } from './entities'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: DB_FILE,
  synchronize: true,
  logging: false,
  entities: [AccountYoutube, User],
  migrations: [],
  subscribers: []
})

export const userRepo = (): Repository<User> => AppDataSource.getRepository(User)
export const userQB = (): SelectQueryBuilder<User> => userRepo().createQueryBuilder()

export const accountYoutubeRepo = (): Repository<AccountYoutube> =>
  AppDataSource.getRepository(AccountYoutube)
export const accountYoutubeQB = (): SelectQueryBuilder<AccountYoutube> =>
  accountYoutubeRepo().createQueryBuilder()
