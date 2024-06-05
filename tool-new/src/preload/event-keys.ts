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

const eventKeys = {}

export { crud, eventKeys }
