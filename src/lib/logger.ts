import winston from "winston";
import { env } from "./utils";

const { json, combine, timestamp, errors, colorize } = winston.format;
const { File } = winston.transports;

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels: winston.config.syslog.levels,
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "DD-MM-YYYY hh:mm:ss.SSS A" }),
    errors({ stack: true }),
    json({ space: 2 })
  ),
  transports: [new File({ filename: "logs/standard.log" })],
  exceptionHandlers: [new File({ filename: "logs/exceptions.log" })],
  rejectionHandlers: [new File({ filename: "logs/rejections.log" })],
  defaultMeta: undefined,
});
