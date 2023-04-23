const xml2js = require('xml2js');
const { errorHandler } = require('../utils/errorHandler');
const { CreateuserDetails } = require('./functions');

function detectXmlInjection(req, res, next) {
    if (req.headers['content-type'] === 'application/xml') {
        const xmlString = req.rawBody.toString();
         console.log(xmlString)
         if (xmlString.match("<!ENTITY")) {
          return  CreateuserDetails(req, res, "Malacious code request", type = "XML-Injection")
        //   return errorHandler(res,406,"INVALID XML FILE",)
          }
    }
    next();
  }
  
  module.exports = {detectXmlInjection}