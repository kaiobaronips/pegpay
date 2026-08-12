# PegPay — Roadmap Tecnológico do MVP

> Data: 12/08/2026 · Autor: CTO Orchestrator · Status: proposta para aprovação
>
> Ponto de partida real: existe o site institucional. **Não existe** API, banco, autenticação, app, admin, motor de crédito, CI, staging ou teste.

## Princípio de execução

Desenvolver em **verticais funcionais**, não em camadas horizontais. Cada vertical chega a um estado utilizável e testável antes da próxima começar.

Construir "todo o backend" e depois "todo o frontend" é a forma mais confiável de descobrir tarde que a arquitetura não funciona.

## MUST HAVE — indispensável para operar

### Vertical 00 · Fundação

Nada abaixo funciona sem isto.

- Decisão da estrutura de repositório (ADR-001) e da cloud.
- Monorepo com workspaces; site movido para `apps/site`.
- Ambientes `development` · `staging` · `production`, com banco e secrets separados.
- CI: lint → type-check → testes → build → security check.
- **Staging real.** Hoje `main` vai direto para produção — inaceitável para a plataforma.
- Design system extraído para pacote compartilhado.
- Tipos e schemas compartilhados (`packages/types`, `packages/validation`).
- Observabilidade mínima: log estruturado, `requestId`, `correlationId`, error tracking, health check.

### Vertical 01 · Identity + Customer

- Cadastro, autenticação, sessão, refresh de token.
- RBAC com os perfis: `CUSTOMER` `OPERATOR` `ANALYST` `MANAGER` `ADMIN` `SUPER_ADMIN` `AUDITOR` `COMPLIANCE`.
- Perfil do cliente e dados cadastrais, com minimização.
- Audit log desde o primeiro evento — não como retrofit.

### Vertical 02 · KYC

- `KYCProvider` como interface + adapter mock funcional.
- Fluxo de identificação: documento, selfie, prova de vida.
- Máquina de estados do KYC e sua persistência.
- **Nenhum fornecedor real** até haver contrato, credencial e sandbox confirmados.

### Vertical 03 · Simulação de crédito

- Motor de cálculo no backend: parcela, CET, IOF, arredondamento.
- Políticas parametrizáveis e versionadas — não `if` no código.
- Simulação exposta por API e consumida pelo site (substituindo o cálculo client-side atual, que hoje é vitrine).
- **Garantia obrigatória:** o número simulado é o número contratado.

### Vertical 04 · Decisão de crédito

Agente crítico. Revisão tripla obrigatória.

- Pipeline: input → validação → enriquecimento → sinais de fraude → políticas → score → decision engine → pricing → oferta.
- `CreditBureauProvider` como interface + mock.
- Registro imutável e completo de toda decisão, com versão de política.
- **Bloqueado até haver política real de crédito definida por humano.**

### Vertical 05 · Proposta

- Ciclo de vida da proposta e suas transições válidas.
- Oferta apresentada com CET, prazo, parcela e garantia visíveis.
- Aceite do cliente registrado com rastreabilidade.

### Vertical 06 · Contrato

- Formalização e geração de documento.
- `SignatureProvider` como interface + mock.
- Guarda documental e evidência de aceite.

### Vertical 07 · Liberação

- `PaymentProvider` como interface + mock.
- Idempotência obrigatória em toda movimentação.
- Ledger double-entry se houver saldo interno.
- Conciliação e tratamento de falha de liberação.

### Vertical 08 · Portal e app do cliente

- Portal web: contratos, parcelas, vencimentos, histórico.
- App React Native: onboarding, área do cliente, contratação, parcelas.
- Ambos consomem as mesmas APIs. Nenhum recalcula regra financeira.

### Vertical 09 · Backoffice

- Painel administrativo: propostas, clientes, decisões, contratos.
- Consulta de audit log.
- Permissões por perfil, verificadas no backend.

## SHOULD HAVE

- Cobrança e gestão de parcelas em atraso.
- Notificações: e-mail, SMS, WhatsApp, push.
- Renegociação.
- CRM operacional.
- Dashboard com métricas de originação e risco.
- Automação de jornada.
- E2E nos fluxos críticos.

## COULD HAVE

- Open Finance.
- Motor de decisão avançado com modelo estatístico próprio.
- Personalização de oferta e progressão de limite.
- Analytics e BI estruturados.
- Feature flags para rollout gradual.

## FUTURE

- Ecossistema: pagamentos, Pix, benefícios, seguros, gestão financeira.
- Modelos proprietários em escala.
- Serviços financeiros complementares.

## Bloqueios que dependem de humano

Estes travam verticais inteiras e nenhum agente pode resolvê-los:

| Bloqueio | Trava |
| --- | --- |
| Estrutura de repositório (ADR-001) | Vertical 00 |
| Escolha de cloud e banco | Vertical 00 |
| Política real de crédito, taxa e limite | Verticais 03 e 04 |
| Contrato e credencial de fornecedor de KYC | Vertical 02 (adapter real) |
| Contrato e credencial de bureau | Vertical 04 (adapter real) |
| Parceiro bancário e arranjo de liberação | Vertical 07 |
| Validação jurídica da política de privacidade | Compliance, já em produção |
| Encarregado de dados (DPO) | Compliance, LGPD art. 41 |

## Ordem recomendada

```
00 Fundação → 01 Identity+Customer → 02 KYC → 03 Simulação
→ 04 Decisão → 05 Proposta → 06 Contrato → 07 Liberação
→ 08 Portal e App → 09 Backoffice
```

As verticais 03 e 04 podem ser preparadas em paralelo com 01 e 02 **na parte de cálculo e estrutura** — mas não são concluídas sem a política real definida.
