import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
}
