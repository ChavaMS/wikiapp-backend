'user strict'

const express = require('express');
const api = express.Router();
const UserController = require('../controllers/user');

//POST
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);


module.exports = api;