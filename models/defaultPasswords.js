const mongoose = require("mongoose");

const MyModelSchema=mongoose.Schema({
    defaultpassword:{type:String || Number,unique:true}
  
}, {timestamps:false,
    versionKey: false,
    _id: false,

}
)

module.exports=mongoose.model("defaultpasswordsmodel",MyModelSchema)