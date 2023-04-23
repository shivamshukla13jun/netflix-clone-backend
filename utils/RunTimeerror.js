const util = require('util');
const path = require('path');
const {cwd} =require('process')
const fs=require('fs')
// Create a logs directory if it doesn't exist
const logDir = path.join(cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a write stream for the error log file
const errorLogStream = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });
// Listen for uncaught exceptions and log them to the error log file
const RuntimeError=()=>{
  process.on('uncaughtException', (err) => {
    const message = `Uncaught exception: ${err}\n${err.stack}`;
    console.error(message);
    const logMessage = `${new Date().toISOString()} - ERROR - ${message}\n`;
    errorLogStream.write(logMessage);
  });
}
RuntimeError()
module.exports=RuntimeError