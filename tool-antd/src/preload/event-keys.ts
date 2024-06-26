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
    importText: 'youtube:import_text',
    createNewDataExcel: 'youtube:create_new_data_excel',
    seedingVideo: 'youtube:seeding_video',
    deleteAccount: 'youtube:delete_account',
    editAccount: 'youtube:edit_account'
  },
  category: {
    create: 'category:create',
    getAll: 'category:get_all',
    edit: 'category:edit',
    delete: 'category:delete',
    setCategory: 'category:set_category'
  }
}

export { crud, eventKeys }
