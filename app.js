'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//Cargar rutas
const investigation_routes = require('./routes/investigation');
const user_routes = require('./routes/user');
const comment_routes = require('./routes/comment');


//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cors
app.use(cors());

//Rutas
app.use('/api', investigation_routes);
app.use('/api', user_routes);
app.use('/api', comment_routes);


//Exportar
module.exports = app;