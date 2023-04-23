const router=require('express').Router()
const userController = require('../controllers/user.controller');
const verify=require('../middlewares/VerifyUser')
router.get("/find/:id",userController.SingleUser);
router.put("/:id",verify,userController.UpdateById);
router.delete("/:id",verify,userController.DeleteById);
router.get("/",verify,userController.GetAllList);
router.get("/stats",userController.UserStats);
module.exports=router