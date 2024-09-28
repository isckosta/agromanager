const express = require('express');
const router = express.Router();
const culturasController = require('../controllers/culturasController');

// Rota para buscar todas as culturas
router.get('/culturas', culturasController.getAllCulturas);

module.exports = router;
