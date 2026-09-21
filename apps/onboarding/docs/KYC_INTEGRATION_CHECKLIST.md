# KYC — checklist de integração

Status: **preparado; nenhum fornecedor está integrado ou ativo**.

## Arquitetura aprovada para implementação

1. A PegPay cria uma sessão no provedor por meio do backend.
2. O cliente captura documento e selfie em página/SDK hospedado pelo provedor.
3. O provedor chama webhook autenticado para informar o resultado.
4. A PegPay persiste apenas `provider_reference`, status, decisão, versão de regras e eventos de auditoria.
5. Documento bruto não é reenviado por WhatsApp nem armazenado pela PegPay quando a captura hospedada estiver disponível.

## Itens obrigatórios antes de ligar o adapter real

- Contrato/DPA e definição de controlador, operador e suboperadores.
- Ambiente sandbox, chaves separadas de produção e documentação de API/webhook.
- Assinatura de webhook, idempotência, timeout e política de reenvio.
- Prova de vida, validação de documento e face match explicitamente contratados.
- Tratamento de `PENDING`, `APPROVED`, `REJECTED` e `MANUAL_REVIEW`.
- Processo humano para divergência e contestação, sem aprovação de crédito automática pelo KYC.
- Teste de expurgo, retenção e trilha de auditoria.
