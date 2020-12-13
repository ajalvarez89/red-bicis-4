var Token = require('../models/token');
var Usuario = require('../models/usuario');

module.exports = {
    confirmation: function( req, res, next ) {
        Token.findOne({token: req.params.token}, ( err, token ) => {
            if(token == null) return res.status(400).send({type: 'not-verified', msg: 'No encontramos un usuario con este token.  Quiza haya expirado y debas solicitarlo nuevamente'});
            Usuario.findById(token._userId, ( err, usuario ) => {
                if(!usuario) return res.status(400).send({msg: 'No encontramos un usuario con ese token'});
                if(usuario.verificado) return res.redirect('/usuarios');
                usuario.verificado = true;
                usuario.save( ( err ) => {
                    if(err) return res.status(500).send({msg: err.message});
                    res.redirect('/');
                });
            })
        });
    }
}