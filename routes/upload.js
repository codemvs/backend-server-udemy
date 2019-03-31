var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

// Default option
app.use(fileUpload());

app.put('/', (req, res, next) => {

    //
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'Debe de seleccionar una image' }
        });
    }
    // Obtener nombre de archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Extenciones validas
    var extensionesValida = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValida.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: `Las extensiones validas son: ${extensionesValida}` }
        });

    }
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });

});

module.exports = app;