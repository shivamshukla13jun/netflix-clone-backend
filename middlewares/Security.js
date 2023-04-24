const Project_Security_Logs = require("../models/Project_Security_Logs");
const PasswordKeysModel = require("../models/PasswordKeysModel");
const DefaultUsernameModel = require("../models/MyModel");
const DefaultPasswordModel = require("../models/defaultPasswords");
const { ExpressShield } = require("./express-shield/ExpressShield");
const { errorHandler } = require("../utils/errorHandler");
const {
  CreateuserDetails,
  hasSqlInjection,
  getData,
  XSSInjection,
  sanitizeInput,
  checkForXMLInjection,
  CreateuserDetailsindatabaseonly,
  compareCookies,
  CreateBotdata,
  CreatStatusCodesDetails,
  CreateSpamdata,
  CreateCodeDetailsForLoginPage,
} = require("./functions");
const fs = require("fs");
const path = require("path");
const { default: axios } = require("axios");
const { Botlimiter, spamlimiter } = require("./rateLimiter");
const statusCodes = require("../utils/Response-codes");
const {
  BlankpasswordValidatorModel,
  App_Supp_Def_User_Pass,
} = require("../models/ValidatorModel");
const { log } = require("console");
const BotlimitRate = require("./RateLimiter/BotlimitRate");
const SpamlimitRate = require("./RateLimiter/SpamlimitRate");
const TestingMessage = async (message) => {
  return message;
};

const NosqlDetector = ExpressShield({
  errorHandler: async (shieldError, req, res, next) => {
    try {
        let message = "Malicious nosql request was detected";
        // await CreateuserDetails(req, res, message, (type = "NOSQLI"));
        return errorHandler(res,406,"nosql")
     
    } catch (error) {
      console.log(error);
      return errorHandler(res);
    }
  },
});
// End Nosql Middleware

