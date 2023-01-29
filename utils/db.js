const mongoose=require('mongoose');
require('dotenv').config()
// getting-started.js

async function main() {
  await mongoose.connect('mongodb+srv://shivam:shivam123@cluster0.7ohdwhm.mongodb.net/netflix-clone',
  {useUnifiedTopology: true,useNewUrlParser: true});
  }
  main()
