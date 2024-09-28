const Localizacao = require('../models/localizacao');

// Função para buscar todos os estados
exports.getEstados = async (req, res) => {
  try {
    const estados = await Localizacao.getEstados();
    console.log("Estados: ", estados);
    res.status(200).json(estados);
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
    res.status(500).json({ error: 'Erro ao buscar estados.' });
  }
};

// Função para buscar cidades com base na sigla do estado
exports.getCidadesByEstado = async (req, res) => {
  const sigla = req.params.sigla.toUpperCase();
  console.log("Sigla do estado recebida:", sigla);

  try {
    const cidades = await Localizacao.getCidadesByEstado(sigla);
    if (cidades.length === 0) {
      return res.status(404).json({ message: 'Estado não encontrado ou sem cidades cadastradas.' });
    }
    res.status(200).json(cidades);
  } catch (error) {
    console.error(`Erro ao buscar cidades para o estado ${sigla}:`, error);
    res.status(500).json({ error: 'Erro ao buscar cidades.' });
  }
};

exports.getEstadoByMunicipio = async (req, res) => {
  const municipioId = req.params.municipio_id;

  try {
    // Chama a função do model e recebe o resultado
    const result = await Localizacao.getEstadoByMunicipio(municipioId);

    console.log("Result: ", result);

    // Se não encontrar o município, retorne 404
    if (!result) {
      return res.status(404).json({ message: 'Município não encontrado.' });
    }

    // Retorna o estado associado ao município
    res.status(200).json(result);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: 'Erro ao buscar o estado pelo município.' });
  }
};