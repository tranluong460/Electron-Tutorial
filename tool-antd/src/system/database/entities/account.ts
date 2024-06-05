import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
}
