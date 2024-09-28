import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Select from 'react-select';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showModal, setShowModal] = useState(false); // Controla a exibição do modal
  const [editingProdutor, setEditingProdutor] = useState(null); // Produtor que está sendo editado ou visualizado
  const [produtores, setProdutores] = useState([]); // Lista de produtores
  // Adiciona um estado para controlar se é visualização
  const [isViewing, setIsViewing] = useState(false);
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState([]); // Para armazenar a lista de cidades
  const [estadosDisponiveis, setEstadosDisponiveis] = useState([]); // Para armazenar a lista de estados

  // Função para buscar todos os estados na inicialização do componente
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/estados');
        const data = await response.json();
        setEstadosDisponiveis(data); // Define os estados disponíveis
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      }
    };

    fetchEstados();
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

  // Função para navegar entre as páginas
  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowModal(false); // Fecha o modal ao navegar
  };

  // Função para buscar as cidades com base no estado selecionado
  const handleEstadoChange = async (e) => {
    const estadoSelecionado = e.target.value;
    setFormData({ ...formData, estado: estadoSelecionado, cidade: '' }); // Atualiza o estado e reseta a cidade

    try {
      const response = await fetch(`http://localhost:3000/api/estados/${estadoSelecionado}/cidades`);
      const data = await response.json();
      setCidadesDisponiveis(data); // Atualiza as cidades disponíveis com base no estado selecionado
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    }
  };

  // Função para aplicar a máscara de CPF ou CNPJ com limitação de caracteres
  const handleCpfCnpjMask = (value) => {
    value = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (value.length <= 11) {
      // Aplica máscara de CPF
      return value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else if (value.length <= 14) {
      // Aplica máscara de CNPJ e impede de digitar mais de 14 caracteres
      return value
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    return value.slice(0, 14); // Garante que a formatação e o limite de 14 dígitos para CNPJ sejam mantidos
  };

  // Função para lidar com mudanças no formulário, incluindo a máscara de CPF/CNPJ
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf_cnpj') {
      setFormData({ ...formData, [name]: handleCpfCnpjMask(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, culturas: selectedOptions });
  };

  // Função para buscar a lista de produtores do backend
  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/produtores');
        const data = await response.json();
        setProdutores(data);
      } catch (error) {
        console.error('Erro ao buscar produtores:', error);
      }
    };

    if (currentPage === 'produtores') {
      fetchProdutores();
    }
  }, [currentPage]);

  // Função para enviar o formulário
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submetido:");

    // Validação da soma das áreas
    const somaAreas = parseFloat(formData.area_agricultavel) + parseFloat(formData.area_vegetacao);
    if (somaAreas > parseFloat(formData.area_total)) {
      alert('A soma da área agricultável e vegetação não pode ser maior que a área total da fazenda.');
      return;
    }

    // Continue com a requisição ao backend
    try {
      const method = editingProdutor ? 'PUT' : 'POST';
      const url = editingProdutor ? `http://localhost:3000/api/produtores/${editingProdutor.id}` : 'http://localhost:3000/api/produtores';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingProdutor ? 'Produtor atualizado com sucesso!' : 'Produtor cadastrado com sucesso!');
        setShowModal(false);
        setEditingProdutor(null);
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
        // Atualiza a lista de produtores após o cadastro/edição
        const updatedProdutores = await fetch('http://localhost:3000/api/produtores');
        setProdutores(await updatedProdutores.json());
      } else {
        const errorData = await response.json();
        alert('Erro ao salvar produtor: ' + errorData.error);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro na conexão com o servidor.');
    }
  };

  // Função para excluir um produtor com confirmação
  const handleDeleteProdutor = async (id) => {
    const confirmarExclusao = window.confirm("Você tem certeza que deseja excluir este produtor?");
    
    if (confirmarExclusao) {
      try {
        const response = await fetch(`http://localhost:3000/api/produtores/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Produtor excluído com sucesso!');
          // Atualiza a lista de produtores após exclusão
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
      // Caso o usuário cancele a ação de exclusão, não fazemos nada
      alert('A exclusão foi cancelada.');
    }
  };

  // Função para abrir o modal para visualização
  const handleViewProdutor = (produtor) => {
    setFormData({ ...produtor, culturas: produtor.culturas || [] });
    setEditingProdutor(produtor);
    setIsViewing(true);  // Define que é apenas visualização
    setShowModal(true);  // Abre o modal
  };

  // Função para abrir o modal para editar ou visualizar um produtor
  const handleEditProdutor = (produtor) => {
    setFormData({ ...produtor, culturas: produtor.culturas || [] });
    setEditingProdutor(produtor);
    setShowModal(true);
  };

  // Função para abrir o modal para cadastro
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
    setIsViewing(false);  // Define que não é visualização (cadastro)
    setShowModal(true);  // Abre o modal
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>AgroManager</h1>
        <nav className="menu">
          <ul>
            <li>
              <button onClick={() => navigateTo('home')} className={currentPage === 'home' ? 'active' : ''}>
                Home
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>
                Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('produtores')} className={currentPage === 'produtores' ? 'active' : ''}>
                Produtores
              </button>
            </li>

          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="content">
        {currentPage === 'home' && (
          <section className="home-section">
            <div className="welcome-container">
              <h1>Bem-vindo ao AgroManager</h1>
              <p>O AgroManager ajuda você a gerenciar suas fazendas, culturas e oferece insights detalhados sobre o uso da terra.</p>
              <p>Explore o sistema e mantenha seus registros sempre atualizados e acessíveis.</p>
              <button className="btn explorar-btn" onClick={() => navigateTo('produtores')}>Gerenciar Produtores</button>
            </div>

            <div className="features-container">
              <div className="feature-box">
                <h3>Gerencie Fazendas</h3>
                <p>Cadastre e monitore todas as suas fazendas em um só lugar, com controle total das áreas e informações.</p>
              </div>

              <div className="feature-box">
                <h3>Acompanhe Culturas</h3>
                <p>Mantenha um registro completo das culturas plantadas em cada fazenda e acompanhe seu desempenho.</p>
              </div>

              <div className="feature-box">
                <h3>Dashboard</h3>
                <p>Obtenha insights com gráficos detalhados sobre o uso da terra e performance das suas fazendas.</p>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'produtores' && (
            <section className="produtores-section">
              <h2>Gestão de Produtores</h2>
              <button className="btn cadastrar-btn" onClick={handleAddProdutor}>
                Cadastrar
              </button>

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

              {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                  <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          {isViewing ? 'Visualizar Produtor' : editingProdutor ? 'Editar Produtor' : 'Cadastrar Produtor'}
                        </h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        {/* Adicionando o onSubmit aqui */}
                        <form onSubmit={handleFormSubmit}>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="mb-3">
                                <label>CPF ou CNPJ</label>
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
                                <label>Nome do Produtor</label>
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
                            <div className="col-md-3">
                              <div className="mb-3">
                                <label>Estado</label>
                                <select
                                  className="form-select"
                                  name="estado"
                                  value={formData.estado}
                                  onChange={handleEstadoChange}
                                  required
                                  disabled={isViewing}
                                >
                                  <option value="">Selecione</option>
                                  {estadosDisponiveis.map((estado) => (
                                    <option key={estado.uf} value={estado.uf}>
                                      {estado.nome}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="mb-3">
                                <label>Cidade</label>
                                <select
                                  className="form-select"
                                  name="cidade"
                                  value={formData.cidade}
                                  onChange={handleInputChange}
                                  required
                                  disabled={isViewing || !formData.estado}
                                >
                                  <option value="">Selecione</option>
                                  {cidadesDisponiveis.map((cidade) => (
                                    <option key={cidade.id} value={cidade.nome}>
                                      {cidade.nome}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="mb-3">
                                <label>Área Total (ha)</label>
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
                            <div className="col-md-3">
                              <div className="mb-3">
                                <label>Área Agricultável (ha)</label>
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
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                                <div className="mb-3">
                                  <label>Área de Vegetação (hectares)</label>
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
                            <label>Culturas Plantadas</label>
                            <select
                              className="form-select"
                              name="culturas"
                              multiple
                              onChange={handleSelectChange}
                              required
                              value={formData.culturas}
                              disabled={isViewing}
                            >
                              <option value="Soja">Soja</option>
                              <option value="Milho">Milho</option>
                              <option value="Algodão">Algodão</option>
                              <option value="Café">Café</option>
                              <option value="Cana de Açucar">Cana de Açúcar</option>
                            </select>
                          </div>

                          {/* Botão de submissão dentro do formulário */}
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
            <Dashboard /> {/* Renderizando o Dashboard */}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 AgroManager. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
