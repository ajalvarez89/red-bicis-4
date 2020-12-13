const mongoose = require('mongoose');
const Bicicleta = require("../../models/bicicleta");
let numTest = 0;

describe('Testing Bicicletas', function(){

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
        console.log("-> Test Modelo bicicleta - conectado a database -");
        numTest++;
        done();
        });
   });
   
   afterEach(function(done){
       Bicicleta.deleteMany({}, function(err,success){
           if (err) console.log(err);
           console.log('<- Vaciando Coleccion - ')
           done();
       });
   });

   describe('Bicicleta.createInstance', () => {
       it('crea una instancia de Bicicleta', () => {
           const bici = Bicicleta.createInstance(1,'verde','urbana',[40.759279, -73.985226]);
          
           console.log(` *** (${numTest}) Test Creacion Instancia *** `);
           expect(bici.code).toBe(1);
           expect(bici.color).toBe('verde');
           expect(bici.modelo).toBe('urbana');
           expect(bici.ubicacion[0]).toBe(40.759279);
           expect(bici.ubicacion[1]).toBe(-73.985226);

       });
   });

    describe('Bicicleta.allBicis', () => {
        it('comienza vacia', (done) => {
            
            console.log(` *** (${numTest}) Test Coleccion Vacia *** `);
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {            
            const aBici = new Bicicleta({code:2,color:'Rojo',modelo:'Bmx Pro',ubicacion:[40.759279, -73.985226]});
            Bicicleta.add(aBici,function(err,newBici){
                if (err) console.log(err);
                
                console.log(` *** (${numTest}) Test Agregar Bicicleta *** `);
             
                Bicicleta.allBicis(function(err,bicis){
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    done();
                });       
            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1552A', (done) => {
           
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0);
                
                
                console.log(` *** (${numTest}) Test Buscar Por Codigo *** `);

                const aBici1 = new Bicicleta({code:3,color:'Rojo',modelo:'Bmx Pro',ubicacion:[40.759279, -73.985226]});
                Bicicleta.add(aBici1,function(err,newBici1){
                if (err) console.log(err);
             
                console.log(' *** Bici 1 Agregada ***');

                const aBici2 = new Bicicleta({code:4,color:'Plateado',modelo:'Urban Trek',ubicacion:[40.750279, -73.981526]});
                Bicicleta.add(aBici2,function(err,newBici2){
                if (err) console.log(err);
          
                console.log(' *** Bici 2 Agregada ***');

                    Bicicleta.findByCode(3, function(error, targetBici){
                        if (error) console.log(error);
                        console.log(' *** Bici Encontrada ***');
                        expect(targetBici.code).toBe(aBici1.code);
                        expect(targetBici.color).toBe(aBici1.color);
                        expect(targetBici.modelo).toBe(aBici1.modelo);
                        done();
                        });                   
                    });       
                });
            });
        });
    });

    describe('Bicicleta.removeByCode', () => {
        it('debe devolver largo lista = 1 luego de borrar una bici', (done) => {
            
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0);

                
                console.log(` *** (${numTest}) Test Eliminar Por Codigo *** `);

                const aBici1 = new Bicicleta({code:5,color:'Rojo',modelo:'Bmx Pro',ubicacion:[40.759279, -73.985226]});
                Bicicleta.add(aBici1,function(err,newBici1){
                if (err) console.log(err);
                console.log(' *** Bici 1 Agregada ***');
              

                const aBici2 = new Bicicleta({code:6,color:'Plateado',modelo:'Urban Trek',ubicacion:[40.750279, -73.981526]});
                Bicicleta.add(aBici2,function(err,newBici2){
                if (err) console.log(err);
                console.log(' *** Bici 2 Agregada ***');
          

                        Bicicleta.removeByCode(5, function(error, removeResult){
                            console.log(removeResult);
                            console.log(' *** Bici 1 eliminada ***');
                                         
                            Bicicleta.allBicis(function(err,bicis){
                                expect(bicis.length).toBe(1);
                                done();
                            });
                            console.log(' *** Bicis restantes 1 ***');  
                        });                                                 
                    });       
                });
            });
        });
    }); 
});    


