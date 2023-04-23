module.exports={
    PasswordBlackCheck:async(req)=>{
        
      return  req.body.password || req.body.pwd || req.body.user_password || req.body.login_password || authentication_password
    }
}