import type { ServerResponse } from 'node:http'
import { clearAdminCookie } from '../../../server/admin-auth.js'
import { sha256 } from '../../../server/crypto.js'
import { sql } from '../../../server/db.js'
import { cookie, json, requestId, type ApiRequest } from '../../../server/http.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  const token = cookie(request, 'pegpay_admin_session')
  if (token) await sql`UPDATE admin_sessions SET revoked_at = NOW() WHERE token_hash = ${sha256(token)}`
  clearAdminCookie(response)
  json(response, 200, { success: true, requestId: correlationId })
}
