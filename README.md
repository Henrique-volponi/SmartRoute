# 🚐 SmartRoute Van

Sistema inteligente de roteirização para transporte universitário intermunicipal, focado na otimização de trajetos entre **Vespasiano (MG)** e **Belo Horizonte (MG)**.

---

## 📌 Sobre o Projeto

Motoristas de vans universitárias precisam definir diariamente a melhor ordem para buscar alunos em diferentes bairros e deixá-los em faculdades distintas, minimizando tempo e consumo de combustível.

Este projeto resolve esse problema de forma automatizada, calculando a **melhor rota possível** tanto para a ida quanto para a volta.

---

## 🎯 Objetivo

Gerar automaticamente:

- 🚐 Melhor rota de **IDA**
  - Buscar alunos em suas casas
  - Definir ordem otimizada
  - Deixá-los nas respectivas faculdades

- 🏫 Melhor rota de **VOLTA**
  - Sair das faculdades
  - Determinar qual instituição visitar primeiro
  - Otimizar a sequência de entrega dos alunos em casa

Tudo considerando:

- 📍 Múltiplos pontos de origem e destino  
- 📏 Menor distância total  
- ⏱️ Menor tempo estimado  
- 🧠 Otimização automática da ordem das paradas  

---

## 🧠 Como Funciona

1. Endereços são convertidos em coordenadas geográficas (latitude/longitude)
2. O sistema envia os pontos para um motor de roteirização
3. A melhor ordem de paradas é calculada automaticamente
4. O sistema retorna:
   - Sequência otimizada
   - Distância total
   - Tempo estimado
   - Linha da rota para visualização no mapa

---

## 🗺️ Tecnologias Utilizadas

### Frontend
- Next.js
- TypeScript
- React Leaflet

### Backend
- Node.js / NestJS
- Prisma ORM

### Banco de Dados
- PostgreSQL

### Mapas e Roteirização
- OpenStreetMap
- OSRM (Open Source Routing Machine)
- Nominatim (Geocoding)

Projeto desenvolvido utilizando soluções **100% gratuitas e open-source**.

---

## 🏗️ Arquitetura

- Arquitetura separada (Frontend + Backend)
- API REST para geração de rotas
- Serviço dedicado para otimização
- Banco relacional com modelagem de alunos e faculdades
- Integração com motor de roteirização externo

---

## 🚀 Diferenciais Técnicos

- Aplicação prática de problemas de otimização de rotas (Vehicle Routing Problem)
- Geração dinâmica de rotas de ida e volta
- Integração com API externa de roteirização
- Estrutura escalável para múltiplas vans
- Projeto inspirado em problema real

---

## 📍 Contexto Real

Inspirado em um cenário real de transporte universitário intermunicipal entre:

- Vespasiano – MG  
- Belo Horizonte – MG  

Atendendo múltiplos alunos e múltiplas instituições de ensino em uma única rota.

---

## 📈 Futuras Melhorias

- Comparação entre rota aleatória vs rota otimizada
- Cálculo de economia estimada de combustível
- Dashboard para múltiplas vans
- Simulação de trânsito
- Autenticação de motoristas

---

## 👨‍💻 Autor

Henrique Volponi  
Projeto desenvolvido para portfólio técnico com foco em otimização, arquitetura e integração com sistemas de mapas.
