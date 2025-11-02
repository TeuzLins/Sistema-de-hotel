Monorepo – API (Express + Prisma + Swagger) & Web (React + Vite + MUI)

Este projeto é um monorepo contendo:

API — Express + Prisma + JWT + Swagger

Web — React + Vite + Material UI

Banco — Postgres 16 (Docker ou local)

Organizado em npm workspaces dentro de apps/.

📁 Estrutura
```
.
├─ apps/
│  ├─ api/   → Backend (Express, Prisma, Swagger)
│  └─ web/   → Frontend (React, Vite, MUI)
└─ package.json  → Workspaces
```
✅ Requisitos

Node.js 18+

NPM 9+

Docker Desktop (opcional, para Postgres via Docker Compose)

🔧 Instalação
npm install

🔐 Variáveis de Ambiente (API)

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


.gitignore já ignora .env.

🗄️ Banco de Dados
✅ Usando Docker (Recomendado)
docker compose up -d db

npm run -w apps/api db:generate
npm run -w apps/api db:migrate
npm run -w apps/api db:seed

✅ Postgres Local

Configure:

host: localhost

port: 5432

db: hotel

user: postgres

pass: postgres

Depois execute:

npm run -w apps/api db:generate
npm run -w apps/api db:migrate
npm run -w apps/api db:seed

🧑‍💻 Desenvolvimento
API
npm run -w apps/api dev


Swagger:
👉 http://localhost:3000/api-docs

Web
npm run -w apps/web dev


Frontend:
👉 http://localhost:5173

🧪 Testes

(Backend – Jest)

npm run -w apps/api test


Requer Postgres rodando + migrações aplicadas.

🏗️ Build
Web (Vite)
npm run -w apps/web build

API (TypeScript)
npm run -w apps/api build


Corrija erros de tipos antes de buildar.

🔒 Segurança

JWT (access + refresh)

CORS configurado

Rate-limit habilitado

.env, dist/, node_modules/ ignorados pelo Git

🛠️ Troubleshooting
❗Erro Prisma: "Failed to connect"

Verifique DATABASE_URL

Confirme se Postgres está rodando

Execute novamente:

npm run -w apps/api db:generate

❗Erro no build do Web por tipos

Instale @types faltantes

Corrija props do MUI
