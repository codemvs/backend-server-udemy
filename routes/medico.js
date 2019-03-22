var express = require('express');
var mdAutentication = require('../middlewares/autentication');

var app = express();

var Medico = require('../models/medico');

// ==================================
// Obtener medicos
// ==================================

app.get('/', (req, res) => {
    Medico.find({})
        .populate('hospital') // inner join tabla hospital
        .populate('usuario', 'nombre email') // inner join tabla usuario
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando médicos',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medicos
            });
        });
});

// ==================================
// Crear médico
// ==================================
app.post('/', mdAutentication.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = req.usuario;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoAgregado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un médico',
                errors: err
            });
        }
        res.status(201).json({ // created 201
            ok: true,
            medico: medicoAgregado
        });

    });
});

// ==================================
// Actualizar medico
// ==================================

app.put('/:id', mdAutentication.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = req.usuario;
    var id = req.params.id;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error error al buscar médico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro un médico con el id: ' + id,
                errors: { message: 'No se encontro un médico con el ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar médico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoActualizado
            });
        });

    });
});

// ==================================
// Eliminar un médico
// ==================================

app.delete('/:id', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar un médico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un médico con el id: ' + id,
                errors: { message: 'No existe un médico con el ID' }
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});
module.exports = app;