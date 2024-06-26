import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Demo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('nvarchar')
  name: string

  @Column('nvarchar')
  password: string
}
