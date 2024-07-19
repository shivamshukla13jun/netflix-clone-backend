const HeroCarousel = require('../controllers/HeroCarousel.controller')
const verify = require('../middlewares/verifyToken')
const router=require('express').Router()
const multer = require("multer");
var path=require('path')
var upload= multer({
    storage:multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,"banner")
        },
        filename:function(req,file,cb){
            cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname)); 
        }
        
    }),
})
var uploadMovie = upload.fields([
    { name: "image", maxCount: 1 },
  ]);
router.route("/")
    .post(uploadMovie,HeroCarousel.Add)
    .put( HeroCarousel.Update)
    .delete(HeroCarousel.Delete)
    .get(HeroCarousel.GetRandomList);
module.exports=router