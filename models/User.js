const mongoose = require("mongoose");
const UserSchema=mongoose.Schema({
    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    password:{type:String,required:true,unique:true},
    profilePic:{type:String,default:""},
    isAdmin:{type:Boolean,default:false},
    permission:{type:String,enum:["user","admin"],default:"user"}
    // subscriptiontype:{type:String,required:true}
}, {timestamps:true}
)

module.exports=mongoose.model("User",UserSchema)