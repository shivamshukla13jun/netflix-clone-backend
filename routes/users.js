const router=require('express').Router()
const User=require('../models/User')
const verify=require('../verifyToken')

//  Find Single User
router.get("/find/:id",async(req,res)=>{
    if(req.user.id===req.params.id || req.user.isAdmin){
        try {
            const user=await User.findById({_id:req.params.id})
           const {password,...info}=user._doc;
           res.status(200).json(info)
        } catch (error) { 
            res.status(500).json(error)
            console.log(error)
        }
    }
    else{
        res.status(403).json("you can Deleet Only You Account")
      }
    });



  
// Update User
router.put("/:id",verify,async(req,res)=>{
      if(req.user.id===req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password=CryptoJS.AES.encrypt(req.body.password,
                process.env.SECRET_KEY).toString();
        }
        try {
            const updateduser=await User.findByIdAndUpdate({_id:req.params.id},
                {$set:req.body},
                {new:true}
                )
            res.json(updateduser)
        } catch (error) { 
            res.status(500).json(error)
            console.log(error)
        }
      } else{
        res.status(403).json("you can Update Only You Account")
      }
   

   });

// Delete User Single
router.delete("/:id",verify,async(req,res)=>{
    if(req.user.id===req.params.id || req.user.isAdmin){
        try {
            const updateduser=await User.findByIdAndDelete({_id:req.params.id})
            res.status(200).json("User Has Been Deleted")
        } catch (error) { 
            res.status(500).json(error)
            console.log(error)
        }
    }
    else{
        res.status(403).json("you can Deleet Only You Account")
      }

   

   });

//    Get All Users
router.get("/",verify,async(req,res)=>{
    const query=req.query.new
    if(req.user.isAdmin){
        try {
            const users=query ? await User.find().limit(2): await User.find();
            res.status(200).json(users)
        } catch (error) { 
            res.status(500).json(error)
            console.log(error)
        }
    }
    else{
        res.status(403).json("you are not allowed to see all users")
      }

   

   });
router.get("/stats",async(req,res)=>{
      
    const today=new Date()
    const lastYear=today.setFullYear(today.setFullYear()-1)
     const monthsArray=[
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    try {
        const data=await User.aggregate([
            {
                $project:{
                    month:{$month:"$createdAt"}
                }
            },{
                $group:{
                    _id:"$month",
                    total:{$sum:1}
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
   }
)
module.exports=router