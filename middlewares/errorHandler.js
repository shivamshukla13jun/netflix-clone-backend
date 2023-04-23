const { errorHandler } = require("../utils/errorHandler")

const errorhandlermiddleware = function (error, req, res, next) {
    const logFilePath = path.join(__dirname, '../utils/error.log');
    const errorDate = new Date().toISOString();
    console.error(err);
    fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${err.message}\n`);
    const response={statusCode:500,message:error.message}
    return res.status(500).send(response)
}
module.exports=errorhandlermiddleware