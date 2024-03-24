exports.ErrorHandler = (err, req, res, next) => {
    // console.log("name>>>>>>",err.name,err)
    let errStatus = err.statusCode || 500;
    let errMsg = err.message || 'Something went wrong';
try {
 
    if (err.code == 11000) {
        errMsg = Object.keys(err.keyValue)[0] + " already exists.";
    }
    if(err.name === "ValidationError"){
        errMsg = Object.values(err.errors).map(value => value.message)?.toString();      
          console.log("validation error hai",errMsg?.toString())
    }
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
} catch (error) {
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}
}