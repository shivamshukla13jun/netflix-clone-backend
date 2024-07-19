const UserController = require('../controllers/mylists.controller')
const verifytoken=require("../middlewares/verifyToken")
const router=require('express').Router()
router.post("/add",verifytoken,UserController.Add)
router.delete("/delete",verifytoken,UserController.Delete)
router.get('/',verifytoken,UserController.GetAllUser)
module.exports=router