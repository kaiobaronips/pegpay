# PegPay — Roadmap Tecnológico do MVP

> Data: 12/08/2026 · Autor: CTO Orchestrator · Revisado após o **ADR-002** (escopo)
>
> Ponto de partida real: existe o site institucional, em monorepo (ADR-001). **Não existe** API, banco, autenticação, app, admin, motor de crédito, CI, staging ou teste.

## Escopo que guia este roadmap

A PegPay **origina e decide crédito**; não custodia dinheiro (ADR-002). Site capta lead, app cadastra e mantém o cliente, atendimento humano opera, motor de crédito é nosso. Sem conta, saldo, Pix, boleto próprio ou ledger.

## Princípio de execução

Verticais funcionais, não camadas horizontais. Cada vertical chega a um estado utilizável e testável antes da próxima começar.

Construir "todo o backend" e depois "todo o frontend" é a forma mais confiável de descobrir tarde que a arquitetura não funciona.

## MUST HAVE

### Vertical 00 · Fundação

Nada abaixo funciona sem isto.

- Ambientes `development` · `staging` · `production`, com banco e secrets separados.
- CI: lint → type-check → testes → build → security check.
- **Staging real.** Hoje `main` vai direto para produção — tolerável num site de marketing, inaceitável quando houver dado de cliente.
- Escolha de cloud e banco (decisão humana pendente).
- Design system extraído para `packages/ui`; tipos e schemas em `packages/types` e `packages/validation` — nascem aqui porque a API é o segundo consumidor.
- Observabilidade mínima: log estruturado, `requestId`, `correlationId`, error tracking, health check.

### Vertical 01 · Leads

**A vertical que entrega valor mais rápido**, porque o site já existe e hoje não captura nada — o lead só vira conversa no WhatsApp e some.

- Domínio `leads`: captura, origem, status, atribuição.
- Site passa a registrar o lead antes de mandar para o WhatsApp.
- **Integração com o CRM já em uso** — integrar, não construir.
- Atendente enxerga de onde o lead veio e o que ele simulou.

### Vertical 02 · Identity + Customer

- Cadastro e autenticação **no app** (o site não tem área logada).
- Sessão, refresh de token, biometria.
- RBAC: `CUSTOMER` `OPERATOR` `ANALYST` `MANAGER` `ADMIN` `SUPER_ADMIN` `AUDITOR` `COMPLIANCE`.
- Perfil e dados cadastrais, com minimização.
- Audit log desde o primeiro evento.

### Vertical 03 · KYC

- `KYCProvider` como interface + adapter mock funcional.
- Documento, selfie, prova de vida — capturados no app.
- Máquina de estados do KYC.
- **Nenhum fornecedor real** até haver contrato, credencial e sandbox confirmados.

### Vertical 04 · Simulação

- Motor de cálculo no backend: parcela, CET, IOF, arredondamento.
- Políticas parametrizáveis e versionadas.
- API de simulação consumida pelo app e pelo site (substituindo o cálculo client-side atual, que é vitrine).
- **Garantia:** o número simulado é o número contratado.

### Vertical 05 · Decisão de crédito

Agente crítico. Revisão tripla obrigatória. **É o ativo estratégico da PegPay** — a decisão é nossa, não do parceiro.

- Pipeline: input → validação → enriquecimento → sinais de fraude → políticas → score → decision engine → pricing → oferta.
- `CreditBureauProvider` como interface + mock.
- Registro imutável e completo de toda decisão, com versão de política.
- **Bloqueado até haver política real de crédito definida por humano.**

### Vertical 06 · Proposta

- Ciclo de vida e transições válidas.
- Oferta com CET, prazo, parcela e garantia visíveis.
- Aceite do cliente com rastreabilidade.
- Handoff para o atendimento humano onde o fluxo exigir.

### Vertical 07 · Contrato

- Formalização e geração de documento.
- `SignatureProvider` como interface + mock.
- Guarda documental e evidência de aceite.

### Vertical 08 · Acompanhamento e recorrência

**O coração do app.** Ele não é vitrine: existe para gerar o segundo e o terceiro empréstimo.

- Espelho de contrato, parcelas e vencimentos vindos do parceiro — leitura, não fonte da verdade sobre pagamento.
- Histórico do cliente e progressão.
- Gatilhos de nova oferta para quem tem bom histórico.
- Notificações que trazem o cliente de volta.
- **Métrica que importa: recompra, não conversão de lead.**

### Vertical 09 · Apoio ao atendimento

- Painel interno: leads, clientes, propostas, decisões, contratos.
- Consulta de audit log.
- Permissões por perfil, verificadas no backend.
- Complementa o CRM em uso; não duplica o que ele já faz.

## SHOULD HAVE

- Notificações completas: e-mail, SMS, WhatsApp, push.
- Renegociação (originada por nós, executada pelo parceiro).
- Dashboard de originação, recorrência e risco.
- Automação de jornada e reengajamento.
- E2E nos fluxos críticos.

## COULD HAVE

- Open Finance como fonte de dado para o motor.
- Modelo estatístico próprio de risco.
- Personalização de oferta e progressão automática de limite.
- Analytics e BI estruturados.
- Feature flags para rollout gradual.

## FUTURE

- Modelos proprietários em escala.
- Novos produtos de crédito.

> **Não entra em Future:** conta, Pix, pagamentos, benefícios, cashback, seguros, gestão financeira. O ADR-002 tirou isso do horizonte. As seções 12 e 46 do Blueprint estão desatualizadas nesse ponto.

## Bloqueios que dependem de humano

| Bloqueio | Trava |
| --- | --- |
| ~~Estrutura de repositório~~ | **Resolvido — ADR-001** |
| ~~Escopo da plataforma~~ | **Resolvido — ADR-002** |
| Escolha de cloud e banco | Vertical 00 |
| **Qual CRM está em uso** | Vertical 01 |
| Política real de crédito, taxa e limite | Verticais 04 e 05 |
| Contrato e credencial de KYC | Vertical 03 (adapter real) |
| Contrato e credencial de bureau | Vertical 05 (adapter real) |
| Parceiro: como recebemos status de parcela | Vertical 08 |
| Validação jurídica da privacidade | Compliance, já em produção |
| Encarregado de dados (DPO) | Compliance, LGPD art. 41 |

## Ordem recomendada

```
00 Fundação → 01 Leads → 02 Identity+Customer → 03 KYC
→ 04 Simulação → 05 Decisão → 06 Proposta → 07 Contrato
→ 08 Acompanhamento e recorrência → 09 Apoio ao atendimento
```

As verticais 04 e 05 podem ser preparadas em paralelo **na estrutura e no cálculo** — mas não se concluem sem a política real definida.
