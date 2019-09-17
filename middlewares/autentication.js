var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ==================================
// Verificar token
// ==================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

// ==================================
// Verificar ADMIN_ROLE
// ==================================

exports.verificaADMIN_ROLE = function(req, res, next) {

    var usuario = req.usuario;
    if( usuario.role === 'ADMIN_ROLE'){
        next();
        return false;
    }
    return res.status(401).json({
        ok: false,
        mensaje: 'Acción denegada',
        errors: {mensaje: 'Se requiere de un usuario administrador para esta acción'}
    });   

}

// ==================================
// Verificar ADMIN o mismo usuario
// ==================================

exports.verificaADMIN_O_MismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;
    
    if( usuario.role === 'ADMIN_ROLE' || usuario._id === id ){
        next();
        return false;
    }
    return res.status(401).json({
        ok: false,
        mensaje: 'Acción denegada',
        errors: {mensaje: 'Se requiere de un usuario administrador para esta acción'}
    });   

}