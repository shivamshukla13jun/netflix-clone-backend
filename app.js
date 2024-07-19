
const express = require('express')
const path=require('path')
const cors = require('cors');
const app = express()
const dotenv=require('dotenv')
const ApiRouter= require('./routes');
const connectDB=require('./utils/db');
const { ErrorHandler } = require('./middlewares/ErrorHandler');
const Category = require('./models/Category.model');
const Movie = require('./models/Movie');
// config .env file
dotenv.config();
// connect databsae
connectDB()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// convor request data to Req.body
app.use(express.json({limit: '50mb'}));
// handle Cors Origin
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
// serve static files
app.use('/uploads',express.static('uploads'))
app.use('/banner',express.static('banner'))
// All Apis
app.use("/api",ApiRouter)
// 404 handler
app.all("*",(req,res)=>{
  res.status(404).json({
    success: false,
    message: "Page Not Found"
})
})
// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(ErrorHandler)

const Port=process.env.PORT || 7000
app.listen(Port,()=>{
    console.log(`server is running on`, Port)
})

// const API_KEY = "efdd474fc85772c8ecc497550ca8a0ac";
// const imagePath = "https://image.tmdb.org/t/p/original";
// const TrendingPage = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`;
// axios.get(TrendingPage)
// .then(res=>console.log(res))
// .catch(e=>console.log(e))
const getcsv=async()=>{
  const categories=await Category.find({})
  const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('animes.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end',async () => {
    // Iterate over anime data
    const data=[]
   const promise=()=>{
    return new Promise((resolve,reject)=>{
      for (const anime of results) {
 
        // Iterate over categories
        for (const category of categories) {
          // Check if genre field matches category name and has a value of 1
          if (anime[`genre_${category.name}`] == '1' && category['name'].includes(category.name)) {
            
            data.push({
              title:anime["title"],
              url:anime["url"],
              imageurl:anime["imageurl"],
              episodes:anime["episodes"],
              rate:anime["rate"],
              genre:category._id
             })
         
          }
        }
      }
      resolve(data)
    })
   }
 let d=  await promise().then((res)=>res)
 console.log('d>>>>>>>>>>>>>>>>>>>>>>>>>',d)
 let finaledata=await Movie.insertMany(d)
 console.log(finaledata)
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });
}


// 
// getcsv()
