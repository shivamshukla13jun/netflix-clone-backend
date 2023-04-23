const errorHandler=(res,statusCode=500,message="internal server error",data)=>{
    const response={statusCode,message,data}
    return res.status(statusCode).send(response)
}
module.exports={
      errorHandler
     }