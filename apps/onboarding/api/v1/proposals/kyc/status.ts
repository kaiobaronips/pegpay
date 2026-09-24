import type { ServerResponse } from 'node:http'
import { audit, proposalByToken, sql } from '../../../../server/db.js'
import { retrieveDiditVerificationStatus, type DiditVerificationStatus } from '../../../../server/integrations/didit.js'
import { apiError, json, readJson, requestId, type ApiRequest } from '../../../../server/http.js'
import { isRateLimited, rateLimits } from '../../../../server/rate-limit.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    // Cada consulta vira uma chamada de saída para a Didit. Sem teto, uma aba esquecida aberta
    // consulta indefinidamente e uma aba maliciosa transforma o endpoint em amplificador.
    if (await isRateLimited(request, rateLimits.kycStatus)) return apiError(response, 429, 'TOO_MANY_REQUESTS', 'Muitas consultas. Aguarde alguns instantes.', correlationId)
    const body = await readJson(request)
    const candidate = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>).token : undefined
    const token = typeof candidate === 'string' ? candidate : ''
    const proposal = await proposalByToken(token)
    if (!proposal || proposal.status !== 'DRAFT') return apiError(response, 409, 'PROPOSAL_NOT_AVAILABLE', 'Esta proposta não está disponível para verificação.', correlationId)

    const rows = await sql`SELECT didit_session_id, status FROM kyc_verifications WHERE proposal_id = ${proposal.id} LIMIT 1` as { didit_session_id: string | null; status: DiditVerificationStatus }[]
    const current = rows[0]
    if (!current?.didit_session_id) return json(response, 200, { success: true, data: { kycStatus: 'NOT_STARTED' } })

    const kycStatus = current.status === 'PENDING' || current.status === 'MANUAL_REVIEW'
      ? await retrieveDiditVerificationStatus(current.didit_session_id)
      : current.status

    if (kycStatus !== current.status) {
      await sql`UPDATE kyc_verifications SET status = ${kycStatus}, updated_at = NOW(), decided_at = CASE WHEN ${kycStatus} IN ('APPROVED','REJECTED','MANUAL_REVIEW') THEN NOW() ELSE decided_at END WHERE proposal_id = ${proposal.id}`
      await audit(proposal.id, `DIDIT_KYC_${kycStatus}_DIRECT_SYNC`, 'SYSTEM')
    }
    return json(response, 200, { success: true, data: { kycStatus } })
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'kyc_status_failed', requestId: correlationId, reason: error instanceof Error ? error.message : 'UNKNOWN' }))
    const code = error instanceof Error && error.message === 'DIDIT_NOT_CONFIGURED' ? 'KYC_NOT_CONFIGURED' : 'KYC_STATUS_FAILED'
    return apiError(response, 503, code, 'Não foi possível atualizar a verificação neste momento.', correlationId)
  }
}
