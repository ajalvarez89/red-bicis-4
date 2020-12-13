const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const Reserva = require('./reserva');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const saltRounds = 10;

const Token = require('../models/token');
const mailer = require('../mailer/mailer');

const validateEmail = function(email){
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true,'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true,'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Ingrese un email valido'],
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true,'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    },
    googleId: String,
    facebookId: String

});

usuarioSchema.plugin(uniqueValidator,{
    message: 'El {PATH} ya existe con otro usuario'});

usuarioSchema.pre('save', function(next){
    if (this.isModified('password')){
        this.password = bcrypt.hashSync(this.password,saltRounds);        
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    const reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde:desde, hasta:hasta});
    console.log(reserva);
    reserva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({
        _userId: this.id,
        token: crypto.randomBytes(16).toString('hex'),
    });
    const email_destination = this.email;
    token.save(function(err) {
        if (err) {
            return console.log(err.message);
        }

        const mailOptions = {
            from: 'regismundoeolia@protonmail.com',
            to: email_destination,
            subject: 'Verificación de la cuenta',
            text: 'Hola,\n\n' +
                'Para verificar su cuenta haga clic en el siguiente enlace: \n' +
                'http://localhost:3030' +
                '/token/confirmation/' +
                token.token +
                '.\n',
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) {
                return console.log(err.message);
            }

            console.log(
                'Se ha enviado un mail de bienvenida a:  ' + email_destination + '.'
            );
        });
    });
};

usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({   _userId: this._id,
                                token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;

    console.log('token => ' + token);
    console.log('token => ' + email_destination);

    token.save(function( err ){
        if( err ) {
            console.log(err.message);
            return cb(err);
        }
        
        const mailOptions = {
            from: 'regismundoeolia@protonmail.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text: 'Hola, \n\n'+' Para resetear el password de su cuenta click en este link: \n' 
            + 'http://localhost:3030'+'\/resetPassword\/'+token.token + '\n' 
        };

        mailer.sendMail(mailOptions, function(err) {
            if(err) { console.log(err.message);
                        return cb(err);  
                    }
            console.log('Se envio un email para resetear el password a:' + email_destination);
        });
        cb(null);
    });    
};

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition,callback){
    const self = this;
    console.log('=========> Condition:');
    console.log(`ID:  ${condition.id}`);
    console.log(`EMAIL:  ${condition.emails[0].value}`);
    console.log(condition);
    self.findOne({
        $or:[
            {'googleId':condition.id},{'email':condition.emails[0].value}
        ]}, (err,result) => {
            if (result) {
                callback(err,result)
            } else {
                console.log('-------------- CONDITION --------------');
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verificado = true;
                //values.password = condition._json.etag;
                values.password = crypto.randomBytes(16).toString('hex');
                console.log('-------------- VALUES --------------');
                console.log(values);
                self.create(values,(err,result)=>{
                    if (err) {console.log(err);}
                    return callback(err,result)
                })
                    
                }
            })
        };

        usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition,callback){
            const self = this;
            console.log(`ID:  ${condition.id}`);
            console.log(`EMAIL:  ${condition.emails[0].value}`);
            self.findOne({
                $or:[
                    {'facebookId':condition.id},{'email':condition.emails[0].value}
                ]
            }, (err,result)=>{
                if(result){
                    callback(err,result)
                }else{
                    let values = {};
                    values.facebookId = condition.id;
                    values.email = condition.emails[0].value;
                    values.nombre = condition.displayName || 'WITH OUT NAME';
                    values.verificado = true;
                    values.password = crypto.randomBytes(16).toString('hex');
                    console.log('------------VALUES-------------');
                    console.log(values);
                    self.create(values,(err,result)=>{
                        if(err) console.log(err);
                        return callback(err,result)
                    })
                }
            })
        }        

    



module.exports = mongoose.model('Usuario',usuarioSchema);