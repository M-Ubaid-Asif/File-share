import winston, { format } from "winston";

const { printf, combine, timestamp } = format;
// const timestamp = () => {
//   return `${new Date().toISOString()}`;
// };

const logFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);
const logger = winston.createLogger({
  level: "debug",
  format: combine(timestamp(), format.colorize(), logFormat),

  // prettier-ignore
  transports: [ new winston.transports.Console()],
});

export default logger;
