import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from './category'

@Entity()
export class AccountYoutube extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('nvarchar', { unique: true })
  email: string

  @Column('nvarchar')
  password: string

  @Column('nvarchar', { nullable: true })
  phone: string

  @Column('nvarchar', { nullable: true })
  emailRecovery: string

  @ManyToOne(() => Category, (category) => category.id, { onDelete: 'CASCADE' })
  categoryId: Category
}
