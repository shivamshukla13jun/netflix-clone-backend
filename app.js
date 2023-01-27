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

app.post("/attack",async(req,res)=>{
            const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            const d = new Date();
            const DeviceDetector = require('node-device-detector');
            const detector = new DeviceDetector({
            clientIndexes: true,
            deviceIndexes: true,
            deviceAliasCode: false,
             });
           const useragent =req.headers['user-agent']
           const result = detector.detect(useragent);
           const {client,os,device}=result
   let obj {
           date:d.getDate()+" "+month[d.getMonth()]+ " "+d.getFullYear(),
           time:d.toLocaleTimeString(),
           type:"SQLI",
           browser:client.name+ client.version || "",
           browser_code:client.name || "",
           os:os.name+os.version+os.platform || "",
           useragent,
           latitude: "",
           longitude:"",
           device:device.type,
   }
   res.send(req.body)
})
