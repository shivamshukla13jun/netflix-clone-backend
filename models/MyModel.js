const mongoose = require("mongoose");

const MyModelSchema=mongoose.Schema({
    title:{type:String,unique:true},
    content:{type:String},
  
}, {timestamps:true}
)

module.exports=mongoose.model("Mymodel",MyModelSchema)