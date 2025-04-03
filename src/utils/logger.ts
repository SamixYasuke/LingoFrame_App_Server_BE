import winston, { createLogger, format, transports } from "winston";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const logger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, ...metadata }) => {
      const metaString = Object.keys(metadata).length
        ? " " + JSON.stringify(metadata)
        : "";
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`;
    })
  ),
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
    }),
    new transports.File({
      filename: "logs/app.log",
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
    }),

    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
  exitOnError: false,
});

export class Logger {
  static info(message: string, metadata?: object) {
    logger.info(message, metadata);
  }

  static warn(message: string, metadata?: object) {
    logger.warn(message, metadata);
  }

  static error(message: string, metadata?: object) {
    logger.error(message, metadata);
  }

  static debug(message: string, metadata?: object) {
    logger.debug(message, metadata);
  }
}

process.on("uncaughtException", (err) => {
  Logger.error("Uncaught Exception", { error: err.message, stack: err.stack });
});

process.on("unhandledRejection", (reason) => {
  Logger.error("Unhandled Rejection", { reason });
});
