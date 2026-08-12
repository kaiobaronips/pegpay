---
name: pegpay-financial-safety
description: Regras inegociáveis para qualquer código da PegPay que toque dinheiro, decisão de crédito ou movimentação de saldo. Use ao implementar ou revisar cálculo financeiro, parcela, CET, taxa, limite, pagamento, cobrança, ledger ou qualquer operação com valor monetário.
---

# PegPay — Segurança Financeira

Regras que não têm exceção sem ADR explícito e aprovação humana.

## 1. Representação de dinheiro

**Nunca `float` ou `double`.** Sempre:

- **integer em centavos** (`125090` = R$ 1.250,90), ou
- **`NUMERIC(18,2)`** no PostgreSQL.

Taxa também não é float quando entra em cálculo persistido. Defina a precisão e seja consistente em toda a base.

## 2. Idempotência

Toda operação financeira nasce com `idempotency_key`. A mesma chave executada duas vezes produz **um único efeito**.

Retry que cobra duas vezes é pior que a falha original.

## 3. Rastreabilidade

Toda operação financeira registra:

```
transaction_id · timestamp · origem · destino · valor · moeda
status · referência externa · idempotency_key · metadata · histórico
```

Estados: `pending` · `processing` · `completed` · `failed` · `cancelled` · `reversed`.

## 4. Nunca apagar

Proibido `DELETE` físico em: transação financeira · decisão de crédito · proposta · contrato · KYC · audit log · alteração administrativa.

Use `status`, `deleted_at`, `cancelled_at`, `archived_at`.

Nunca sobrescreva decisão de crédito — crie nova versão.

## 5. Saldo

Nunca `balance = balance - amount` sem histórico de transação. Quando houver movimentação interna de saldo, avalie **ledger double-entry**.

## 6. Cálculo

Considere sempre: precisão · regra de arredondamento explícita · moeda · timezone · concorrência · reversão.

A soma das parcelas fecha com o total. Centavo não some nem aparece do nada.

**A simulação precisa produzir o mesmo número da contratação.**

## 7. Transparência (é regra técnica, não só de design)

CET, prazo, parcela, taxa e garantia visíveis junto do valor. Um total exibido não pode ser menor do que o CET ao lado implica.

## 8. Autoridade

Regra financeira vive no **backend**. Frontend e app exibem o que a API calculou; nunca recalculam.

Política de crédito nunca é hardcode no cliente. IA generativa nunca é autoridade única para aprovar ou recusar crédito.

## 9. Agentes

Nenhum agente aprova crédito real, movimenta dinheiro real, libera pagamento, altera limite real ou cancela contrato real. Em desenvolvimento: mocks, sandboxes, fixtures, staging.

---

Referência completa: `docs/context/CTO_PROJECT_MEMORY.md` seções 8, 9 e 16.
