const express = require('express')
const app = express()
const history = require('connect-history-api-fallback');
var path=require('path')
require('dotenv').config();
require('./utils/db');
const cors = require('cors');
const ApiRouter= require('./apis/api');
const Getmiddlware = require('./middlewares/Allmiddlewares');
const verifyToken = require('./middlewares/VerifyUser');
app.use(express.json({limit: '50mb'}));
app.use( express.urlencoded({ extended: true }))
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });
 
// app.use(history());
// app.use(express.static(path.join(__dirname,'build')));
// view engine setup
Getmiddlware(app)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/uploads',express.static('uploads'))
app.use("/api",ApiRouter)
const Port=process.env.PORT || 7000
app.listen(Port,()=>{
    console.log(`server is running on`, Port)
})
app.post("/test",(req,res)=>{
  res.status(300).json("hii")
})
app.get("/test",verifyToken,(req,res)=>{
  res.send(req.query)
})

async function CallAddcsvRequest(){
  const fs = require('fs');
  const csv = require('csv-parser');
  const results = [];
  fs.createReadStream('./defaultusernames.csv')
   .pipe(csv())
   .on('data', (data) => {
     results.push(data);
   })
   .on('end', () => {
     console.log(results);
     const Mymodel=require('./models/MyModel')
     console.log("please wait...")
   Mymodel.insertMany(results, { ordered: false, rawResult: true })
   .then((result) => {
     console.log('Inserted documents:', result.insertedCount);
    //  res.send(JSON.parse(result))
     console.log('Skipped documents:', result.writeErrors.length);
   })
   .catch((err) => console.log(err.message));
   });
   
}
async function DefaultPasswordAdd(){
  try {
    const fs = require('fs');
    const csv = require('csv-parser');
    const results = [];
    fs.createReadStream('./defaultpasswords2.csv')
     .pipe(csv())
     .on('data', (data) => {
       results.push(data);
     })
     .on('end', async() => {
       console.log(results);
       const Mymodel=require('./models/defaultPasswords')
       console.log("please wait...")
       const result=await  Mymodel.insertMany(results, { ordered: false, rawResult: true })
       console.log('Inserted documents:', result.insertedCount);
       console.log('Skipped documents:', result.writeErrors.length);
    
     });
  } catch (error) {
    console.log(error.message)
  }
}
async function PasswordKeysAddAdd(){
  try {
       const results=[
        {passwordkey:"password"},
        { passwordkey:"pass"},
        {passwordkey: "pwd"},
        {passwordkey: "user_password"},
        {passwordkey: "login_password"},
        {passwordkey: "authentication_password"},
        { passwordkey:"passwd"},
        { passwordkey:"userpass"},
       { passwordkey:"loginpass"},
       { passwordkey:"authpass"},
       { passwordkey:"password1"},
       { password2:"passwordkey"},
        {passwordkey:"newpassword"},
        {passwordkey:"confirmpassword"},
       { passwordkey:"oldpassword"},
       { passwordkey:"hash"}
       ]
       console.log("please wait...")
       const Mymodel=require('./models/PasswordKeysModel')
       const result=await  Mymodel.insertMany(results, { ordered: false, rawResult: true })
       console.log('Inserted documents:', result.insertedCount);
       console.log('Skipped documents:', result.writeErrors.length);
    
  } catch (error) {
    console.log(error.message)
  }
}
async function UserKeysAddAdd(){
  try {
    const results=[
      {passwordkey:"password"},
      { passwordkey:"pass"},
      {passwordkey: "pwd"},
      {passwordkey: "user_password"},
      {passwordkey: "login_password"},
      {passwordkey: "authentication_password"},
      { passwordkey:"passwd"},
      { passwordkey:"userpass"},
     { passwordkey:"loginpass"},
     { passwordkey:"authpass"},
     { passwordkey:"password1"},
     { password2:"passwordkey"},
      {passwordkey:"newpassword"},
      {passwordkey:"confirmpassword"},
     { passwordkey:"oldpassword"},
     { passwordkey:"hash"},
     {usernamekey:"user-id"},
     { usernamekey:"user_id"},
     {usernamekey: "uid"},
     {usernamekey: "user_key"},
     {usernamekey: "user_token"},
     {usernamekey: "user_session"},
     { usernamekey:"client_id"},
     { usernamekey:"client_key"},
    { usernamekey:"login_id"},
    { usernamekey:"username_or_email"},
    { usernamekey:"email_or_username"},
     {usernamekey:"user_name_or_email"},
     {usernamekey:"user_email_or_name"},
    { usernamekey:"useremailaddress"},
    { usernamekey:"user_email_address"},
    { usernamekey:"useraccount"},
    { usernamekey:"user_account"},
    { usernamekey:"username"},
    { usernamekey:"email"},
     ]
    
       console.log("please wait...")
       const Mymodel=require('./models/PasswordKeysModel')
       const result=await  Mymodel.insertMany(results, { ordered: false, rawResult: true })
       console.log('Inserted documents:', result.insertedCount);
       console.log('Skipped documents:', result.writeErrors.length);
    
  } catch (error) {
    console.log(error.message)
  }
}
// CallAddcsvRequest()
// DefaultPasswordAdd()
// PasswordKeysAddAdd()
// UserKeysAddAdd()