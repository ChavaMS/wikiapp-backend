'use strict'

//CREACION DE ENTIDAD JOBS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InvestigationSchema = Schema({
    id: String,
    title: String,
    text: String,
    image: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Investigations', InvestigationSchema);