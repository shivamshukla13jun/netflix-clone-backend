
const sendResponse=(res,statusCode=500,message="Success",data)=>{
    const response={statusCode,message,data}
    return res.status(statusCode).json(response)
}
const ErrorHandler=(res,statusCode=500,message="Success",data)=>{
    const response={statusCode,message,data}
    return res.status(statusCode).json(response)
}
module.exports={
    sendResponse,
    ErrorHandler
}