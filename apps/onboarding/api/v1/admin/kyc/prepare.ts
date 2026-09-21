import type { ServerResponse } from 'node:http'
import { requireAdmin } from '../../../../server/admin-auth.js'
import { sql } from '../../../../server/db.js'
import { apiError, json, requestId, type ApiRequest } from '../../../../server/http.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    if (!(await requireAdmin(request))) return apiError(response, 401, 'UNAUTHORIZED', 'Faça login para continuar.', correlationId)
    await sql`CREATE TABLE IF NOT EXISTS kyc_verifications (
      proposal_id UUID PRIMARY KEY REFERENCES credit_proposals(id), provider VARCHAR(32) NOT NULL, didit_session_id UUID UNIQUE,
      status VARCHAR(24) NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED','MANUAL_REVIEW','EXPIRED')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), decided_at TIMESTAMPTZ
    )`
    await sql`CREATE TABLE IF NOT EXISTS kyc_webhook_events (
      event_id UUID PRIMARY KEY, provider VARCHAR(32) NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
    return json(response, 200, { success: true, data: { prepared: true } })
  } catch {
    return apiError(response, 500, 'KYC_PREPARE_FAILED', 'Não foi possível preparar o KYC.', correlationId)
  }
}
