const List=require('../models/List')
const mongoose=require("mongoose")
module.exports=ListController={
    Add:async(req, res,next)=>{
          try {
              const newList= new  List(req.body)
               const savedList =  await newList.save()
              res.status(200).json(savedList)
          } catch (error) { 
              res.status(500).json(error.message)
              console.log(error)
          }
    
  
     },
    Update:async(req, res,next)=>{
       
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
     
  
     },
    Delete:async(req, res,next)=>{
      
          try {
              await List.findByIdAndDelete(req.params.id)
              res.status(200).json("Movies Deleted successfully")
          } catch (error) { 
              res.status(500).json(error)
              console.log(error)
          }
    
  
     },
      GetAllList :async (req, res, next) => {
        try {
            const typeQuery = req.query.type;
            const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
            const limit = parseInt(req.query.limit) || 10; // Number of documents per page, default to 10 if not provided
    
            const matchStage = {};
            if (typeQuery) {
                matchStage["type"] = typeQuery;
            }
    
            const listPipeline = [
                { $match: matchStage },
                {
                    $facet: {
                        data: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $lookup: {
                                    from: "movies",
                                    foreignField: "_id",
                                    localField: "content",
                                    as: "content"
                                }
                            },
                            // { $unwind: "$content" },  // Unwind the content array
                            {
                                $lookup: {
                                    from: "categories",
                                    foreignField: "_id",
                                    localField: "content.genre",
                                    as: "genreDetails"
                                }
                            },
                            {
                                $addFields: {
                                    "content.genre": "$genreDetails"  // Replace genre with populated data
                                }
                            },
                            {
                                $project: {
                                    genreDetails: 0  // Remove the temporary genreDetails field
                                }
                            }
                        ],
                        totalCount: [
                            { $count: "total" }
                        ]
                    }
                }
            ];
    
            const result = await List.aggregate(listPipeline);
    
            // Extract data and totalCount from result
            const data = result[0].data;
            const totalCount = result[0].totalCount.length > 0 ? result[0].totalCount[0].total : 0;
    
            res.status(200).json({
                total: totalCount,
                page: page,
                pageSize: limit,
                totalPages: Math.ceil(totalCount / limit),
                data: data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    

}

