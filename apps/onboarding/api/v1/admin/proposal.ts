import type { ServerResponse } from 'node:http'
import { requireAdmin } from '../../../server/admin-auth.js'
import { decryptJson, requestActorHash } from '../../../server/crypto.js'
import { audit, sql, type ProposalRow } from '../../../server/db.js'
import { apiError, json, requestId, type ApiRequest } from '../../../server/http.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const adminEmail = await requireAdmin(request)
    if (!adminEmail) return apiError(response, 401, 'UNAUTHORIZED', 'Faça login para continuar.', correlationId)
    const url = new URL(request.url ?? '/', `https://${request.headers.host ?? 'localhost'}`)
    const proposalId = url.searchParams.get('proposalId')
    if (!proposalId || !/^[0-9a-f-]{36}$/i.test(proposalId)) return apiError(response, 400, 'INVALID_INPUT', 'Proposta inválida.', correlationId)
    const rows = await sql`SELECT id, protocol, status, amount_cents, installments,
        personal_data_ciphertext, consented_at, submitted_at, created_at, updated_at
      FROM credit_proposals WHERE id = ${proposalId} AND status <> 'DRAFT' LIMIT 1` as ProposalRow[]
    const row = rows[0]
    if (!row || !row.personal_data_ciphertext) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada.', correlationId)
    await audit(row.id, 'ADMIN_PERSONAL_DATA_VIEWED', 'ADMIN', requestActorHash(adminEmail))
    return json(response, 200, { success: true, data: { customer: decryptJson(row.personal_data_ciphertext) } })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'admin_proposal_detail_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível consultar os dados da proposta.', correlationId)
  }
}
