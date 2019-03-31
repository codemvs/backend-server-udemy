var express = require('express');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

var app = express();

// ==================================
// Busqueda por collección
// ==================================
app.get("/coleccion/:tabla/:busqueda", (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var tablas = ['hospitales', 'medicos', 'usuarios'];
    var tableSearch = tablas.find((e) => e == tabla);

    if (!tableSearch) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipos de busqueda válidos: ' + tablas,
            errors: { message: 'Tipo de tabla/collecion no válido' }
        });
    }
    tableSearch = tableSearch.charAt(0).toUpperCase() + tableSearch.slice(1);

    eval(`buscar${tableSearch}(busqueda,regex)`).then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// ==================================
// Busqueda general
// ==================================

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(resp => {
            res.status(200).json({
                ok: true,
                hospitales: resp[0],
                medicos: resp[1],
                usuarios: resp[2]
            });
        });

});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }

            });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al consultar usuario', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}


module.exports = app;