require('dotenv').config();
const mongoose = require('mongoose');
// getting-started.js
const username = "shivam";
const password = "shivam123";
const cluster = "cluster0.7ohdwhm";
const dbname = "netflix-clone";
// const mongouri=`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}`
const main= async () => {
  try {
    // Connect to MongoDB
    mongoose.set('useCreateIndex', true);
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(() =>
        console.log(`MongoDB Connected`)
      )
      .catch(err => console.log(err));
  } catch (error) {
    return null;
  }
};
  main()


 
