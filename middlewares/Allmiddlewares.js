
const xmlparser = require('express-xml-bodyparser');
// import all middlewares Here
const {  SessionMiddleware, CheckResponseCode,
 checkHTML, ldapInjectionDetector,NosqlDetector } = require("./Security")
const { detectXmlInjection } = require('./XmlInjectiondetector');
const BotlimitRate = require('./RateLimiter/BotlimitRate');
const SpamlimitRate = require('./RateLimiter/SpamlimitRate');
const publicMiddlewares = [
  SpamlimitRate,
  BotlimitRate,
  checkHTML,
  detectXmlInjection,
  ldapInjectionDetector,
  NosqlDetector,
  CheckResponseCode,
  // SessionMiddleware,
];

const Getmiddlware = (app) => {
  app.use(publicMiddlewares)
}
module.exports = Getmiddlware
