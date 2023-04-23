const fs = require('fs');
const path = require('path');

function logErrorsToFile(err, req, res, next) {
  const logFilePath = path.join('error.log');
  const errorDate = new Date().toISOString();
  console.error(err);
  process.on('uncaughtException', (error, source) => {
     fs.writeFile(logFilePath, `${new Date().toISOString()} - ${error.message}\n`,(err,res)=>{
        if(err) console.log(err.message)
        if
     })
    fs.writeFileSync(logFilePath, `${new Date().toISOString()} - ${error.message}\n`);
    });
  
  next(err);
}

module.exports = logErrorsToFile;
