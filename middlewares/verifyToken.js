const jwt=require('jsonwebtoken')


function verify(req,res,next) {
    const authHader=req.headers.token || req.body.token || req.query.token || req.cookies || req.cookies.token;
    if(authHader){
        const token=authHader.split(" ")[1]
        jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
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