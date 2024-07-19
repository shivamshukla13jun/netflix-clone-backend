const Genre = require('../controllers/genre.controller')
const verify = require('../middlewares/verifyToken')
const router=require('express').Router()

router.route("/")
    .post(Genre.Add)
    .put( Genre.Update)
    .delete(Genre.Delete)
    .get(Genre.Get);
module.exports=router