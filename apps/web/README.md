# SmartRoute Web (Next.js + Leaflet)

Guia rápido para subir o frontend localmente, na mesma linha do README da API.

## Pré-requisitos

- Node.js 18+
- pnpm (monorepo já usa pnpm)
- API rodando e acessível (por padrão espera `http://localhost:3000` ou defina a variável abaixo)

## Configuração

1. Instale dependências (na raiz do repo):

```bash
pnpm install
```

2. Exponha a URL da API (arquivo `apps/web/.env.local`):

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

> Se não definir, o front tenta `http://localhost:3001` por padrão.

## Rodando

- Ambiente de desenvolvimento (a partir de `apps/web`):

```bash
pnpm dev
```

- Build e servidor de produção local:

```bash
pnpm build
pnpm start
```

A aplicação abre em `http://localhost:3001` (porta padrão do Next dev). Ajuste com `-p` se precisar.

## Fluxo principal

- Ao carregar, busca estudantes via `GET /students` e lista na sidebar.
- Botões "Gerar ida"/"Gerar volta" chamam `POST /routes/generate` com `{ type: "IDA" | "VOLTA" }`.
- O mapa (Leaflet) plota a geometria retornada e ordena os pontos de parada conforme `optimizedOrder`; se a API não enviar ordem, usa a ordem básica (universidade + estudantes).

## Estrutura rápida

- `app/page.tsx` — página principal com layout da sidebar + mapa.
- `hooks/useRoutePlanner.ts` — estado e orquestração de chamadas (`/students`, `/routes/generate`).
- `components/Sidebar.tsx` — lista estudantes, resumo da rota e ações.
- `components/MapView.tsx` — renderiza mapa e polilinha.
- `services/` — wrappers de API (`api.ts`, `students.ts`, `routes.ts`).

## Dicas

- Se a API mudar de porta/host, ajuste `NEXT_PUBLIC_API_URL` e reinicie o dev server.
- Leaflet precisa de CSS global; já está importado em `app/globals.css`.
- Para checar tipos rapidamente: `pnpm lint` ou `pnpm tsc --noEmit` em `apps/web`.
