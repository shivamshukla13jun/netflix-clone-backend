var express = require('express');
var app=express();
var path=require('path')
// Import authroutes
const authRoute=require('../routes/auth')
const userRoute=require('../routes/users')
const movieRoute=require('../routes/movies')
const listRoute=require('../routes/lists')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads',express.static('uploads'))
app.get("/",(req,res)=>{
    res.send("hello world!");
})
app.use('/api/auth',authRoute)
app.use('/api/users',userRoute)
app.use('/api/movie',movieRoute)
app.use('/api/list',listRoute)
module.exports = {app,express}