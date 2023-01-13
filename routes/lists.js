const router=require('express').Router()
const List=require('../models/List')
const verify=require('../verifyToken')


// add List
router.post("/add",verify,async(req,res)=>{
      if(req.user.isAdmin){
        try {
            const newList= new  List(req.body)
             const savedList =  await newList.save()
            res.status(200).json(savedList)
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
// UpdAte List
router.put("/update",verify,async(req,res)=>{
      if(req.user.isAdmin){
        try {
            console.log(req.body)
            const newList= await List.findByIdAndUpdate({_id:req.body._id}
               ,{$set:req.body},
                {new:true}
                )
             const savedList =  await newList.save()
            res.status(200).json(savedList)
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
// delete List
router.delete("/delete/:id",verify,async(req,res)=>{
      if(req.user.isAdmin){
        try {
            await List.findByIdAndDelete(req.params.id)
            res.status(200).json("Movies Deleted successfully")
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

// get all list
router.get('/',verify,async(req,res)=>{
    const typeQuery=req.query.type
    const genreQuery=req.query.genre
    let list=[]
    
    try {
        if(typeQuery){
            if(genreQuery){
                list=await List.aggregate([
                    {$sample:{size:10}  },
                    {$match:{type:typeQuery,genre:genreQuery}}
                ])
            }else{
                list=await List.aggregate([
                    {$sample:{size:10}  },
                    {$match:{type:typeQuery}}
                ])
            }

        }else{
            list=await List.aggregate([{$sample:{size:10}}])
           
        }
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports=router