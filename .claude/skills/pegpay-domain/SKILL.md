---
name: pegpay-domain
description: Contexto de negócio da PegPay — empresa, produtos de crédito, público, jornada do cliente e vocabulário do domínio. Use ao trabalhar em qualquer coisa que precise entender o que a PegPay vende, para quem, e como o cliente percorre a jornada.
---

# PegPay — Domínio

Fonte canônica: `docs/context/PEGPAY_BLUEPRINT.md`. Esta skill é o resumo operacional.

## Escopo — o que a PegPay é e o que não é (ADR-002)

**É uma fornecedora de crédito. Não é banco digital nem internet banking.**

| Superfície | Papel |
| --- | --- |
| Site | Institucional e captador de leads. Sem cadastro, sem área logada |
| App | Cadastro, verificação, originação, acompanhamento de contrato e parcelas, **recorrência** |
| Atendimento humano | Onde a operação acontece. O software é o intermediário |
| Motor de crédito | **Da PegPay** — política, decisão, taxa e limite são nossos |

**Fora do escopo:** conta · saldo · extrato · Pix · transferência · pagamento de contas · boleto próprio · cartão · carteira · ledger · benefícios · cashback · seguros.

A PegPay decide o crédito mas **não custodia dinheiro** — liberação e recebimento são da instituição parceira.

O app existe para gerar o **segundo e o terceiro empréstimo**. Métrica que importa: recompra, não conversão de lead.

> Escopo definido no ADR-002 e incorporado ao **Blueprint v2.0, seção 10**. A v1.0 do Blueprint descrevia um ecossistema financeiro amplo que **não será construído**.

## Empresa

PegPay Soluções Digitais — fintech brasileira de crédito, fundada em 2019 por Kaio Pirolo da Silva, João Pedro Perez e Felipe Boim. Digital-first.

Propósito: democratizar o acesso ao crédito através da tecnologia.

**Indicadores oficiais** (não extrapole, não invente outros): 412 mil pessoas atendidas · ~35% tiveram na PegPay o primeiro acesso ao crédito formal.

## Público

Classes **C, D e E**: CLT, autônomos, prestadores de serviço, informais, pequenos empreendedores, pessoas com pouco histórico financeiro, primeiro acesso ao crédito, crédito emergencial, reorganização de dívida.

Consequência prática: aparelho modesto, conexão instável, pouca familiaridade com jargão bancário. Isso é requisito técnico, não observação sociológica.

## Três produtos

| Produto | Mecânica | Limitante | Estado |
| --- | --- | --- | --- |
| Empréstimo com cartão de crédito | Converte limite disponível do cartão | Limite livre. Não exige nome limpo | Definido no Blueprint |
| Empréstimo CLT com desconto em folha | Parcela descontada na folha | Vínculo formal, margem consignável | Definido no Blueprint |
| Crédito com garantia | Veículo ou imóvel alienado lastreia a operação | Valor e liquidez do bem | Único com condições publicadas no site |

Nenhuma política real de taxa, limite ou corte de score está definida. O que aparece no site institucional é vitrine com valores estimados.

## Jornada

```
aquisição → cadastro → identidade/KYC → análise → oferta
→ contratação → liberação → relacionamento
```

Princípios: **SIMPLES → RÁPIDA → DIGITAL → TRANSPARENTE**.

## Flywheel

Mais clientes → mais operações → mais dados → melhores modelos → melhor análise → melhores ofertas → mais aprovação responsável → mais recorrência → mais clientes.

## Vocabulário

| Termo | Significado |
| --- | --- |
| **Motor de crédito** | Sistema que processa dados, políticas, scores e regras para decidir crédito |
| **CET** | Custo Efetivo Total — juros + IOF + tarifas |
| **KYC** | Know Your Customer — identificação e validação |
| **Margem consignável** | Quanto da folha pode ser comprometido no consignado |
| **Alienação** | Bem fica em garantia, mas continua no nome e no uso do cliente |
| **Recorrência** | Cliente voltar a usar a PegPay depois da primeira operação |
| **Correspondente bancário** | Papel regulatório da PegPay: a operação de crédito é da instituição parceira |

## Regra de honestidade

Ao descrever qualquer capacidade, distinga sempre: **atual · planejado · possível · hipótese**.

Não invente número, parceiro, integração ou funcionalidade. Fornecedor citado em documento não significa integração contratada.
