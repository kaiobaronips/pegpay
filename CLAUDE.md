# PegPay

PegPay Soluções Digitais é uma correspondente bancária brasileira, fundada em 2019. Público predominante: classes C, D e E.

Três modalidades de empréstimo: **cartão de crédito**, **CLT com desconto em folha**, **garantia de veículo ou imóvel**.

## Escopo — leia antes de propor qualquer coisa (ADR-002)

A PegPay é uma **fornecedora de crédito**. **Não é banco digital nem internet banking.**

| Superfície | Papel |
| --- | --- |
| **Site** | Institucional e captador de leads. Sem cadastro, sem área logada. |
| **App** | Cadastro, verificação, originação, acompanhamento de contrato e parcelas, e **recorrência** |
| **Atendimento humano** | Onde a operação acontece. O software é o intermediário, não o executor |
| **Instituição financeira parceira** | Produto, análise, decisão, taxa, limite, contratação, liberação e cobrança |

**Fora do escopo, definitivamente:** conta · saldo · extrato · Pix · transferência · pagamento de contas · boleto emitido por nós · cartão · carteira digital · ledger double-entry · benefícios · cashback · seguros.

A PegPay capta, atende, cadastra, realiza KYC, prepara propostas e acompanha o cliente. A instituição financeira parceira decide o crédito e é responsável pela contratação, liberação e recebimento. A PegPay não custodia nem movimenta dinheiro.

O app existe para gerar o **segundo e o terceiro empréstimo**. A métrica que importa é recompra, não conversão de lead.

## Antes de decisões estruturais, consultar

| Documento | Para quê |
| --- | --- |
| `docs/context/CTO_PROJECT_MEMORY.md` | Regras técnicas e comportamento de CTO |
| `docs/context/PEGPAY_BLUEPRINT.md` | Empresa, produtos, público, posicionamento e integração com parceiros |
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
- Dados e condições recebidos das instituições financeiras parceiras vivem no backend. O frontend e o app nunca são autoridade sobre crédito, taxa, parcela, CET ou limite.
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
- **Nunca atribua à PegPay uma política de crédito, score, taxa, limite ou decisão.** As condições e a análise pertencem à instituição financeira parceira.
- IA generativa nunca pode afirmar aprovação, recusa ou condição de crédito antes do retorno da instituição financeira parceira.

## Distinguir sempre

Ao falar de qualquer capacidade da plataforma, deixar explícito se é **atual**, **planejado**, **possível** ou **hipótese**. Não declarar funcionalidade futura como existente.

## Estado atual do projeto

Monorepo com **npm workspaces**. O único app que existe hoje é o site institucional:

```
apps/site/     @pegpay/site — pegpay.com.br (Vite + React 19 + TS + Tailwind 3)
packages/      vazio por ora; criado quando houver 2º consumidor de código compartilhado
```

Deploy na Vercel a partir da `main`; o `vercel.json` da raiz aponta o build para `apps/site`.

A plataforma (API, app mobile, admin e integrações com parceiros) ainda não existe — ver `docs/roadmap/PEGPAY_MVP_TECH_ROADMAP.md`. Quando a API nascer, `packages/types` e `packages/validation` passam a ser a fonte do contrato compartilhado (ADR-001).

## Equipe de agentes

Trabalho relevante é delegado aos agentes em `.claude/agents/`. O `pegpay-cto-orchestrator` coordena. Mudanças em `credit`, `risk`, `proposals`, `contracts`, `auth`, `permissions`, `kyc`, `fraud` e `billing` exigem dupla revisão: QA → Security → CTO.
