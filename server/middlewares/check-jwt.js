const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res, next) {
    let token = req.headers["authorization"];

    if (token) {
        jwt.verify(token, config.secret, function(err, user) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            } else {

                req.decoded = user;
                next();

            }
        });

    } else {

        res.status(403).json({
            success: false,
            message: 'No token provided'
        });

    }
}