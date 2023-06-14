const router=require('express').Router()
const userController = require('../controllers/user.controller');
const {authAdminMiddleware,authUserMiddleware} = require('../middlewares/AuthMiddleware')
router.get("/find/:id",userController.SingleUser);
router.put("/:id",authAdminMiddleware,userController.UpdateById);
router.delete("/:id",authAdminMiddleware,userController.DeleteById);
router.get("/",authAdminMiddleware,userController.GetAllList);
router.get("/stats",authAdminMiddleware,userController.UserStats);
module.exports=router