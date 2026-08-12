# ADR-001 — Estrutura de repositório da plataforma

- **Status:** **Aceito** — alternativa A, aprovada por Kaio Pirolo em 2026-08-12 e implementada no mesmo dia
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

**Alternativa A** — monorepo evoluindo deste repositório, com o site movido para `apps/site` e npm workspaces como ponto de partida (sem Turborepo até o tempo de build justificar).

Razão principal: a regra de *contract first* — tipos e schemas compartilhados entre API, web e mobile — é muito mais barata de sustentar em um monorepo, e o risco que ela mitiga (cinco superfícies inventando cinco contratos) é o risco mais caro desta plataforma.

## Consequências

Implementado em 2026-08-12:

- Site movido para `apps/site` com `git mv`, preservando o histórico. Pacote renomeado de `my-app` para `@pegpay/site`.
- `package.json` na raiz com `workspaces: ["apps/*", "packages/*"]` e scripts que delegam ao workspace.
- **Deploy resolvido sem mexer no painel da Vercel:** em vez de alterar o Root Directory, o `vercel.json` da raiz declara `buildCommand: npm run build -w @pegpay/site` e `outputDirectory: apps/site/dist`. O rewrite de SPA passou a morar nesse mesmo arquivo. Isso evita uma mudança de configuração fora do versionamento — a definição de build fica no repositório, revisável em PR.
- `packages/` **não foi criado vazio**. Criar pacote sem consumidor é a duplicação que o YAGNI do `CTO_PROJECT_MEMORY.md` §4 manda evitar. `packages/types` e `packages/validation` nascem junto com a API, que é o segundo consumidor.
- O bundle gerado após a mudança é byte-idêntico ao anterior (`index-kuG8BUx2.js`), confirmando que a reestruturação não alterou a saída.

Custos aceitos:

- A fronteira entre domínios passa a ser convenção, não sistema de arquivos. O monorepo não impede import indevido — isso vira responsabilidade da revisão de código e, quando doer, de regra de lint.
- O build da Vercel passa a instalar todos os workspaces, não só o do site. Hoje irrelevante; quando a API existir, vale avaliar cache de tarefas.

Pendência anotada, fora do escopo deste ADR: o `vite.config.ts` usa `base: './'`, que quebra em rota aninhada de mais de um nível. Corrigir para `base: '/'` em mudança isolada.
