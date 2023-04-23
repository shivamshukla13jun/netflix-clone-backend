const listController = require('../controllers/list.controller')
const verify = require('../middlewares/VerifyUser')
const router=require('express').Router()
router.post("/add",verify,listController.Add)
router.put("/update",verify,listController.Update)
router.delete("/delete/:id",verify,listController.Delete)
router.get('/',listController.GetAllList)
module.exports=router