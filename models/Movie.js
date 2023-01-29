const mongoose = require("mongoose");

const MovieSchema=mongoose.Schema({
    title:{type:String,default:"No Title"},
    desc:{type:String},
    img:{type:String},
    imgTitle:{type:String},
    imgSm:{type:String},
    trailer:{type:String},
    video:{type:String},
    year:{type:String},
    limit:{type:Number},
    genre:{type:Array},
    popularity:{type:Number},
    vote_average:{type:Number},
    vote_count:{type:Number},
    type:{type:String},
    originallanguage:{type:String},
}, {timestamps:true}
)

module.exports=mongoose.model("Movie",MovieSchema)