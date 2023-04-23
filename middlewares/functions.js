const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { errorHandler } = require('../utils/errorHandler');
const { spawn } = require('child_process');
const path = require('path');
const Project_Security_Logs = require('.././models/Project_Security_Logs')
const sessionModel = require('.././models/SessionModel')
const axios = require('axios')
const https = require('https');
const url = require('url');

// XLInjectionCheck
function checkForXMLInjection(xml) {
  // Check for potential injection attacks by inspecting the XML data
  // Return true if an injection is detected, false otherwise
  // You can use regular expressions or string comparisons to check for suspicious patterns

  // Check for CDATA injection attacks
  const cdataRegex = /<!\[CDATA\[(.*)\]\]>/;
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch && cdataMatch[1].includes(']]>')) {
    return true;
  }

  // Check for entity injection attacks
  const entityRegex = /<!ENTITY\s+([\w_-]+)\s+(['"])(.*?)\2\s*>/g;
  let entityMatch;
  while (entityMatch = entityRegex.exec(xml)) {
    const entityValue = entityMatch[3];
    if (entityValue.includes('<') || entityValue.includes('>')) {
      return true;
    }
  }

  // Check for tag injection attacks
  const tagRegex = /<([^\s/>]+)/g;
  let tagMatch;
  while (tagMatch = tagRegex.exec(xml)) {
    const tagName = tagMatch[1];
    if (tagName.includes('<') || tagName.includes('>')) {
      return true;
    }
  }
  // No injection detected
  return false;
}
// sanitizer function
function sanitizeInput(input) {
  return input.replace(/<[^>]*>/g, '');
}
// sanitizer function
// XSS Injection Function
function XSSInjection(value) {
  const xssMetacss = new RegExp('((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)', "i")
  if (xssMetacss.test(value)) {
    return true;
  }
  const xssMetaImg = new RegExp('((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)', "i")
  if (xssMetaImg.test(value)) {
    return true;
  }
  const xssprenopidcss = new RegExp('((\%3C)|<)[^\n]+((\%3E)|>)', "i")
  if (xssprenopidcss.test(value)) {
    return true;
  }
  return false;
}
// XSS Injection Function
// Create Blacklistusers details function

const CreateuserDetails = async (req, res, message, type,) => {
  try {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const { country, city, region } = await axios.get(`http://ip-api.com/json/${ip}`).then(response => response.data);
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    // const DeviceDetector = require('node-device-detector');
    // const detector = new DeviceDetector({
    //     clientIndexes: true,
    //     deviceIndexes: true,
    //     deviceAliasCode: false,
    // });
    const useragent = req.headers['user-agent']
    // // const result = detector.detect(useragent);
    // // const { client, os, device } = result

    const UserRawData = {
      ip,
      date: d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear(),
      time: d.toLocaleTimeString(),
      page: req.url,
      query: req.query || req.query || "",
      inputQuery: req.body || "",
      type,
      // browser: client.name + client.version || "",
      // browser_code: client.name || "",
      // os: os.name + os.version + os.platform || "",
      country: country || "",
      city: city || "",
      region: region || "",
      useragent,
      latitude: "",
      longitude: "",
      // device: device.type,
      domain: req.get('host'),
      referurl: req.protocol + '://' + req.get('host') + req.originalUrl || ""
    }
    const filter = { ip };
    const update = UserRawData;

    const finduser = await Project_Security_Logs.findOne(filter)
    if (finduser) {
      await Project_Security_Logs.findOneAndUpdate(filter, update)
      return errorHandler(res, 406, message)
    } else {
      await Project_Security_Logs.create(UserRawData)
    return   errorHandler(res, 406, message)
    }
  } catch (error) {
    console.error(error)
  }
}
const CreatStatusCodesDetails = async (ErrorStatuscode,message) => {
  try {
    const StatusCodeModels=require('../models/ServerErrorResponseCodes')
    const UserRawData = {
      ErrorStatuscode,
      message
    }
    const filter = { ErrorStatuscode };
    const finduser = await StatusCodeModels.findOne(filter)
    if (finduser) {
     console.log("already exist")
    } else {
      await StatusCodeModels.create(UserRawData)
    }
  } catch (error) {
    console.error(error)
  }
}
const CreateCodeDetailsForLoginPage = async (ErrorStatuscode,message) => {
  try {
    const StatusCodeModels=require('../models/ResponseCodesLoginPageModels')
    const UserRawData = {
      ErrorStatuscode,
      message
    }
    const filter = { ErrorStatuscode };
    const finduser = await StatusCodeModels.findOne(filter)
    if (finduser) {
     console.log("already exist")
    } else {
      await StatusCodeModels.create(UserRawData)
    }
  } catch (error) {
    console.error(error)
  }
}
const CreateuserDetailsindatabaseonly = async (sessiontimeout,checksessioninfinite,sessionfixation) => {
  try {
    const UserRawData = {
      sessiontimeout,checksessioninfinite,sessionfixation
    }
    // 
    const existingMessage = await sessionModel.findOne();
    if (existingMessage) {
      await sessionModel.findOneAndUpdate({},UserRawData);
    } else {
      await sessionModel.create(UserRawData);
    }
    // 
  
  } catch (error) {
    console.error(error)
  }
}


async function hasRobotsTxt(originurl) {
  const originHeader = originurl;
  const { hostname } = new URL(originHeader);
  console.log('Domain:', hostname);
  if (hostname === 'localhost') {
    return Promise.reject(new Error('localhost not allowed'));
  }
  const options = {
    method: 'HEAD',
    hostname: hostname,
    port: 443,
    path:'/robots.txt',
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      resolve(res.statusCode === 200);
    });

    req.on('error', err => {
      reject(err);
    });

    req.end();
  });
}




