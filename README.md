# Monitor de FIIs

MVP para acompanhar fundos imobiliarios com foco inicial em cotacao e grafico near real-time.

Por enquanto o ativo acompanhado esta hardcoded como `ARRI11`. A tela consulta o backend, que usa `yahoo-finance2` para buscar dados do Yahoo Finance com o simbolo `ARRI11.SA`.

## Stack

- Backend: Node.js, Express, TypeScript, Awilix
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Dados de mercado: `yahoo-finance2`

## Requisitos

- Node.js 20 ou superior
- npm

## Instalar

```bash
npm install
```

## Rodar o MVP de mercado

Na raiz do projeto:

```bash
npm run market:dev
```

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

Rotas principais:

```text
GET /api/v1/market/quote/ARRI11
GET /api/v1/market/chart/ARRI11?interval=5m
```

## Validar a integracao Yahoo

```bash
npm run spike:yahoo --workspace backend
```

Esse comando consulta `ARRI11.SA`, imprime a cotacao atual e alguns pontos do grafico.

## Observacoes

- O Yahoo Finance nao oferece uma API oficial publica com SLA. O pacote `yahoo-finance2` usa endpoints nao oficiais.
- As chamadas devem continuar passando pelo backend, nunca diretamente pelo frontend.
- Para reduzir risco de bloqueio/limite, a proxima etapa deve adicionar cache de curta duracao para quote e chart.
- A parte de eventos, comunicados e documentos dos FIIs deve ser integrada separadamente, preferencialmente via CVM Dados Abertos.
