// src/controllers/produtoresController.js
const Produtor = require('../models/produtor');

exports.createProdutor = async (req, res) => {
  try {
    const { produtor, fazenda, culturas } = req.body;

    // Verifique se o nome do produtor está presente
    if (!produtor.nome_produtor) {
      return res.status(400).json({ error: 'O nome do produtor é obrigatório.' });
    }

    console.log("DEBUG - Dados recebidos no Backend:", produtor, fazenda, culturas);

    // Continue com a criação do produtor
    const novoProdutor = await Produtor.createProdutor(produtor, fazenda, culturas);
    res.status(201).json(novoProdutor);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'CPF/CNPJ já está sendo utilizado.' });
    }
    res.status(400).json({ error: error.message });
  }
};

// Editar um produtor
exports.updateProdutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { produtor, fazenda, culturas } = req.body;

    if (!produtor || !produtor.nome_produtor) {
      return res.status(400).json({ error: 'O nome do produtor é obrigatório.' });
    }

    const produtorAtualizado = await Produtor.updateProdutor(id, produtor, fazenda, culturas);
    res.status(200).json(produtorAtualizado);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'CPF/CNPJ já está sendo utilizado.' });
    }

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


// Buscar um produtor pelo ID
exports.getProdutorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Busque o produtor pelo ID
    const produtor = await Produtor.getProdutorById(id);

    // Verifique se o produtor existe
    if (!produtor) {
      return res.status(404).json({ error: 'Produtor não encontrado.' });
    }

    // Busque a fazenda associada
    const fazenda = await Produtor.getFazendaByProdutorId(id);

    // Busque as culturas associadas
    const culturas = await Produtor.getCulturasByFazendaId(fazenda.id);

    // Retorne os dados em um formato estruturado
    res.status(200).json({
      produtor,
      fazenda,
      culturas
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
