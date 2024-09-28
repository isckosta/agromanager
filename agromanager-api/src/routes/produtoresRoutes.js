const express = require('express');
const router = express.Router();
const produtoresController = require('../controllers/produtoresController');

// Rotas para CRUD de produtores
router.post('/produtores', produtoresController.createProdutor);
router.put('/produtores/:id', produtoresController.updateProdutor);
router.delete('/produtores/:id', produtoresController.deleteProdutor);
router.get('/produtores', produtoresController.getAllProdutores);
router.get('/produtores/:id', produtoresController.getProdutorById);

module.exports = router;
