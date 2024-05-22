export {}
declare global {
  type Toast = {
    status: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
    locate_key: string
    message?: string
  }

  type DateType = string | null | Date
  type DateRangeType = {
    startDate: DateType
    endDate: DateType
  }
  type DateValueType = DateRangeType | null

  type IWindowSize = {
    height: number
    width: number
  }
}
