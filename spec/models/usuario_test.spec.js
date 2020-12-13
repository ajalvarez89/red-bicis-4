var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe('Testing Usuarios', function(){
    
    beforeEach(function(done){
        const mongoDB = 'mongodb://localhost/testdb';
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.connect(mongoDB);
        const db = mongoose.connection;
        db.on('error',console.error.bind(console,'MongoDb connection error'));
        db.once('open', function(){
            console.log(" -> Test usuario conectado a database - ");
            done();    
        });
    });

    afterEach(function(done){
        Reserva.deleteMany({}, function(err,success){
            if (err) console.log(err);
            Usuario.deleteMany({}, function(err,success){
                if (err) console.log(err);
                Bicicleta.deleteMany({}, function(err,success){
                    if (err) console.log(err); 
                    console.log(" <- Vaciando Colecciones - ");
                    done();
                });
            });
        });
    }); 

    describe('Cuando un usuario reserva una bici', () => {
        it ('debe existir una reserva', (done) => {
            const usuario = new Usuario({nombre:'Ezequiel'});
            usuario.save();
            console.log(" *** Usuario Agregado *** ");

            const bicicleta = new Bicicleta({code:1,color:'Rojo',modelo:'Bmx Pro',ubicacion:[40.759279, -73.985226]});
            bicicleta.save();
            console.log(" *** Bici Agregada *** ");

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate()+1);
            usuario.reservar(bicicleta.id,hoy,mañana,function(error,reserva){
                console.log(" *** Reserva Realizada *** ");
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err,reservas){
                    console.log(reservas[0]);
                    console.log(" *** Reserva Encontrada *** ");
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(bicicleta.code);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });
            });
        });
    });
});
