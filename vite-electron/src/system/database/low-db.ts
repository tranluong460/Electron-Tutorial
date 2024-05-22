import lodash from 'lodash'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
interface Data {
  actions: IAppConfig[]
  appSetting: IAppSetting
}
export const defaultData: Data = {
  actions: [],
  appSetting: {
    number_thread: 1,
    type_change: 'no_change',
    config_change_ip: [
      {
        type: 'no_change',
        config: undefined
      },
      {
        type: 'tm_proxy',
        config: {
          keys: '',
          thread_of_ip: 1
        }
      },
      {
        type: 'tinsoft_proxy',
        config: {
          keys: '',
          thread_of_ip: 1
        }
      },
      {
        type: 'ww_proxy',
        config: {
          keys: '',
          thread_of_ip: 1
        }
      }
    ]
  }
}
export class LowDbFactory extends Low<Data> {
  private static instance: LowDbFactory
  public chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')

  private constructor(path: string) {
    const adapter = new JSONFile<Data>(path)

    super(adapter, defaultData)
  }

  public static getInstance(path: string): LowDbFactory {
    if (!LowDbFactory.instance) {
      LowDbFactory.instance = new LowDbFactory(path)
    }
    return LowDbFactory.instance
  }

  public async readData(): Promise<this> {
    await this.read()
    return this
  }
}
