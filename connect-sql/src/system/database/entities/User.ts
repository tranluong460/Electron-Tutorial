import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('nvarchar')
  email: string

  @Column('nvarchar')
  password: string

  @Column('nvarchar', { nullable: true })
  apiToken: string | null

  @Column('nvarchar', { nullable: true })
  refeshToken: string | null

  @Column('nvarchar', { default: 'Bearer', nullable: true })
  tokenType: string | null | 'Bearer'

  @Column('int', { nullable: true, default: 0 })
  expiresAccessIn: number

  @Column('datetime', {
    nullable: true,
    transformer: {
      from: (value: string) => value.toString(),
      to: (value: Date) => value
    }
  })
  declare expiresAt: Date

  // @Column('nvarchar', { nullable: true })
  // userId_new: string | null

  // verifyToken
  @Column('nvarchar', { nullable: true })
  name: string | null

  @Column('nvarchar', { nullable: true })
  his: string | null

  @Column('nvarchar', { nullable: true })
  hash: string | null

  @Column('int', { nullable: true })
  remainingDay: number | null

  @Column('boolean', { default: false, nullable: true })
  isVinhVien: boolean | null

  @Column('boolean', { default: false })
  isTerms: boolean
}

export const localUser = async (): Promise<User> =>
  await User.find()
    .then((users: User[]) => users[0])
    .catch(() => new User())
