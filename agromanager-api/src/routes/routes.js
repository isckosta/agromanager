const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota para dados do dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Total de fazendas
    const totalFazendas = await pool.query('SELECT COUNT(*) FROM produtores');
    console.log('totalFazendas:', totalFazendas);
    // Total de área
    const totalArea = await pool.query('SELECT SUM(area_total) FROM produtores');

    // Gráfico de pizza por estado
    const fazendasPorEstado = await pool.query('SELECT estado, COUNT(*) AS total FROM produtores GROUP BY estado');

    // Gráfico de pizza por cultura
    const culturas = await pool.query('SELECT unnest(culturas) AS cultura, COUNT(*) AS total FROM produtores GROUP BY cultura');

    // Gráfico de pizza por uso de solo
    const usoSolo = await pool.query('SELECT SUM(area_agricultavel) AS total_agricultavel, SUM(area_vegetacao) AS total_vegetacao FROM produtores');

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
