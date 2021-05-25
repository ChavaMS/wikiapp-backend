const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt.js');


function saveUser(req, res) {
    //DATOS
    var params = req.body;
    var newUser = new User();
    if (params.name && params.surname && params.email && params.password) {
        try {
            //DATOS BASICOS
            newUser.name = params.name;
            newUser.surname = params.surname;
            newUser.email = params.email.toLowerCase();
            newUser.password = params.password;


            User.find({
                email: newUser.email.toLowerCase()
            }).exec((err, user) => {
                if (err) {
                    return res.status(500).send({ message: 'Error al guardar el usuario' });
                }

                if (user && user.length >= 1) {
                    return res.status(200).send({ message: 'El usuario ya existe' });
                } else {
                    //Cifra la contrasena y me guarda los datos
                    bcrypt.hash(params.password, null, null, (err, hash) => {

                        newUser.password = hash;

                        newUser.save((err, userSaved) => {
                            if (err) {
                                return res.status(501).send({ message: 'Error al guardar el usuario' });
                            }
                            if (userSaved) {
                                return res.status(200).send({ user: userSaved });
                            } else {
                                return res.status(502).send({ message: 'Error al guardar el usuario' });
                            }
                        });
                    });
                }
            });
        } catch (error) {
            return res.status(503).send({ message: 'Error al guardar el usuario' });
        }
    } else {
        return res.status(504).send({ message: 'Error al guardar el usuario' });
    }
}

function login(req, res) {
    var params = req.body;

    var email = params.email.toLowerCase();
    var password = params.password;

    if (email && password) {
        User.findOne({ email: email }, (err, user) => {
            if (err) return res.status(404).send({ message: 'Error en la peticion' });
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        var userId = user._id;

                        //Devolver datos de usuario
                        if (params.gettoken) {
                            //Actualizamos la ultima vez que se conectó el usuario
                            User.find({ _id: userId }, (err, userUpdated) => {
                                if (err) return res.status(500).send({ message: 'Error en la petición' });

                                if (!userUpdated) return res.status(404).send({ message: 'No se ha podido iniciar sesion' });

                                //generar y devolver token 
                                return res.status(200).send({
                                    token: jwt.createToken(user)
                                });
                            });

                        } else {
                            User.find({ _id: userId }, (err, userUpdated) => {
                                if (err) return res.status(500).send({ message: 'Error en la petición' });

                                if (!userUpdated) return res.status(404).send({ message: 'No se ha podido iniciar sesion' });

                                //Devolver datos en claro
                                user.password = undefined;
                                return res.status(200).send({ user });
                            });
                        }

                    } else {
                        return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
                    }
                });
            } else {
                return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
            }
        });
    }

}

module.exports = {
    saveUser,
    login
}