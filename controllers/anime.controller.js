const { getApi } = require("../services/services")

module.exports={
    getAnimeSearch:async(req,res,next)=>{
     try {
        const {page,limit,q}=req.query
        await getApi(`/anime?page=${page}&limit=${limit}&q=${q}`).then((response)=>{
            console.log(response)
            return  res.status(200).json({data:response})
        }).catch((error)=>{
            throw new Error(error?.response)
        })
     } catch (error) {
        next(error)
     }
    },
    getRandomAnime:async(req,res,next)=>{
     try {
        await getApi(`/random/anime`).then((response)=>{
            console.log(response)
            return  res.status(200).json({data:response})
        }).catch((error)=>{
            throw new Error(error?.response)
        })
     } catch (error) {
        next(error)
     }
    },
    getAnimeById:async(req,res,next)=>{
     try {
        const {id}=req.params
        await getApi(`/anime/${id}`).then((response)=>{
            console.log(response)
            return  res.status(200).json({data:response})
        }).catch((error)=>{
            throw new Error(error?.response)
        })
     } catch (error) {
        next(error)
     }
    },

}