'user strict'

const express = require('express');
const CommentController = require('../controllers/comment');
const api = express.Router();
const mdAuth = require('../middlewares/authenticate');

//POST
api.post('/add-comment', mdAuth.ensureAuth, CommentController.createComment);

//GET
api.get('/get-comments/:idInv', CommentController.getComments);

//DELETE
api.delete('/delete-comment/:id', mdAuth.ensureAuth, CommentController.deleteComment);

module.exports = api;