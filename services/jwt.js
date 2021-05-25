'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'miProyectDeDesarrolloWeb';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        exp: moment().add(1, "days").unix()
    };
    
    //Se encripta el payload
    return jwt.encode(payload, secret);
};