// CheckHtmlInjection Middleware
const checkHTML = async (req, res, next) => {
  try {
    let sessionTimeout, 
    checkSessionInfinite, 
    sessionFixation;
    let validateXss=false;
    let validatehtml=false;
    let validatevpn=false;
    let containsSql = false;
    let validateCommandInput=false;
    let commandlineInjextion=false;
    let isBlankPasswordFound = false;
    let defaultUsernameMatched = false;
    let defaultPasswordMatched = false;
    const isBoat=await BotlimitRate(req)
    const isSpam=await SpamlimitRate(req)
    const existingAppSuppDefUserPass = await App_Supp_Def_User_Pass.findOne();
    const SSLVerifyMongodb = await getData;
    const isHtmlMiddlewareEnabled = SSLVerifyMongodb.checkHTMLMiddlware;
    const isXssMiddlewareEnabled = SSLVerifyMongodb.xssInjectionDetectorMiddlware;
    const isSQLMiddlware = SSLVerifyMongodb.SqlDetectorMiddlware;
    const iscommandMiddlware = SSLVerifyMongodb.commandlineinjectionMiddlware;
    const origin = req.headers.origin;
    const reqPath = req.url.toLowerCase();
    // var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      var ip='46.165.250.81'
        // get responseCode
    const Login = req.url.includes("login" || "signin") ? true : false;
    const originalJson = res.json;
    const originalSend=res.send
    const HTML = new RegExp(/<(\"[^\"]*\"|'[^']*'|[^'\">])*>/, "i");
    const CommandInputRegx = new RegExp(
      '(rm -rf)|(ls -la)|(command >/dev/sda)|(:\\(\\){ :|:& };:)|(sudo yum install)|(.conf)|(sudo mv  /dev/null)|(wget)|(-O-)|(crontab -r)|(history)|(dd if=/dev/zero of=/dev/sda)|(/dev/sda)|(/dev/sda1)|(sudo apt purge python|python2|python3.x-minimal)|(chmod -R 777 /)',
      'i'
    );
    
    const TokenPassedArea = require("../models/TokenPassedModel");
    const entries = [
      ...Object.entries(req.body),
      ...Object.entries(req.query),
      ...Object.entries(req.params),
    ];
    const authHeader = req.headers.authorization;
    let message;
    var [authType, token] = authHeader ? authHeader.split(" "): "";
   const isreqPathfile= reqPath.endsWith(".js") || reqPath.endsWith(".htaccess") || reqPath.endsWith(".json") || reqPath.endsWith(".css") || reqPath.endsWith(".html") ||
    reqPath.endsWith(".txt") || reqPath.endsWith(".md") ||reqPath.endsWith(".yml") ||reqPath.endsWith(".toml") ||reqPath === "/app.js"
    const sessionExpireTime = req.session && req.session.cookie ? req.session.cookie._expires : null;
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    const sessionDuration = sessionExpireTime ? Math.floor((sessionExpireTime.getTime() - Date.now()) / 1000) : null;
    sessionTimeout = sessionDuration !== null && sessionDuration > thirtyDaysInSeconds ? 'high' : 'low';
    checkSessionInfinite = sessionDuration === null ? 'session is Infinite' : 'session is not infinite';
    if (req.sessionID) {
      if (req.session && req.session.originalSessionID && req.sessionID !== req.session.originalSessionID) {
        console.warn('Session ID may have been fixed!');
        console.log('new Session ID', req.sessionID);
        console.log('old Session ID', req.session.originalSessionID);
        req.session.originalSessionID = req.sessionID;
        sessionFixation = 'Session ID has changed, indicating a possible session fixation attack';
      } else {
        sessionFixation = 'Session ID has not been changed,Session ID may have not been fixed';
      }
    } else {
      sessionTimeout="session not found"
      checkSessionInfinite="session not found"
      sessionFixation = 'Session not found';
    }
    CreateuserDetailsindatabaseonly(sessionTimeout, checkSessionInfinite, sessionFixation);
    // 
    // check responseCode
    res.json = async function (body) {
      var existingcode = statusCodes.filter((item) => {
        return item.code == res.statusCode;
      });
      if (existingcode.length > 0) {
        console.log(existingcode[0]);
        const code = existingcode[0].code;
        const phrase = existingcode[0].phrase;
        console.log(Login);
        Login === true ? CreateCodeDetailsForLoginPage(code, phrase) : "";
        CreatStatusCodesDetails(code, phrase);
      }
      // check if the status code is 403 Forbidden
     console.log(res.statusCode)
    //  console.log("responsedata",body)
      // call the original send method with the original body argument
     return  originalJson.call(res, body);
    };
   
    res.send = async function (body) {
      var existingcode = statusCodes.filter((item) => {
        return item.code == res.statusCode;
      });
      if (existingcode.length > 0) {
        console.log(existingcode[0]);
        const code = existingcode[0].code;
        const phrase = existingcode[0].phrase;
        // console.log(Login);
        Login === true ? CreateCodeDetailsForLoginPage(code, phrase) : "";
        CreatStatusCodesDetails(code, phrase);
      }
      // check if the status code is 403 Forbidden
    //  console.log("responsedata",body)
     console.log(res.statusCode)
      // call the original send method with the original body argument
     return  originalSend.call(res, body);
    };
    // end response code
     // checkJwttoken
     switch (authType) {
      case !authHeader:
     
        break;
       case "Bearer":
         if (token) {
           message = "Authorization Token Passed in Barer Authentication area";
   
           console.log("Authorization Token Passed in Barer Authentication area");
         }
       
         break;
   
       case "Basic":
         // const credentials = Buffer.from(token, 'base64').toString('utf-8').split(':');
         // const username = credentials[0];
         // const password = credentials[1];
         // req.user = { username };
         // next();
         if (token) {
           message = "Authorization Token Passed in Basic Authentication area";
   
           console.log(
             "Authorization Token Passed in Basic  Authentication area "
           );
         }
        
         break;
   
       case "AWS":
         if (token) {
           message = "Authorization Token Passed in Aws Authentication area";
   
           console.log("Authorization Token Passed in Aws Authentication area ");
         }
        
         break;
   
       case "OAuth":
         if (token) {
           message = "Authorization Token Passed in OAuth Authentication area";
   
           console.log("Authorization Token Passed in OAuth Authentication area ");
         }
        
         break;
       default:
         if (token) {
           message = "unknown authorization type";
           console.log("unknown authorization type");
         }
        
     }
     if (message) {
       const existingMessage = await TokenPassedArea.findOne();
       if (existingMessage) {
         await TokenPassedArea.findOneAndUpdate({}, { message });
       } else {
         await TokenPassedArea.create({ message });
       }
       console.log(message);
     }
     //end  checkJwttoken
  //  Data Validate injections and data validator
    for (var [key, value] of entries) {
          // 
          const passwordKeys = await PasswordKeysModel.findOne({ passwordkey: key }, { _id: 0 });
const usernameKey = await PasswordKeysModel.findOne({ usernamekey: key }, { _id: 0 });
const dbUsername = await DefaultUsernameModel.findOne({ username: value }, { _id: 0 });
const dbPassword = await DefaultPasswordModel.findOne({ defaultpassword: value }, { _id: 0 });

isBlankPasswordFound = passwordKeys ? (value === "" ? true : false) : false;
defaultUsernameMatched = usernameKey && dbUsername ? (value === dbUsername.username ? true : false) : false;
defaultPasswordMatched = passwordKeys && dbPassword ? (value === dbPassword.defaultpassword ? true : false) : false;

if (isBlankPasswordFound || defaultUsernameMatched) {
  const updateFields = {
    PasswordBlank: isBlankPasswordFound ? true : undefined,
    DefaultUsername: defaultUsernameMatched ? true : undefined,
    DefaultPassword: defaultPasswordMatched ? true : undefined,
  };
  
  existingAppSuppDefUserPass
    ? await App_Supp_Def_User_Pass.findByIdAndUpdate(existingAppSuppDefUserPass._id, updateFields, { new: true })
    : await App_Supp_Def_User_Pass.create(updateFields);
}
          // 
          value=  JSON.stringify(value)
          validateCommandInput = CommandInputRegx.test(value);
        if(validateCommandInput===true){
         commandlineInjextion=true
        }  
        if(hasSqlInjection(value)===true){
           containsSql = true;
        }  
        if (value.includes("<script>")) {
          validateXss = true;
        }
        if (HTML.test(value)) {
          validatehtml = true;
        }
    }
    //  Vpn Detection
    // await axios
    // .get(`https://internetdb.shodan.io/${ip}`)
    // .then((response) => {
    //    validatevpn= true
    
    // })
    // .catch((err) => {
    //   validatevpn= false
    //   throw new Error(err.message)
    // });
      
  // end  Data Validate injections and data validator
      
      switch (true) {
        case isBoat:
          //  CreateBotdata(req, res, (type = "isBot"));
            res.status(429).json({error: 'Too many requests' });
           break;
        case isSpam:
          //  CreateBotdata(req, res, (type = "isSpam"));
            res.status(429).json({error: 'Too many requests' });
           break;
        case origin && res.get("Access-Control-Allow-Origin") === "*":
          errorHandler(res, 403, "Not allowed to access from all domains", {});
          break;
        // vpn server
        // case validatevpn:
        //   CreateuserDetails(req, res, "VPn Detected", (type = "VPN"));
        //   break;
        case    isreqPathfile:
        errorHandler(res, 406, "not found"); // Return a 404 Not Found response
          break;
        
        // Commandline middleware
        case commandlineInjextion:
          if (iscommandMiddlware) {
            // CreateuserDetails(
            //   req,
            //   res,
            //   "XSS Injection Detected",
            //   (type = "xss injection")
            // );
            console.log("Command Injection Detected", "Command-Injection");
            return  res.status(406).json({error: 'malacius input find' });
          }
          next();
          break;
         // sql middleware
        case containsSql:
          if (isSQLMiddlware) {
            // CreateuserDetails(
            //   req,
            //   res,
            //   "XSS Injection Detected",
            //   (type = "xss injection")
            // );
            console.log("Sql Injection Detected", "Sql-Injection");
            return  res.status(406).json({error: 'malacius input find' });
          }
          next();
          break;
        // Xss middleware
        case validateXss:
          if (isXssMiddlewareEnabled) {
            // CreateuserDetails(
            //   req,
            //   res,
            //   "XSS Injection Detected",
            //   (type = "xss injection")
            // );
            console.log("XSS Injection Detected", "XSS-Injection");
            return  res.status(406).json({error: 'malacius input find' });
          }
          next();
          break;
          // Html Middleware
        case validatehtml:
          if (isHtmlMiddlewareEnabled) {
            // CreateuserDetails(
            //   req,
            //   res,
            //   "HTML Injection Detected",
            //   (type = "HTML injection")
            // );
            console.log("HTML Injection Detected", "HTML-Injection");
           return res.status(406).json({error: 'malacius input find' });
          }
          next();
          break;
        
        default:
          next();
      }
    
  } catch (error) {
    console.log(error);
    if(error.name==='CastError') return next();
    return errorHandler(res);
  }
};
// create LDAP injection middleware
const ldapInjectionDetector = async (req, res, next) => {
  try {
    const inputFields = req.body || {};
    for (const field in inputFields) {
      if (typeof inputFields[field] === "string") {
        // Check for LDAP injection attacks
        if (inputFields[field].match(/[*()\\]/)) {
          // Send a 406 Not Acceptable response if an attack is detected
          // Set a message property on the response object if an attack is detected
          console.log("LDAP Injection Detected");

          //   console.log(res)
          CreateuserDetailsindatabaseonly(
            req,
            res,
            "LDAP Injection Detected",
            (type = "LDAP-injection")
          );

          next();
        }
      }
    }
    // res.message="LDAP Injection  not Detected"
    next();
  } catch (error) {
    console.log({ error });
    return errorHandler(res);
  }
};
//   errorhandlermiddlewar

const SessionMiddleware = async (req, res, next) => {
  // console.log(req.protocol+"://"+req.hostname+":5000/")
  try {
    let sessiontimeout, checksessioninfinite, sessionfixation;
    const sessionExpireTime =
      req.session && req.session.cookie ? req.session.cookie._expires : null;
    // time in 30days
    // console.log({ sessionExpireTime })
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    /* session expire timestamp convert in second
        get session duration in seconds  */
    const sessionDuration = sessionExpireTime
      ? Math.floor((sessionExpireTime.getTime() - Date.now()) / 1000)
      : null;
    const sessionTimeout =
      sessionDuration !== null && sessionDuration > thirtyDaysInSeconds
        ? "high"
        : "low";
    // session time out high or low or infinite timeout
    const sessionTimeoutnull =
      sessionDuration === null
        ? "session is Infinite"
        : "session is not infinite ";
    // check session fixation
    if (
      req.sessionID &&
      req.session.originalSessionID &&
      req.sessionID !== req.session.originalSessionID
    ) {
      // Session ID has changed, indicating a possible session fixation attack
      // console.warn('Session ID may have been fixed!');
      // console.log('new Session ID', req.sessionID)
      // console.log('old Session ID', req.session.originalSessionID)
      req.session.originalSessionID = req.sessionID;
      sessiontimeout = sessionTimeout;
      (checksessioninfinite = sessionTimeoutnull),
        (sessionfixation =
          "Session ID has changed, indicating a possible session fixation attack");
      CreateuserDetailsindatabaseonly(
        sessiontimeout,
        checksessioninfinite,
        sessionfixation
      );
      // CreateuserDetailsindatabaseonly(req, res, "Session ID has changed, indicating a possible session fixation attack", "Session", "Session ID has changed, indicating a possible session fixation attack", sessionTimeout + "| Session Infinite Or Not:" + sessionTimeoutnull);

    } else {
      // console.log('new Session ID', req.sessionID)
      // console.log('old Session ID', req.session.originalSessionID)
      // CreateuserDetailsindatabaseonly(req, res, "session id not matching", "Session", "Session ID has not been changed,Session ID may have not been fixed ", sessionTimeout + "| Session Infinite Or Not:" + sessionTimeoutnull);
      sessiontimeout = sessionTimeout;
      (checksessioninfinite = sessionTimeoutnull),
        (sessionfixation =
          "Session ID has not been changed,Session ID may have not been fixed");
      CreateuserDetailsindatabaseonly(
        sessiontimeout,
        checksessioninfinite,
        sessionfixation
      );
      req.session.originalSessionID = req.sessionID;
     
    }
  } catch (error) {
    console.log(error);
    return errorHandler(res);
  }
};

const botDetector = async (req, res, next) => {
  try {
    const SSLVerifyMongodb = await getData,
      isMiddlware = SSLVerifyMongodb.BotMiddleware;
    if (isMiddlware) {
      if (req.url.includes("login")) {
        Botlimiter(req, res, () => {
          CreateBotdata(req, res, (type = "isBot"));
          next();
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return errorHandler(res);
  }
};
const SpamDetector = (req, res, next) => {
  try {
    // console.log(req.user)
    if (!req.url.includes("login")) {
      spamlimiter(req, res, () => {
        CreateSpamdata(req, res, (type = "Spam"));
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return errorHandler(res);
  }
};


function preventXmlInjection(req, res, next) {
  try {
    // console.log(req.body)
    // Check if the request content-type is XML
    // console.log(req.headers.contentType)
    const contentType = req.headers["content-type"];
    if (contentType && contentType.includes("application/xml")) {
      const hasInjection = checkForXMLInjection(req.body);
      if (hasInjection) {
        CreateuserDetails(req, res, message, (type = "XML injection"));
      } else {
        // Proceed to the next middleware
        next();
      }
    } else {
      // Proceed to the next middleware if the content-type is not XML
      next();
    }
  } catch (error) {
    console.log(error);
    return errorHandler(res);
  }
}
// middleware to check for 403 Forbidden responses
const CheckResponseCode = async (req, res, next) => {
  const Login = req.url.includes("login" || "signin") ? true : false;
  // override the send() method to intercept the response
  const originalSend = res.send;
  res.send = async function (body) {
    // check if the status code is 403 Forbidden
    var existingcode = statusCodes.filter((item) => {
      return item.code == res.statusCode;
    });
    if (existingcode.length > 0) {
      console.log(existingcode[0]);
      const code = existingcode[0].code;
      const phrase = existingcode[0].phrase;
      console.log(Login);
      Login === true ? CreateCodeDetailsForLoginPage(code, phrase) : "";
      CreatStatusCodesDetails(code, phrase);
    }
    // call the original send method with the original body argument
    originalSend.call(res, body);
  };
  next();
};
const CheckResponse = async (req, res, next) => {
 
  next();
};
const CheckJwtToken = async (req, res, next) => {
  const TokenPassedArea = require("../models/TokenPassedModel");
  const authHeader = req.headers.authorization;
  let message;
  if (!authHeader) {
    message = "missing authorization";
  }
  // console.log({authHeader})
  const [authType, token] = authHeader
    ? authHeader.split(" ")
    : (message = "missing auth token");
  switch (authType) {
    case "Bearer":
      if (token) {
        message = "Authorization Token Passed in Barer Authentication area";

        console.log("Authorization Token Passed in Barer Authentication area");
      }
      next();
      break;

    case "Basic":
      // const credentials = Buffer.from(token, 'base64').toString('utf-8').split(':');
      // const username = credentials[0];
      // const password = credentials[1];
      // req.user = { username };
      // next();
      if (token) {
        message = "Authorization Token Passed in Basic Authentication area";

        console.log(
          "Authorization Token Passed in Basic  Authentication area "
        );
      }
      next();
      break;

    case "AWS":
      if (token) {
        message = "Authorization Token Passed in Aws Authentication area";

        console.log("Authorization Token Passed in Aws Authentication area ");
      }
      next();
      break;

    case "OAuth":
      if (token) {
        message = "Authorization Token Passed in OAuth Authentication area";

        console.log("Authorization Token Passed in OAuth Authentication area ");
      }
      next();
      break;
    default:
      if (token) {
        message = "unknown authorization type";
        console.log("unknown authorization type");
      }
      next();
  }
  if (message) {
    const existingMessage = await TokenPassedArea.findOne();
    if (existingMessage) {
      await TokenPassedArea.findOneAndUpdate({}, { message });
    } else {
      await TokenPassedArea.create({ message });
    }
    console.log(message);
  }
};
module.exports = {
  CheckJwtToken,
  checkHTML,
  ldapInjectionDetector,
  CheckResponseCode,
  SessionMiddleware,
  SpamDetector,
  NosqlDetector,
  botDetector,
  preventXmlInjection,
  CheckResponse
};
