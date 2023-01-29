var router = require('express').Router();
const authRoute=require('../routes/auth')
const userRoute=require('../routes/users')
const movieRoute=require('../routes/movies')
const listRoute=require('../routes/lists');
router.use('/auth',authRoute)
router.use('/users',userRoute)
router.use('/movie',movieRoute)
router.use('/list',listRoute)
router.get('/',(req,res)=>{
    res.send("Welcome to express app!");
})
module.exports = router