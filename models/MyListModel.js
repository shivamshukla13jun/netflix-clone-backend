const mongoose = require("mongoose");

const ListSchema=mongoose.Schema({
    content:{type:[mongoose.Types.ObjectId],default:[],ref:"Movie"},
    userId:{type:mongoose.Types.ObjectId,ref:"User"},
}, {timestamps:true}
)

module.exports=mongoose.model("Mylist",ListSchema)