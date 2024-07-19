require('dotenv').config();
const jwt=require('jsonwebtoken')
const CryptoJS=require('crypto-js')
const User = require('../models/User')
const { ValidateUserSignUp, ValidateUserLogin } = require('../helpers/Validators')
const { sendResponse } = require('../utils/dataHandler')
const { errorHandler } = require('../utils/errorHandler')
const { validatePassword } = require('../utils/validatePasssword')
const key=process.env.SECRET_KEY
console.log("key",key)
module.exports={
    Register: async (req, res) => {
        try {
          // const isValidHostname = await checkDomainAvailability(req.body.domain);
          const { containsSpecialCharacter, containsLowercase, containsUppercase, containsNumber } = await validatePassword(req.body.password)
          if (!containsSpecialCharacter) {
            return sendResponse(res, 406, "Please enter password 1 Special charater");
          }
          else if (!containsLowercase) {
            return sendResponse(res, 406, "Please enter password 1  Lowercase letter",);
          }
          else if (!containsUppercase) {
            return sendResponse(res, 406, "Please enter password 1  Uppercase letter",);
          }
          else if (!containsNumber) {
            return sendResponse(res, 406, "Please enter password 1  Number letter",);
          }
          const error = ValidateUserSignUp(req.body)
          if (error) {
            return sendResponse(res, 400, error,);
          }
          let user = await User.findOne({ email: req.body.email })
          if (user) {
            return sendResponse(res, 409, "email is already registered", {});
          }
          else if (!user) {
             var encrypted = CryptoJS.AES.encrypt(req.body.password, key).toString();
             req.body.password=encrypted
            const user = await User.create(req.body);
        
      
            return sendResponse(res, 200, "register successfully", user);
          }
        } catch (error) {
          console.log(error)
          return errorHandler(res)
        }
      },
      
      // Login
      
      Login:async (req, res) => {
        try {
          const error = ValidateUserLogin(req.body)
          if (error) {
            return sendResponse(res, 400, error,);
          }
      
          let user = await User.findOne({ email: req.body.email })
          if (user) {
            console.log(user.password)
            var bytes = CryptoJS.AES.decrypt(user.password, key);
            var decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (decrypted == req.body.password) {
              const token = jwt.sign({ id: user._id,}, process.env.JWT_SECRET, { expiresIn: "365d" })
              // Set access token in a cookie
              res.cookie('access_token', token, { secure: false });
              user=user.toObject()
              const role=user.permission
              delete user.permission
              return sendResponse(res, 200, "login successfully", { token,user:user ,role});
            } else {
              return sendResponse(res, 406, "please enter valid credentials")
            }
          }
          else if (!user) {
            return sendResponse(res, 404, "user does not exist");
          }
      
        } catch (error) {
          console.log(error)
          return errorHandler(res)
        }
      
      }
      

}

