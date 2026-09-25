function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Variável obrigatória ausente: ${name}`)
  return value
}

export const config = {
  port: Number(process.env.PORT ?? '3001'),
  watiApiBaseUrl: required('WATI_API_BASE_URL').replace(/\/$/, ''),
  watiApiToken: required('WATI_API_TOKEN'),
  webhookSecret: required('WATI_WEBHOOK_SECRET'),
  conversationHashSecret: required('CONVERSATION_HASH_SECRET'),
  cadastroUrl: required('CADASTRO_URL').replace(/\/$/, ''),
  databaseUrl: process.env.DATABASE_URL?.trim() || undefined,
  proposalStatusWebhookSecret: process.env.PROPOSAL_STATUS_WEBHOOK_SECRET?.trim(),
  statusTemplateName: process.env.WATI_STATUS_TEMPLATE_NAME?.trim(),
  statusTemplateChannelNumber: process.env.WATI_STATUS_TEMPLATE_CHANNEL_NUMBER?.trim(),
}
