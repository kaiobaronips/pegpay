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

O software é o **intermediário entre o cliente e o atendimento humano** — não o executor da operação (ADR-002).

```
   ┌──────────────┐                      ┌──────────────────┐
   │  Site        │  lead                │   Atendimento    │
   │ institucional├─────────────────────►│     humano       │
   │ (captação)   │                      │   + RD Station   │
   └──────────────┘                      └────────▲─────────┘
                                                  │
                   ┌─────────────────┐            │
┌─────────────┐    │                 │    ┌───────┴──────┐
│ PegPay App  ├────►   PegPay API    ◄────┤ PegPay Admin │
│ cadastro    │    │  (modular       │    │ apoio ao     │
│ verificação │    │   monolith)     │    │ atendimento  │
│ recorrência │    └────────┬────────┘    └──────────────┘
└─────────────┘             │
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         ┌────▼────┐   ┌────▼────┐   ┌────▼─────┐
         │Proposal│   │Customer │   │Documents │
         │ Domain  │   │ Domain  │   │ Domain   │
         └────┬────┘   └─────────┘   └──────────┘
              │
         ┌────▼────┐
         │Partner  │   proposta e status
         │Integration│ rastreáveis
         └────┬────┘
              │
        ┌─────▼──────────┐
        │  Integration   │  interface primeiro,
        │  Adapters      │  adapter depois
        └─────┬──────────┘
              │
   ┌──────┬───┴───┬──────────┬────────────┬──────────┐
   │      │       │          │            │          │
  KYC  Bureaus  CRM   Assinatura  Notificações   Instituição
                                               parceira
                                          (libera o dinheiro
                                           e recebe as parcelas)
```

Todas as interfaces consomem **as mesmas APIs de domínio**. Nenhuma delas recalcula regra financeira.

A análise, a decisão e as condições de crédito são da **instituição financeira parceira**. O app registra a jornada da PegPay e espelha os status, contratos e parcelas recebidos do parceiro.

## 3. Domínios

Revisados conforme o ADR-002. A coluna **Dono** distingue o que é fonte da verdade nossa do que é reflexo do parceiro.

| Domínio | Responsabilidade | Dono | Estado |
| --- | --- | --- | --- |
| `leads` | Captação pelo site, fila e status até o atendimento | PegPay | Planejado |
| `auth` | Autenticação, sessão, tokens | PegPay | Planejado |
| `users` | Usuários internos, perfis, RBAC | PegPay | Planejado |
| `customers` | Cliente, perfil, dados cadastrais | PegPay | Planejado |
| `proposals` | Proposta, envio ao parceiro e ciclo de vida da jornada | PegPay | Planejado |
| `partner-integrations` | Integração com produtos, status e condições das instituições parceiras | PegPay | Planejado |
| `kyc` | Identificação, documento e prova de vida conforme o fluxo aplicável | PegPay | Planejado |
| `contracts` | Consulta e guarda dos documentos recebidos no fluxo da operação | Parceiro — espelhamos | Planejado |
| `billing` | Parcelas e vencimentos **para o cliente acompanhar no app** | Parceiro — espelhamos | Planejado |
| `documents` | Gestão documental | PegPay | Planejado |
| `notifications` | E-mail, SMS, WhatsApp, push | PegPay | Planejado |
| `integrations` | Adapters externos, incluindo **CRM de atendimento** | PegPay | Planejado |
| `admin` | Backoffice e apoio ao atendimento humano | PegPay | Planejado |
| `analytics` | Dados para atendimento, eficiência da jornada e recorrência | PegPay | Planejado |
| `audit` | Registro imutável de operação crítica | PegPay | Planejado |

**Removidos do escopo (ADR-002):** `payments` e `collections` como domínios próprios — liberação e cobrança são da instituição parceira; refletimos status, não operamos. Sem ledger, sem Pix, sem boleto próprio, sem conta ou saldo.

## 4. Princípios estruturais

- **Modular monolith first.** Um deployable, fronteiras internas rígidas. Microservice só quando houver benefício concreto e demonstrado.
- **Backend é autoridade.** Web, app e admin exibem; não decidem.
- **Contract first.** O contrato existe antes da implementação.
- **Dinheiro nunca em float.** Integer em centavos ou `NUMERIC(18,2)`.
- **Nada é apagado** em crédito, proposta, contrato, transação, KYC ou auditoria.
- **Nenhum fornecedor acoplado ao domínio.** Interface primeiro, adapter depois, mock sempre.
- **Observabilidade desde o MVP**, não como retrofit.

## 5. Fluxo de proposta e resposta do parceiro

```
LEAD → ATENDIMENTO → CADASTRO → KYC → PROPOSTA
     → ENVIO AO PARCEIRO → ANÁLISE E DECISÃO DO PARCEIRO
     → STATUS E CONDIÇÕES → FORMALIZAÇÃO → ACOMPANHAMENTO
```

Toda proposta registra origem, dados e documentos enviados, consentimentos, parceiro destinatário, status recebido e horário de cada atualização. IA generativa não pode afirmar aprovação, recusa ou condições antes do retorno do parceiro.

## 6. Integrações — nenhuma existe

O rodapé do site menciona MOVA S.E.P., CELCOIN I.P. e DOCK I.P. Isso é **informação de negócio a confirmar**, não integração disponível. Antes de implementar contra qualquer fornecedor: confirmar contrato, credencial e sandbox com o humano.

Abstrações previstas: `KYCProvider` · `PartnerProposalProvider` · `PartnerStatusProvider` · `NotificationProvider` · `StorageProvider`.

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
| Contratos, credenciais e especificações das instituições parceiras | Bloqueiam integrações reais | Parceiro e decisão humana |
