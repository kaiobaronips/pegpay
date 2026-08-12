---
name: pegpay-engineering-standards
description: Padrões de engenharia da PegPay — arquitetura, organização por domínio, contratos, tipos, erros, logs, nomenclatura e o que nunca fazer. Use ao escrever ou revisar qualquer código da plataforma.
---

# PegPay — Padrões de Engenharia

Fonte canônica: `docs/context/CTO_PROJECT_MEMORY.md`.

## Arquitetura

**Modular monolith first.** Microservice só com benefício concreto em isolamento, escala, segurança, deploy independente, volume, ownership ou performance. "Parece sofisticado" não é razão.

Organização por **domínio de negócio**, não por camada técnica:

```
/auth  /users  /customers  /kyc  /credit  /proposals  /contracts
/payments  /billing  /collections  /notifications  /documents
/risk  /fraud  /admin  /integrations  /analytics  /audit
```

Baixo acoplamento entre domínios, alta coesão dentro. Regra de negócio crítica fica centralizada e testável — nunca duplicada.

## Contract first

Antes de frontend e backend implementarem a mesma feature, o contrato existe: DTOs · schemas · endpoints · códigos de erro · status · eventos · autorização.

O contrato é autoridade compartilhada. Cinco agentes não podem inventar cinco APIs.

Ferramentas: OpenAPI · JSON Schema · Zod · tipos TypeScript compartilhados.

## TypeScript

Sem `any`. Strict mode. Interfaces e types explícitos. DTO separado de entidade de domínio.

**Tipo TypeScript não é validação.** Todo dado que vem de fora (request, resposta de API, webhook, arquivo) é validado em runtime na fronteira.

## API

Versionada (`/api/v1/`). Resposta e erro padronizados:

```json
{ "success": false, "error": { "code": "CUSTOMER_NOT_FOUND", "message": "Cliente não encontrado" } }
```

Documentada em OpenAPI.

## Erros

Nunca silencie erro. Diferencie: validação · negócio · autenticação · autorização · externo · interno.

Nunca exiba stack trace ao usuário — mensagem humana e código de referência.

## Logs

Estruturados, com `requestId` e `correlationId`:

```json
{ "level": "info", "service": "credit-engine", "event": "credit_analysis_completed", "customerId": "...", "timestamp": "..." }
```

**Nunca logue:** senha · token · secret · CPF completo · cartão completo · payload bruto de bureau.

`console.log` não é solução permanente.

## Nomenclatura

Nome reflete o domínio. Evite `data`, `info`, `thing`, `obj`, `temp`, `x`. Prefira `creditProposal`, `customerProfile`, `monthlyIncome`, `availableCreditLimit`.

## Integrações externas

Nunca chame terceiro direto do domínio. Interface primeiro, adapter depois. Sempre: timeout · retry · idempotência · circuit breaker · rate limit · fallback · observabilidade.

Nenhuma API externa está disponível 100% do tempo.

## Ao alterar código existente

Leia os arquivos relacionados. Identifique dependências. Entenda o padrão existente. Preserve compatibilidade. Não refatore em massa quando uma mudança pequena resolve. Não delete código funcional sem justificativa.

## Ao corrigir bug

Ache a causa raiz, não o sintoma. Verifique onde mais o problema ocorre. Escreva o teste.

## Nunca

Inventar API, campo, endpoint, credencial ou fornecedor · assumir integração existente · alterar stack arbitrariamente · expor secret · regra de crédito no frontend · float em dinheiro · misturar UI com regra financeira · tabela sem constraint · ignorar autenticação, autorização, log, auditoria ou LGPD.
