const Comment = require('../models/Comment');



function createComment(req, res) {
    var params = req.body;

    var comment = new Comment();
    comment.text = params.text;
    comment.user = params.user;
    comment.investigation = params.investigation;

    comment.save((error, investigation) => {
        if (error) return res.status(400).send({ message: 'Error al guardar el comentario' });
        if (!investigation) return res.status(400).send({ message: 'Error al guardar el comentario' });

        return res.status(200).send({ message: 'Comentario guardado con éxito' });
    });
}

function getComments(req, res) {
    var params = req.params;

    Comment.find({ investigation: params.idInv }).populate('user', 'name surname _id').exec().then(response => {
        if (!response) return res.status(400).send({ message: 'Error al obtener el comentario' });

        return res.status(200).send({ comments: response });
    }).catch(error => {
        if (error) return res.status(400).send({ message: 'Error al obtener el comentario' });
    });
}

function deleteComment(req, res) {
    var id = req.params.id;

    Comment.deleteOne({ _id: id }).exec().then(response => {
        if (!response) return res.status(400).send({ message: 'Hubo un problema al borrar el comentario' });

        return res.status(200).send({ message: 'Comentario borrada con éxito' });

    }).catch(error => {
        if (error) return res.status(400).send({ message: 'Hubo un problema al borrar el comentario' });
    });
}


module.exports = {
    createComment,
    getComments,
    deleteComment
}