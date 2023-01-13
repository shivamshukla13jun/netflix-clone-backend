const router = require('express').Router()
require('dotenv').config();
const User = require('../models/User')
const jwt=require('jsonwebtoken')
const CryptoJS=require('crypto-js')
// register
router.post("/register", async (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString()
    })
    try {
        const existUser = await User.findOne({ email: req.body.email})
        if(existUser){
            res.status(400).json("Email already registred")
        }
        else{
            const savedUser = await newUser.save()
            const accessToken=jwt.sign({id:savedUser._id,isAdmin:savedUser.isAdmin,password:savedUser.password},
                process.env.SECRET_KEY,
                {expiresIn:"5d"})
                const {...info}=savedUser._doc
            res.status(200).json({accessToken,...info})
            console.log({accessToken,...info})
        }
    } catch (error) {
        res.status(500).json(error)
    }
});

// Login
router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email})
    try {
      !user && res.status(401).json("Wrong Password or Username") 
            const bytes=CryptoJS.AES.decrypt(user.password,process.env.SECRET_KEY);
            const originalpassword=bytes.toString(CryptoJS.enc.Utf8)
            originalpassword!==req.body.password && res.status(401).json("Wrong Password or Username")
            const accessToken=jwt.sign({id:user._id,isAdmin:user.isAdmin,password:user.password},
                process.env.SECRET_KEY,
                {expiresIn:"5d"})
                const {...info}=user._doc
            res.json({accessToken,...info})
    

    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }

});

module.exports = router