import _ from 'lodash'
import util from 'util'
import child_process from 'child_process'

export const logger = {}

const exec = util.promisify(child_process.exec)

export const execProcess = async (command: string, timeout: number): Promise<string | null> => {
  return await exec(command, { timeout })
    .then(({ stdout }: { stdout: string }) => stdout)
    .catch((): null => null)
}

export const findAvailablePort = async (): Promise<number> => {
  const findPort = (): Promise<number> => {
    return new Promise<number>((resolve) => {
      const interval = setInterval(async () => {
        const port = _.random(50000, 51000)
        const portUsed = await execProcess(`netstat -ano | findstr :${port}`, 5000) // cspell: disable-line
        if (!portUsed) {
          clearInterval(interval)
          resolve(port)
        }
      }, 500)
    })
  }

  const taskResult = await Promise.any([
    findPort(),
    new Promise<number>((resolve) => setTimeout(() => resolve(-1), 10000))
  ])

  return taskResult === -1 ? 51000 : taskResult
}
