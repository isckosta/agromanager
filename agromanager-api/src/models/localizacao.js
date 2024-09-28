const pool = require('../db');

// Função para buscar todos os estados
exports.getEstados = async () => {
  const result = await pool.query('SELECT * FROM estado ORDER BY nome');
  return result.rows;
};

// Função para buscar cidades por estado
exports.getCidadesByEstado = async (siglaEstado) => {
  const result = await pool.query('SELECT * FROM municipio WHERE uf = $1 ORDER BY nome', [siglaEstado]);
  console.log('result:', result.rows);
  return result.rows;
};
