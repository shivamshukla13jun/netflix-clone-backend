
function CorsPolicy(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // res.setHeader('x-forwarded-for','46.165.250.81')
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  }
  module.exports=CorsPolicy