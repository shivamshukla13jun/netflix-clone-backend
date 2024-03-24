const { getApi } = require("../services/services")

module.exports={
    getAnimeSearch:async(req,res,next)=>{
     try {
        const {page,limit,q}=req.query
        await getApi(`?page=${page}&limit=${limit}&q=${q}`).then((response)=>{
            console.log(response)
            return  res.status(200).json({data:response})
        }).catch((error)=>{
            throw new Error(error)
        })
     } catch (error) {
        next(error)
     }
    }
}