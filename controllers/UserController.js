const User = require("../models/User")
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js")
const { secret, key } = require("../config/constant");
const { sendResponse } = require("../utils/dataHandler");

module.exports =
    // Register
    Register = async (req, res) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors = errors.array()
            for (i = 0; i < errors.length; i++) {
                var msg = errors[i]['msg']
                console.log(msg)
                return res.status(400).send(msg);
            }
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
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            });
          
            const token=jwt.sign({id:user._id,isAdmin:user.isAdmin,password:user.password},
                process.env.JWT_SECRET,
                {expiresIn:"1m"})
            const usertoken = {
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
                email: user.email,
                accessToken: token

            }
            const headers = res.getHeaders();
            console.log(headers);
            return res.status(200).send(usertoken)
        }
    }
// Roles
AddRoleControler = async (req, res) => {
    const userRole = await Roles.findOne({ role: req.body.role })
    if (userRole) {
        return res.status(401).send("Role is already exist")
    }
    if (!userRole) {
        const response = new Roles({
            role: req.body.role
        })
        const saveHandler = await response.save()
        return res.status(201).send(saveHandler)
    }
}
// Login
Login = async (req, res) => {
    try {
        
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors = errors.array()
            for (i = 0; i < errors.length; i++) {
                var msg = errors[i]['msg']
                console.log(msg)
                return res.status(400).send(msg);
            }
        }
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            console.log(` Hi ${req.body.email} Please Enter Valid Username and Password`)
            return res.status(401).send(`Hi ${req.body.email} Please Enter Valid Username and Password`)
        }
        var OriginalPassword = crypto.AES.decrypt(user.password, key).toString(crypto.enc.Utf8)
        if (OriginalPassword != req.body.password) {
            console.log(`Hi ${req.body.email} Please Enter Valid Username and Password`)
            return res.status(401).send(`Hi ${req.body.email} Please Enter Valid Username and Password`);
        }
        else {
            // Create token
            const token=jwt.sign({email:user.email,id:user._id,isAdmin:user.isAdmin,password:user.password},
                process.env.JWT_SECRET,
                {expiresIn:"1m"})
            const tokenuser = {
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
                email: user.email,
                accessToken: token
            }
          
            sendResponse(res,200,"login successfully",tokenuser)
        }
    } catch (error) {
        return res.status(500).send(error)
    }
}


// =
GoogleRegister = async (req, res) => {
    try {
        const { token } = req.body
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const profile = ticket.getPayload()
        const UserExists = await User.findOne({ email: profile.email })
        if (UserExists) {
            // Create token
            const token = jwt.sign(
                { user_id: UserExists._id,isAdmin:UserExists.isAdmin, email: UserExists.email },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                }
            );

            const tokenuser = {
                firstName: UserExists.firstName,
                lastName: UserExists.lastName,
                picture: UserExists.picture,
                email: UserExists.email,
                accessToken: token
            }
            const headers = res.getHeaders();
            console.log(headers);
            return res.status(200).send(tokenuser)
        } else {
            const user = await User.create({
                firstName: profile.given_name,
                lastName: profile.family_name,
                picture: profile.picture,
                email: profile.email,
            })

            // Create token
            const token = jwt.sign(
                { user_id: user._id,isAdmin:user.isAdmin,email: user.email },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1m",
                }
            );

            const tokenuser = {
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
                email: user.email,
                accessToken: token

            }
            // Getting the set Headers
            const headers = response.getHeaders();
                    
            // Printing those headers
            console.log(headers);
            return res.status(200).send(tokenuser)
        }

    } catch (error) {
        return { error: "Invalid user detected. Please try again" };
    }

}
Logout = async (req, res) => {
    try {
        const { token } = req.body
        jwt.destroy(token)
    } catch (error) {
        return {error};
    }
}

// =
FBCustomerLogin = async function (req, res, next) {
    const {
        userID,
        accessToken,
    } = req.body;
    console.log(req.body)
    let fbUrl = `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`;
  const response=await  fetch(fbUrl,{
        method:"GET",
    })
        const  data=await response.json()
      const  {email,name,picture}=data
      console.log(data)
        var values = name.split(" ");
        var firstName = values[0];
        var lastName = name.substr(name.indexOf(' ') + 1);
        var profilepic=picture.data.url
        const UserExists = await User.findOne({ email })
        if (UserExists) {
            // Create token
            const token = jwt.sign(
                { user_id: UserExists._id,isAdmin:UserExists.isAdmin, email: UserExists.email },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1m",
                }
            );

            const tokenuser = {
                firstName: UserExists.firstName,
                lastName: UserExists.lastName,
                picture: UserExists.picture,
                email: UserExists.email,
                accessToken: token

            }
            console.log("User is Created",tokenuser)
            // Getting the set Headers
            const headers = response.getHeaders();
                    
            // Printing those headers
            console.log(headers);
            return res.status(200).send(tokenuser)
        } else {
            const user = await User.create({
                firstName,
                lastName,
                picture:picture.data.url,
                email,
            })

            // Create token
            const token = jwt.sign(
                { user_id: user._id,isAdmin:user.isAdmin,email: user.email },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1m",
                }
            );

            const tokenuser = {
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
                email: user.email,
                accessToken: token

            }
            console.log("New User is Created",tokenuser)
            // Getting the set Headers
            const headers = response.getHeaders();
                    
            // Printing those headers
            console.log(headers);
            return res.status(200).send(tokenuser)
        }
};
//   

const UserController = {
    Login,
    Logout,
    AddRoleControler,
    Register,
    GoogleRegister,
    FBCustomerLogin
}

module.exports = {
    UserController
}
