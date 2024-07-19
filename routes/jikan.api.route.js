const jikanApicontroller=require("../controllers/anime.controller")
const router=require("express").Router()

// getAnimeSearch
router.get("/getAnimeSearch",jikanApicontroller.getAnimeSearch)
router.get("/getRandomAnime",jikanApicontroller.getRandomAnime)
router.get("/getAnimeById/:id",jikanApicontroller.getAnimeById)

module.exports=router