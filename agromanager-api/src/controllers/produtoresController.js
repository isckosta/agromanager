// src/controllers/produtoresController.js
const Produtor = require('../models/produtor');

// Criar um novo produtor
exports.createProdutor = async (req, res) => {
  try {
    const produtor = req.body;
    const novoProdutor = await Produtor.createProdutor(produtor);
    res.status(201).json(novoProdutor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Editar um produtor
exports.updateProdutor = async (req, res) => {
  try {
    const { id } = req.params;
    const produtor = req.body;
    const produtorAtualizado = await Produtor.updateProdutor(id, produtor);
    res.status(200).json(produtorAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Excluir um produtor
exports.deleteProdutor = async (req, res) => {
  try {
    const { id } = req.params;
    const produtorDeletado = await Produtor.deleteProdutor(id);
    res.status(200).json(produtorDeletado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos os produtores
exports.getAllProdutores = async (req, res) => {
  try {
    const produtores = await Produtor.getAllProdutores();
    res.status(200).json(produtores);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
