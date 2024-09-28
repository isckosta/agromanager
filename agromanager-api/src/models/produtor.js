// src/models/produtor.js
const pool = require('../db');

// Função para criar um novo produtor
exports.createProdutor = async (produtor) => {
  const { cpf_cnpj, nome_produtor, nome_fazenda, cidade, estado, area_total, area_agricultavel, area_vegetacao, culturas } = produtor;
  const result = await pool.query(
    'INSERT INTO produtores (cpf_cnpj, nome_produtor, nome_fazenda, cidade, estado, area_total, area_agricultavel, area_vegetacao, culturas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [cpf_cnpj, nome_produtor, nome_fazenda, cidade, estado, area_total, area_agricultavel, area_vegetacao, culturas]
  );
  return result.rows[0];
};

// Função para editar um produtor
exports.updateProdutor = async (id, produtor) => {
  const { nome_produtor, nome_fazenda, cidade, estado, area_total, area_agricultavel, area_vegetacao, culturas } = produtor;
  const result = await pool.query(
    'UPDATE produtores SET nome_produtor=$1, nome_fazenda=$2, cidade=$3, estado=$4, area_total=$5, area_agricultavel=$6, area_vegetacao=$7, culturas=$8 WHERE id=$9 RETURNING *',
    [nome_produtor, nome_fazenda, cidade, estado, area_total, area_agricultavel, area_vegetacao, culturas, id]
  );
  return result.rows[0];
};

// Função para excluir um produtor
exports.deleteProdutor = async (id) => {
  const result = await pool.query('DELETE FROM produtores WHERE id=$1 RETURNING *', [id]);
  return result.rows[0];
};

// Função para buscar todos os produtores (para o dashboard)
exports.getAllProdutores = async () => {
  const result = await pool.query('SELECT * FROM produtores');
  return result.rows;
};
