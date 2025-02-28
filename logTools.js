const path = require("path");
const fs = require("fs");

const logPath = path.join(__dirname, "logs");
console.log("Log path:", logPath);

const logFile = path.join(logPath, "log.txt");
console.log("Log file:", logFile);

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "");
}

export const writeLog = (log, logLevel) => {
  const logLine = `[${new Date().toLocaleString()}] ${logLevel}: ${log}\n`;
  fs.appendFileSync(logFile, logLine);
}

export const readLogs = () => {
  return fs.readFileSync(logFile, "utf-8");
}