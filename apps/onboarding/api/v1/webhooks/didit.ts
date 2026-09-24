import type { ServerResponse } from 'node:http'
import { audit, sql } from '../../../server/db.js'
import { isValidDiditSignature, type DiditWebhook } from '../../../server/integrations/didit.js'
import { apiError, json, readJson, requestId, type ApiRequest } from '../../../server/http.js'

const statusMap: Record<string, 'PENDING' | 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' | 'EXPIRED'> = {
  'Not Started': 'PENDING', 'In Progress': 'PENDING', 'Awaiting User': 'PENDING', 'In Review': 'MANUAL_REVIEW',
  Approved: 'APPROVED', Declined: 'REJECTED', Resubmitted: 'PENDING', Abandoned: 'EXPIRED', Expired: 'EXPIRED', 'Kyc Expired': 'EXPIRED',
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const payload = await readJson(request, 512_000)
    const signature = typeof request.headers['x-signature-v2'] === 'string' ? request.headers['x-signature-v2'] : ''
    const timestamp = typeof request.headers['x-timestamp'] === 'string' ? request.headers['x-timestamp'] : ''
    if (!isValidDiditSignature(payload, signature, timestamp)) return apiError(response, 401, 'INVALID_SIGNATURE', 'Assinatura inválida.', correlationId)
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return apiError(response, 400, 'INVALID_PAYLOAD', 'Payload inválido.', correlationId)
    const event = payload as DiditWebhook
    // `vendor_data` e `event_id` entram em colunas UUID. Um valor fora do formato faz o Postgres
    // lançar, o handler devolver 500 e a Didit reenviar o mesmo evento indefinidamente.
    if (!uuid.test(event.event_id ?? '') || !uuid.test(event.vendor_data ?? '') || !event.session_id || !statusMap[event.status]) {
      console.error(JSON.stringify({ level: 'warn', service: 'onboarding', event: 'didit_webhook_ignored', requestId: correlationId, status: event.status }))
      return json(response, 200, { success: true, data: { ignored: true } })
    }
    const inserted = await sql`INSERT INTO kyc_webhook_events (event_id, provider, received_at) VALUES (${event.event_id}, 'DIDIT', NOW()) ON CONFLICT (event_id) DO NOTHING RETURNING event_id` as { event_id: string }[]
    if (!inserted[0]) return json(response, 200, { success: true, data: { duplicate: true } })
    const updated = await sql`UPDATE kyc_verifications SET status = ${statusMap[event.status]}, updated_at = NOW(), decided_at = CASE WHEN ${statusMap[event.status]} IN ('APPROVED','REJECTED','MANUAL_REVIEW') THEN NOW() ELSE decided_at END
      WHERE proposal_id = ${event.vendor_data} AND didit_session_id = ${event.session_id} RETURNING proposal_id` as { proposal_id: string }[]
    if (updated[0]) await audit(updated[0].proposal_id, `DIDIT_KYC_${statusMap[event.status]}`, 'SYSTEM')
    return json(response, 200, { success: true, data: { received: true } })
  } catch {
    return apiError(response, 500, 'WEBHOOK_FAILED', 'Não foi possível processar o evento.', correlationId)
  }
}
