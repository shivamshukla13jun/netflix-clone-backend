const express = require('express')
const app = express()
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
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json({limit: '50mb'}));
app.use(require('./middlewares/middleware'))
app.use('/uploads',express.static('uploads'))
app.use("/api",ApiRouter)
app.post("/add",async(req,res)=>{
  const Mymodel=require('./models/MyModel')
  const newData = [
    { title: 'Document 1', content: 'Content 1' },
    { title: 'Document 2', content: 'Content 2' },
    { title: 'Document 3', content: 'Content 3' },
    { title: 'Document 4', content: 'Content 4' },
  ];
  Mymodel.insertMany(newData, { ordered: false, rawResult: true })
  .then((result) => {
    console.log('Inserted documents:', result.insertedCount);
    res.send(JSON.parse(result))
    console.log('Skipped documents:', result.writeErrors.length);
  })
  .catch((err) => res.send(err.message));
})
app.post("/addcsv",async(req,res)=>{
  const fs = require('fs');
 const csv = require('csv-parser');
 const results = [];
 fs.createReadStream('./animes.csv')
  .pipe(csv())
  .on('data', (data) => {
    results.push(data);
  })
  .on('end', () => {
    console.log(results);
  });
  // const Mymodel=require('./models/MyModel')
  // const newData = [
  //   { title: 'Document 1', content: 'Content 1' },
  //   { title: 'Document 2', content: 'Content 2' },
  //   { title: 'Document 3', content: 'Content 3' },
  //   { title: 'Document 4', content: 'Content 4' },
  // ];
  // Mymodel.insertMany(newData, { ordered: false, rawResult: true })
  // .then((result) => {
  //   console.log('Inserted documents:', result.insertedCount);
  //   res.send(JSON.parse(result))
  //   console.log('Skipped documents:', result.writeErrors.length);
  // })
  // .catch((err) => res.send(err.message));
})

const Port=process.env.PORT || 7000
app.listen(Port,()=>{
    console.log(`server is running on`, Port)
})
