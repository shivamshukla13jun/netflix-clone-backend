const router=require('express').Router()
const moviesController = require('../controllers/movies.controller')
const verifyToken = require('../middlewares/VerifyUser')

const upload = require('./middlewares/uploadFile')
router.get("/find/:id",moviesController.FindById)
var uploadMovie = upload.fields([{name:'img',maxCount:1},{name:'imgSm',maxCount:1},{name:'imgTitle',maxCount:1},{name:'trailer',maxCount:1},{name:'video',maxCount:1}])
router.post("/add",uploadMovie,moviesController.Add)

router.post("/multipleadd",uploadMovie,moviesController.MultipleAdd)
router.put("/update/:id",verifyToken,moviesController.UpdateById)
router.put("/update",verifyToken,moviesController.Update)
router.delete("/delete/:id",verifyToken,moviesController.Delete)
router.post("/random",moviesController.GetRandomList)
router.get("/cat",moviesController.Gegenrelist)
router.get("/",moviesController.GetAllList)
router.post("/addcsv",async(req,res)=>{
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
    const Mymodel=require('./models/MyModel')
  
    Mymodel.insertMany(results, { ordered: false, rawResult: true })
    .then((result) => {
      console.log('Inserted documents:', result.insertedCount);
      res.send(JSON.parse(result))
      console.log('Skipped documents:', result.writeErrors.length);
    })
    .catch((err) => res.send(err.message));
  })
module.exports=router