const mongoose = require("mongoose");
const { Schema } = mongoose;
const MiddlewaresSchema=new Schema({
  Host: {type:String},
  SqlDetectorMiddlware: {type:Boolean,default:true},
  BotMiddleware: {type:Boolean,default:true},
  VpnProtectMiddlware: {type:Boolean,default:true},
  SpamMiddleware: {type:Boolean,default:true},
  xssInjectionDetectorMiddlware: {type:Boolean,default:true},
  checkHTMLMiddlware: {type:Boolean,default:true},
  NosqlDetectorMiddlware: {type:Boolean,default:true},
  commandlineinjectionMiddlware: {type:Boolean,default:true},
  ldapInjectionDetectorMiddlware: {type:Boolean,default:true},
  BlockUserMiddlware: {type:Boolean,default:true},
},{
    timestamps:true
})
const middlewareModel=mongoose.model("middlewares", MiddlewaresSchema);
const db = mongoose.connection;
const defaultData={
  SqlDetectorMiddlware: true,
  BotMiddleware: true,
  VpnProtectMiddlware: true,
  SpamMiddleware: true,
  xssInjectionDetectorMiddlware: true,
  checkHTMLMiddlware: true,
  NosqlDetectorMiddlware: true,
  commandlineinjectionMiddlware: true,
  ldapInjectionDetectorMiddlware: false,
  BlockUserMiddlware: true
}
db.once('open', async () => {
  console.log('MongoDB connection established.');
  // Check if the collection exists
  const collections = await middlewareModel.find({});
  if (collections.length === 0) {
    console.log('Collection does not exist. Creating...');
    middlewareModel.create(defaultData, (err, docs) => {
      if (err) {
        console.log('Error creating collection:', err);
      } else {
        console.log('Collection created and default data inserted:', docs);
      }
    });
  } else {
    console.log('Collection already exists.');
  }
});
module.exports =middlewareModel
// Create collection of Model
