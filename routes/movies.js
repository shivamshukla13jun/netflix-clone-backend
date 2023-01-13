const router=require('express').Router()
const Movie=require('../models/Movie')
const verify=require('../verifyToken')
const upload = require('./middlewares/uploadFile')

// Get Single
router.get("/find/:id",async(req,res)=>{
      
    try {
            const updatedMovie=await Movie.findById({_id:req.params.id})
            res.json(updatedMovie)
        } catch (error) { 
            res.status(500).json(error)
            console.log(error)
        }

   }
)

// add movie
var uploadMovie = upload.fields([{name:'img',maxCount:1},{name:'imgSm',maxCount:1},{name:'imgTitle',maxCount:1},{name:'trailer',maxCount:1},{name:'video',maxCount:1}])
router.post("/add",verify,uploadMovie,async(req,res)=>{
      if(req.user.isAdmin){
       console.log(req.files)
        try {
            const newMovie= new  Movie(
                {   title:req.body.title,
                    desc:req.body.desc,
                    img:req.files.img[0].filename,
                    imgTitle:req.files.img[0].filename,
                    imgSm:req.files.imgSm[0].filename,
                    trailer:req.files.trailer[0].filename,
                    video:req.files.video[0].filename,
                    year:req.body.year,
                    limit:req.body.limit,
                    genre:req.body.genre,
                    isSeries:req.body.isSeries
                }
            )
             const savedMovie =  await newMovie.save()
             console.log(savedMovie)
            res.status(200).json(savedMovie)
        } catch (error) { 
            res.status(500).json(error)
            console.log(error)
        }
    }
    else{
        res.status(403).json("you are not allowed")
      }

   }
)

// update
router.put("/update/:id",verify,async(req,res)=>{
    if(req.user.isAdmin){
        try {
            const updatedMovie=await Movie.findByIdAndUpdate({_id:req.params.id},
                {$set:req.body},
                {new:true}
                )
            res.status(201).json(updatedMovie)
        } catch (error) { 
            res.status(500).json(error)
            console.log(error)
        }
    }
    else{
        res.status(403).json("you are not allowed")
      }
   }
)
// update all
router.put("/update",verify,async(req,res)=>{
    if(req.user.isAdmin){
        try {
            const {img,imgTitle,imgSm,trailer,video}=req.body
            const updatedMovie=await Movie.findOneAndUpdate({year},
                {$set:req.body},
                {new:true}
                )
            res.status(201).json(updatedMovie)
        } catch (error) { 
            res.status(500).json(error)
            console.log(error)
        }
    }
    else{
        res.status(403).json("you are not allowed")
      }
   }
)
//   Delete 
router.delete("/delete/:id",verify,async(req,res)=>{
    if(req.user.isAdmin){
      try {
       await Movie.findByIdAndDelete(req.params.id)
          res.status(200).json("Mvie has been deleted")
      } catch (error) { 
          res.status(500).json(error)
          console.log(error)
      }
  }
  else{
      res.status(403).json("you are not allowed")
    }

 }
)

// get random movies
router.get("/random",async(req,res)=>{
      const type=req.query.type
      let movie
    try {
        if(type==="series"){
            movie=await Movie.aggregate([
                {$match:{isSeries:true}},
                {$sample:{size:1}},
            ])
        }else{
            movie=await Movie.aggregate([
                {$match:{isSeries:false}},
                {$sample:{size:1}},
            ])
        }
         res.status(200).json(movie)
        } catch (error) { 
            res.status(500).json(error)
            console.log(error)
        }

   }
)

//   Get All 
router.get("/",verify,async(req,res)=>{
    if(req.user.isAdmin){
      try {
      const movies= await Movie.find()
          res.status(200).json(movies)
      } catch (error) { 
          res.status(500).json(error)
          console.log(error)
      }
  }
  else{
      res.status(403).json("you are not allowed")
    }

 }
)
module.exports=router