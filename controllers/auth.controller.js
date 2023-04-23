const dotenv=require('dotenv')
dotenv.config()
const User = require('../models/User')
const jwt=require('jsonwebtoken')
const crypto=require('crypto-js')
const { sendResponse } = require('../utils/dataHandler')
const { errorHandler } = require('../utils/errorHandler')
const key=process.env.PASSWORDENCRYPTIONKEY
console.log(process.env.JWT_SECRET)
console.log("key",key)
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
                const token=jwt.sign({email:user.email,id:user._id,isAdmin:user.isAdmin,password:user.password},
                    process.env.JWT_SECRET,
                    {expiresIn:"1h",})
                const tokenuser = {
                    name: user.name,
                    picture: user.picture,
                    email: user.email,
                    accessToken: token
                }
              
                sendResponse(res,200,"login successfully",tokenuser)
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
     try {
        const {username,firstname, password,email,
            lastname,subscriptiontype}=req.body
            console.log(req.body)
            const user = await User.findOne({ email:email })
            if (user) {
                console.log("user exists")
                return res.status(403).send("user is already exist")
            }
            if (!user) {
                var encrypted = crypto.AES.encrypt(password, key).toString();
                const user = await User.create({
                    password: encrypted,
                    username,firstname,email,
                    lastname,subscriptiontype
                });
    
                const token=jwt.sign({id:user._id,isAdmin:user.isAdmin,password:user.password},
                    process.env.JWT_SECRET,
                    {expiresIn:"1h"})
                const usertoken = {
                    name: user.name,
                    email: user.email,
                    accessToken: token
    
                }
                return res.status(200).send(usertoken)
            }
     } catch (error) {
        console.log(error)
     }
    },

}

