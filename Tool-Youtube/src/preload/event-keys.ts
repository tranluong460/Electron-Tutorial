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
  test: {
    ipcHandle: 'test:ipc_handle',
    openYoutube: 'test:open_youtube',
    registerGoogle: 'test:register_google'
  }
}

export { crud, eventKeys }
