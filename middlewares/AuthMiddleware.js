const jwt = require("jsonwebtoken");

const { sendResponse } = require("../utils/dataHandler");
const { errorHandler } = require("../utils/errorHandler");
require('dotenv').config()
const key=process.env.PASSWORDENCRYPTIONKEY
const crypto=require('crypto-js')
const authAdminMiddleware = (req, res, next) => {
  var Authenticate=true;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    Authenticate=false;
  return sendResponse(res, 403, "missing authorization", {Authenticate})
  }
  var [authType, token] = authHeader.split(' ');
  token= crypto.AES.decrypt(token, key).toString(crypto.enc.Utf8)
 try {
  switch(authType) {
    case 'Bearer':
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          Authenticate=false;
          return sendResponse(res, 403, err.message, {Authenticate})
        } 
        console.log({user})
        if(user.isAdmin){
          Authenticate=true;
          req.user = user;
          next();
        }else{
          Authenticate=false;
          // return sendResponse(res, 403, "you are not allowed", {Authenticate})
          throw new Error("you are not allowed")
        }
      });
      break;
    case 'Basic':
      const credentials = Buffer.from(token, 'base64').toString('utf-8').split(':');
      const username = credentials[0];
      const password = credentials[1];
      // Perform basic auth validation logic here
      // ...
      // If authenticated successfully, proceed to the next middleware
      req.user = { username };
      next();
      break;

    case 'AWS':
      // Handle AWS auth here
      // ...

      // If authenticated successfully, proceed to the next middleware
      req.user = { /* user info */ };
      next();
      break;

    case 'OAuth':
      // Handle OAuth here
      // ...

      // If authenticated successfully, proceed to the next middleware
      req.user = { /* user info */ };
      next();
      break;
    default:
      Authenticate=false;
      return sendResponse(res, 403, "unknown authorization type", {Authenticate});
  }
 } catch (error) {
  console.log(error.message)
  if(error.message=="you are not allowed"){
    return sendResponse(res, 403,error.message)
  }else{
    return sendResponse(res, 500,error.message)
  }
 }
};
const authUserMiddleware = (req, res, next) => {
  var Authenticate=true;
  const authHeader = req.headers.authorization;
  console.log()
  if (!authHeader) {
    Authenticate=false;
  return sendResponse(res, 403, "missing authorization", {Authenticate})

  }
  const [authType, token] = authHeader.split(' ');
  
  switch(authType) {
    case 'Bearer':
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          Authenticate=false;
          return sendResponse(res, 403, err.message, {Authenticate})
        } 
        if(!user.isAdmin){
          Authenticate=true;
          req.user = user;
          next();
        }else{
          Authenticate=false;
          return sendResponse(res, 403, "you are not allowed", {Authenticate})
        }
      });
      break;
    case 'Basic':
      const credentials = Buffer.from(token, 'base64').toString('utf-8').split(':');
      const username = credentials[0];
      const password = credentials[1];
      // Perform basic auth validation logic here
      // ...
      // If authenticated successfully, proceed to the next middleware
      req.user = { username };
      next();
      break;

    case 'AWS':
      // Handle AWS auth here
      // ...

      // If authenticated successfully, proceed to the next middleware
      req.user = { /* user info */ };
      next();
      break;

    case 'OAuth':
      // Handle OAuth here
      // ...

      // If authenticated successfully, proceed to the next middleware
      req.user = { /* user info */ };
      next();
      break;

    default:
      Authenticate=false;
      return sendResponse(res, 403, "unknown authorization type", {Authenticate});
  }
};
module.exports = {authAdminMiddleware,authUserMiddleware};