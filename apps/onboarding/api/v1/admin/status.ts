import type { ServerResponse } from 'node:http'
import { requireAdmin } from '../../../server/admin-auth.js'
import { requestActorHash } from '../../../server/crypto.js'
import { sql, type ProposalStatus } from '../../../server/db.js'
import { apiError, json, readJson, requestId, type ApiRequest } from '../../../server/http.js'
import { proposalStatuses } from '../../../server/validation.js'

const allowed: Record<ProposalStatus, ProposalStatus[]> = {
  DRAFT: [], RECEIVED: ['UNDER_REVIEW'], UNDER_REVIEW: ['PENDING', 'APPROVED', 'REJECTED'],
  PENDING: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], APPROVED: [], REJECTED: [],
}

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const adminEmail = await requireAdmin(request)
    if (!adminEmail) return apiError(response, 401, 'UNAUTHORIZED', 'Faça login para continuar.', correlationId)
    const body = await readJson(request)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return apiError(response, 400, 'INVALID_INPUT', 'Dados inválidos.', correlationId)
    const input = body as Record<string, unknown>
    if (typeof input.proposalId !== 'string' || typeof input.status !== 'string' || !proposalStatuses.includes(input.status as ProposalStatus)) return apiError(response, 400, 'INVALID_INPUT', 'Status inválido.', correlationId)
    const current = await sql`SELECT status FROM credit_proposals WHERE id = ${input.proposalId} LIMIT 1` as { status: ProposalStatus }[]
    const currentStatus = current[0]?.status
    const nextStatus = input.status as ProposalStatus
    if (!currentStatus || !allowed[currentStatus].includes(nextStatus)) return apiError(response, 409, 'INVALID_STATUS_TRANSITION', 'Esta mudança de status não é permitida.', correlationId)
    const eventType = `STATUS_${currentStatus}_TO_${nextStatus}`
    const updated = await sql`WITH changed AS (
        UPDATE credit_proposals SET status = ${nextStatus}, updated_at = NOW()
        WHERE id = ${input.proposalId} AND status = ${currentStatus}
        RETURNING id, status
      ), logged AS (
        INSERT INTO proposal_audit_log (proposal_id, event_type, actor_type, actor_id_hash, occurred_at)
        SELECT id, ${eventType}, 'ADMIN', ${requestActorHash(adminEmail)}, NOW() FROM changed
      ) SELECT status FROM changed` as { status: ProposalStatus }[]
    if (!updated[0]) return apiError(response, 409, 'PROPOSAL_ALREADY_UPDATED', 'A proposta foi atualizada em outra sessão. Recarregue a página.', correlationId)
    return json(response, 200, { success: true, data: { status: nextStatus } })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'admin_status_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível atualizar o status.', correlationId)
  }
}
