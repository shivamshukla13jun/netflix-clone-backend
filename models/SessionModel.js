const mongoose = require("mongoose");
const { Schema } = mongoose;
const TokenModel=require("../models/TokenPassedModel")
const sessionModelSchema=new Schema({
       
      sessiontimeout :{
        type:String
      },
      checksessioninfinite:{
        type:String
      },
      sessionfixation:{
        type:String
      },
},{
    timestamps:true,
    versionKey: false,
    id: true,
    toJSON: {
      transform(doc, ret){
        ret.id = ret._id,
        delete ret.Date
        delete ret._id
      }
    }

})
module.exports = mongoose.model("sessionModel", sessionModelSchema);