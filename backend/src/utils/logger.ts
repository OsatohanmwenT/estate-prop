import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      return stack ? `${logMessage}\n${stack}` : logMessage;
    })
  ),
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? winston.format.json()
          : winston.format.simple(),
    }),
  ],
});
