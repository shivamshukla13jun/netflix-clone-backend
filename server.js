const express = require('express')
const app = express()
const server=require('http').createServer(app)
const history = require('connect-history-api-fallback');
var path=require('path')
const cors = require('cors');
const ApiRouter= require('./routes');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/uploads',express.static('uploads'))
app.use("/api",ApiRouter)
module.exports=server