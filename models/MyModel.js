const mongoose = require("mongoose");

const MyModelSchema=mongoose.Schema({
    username:{type:String || Number,unique:true}
  
}, {timestamps:false,
    versionKey: false,
    id: false,

}
)

module.exports=mongoose.model("Mymodel",MyModelSchema)