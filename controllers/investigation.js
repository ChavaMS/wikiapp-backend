'use strict'
const Investigation = require('../models/Investigation');
const Comment = require('../models/Comment');
const uploadImage = require('../middlewares/storageInvestigation');
const fs = require('fs');
const path = require('path');

//METODOS
function prueba(req, res) {
    res.status(200).send({ message: 'Probando' });
}

function createInvestigation(req, res) {
    uploadImage(req, res, function () {
        var params = req.body;

        var title = params.title;
        var text = params.text;
        var userId = params.user;
        var image = req.file.filename;

        var investigation = new Investigation();
        investigation.title = title;
        investigation.text = text;
        investigation.image = image;
        investigation.user = userId

        investigation.save((err, investigation) => {
            if (err) return res.status(400).send({ message: 'Error al guardar la investigación' });

            if (!investigation) return res.status(400).send({ message: 'Error al guardar la investigación' });

            return res.status(200).send({ message: 'Investigación guardada con éxito' });
        });
    });
}

function getInvestigations(req, res) {
    Investigation.find({}).exec().then((response) => {
        if (!response) return res.status(400).send({ message: 'No hay resultados que mostrar' });
        return res.status(200).send({ response: response });
    }).catch(err => {

    });
}

function getInvestigation(req, res) {
    var id = req.params.id;

    Investigation.find({ _id: id }).exec().then((response) => {
        if (!response) return res.status(400).send({ message: 'No se encontró la investigación' });

        return res.status(200).send({ investigation: response[0] });
    }).catch((error) => {
        console.log(error);
    });
}

function updateInvestigation(req, res) {
    uploadImage(req, res, function () {
        var params = req.body;

        var title = params.title;
        var text = params.text;
        var userId = params.id;
        var image;

        if (req.file && req.file.filename) {
            image = req.file.filename;
            console.log(params.old_image);
            removeFileOfUploads(params.old_image);
        } else {
            image = params.image;
        }
        var investigation = {
            title: title,
            text: text,
            image: image
        }
        Investigation.findByIdAndUpdate(userId, investigation, { new: true }, (error, response) => {
            if (error) return res.status(404).send({ message: 'Error al actualizar la investigación' });
            if (!response) return res.status(404).send({ message: 'Error al actualizar la investigación' });

            return res.status(200).send({ message: 'Investigación actualizada con éxito' });
        });
    });
}

function deleteInvestigation(req, res) {
    var invId = req.params.id;

    Investigation.find({ _id: invId }).exec().then(investigation => {
        if (!investigation) return res.status(400).send({ message: 'Hubo un problema al borrar la investigación' });

        if (investigation) {
            removeFileOfUploads(investigation[0].image);

            Investigation.deleteOne({ _id: invId }).exec().then((response) => {
                if (!response) return res.status(400).send({ message: 'Hubo un problema al borrar la investigación' });

                Comment.deleteMany({ investigation: invId }).exec().then(async response => {
                    if (response) return res.status(200).send({ message: 'Investigación borrada con éxito' });
                }).catch(error => {
                    if (error) return res.status(404).send({ message: 'Error al borra los comentarios' });
                });
            }).catch(error => {
                if (error) return res.status(404).send({ message: 'Error al borra la investigación' });
            });
        }
    }).catch(error => {
        if (error) return res.status(404).send({ message: 'Error al borra la investigación' });
    });

}

function removeFileOfUploads(file) {
    fs.unlink('./uploads/investigation-images/' + file, (err) => {
        console.log(err);
    });
}


function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = 'uploads/investigation-images/' + imageFile;
    fs.exists(path_file, (exists) => {
        if (exists) {
            //console.log(path_file);
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}


module.exports = {
    createInvestigation,
    getInvestigations,
    getImageFile,
    getInvestigation,
    deleteInvestigation,
    updateInvestigation
}