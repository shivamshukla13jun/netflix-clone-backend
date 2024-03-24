const router=require('express').Router()
const moviesController = require('../controllers/movies.controller')
const verify=require('../middlewares/verifyToken')
const upload = require('../middlewares/uploadFile')
var uploadMovie = upload.fields([{name:'img',maxCount:1},{name:'imgSm',maxCount:1},{name:'imgTitle',maxCount:1},{name:'trailer',maxCount:1},{name:'video',maxCount:1}])

router.get("/cat",moviesController.Gegenrelist)
router.route("/")
    .post(verify,uploadMovie, moviesController.Add)
    .put(verify,uploadMovie, moviesController.Update)
    .delete(verify, moviesController.Delete)
    .get(moviesController.GetRandomList);

module.exports=router