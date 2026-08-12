# PegPay

PegPay Soluções Digitais é uma fintech brasileira de crédito, fundada em 2019. Público predominante: classes C, D e E.

Três modalidades de empréstimo: **cartão de crédito**, **CLT com desconto em folha**, **garantia de veículo ou imóvel**.

## Antes de decisões estruturais, consultar

| Documento | Para quê |
| --- | --- |
| `docs/context/CTO_PROJECT_MEMORY.md` | Regras técnicas e comportamento de CTO |
| `docs/context/PEGPAY_BLUEPRINT.md` | Empresa, produtos, público, posicionamento, motor de crédito |
| `docs/design/DESIGN_SYSTEM.md` | Identidade visual, tokens, tipografia, tom de voz |
| `docs/architecture/SYSTEM_CONTEXT.md` | Arquitetura do sistema |
| `docs/architecture/adr/` | Decisões arquiteturais registradas |
| `docs/agents/AGENTS_REGISTRY.md` | Equipe de agentes: quem faz o quê, handoffs, revisores |

## Ordem de prioridade em caso de conflito

1. Segurança
2. Integridade financeira
3. Integridade dos dados
4. Compliance
5. Confiabilidade
6. Manutenibilidade
7. Experiência do cliente
8. Performance
9. Velocidade de desenvolvimento
10. Sofisticação técnica

## Arquitetura

- **Modular monolith first.** Microservices só com benefício concreto demonstrado.
- Organização por domínio de negócio, não por camada técnica.
- Regras financeiras vivem no backend. O frontend e o app nunca são autoridade sobre crédito, pricing ou limite.
- PostgreSQL como banco transacional preferencial. Migrations versionadas.
- APIs tipadas, com validação em runtime na fronteira (tipo TypeScript não é validação).
- Contract first: DTOs e schemas definidos antes de frontend e backend implementarem.

## Regras inegociáveis

- **Dinheiro nunca em floating point.** Integer em centavos ou `NUMERIC(18,2)`.
- **Idempotência** em toda operação financeira.
- **Auditoria** em toda operação crítica: crédito, contratos, pagamentos, permissões, KYC.
- **Nunca apagar** silenciosamente decisão de crédito, proposta, contrato, transação, KYC ou audit log. Use `status`, `deleted_at`, `cancelled_at`.
- **Nunca expor secrets.** Nada de token no frontend, senha em texto puro ou credencial em código.
- **Nunca inventar** integração, fornecedor, endpoint, credencial ou campo. Se o fornecedor não está contratado, crie a interface e um adapter mock.
- **Nunca hardcode política de crédito** no frontend. Toda decisão de crédito precisa ser rastreável: input, fontes, política, versão, score, motivos.
- IA generativa nunca é autoridade única para aprovar ou recusar crédito.

## Distinguir sempre

Ao falar de qualquer capacidade da plataforma, deixar explícito se é **atual**, **planejado**, **possível** ou **hipótese**. Não declarar funcionalidade futura como existente.

## Estado atual do projeto

Este repositório contém hoje **apenas o site institucional** (`pegpay.com.br`): Vite + React 19 + TypeScript + Tailwind 3, SPA, deploy na Vercel a partir da branch `main`. A plataforma (API, app, admin, motor de crédito) ainda não existe — ver `docs/roadmap/PEGPAY_MVP_TECH_ROADMAP.md`.

## Equipe de agentes

Trabalho relevante é delegado aos agentes em `.claude/agents/`. O `pegpay-cto-orchestrator` coordena. Mudanças em `credit`, `risk`, `payments`, `contracts`, `auth`, `permissions`, `ledger`, `kyc` e `fraud` exigem dupla revisão: QA → Security → CTO.
