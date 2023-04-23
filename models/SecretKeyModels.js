const mongoose = require("mongoose");
const { Schema } = mongoose;
const SecretkeyModelSchema=new Schema({
  secretOrPrivateKey:{type:String},
  expiresIn:{type:String},
},{
    timestamps:true
})
module.exports = mongoose.model("SecretKeyModel", SecretkeyModelSchema);