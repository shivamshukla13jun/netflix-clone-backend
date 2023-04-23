const mongoose = require("mongoose");
const { Schema } = mongoose;
const BlankpasswordvalidatorSchema = Schema({
  PasswordBlank:{type:Boolean},
},{
    versionKey: false,
}
)
const App_Supp_Def_User_PassSchema = Schema({
  DefaultPassword:{type:Boolean},
  DefaultUsername:{type:Boolean},
  PasswordBlank:{type:Boolean}
},{
  versionKey: false,
}
)
// Creating Visitor Table in visitCounterDB
const BlankpasswordValidatorModel = mongoose.model("BlankpasswordValidatorModel",BlankpasswordvalidatorSchema)
const App_Supp_Def_User_Pass = mongoose.model("App_Supp_Def_User_PassSchema",App_Supp_Def_User_PassSchema)
module.exports={
  BlankpasswordValidatorModel,
  App_Supp_Def_User_Pass
}