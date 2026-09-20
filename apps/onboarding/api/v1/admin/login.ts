import type { ServerResponse } from 'node:http'
import { config } from '../../../server/config.js'
import { opaqueToken, requestActorHash, sha256, verifyPassword } from '../../../server/crypto.js'
import { sql } from '../../../server/db.js'
import { apiError, clientIp, json, readJson, requestId, type ApiRequest } from '../../../server/http.js'
import { setAdminCookie } from '../../../server/admin-auth.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  const actorHash = requestActorHash(clientIp(request))
  try {
    const recent = await sql`SELECT COUNT(*)::int AS count FROM admin_login_attempts
      WHERE actor_id_hash = ${actorHash} AND succeeded = FALSE AND occurred_at > NOW() - INTERVAL '15 minutes'` as { count: number }[]
    if ((recent[0]?.count ?? 0) >= 5) return apiError(response, 429, 'TOO_MANY_ATTEMPTS', 'Muitas tentativas. Aguarde 15 minutos.', correlationId)

    const body = await readJson(request, 8_192)
    const input = body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : {}
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
    const password = typeof input.password === 'string' ? input.password : ''
    const valid = email === config.adminEmail && password.length <= 256 && verifyPassword(password)
    await sql`INSERT INTO admin_login_attempts (actor_id_hash, succeeded, occurred_at) VALUES (${actorHash}, ${valid}, NOW())`
    if (!valid) return apiError(response, 401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.', correlationId)

    const token = opaqueToken()
    await sql`INSERT INTO admin_sessions (token_hash, email, expires_at, created_at)
      VALUES (${sha256(token)}, ${email}, NOW() + INTERVAL '8 hours', NOW())`
    setAdminCookie(response, token)
    return json(response, 200, { success: true, data: { email } })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'admin_login_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível autenticar.', correlationId)
  }
}
