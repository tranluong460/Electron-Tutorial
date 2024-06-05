export const logger = {}

import * as net from 'net'

const MIN_PORT = 1024
const MAX_PORT = 65535

const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    // eslint-disable-next-line
    server.once('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false) // Cổng đang được sử dụng
      } else {
        reject(err)
      }
    })

    server.once('listening', () => {
      server.close(() => {
        resolve(true) // Cổng khả dụng
      })
    })

    server.listen(port)
  })
}

export const findAvailablePort = async (): Promise<number> => {
  for (let port = MIN_PORT; port <= MAX_PORT; port++) {
    try {
      const available = await isPortAvailable(port)
      if (available) {
        return port
      }
    } catch (error) {
      console.error(`Error checking port ${port}:`, error)
    }
  }
  throw new Error('No available ports found')
}
