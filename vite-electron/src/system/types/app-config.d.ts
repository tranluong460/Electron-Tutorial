export {}
declare global {
  type IAppConfig = {
    name: INameConfig
    config
  }
  type IAppSetting = {
    number_thread: number
    type_change: ITypeChangeProxy
    config_change_ip: [
      {
        type: 'no_change'
        config: undefined
      },
      {
        type: 'tm_proxy'
        config: IBaseConfigProxy
      },
      {
        type: 'tinsoft_proxy'
        config: IBaseConfigProxy
      },
      {
        type: 'ww_proxy'
        config: IBaseConfigProxy
      }
    ]
  }
}
