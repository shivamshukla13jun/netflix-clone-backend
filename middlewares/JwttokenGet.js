const jwt=require('jsonwebtoken')
const SessionByPassModel=require('.././models/SessionByPassModel')
const SessionEnemyByPassModel=require('.././models/SessionEnemyByPassModel')
const SecretKeyModel=require('.././models/SecretKeyModels');
const { errorHandler } = require('../utils/errorHandler');
function logJwtSign(req, res, next) {
  const ip="dsdsaasf"
 // Override the jwt.sign() method to log the secret key and payload
 const originalSign = jwt.sign;
 jwt.sign =  function (payload, secretOrPrivateKey, options, callback) {
     console.log('JWT Secret Key:', secretOrPrivateKey);
     console.log('JWT Payload:', payload);
     console.log('JWT Options:', options);
     options.ip = ip;
     // Call the original sign method to generate the access token
     const accessToken =  originalSign.call(this, payload, secretOrPrivateKey, options, callback);
    
     //End  Save all Jwt Token data in database
     // return jwttoken
     return   accessToken;
 };
 next();
  }
  function logJwtVerify(req, res, next) {
  try {

    const ip = req.ip;
    // Override the jwt.verify() method to log the secret key and payload
    const originalVerify = jwt.verify;
    jwt.verify = function (accessToken, secretOrPublicKey, options, callback) {
      console.log('JWT Access Token:', accessToken);
      console.log('JWT Secret Key:', secretOrPublicKey);
      console.log('JWT Options:', options);
      // Call the original verify method to check the validity of the access token
      const decodedToken = originalVerify.call(this, accessToken, secretOrPublicKey, options, callback);
      const StoreinDatabase=async()=>{
        const existingMessage = await SessionByPassModel.findOne({ip});
        console.log({existingMessage})
        existingMessage? await SessionEnemyByPassModel.create({message:"Available"}):SessionEnemyByPassModel.create({message:"Not Available"});
      }
      StoreinDatabase()
      return decodedToken;
    };
  } catch (error) {
    console.log(error)
     return errorHandler(res)
  }
    next();
  }
// Global object to store active sessions

function detectSessionBypassing(req, res, next) {
  const ip = req.ip;

  // Log all user activity, including login attempts, successful logins, and logouts
  function logUserActivity() {
    console.log(`[${new Date()}] User activity from IP ${ip}:`, req.method, req.url);
  }
  logUserActivity();

  // Monitor the number of active sessions for each user
  function monitorActiveSessions() {
    const sessionId = req.sessionID;
    function monitorActiveSessions() {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const decodedToken = jwt.decode(token);
        console.log({decodedToken:decodedToken.options})
      
        if (decodedToken && decodedToken.activeSessions) {
          const numActiveSessions = decodedToken.activeSessions;
          console.log(numActiveSessions)
          if (numActiveSessions > 1) {
            console.warn(`Token ${token} has ${numActiveSessions} active sessions`);
          }
          // const updatedToken = jwt.sign(
          //   { ...decodedToken, activeSessions: numActiveSessions + 1 },
          //   process.env.JWT_SECRET,
          //   { expiresIn: '1h' }
          // );
          // res.set('Authorization', `Bearer ${updatedToken}`);
        } 
      }
    }
    monitorActiveSessions()
    // if (sessionId) {
    //   if (activeSessions[sessionId]) {
    //     console.warn(`Session ${sessionId} has ${activeSessions[sessionId]} active sessions`);
    //     activeSessions[sessionId]++;
    //     console.log(activeSessions)
    //   } else {
    //     activeSessions[sessionId] = 1;
    //     console.log(activeSessions)
    //   }
    // }
  }
  monitorActiveSessions();

  // Use logs analysis tools or SIEM systems to monitor the app for any unusual activity
  function monitorLogs() {
    const suspiciousActivity = [
      { method: 'POST', path: '/login', message: 'Repeated login attempts from the same IP address' },
      { method: 'GET', path: '/admin', message: 'Unauthorized access attempt to /admin' }
    ];
    const isSuspicious = suspiciousActivity.some(activity => {
      return activity.method === req.method && activity.path === req.url;
    });
    if (isSuspicious) {
      console.warn(`[${new Date()}] Suspicious activity from IP ${ip}:`, req.method, req.url);
    }
  }
  monitorLogs();

  next();
}

  
  module.exports={logJwtSign,logJwtVerify,detectSessionBypassing}