const CreateBotdata = async (req, res, type) => {
  try {
    const BotModels=require('../models/Bot_logsModel')
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const useragent = req.headers['user-agent']
    const UserRawData = {
      ip,
      date: d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear(),
      time: d.toLocaleTimeString(),
      page: req.url,
      query: req.query || req.query || "",
      inputQuery: req.body || "",
      type,
      useragent,
      domain: req.get('host'),
      referurl: req.protocol + '://' + req.get('host') + req.originalUrl || "",
    }
    const filter = { ip };
    const update = UserRawData;

    const finduser = await BotModels.findOne(filter)
    if (finduser) {
      await BotModels.findOneAndUpdate(filter, update)
    } else {
      await BotModels.create(UserRawData)
    }
  } catch (error) {
    console.error(error)
  }
}
const CreateSpamdata = async (req, res, type) => {
  try {
    const BotModels=require('../models/Bot_logsModel')
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const useragent = req.headers['user-agent']
    const UserRawData = {
      ip,
      date: d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear(),
      time: d.toLocaleTimeString(),
      page: req.url,
      query: req.query || req.query || "",
      inputQuery: req.body || "",
      type,
      useragent,
      domain: req.get('host'),
      referurl: req.protocol + '://' + req.get('host') + req.originalUrl || "",
    }
    const filter = { ip };
    const update = UserRawData;

    const finduser = await BotModels.findOne(filter)
    if (finduser) {
      await BotModels.findOneAndUpdate(filter, update)
    } else {
      await BotModels.create(UserRawData)
    }
  } catch (error) {
    console.error(error)
  }
}

// End Create Blacklistusers details function

// Sql Injection Function
function hasSqlInjection(value) {
  const sqlMeta = new RegExp('(%27)|(--)|(1=1)|(1 and 1=1)|(1 AND 1=1)|(or 1=1)|(OR 1=1)|(%23)|(#)', 'i');
  if (sqlMeta.test(value)) {
    return true;
  }
  const sqlMeta2 = new RegExp('((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))', 'i');
  if (sqlMeta2.test(value)) {
    return true;
  }
  const sqlTypical = new RegExp('w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))', 'i');
  if (sqlTypical.test(value)) {
    return true;
  }
  const sqlUnion = new RegExp('((%27)|(\'))union', 'i');
  if (sqlUnion.test(value)) {
    return true;
  }
  return false;
}
// Sql Injection middleware
const fs = require('fs')
const middlewaresModel=require('../models/midlwaresModel')
const getData=middlewaresModel.findOne({}).then((res)=>{return res}).then((data)=>{return data})
async function compareCookies(arr1, arr2) {
  // Check if the length of the arrays is the same
  if (arr1.length !== arr2.length) {
    console.log({ message: 'Cookies do not match' })
    return { message: 'Cookies do not match' };
  }

  // Iterate over each element of the arrays and compare their values
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      console.log({ message: 'Cookies do not match' })
      return { message: 'Cookies do not match' };
    }
  }
  // If all elements match, return a success response
  console.log({ message: 'Cookies match' })
  return { message: 'Cookies match' };
}





module.exports = {
  CreateCodeDetailsForLoginPage,
  CreatStatusCodesDetails,
  hasSqlInjection,
  hasRobotsTxt,
  CreateuserDetails,
  XSSInjection,
  getData,
  CreateSpamdata,
  CreateBotdata,
  compareCookies,
  CreateuserDetailsindatabaseonly,
  sanitizeInput,
  checkForXMLInjection,
  
}