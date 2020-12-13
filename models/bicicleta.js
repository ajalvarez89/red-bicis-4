const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: {type: '2dsphere', sparse: true}
    }
});

bicicletaSchema.statics.createInstance = function(code,color,modelo,ubicacion) {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    })
};

bicicletaSchema.methods.toString = function() {
    return `code: ${this.code} | color: ${this.color}`;
};

bicicletaSchema.statics.allBicis = function(cb){
    return this.find({},cb);
};

bicicletaSchema.statics.add = function(aBici,cb){
    this.create(aBici,cb);
};

bicicletaSchema.statics.findByCode = function(aCode,cb){
    return this.findOne({code: aCode},cb);
};

bicicletaSchema.statics.removeByCode = function(aCode,cb){
    return this.deleteOne({code: aCode},cb);
};


module.exports = mongoose.model('Bicicleta', bicicletaSchema);



/* var Bicicleta = function (id,color,modelo,ubicacion) {
    this.id=id,
    this.color=color,
    this.modelo=modelo,
    this.ubicacion=ubicacion
}

 Bicicleta.prototype.toString = function() {
    return `id: ${this.id} | color: ${this.color} | modelo: ${this.modelo}`
} 

Bicicleta.allBicis = [];

Bicicleta.add = function(aBici){
    Bicicleta.allBicis.push(aBici);
}

Bicicleta.findById = function (aBiciId) {
    console.log('Contenido Tabla Bicis:');
    console.log(Bicicleta.allBicis);
    let aBici = Bicicleta.allBicis.find(x => x.id == aBiciId);
    if (aBici)
        return aBici;
    else    
        throw new Error(`No existe una bicicleta con el id ${aBiciId}`);            
}

Bicicleta.removeById = function (aBiciId) {
    //Bicicleta.findById(aBiciId);
    for (let i=0; i<Bicicleta.allBicis.length;i++){
        if (Bicicleta.allBicis[i].id == aBiciId){
            Bicicleta.allBicis.splice(i,1);
            break;
        }
    }    
}

const a = new Bicicleta(1256,'Rojo','Urbana',[40.759279, -73.985226]);
const b = new Bicicleta(2398,'Blanco y Azul','Montaña',[40.758465, -73.985295]);
const c = new Bicicleta(2398,'Amarillo y Verde','Bmx Pro',[40.762440, -73.994741]);

Bicicleta.add(a);
Bicicleta.add(b);
Bicicleta.add(c);

module.exports=Bicicleta; */