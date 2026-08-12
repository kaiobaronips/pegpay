# PegPay — System Context

> Estado: **12/08/2026**. Este documento distingue explicitamente o que **existe hoje** do que é **planejado**.

## 1. O que existe hoje

Monorepo com npm workspaces (ADR-001). Um único app:

```
pegpay/
├── apps/site/     @pegpay/site — pegpay.com.br
│                  Vite 7 + React 19 + TS + Tailwind 3 (SPA)
│                  react-router · deploy Vercel (branch main)
│                  Rotas: / /privacidade /seguranca /central-de-ajuda
│                  Simulador client-side (vitrine, estimado)
│                  Conversão → WhatsApp oficial
├── packages/      vazio — nasce com o 2º consumidor
└── docs/ .claude/ CLAUDE.md
```

Sem backend. Sem banco. Sem autenticação. Sem testes. Sem CI. Sem staging. Push na `main` vai direto para produção.

## 2. Visão alvo

```
                   ┌─────────────────┐
                   │   PegPay Web    │
                   │ site · portal   │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
┌─────────────┐    │                 │    ┌──────────────┐
│ PegPay App  ├────►   PegPay API    ◄────┤ PegPay Admin │
│ iOS/Android │    │  (modular       │    │  backoffice  │
└─────────────┘    │   monolith)     │    └──────────────┘
                   └────────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         ┌────▼────┐   ┌────▼────┐   ┌────▼─────┐
         │ Credit  │   │Customer │   │Contracts │
         │ Domain  │   │ Domain  │   │ Domain   │
         └────┬────┘   └─────────┘   └──────────┘
              │
         ┌────▼────┐
         │  Risk   │   políticas versionadas
         │ Engine  │   decisão rastreável
         └────┬────┘
              │
        ┌─────▼──────────┐
        │  Integration   │  interface primeiro,
        │  Adapters      │  adapter depois
        └─────┬──────────┘
              │
     ┌────────┼────────┬──────────┬─────────┐
     │        │        │          │         │
    KYC   Payments  Bureaus  Assinatura  Notificações
```

Todas as interfaces consomem **as mesmas APIs de domínio**. Nenhuma delas recalcula regra financeira.

## 3. Domínios

| Domínio | Responsabilidade | Estado |
| --- | --- | --- |
| `auth` | Autenticação, sessão, tokens | Planejado |
| `users` | Usuários internos, perfis, RBAC | Planejado |
| `customers` | Cliente, perfil, dados cadastrais | Planejado |
| `kyc` | Identificação, documento, prova de vida | Planejado |
| `credit` | Simulação, elegibilidade, decisão | Planejado |
| `risk` | Políticas, scoring, pricing | Planejado |
| `fraud` | Sinais e regras antifraude | Planejado |
| `proposals` | Proposta e ciclo de vida | Planejado |
| `contracts` | Formalização, assinatura, documentos | Planejado |
| `payments` | Liberação e recebimento | Planejado |
| `billing` | Parcelas, vencimentos, cobrança | Planejado |
| `collections` | Atraso, negociação, recuperação | Planejado |
| `documents` | Gestão documental | Planejado |
| `notifications` | E-mail, SMS, WhatsApp, push | Planejado |
| `integrations` | Adapters de fornecedores externos | Planejado |
| `admin` | Backoffice operacional | Planejado |
| `analytics` | Dados para decisão | Planejado |
| `audit` | Registro imutável de operação crítica | Planejado |

## 4. Princípios estruturais

- **Modular monolith first.** Um deployable, fronteiras internas rígidas. Microservice só quando houver benefício concreto e demonstrado.
- **Backend é autoridade.** Web, app e admin exibem; não decidem.
- **Contract first.** O contrato existe antes da implementação.
- **Dinheiro nunca em float.** Integer em centavos ou `NUMERIC(18,2)`.
- **Nada é apagado** em crédito, proposta, contrato, transação, KYC ou auditoria.
- **Nenhum fornecedor acoplado ao domínio.** Interface primeiro, adapter depois, mock sempre.
- **Observabilidade desde o MVP**, não como retrofit.

## 5. Fluxo de decisão de crédito

```
INPUT → VALIDATION → ENRICHMENT → FRAUD SIGNALS → RISK POLICIES
     → SCORING → DECISION ENGINE → PRICING → CREDIT OFFER
```

Toda decisão registra: input · fontes · política e versão · score · decisão · motivos · pricing · modelo e versão · timestamp.

Nenhuma política real está definida. IA generativa nunca é autoridade única.

## 6. Integrações — nenhuma existe

O rodapé do site menciona MOVA S.E.P., CELCOIN I.P. e DOCK I.P. Isso é **informação de negócio a confirmar**, não integração disponível. Antes de implementar contra qualquer fornecedor: confirmar contrato, credencial e sandbox com o humano.

Abstrações previstas: `KYCProvider` · `CreditBureauProvider` · `PaymentProvider` · `SignatureProvider` · `NotificationProvider` · `StorageProvider` · `FraudProvider`.

## 7. Lacunas conhecidas

| Lacuna | Impacto | Onde resolver |
| --- | --- | --- |
| Sem staging; `main` → produção | Alto | Fundação, DevOps |
| Sem testes e sem CI | Alto | Fundação, QA |
| ~~Estrutura de repositório indefinida~~ | — | **Resolvido — ADR-001 aceito** |
| `vite.config.ts` com `base: './'` quebra rota aninhada | Baixo hoje | Correção isolada |
| Cloud e banco não escolhidos | Alto | ADR pendente, decisão humana |
| Política de privacidade sem validação jurídica | Alto (regulatório) | Jurídico |
| Encarregado de dados (DPO) indefinido | Alto (LGPD art. 41) | Decisão humana |
| CNPJ placeholder no aviso regulatório | Médio | Aguardando constituição |
| Nenhuma política real de crédito definida | Bloqueia o motor | Decisão humana |
