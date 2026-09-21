import type { ServerResponse } from 'node:http'
import { setAdminCookie } from '../../../../server/admin-auth.js'
import { opaqueToken, sha256 } from '../../../../server/crypto.js'
import { sql } from '../../../../server/db.js'
import { verifyMfaChallenge } from '../../../../server/mfa.js'
import { apiError, json, readJson, requestId, type ApiRequest } from '../../../../server/http.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const body = await readJson(request, 8_192)
    const input = body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : {}
    const challengeToken = typeof input.challengeToken === 'string' ? input.challengeToken : ''
    const code = typeof input.code === 'string' ? input.code.trim() : ''
    if (!challengeToken || !/^\d{6}$/.test(code)) return apiError(response, 400, 'INVALID_INPUT', 'Informe o código de seis dígitos.', correlationId)
    const challenge = await verifyMfaChallenge(challengeToken, code)
    if (!challenge) return apiError(response, 401, 'INVALID_MFA_CODE', 'Código inválido, expirado ou já utilizado.', correlationId)
    const token = opaqueToken()
    await sql`INSERT INTO admin_sessions (token_hash, email, expires_at, created_at)
      VALUES (${sha256(token)}, ${challenge.email}, NOW() + INTERVAL '8 hours', NOW())`
    setAdminCookie(response, token)
    return json(response, 200, { success: true, data: { email: challenge.email } })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'admin_mfa_verify_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível validar o segundo fator.', correlationId)
  }
}
