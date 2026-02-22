# InvestFolio

Sistema para gerenciamento de carteiras de investimentos, que possibilita o cadastro e acompanhamento de ativos financeiros.

## Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Web
- PostgreSQL
- Docker
- Lombok
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM
- React Hook Form + Zod
- Axios
- Recharts
- Sonner

## Como Executar

### Backend
#### Na raiz do projeto backend execute:
- docker-compose up -d
#### Ainda na mesma pasta, utilize o Maven wrapper para iniciar o servidor:
- ./mvnw spring-boot:run

### Frontend
#### Navegue até a pasta do frontend:
- cd investment-frontend
#### Instale as dependências:
- npm install
#### Inicie o servidor de desenvolvimento:
- npm run dev
#### Acesse no navegador:
- http://localhost:5173

## Endpoints 

| Método | Endpoint                           | Descrição                              |
|------|-----------------------------------|----------------------------------------|
| POST   | `/investments`                    | Cadastrar um novo ativo                |
| GET    | `/investments`                    | Listar todos os ativos                 |
| GET    | `/investments?type=CRIPTO`        | Filtrar ativos por tipo                |
| GET    | `/investments/{id}`               | Buscar um ativo específico             |
| PUT    | `/investments/{id}`               | Atualizar informações de um ativo      |
| DELETE | `/investments/{id}`               | Deletar um ativo                       |
| GET    | `/investments/summary`            | Obter resumo da carteira               |
| PATCH  | `/investments/{id}/price?newPrice=XX` | Atualizar preço de mercado de um ativo |

## Funcionalidades Implementadas

- Cadastro, edição e exclusão de ativos
- Listagem com filtro por tipo
- Resumo da carteira 
- Cálculo de lucro/prejuízo por ativo
- Atualização de preço de mercado
- Relatórios de ganhos e perdas




