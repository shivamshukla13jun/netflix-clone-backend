const express = require('express')
const app = express()
const history = require('connect-history-api-fallback');
var path=require('path')
require('dotenv').config();
require('./utils/db');
const cors = require('cors');
const ApiRouter= require('./apis/api');
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
 
app.use(history());
app.use(express.static(path.join(__dirname,'build')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json({limit: '50mb'}));
app.use(require('./middlewares/middleware'))
app.use('/uploads',express.static('uploads'))
app.use("/api",ApiRouter)



const Port=process.env.PORT || 7000
app.listen(Port,()=>{
    console.log(`server is running on`, Port)
})
