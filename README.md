# MatFun Backend

O MatFun é uma aplicação web gamificada para ajudar estudantes do 8º e 9º ano a praticar matemática de forma divertida. Este é o repositório do backend da aplicação, responsável por toda a lógica de negócio, autenticação, e gerenciamento de dados.

## Tecnologias Utilizadas

*   **Node.js**: Ambiente de execução do JavaScript no servidor.
*   **Express**: Framework web para a construção da API.
*   **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
*   **Prisma**: ORM para a interação com o banco de dados.
*   **PostgreSQL**: Banco de dados relacional.
*   **JSON Web Token (JWT)**: Para autenticação e autorização de usuários.
*   **Bcrypt**: Para hashing de senhas.
*   **tsx**: Para executar o código TypeScript diretamente em desenvolvimento.

## Começando

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

*   [Node.js](https://nodejs.org/en/) (versão 20.x ou superior)
*   [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
*   [PostgreSQL](https://www.postgresql.org/download/)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/mairapaulac/Matfun-back.git
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd matfun-backend
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Crie um arquivo `.env` na raiz do projeto e adicione la a variável de ambiente para a URL do banco de dados:
    ```
    DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"
    ```
    Substitua `USUARIO`, `SENHA`, `HOST`, `PORTA` e `NOME_DO_BANCO` com as suas credenciais do PostgreSQL.

### Executando a Aplicação

1.  Aplique as migrações do banco de dados para criar as tabelas:
    ```bash
    npx prisma migrate dev --schema=\src\prisma\prisma.schema
    ```
2.  (Opcional) Popule o banco de dados com dados iniciais:
    ```bash
    npm run db:seed
    ```
3.  Inicie o servidor em modo de desenvolvimento:
    ```bash
    npm run dev
    ```
    O servidor estará disponível em `http://localhost:3000` (ou a porta que você configurar).

## Banco de Dados

O projeto utiliza o Prisma como ORM para gerenciar o banco de dados PostgreSQL. O schema do banco de dados está definido em `src/prisma/schema.prisma`.

Para popular o banco de dados com dados de exemplo (escolas, anos, turmas, etc.), execute o comando de seed:
```bash
npm run db:seed
```

## Endpoints da API

Aqui está um resumo dos principais endpoints da API:

### Autenticação (`/auth`)

*   `POST /auth/register`: Registra um novo usuário.
*   `POST /auth/login`: Autentica um usuário e retorna um token JWT.

### Usuários (`/user`)

*   `GET /user`: Lista todos os usuários.
*   `GET /user/:id`: Obtém um usuário por ID.
*   `GET /user/me/profile`: Obtém o perfil do usuário autenticado.

### Conquistas (`/achievements`)

*   `GET /achievements`: Lista todas as conquistas.
*   `GET /achievements/me/unlocked`: Lista as conquistas desbloqueadas pelo usuário autenticado.
*   `GET /achievements/me`: Lista todas as conquistas com o progresso do usuário autenticado.

### Dashboard (`/dashboard`)

*   `GET /dashboard`: Obtém as estatísticas do dashboard do usuário autenticado.

### Partidas (`/matches`)

*   `POST /matches`: Registra uma nova partida para o usuário autenticado.
*   `GET /matches`: Lista as partidas do usuário autenticado.

### Ranking (`/ranking`)

*   `GET /ranking/geral`: Obtém o ranking geral.
*   `GET /ranking/turma?classId=:id`: Obtém o ranking de uma turma específica.

### Suporte (`/support`)

*   `GET /support/escolas`: Lista todas as escolas.
*   `GET /support/escolas/:id/anos`: Lista os anos de uma escola.
*   `GET /support/anos/:id/turmas`: Lista as turmas de um ano.

## Estrutura do Projeto

```
src/
├── auth/         # Autenticação (controllers, rotas, serviços)
├── controllers/  # Lógica de requisição e resposta
├── middlewares/  # Middlewares do Express
├── models/       # Modelos de dados (ex: User.ts)
├── prisma/       # Schema, migrações e seed do Prisma
├── repositories/ # Lógica de acesso ao banco de dados
├── routes/       # Definição das rotas da API
├── services/     # Lógica de negócio
├── types/        # Tipos e interfaces TypeScript
└── utils/        # Funções utilitárias (hash, jwt)
```
