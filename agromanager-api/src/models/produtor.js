  // src/models/produtor.js
  const pool = require('../db');

  // Função para criar um novo produtor
  exports.createProdutor = async (produtor, fazenda, culturas) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Log para verificar o que está sendo recebido
      console.log("DEBUG - Dados recebidos no Backend:", produtor, fazenda, culturas);

      if (!produtor.cpf_cnpj) {
        throw new Error('CPF ou CNPJ não pode ser nulo');
      }

      const produtorResult = await client.query(
        'INSERT INTO produtores (cpf_cnpj, nome_produtor) VALUES ($1, $2) RETURNING *',
        [produtor.cpf_cnpj, produtor.nome_produtor]
      );
      const produtorId = produtorResult.rows[0].id;

      const fazendaResult = await client.query(
        'INSERT INTO fazendas (nome_fazenda, produtor_id, municipio_id, area_total, area_agricultavel, area_vegetacao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [fazenda.nome_fazenda, produtorId, fazenda.municipio_id, fazenda.area_total, fazenda.area_agricultavel, fazenda.area_vegetacao]
      );
      const fazendaId = fazendaResult.rows[0].id;

      for (const culturaId of culturas) {
        await client.query(
          'INSERT INTO fazenda_culturas (fazenda_id, cultura_id) VALUES ($1, $2)',
          [fazendaId, culturaId]
        );
      }

      await client.query('COMMIT');
      return { produtor: produtorResult.rows[0], fazenda: fazendaResult.rows[0] };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  };

  // Função para editar um produtor
  exports.updateProdutor = async (id, produtor, fazenda, culturas) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      // Atualiza o produtor
      await client.query(
        'UPDATE produtores SET nome_produtor=$1 WHERE id=$2',
        [produtor.nome_produtor, id] // Aqui, o nome_produtor deve estar presente e correto
      );
  
      // Atualiza a fazenda associada ao produtor
      const fazendaResult = await client.query(
        `UPDATE fazendas 
         SET nome_fazenda=$1, municipio_id=$2, area_total=$3, area_agricultavel=$4, area_vegetacao=$5 
         WHERE produtor_id=$6 
         RETURNING id`,
        [fazenda.nome_fazenda, fazenda.municipio_id, fazenda.area_total, fazenda.area_agricultavel, fazenda.area_vegetacao, id]
      );
      
      const fazendaId = fazendaResult.rows[0].id;
  
      // Remove as culturas atuais da fazenda
      await client.query('DELETE FROM fazenda_culturas WHERE fazenda_id=$1', [fazendaId]);
  
      // Adiciona as novas culturas
      for (const culturaId of culturas) {
        await client.query(
          'INSERT INTO fazenda_culturas (fazenda_id, cultura_id) VALUES ($1, $2)',
          [fazendaId, culturaId]
        );
      }
  
      await client.query('COMMIT');
      
      return { id, ...produtor, fazenda, culturas };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

  // Função para excluir um produtor
  exports.deleteProdutor = async (id) => {
    const result = await pool.query('DELETE FROM produtores WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
  };

  // Função para buscar todos os produtores (para o dashboard)
  exports.getAllProdutores = async () => {
    const result 
      = await pool.query(
        `SELECT
          p.id,
          p.nome_produtor,
          p.cpf_cnpj,
          f.nome_fazenda,
          c.nome AS cidade,
          e.nome AS estado
        FROM
          produtores p
        JOIN fazendas f ON
          p.id = f.produtor_id
        JOIN municipio c ON
          f.municipio_id = c.id
        JOIN estado e ON
          c.uf = e.uf`);
    return result.rows;
  };

  // Função para buscar um produtor pelo CPF ou CNPJ
  exports.getProdutorByCpfCnpj = async (cpf_cnpj) => {
    const result = await pool.query('SELECT * FROM produtores WHERE cpf_cnpj = $1', [cpf_cnpj]);
    return result.rows[0]; // Retorna o primeiro resultado ou undefined se não existir
  };

  // Buscar um produtor pelo ID
  exports.getProdutorById = async (id) => {
    const result = await pool.query('SELECT * FROM produtores WHERE id = $1', [id]);
    return result.rows[0]; // Retorna o primeiro resultado ou undefined se não existir
  };

  // Buscar fazenda por produtor ID
  exports.getFazendaByProdutorId = async (produtorId) => {
    const result = await pool.query('SELECT * FROM fazendas WHERE produtor_id = $1', [produtorId]);
    return result.rows[0];
  };

  // Buscar culturas associadas à fazenda
  exports.getCulturasByFazendaId = async (fazendaId) => {
    const result = await pool.query('SELECT * FROM fazenda_culturas WHERE fazenda_id = $1', [fazendaId]);
    return result.rows.map(row => row.cultura_id); // Retorne um array de IDs de culturas
  };

