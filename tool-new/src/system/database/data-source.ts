import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { DB_FILE } from '@system/helpers'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: DB_FILE,
  synchronize: true,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: []
})
