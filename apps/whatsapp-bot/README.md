# Bot de WhatsApp PegPay

## Credenciais locais

1. Duplique `.env.example` e renomeie a cópia para `.env`.
2. Preencha `WATI_API_TOKEN` no arquivo `.env` local.
3. Nunca envie o token por chat, e-mail, commit ou planilha.

O arquivo `.env` é ignorado pelo Git no `.gitignore` da raiz.

## Executar localmente

```bash
npm run build -w @pegpay/whatsapp-bot
npm run start -w @pegpay/whatsapp-bot
```

Configure na Wati a URL `https://SEU-DOMINIO/webhooks/wati?secret=SEU_SEGREDO` e ative somente o evento **Message Received**. A URL pública e o segredo devem ficar exclusivamente no `.env`.

O fluxo guarda o estado somente na memória enquanto o banco da plataforma não existe. Não publique este serviço para produção antes de trocar esse armazenamento por banco persistente, configurar logs/auditoria, HTTPS e uma URL de cadastro com sessão única.
