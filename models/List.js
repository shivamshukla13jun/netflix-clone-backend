const mongoose = require("mongoose");

const ListSchema=mongoose.Schema({
    title:{type:String, required:true,unique:true},
    type:{type:String,enum:["Movie","TV"]},
    content:{type:[mongoose.Types.ObjectId],ref:"Movie",required:true},
}, {timestamps:true}
)

module.exports=mongoose.model("List",ListSchema)