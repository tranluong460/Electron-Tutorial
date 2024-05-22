import { LOGGER_FILE } from '@system/helpers'
import winston, { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
export class Logger {
  private static instance: Logger | undefined
  private logger: winston.Logger

  /**
   * Create a new instance of the class.
   *
   * @private
   */
  private constructor() {
    const consoleFormat = format.printf(({ level, message, timestamp }) => {
      const colorizer = format.colorize()
      let levelStr = `[${level.toUpperCase()}]`
      levelStr = colorizer.colorize(level, levelStr)
      return `${timestamp} ${levelStr}: ${message}`
    })

    const fileFormat = format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}]-[${level.toUpperCase()}]: ${message}`
    })

    this.logger = createLogger({
      level: 'debug',
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
      transports: [
        new transports.Console({
          format: format.combine(consoleFormat)
        }),
        new DailyRotateFile({
          filename: `${LOGGER_FILE}\\%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          level: 'info',
          format: fileFormat
        })
      ]
    })
  }

  /**
   * Returns the instance of the Logger class. If the instance does not exist, it creates a new instance.
   *
   * @return {Logger} The instance of the Logger class.
   */
  public static get(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  /**
   * Logs a message at the specified log level.
   *
   * @param {string} level - The log level. Must be one of 'info', 'warn', 'error', or 'debug'.
   * @param {string} message - The message to be logged.
   * @param {Error} [error] - An optional error object to be logged.
   * @returns {void}
   */
  public log(level: 'info' | 'warn' | 'error' | 'debug', message: string, error?: Error): void {
    this.logger.log(
      level,
      `${message}${error ? ` | Error: ${error.name} - ${error.message} - ${error.stack}` : ''}`
    )
  }

  /**
   * Logs an information message.
   *
   * @param {string} message - The message to be logged.
   * @return {void} This function does not return a value.
   */
  public info(message: string): void {
    this.log('info', message)
  }

  /**
   * Warns the user with a given message.
   *
   * @param {string} message - The message to be displayed.
   * @return {void} This function does not return a value.
   */
  public warn(message: string): void {
    this.log('warn', message)
  }

  /**
   * Logs an error message along with an optional error object.
   *
   * @param {string} message - The error message to be logged.
   * @param {Error} error - An optional error object to be logged.
   * @return {void} This function does not return anything.
   */
  public error(message: string, error?: Error): void {
    this.log('error', message, error)
  }

  /**
   * Logs a debug message.
   *
   * @param {string} message - The message to be logged.
   * @return {void} This function does not return anything.
   */
  public debug(message: string): void {
    this.log('debug', message)
  }
}

export const logger = Logger.get()
