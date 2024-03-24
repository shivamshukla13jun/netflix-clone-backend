const UserController = require('../controllers/mylists.controller')
const {authAdminMiddleware,authUserMiddleware} = require('../middlewares/AuthMiddleware')
const router=require('express').Router()
router.post("/add",authUserMiddleware,UserController.Add)
router.delete("/delete",authUserMiddleware,UserController.Delete)
router.get('/',authUserMiddleware,UserController.GetAllUser)
module.exports=router