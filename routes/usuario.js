var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAutentication = require('../middlewares/autentication');

//var SEED = require('../config/config').SEED; // SEED token

var app = express();

var Usuario = require('../models/usuario');
// ==================================
// Obtener todos los usuarios
// ==================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde) // saltar 
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        erros: err
                    }); // respuesta ok

                }
                // Estado o código de la petición
                Usuario.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error conteo total usuarios',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    }); // respuesta ok
                });

            });
});


// ==================================
// Actualizar usuario
// ==================================
app.put('/:id', [mdAutentication.verificaToken,mdAutentication.verificaADMIN_O_MismoUsuario], (req, res) => {
    var id = req.params.id;
    var body = req.body;

    // verificar si un usuario existe
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        // evaluar si viene un usuario
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe',
                errors: { meesage: 'No existe un usuario con ese ID' }
            });
        }

        // Si encontro un usuario
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Erro al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';
            //Ejecuión exitosa.
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });

});

// ==================================
// Crear un nuevo usuario
// ==================================
app.post('/', (req, res) => {
    var body = req.body;
    // Crear nuevo usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // encryptar contraseña
        img: body.img,
        role: body.role
    });
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                erros: err
            });
        }
        usuarioGuardado.password = ':)';
        res.status(201).json({ // usuario creado
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });

});

// ==================================
// Borrar un usuario por id
// ==================================
app.delete('/:id',[mdAutentication.verificaToken,mdAutentication.verificaADMIN_ROLE], (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        // Si ocurrio un error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }
        // Si no viene un usuario
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        // Respuesta correcta
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;