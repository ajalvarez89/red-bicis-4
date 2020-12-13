const mongoose = require('mongoose');
const Bicicleta = require("../../models/bicicleta");
const request = require("request");

const base_url = "http://localhost:3000/api/bicicletas";

describe("Bicicletas API", () => {
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
            console.log("- API Test connected to Database -");
            done();
        });
   });

   afterEach(function(done){
    Bicicleta.deleteMany({}, function(err,success){
        if (err) console.log(err);
        done();
        });
    });        

    describe('GET BICICLETAS /',() =>{
        it("Status 200",(done) => {
            request.get(base_url, function(error,response,body){
                const result = JSON.parse(body);           
                expect(response.statusCode).toBe(200);   
                done();
            });
        });
    });

    describe('POST BICICLETAS /create',() => {
        it("Status 200",(done) => {

            var headers = {'content-type' : 'application/json'};
            var aBici = '{"code":9, "color":"azul marino", "modelo":"Urban Trek", "latitud":"40.7512", "longitud":"-73.9821"}';

            request.post({
                headers : headers,
                url : base_url + '/create',
                body : aBici
            },
            function(error, response, body) {
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe("azul marino");
                expect(bici.modelo).toBe("Urban Trek");
                done();                
            });
        });      
    });

    describe('POST BICICLETAS /update',() => {
        it("Status 200",(done) => {

            var headers = {'content-type' : 'application/json'};
            var aBici = '{"code":9, "color":"amarillo y blanco", "modelo":"Bmx Pro", "latitud":"40.7590", "longitud":"-73.9880"}';

            request.post({
                headers : headers,
                url : base_url + '/update',
                body : aBici
            },
            function(error, response, body) {
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe("amarillo y blanco");
                expect(bici.modelo).toBe("Bmx Pro");
                done();                
            });
        });      
    });

    describe('POST BICICLETAS /delete',() => {
        it("Status 200",(done) => {

            var headers = {'content-type' : 'application/json'};
            var aBici = '{"code": 9}';

            request.post({
                headers : headers,
                url : base_url + '/delete',
                body : aBici
            },
            function(error, response, body) {
                expect(response.statusCode).toBe(200);
                var result = JSON.parse(body).result;
                console.log(result);
                done();                
            });
        });      
    });

});






   


/* 
var trabajo = require('../../models/trabajos');
var server = require('../../bin/www')
var request = require('request');
var mongoose = require('mongoose');

var base_url = 'http://localhost:3000/api/trabajos';

describe('testing trabajos API', function() {
    beforeEach(function (done) {
        var mongoDB = 'mongodb+srv://admin_OrgLab:97122110420@cluster0-xifxk.mongodb.net/organizador?retryWrites=true&w=majority';
        mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, res){
            if(err){
                console.log('Error conectando a Atlas: '+ err );
            }else{
                console.log('Conectado a Atlas');
                done();
            }
        });
    });

    afterEach(function (done) {
        trabajo.deleteMany({}, function(err, success){
            if (err) console.log(err);
            done();
        });
    });

    describe('GET Trabajos /', () => {
        it('status 200', (done) => {
            var aTrabajo = new trabajo({id: 1, tipo: 'madera', valor: 200000});
            trabajo.add(aTrabajo, function(err, newTrabajo){
                if (err) console.log(err);
                var aTrabajo2 = new trabajo({id: 2, tipo: 'madecor', valor: 350000});
                trabajo.add(aTrabajo2, function(err, newTrabajo){
                    if (err) console.log(err);
                    request.get(base_url, function(error, response, body){
                        var result = JSON.parse(body).trabajos;
                        expect(response.statusCode).toBe(200);
                        expect(result.length).toBe(2);
        
                        done();
                    });
                });
            });
        });
    });

    describe('POST trabajos /create', () => {
        it('status 200', (done) => {
            var headers = {'content-Type': 'application/json'}; 
            var aTrabajo = '{"id": 11, "tipo": "altillo", "valor": 350000, "lat":  4.744207, "lng": -74.119863}'
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aTrabajo
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var Trabajo = JSON.parse(body).trabajo;
                expect(Trabajo.id).toBe(11);
                expect(Trabajo.tipo).toBe("altillo");
                done();
            });
        });
    });

    describe('DELETE trabajos /delete', () => {
        it('status 204', (done) => {
            var aTrabajo = new trabajo({id: 1, tipo: 'madera', valor: 200000});
            trabajo.add(aTrabajo, function(err, newTrabajo){
                if (err) console.log(err);
                trabajo.allTrabajos(function(err, trabajos){
                    if (err) console.log(err);
                    expect(trabajos.length).toBe(1);
                    var headers = {'content-Type' : 'application/json'};
                    var aID = '{"id": 1}'
                    request.delete({
                        headers: headers,
                        url: base_url + '/delete',
                        body: aID
                    }, function(error, response, body){
                        expect(response.statusCode).toBe(204);
                        trabajo.allTrabajos(function(err, trabajos2){
                            if (err) console.log(err);
                            expect(trabajos2.length).toBe(0);
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('UPDATE trabajos /update/:id', () => {
        it('status 200', (done) => {
            var aTrabajo = new trabajo({id: 1, tipo: 'madera', valor: 200000, ubicacion: [4.744697, -74.122623]});
            trabajo.add(aTrabajo, function(err, newTrabajo){
                if (err) console.log(err);
                trabajo.allTrabajos(function(err, trabajos){
                    if (err) console.log(err);
                    expect(trabajos.length).toBe(1);
                    var headers = {'content-Type' : 'application/json'};
                    var aTrabajo = '{"id": 1,"tipo": "madera","valor": 123123,"lat": 4.744207,"lng": -74.119863}';
                    request.post({
                        headers: headers,
                        url: base_url + '/update/1',
                        body: aTrabajo
                    }, function(error, response, body){
                        expect(response.statusCode).toBe(200);
                        trabajo.findById(1, function(err, targetTrabajo){
                            if (err) console.log(err);
                            expect(targetTrabajo.valor).toBe(123123);
                            done();
                        });
                    });
                });
            });
        });
    });
}); */
