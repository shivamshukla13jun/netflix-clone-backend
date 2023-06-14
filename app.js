require('dotenv').config();
const ConnectDb=require('./utils/db');
const server = require("./server");

server.listen(process.env.PORT || 7000,()=>{
    ConnectDb()
})
