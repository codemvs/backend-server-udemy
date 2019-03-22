var express = require('express');

var mdAutentication = require('../middlewares/autentication');

var app = express();

var Hospital = require('../models/hospital');

// ==================================
// Crear hospital
// ==================================
app.post('/', mdAutentication.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

// ==================================
// Obtener todos los hospitales
// ==================================
app.get('/', (req, res) => {
    Hospital.find({})
        .populate('usuario', 'nombre email') // inner join usurios [tabla, campos]
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales
                });
            }
        );
});

// ==================================
// Actualizar Hospital
// ==================================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    // Verificar si existe el id del hospital
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        // evaluar si se econtro un hospital correspondiente al id
        if (!hospital) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',
                    errors: { message: 'No existe un hospital con el ID' }
                });
            }
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});

// ==================================
// Borrar hospital por id
// ==================================
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un hospital con este id ' + id,
                    errors: { message: 'No existe un hospital con ese id' }
                });
            }
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});
module.exports = app;