const listController = require('../controllers/list.controller')
const {authAdminMiddleware,authUserMiddleware} = require('../middlewares/AuthMiddleware')
const router=require('express').Router()
router.post("/",authAdminMiddleware,listController.Add)
router.put("/:id",authAdminMiddleware,listController.Update)
router.delete("/:id",authAdminMiddleware,listController.Delete)
router.get('/',listController.GetAllList)
module.exports=router