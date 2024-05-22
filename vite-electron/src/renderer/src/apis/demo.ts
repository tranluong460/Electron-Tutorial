import { Demo } from '../../../system/database/entities'

export const DemoCrud = {
  createDemo: async (payload: IDemoNew): Promise<void> => {
    return await window.api.demo.createNewDemo(payload)
  },
  getAllDemos: async (): Promise<Demo[]> => {
    return await window.api.demo.getAllDemosBase()
  },
  deleteDemo: async (id: number): Promise<void> => {
    return await window.api.demo.deleteOneDemo(id)
  },
  updateDemo: async (payload: IDemoNew): Promise<void> => {
    return await window.api.demo.updateOneDemo(payload)
  }
}
