import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  indexChapter: number

  @Column('nvarchar')
  name: string

  @Column('nvarchar')
  title: string

  @Column('nvarchar')
  chapterDetail: string
}
