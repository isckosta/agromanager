# AgroManager

AgroManager é uma aplicação para gerenciar produtores, fazendas e culturas. Ele permite cadastrar, editar e visualizar produtores e as fazendas associadas, bem como as culturas plantadas. O projeto utiliza uma arquitetura baseada em React.js para o frontend e Node.js com PostgreSQL no backend.

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Executando a Aplicação](#executando-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas da API](#rotas-da-api)
- [Licença](#licença)

## Tecnologias Utilizadas

- **Frontend:** React.js, Material UI
- **Backend:** Node.js, Express.js
- **Banco de Dados:** PostgreSQL
- **Outras:** Chart.js para gráficos, Autocomplete e Select do Material UI, REST API

## Pré-requisitos

- **Node.js** (v14 ou superior)
- **PostgreSQL** (v12 ou superior)
- **Git** (opcional)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/isckosta/agromanager.git
cd agromanager
```

2. Instale as dependências do backend:

```bash
cd agromanager-api
pnpm install
```

3. Instale as dependências do frontend:

```bash
cd ../agromanager
pnpm install
```

4. Crie um container com um banco de dados no PostgreSQL e aplique as migrações:

```bash
docker run --name postgres_db -e POSTGRES_USER=root -e POSTGRES_PASSWORD=agro -e POSTGRES_DB=agromanager -p 5432:5432 -v pgdata:/var/lib/postgresql/data -d postgres:15
```

## Executando a Aplicação

### Backend

1. Crie um arquivo `.env` no diretório `agromanager-api` com as seguintes variáveis de ambiente:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=agro
DB_NAME=agromanager
DB_PORT=5432
```

2. Inicie o servidor backend:

```bash
cd agromanager-api
node src/app.js
```

O backend estará disponível em `http://localhost:3000`.

### Frontend

1. Inicie o frontend:

```bash
cd agromanager
pnpm start ou pnpm run dev
```

O frontend estará disponível em `http://localhost:3001`.

## Estrutura do Projeto

```plaintext
agromanager/
│
├── agromanager-api/              # Código do backend
│   ├── src/
│   │   ├── controllers/          # Controladores da API
│   │   ├── models/               # Modelos e consultas SQL
│   │   ├── routes/               # Rotas da API
│   └── app.js                    # Ponto de entrada do servidor Express
│   └── db.js                     # Configuração da conexão ao banco
│   └── .env                      # Variáveis de ambiente
│   └── package.json              # Dependências do backend
│
├── agromanager/                  # Código do frontend
│   ├── public/                   # Arquivos públicos estáticos
│   ├── src/
│   │   ├── assets/               # CSS, imagens e outros recursos
│   ├── App.js                    # Componente principal da aplicação
│   └── package.json              # Dependências do frontend
└── README.md                     # Documentação do projeto
```

## Rotas da API

### Produtores

- **GET /api/produtores**: Retorna todos os produtores cadastrados.
- **GET /api/produtores/:id**: Retorna um produtor pelo ID.
- **POST /api/produtores**: Cria um novo produtor.
- **PUT /api/produtores/:id**: Atualiza um produtor existente.
- **DELETE /api/produtores/:id**: Exclui um produtor.

### Culturas

- **GET /api/culturas**: Retorna todas as culturas cadastradas.

## Licença

Este projeto está licenciado sob os termos da licença MIT.
