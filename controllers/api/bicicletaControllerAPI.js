var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function (req,res){
    Bicicleta.allBicis(function(err,bicis){
        res.status(200).json({bicicletas:bicis});
    })
}

exports.bicicleta_create = function(req,res){
    console.log('=========> POST api create recibido');
    console.log(req.body);

    const aBici = new Bicicleta({
        code: req.body.code, 
        color:req.body.color,
        modelo:req.body.modelo,
        ubicacion: [req.body.latitud,req.body.longitud]});

    Bicicleta.add(aBici,function(err,newBici){
        if (err) console.log(err);
        console.log('Bicicleta agregada via API: ');
        console.log(newBici);   
        res.status(200).json({
            bicicleta: aBici
        });          
    });
}

exports.bicicleta_delete = function(req,res){
    console.log('=========> POST api delete recibido');
    console.log(req.body);

    Bicicleta.findByCode(req.body.code, function (err, bici) {
        if (err) console.log(err);
    
        if(bici === null){
            res.status(500).json({message: 'No existe ese Codigo'});
        } else {
            
            console.log('Bici encontrada para delete:');
            console.log(bici);

            Bicicleta.removeByCode(req.body.code, function(err, removeResult){
                if (err) console.log(err);
                console.log(removeResult);
                console.log(`Bici ${req.body.code} eliminada`);
                res.status(200).json({
                    result: removeResult
                });  
            }) ;
        };
    });
}

exports.bicicleta_update = function(req,res){ 
    console.log('=========> POST api update recibido');
    console.log(req.body);

    Bicicleta.findByCode(req.body.code, function (err, bici) {
        if (err) console.log(err);
    
        if(bici === null){
            res.status(500).json({message: 'No existe ese Codigo'});
        } else {
            
            console.log('Bici encontrada para update:');
            console.log(bici);

            //bici.code = req.body.code;
            bici.color = req.body.color;
            bici.modelo = req.body.modelo;
            bici.ubicacion = [req.body.latitud, req.body.longitud];

            bici.save(function(err,modif){
                if (err) console.log(err);
                console.log(' Bici Modificada via API:');
                console.log(modif);
                res.status(200).json({
                    bicicleta: modif
                });    
            });   
        };
    });
}


   
  
   
