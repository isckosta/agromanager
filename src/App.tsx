import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import { Autocomplete, TextField, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [editingProdutor, setEditingProdutor] = useState(null);
  const [produtores, setProdutores] = useState([]);
  const [isViewing, setIsViewing] = useState(false);
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState([]);
  const [estadosDisponiveis, setEstadosDisponiveis] = useState([]);
  const [culturasDisponiveis, setCulturasDisponiveis] = useState([]);

  const culturesOptions = ["Soja", "Milho", "Algodão", "Café", "Cana de Açúcar"];

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/estados');
        const data = await response.json();
        setEstadosDisponiveis(data);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      }
    };

    fetchEstados();
  }, []);

  useEffect(() => {
    // Buscar as culturas do backend
    const fetchCulturas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/culturas'); // Rota para buscar culturas
        const data = await response.json();
        setCulturasDisponiveis(data); // Armazenar as culturas no estado
      } catch (error) {
        console.error('Erro ao buscar culturas:', error);
      }
    };
  
    fetchCulturas(); // Chamar a função quando o componente for montado
  }, []);

  const [formData, setFormData] = useState({
    cpf_cnpj: '',
    nome_produtor: '',
    nome_fazenda: '',
    cidade: '',
    estado: '',
    area_total: '',
    area_agricultavel: '',
    area_vegetacao: '',
    culturas: []
  });

  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowModal(false);
  };

  const handleEstadoChange = async (selectedOption) => {
    const estadoSelecionado = selectedOption ? selectedOption.value : '';
  
    if (!estadoSelecionado) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/estados/${estadoSelecionado}/cidades`);
      const data = await response.json();
      
      setCidadesDisponiveis(data);
  
      // Se for uma nova seleção de estado, limpar a cidade
      setFormData(prevFormData => ({
        ...prevFormData,
        estado: estadoSelecionado,
        cidade: data.length > 0 ? data[0].id : '', // Seleciona a primeira cidade disponível, se houver
      }));
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    }
  };
  

  const handleCidadeChange = (selectedOption) => {
    setFormData({ ...formData, cidade: selectedOption ? selectedOption.value : '' });
  };

  const handleCpfCnpjMask = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
      return value.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else if (value.length <= 14) {
      return value.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    return value.slice(0, 14);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf_cnpj') {
      setFormData({ ...formData, [name]: handleCpfCnpjMask(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, culturas: value });
  };

  const fetchProdutores = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/produtores');
      const data = await response.json();
      console.log("Dados dos produtores recebidos:", data);
      setProdutores(data); // Atualiza o estado com os dados recebidos
    } catch (error) {
      console.error('Erro ao buscar produtores:', error);
    }
  };

  useEffect(() => {
    if (currentPage === 'produtores') {
      console.log("Página de produtores ativa, buscando produtores...");
      fetchProdutores();
    }
  }, [currentPage]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const produtor = {
        cpf_cnpj: formData.cpf_cnpj.replace(/\D/g, ''),
        nome_produtor: formData.nome_produtor,
    };
  
    const fazenda = {
        nome_fazenda: formData.nome_fazenda,
        municipio_id: formData.cidade,
        area_total: formData.area_total,
        area_agricultavel: formData.area_agricultavel,
        area_vegetacao: formData.area_vegetacao,
    };
  
    const culturas = formData.culturas;
  
    const dataToSend = {
        produtor,
        fazenda,
        culturas,
    };
  
    try {
        const method = editingProdutor ? 'PUT' : 'POST';
        const url = editingProdutor
            ? `http://localhost:3000/api/produtores/${editingProdutor.id}`
            : `http://localhost:3000/api/produtores`;
  
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });
  
        if (response.ok) {
            const novoProdutor = await response.json();
  
            const cidadeNome = cidadesDisponiveis.find(cidade => cidade.id === novoProdutor.fazenda.municipio_id)?.nome;
            const estadoNome = estadosDisponiveis.find(estado => estado.uf === formData.estado)?.nome;
  
            novoProdutor.fazenda.cidade = cidadeNome || 'Cidade não encontrada';
            novoProdutor.fazenda.estado = estadoNome || 'Estado não encontrado';
  
            setProdutores((produtoresAnteriores) =>
                editingProdutor
                    ? produtoresAnteriores.map((produtor) => 
                          produtor.id === editingProdutor.id ? novoProdutor : produtor
                      )
                    : [...produtoresAnteriores, novoProdutor]
            );
  
            alert(editingProdutor ? 'Produtor atualizado com sucesso!' : 'Produtor cadastrado com sucesso!');
            setShowModal(false);
  
            setFormData({
                cpf_cnpj: '',
                nome_produtor: '',
                nome_fazenda: '',
                cidade: '',
                estado: '',
                area_total: '',
                area_agricultavel: '',
                area_vegetacao: '',
                culturas: [],
            });

            // Recarrega a lista de produtores
            await fetchProdutores();
        } else {
            const errorData = await response.json();
            alert('Erro ao salvar produtor: ' + errorData.error);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro na conexão com o servidor.');
    }
  };

  const handleDeleteProdutor = async (id) => {
    const confirmarExclusao = window.confirm("Você tem certeza que deseja excluir este produtor?");

    if (confirmarExclusao) {
      try {
        const response = await fetch(`http://localhost:3000/api/produtores/${id}`, { method: 'DELETE' });

        if (response.ok) {
          alert('Produtor excluído com sucesso!');
          setProdutores(produtores.filter(produtor => produtor.id !== id));
        } else {
          const errorData = await response.json();
          alert('Erro ao excluir produtor: ' + errorData.error);
        }
      } catch (error) {
        console.error('Erro ao excluir produtor:', error);
        alert('Erro na conexão com o servidor.');
      }
    } else {
      alert('A exclusão foi cancelada.');
    }
  };

  const handleViewProdutor = async (produtor) => {
    try {
      const response = await fetch(`http://localhost:3000/api/produtores/${produtor.id}`);
      const data = await response.json();
    
      const municipioId = data.fazenda.municipio_id;
  
      // Buscar o estado com base no municipio_id
      const responseMunicipio = await fetch(`http://localhost:3000/api/municipios/${municipioId}`);
      const municipioData = await responseMunicipio.json();
    
      const estadoId = municipioData.estado_id;
  
      // Carregar as cidades do estado correspondente
      await handleEstadoChange({ value: estadoId });
  
      // Atualizar os dados no formData com os dados corretos para visualização, incluindo as culturas
      setFormData({
        cpf_cnpj: handleCpfCnpjMask(data.produtor.cpf_cnpj),
        nome_produtor: data.produtor.nome_produtor,
        nome_fazenda: data.fazenda.nome_fazenda,
        cidade: municipioId,
        estado: estadoId,
        area_total: data.fazenda.area_total,
        area_agricultavel: data.fazenda.area_agricultavel,
        area_vegetacao: data.fazenda.area_vegetacao,
        culturas: data.culturas,  // Certifique-se de passar os IDs das culturas
      });
  
      setIsViewing(true);
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao buscar produtor:', error);
    }
  };

  const handleEditProdutor = async (produtor) => {
    try {
      const response = await fetch(`http://localhost:3000/api/produtores/${produtor.id}`);
      const data = await response.json();
  
      console.log("DEBUG - Dados do produtor:", data);
  
      const municipioId = data.fazenda.municipio_id;
  
      // Buscar o estado com base no municipio_id
      const responseMunicipio = await fetch(`http://localhost:3000/api/municipios/${municipioId}`);
      const municipioData = await responseMunicipio.json();
  
      const estadoId = municipioData.estado_id;
  
      // Carregar as cidades do estado correspondente
      await handleEstadoChange({ value: estadoId });
  
      // Atualiza o estado com os dados do produtor e as culturas associadas
      setFormData({
        cpf_cnpj: handleCpfCnpjMask(data.produtor.cpf_cnpj),
        nome_produtor: data.produtor.nome_produtor,
        nome_fazenda: data.fazenda.nome_fazenda,
        cidade: municipioId,  // Agora definimos a cidade corretamente
        estado: estadoId,
        area_total: data.fazenda.area_total,
        area_agricultavel: data.fazenda.area_agricultavel,
        area_vegetacao: data.fazenda.area_vegetacao,
        culturas: data.culturas.map(cultura => cultura),
      });
  
      setEditingProdutor(produtor);
      setIsViewing(false);
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao buscar produtor:', error);
    }
  };

  const handleAddProdutor = () => {
    setFormData({
      cpf_cnpj: '',
      nome_produtor: '',
      nome_fazenda: '',
      cidade: '',
      estado: '',
      area_total: '',
      area_agricultavel: '',
      area_vegetacao: '',
      culturas: []
    });
    setEditingProdutor(null);
    setIsViewing(false);
    setShowModal(true);
  };

  const estadosOptions = estadosDisponiveis.map(estado => ({ value: estado.uf, label: estado.nome }));
  const cidadesOptions = cidadesDisponiveis.map(cidade => ({ value: cidade.id, label: cidade.nome }));

  return (
    <div className="app">
      <header className="header">
        <h1>AgroManager</h1>
        <nav className="menu">
          <ul>
            <li><button onClick={() => navigateTo('home')} className={currentPage === 'home' ? 'active' : ''}>Home</button></li>
            <li><button onClick={() => navigateTo('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>Dashboard</button></li>
            <li><button onClick={() => navigateTo('produtores')} className={currentPage === 'produtores' ? 'active' : ''}>Produtores</button></li>
          </ul>
        </nav>
      </header>

      <main className="content">
        {currentPage === 'home' && (
          <section className="home-section">
            <div className="welcome-container">
              <h1>Bem-vindo ao AgroManager</h1>
              <p>O AgroManager ajuda você a gerenciar suas fazendas, culturas e oferece insights detalhados sobre o uso da terra.</p>
              <button className="btn explorar-btn" onClick={() => navigateTo('produtores')}>Gerenciar Produtores</button>
            </div>
          </section>
        )}

        {currentPage === 'produtores' && (
          <section className="produtores-section">
            <h2>Gestão de Produtores</h2>
            <button className="btn cadastrar-btn" onClick={handleAddProdutor}>Cadastrar</button>

            {/* Verificar se existem produtores */}
            {produtores.length === 0 ? (
              <p>Nenhum produtor cadastrado</p>
            ) : (
              <div className="table-wrapper">
                <table className="produtores-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Nome da Fazenda</th>
                      <th>Cidade</th>
                      <th>Estado</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtores.map((produtor) => (
                      <tr key={produtor.id}>
                        <td>{produtor.nome_produtor}</td>
                        <td>{produtor.nome_fazenda}</td>
                        <td>{produtor.cidade}</td>
                        <td>{produtor.estado}</td>
                        <td>
                          <button className="btn" onClick={() => handleEditProdutor(produtor)}>Editar</button>
                          <button className="btn btn-danger" onClick={() => handleDeleteProdutor(produtor.id)}>Excluir</button>
                          <button className="btn" onClick={() => handleViewProdutor(produtor)}>Visualizar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {showModal && (
              <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {isViewing ? 'Visualizar Produtor' : editingProdutor ? 'Editar Produtor' : 'Cadastrar Produtor'}
                      </h5>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={handleFormSubmit}>
                        <div className="row">
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label className='mb-2'>
                                CPF ou CNPJ 
                                <span className="text-danger"> *</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="cpf_cnpj"
                                value={formData.cpf_cnpj}
                                onChange={handleInputChange}
                                required
                                readOnly={isViewing}
                              />
                            </div>
                          </div>
                          <div className="col-md-9">
                            <div className="mb-3">
                              <label className='mb-2'>
                                Nome 
                                <span className="text-danger"> *</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="nome_produtor"
                                value={formData.nome_produtor}
                                onChange={handleInputChange}
                                required
                                readOnly={isViewing}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className='mb-2'>
                                Nome da Fazenda
                                <span className="text-danger"> *</span>
                              </label>
                              <input 
                                type="text" 
                                className="form-control"
                                name="nome_fazenda" 
                                value={formData.nome_fazenda} 
                                onChange={handleInputChange} 
                                required 
                                readOnly={isViewing}  // Somente leitura no modo visualização
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label className='mb-2'>
                                Estado
                                <span className="text-danger"> *</span>
                              </label>
                              <Autocomplete
                                options={estadosOptions}
                                getOptionLabel={(option) => option.label}
                                value={estadosOptions.find(option => option.value === formData.estado) || null} // Corrigido para mostrar o estado atual
                                onChange={(event, newValue) => handleEstadoChange(newValue)}
                                disabled={isViewing}
                                renderInput={(params) => (
                                  <TextField {...params} label="Selecione o Estado" variant="outlined" fullWidth size="small" />
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label className='mb-2'>
                                Cidade
                                <span className="text-danger"> *</span>
                              </label>
                              <Autocomplete
                                options={cidadesDisponiveis.map(cidade => ({ value: cidade.id, label: cidade.nome }))}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
                                value={cidadesDisponiveis.find(cidade => cidade.id === formData.cidade) || null} // Corrigir aqui para garantir que a cidade seja selecionada corretamente
                                onChange={(event, newValue) => handleCidadeChange(newValue)}
                                disabled={isViewing || !formData.estado}
                                renderInput={(params) => (
                                  <TextField {...params} label="Selecione a Cidade" variant="outlined" fullWidth size="small" />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className='mb-2'>
                                Área Total (ha)
                                <span className="text-danger"> *</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="area_total"
                                step="0.01"
                                value={formData.area_total}
                                onChange={handleInputChange}
                                required
                                readOnly={isViewing}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className='mb-2'>
                                Área Agricultável (ha)
                                <span className="text-danger"> *</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="area_agricultavel"
                                step="0.01"
                                value={formData.area_agricultavel}
                                onChange={handleInputChange}
                                required
                                readOnly={isViewing}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className='mb-2'>
                                Área de Vegetação (ha)
                                <span className="text-danger"> *</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="area_vegetacao"
                                step="0.01"
                                value={formData.area_vegetacao}
                                onChange={handleInputChange}
                                required
                                readOnly={isViewing}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className='mb-2'>Culturas Plantadas</label>
                          <FormControl fullWidth>
                            <Select
                              labelId="cultures-label"
                              id="culturas"
                              multiple
                              value={formData.culturas}
                              onChange={handleSelectChange}
                              renderValue={(selected) => 
                                culturasDisponiveis
                                  .filter(cultura => selected.includes(cultura.id))
                                  .map(cultura => cultura.nome)
                                  .join(', ')
                              }
                              size="small"
                              disabled={isViewing}
                            >
                              {culturasDisponiveis.map((culture) => (
                                <MenuItem key={culture.id} value={culture.id}> {/* Adicionar key aqui */}
                                  <Checkbox checked={formData.culturas.includes(culture.id)} />
                                  <ListItemText primary={culture.nome} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <div className="modal-footer">
                          {!isViewing && (
                            <button type="submit" className="btn btn-primary">
                              {editingProdutor ? 'Atualizar' : 'Cadastrar'}
                            </button>
                          )}
                          <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Fechar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {currentPage === 'dashboard' && (
          <section>
            <Dashboard />
          </section>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 AgroManager. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
