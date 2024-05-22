import { demoQB } from '../data-source'
import { Demo } from '../entities'

export const DemoModel = {
  create: async (payload: IDemoNew): Promise<void> => {
    await demoQB().insert().into(Demo).values(payload).execute()
  },

  getAllD: async (): Promise<Demo[]> => {
    return await demoQB().getMany()
  },

  deleteOneDemo: async (id: string): Promise<void> => {
    await demoQB().delete().where('id = :id', { id }).execute()
  },

  updateOneDemo: async (payload: IDemoNew): Promise<void> => {
    await demoQB()
      .update()
      .set({
        name: payload.name,
        password: payload.password
      })
      .where('id = :id', { id: payload.id })
      .execute()
  }
}
