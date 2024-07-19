const jwt=require('jsonwebtoken')
console.log("SECRET_KEY",process.env.SECRET_KEY)

function verify(req,res,next) {
    const authHader=req.headers.authorization
  
    if(authHader){
        const token=authHader.split(" ")[1]
        console.log("token",token)
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err) res.status(403).json("Token is not valid")
                req.user=user;
                next()
                console.log(err)
        })
    }else{
        return res.status(401).json("you are not authenticated")
    }
}
module.exports=verify