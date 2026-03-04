# SmartRoute API (NestJS + Prisma)

Guia rápido para subir o backend localmente.

## Pré-requisitos

- Node.js 18+
- pnpm (monorepo já usa pnpm)
- PostgreSQL acessível e variável `DATABASE_URL` configurada

## Passo a passo

1. Instale dependências (na raiz do repo):

```bash
pnpm install
```

2. Configure o ambiente (`apps/api/.env`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME"
```

3. Aplique migrations e gere o client Prisma (a partir de `apps/api`):

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

4. Suba o servidor em modo watch (a partir de `apps/api`):

```bash
pnpm dev
```

A API sobe em `http://localhost:3000`.

## Endpoints úteis

- `POST /universities` — cria universidade
- `POST /students` — cria estudante (usa `universityId`)
- `GET /universities` — lista universidades
- `GET /students` — lista estudantes (com universidade)
- `POST /routes/generate` — gera rota (body `{ "type": "IDA" | "VOLTA" }`)

## Dicas

- O `ValidationPipe` está com `whitelist=true` e `forbidNonWhitelisted=true`, então campos extras e campos obrigatórios ausentes geram 400.
- Se mudar o schema Prisma, rode `pnpm prisma:generate` para atualizar os tipos do client.
- Para um sanity check rápido: `pnpm tsc --noEmit` em `apps/api`.
