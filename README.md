# PegPay

Monorepo da **PegPay Soluções Digitais** — fintech brasileira de crédito.

## Estrutura

```
pegpay/
├── apps/
│   └── site/           Site institucional (pegpay.com.br)
├── packages/           Código compartilhado (criado quando houver 2º consumidor)
├── docs/
│   ├── context/        Blueprint, memória de CTO, bootstrap de agentes
│   ├── design/         Design system e identidade visual oficial
│   ├── architecture/   System context e ADRs
│   ├── agents/         Registro da equipe de agentes
│   └── roadmap/        Roadmap tecnológico do MVP
├── .claude/
│   ├── agents/         13 agentes especializados
│   └── skills/         5 skills compartilhadas
└── CLAUDE.md           Regras que valem em toda sessão
```

## Comandos

```bash
npm install          # instala todos os workspaces
npm run dev          # sobe o site em localhost:3000
npm run build        # build de produção do site
npm run lint         # lint do site
npm run build:all    # build de todos os workspaces
```

Para um workspace específico:

```bash
npm run <script> -w @pegpay/site
```

## Apps

| App | Pacote | Stack | Estado |
| --- | --- | --- | --- |
| Site institucional | `@pegpay/site` | Vite + React 19 + TS + Tailwind 3 | Em produção |
| API | — | Node + TS + NestJS + PostgreSQL | Planejado |
| App mobile | — | React Native + Expo | Planejado |
| Admin | — | Next.js | Planejado |

## Deploy

O site é servido pela Vercel a partir da branch `main`. O `vercel.json` na raiz aponta o build para `apps/site` — o Root Directory do projeto na Vercel continua sendo a raiz do repositório.

## Antes de contribuir

Leia o `CLAUDE.md`. Regras que não têm exceção: dinheiro nunca em float, idempotência em operação financeira, auditoria em operação crítica, nada apagado em crédito ou contrato, nenhum secret no cliente, nenhuma integração inventada.
