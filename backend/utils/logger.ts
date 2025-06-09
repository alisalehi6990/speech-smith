import pino from "pino";
import fs from "fs";
import path from "path";

// Ensure log directory exists
const logDir = "/var/log/speechsmith";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Pretty print for dev console
const prettyStream = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    levelFirst: true,
    translateTime: "yyyy-mm-dd HH:MM:ss",
  },
});

// Write raw logs to file
const logFilePath = path.join(logDir, "app.log");
const fileStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Create a pino instance that writes to both streams
export const logger = pino(
  {
    level: process.env.LOG_LEVEL || "debug",
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  },
  pino.multistream([{ stream: prettyStream }, { stream: fileStream }])
);
