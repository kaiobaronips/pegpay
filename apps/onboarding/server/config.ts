function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Variável obrigatória ausente: ${name}`)
  return value
}

const encryptionKey = Buffer.from(required('PROPOSAL_DATA_ENCRYPTION_KEY'), 'base64')
if (encryptionKey.length !== 32) throw new Error('PROPOSAL_DATA_ENCRYPTION_KEY deve possuir 32 bytes')

export const config = {
  databaseUrl: required('DATABASE_URL'),
  databaseUrlUnpooled: process.env.DATABASE_URL_UNPOOLED?.trim(),
  encryptionKey,
  adminEmail: required('ADMIN_EMAIL').toLowerCase(),
  adminPasswordScrypt: required('ADMIN_PASSWORD_SCRYPT'),
  adminSessionSecret: required('ADMIN_SESSION_SECRET'),
  hcred: {
    enabled: process.env.HCRED_ENABLED === 'true',
    apiBaseUrl: process.env.HCRED_API_BASE_URL?.trim() || 'https://sandbox.hcred.com.br/v3',
    username: process.env.HCRED_USERNAME?.trim(),
    apiKey: process.env.HCRED_API_KEY?.trim(),
  },
  didit: {
    enabled: process.env.DIDIT_ENABLED === 'true',
    apiKey: process.env.DIDIT_API_KEY?.trim(),
    webhookSecret: process.env.DIDIT_WEBHOOK_SECRET?.trim(),
  },
  whatsapp: {
    statusWebhookUrl: process.env.WHATSAPP_STATUS_WEBHOOK_URL?.trim(),
    statusWebhookSecret: process.env.WHATSAPP_STATUS_WEBHOOK_SECRET?.trim(),
  },
}
