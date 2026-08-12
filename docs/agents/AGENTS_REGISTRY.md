# PegPay — Agent Registry

Equipe virtual de tecnologia da PegPay. Definições em `.claude/agents/`.

## Mapa

```
                        PEGPAY CTO ORCHESTRATOR
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
  PRODUCT ARCHITECT      SOLUTION ARCHITECT          DESIGN SYSTEM
   (o quê / para quem)   (como / contratos)         (como se parece)
        │                         │                         │
        └────────────┬────────────┴────────────┬────────────┘
                     │                         │
         ┌───────────┴───────────┬─────────────┴──────────┐
         │                       │                        │
   IMPLEMENTAÇÃO           DADOS E CRÉDITO           PLATAFORMA
         │                       │                        │
  ┌──────┼──────┐         ┌──────┼──────┐                 │
  WEB  MOBILE  BACKEND    DATA  CREDIT  INTEGRATIONS   DEVOPS & SRE
  └──────┴──────┴─────────┴──────┴──────┴──────────────────┘
                                  │
                          QA & RELEASE
                                  │
                       SECURITY & COMPLIANCE
                                  │
                            CTO REVIEW
```

## Tabela

| Agente | Responsabilidade | Quando usar | Edita código? | Domínio | Handoff | Revisor obrigatório |
| --- | --- | --- | --- | --- | --- | --- |
| `pegpay-cto-orchestrator` | Entende, planeja, delega, revisa, integra | Feature multi-domínio, decisão de arquitetura, priorização | Excepcionalmente | Todos | Ponto de entrada e saída | — |
| `pegpay-product-architect` | Requisito, jornada, user story, critério de aceite, MVP | Pedido em linguagem de negócio, escopo vago | Só docs | Produto | → Solution Architect | CTO |
| `pegpay-solution-architect` | Bounded contexts, contratos, ADRs, modelo de deploy | Antes de implementação multi-módulo, tecnologia nova | Só docs e contratos | Arquitetura | → implementadores | CTO |
| `pegpay-design-system` | Tokens, componentes, UX financeira, acessibilidade | Qualquer tela ou componente | Sim (UI) | Design | → Web / Mobile | CTO |
| `pegpay-web-engineer` | Site, landing, portal, admin, dashboards | Trabalho web | Sim | Frontend web | → QA | QA + Security |
| `pegpay-mobile-engineer` | App iOS e Android | Trabalho no app | Sim | Mobile | → QA | QA + Security |
| `pegpay-backend-engineer` | APIs, serviços de domínio, workflows | Endpoint, serviço, autenticação | Sim | Backend | → QA | QA + Security |
| `pegpay-data-engineer` | Schema, migrations, constraints, índices | Modelagem, migration, performance | Sim | Dados | → Backend | QA + Security |
| `pegpay-credit-engineer` | Motor de crédito, políticas, scoring, pricing | Decisão de crédito, simulação, elegibilidade | Sim | Crédito ⚠️ | → QA | **QA + Security + CTO** |
| `pegpay-integrations-engineer` | Adapters, webhooks, resiliência | Integração externa | Sim | Integrações | → QA | QA + Security |
| `pegpay-security-compliance` | Revisão independente de segurança e LGPD | Antes de integrar; obrigatório em área crítica | Não (só revisa) | Segurança | → CTO | — |
| `pegpay-devops-sre` | CI/CD, ambientes, observabilidade, backup | Pipeline, infra, deploy | Sim (infra) | Plataforma | → Security | Security + CTO |
| `pegpay-qa-release` | Estratégia de teste, testes, gates | Após implementação, antes do Security | Sim (testes) | Qualidade | → Security | — |

⚠️ Domínio crítico: revisão tripla obrigatória.

## Áreas críticas — dupla revisão obrigatória

Mudanças em `credit`, `risk`, `payments`, `contracts`, `auth`, `permissions`, `ledger`, `kyc`, `fraud` seguem, sem atalho:

```
IMPLEMENTADOR → QA → SECURITY → CTO
```

## Workflow padrão

```
REQUEST → PRODUCT ARCHITECT → SOLUTION ARCHITECT → SECURITY PRE-CHECK
       → IMPLEMENTAÇÃO → QA → SECURITY REVIEW → CTO REVIEW → INTEGRAÇÃO
```

## Execução paralela

O CTO pode delegar simultaneamente quando o contrato já existir. Exemplo, jornada de empréstimo nova:

| Agente | Frente |
| --- | --- |
| Design System | telas e estados |
| Backend | endpoints e serviços |
| Data | schema e migrations |
| Mobile | telas do app |
| Web | portal |
| QA | estratégia de teste |

**Pré-requisito:** o contrato do Solution Architect precisa existir antes. Sem ele, cinco agentes inventam cinco APIs diferentes.

### Isolamento

Nesta versão do Claude Code (2.1.227), o isolamento é **parâmetro da invocação**, não campo do frontmatter. Ao delegar agentes que editam código em paralelo, o CTO invoca com:

```
isolation: "worktree"
```

Aplica-se a: `web-engineer`, `mobile-engineer`, `backend-engineer`, `data-engineer`, `credit-engineer`, `integrations-engineer`, `devops-sre`, `qa-release`.

Não use worktree para agentes que só leem ou só escrevem documentação — é custo sem benefício.

## Skills compartilhadas

Conhecimento comum, para não duplicar contexto entre agentes:

| Skill | Conteúdo |
| --- | --- |
| `pegpay-domain` | Empresa, produtos, público, jornada, vocabulário |
| `pegpay-design-system` | Identidade visual, tokens, tom de voz, UX financeira |
| `pegpay-engineering-standards` | Arquitetura, contratos, tipos, erros, logs, nomenclatura |
| `pegpay-financial-safety` | Regras inegociáveis de dinheiro, idempotência, rastreabilidade |
| `pegpay-release-gate` | Definition of Done, pipeline, dupla revisão |

Skills não substituem agentes — fornecem o contexto que todos compartilham.

## Limite comum a todos os agentes

Nenhum agente pode, sem controle apropriado: aprovar crédito real · movimentar dinheiro real · liberar pagamento · alterar limite real · cancelar contrato real · alterar dado real de cliente · acessar produção arbitrariamente.

Em desenvolvimento: mocks, sandboxes, fixtures, staging.
