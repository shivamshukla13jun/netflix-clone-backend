const mongoose = require("mongoose");
const { Schema } = mongoose;
const TokenPassedAreaSchema=new Schema({
  message:{type:String},
},{
    timestamps:true
})
module.exports = mongoose.model("TokenPassedArea", TokenPassedAreaSchema);