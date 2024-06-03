const crud = (
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
    isAuth: 'auth:is_auth',
    login: 'auth:login',
    logout: 'auth:logout'
  },
  youtube: {
    getAllAccount: 'youtube:get_all_account',
    importExcel: 'youtube:import_excel',
    createNewDataExcel: 'youtube:create_new_data_excel',
    seedingVideo: 'youtube:seeding_video'
  }
}

export { crud, eventKeys }
