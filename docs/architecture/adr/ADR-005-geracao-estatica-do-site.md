# ADR-005 — Geração estática (SSG) do site institucional

- **Status:** Aceito
- **Data:** 2026-08-16
- **Decisores:** Kaio Pirolo (decisão) · CTO Orchestrator (implementação)

## Contexto

A auditoria de SEO/AEO/GEO (`docs/growth/SEO_AEO_GEO.md`) registrou uma limitação que nenhum ajuste de marcação resolvia: o site é uma SPA client-rendered (Vite + React), sem renderização no servidor.

Na prática, o HTML entregue na primeira resposta era uma casca — `<div id="root"></div>` — e **todo** o conteúdo, incluindo título, meta description, canonical e o JSON-LD adicionado na rodada anterior, só passava a existir depois que o JavaScript rodava no navegador, via `useEffect`.

O Googlebot executa JavaScript e enxerga o resultado final. O problema é o outro público: boa parte dos crawlers de engines generativas (o alvo de GEO) lê apenas o HTML bruto. Para eles, o site não tinha título, não tinha descrição e não tinha nenhum dado estruturado — exatamente o oposto do que a rodada anterior tentou entregar.

## Alternativas

### A. Migrar para um framework com SSR (Next.js)

- **A favor:** resolve de raiz; é a stack já definida como preferencial para produtos novos (portal, admin); serve conteúdo dinâmico por request no futuro.
- **Contra:** reescrita real — roteamento, build e deploy mudam. O site tem 10 páginas **estáticas**, sem nada que varie por usuário ou por request: SSR resolveria o mesmo problema que a geração estática resolve, com um custo e um risco desproporcionais ao problema atual. O `CLAUDE.md` do projeto já exige ADR para migrar o site existente, justamente para essa decisão não ser tomada de passagem.

### B. Geração estática no build (prerender/SSG) *(escolhida)*

- **A favor:** o conteúdo do site não muda por request, então HTML gerado em build é equivalente a SSR para todos os efeitos que importam aqui. Mantém Vite, React, roteamento, deploy e o design system intactos. O runtime continua sendo o mesmo SPA. Implementação contida: uma entrada de servidor, um script de build e um ajuste no `package.json`.
- **Contra:** não serve conteúdo dinâmico por request — irrelevante hoje, e o dia em que o site precisar disso é o dia de reabrir esta decisão. Rotas novas precisam entrar em `src/lib/rotas.ts` (o build falha se uma rota listada não renderizar, então o erro aparece cedo).

### C. Manter como estava, só com os hooks de `useEffect`

- **A favor:** custo zero.
- **Contra:** deixa o objetivo de GEO por cumprir. O JSON-LD que já existe fica invisível para exatamente o público que ele pretendia atender.

## Decisão

**Alternativa B.**

### Como funciona

1. `vite build` gera o cliente, como antes.
2. `vite build --ssr src/entry-server.tsx` gera um bundle de servidor.
3. `scripts/prerender.mjs` renderiza cada rota de `ROTAS_ESTATICAS` em Node e grava um `index.html` por rota em `dist/`, com o conteúdo já no HTML.

### O detalhe que exigiu cuidado

`useSeo` e `useJsonLd` funcionam por `useEffect`, e **efeito não roda em render de servidor**. Um prerender ingênuo geraria páginas com corpo, mas sem título, descrição nem JSON-LD — sem resolver o problema que motivou a mudança.

A saída poderia ter sido manter uma segunda lista de metadados por rota, para o build ler. Isso foi rejeitado: seria uma cópia dos mesmos dados, que sai do lugar assim que alguém editar uma página e esquecer da lista.

Em vez disso, os próprios hooks alimentam os dois caminhos. Existe um `ContextoHead` que só é provido durante a geração estática; quando ele está presente, `useSeo` e `useJsonLd` escrevem nele durante o render. No navegador não há provider, o contexto é nulo e o comportamento é exatamente o anterior. Uma fonte só, sem duplicação.

O HTML gerado marca seus scripts de schema com `data-prerender`; o `main.tsx` os remove quando o React assume, senão a página ficaria com o mesmo JSON-LD duas vezes.

## Consequências

- O HTML da primeira resposta passa a conter conteúdo, título, descrição, canonical e JSON-LD em todas as 10 rotas — verificável com `curl`, sem executar JavaScript.
- O build ficou com mais um passo e leva alguns segundos a mais. Em compensação, **falha explicitamente** se uma rota não renderizar ou não definir título, o que transforma um erro silencioso de SEO em erro de build.
- **Rota nova precisa entrar em `src/lib/rotas.ts`.** As de produto derivam de `PRODUTOS` e entram sozinhas; as institucionais são manuais.
- O `vercel.json` mantém o rewrite de SPA como fallback para rotas desconhecidas. Ele não atropela os arquivos gerados porque a Vercel resolve o sistema de arquivos antes de aplicar rewrites — é o mesmo motivo pelo qual os assets já funcionavam com esse rewrite no lugar.
- Hidratação não foi adotada: o React continua renderizando o cliente por cima do HTML pré-gerado (`createRoot`, não `hydrateRoot`). O objetivo aqui é o HTML visível ao crawler, não performance de carregamento, e hidratar traria divergências reais — o banner de cookies depende de `localStorage`, que não existe no build. Se o ganho de performance passar a importar, é uma decisão separada.
- Não substitui SSR para o dia em que houver conteúdo por usuário ou por request. Nesse dia, reabrir esta ADR.
