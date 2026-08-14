# ADR-004 — Consentimento de cookies e carregadores de analytics/marketing

- **Status:** Aceito
- **Data:** 2026-08-14
- **Decisores:** Kaio Pirolo (pedido) · CTO Orchestrator (implementação)

## Contexto

O site precisava de um sistema de cookies completo: categorias (necessários,
analytics, marketing), integração com o padrão do Google para consentimento
(**Google Consent Mode v2**) e carregadores para Google Analytics 4 e Meta
Pixel. Até aqui só existia um aviso de aceite único, sem granularidade e sem
nenhuma integração real.

Não existe, hoje, nenhuma propriedade GA4 nem Meta Pixel criada para a
PegPay — nenhum Measurement ID ou Pixel ID foi fornecido. A regra do projeto
é nunca inventar credencial ou integração não contratada.

## Alternativas

### A. Adiar toda a implementação até existirem os IDs reais

- **A favor:** zero risco de código morto ou mal configurado.
- **Contra:** quando os IDs existirem, a granularidade de consentimento
  (banner com aceitar/rejeitar/personalizar) ainda precisará existir antes de
  qualquer script do Google/Meta poder rodar — não dá para adicionar o
  tracking depois sem também construir o consentimento primeiro. Adiar tudo
  atrasa desnecessariamente a parte que não depende de credencial.

### B. Construir a arquitetura completa, IDs vazios por variável de ambiente *(escolhida)*

- **A favor:** o Consent Mode v2 (estado *default denied*, atualizado via
  `gtag('consent','update', …)`) e o banner granular não dependem de ter um
  ID real — são a camada de consentimento em si. Os carregadores de GA4 e
  Meta Pixel ficam prontos, mas são no-op sem `VITE_GA_MEASUREMENT_ID` /
  `VITE_META_PIXEL_ID` definidos. Nenhuma requisição sai para Google ou Meta
  até essas variáveis existirem.
- **Contra:** código para duas integrações que ainda não estão "ligadas" —
  mitigado por serem poucas linhas e por seguirem o mesmo padrão adapter já
  usado em KYC/bureau (interface pronta, sem fornecedor fake).

## Decisão

**Alternativa B.**

### O que foi construído

- `apps/site/index.html`: bootstrap inline do Consent Mode v2 — define
  `dataLayer`/`gtag` e o estado default (tudo negado, exceto
  `functionality_storage`/`security_storage`) antes de qualquer script do
  Google carregar. Isso precisa ser inline e rodar antes do bundle React.
- `src/lib/consent.ts`: modelo de preferências (`necessarios` sempre `true`,
  `analytics`, `marketing`), persistido versionado em `localStorage`.
- `src/lib/analytics.ts`: injeta `gtag.js` (GA4) e `fbevents.js` (Meta Pixel)
  sob demanda — só na primeira vez que a categoria correspondente é
  concedida, e só se o ID daquela integração estiver configurado. Também
  expõe `aplicarConsentimento`, que chama `gtag('consent','update', …)` com
  os quatro sinais do Consent Mode (`ad_storage`, `ad_user_data`,
  `ad_personalization`, `analytics_storage`).
- `src/components/CookieConsent.tsx`: banner com três ações — **Aceitar
  todos**, **Rejeitar não essenciais**, **Personalizar** (painel com toggle
  por categoria). Necessário está sempre ligado e desabilitado.
- `.env.example`: documenta `VITE_GA_MEASUREMENT_ID` e `VITE_META_PIXEL_ID`,
  vazios por padrão.
- Link "Preferências de cookies" no rodapé (dispara evento
  `pegpay:abrir-preferencias-cookies`, que o banner escuta) e nova seção
  "Cookies" na página de Privacidade.

### Ativação futura

Quando as propriedades reais existirem, ativar é preencher as duas variáveis
de ambiente no ambiente de deploy (Vercel) — nenhuma mudança de código é
necessária.

## Consequências

- Site passa a ter consentimento granular real, alinhado tanto ao padrão do
  Google quanto ao princípio de consentimento específico da LGPD (um único
  botão "Aceitar" para tudo é o padrão que a LGPD trata como inválido para
  bases que dependam de consentimento).
- Enquanto os IDs não forem configurados, o sistema é funcionalmente idêntico
  a "sem analytics" — não há dado sendo coletado, mesmo que o usuário aceite
  tudo no banner.
- A página de Privacidade (ver `docs/context/` — ainda **minuta sem validação
  jurídica**) ganhou a seção de cookies; quando a validação jurídica
  acontecer, essa seção deve ser revisada junto com o resto do texto.
