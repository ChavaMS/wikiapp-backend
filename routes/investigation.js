'user strict'

const express = require('express');
const InvestigationController = require('../controllers/investigation');
const api = express.Router();
const mdAuth = require('../middlewares/authenticate');

//POST
api.post('/add-investigation', mdAuth.ensureAuth, InvestigationController.createInvestigation);
api.post('/update-investigation', mdAuth.ensureAuth, InvestigationController.updateInvestigation);

//GET
api.get('/get-investigations', InvestigationController.getInvestigations);
api.get('/get-investigation/:id', InvestigationController.getInvestigation);
api.get('/get-image/:imageFile', InvestigationController.getImageFile);

//DELETE
api.delete('/delete-investigation/:id', mdAuth.ensureAuth, InvestigationController.deleteInvestigation);


module.exports = api;