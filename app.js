var path=require('path')
require('dotenv').config();
require('./utils/db');
const cors = require('cors');
const { app,express } = require('./apis/api');
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("./apis/api")
const Port=process.env.PORT || 4000
app.listen(Port,()=>{
    console.log(`server is running on`, Port)
})

app.get("/attack",(req,res)=>{
  const { default: axios } = require('axios')
  (async () => {
    const url = "https://checkip.amazonaws.com/";
    const response = await axios(url);
    res.send(`My public IP address is: ${response.data.trim()}`)
    console.log(`My public IP address is: ${response.data.trim()}`);
  })();
})
