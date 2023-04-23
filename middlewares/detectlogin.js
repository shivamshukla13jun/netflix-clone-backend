const fs=require('fs')
const path=require('path')
const loginFunctionName = ['login,loginuser signinuser authenticateuser validateuser authorizeuser checkcredentials loginhandler userauthenticator accesscontrol authenticatelogin processlogin validatecredentials logincontroller loginservice loginmanager usersessionmanager usersessionhandler sessionmanager sessionhandler userloginhandler']; // Change this to the name of your login function

const statusCodesToFind = [403, 502, 503]; // Change this to the status codes you want to search for
const middlewarespath=path.join(process.cwd(),'/securitytool/middlewares/Security.js')
const findStatusCodesInLoginFunction = (dirPath) => {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  files.forEach((file) => {
    const filePath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
        if (filePath.includes('node_modules')) {
            return;
          }
      findStatusCodesInLoginFunction(filePath);
    } else if (filePath !== __filename && filePath !== middlewarespath ) {
      const fileContents = fs.readFileSync(filePath, 'utf8').toLowerCase()
      console.log(fileContents)
      if (fileContents.includes(loginFunctionName)) {
        let isInfected = false;
        for (let statusCode of statusCodesToFind) {
          if (fileContents.matchAll(statusCode)) {
            isInfected = true;
            console.log(`Status code ${statusCode} found in login function in file ${filePath}`);
          }
        }
        if (!isInfected) {
          console.log(`No matching status codes found in login function in file ${filePath}`);
        }
        
      }
    }
  });
};
module.exports={findStatusCodesInLoginFunction}