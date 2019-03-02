// Punto de entrada para la aplicación
// Requires
var express = require('express');
var mongoose = require('mongoose');




// Inicializar variables
var app = express();

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos puerto 3000: \x1b[32m%s\x1b[0m', ' online');


});


// Rutass
app.get('/', (req, res, next) => {
    // Estado o código de la petición
    res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente'
        }) // respuesta ok


});


// Escuchar peticion
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' online');
});