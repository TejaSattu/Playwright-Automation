import fs from 'fs';
import path from 'path';

export default async () => {
  const logsDir = path.join(process.cwd(), 'logs');

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  const istTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
  }).replace(/[/:, ]/g, '-');

  const logFilePath = path.join(
    logsDir,
    `test-execution-${istTime}.log`
  );

  fs.writeFileSync(
    logFilePath,
    '=== Test Execution Started (IST) ===\n',
    'utf8'
  );

  process.env.LOG_FILE_PATH = logFilePath;

  console.log('📄 Log file:', logFilePath);
};
