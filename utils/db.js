const mongoose=require('mongoose');
require('dotenv').config()
// getting-started.js
main().then(res=>console.log("Starting"))
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/netflix-clone',
  {useUnifiedTopology: true,useNewUrlParser: true,createIndexes:true});
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
