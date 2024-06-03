import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class AccountYoutube extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('nvarchar', { unique: true })
  email: string

  @Column('nvarchar')
  password: string

  @Column('nvarchar')
  phone: string
}
