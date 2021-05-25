'use strict'

//CREACION DE ENTIDAD JOBS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    id: String,
    name: String,
    surname: String,
    email: String,
    password: String
});

module.exports = mongoose.model('User', UserSchema);