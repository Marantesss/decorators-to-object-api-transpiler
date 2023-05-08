import { createLogger, addColors, Logger, format, transports } from 'winston'
const { combine, timestamp, prettyPrint, colorize, printf } = format

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'magenta',
    info: 'green',
    verbose: 'cyan',
    silly: 'grey',
  },
}

const formatTimestamp = (timestamp: any) => new Date(timestamp).toLocaleDateString(undefined, {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const myFormat = printf(({ level, message, timestamp }) => {
  return `${formatTimestamp(timestamp)} [${level}]: ${message}`
})

const consoleFormat = combine( 
  timestamp(),
  prettyPrint(),
  colorize({ all: true }),
  myFormat,
)

addColors(config.colors)
export const logger: Logger = createLogger({
  levels: config.levels,
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
  ],
})