import type { ServerResponse } from 'node:http'
import { requireAdmin } from '../../../../server/admin-auth.js'
import { createTotpSecret, otpauthUri, startMfaChallenge } from '../../../../server/mfa.js'
import { sql } from '../../../../server/db.js'
import { apiError, json, requestId, type ApiRequest } from '../../../../server/http.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const email = await requireAdmin(request)
    if (!email) return apiError(response, 401, 'UNAUTHORIZED', 'Faça login para continuar.', correlationId)
    await sql`CREATE TABLE IF NOT EXISTS admin_mfa_credentials (
      email VARCHAR(254) PRIMARY KEY, secret_ciphertext TEXT NOT NULL, enabled_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
    await sql`CREATE TABLE IF NOT EXISTS admin_mfa_challenges (
      token_hash CHAR(64) PRIMARY KEY, email VARCHAR(254) NOT NULL,
      purpose VARCHAR(12) NOT NULL CHECK (purpose IN ('ENROLL', 'LOGIN')),
      expires_at TIMESTAMPTZ NOT NULL, attempts SMALLINT NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 5),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), used_at TIMESTAMPTZ
    )`
    await sql`CREATE INDEX IF NOT EXISTS admin_mfa_challenges_email_idx ON admin_mfa_challenges (email, expires_at DESC)`
    await sql`ALTER TABLE proposal_documents ADD COLUMN IF NOT EXISTS retention_due_at TIMESTAMPTZ`
    await sql`ALTER TABLE credit_proposals ADD COLUMN IF NOT EXISTS retention_due_at TIMESTAMPTZ`
    await sql`CREATE INDEX IF NOT EXISTS credit_proposals_retention_due_idx ON credit_proposals (retention_due_at) WHERE retention_due_at IS NOT NULL`
    const existing = await sql`SELECT enabled_at FROM admin_mfa_credentials WHERE email = ${email} LIMIT 1` as { enabled_at: string | null }[]
    if (existing[0]?.enabled_at) return apiError(response, 409, 'MFA_ALREADY_ENABLED', 'O segundo fator já está ativo.', correlationId)
    const secret = createTotpSecret()
    const challengeToken = await startMfaChallenge(email, 'ENROLL', secret)
    return json(response, 200, { success: true, data: { challengeToken, manualEntryKey: secret, otpauthUri: otpauthUri(email, secret) } })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'admin_mfa_activate_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível iniciar a ativação do segundo fator.', correlationId)
  }
}
