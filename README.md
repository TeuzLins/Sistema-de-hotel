# Monorepo – API (Express/Prisma/Swagger) + Web (React/Vite/MUI)

Este projeto implementa um sistema completo com backend (Node/Express/Prisma) e frontend (React/Vite/MUI) usando npm workspaces em um monorepo.
Inclui autenticação JWT, ORM Prisma, Swagger, rate-limit, CORS e integração com Postgres.

## Como executar o projeto

Requisitos:

• Node.js 18+
• NPM 9+
• Docker Desktop (opcional)
• Postgres 16 (local ou via Docker Compose)

```bash
# 1) Instalar dependências
npm install

# 2) Criar variáveis de ambiente (API)
Crie o arquivo:
apps/api/.env
Com o conteúdo:

DATABASE_URL=postgres://postgres:postgres@localhost:5432/hotel
JWT_ACCESS_SECRET=sua-chave
JWT_REFRESH_SECRET=sua-chave

TIMEZONE=America/Sao_Paulo
CHECKIN_HOUR=14
CHECKOUT_HOUR=12
CORS_ORIGIN=http://localhost:5173

# 3) Subir Banco (Docker)
docker compose up -d db

# 4) Gerar Prisma + Migrar + Seed
npm run -w apps/api db:generate
npm run -w apps/api db:migrate
npm run -w apps/api db:seed

# 5) Rodar a API
npm run -w apps/api dev

# 6) Rodar o Frontend
npm run -w apps/web dev
```
## Estrutura do Monorepo
```
root/
├─ apps/
│  ├─ api/
│  │  ├─ prisma/
│  │  ├─ src/
│  │  ├─ .env   (ignorado pelo git)
│  │  └─ package.json
│  └─ web/
│     ├─ src/
│     ├─ public/
│     └─ package.json
├─ node_modules/
├─ package.json   (npm workspaces)
└─ docker-compose.yml
```
# O que foi aplicado:
Backend (API – Express + Prisma)
• JWT (access + refresh)
• Autenticação protegendo rotas privadas
• Rate-limit para evitar abuso
• CORS configurado para ambiente local
• Swagger para documentação da API
• Prisma ORM com migrations, seed e Prisma Client
• Estrutura limpa com controllers, services, middlewares, validators


# Frontend (Web – React + Vite + MUI)  
• Componentização usando Material UI
• Requisições com JWT
• Hooks organizando lógica de estado
• Proteção de rotas no front
• Uso de Vite para rápido desenvolvimento

# Monorepo
• Organização via npm workspaces
• Comandos por workspace (-w apps/api, -w apps/web)
• Dependências isoladas por aplicação

# Testes (API – Jest)
```
npm run -w apps/api test
```
# Requer:
• Postgres rodando
• Migrações já aplicadas

# Troubleshooting
Prisma não conecta
• Verifique DATABASE_URL
• Confirme se Postgres está rodando
Rode:
```
npm run -w apps/api db:generate
```
# Problemas de build no Web
• Instale @types faltantes
• Corrija tipos do MUI nas props

# CORS bloqueando requisição
• Ajuste CORS_ORIGIN no .env
• Ou ative proxy no Vite

# O que o projeto demonstra

• API escalável com Express + Prisma
• Documentação viva com Swagger
• Autenticação real com JWT
• Integração de front + back em monorepo
• Controle de banco real com migrations
• Web moderna com React + Vite + MUI
