const mongoose = require("mongoose");
const { Schema } = mongoose;
const visitorSchema = Schema({
    sample:Object
})
// Creating Visitor Table in visitCounterDB
const VisitorModel = mongoose.model("VisitorModel",visitorSchema)
module.exports=VisitorModel