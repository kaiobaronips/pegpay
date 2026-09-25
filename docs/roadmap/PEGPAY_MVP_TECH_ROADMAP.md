# PegPay — Roadmap Tecnológico do MVP

> Data: 24/09/2026 · Autor: CTO Orchestrator · Revisado após o Blueprint v3.0
>
> Ponto de partida real: existe o site institucional, em monorepo (ADR-001). **Não existe** API, banco, autenticação, app, admin, integrações com parceiros, CI, staging ou teste.

## Escopo que guia este roadmap

A PegPay atua como correspondente bancária: capta leads, atende, cadastra, realiza KYC, prepara propostas e acompanha clientes. A instituição financeira parceira oferece o produto, analisa, decide, contrata, libera e cobra. Sem conta, saldo, Pix, boleto próprio ou ledger.

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
- **Integração com o RD Station** — o CRM já em uso. Integrar, não construir.
- Atendente enxerga de onde o lead veio e o que ele simulou.

Pendente antes de implementar: confirmar qual módulo do RD Station está em uso (CRM, Marketing ou ambos), obter credencial e ambiente de teste. Vale a regra de sempre — interface `CRMProvider` primeiro, adapter RD Station depois, mock desde o início.

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

### Vertical 04 · Pré-simulação e proposta

- Simulação de vitrine apenas quando houver parâmetros oficiais fornecidos pela instituição parceira.
- API para registrar preferência de valor e prazo sem prometer taxa, CET, parcela ou aprovação.
- Proposta encaminhada ao parceiro com consentimentos e rastreabilidade.

### Vertical 05 · Integração com instituição financeira parceira

- `PartnerProposalProvider` e `PartnerStatusProvider` como interfaces, com mock funcional até haver contrato, credencial e sandbox.
- Envio idempotente de proposta e documentos conforme a especificação do parceiro.
- Registro imutável do parceiro destinatário, status, condições e horário de cada retorno.
- A PegPay não implementa scoring, política de risco, pricing ou motor de decisão.

### Vertical 06 · Proposta

- Ciclo de vida e transições válidas.
- Oferta com CET, prazo, parcela e garantia visíveis.
- Aceite do cliente com rastreabilidade.
- Handoff para o atendimento humano onde o fluxo exigir.

### Vertical 07 · Formalização e documentos

- Encaminhamento e guarda dos documentos produzidos no fluxo da instituição parceira.
- Evidência de aceite e referência da operação.
- Consulta de status de formalização enviada pelo parceiro.

### Vertical 08 · Acompanhamento e recorrência

**O coração do app.** Ele não é vitrine: existe para gerar o segundo e o terceiro empréstimo.

- Espelho de contrato, parcelas e vencimentos vindos do parceiro — leitura, não fonte da verdade sobre pagamento.
- Histórico do cliente e progressão.
- Gatilhos de relacionamento e apresentação de novas oportunidades disponibilizadas pelos parceiros.
- Notificações que trazem o cliente de volta.
- **Métrica que importa: recompra, não conversão de lead.**

### Vertical 09 · Apoio ao atendimento

- Painel interno: leads, clientes, propostas, status recebidos e documentos.
- Consulta de audit log.
- Permissões por perfil, verificadas no backend.
- Complementa o CRM em uso; não duplica o que ele já faz.

## SHOULD HAVE

- Notificações completas: e-mail, SMS, WhatsApp, push.
- Solicitação de renegociação encaminhada ao parceiro.
- Dashboard de captação, propostas, recorrência e qualidade da jornada.
- Automação de jornada e reengajamento.
- E2E nos fluxos críticos.

## COULD HAVE

- Open Finance, quando autorizado e exigido pelo parceiro, como dado da proposta.
- Personalização de comunicação e jornada.
- Analytics e BI estruturados.
- Feature flags para rollout gradual.

## FUTURE

- Novos produtos de crédito.

> **Não entra em Future:** conta, Pix, pagamentos, benefícios, cashback, seguros, gestão financeira, motor próprio de risco ou decisão de crédito. O Blueprint v3.0 incorpora esse escopo.

## Bloqueios que dependem de humano

| Bloqueio | Trava |
| --- | --- |
| ~~Estrutura de repositório~~ | **Resolvido — ADR-001** |
| ~~Escopo da plataforma~~ | **Resolvido — ADR-002** |
| Escolha de cloud e banco | Vertical 00 |
| Módulo do RD Station, credencial e sandbox | Vertical 01 |
| Contrato, credencial, sandbox e especificação da instituição parceira | Verticais 04 e 05 |
| Contrato e credencial de KYC | Vertical 03 (adapter real) |
| Parceiro: como recebemos status de parcela | Vertical 08 |
| Validação jurídica da privacidade | Compliance, já em produção |
| Encarregado de dados (DPO) | Compliance, LGPD art. 41 |

## Ordem recomendada

```
00 Fundação → 01 Leads → 02 Identity+Customer → 03 KYC
→ 04 Pré-simulação e proposta → 05 Integração com parceiro → 06 Proposta → 07 Formalização e documentos
→ 08 Acompanhamento e recorrência → 09 Apoio ao atendimento
```

As verticais 04 e 05 podem ser preparadas em paralelo na estrutura, mas não se concluem sem os contratos, as credenciais e as especificações do parceiro.
