const Usuario = require('../models/usuario');

module.exports = {
    list: function(req, res, next) {
        Usuario.find({}, (err, usuarios) => {
            res.render('usuarios/index', { usuarios: usuarios });
        });
    },
    update_get: function(req, res, next) {
        Usuario.findById(req.params.id, function(err, usuario) {
            res.render('usuarios/update', {errors:{}, usuario: usuario });
        });
    },
    update: function(req, res, next) {
        console.log(`POST update ${req.params.id}`)
        const update_values = { nombre: req.body.nombre };
        Usuario.findByIdAndUpdate(req.params.id, update_values, function(err,usuario) {
            if (err) {
                console.log(err);
                res.render('usuarios/update', {
                    errors: err.errors,
                    usuario: new Usuario({
                    nombre: req.body.nombre,
                    email: req.body.email,
                    }),
                });
            } else {
                res.redirect('/usuarios');
                return;
            }
        });
    },
    create_get: function(req, res, next) {
        res.render('usuarios/create', { errors: {}, usuario: new Usuario(), confirm_password:'' });
    },
    create: function(req, res, next) {
        console.log('Create POST recibido');
        console.log(req.body);
         if (req.body.password != req.body.confirm_password) {
            console.log('passwords no coinciden');
            res.render('usuarios/create', {
                errors: {
                    confirm_password: { message: 'No coincide con el password ingresado' },
                },
                usuario: new Usuario({  nombre: req.body.nombre, email: req.body.email,
                                        password: req.body.password }),
                confirm_password: req.body.confirm_password                         
            });
            return;
        }
        
        Usuario.create({
                nombre: req.body.nombre,
                email: req.body.email,
                password: req.body.password,
            },
            function(err, nuevoUsuario) {
                if (err) {
                    console.log('=========> Errores:');
                    console.log(err.errors);
                    res.render('usuarios/create', {
                        errors: err.errors,
                        usuario: new Usuario({
                            nombre: req.body.nombre,
                            email: req.body.email,
                            password: req.body.password,
                        }),
                        confirm_password: req.body.confirm_password   
                    });
                } else {
                    nuevoUsuario.enviar_email_bienvenida();
                    res.redirect('/usuarios');
                }
            }
        ); 
    },

    delete: function(req, res, next) {
        console.log(`POST delete recibido, eliminar ${req.params.id}`);
        Usuario.findByIdAndDelete(req.params.id, function(err) {
            if (err) next(err);
            else {
                console.log(`Usuario: ${req.body.id} eliminado`);
                res.redirect('/usuarios');}
        });
    },
};