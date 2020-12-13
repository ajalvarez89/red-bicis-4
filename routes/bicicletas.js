var express = require('express');
var router = express.Router();

var bicicletaController = require('../controllers/bicicleta');

router.get('/create',bicicletaController.bicicleta_create_get);
router.post('/create',bicicletaController.bicicleta_create_post);
router.get('/update/:id',bicicletaController.bicicleta_update_get);
router.post('/update/:id',bicicletaController.bicicleta_update_post);
router.post('/delete/:id',bicicletaController.bicicleta_delete_post);


module.exports = router;