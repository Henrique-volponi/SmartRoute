# 🚐 SmartRoute Van

Sistema inteligente de roteirização para transporte universitário intermunicipal, focado na otimização de trajetos entre **Vespasiano (MG)** e **Belo Horizonte (MG)**.

---

## 📌 Sobre o Projeto

Motoristas de vans universitárias precisam definir diariamente a melhor ordem para buscar alunos em diferentes bairros e deixá-los em faculdades distintas, minimizando tempo e consumo de combustível.

Este projeto resolve esse problema de forma automatizada, calculando a **melhor rota possível** tanto para a ida quanto para a volta.

---

## 🎯 Objetivo

Gerar automaticamente:

- 🚐 Melhor rota de **IDA** (manhã)
  - Buscar alunos em suas casas
  - Definir ordem otimizada de coleta
  - Deixá-los nas respectivas faculdades

- 🏫 Melhor rota de **VOLTA** (tarde)
  - Sair das faculdades (visitando todas primeiro)
  - Otimizar a sequência de entrega dos alunos em casa

Tudo considerando:

- 📍 Múltiplas faculdades e alunos  
- 📏 Menor distância total  
- ⏱️ Menor tempo estimado  
- 🧠 Otimização automática da ordem das paradas  
- 🚦 Simulação de trânsito com base no horário real do usuário

---

## 🗺️ Tecnologias Utilizadas

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- React Leaflet + OpenStreetMap
- Pure CSS (tema dark, sem framework)

### Backend
- Node.js / NestJS
- Prisma ORM

### Banco de Dados
- PostgreSQL

### Mapas e Roteirização
- OSRM — Open Source Routing Machine (gratuito, sem chave de API)
- OpenStreetMap

Projeto desenvolvido utilizando soluções **100% gratuitas e open-source**.

---

## 🏗️ Arquitetura

```
SmartRoute/
├── apps/
│   ├── api/                  # Backend NestJS
│   │   ├── src/
│   │   │   ├── universities/ # CRUD de universidades
│   │   │   ├── students/     # CRUD de alunos
│   │   │   └── routes/       # Geração e otimização de rotas
│   │   └── prisma/           # Schema e migrations
│   └── web/                  # Frontend Next.js
│       ├── app/              # App Router + estilos CSS
│       ├── components/       # Sidebar, MapView, Forms, Dialogs
│       ├── hooks/            # useRoutePlanner, useUniversities
│       ├── services/         # Clientes HTTP (axios)
│       ├── types/            # Interfaces TypeScript
│       └── utils/            # traffic.ts (simulação de trânsito)
└── turbo.json
```

---

## 🚀 Funcionalidades

### Gerenciamento
- Cadastro, edição e exclusão de **universidades** e **alunos**
- Confirmação antes de excluir ou salvar alterações

### Otimização de rotas
- Algoritmo TSP via OSRM `/trip/v1` para ordenar paradas dentro de cada grupo
- Rota final gerada via OSRM `/route/v1` com sequência fixa
- Resultado exibido no mapa com numeração de paradas

### Simulação de trânsito
Ao gerar uma rota, o sistema captura o horário da máquina do usuário e aplica multiplicadores sobre a duração base:

| Período | Multiplicador | Indicador |
|---------|-------------|-----------|
| 7h–9h (pico manhã) | ×1.70 | 🔴 |
| 17h–20h (pico tarde) | ×1.65 | 🔴 |
| 12h–14h (almoço) | ×1.30 | 🟡 |
| 9h–12h / 14h–17h | ×1.15–1.20 | 🟡 |
| 20h–23h | ×1.05 | 🟢 |
| 23h–7h | ×1.00 | 🟢 |

Exibe também estimativa de combustível (base: 12 L/100km para van) com fator de impacto do trânsito.

---

## 🚀 Início rápido

```bash
# Instalar dependências
pnpm install

# Configurar banco (apps/api/.env)
echo 'DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME"' > apps/api/.env

# Aplicar migrations
cd apps/api && pnpm prisma:migrate && pnpm prisma:generate && cd ../..

# Subir tudo
pnpm dev
```

- API: `http://localhost:3000`
- Web: `http://localhost:3001`

---

## 📍 Contexto Real

Inspirado em um cenário real de transporte universitário intermunicipal entre Vespasiano – MG e Belo Horizonte – MG, atendendo múltiplos alunos e múltiplas instituições de ensino em uma única rota.

---

## 👨‍💻 Autor

Henrique Volponi  
Projeto desenvolvido para portfólio técnico com foco em otimização, arquitetura e integração com sistemas de mapas.
