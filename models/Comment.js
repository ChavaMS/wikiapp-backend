'use strict'

//CREACION DE ENTIDAD JOBS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
    id: String,
    text: String,
    user: { type: Schema.ObjectId, ref: 'User' },
    investigation: { type: Schema.ObjectId, ref: 'Investigations' }
});

module.exports = mongoose.model('Comments', CommentSchema);