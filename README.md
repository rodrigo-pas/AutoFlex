# Sistema de Gestão de Inventário (Backend Quarkus & Frontend React)

Este projeto implementa um sistema de gestão de inventário para controlar produtos, matérias-primas e suas associações, além de sugerir a produção de itens com base no estoque disponível. O sistema é dividido em um backend API construído com Quarkus e um frontend web desenvolvido com React, Redux Toolkit e Vite.

## Funcionalidades

### Backend (Quarkus)
- **Gestão de Produtos (CRUD):** Permite criar, ler, atualizar e deletar produtos.
  - Campos: `id`, `code`, `name`, `value`.
- **Gestão de Matérias-Primas (CRUD):** Permite criar, ler, atualizar e deletar matérias-primas.
  - Campos: `id`, `code`, `name`, `quantityInStock`.
- **Associação de Produtos e Matérias-Primas (CRUD):** Permite associar matérias-primas a produtos, especificando a quantidade necessária de cada matéria-prima para produzir uma unidade do produto.
  - Campos: `id`, `product`, `rawMaterial`, `quantityNeeded`.
- **Sugestão de Produção:** Consulta os produtos que podem ser produzidos com as matérias-primas em estoque, priorizando os produtos de maior valor total.

### Frontend (React com Redux Toolkit)
- **Interface de Usuário para CRUD de Produtos:** Telas para listar, adicionar, editar e remover produtos.
- **Interface de Usuário para CRUD de Matérias-Primas:** Telas para listar, adicionar, editar e remover matérias-primas.
- **Gestão de Associações de Matérias-Primas por Produto:** Integrado ao formulário de edição de produtos, permite adicionar, atualizar e remover as matérias-primas necessárias para um produto específico.
- **Listagem de Sugestões de Produção:** Exibe os produtos que podem ser fabricados, a quantidade produzível e o valor total, ordenados por prioridade.

## Tecnologias Utilizadas

### Backend
- **Framework:** Quarkus 3.2.9.Final (Java)
- **Persistência:** Hibernate ORM com Panache
- **Banco de Dados:** PostgreSQL (via Docker para desenvolvimento local)
- **API:** JAX-RS (RESTful)
- **Build Tool:** Apache Maven

### Frontend
- **Framework:** React
- **Gerenciamento de Estado:** Redux Toolkit (com RTK Query para interação com a API)
- **Build Tool:** Vite
- **Roteamento:** React Router DOM
- **Linguagem:** TypeScript
- **Estilização:** CSS básico (sem framework UI/UX específico)

## Como Rodar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas:
- **Java Development Kit (JDK) 17 ou superior**
- **Apache Maven 3.8.x ou superior**
- **Node.js 18.x ou superior** e **npm 9.x ou superior**
- **Docker Desktop** (para rodar o banco de dados PostgreSQL)
- **Git**

### 1. Clonar o Repositório
```bash
git clone https://github.com/rodrigo-pas/AutoFlex.git
cd AutoFlex
```

### 2. Configurar e Iniciar o Banco de Dados PostgreSQL (com Docker)
O backend está configurado para usar PostgreSQL. Iremos iniciá-lo usando Docker.
Abra um terminal e execute o seguinte comando:
```bash
docker run -it --rm --name inventory-postgres -e POSTGRES_USER=quarkus -e POSTGRES_PASSWORD=quarkus -e POSTGRES_DB=inventorydb -p 5432:5432 postgres:15
```
Este comando iniciará um container PostgreSQL, criando um banco de dados `inventorydb` com usuário e senha `quarkus`. O banco de dados estará acessível na porta `5432` do seu `localhost`.
**Mantenha este terminal aberto.** Você precisará de um novo terminal para o backend e outro para o frontend.

### 3. Iniciar o Backend (Quarkus)
Em um **novo terminal**, navegue até o diretório do backend e inicie a aplicação em modo de desenvolvimento:
```bash
cd inventory-management-backend
mvn quarkus:dev
```
Aguarde até que a aplicação Quarkus inicie completamente. Se você vir a mensagem "Tests paused", digite `r` e pressione `Enter` para continuar.
A API de backend estará disponível em `http://localhost:8080`.

### 4. Iniciar o Frontend (React)
Em um **terceiro terminal**, navegue até o diretório do frontend, instale as dependências e inicie o servidor de desenvolvimento:
```bash
cd inventory-management-frontend
npm install
npm run dev
```
O servidor de desenvolvimento do frontend iniciará, e a aplicação estará acessível no seu navegador, geralmente em `http://localhost:5173`.

## Endpoints da API (Backend)

Todos os endpoints base estão em `http://localhost:8080/`.

-   **Produtos:** `/products`
    -   `GET /products`: Lista todos os produtos.
    -   `GET /products/{id}`: Obtém um produto por ID.
    -   `POST /products`: Cria um novo produto.
    -   `PUT /products/{id}`: Atualiza um produto existente.
    -   `DELETE /products/{id}`: Deleta um produto.

-   **Matérias-Primas:** `/rawmaterials`
    -   `GET /rawmaterials`: Lista todas as matérias-primas.
    -   `GET /rawmaterials/{id}`: Obtém uma matéria-prima por ID.
    -   `POST /rawmaterials`: Cria uma nova matéria-prima.
    -   `PUT /rawmaterials/{id}`: Atualiza uma matéria-prima existente.
    -   `DELETE /rawmaterials/{id}`: Deleta uma matéria-prima.

-   **Associações Produto-Matéria-Prima:** `/productrawmaterials`
    -   `GET /productrawmaterials`: Lista todas as associações.
    -   `GET /productrawmaterials/{id}`: Obtém uma associação por ID.
    -   `GET /productrawmaterials/byProduct/{productId}`: Lista associações para um produto específico.
    -   `POST /productrawmaterials`: Cria uma nova associação.
    -   `PUT /productrawmaterials/{id}`: Atualiza uma associação existente.
    -   `DELETE /productrawmaterials/{id}`: Deleta uma associação.

-   **Sugestão de Produção:** `/production`
    -   `GET /production/suggested`: Obtém uma lista de produtos sugeridos para produção com base no estoque de matérias-primas, priorizados por valor.

## Rotas do Frontend

-   `/`: Página inicial (Boas-vindas).
-   `/products`: Gerenciamento de Produtos.
-   `/raw-materials`: Gerenciamento de Matérias-Primas.
-   `/production`: Sugestões de Produção.

## Próximos Passos e Melhorias Potenciais

Para uma aplicação de nível de produção, as seguintes melhorias seriam recomendadas:

-   **Responsividade (RNF003):** Implementar um design responsivo para garantir uma boa experiência em dispositivos móveis e desktops, possivelmente integrando um framework CSS (ex: Bootstrap, Tailwind CSS) ou utilizando media queries customizadas.
-   **Testes:** Desenvolver testes unitários e de integração abrangentes para o backend e o frontend (ex: JUnit para Quarkus, Vitest/React Testing Library para React, Cypress para testes E2E).
-   **Tratamento de Erros:** Melhorar o tratamento e a exibição de erros no frontend para fornecer feedback mais amigável ao usuário.
-   **Autenticação e Autorização:** Implementar mecanismos de segurança para controlar o acesso às funcionalidades da API e do frontend.
-   **UI/UX:** Aprimorar a interface do usuário com um design mais moderno e intuitivo.
-   **Validação de Dados:** Implementar validações mais robustas tanto no frontend quanto no backend.
-   **Otimizações:** Melhorar o desempenho da consulta de produção para grandes volumes de dados, se necessário.

---

Sinta-se à vontade para explorar e testar as funcionalidades!
