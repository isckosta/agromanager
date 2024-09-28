const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota para dados do dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Total de fazendas
    const totalFazendas = await pool.query('SELECT COUNT(*) FROM fazendas');

    // Total de área
    const totalArea = await pool.query('SELECT SUM(area_total) FROM fazendas');

    // Gráfico de pizza por estado
    const fazendasPorEstado = await pool.query(`
      SELECT m.uf AS estado, COUNT(*) AS total 
      FROM fazendas f
      JOIN municipio m ON f.municipio_id = m.id
      GROUP BY m.uf
    `);

    // Gráfico de pizza por cultura
    const culturas = await pool.query(`
      SELECT c.nome AS cultura, COUNT(*) AS total
      FROM fazenda_culturas fc
      JOIN culturas c ON fc.cultura_id = c.id
      GROUP BY c.nome
    `);

    // Gráfico de pizza por uso de solo
    const usoSolo = await pool.query(`
      SELECT SUM(area_agricultavel) AS total_agricultavel, SUM(area_vegetacao) AS total_vegetacao 
      FROM fazendas
    `);

    res.json({
      totalFazendas: totalFazendas.rows[0].count,
      totalArea: totalArea.rows[0].sum,
      fazendasPorEstado: fazendasPorEstado.rows,
      culturas: culturas.rows,
      usoSolo: usoSolo.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
});



module.exports = router;
