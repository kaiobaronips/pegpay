# Onboarding PegPay

Portal de cadastro seguro para propostas de crédito. Dados pessoais e de recebimento são criptografados no banco; documentos ficam em Blob privado.

## MFA e retenção

O primeiro acesso administrativo após a migração exige cadastro de um segundo fator TOTP (Google Authenticator, Microsoft Authenticator ou 1Password). O painel não emite mais sessão apenas com e-mail e senha.

O rascunho técnico da política de retenção está em [`docs/RETENCAO_DADOS_RASCUNHO.md`](docs/RETENCAO_DADOS_RASCUNHO.md). Ele não ativa exclusão automática nem substitui a validação jurídica.

## H Cred — estado atual

O adapter existe somente para o sandbox e permanece desabilitado por padrão.

```env
HCRED_ENABLED=false
HCRED_API_BASE_URL=https://sandbox.hcred.com.br/v3
HCRED_USERNAME=
HCRED_API_KEY=
```

Antes de habilitar, a H Cred deve confirmar o IP de saída permitido e fornecer credenciais sandbox. O envio de propostas ainda não está habilitado: a documentação exige dados de cartão, que só poderão ser tratados após a definição do fluxo PCI/tokenizado.
