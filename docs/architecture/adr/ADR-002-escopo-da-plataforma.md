# ADR-002 — Escopo da plataforma: originadora de crédito, não banco digital

- **Status:** **Aceito** — definido por Kaio Pirolo em 2026-08-12
- **Data:** 2026-08-12
- **Decisores:** Kaio Pirolo (definição de negócio) · CTO Orchestrator (consequências técnicas)

## Contexto

O `PEGPAY_BLUEPRINT.md` descreve um ecossistema financeiro amplo: Pix, transferências, pagamento de contas, boletos, benefícios, cashback, seguros e gestão financeira (seções 12 e 46, horizonte V3). O `CTO_PROJECT_MEMORY.md` reforça esse desenho com ledger double-entry, movimentação de saldo e domínios de pagamento e cobrança (seções 9 e 16).

Ao planejar a fundação, essa leitura produziu um roadmap de plataforma bancária: ledger, disbursement, collections e um domínio de pagamentos próprio. A direção corrigiu o escopo.

## Decisão

A PegPay é uma **fornecedora de crédito** — origina, analisa, decide e acompanha. **Não é internet banking.**

### O que a plataforma É

| Superfície | Papel |
| --- | --- |
| **Site** | Institucional e **captador de leads**. Explica a empresa e entrega o lead ao atendimento humano. Não tem cadastro nem área logada. |
| **App** | Cadastro, verificação (KYC), originação, acompanhamento de contrato e parcelas, e **recorrência** — manter o cliente pedindo novos empréstimos. |
| **Atendimento humano** | Onde a operação acontece. O software é o intermediário entre cliente e atendente, não o executor da operação. |
| **Motor de crédito** | **Da PegPay.** Política, análise, decisão, taxa e limite são nossos. Continua sendo o ativo estratégico central. |

### O que a plataforma NÃO É

Sem conta, saldo, extrato, Pix, transferência, pagamento de contas, boleto emitido por nós, cartão, carteira digital ou qualquer função de banco. Nenhuma dessas coisas entra no roadmap.

### Divisão de responsabilidade sobre dinheiro

A PegPay **decide** o crédito, mas **não custodia nem movimenta** dinheiro. Liberação e recebimento acontecem pela instituição financeira parceira, conforme o papel de correspondente bancário já declarado no rodapé do site.

## Consequências

### Sai do escopo

- **Ledger double-entry.** Não custodiamos saldo; não há o que contabilizar em partidas dobradas. A `CTO_PROJECT_MEMORY.md` §9 deixa de se aplicar.
- **`payments` e `collections` como domínios próprios.** Viram integração e reflexo de status do parceiro.
- **Pix, boletos, transferências.** Fora.
- **Ecossistema V3 do Blueprint** (benefícios, cashback, seguros, gestão financeira). Fora do horizonte planejado.

### Continua no escopo, sem redução

- **Motor de crédito** — política própria, versionada, rastreável. Verticais 03 e 04 seguem de pé, e o padrão de revisão tripla continua.
- **KYC e antifraude** — a verificação é nossa.
- **Propostas e contratos** — somos a fonte da verdade.
- **Integridade financeira do cálculo** — dinheiro nunca em float, idempotência, auditoria. Não custodiar dinheiro não autoriza errar centavo em parcela ou CET.

### Sobe de prioridade

- **`leads`** — domínio novo. O site existe para captar; hoje não há onde o lead cai.
- **Atendimento e CRM.** O software serve o atendente humano. **Já existe um CRM em uso** — integramos, não construímos. Sai do fim do roadmap e entra na fundação.
- **`billing` como leitura** — o cliente acompanha contrato e parcelas no app, mas a cobrança é do parceiro. Espelhamos e exibimos; não somos donos do recebimento.
- **Recorrência como métrica de produto.** O app não é vitrine: existe para gerar o segundo e o terceiro empréstimo. A métrica que importa não é conversão de lead, é recompra.

### Divergência documental assumida

Este ADR **diverge conscientemente** do `PEGPAY_BLUEPRINT.md` seções 12 e 46, e do `CTO_PROJECT_MEMORY.md` §9. A regra 20 da seção 48 do Blueprint pede solicitação explícita para alterar sua essência — foi o que houve. Em caso de conflito futuro sobre escopo de produto, **este ADR prevalece**; o Blueprint segue valendo para posicionamento, público, tom e identidade.

Recomendação: atualizar o Blueprint para refletir esta decisão, evitando que o documento continue descrevendo um produto que não será construído.
