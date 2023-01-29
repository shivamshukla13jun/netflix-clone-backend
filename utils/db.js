const mongoose=require('mongoose');
require('dotenv').config()
// getting-started.js

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/netflix-clone',
  {useUnifiedTopology: true,useNewUrlParser: true});
  }
  main()
