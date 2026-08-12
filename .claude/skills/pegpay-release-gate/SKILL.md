---
name: pegpay-release-gate
description: Definition of Done e portões de release da PegPay. Use antes de considerar qualquer feature concluída, ao operar o pipeline, e para saber quando uma mudança exige dupla revisão.
---

# PegPay — Release Gate

## Definition of Done global

Nenhuma feature está concluída enquanto não atender, quando aplicável:

```
[ ] requisito definido com critério de aceite verificável
[ ] arquitetura validada / contrato existente
[ ] implementação concluída
[ ] types válidos, sem any
[ ] validação runtime na fronteira
[ ] tratamento de erros estruturado
[ ] autenticação
[ ] autorização verificada no backend
[ ] auditoria dos eventos críticos
[ ] observabilidade (log estruturado, correlationId)
[ ] unit tests nas regras de negócio
[ ] integration tests nos fluxos entre módulos
[ ] E2E quando o fluxo for crítico para o cliente
[ ] security review
[ ] documentação atualizada
[ ] build passando
[ ] lint passando
```

## Pipeline

```
lint → type-check → unit tests → integration tests → build
    → security checks → E2E → staging → production
```

Gate que sempre passa não é gate. Nunca deploy direto em produção sem validação.

## Dupla revisão obrigatória

Mudanças em:

```
credit · risk · payments · contracts · auth · permissions · ledger · kyc · fraud
```

não estão concluídas depois de um único agente implementar. Fluxo obrigatório, sem atalho:

```
IMPLEMENTADOR → QA → SECURITY → CTO
```

## Casos de borda que o QA sempre verifica em fintech

- **Idempotência** — mesma operação, mesma chave, duas vezes = um efeito.
- **Arredondamento** — soma das parcelas fecha com o total.
- **Simulação × contratação** — o número simulado é o número contratado.
- **Autorização negada** — teste o acesso proibido, não só o permitido.
- **Concorrência** — duas operações simultâneas não furam limite nem saldo.
- **Transição de estado inválida** — rejeitada.
- **Falha externa** — degradação explícita, nunca silenciosa.
- **Limites de faixa** — mínimo, máximo, zero, negativo, vazio, gigante.

## Vereditos

| Agente | Vereditos |
| --- | --- |
| `pegpay-qa-release` | LIBERADO · LIBERADO COM RESSALVA · BLOQUEADO |
| `pegpay-security-compliance` | APROVADO · APROVADO COM RESSALVAS · BLOQUEADO |

Bloquear é função. Achado crítico volta ao autor antes de seguir.

## Nunca use dado real

Em teste e desenvolvimento: mocks, sandboxes, fixtures sintéticas, staging. Nunca dado real de cliente sem necessidade e autorização.
