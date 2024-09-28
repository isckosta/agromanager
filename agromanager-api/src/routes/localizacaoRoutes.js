const express = require('express');
const router = express.Router();
const localizacaoController = require('../controllers/localizacaoController');

// Rota para obter todos os estados
router.get('/estados', localizacaoController.getEstados);

// Rota para obter as cidades de um estado específico pela sigla
router.get('/estados/:sigla/cidades', localizacaoController.getCidadesByEstado);
router.get('/municipios/:municipio_id', localizacaoController.getEstadoByMunicipio);

module.exports = router;
