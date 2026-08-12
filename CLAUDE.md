# PegPay

PegPay Soluções Digitais é uma fintech brasileira de crédito, fundada em 2019. Público predominante: classes C, D e E.

Três modalidades de empréstimo: **cartão de crédito**, **CLT com desconto em folha**, **garantia de veículo ou imóvel**.

## Escopo — leia antes de propor qualquer coisa (ADR-002)

A PegPay é uma **fornecedora de crédito**. **Não é banco digital nem internet banking.**

| Superfície | Papel |
| --- | --- |
| **Site** | Institucional e captador de leads. Sem cadastro, sem área logada. |
| **App** | Cadastro, verificação, originação, acompanhamento de contrato e parcelas, e **recorrência** |
| **Atendimento humano** | Onde a operação acontece. O software é o intermediário, não o executor |
| **Motor de crédito** | **Nosso.** Política, decisão, taxa e limite são da PegPay |

**Fora do escopo, definitivamente:** conta · saldo · extrato · Pix · transferência · pagamento de contas · boleto emitido por nós · cartão · carteira digital · ledger double-entry · benefícios · cashback · seguros.

A PegPay **decide** o crédito mas **não custodia nem movimenta** dinheiro — liberação e recebimento são da instituição parceira. Isso não autoriza errar centavo: cálculo de parcela e CET continua com padrão de integridade máximo.

O app existe para gerar o **segundo e o terceiro empréstimo**. A métrica que importa é recompra, não conversão de lead.

## Antes de decisões estruturais, consultar

| Documento | Para quê |
| --- | --- |
| `docs/context/CTO_PROJECT_MEMORY.md` | Regras técnicas e comportamento de CTO |
| `docs/context/PEGPAY_BLUEPRINT.md` | Empresa, produtos, público, posicionamento, motor de crédito |
| `docs/design/DESIGN_SYSTEM.md` | Identidade visual, tokens, tipografia, tom de voz |
| `docs/architecture/SYSTEM_CONTEXT.md` | Arquitetura do sistema |
| `docs/architecture/adr/` | Decisões arquiteturais registradas — **ADR-002 define o escopo e prevalece sobre o Blueprint nesse ponto** |
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

Monorepo com **npm workspaces**. O único app que existe hoje é o site institucional:

```
apps/site/     @pegpay/site — pegpay.com.br (Vite + React 19 + TS + Tailwind 3)
packages/      vazio por ora; criado quando houver 2º consumidor de código compartilhado
```

Deploy na Vercel a partir da `main`; o `vercel.json` da raiz aponta o build para `apps/site`.

A plataforma (API, app mobile, admin, motor de crédito) ainda não existe — ver `docs/roadmap/PEGPAY_MVP_TECH_ROADMAP.md`. Quando a API nascer, `packages/types` e `packages/validation` passam a ser a fonte do contrato compartilhado (ADR-001).

## Equipe de agentes

Trabalho relevante é delegado aos agentes em `.claude/agents/`. O `pegpay-cto-orchestrator` coordena. Mudanças em `credit`, `risk`, `proposals`, `contracts`, `auth`, `permissions`, `kyc`, `fraud` e `billing` exigem dupla revisão: QA → Security → CTO.
