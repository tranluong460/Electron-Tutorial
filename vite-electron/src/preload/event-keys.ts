export const crud = (
  resource: string
): {
  create: string
  read: string
  readBy: string
  update: string
  delete: string
} => ({
  create: `${resource}:create`,
  read: `${resource}:read`,
  readBy: `${resource}:readBy`,
  update: `${resource}:update`,
  delete: `${resource}:delete`
})

const eventKeys = {
  auth: {
    get_his: 'auth:get_his',
    login: 'auth:login',
    logout: 'auth:logout',
    verify_token: 'auth:verify_token',
    register: 'auth:register',
    get_user: 'auth:get_user',
    accept_term: 'auth:accept_term'
  },
  excel: {
    exportFile: 'excel:export_excel',
    exportJson: 'json:export_json',
    importTxt: 'txt:import_txt'
  },
  metruyencv: {
    scratchToElement: 'metruyencv:scratch-to-element',
    scratchToApi: 'metruyencv:scratch-to-api'
  },
  toolYoutube: {
    increaseViews: 'tool-youtube:increase-views'
  }
}
export default eventKeys
