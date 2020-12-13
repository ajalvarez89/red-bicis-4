var express = require('express');
var router = express.Router();

var bicicletaController = require('../controllers/bicicleta');

router.get('/', bicicletaController.getIndex);
router.get('/bicicleta_list', bicicletaController.bicicleta_list);
router.get('/bicicletas', bicicletaController.bicicleta_list);

module.exports = router;