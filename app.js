// Punto de entrada para la aplicación
// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



// Inicializar variables
var app = express();

// CORS 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoute = require('./routes/medico');
var busquedaRoute = require('./routes/busqueda');
var uploadRoute = require('./routes/upload');
var imagenesRoute = require('./routes/imagenes');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos puerto 3000: \x1b[32m%s\x1b[0m', ' online');
});

// Server index config hacer carpeta upload publica
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoute);
app.use('/usuario', usuarioRoutes);
app.use('/busqueda', busquedaRoute);
app.use('/upload', uploadRoute);
app.use('/img', imagenesRoute);

app.use('/', appRoutes);


// Escuchar peticion
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' online');
});