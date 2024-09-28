const Localizacao = require('../models/localizacao');

// Função para buscar todos os estados
exports.getEstados = async (req, res) => {
  try {
    const estados = await Localizacao.getEstados();
    console.log("Estados: ", estados);
    res.status(200).json(estados);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: 'Erro ao buscar estados.' });
  }
};

// Função para buscar cidades com base na sigla do estado
exports.getCidadesByEstado = async (req, res) => {
  const sigla = req.params.sigla.toUpperCase(); // Sigla do estado (ex: SP, PI)
  console.log("Sigla: ", sigla);
  try {
    const cidades = await Localizacao.getCidadesByEstado(sigla);
    if (cidades.length === 0) {
      return res.status(404).json({ message: 'Estado não encontrado ou sem cidades cadastradas.' });
    }
    res.status(200).json(cidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cidades.' });
  }
};
