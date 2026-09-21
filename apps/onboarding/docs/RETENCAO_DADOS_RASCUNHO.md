# Retenção e descarte de dados — rascunho para aprovação

Status: **rascunho técnico; não é política jurídica aprovada**.

## Princípios

- Coletar somente dados necessários para a proposta, prevenção à fraude e obrigações aplicáveis.
- Não apagar fisicamente proposta, decisão, resultado de KYC ou log de auditoria.
- Remover documentos brutos do Blob quando o prazo aprovado expirar, registrando o evento de descarte.
- Suspender expurgo quando existir obrigação legal, disputa, investigação ou solicitação formal de preservação.

## Proposta de matriz inicial

| Categoria | Prazo inicial proposto | Ação ao vencer |
| --- | --- | --- |
| Rascunho não enviado | 30 dias | Invalidar acesso e descartar dados/documentos ainda não submetidos |
| Documento bruto | Menor prazo aprovado após decisão | Apagar do armazenamento privado; manter registro do descarte |
| Cadastro/proposta submetida | Definir com jurídico e parceiro | Anonimizar ou restringir, conforme fundamento aplicável |
| Log de autenticação e auditoria | Definir com jurídico; nunca apagar silenciosamente | Arquivar com acesso restrito |
| Registro de incidente | Ao menos 5 anos | Manter para prestação de contas |

## Antes de ativar expurgo automático

1. Aprovação do jurídico/encarregado para cada prazo e fundamento legal.
2. Definição do controlador, operadores e suboperadores (KYC, armazenamento, e-mail, atendimento).
3. Aviso de privacidade publicado e versionado no portal.
4. Canal para direitos do titular e procedimento para bloqueio legal.
5. Teste de restauração, auditoria e alerta de falhas do job.

O schema já possui `retention_due_at`; nenhum dado é apagado automaticamente enquanto estes itens não forem aprovados.
