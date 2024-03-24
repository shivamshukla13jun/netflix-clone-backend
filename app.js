
const express = require('express')
const path=require('path')
const cors = require('cors');
const app = express()
const dotenv=require('dotenv')
const ApiRouter= require('./routes');
const connectDB=require('./utils/db');
const { default: axios } = require('axios');
const { ErrorHandler } = require('./middlewares/ErrorHandler');
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