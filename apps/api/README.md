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
OSRM_BASE_URL="https://router.project-osrm.org"  # opcional, esse é o padrão
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

## Endpoints

### Universidades

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/universities` | Lista todas as universidades (inclui alunos vinculados) |
| `POST` | `/universities` | Cria uma universidade |
| `DELETE` | `/universities/:id` | Remove uma universidade |

Body de criação:
```json
{ "name": "UFMG", "latitude": -19.8716, "longitude": -43.9671 }
```

### Alunos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/students` | Lista todos os alunos (com universidade) |
| `POST` | `/students` | Cria um aluno |
| `PATCH` | `/students/:id` | Atualiza um aluno |
| `DELETE` | `/students/:id` | Remove um aluno |

### Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/routes/generate` | Gera rota otimizada |

Body:
```json
{ "type": "IDA" | "VOLTA" }
```

Resposta:
```json
{
  "routeId": "uuid",
  "type": "VOLTA",
  "totalDistance": 18420,
  "totalDuration": 1380,
  "geometry": { "...GeoJSON LineString..." },
  "stops": [
    { "label": "UFMG", "lat": -19.87, "lng": -43.96, "kind": "university", "order": 1 },
    { "label": "João Silva", "lat": -19.92, "lng": -44.01, "kind": "student", "order": 2 }
  ]
}
```

## Lógica de geração de rota

O algoritmo usa **OSRM** (Open Source Routing Machine) via instância pública gratuita.

- **IDA** (manhã — indo ao campus): casas dos alunos → universidades
- **VOLTA** (tarde — voltando do campus): universidades → casas dos alunos

Suporta múltiplas universidades. A ordem de visita dentro de cada grupo (universidades e casas) é otimizada separadamente via TSP (`/trip/v1`). A geometria final é calculada via `/route/v1` com a sequência já ordenada.

## Dicas

- O `ValidationPipe` está com `whitelist: true` e `forbidNonWhitelisted: true` — campos extras e obrigatórios ausentes geram 400.
- Se mudar o schema Prisma, rode `pnpm prisma:generate` para atualizar os tipos do client.
- Para um sanity check rápido: `pnpm tsc --noEmit` em `apps/api`.
- Para usar um servidor OSRM próprio (recomendado para produção), configure `OSRM_BASE_URL` no `.env`.
