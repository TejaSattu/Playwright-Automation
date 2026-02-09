const fs = require('fs');

function getISTTimestamp() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
  });
}

function log(message) {
  const logFilePath = process.env.LOG_FILE_PATH;
  if (!logFilePath) return;

  fs.appendFileSync(
    logFilePath,
    `[${getISTTimestamp()}] ${message}\n`,
    'utf8'
  );
}

module.exports = { log };
