const express = require('express')
const app = express()
const Movie=require('./models/Movie')
var path=require('path')
require('dotenv').config();
require('./utils/db');
const cors = require('cors');
const ApiRouter= require('./apis/api');
const { default: axios } = require('axios');
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'},{extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads',express.static('uploads'))
app.use("/api",ApiRouter)

const Port=process.env.PORT || 7000
app.listen(Port,()=>{
    console.log(`server is running on`, Port)
})
app.get('/', (req, res)=>{
    const nodemailer = require('nodemailer');
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shivamshukla13jun@gmail.com',
            pass: 'tljdumljbfbaujap'
        }
    });
    
    let mailDetails = {
        from: 'shivamshukla13jun@gmail.com',
        to: 'shivam13jun@gmail.com',
        subject: 'Test mail',
        text: 'Node.js testing mail for GeeksforGeeks'
    };
    
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            res.send('Error Occurs');
        } else {
           res.send('Email sent successfully');
        }
    });
    
})

