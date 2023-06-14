require('dotenv').config();
const mongoose = require('mongoose');
// getting-started.js
const username = process.env.DBUSERNAME;
const password = process.env.DBPASSWORD;
const cluster =process.env.CLUSTER
const dbname = process.env.DBNAME
const mongouri=`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}`
const main= async () => {
  try {
    // Connect to MongoDB
     await  mongoose.set('useCreateIndex', true);
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(() =>
        console.log(`MongoDB Connected`)
      )
      .catch(err => console.log("mongoerror",err.message));
  } catch (error) {
    console.log("mongoerror",error.message);
  }
};
module.exports=main


 
