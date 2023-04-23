const mongoose = require("mongoose");
const { Schema } = mongoose;
const SessionByPassModelSchema=new Schema({
  ip:{type:String},
  options:{type:Object},
  secretOrPrivateKey:{type:String},
  message:{type:String}
},{
    timestamps:true
})
module.exports = mongoose.model("SessionByPassModel", SessionByPassModelSchema);