const mongoose = require("mongoose");
const { Schema } = mongoose;
const SessionByPassModelSchema=new Schema({
  ip:{type:String,unique:true},
  message:{type:String}
},{
    timestamps:true
})
module.exports = mongoose.model("SessionEnemyByPassModel", SessionByPassModelSchema);