const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports =function (req,res,next) {
    var token = req.headers.authorization.split('.')[1];
 if(token){
     console.log(token);
        jwt.verify('token',config.secret,function (err,decoded) {
            if(err){
                 res.json({
                     error:err,
                    success:false,
                    message:"failed to authenticate token",
                });
            }else{
                req.decoded=decoded;
                next();
            }
        })
    }else{
        res.status(403).json({
            success:false,
            message:"no token provided "
        });
    }
}