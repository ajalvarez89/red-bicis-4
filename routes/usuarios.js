const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarios');

router.get('/', usuarioController.list);
router.get('/create', usuarioController.create_get);
router.post('/create', usuarioController.create);
router.get('/:id/update', usuarioController.update_get);
router.post('/:id/update', usuarioController.update);
router.post('/:id/delete', usuarioController.delete);

module.exports = router;