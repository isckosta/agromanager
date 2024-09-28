const pool = require('../db');

// Função para buscar todos os estados
exports.getEstados = async () => {
  try {
    const result = await pool.query('SELECT * FROM estado ORDER BY nome');
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    throw error;
  }
};

// Função para buscar cidades por estado
exports.getCidadesByEstado = async (siglaEstado) => {
  try {
    const result = await pool.query('SELECT * FROM municipio WHERE uf = $1 ORDER BY nome', [siglaEstado]);
    if (result.rows.length === 0) {
      console.warn(`Nenhuma cidade encontrada para o estado ${siglaEstado}`);
    }
    return result.rows;
  } catch (error) {
    console.error(`Erro ao buscar cidades do estado ${siglaEstado}:`, error);
    throw error;
  }
};

exports.getEstadoByMunicipio = async (municipioId) => {
  try {
    const result = await pool.query(
      'SELECT uf AS estado_id FROM municipio WHERE id = $1', 
      [municipioId]
    );

    // Se não houver resultados, retorna null
    if (result.rows.length === 0) {
      return null;
    }

    // Retorna a linha com o estado_id
    return result.rows[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error; // Deixa o erro ser capturado pelo controller
  }
};
