const router=require('express').Router()
const userController = require('../controllers/user.controller');
const verify=require('../middlewares/verifyToken')
router.get("/:id",userController.SingleUser);
router.route("/")
    .put(verify, userController.UpdateById)
    .delete(verify, userController.DeleteById)
    .get(verify,userController.GetAllList);
module.exports=router