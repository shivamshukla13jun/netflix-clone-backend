const mongoose = require("mongoose");
const { Schema } = mongoose;
const SecretkeyModelSchema=new Schema({
  type: {
    session: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    secure: {
      type: Boolean,
      default: false,
    },
    httpOnly: {
      type: Boolean,
      default: false,
    },
    sameSite: {
      type: Boolean,
      default: false,
    },
    thirdParty: {
      type: Boolean,
      default: false,
    },
    zombie: {
      type: Boolean,
      default: false,
    },
    flash: {
      type: Boolean,
      default: false,
    },
    etag: {
      type: Boolean,
      default: false,
    },
  },
},{
    timestamps:true
})
module.exports = mongoose.model("CookieModel", SecretkeyModelSchema);