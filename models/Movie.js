const mongoose = require("mongoose");

const MovieSchema=mongoose.Schema({
    title:{type:String,default:"No Title"},
    desc:{type:String},
    img:{type:String},
    runtime:{type:Number},
    imgSm:{type:String},
    trailer:{type:String},
    video:{type:String},
    year:{type:String},
    limit:{type:Number},
    genre:{type:Array},
    type:{type:String},
    url:{type:String},
    rate:{type:Number},
    episodes:{type:Number},
}, {timestamps:true}
)

module.exports=mongoose.model("Movie",MovieSchema)