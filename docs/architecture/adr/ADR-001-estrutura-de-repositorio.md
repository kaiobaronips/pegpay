# ADR-001 — Estrutura de repositório da plataforma

- **Status:** Proposto — aguardando decisão humana
- **Data:** 2026-08-12
- **Decisores:** Kaio Pirolo (aprovação) · CTO Orchestrator (recomendação)

## Contexto

O repositório `kaiobaronips/pegpay` contém hoje apenas o site institucional: Vite + React 19 + TypeScript + Tailwind, SPA, deploy na Vercel a partir da `main`. A raiz do repositório é a raiz da aplicação web — não há `apps/` nem `packages/`.

A plataforma (API, app mobile, admin, motor de crédito, banco) será construída do zero. Antes de escrever a primeira linha, é preciso decidir onde ela vive. A decisão afeta CI, deploy, compartilhamento de tipos e o custo de mudar depois.

## Alternativas

### A. Monorepo evoluindo deste repositório *(recomendada)*

Mover o site para `apps/site` e crescer para `apps/api`, `apps/admin`, `apps/mobile`, `packages/types`, `packages/ui`, `packages/validation`.

- **A favor:** contrato tipado compartilhado entre API, web e mobile em um único lugar — que é exatamente o que a regra de *contract first* exige; um PR atravessa backend e frontend de forma atômica; preserva o histórico do site; um só CI.
- **Contra:** exige reconfigurar o deploy da Vercel (root directory); build fica mais lento sem cache de tarefas; disciplina de fronteira passa a ser responsabilidade do time, não do sistema de arquivos.

### B. Repositórios separados

`pegpay-site`, `pegpay-api`, `pegpay-app`, `pegpay-admin`.

- **A favor:** isolamento claro; CI independente; permissão por repositório.
- **Contra:** o contrato compartilhado vira pacote publicado e versionado — atrito alto para um time pequeno; mudança que atravessa API e cliente exige PRs coordenados; é o caminho mais rápido para frontend e backend divergirem, o problema que a arquitetura tenta evitar.

### C. Manter o site como está e criar um repositório novo só para a plataforma

- **A favor:** o site de marketing tem ciclo de vida próprio e deploy trivial; não mexe no que está funcionando.
- **Contra:** o portal do cliente vai querer os mesmos componentes e tokens do site; duplicação de design system desde o dia um.

## Decisão

**Pendente de aprovação humana.**

Recomendação: **alternativa A**, monorepo evoluindo deste repositório, com o site movido para `apps/site` e npm workspaces como ponto de partida (sem Turborepo até o build doer). Razão principal: a regra de *contract first* — tipos e schemas compartilhados entre API, web e mobile — é muito mais barata de sustentar em um monorepo, e o risco que ela mitiga (cinco superfícies inventando cinco contratos) é o risco mais caro desta plataforma.

## Consequências

Se A for aprovada:

- Reconfigurar o Root Directory do projeto na Vercel para `apps/site`.
- Introduzir npm workspaces; avaliar Turborepo apenas quando o tempo de build justificar.
- `packages/types` e `packages/validation` passam a ser a fonte do contrato.
- O site continua com deploy independente dos demais apps.
- A fronteira entre domínios passa a ser convenção — precisa ser reforçada em revisão de código, já que o monorepo não impede import indevido por si só.

Se B ou C forem escolhidas, este ADR deve ser reescrito com as consequências correspondentes antes de qualquer código de plataforma ser escrito.
