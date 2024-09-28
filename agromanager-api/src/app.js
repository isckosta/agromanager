// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const produtoresRoutes = require('./routes/produtoresRoutes');
const dashboardRoutes = require('./routes/routes');
const localizacaoRoutes = require('./routes/localizacaoRoutes');
const culturasRoutes = require('./routes/culturasRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api', produtoresRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', localizacaoRoutes);
app.use('/api', culturasRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
