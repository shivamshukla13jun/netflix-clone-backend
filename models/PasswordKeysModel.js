const mongoose = require("mongoose");

const PasswordKeySchema=mongoose.Schema({
    passwordkey:{type:String,unique:true},
    usernamekey:{type:String,unique:true},
}, {timestamps:false,
    versionKey: false,
    _id: false,

}
)

module.exports=mongoose.model("PasswordKeyModel",PasswordKeySchema)