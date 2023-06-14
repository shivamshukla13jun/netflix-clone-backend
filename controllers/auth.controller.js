const dotenv=require('dotenv')
dotenv.config()
const User = require('../models/User')
const jwt=require('jsonwebtoken')
const crypto=require('crypto-js')
const { sendResponse } = require('../utils/dataHandler')
const { errorHandler } = require('../utils/errorHandler')
const key=process.env.PASSWORDENCRYPTIONKEY

module.exports=AuthController={
    Login:async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                console.log(` Hi ${req.body.email} Please Enter Valid Username and Password`)
                throw new Error(`Hi ${req.body.email} Please Enter Valid Username and Password`)
               
                return sendResponse(res,401,`Hi ${req.body.email} Please Enter Valid Username and Password`,{})
               
                return res.status(401).send(`Hi ${req.body.email} Please Enter Valid Username and Password`)
            }
            var OriginalPassword = crypto.AES.decrypt(user.password, key).toString(crypto.enc.Utf8)
            if (OriginalPassword != req.body.password) {
                console.log(`Hi ${req.body.email} Please Enter Valid Username and Password`)
                throw new Error(`Hi ${req.body.email} Please Enter Valid Username and Password`)
                return sendResponse(res,401,`Hi ${req.body.email} Please Enter Valid Username and Password`,{})
                return res.status(401).send(`Hi ${req.body.email} Please Enter Valid Username and Password`);
            }
            else {
                // Create token
                const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},
                    process.env.JWT_SECRET,
                    {expiresIn:"1d"})
                const accessToken = crypto.AES.encrypt(token, key).toString();
                
                sendResponse(res,200,"login successfully",accessToken)
            }
        } catch (error) {
            console.log({err:error.message})
            return errorHandler(res,500,error.message)
            return res.status(500).send(error)
        }
    },
    Logout:async (req, res) => {
        try {
            const { token } = req.body
            jwt.destroy(token)
        } catch (error) {
            return {error};
        }
    },
    Register:async (req, res) => {
        if(!req.body.email ){
            return res.status(401).send("please enter your email address")
         }
         else if(!req.body.password){
            return res.status(401).send("please enter your password")
         }
         else if(!req.body.firstname ){
            return res.status(401).send("please enter your firstname")
         }
         else if(!req.body.lastname){
            return res.status(401).send("please enter your lastname")
         }
         else if(!req.body.subscriptiontype ){
            return res.status(401).send("please enter your subscriptiontype")
         }
           const user = await User.findOne({ email: req.body.email })
           if (user) {
               console.log(req.body.password)
               return res.status(403).send("user is already exist")
           }
           if (!user) {
               var encrypted = crypto.AES.encrypt(req.body.password, key).toString();
               const user = await User.create({
                   email: req.body.email,
                   password: encrypted,
                   firstName: req.body.firstname,
                   lastName: req.body.lastname,
               });
             
               const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},
                   process.env.JWT_SECRET,
                   {expiresIn:"1d"})
               const usertoken = crypto.AES.encrypt(token, key).toString();
               return res.status(200).json(usertoken)
           }
       }

}

