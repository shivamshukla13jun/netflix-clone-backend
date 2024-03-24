const jikanApicontroller=require("../controllers/anime.controller")
const router=require("express").Router()

// getAnimeSearch
router.get("/getAnimeSearch",jikanApicontroller.getAnimeSearch)

module.exports=router