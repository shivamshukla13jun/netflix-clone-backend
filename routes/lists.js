const listController = require('../controllers/list.controller')
const verify = require('../middlewares/verifyToken')
const router=require('express').Router()

router.route("/")
    .post(verify, listController.Add)
    .put(verify, listController.Update)
    .delete(verify, listController.Delete)
    .get(listController.GetAllList);
module.exports=router