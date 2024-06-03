import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('nvarchar')
  name: string

  @Column('nvarchar')
  email: string

  @Column('nvarchar')
  username: string

  @Column('nvarchar')
  password: string

  @Column('nvarchar', { default: 'His', nullable: true })
  his: string | null

  @Column('boolean', { default: false })
  isLogin: boolean
}

export const localUser = async (): Promise<User> =>
  await User.find()
    .then((users: User[]) => users[0])
    .catch(() => new User())
