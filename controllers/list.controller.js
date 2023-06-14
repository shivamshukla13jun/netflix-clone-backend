const List=require('../models/List')

module.exports=ListController={
    Add:async(req,res)=>{
          try {
               const newList= new  List(req.body)
               const savedList =  await newList.save()
              res.status(200).json(savedList)
          } catch (error) { 
              res.status(500).json(error)
              console.log(error)
          }
     
  
     },
    Update:async(req,res)=>{
        if(req.user.isAdmin){
          try {
              console.log("fffff",req.body)
              const newList= await List.findByIdAndUpdate({_id:req.params.id}
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
  
     },
    Delete:async(req,res)=>{
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
  
     },
    GetAllList:async(req,res)=>{
        const typeQuery=req.query.type
        const genreQuery=req.query.genre
        let list=[]
        try {
                if(genreQuery){
                    list=await List.aggregate([
                        { "$lookup": {
                            "from": "movies",
                            "foreignField": "_id",
                            "localField": "content",
                            "as": "content"
                          }},
                        {$match:{type:typeQuery,genre:genreQuery}}
                    ])
                }
                else if(typeQuery){
                    list=await List.aggregate([
                        { "$lookup": {
                            "from": "movies",
                            "foreignField": "_id",
                            "localField": "content",
                            "as": "content"
                          }},
                        {$match:{type:typeQuery}}
                    ])
                }
                else{
                    list=await List.aggregate([
                        {"$lookup": {
                            "from": "movies",
                            "foreignField": "_id",
                            "localField": "content",
                            "as": "content"
                          }}
                    ])
                }
    
            
            res.status(200).json(list)
        } catch (error) {
            res.status(500).json(error)
        }
    },

}

