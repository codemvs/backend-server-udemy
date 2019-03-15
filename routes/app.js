var express = require('express');

var app = express();


app.get('/', (req, res, next) => {
    // Estado o código de la petición
    res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente'
        }) // respuesta ok

});

module.exports = app;