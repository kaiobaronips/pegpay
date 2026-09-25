# ADR-002 — Escopo da plataforma: originadora de crédito, não banco digital

- **Status:** **Substituído** — redefinido em 2026-09-24
- **Data original:** 2026-08-12
- **Decisores:** Kaio Pirolo (definição de negócio) · CTO Orchestrator (consequências técnicas)

## Contexto

O `PEGPAY_BLUEPRINT.md` descreve um ecossistema financeiro amplo: Pix, transferências, pagamento de contas, boletos, benefícios, cashback, seguros e gestão financeira (seções 12 e 46, horizonte V3). O `CTO_PROJECT_MEMORY.md` reforça esse desenho com ledger double-entry, movimentação de saldo e domínios de pagamento e cobrança (seções 9 e 16).

Ao planejar a fundação, essa leitura produziu um roadmap de plataforma bancária: ledger, disbursement, collections e um domínio de pagamentos próprio. A direção corrigiu o escopo.

## Decisão

A PegPay é uma **correspondente bancária**. Capta, atende, cadastra, realiza KYC, prepara propostas e acompanha o cliente. A instituição financeira parceira é responsável pelo produto, análise, decisão, condições, contratação, liberação e cobrança.

### O que a plataforma É

| Superfície | Papel |
| --- | --- |
| **Site** | Institucional e **captador de leads**. Explica a empresa e entrega o lead ao atendimento humano. Não tem cadastro nem área logada. |
| **App** | Cadastro, verificação (KYC), preparação de propostas, acompanhamento de contrato e parcelas, e **recorrência**. |
| **Atendimento humano** | Onde a operação acontece. O software é o intermediário entre cliente e atendente, não o executor da operação. |
| **Integrações com parceiros** | Envio de propostas e recebimento de status e condições; a análise e a decisão continuam com a instituição financeira. |

### O que a plataforma NÃO É

Sem conta, saldo, extrato, Pix, transferência, pagamento de contas, boleto emitido por nós, cartão, carteira digital ou qualquer função de banco. Nenhuma dessas coisas entra no roadmap.

### Divisão de responsabilidade sobre dinheiro

A PegPay não decide, não aprova e não recusa crédito. Também não custodia nem movimenta dinheiro. A liberação e o recebimento acontecem pela instituição financeira parceira.

## Consequências

### Sai do escopo

- **Ledger double-entry.** Não custodiamos saldo; não há o que contabilizar em partidas dobradas. A `CTO_PROJECT_MEMORY.md` §9 deixa de se aplicar.
- **`payments` e `collections` como domínios próprios.** Viram integração e reflexo de status do parceiro.
- **Pix, boletos, transferências.** Fora.
- **Ecossistema V3 do Blueprint** (benefícios, cashback, seguros, gestão financeira). Fora do horizonte planejado.

### Continua no escopo, sem redução

- **Integração com parceiros** — proposta, documentos e status devem ter rastreabilidade ponta a ponta.
- **KYC** — a PegPay conduz a etapa conforme o fluxo e as exigências aplicáveis do parceiro.
- **Propostas** — a PegPay registra a jornada e encaminha a proposta; a instituição financeira é fonte da verdade para a operação contratada.
- **Integridade da informação financeira** — valores, parcelas, taxas e CET recebidos do parceiro devem ser exibidos com precisão, idempotência e auditoria.

### Sobe de prioridade

- **`leads`** — domínio novo. O site existe para captar; hoje não há onde o lead cai.
- **Atendimento e CRM.** O software serve o atendente humano. **Já existe um CRM em uso** — integramos, não construímos. Sai do fim do roadmap e entra na fundação.
- **`billing` como leitura** — o cliente acompanha contrato e parcelas no app conforme o status fornecido pelo parceiro, que é responsável pela cobrança.
- **Recorrência como métrica de produto.** O app sustenta o relacionamento e pode apresentar novas oportunidades disponíveis por meio das instituições parceiras.

### Divergência documental assumida

Este ADR registrou a retirada do escopo bancário da v1.0. Em 24/09/2026, o Blueprint foi reescrito na **v3.0** para corrigir também a responsabilidade pela análise e pela decisão de crédito. Os documentos de contexto e arquitetura foram alinhados ao modelo de correspondente bancária.
