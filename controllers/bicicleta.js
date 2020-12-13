var Bicicleta = require('../models/bicicleta');
const { ConsoleReporter } = require('jasmine');

exports.getIndex = (req, res) => {
    console.log('root accesed in route');
    console.log('usuario:');
    console.log('=======> Process env Host');
    console.log(process.env.HOST)
    console.log(req.user);
    let nombreUsuario = '';
    
    if (!req.user){
        console.log('Usuario no logueado');
        nombreUsuario = '';
    } else {
        nombreUsuario = req.user.nombre
        console.log(`Usuario logueado ${nombreUsuario}`);
        //res.render('index',{title:"Bicicletas"});
    }

    //let nombreUsuario=(req.user.nombre?req.user.nombre:'');

    res.render('index',{title:"Bicicletas",nombreUsuario:nombreUsuario});
    
    }


exports.bicicleta_list = (req, res) => {

        Bicicleta.find({},function(err,bicicletas){
            if (err){
                console.log(err);
            } else {
                /* console.log(`**** Lista Bicicletas **** Cantidad de bicicletas a mostrar: ${bicicletas.length}`);
              
                let i=0;
                for (bici of bicicletas){
                    
                    i++;
                    console.log(`${i}) Code:${bici.code}, Color:${bici.color} Modelo:${bici.modelo}, Ubicacion:${bici.ubicacion}`);                
                }        */     
               
                if (!req.user){
                    console.log('Usuario no logueado');
                    res.redirect('/login');
                } else {
                    console.log(req.user);
                    res.render('bicicletas/index',{bicis:bicicletas});
                }

                //res.render('bicicletas/index',{bicis:bicicletas});
            }
        })
        
    
    }    
 
    exports.bicicleta_create_get = function(req,res){ 
        console.log(' *1* get create recibido')      
        res.render('bicicletas/create');
    }
    
    exports.bicicleta_create_post = function(req,res){ 
        console.log(' *2* post create recibido');
        const aBici = new Bicicleta({
            code: req.body.code, 
            color:req.body.color,
            modelo:req.body.modelo,
            ubicacion:[req.body.latitud,req.body.longitud]});
        Bicicleta.add(aBici,function(err,newBici){
            if (err) console.log(err);
                console.log(' *3* Bicicleta agregada: ');
                console.log(newBici);   
                res.redirect('/bicicletas');             
            });
        
    }
    

    exports.bicicleta_update_get = function(req,res){ 
        console.log(' *1* get update recibido');
        console.log(req.params.id)
      
        Bicicleta.findById(req.params.id, function (err, bici) {
            if (err) console.log(err);
            console.log(bici);
          
            res.render('bicicletas/update',{bici});
        });
        
       
    }
    

    exports.bicicleta_update_post = function(req,res){ 
        console.log(' *2* post update recibido');
       
        Bicicleta.findById(req.params.id, function (err, bici) {
            if (err) console.log(err);

            console.log(' *3* Bici encontrada para update:');
            console.log(bici);

            bici.code = req.body.code;
            bici.color = req.body.color;
            bici.modelo = req.body.modelo;
            bici.ubicacion = [req.body.latitud, req.body.longitud];

            bici.save(function(err,modif){
                console.log(' *4* Bici Modificada:');
                console.log(modif);
                res.redirect('/bicicletas');
                });
            
        });

        
    
        
    }
    
    exports.bicicleta_delete_post = function(req,res){ 
        console.log('post delete recibido');        
       
        Bicicleta.removeByCode(req.body.code, function(error, removeResult){
            console.log(removeResult);
            console.log(`Bici ${req.body.code} eliminada`);
            res.redirect('/bicicletas');
        }) ;
    };   