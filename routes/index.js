var router = require('express').Router();
const authRoute=require('./auth')
const userRoute=require('./users')
const movieRoute=require('./movies')
const listRoute=require('./lists');
router.use('/auth',authRoute)
router.use('/users',userRoute)
router.use('/movies',movieRoute)
router.use('/lists',listRoute)
router.get('/',(req,res)=>{
    res.send("Welcome to express app!");
})
module.exports = router