const pool = require('../db');

// Função para buscar todas as culturas do banco de dados
exports.getAllCulturas = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM culturas');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar culturas' });
  }
};
