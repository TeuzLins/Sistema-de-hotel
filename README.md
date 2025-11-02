# Sistema de Hotel

Monorepo completo para reservas de hotel/pousada:
- `apps/api`: API REST com Express, Prisma, autenticação JWT, RBAC e documentação via Swagger.
- `apps/web`: SPA em React + Vite + MUI com fluxos de busca, reserva, painel admin e relatórios.

## Visão Geral
- Fluxo público: busca disponibilidade → resultados → checkout → confirmação.
- Painel Admin: calendário, reservas (com mudanças de status), configurações (CRUD de tipos/quartos/temporadas/regras), relatórios de ocupação e receita.
- Preços dinâmicos: temporadas, fim de semana, long stay, feriados.

## Arquitetura
- Banco: Postgres 16.
- ORM: Prisma.
- Auth: JWT (access/refresh), roles: `ADMIN`, `OWNER`, `STAFF`, `GUEST`.
- Segurança: CORS, rate-limit, validações (Zod), logs (morgan), tratamento de erros.
- Docs: Swagger UI em `http://localhost:3000/api-docs` (`apps/api/src/docs/openapi.json`).

## Stack
- API: Node 18+, Express 4, Prisma 5, Jest 29, TypeScript 5, Zod.
- Web: React 18, Vite 5, MUI 6, React Query 5, React Router 6.

## Requisitos
- `Node.js >= 18`, `npm >= 9`.
- Docker Desktop (opcional para DB via Compose) ou Postgres local.

## Instalação
- `npm install`
- (opcional) habilite hooks: `npm run prepare` (Husky + lint-staged).

## Configuração de Ambiente
- API (`apps/api/.env`):
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/hotel
JWT_ACCESS_SECRET=dev_access_secret
JWT_REFRESH_SECRET=dev_refresh_secret
TIMEZONE=America/Sao_Paulo
CHECKIN_HOUR=14
CHECKOUT_HOUR=12
CORS_ORIGIN=http://localhost:5173
ENABLE_STRIPE=false
```
- Web (`apps/web`): por padrão usa `http://localhost:3000/api/v1`. Para customizar, crie `apps/web/.env`:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```
- Observação: `.gitignore` já ignora `.env`, `dist/` e `node_modules/`.

## Banco de Dados
### Via Docker Compose
```
docker compose up -d db
npm run -w apps/api db:generate
npm run -w apps/api db:migrate
npm run -w apps/api db:seed
```
- Se houver erro ao buscar imagem (`unexpected end of JSON input`), verifique se o Docker Desktop está aberto e execute `docker pull postgres:16`.

### Postgres Local
- Configure Postgres 16 em `localhost:5432` com banco `hotel` e usuário `postgres/postgres`.
- Rode `db:generate`, `db:migrate` e `db:seed` como acima.

### Reset Rápido (dev)
- Para limpar e recriar dados: drope o banco e rode `db:migrate` + `db:seed` novamente.

## Desenvolvimento
- Ambos (API + Web): `npm run dev`
  - API: `http://localhost:3000/api/v1` (Swagger: `http://localhost:3000/api-docs`)
  - Web: `http://localhost:5173`
- Apenas um:
  - API: `npm run dev:api`
  - Web: `npm run dev:web`

## Endpoints Principais (ver detalhes no Swagger)
- Auth: `POST /auth/signup`, `POST /auth/login`, `POST /auth/refresh`.
- Pricing: `GET /pricing/quote` (params: `roomTypeId`, `checkIn`, `checkOut`, `guests`).
- Tipos de quarto: `GET/POST/PUT/DELETE /room-types`.
- Quartos: `GET/POST/PUT/DELETE /rooms`.
- Temporadas: `GET/POST/PUT/DELETE /seasons`.
- Regras de preço: `GET/POST/PUT/DELETE /price-rules`.
- Reservas: `POST /bookings`, `GET /bookings`, `GET /bookings/{id}`, `PATCH /bookings/{id}/status`.
- Pagamentos (mock): `POST /payments/intent`, `POST /payments/webhook`.
- Relatórios: `GET /reports/occupancy`, `GET /reports/revenue`.

## Fluxos de Uso (demo)
- Login Admin (Web): formulário no topo do Admin usa as credenciais seed:
  - Email: `admin@example.com`
  - Senha: `password123`
- Reserva: Buscar → Resultados → Checkout → Pagamento (mock) → Confirmação.
- Admin: Config (CRUDs), Calendário, Reservas (mudar status), Relatórios.

## Testes (API)
- Requer Postgres up e migrações aplicadas:
  - `npm run -w apps/api test`
- Os testes exercitam disponibilidade e precificação (utilizam Prisma). Se falhar por conexão, confirme `DATABASE_URL` e se o banco está acessível.

## Build
- Ambos: `npm run build`
- Web: `npm run -w apps/web build` e `npm run -w apps/web preview` para servir build.
- API: `npm run -w apps/api build` e `npm run -w apps/api start`.

## Qualidade de Código
- Lint: `npm run lint` (raiz) ou `npm run -w apps/api lint`.
- Format: `npm run format` (raiz).
- Hooks (opcional): `npm run prepare` e configure pre-commit com `lint-staged`.

## Segurança
- JWT em rotas protegidas; roles exigidas em endpoints admin.
- CORS autorizado para `http://localhost:5173` no dev.
- Rate-limit básico na API.
- `.env` e artefatos já ignorados no Git.

## Troubleshooting
- Prisma não conecta: cheque `DATABASE_URL`, suba Postgres (Docker ou local) e rode migrações/seed.
- Build Web falha com tipos:
  - MUI numérico: use `inputProps={{ step: '0.01' }}` em vez de `step` direto.
  - `react-big-calendar`: instale tipos `npm i -D @types/react-big-calendar`.
- Docker Compose avisa `version` obsoleta: é seguro remover a chave `version` do YAML (não impede execução).
- Imports `.js` em Jest/TS: no código de utilitários, use imports sem extensão para compatibilidade com ts-jest.

## Scripts de Referência
- Raiz:
  - `dev`, `dev:api`, `dev:web`, `build`, `lint`, `format`, `db:migrate`, `db:seed`.
- API:
  - `dev`, `build`, `start`, `lint`, `test`, `db:generate`, `db:migrate`, `db:seed`.
- Web:
  - `dev`, `build`, `preview`.

## Modelo de Dados (resumo)
- `User`, `RoomType`, `Room`, `Season`, `PriceRule`, `Booking`, `Payment`, `Maintenance`.

## Roadmap (ideias)
- Integração real de pagamento (Stripe) com `ENABLE_STRIPE=true`.
- Calendário com arrastar/soltar e bloqueios de manutenção.
- Exportação de relatórios (CSV/PDF).
