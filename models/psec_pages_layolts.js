const mongoose = require("mongoose");
const { Schema } = mongoose;

const psec_pages_layolts=new Schema({
      text: {
        type: String
      },
        page: {
        type: String
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
module.exports = mongoose.model("psec_pages_layolts", psec_pages_layolts);