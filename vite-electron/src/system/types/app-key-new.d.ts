export {}
declare global {
  type ILoginNew = {
    username: string
    password: string
    masp: string
    his: string
    hash: string
    remember?: boolean
  }
  type IDataChapter = {
    indexChapter: number | undefined
    name: string | undefined
    title: string | undefined
    chapterDetail: string | undefined
  }
  type IScratch = {
    bookUrl: string
    fileExtension: string
    firstChapter: string
    lastChapter: string
  }
  type IScratchApi = {
    apiUrl: string
    fileExtension: string
    limit: number
    page: number
  }
  type IDemoNew = {
    id?: number
    name: string
    password: string
  }
  type IRegisterNew = {
    email: string
    password: string
    passwordConfirm: string
    firstName: string
    lastName: string
    phoneNumber: string
    code?: string | null
  }
  // type IRegisterFormNew = Omit<IRegisterNew, 'masp'>
  type ILoginFormNew = Pick<ILoginNew, 'username' | 'password' | 'remember'>
  type IFileSerice = {
    name: string
    path: string
    size: number
    mimetype: string
  }
  interface IUser {
    id: string
    firstName: string
    lastName: string
    username: string
    phoneNumber: string
    avatar: IFileSerice
    dob: Date
    email: string
    lastLogin: null
    status: false
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    fullName: string
  }
  interface IChangeLogsProduct {
    id: string
    description: string
    version: string
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }
  interface IProductNew {
    id: string
    name: string
    slug: string
    prefixKey: string
    description: string
    status: boolean
    version: string
    download: string
    url: string
    image: IFileSerice | null
    icon: IFileSerice | null
    onClient: boolean
    slogan: string
    urlDetail: string
    urlDoc: string
    urlInstallationGuide: string
    platform: string
    promotionAnnouncement: string | null
    tech: 'node' | 'csharp'
    urlDocAlias: string | null
    planSubscriptions: Array<IPlanSubscription> | null
    productChangeLogs: Array<IChangeLogsProduct> | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }
  interface IPlanSubscription {
    id: string
    tag: string
    price: number
    name: string
    online: boolean
    license: string
    token: string | null
    his: string
    onlineAt: Date | null
    version: string | null
    currency: string
    trialPeriod: number
    trialInterval: string
    gracePeriod: number
    graceInterval: string
    invoicePeriod: number
    invoiceInterval: string
    tier: number
    trialEndsAt: null
    startsAt: Date | null
    endsAt: Date | null
    cancelsAt: Date | null
    canceledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    isFree: boolean
    isActive: boolean
    isOnTrial: boolean
    isCanceled: boolean
    isVinhVien: boolean
    remaingDay: number
  }
  interface ISupporter {
    id: string
    managerId: string | null
    code: string
    departmentId: string | null
    teamId: string | null
    status: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    user: IUser | null
    tag: ITag | null
  }
  interface ITag {
    id: string
    name: string
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }
  interface IResponse<T> {
    items: Array<T>
    limit: number
    page: number
    count: number
    totalPage: number
  }

  interface IResponseLogin {
    accessToken: {
      value: string
      expiresIn: number
      type: 'Bearer'
    }
    refreshToken: {
      value: string
      expiresIn: number
      type: 'Bearer'
    }
    userId: string
    isCustomer: boolean
    isEmployee: boolean
    remainingDay?: number | null
    isVinhVien?: boolean
  }
}
