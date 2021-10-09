const jwt = require('jsonwebtoken');
const User =require('../models/User'); 

module.exports =(req,res,next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('not Authenticated');
        error.statusCode =401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodeToken;
    try {
        decodeToken = jwt.verify(token,'mysecretkey');
    }catch(e) {
        e.statusCode = 500;
        throw e;
    }
    if(!decodeToken){
        const error = new Error('not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    User.findOne({_id : decodeToken.id}).then(userLog => {
      req.user = userLog;
      next();
    }).catch((err) =>{
    err.statusCode = 500;
    throw err;
    });
    
}
