Projeto monorepo com `apps/api` (Express + Prisma + Swagger) e `apps/web` (React + Vite + MUI).

## Requisitos

- Node.js 18+

- NPM 9+

- Docker Desktop (opcional, para Postgres via Compose)

## Configuração

1. Instale dependências:

- `npm install`

2. Variáveis de ambiente (dev):

- Crie `apps/api/.env` com:

- `DATABASE_URL=postgres://postgres:postgres@localhost:5432/hotel`

- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `TIMEZONE`, `CHECKIN_HOUR`, `CHECKOUT_HOUR`, `CORS_ORIGIN`

- `.gitignore` já ignora `.env`.

## Banco de Dados

### Docker Compose

```

docker compose up -d db

npm run -w apps/api db:generate

npm run -w apps/api db:migrate

npm run -w apps/api db:seed

```

### Postgres local

Configure um servidor Postgres 16 em `localhost:5432` com o banco `hotel` e usuário `postgres/postgres`. Use o mesmo `DATABASE_URL` e rode `db:generate`, `db:migrate`, `db:seed`.

## Desenvolvimento

- API: `npm run -w apps/api dev` (Swagger: `http://localhost:3000/api-docs`)

- Web: `npm run -w apps/web dev` (`http://localhost:5173`)

## Testes

- API (Jest): `npm run -w apps/api test`

- Requer Postgres acessível e migrações aplicadas.

## Build

- Web: `npm run -w apps/web build`

- API Prod: `npm run -w apps/api build` (corrija eventuais erros de tipos antes).

## Segurança

- JWT, CORS e rate-limit habilitados na API.

- `.env`, `dist/`, `node_modules/` e artefatos estão ignorados pelo Git.

## Troubleshooting

- Erro de conexão Prisma: verifique `DATABASE_URL` e se Postgres está rodando.

- Falhas de build Web por tipos: instale `@types` faltantes ou ajuste props conforme MUI.
