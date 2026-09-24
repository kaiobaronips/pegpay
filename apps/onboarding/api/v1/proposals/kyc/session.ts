import type { ServerResponse } from 'node:http'
import { audit, extendOnboardingWindow, proposalByToken, sql } from '../../../../server/db.js'
import { createDiditSession } from '../../../../server/integrations/didit.js'
import { apiError, json, readJson, requestId, type ApiRequest } from '../../../../server/http.js'
import { isRateLimited, rateLimits } from '../../../../server/rate-limit.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    if (await isRateLimited(request, rateLimits.kycSession)) return apiError(response, 429, 'TOO_MANY_REQUESTS', 'Muitas tentativas de verificação. Aguarde alguns minutos.', correlationId)
    const body = await readJson(request)
    const tokenValue = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>).token : undefined
    const token = typeof tokenValue === 'string' ? tokenValue : ''
    const proposal = await proposalByToken(token)
    if (!proposal || proposal.status !== 'DRAFT') return apiError(response, 409, 'PROPOSAL_NOT_AVAILABLE', 'Esta proposta não está disponível para verificação.', correlationId)
    const existing = await sql`SELECT didit_session_id, status FROM kyc_verifications WHERE proposal_id = ${proposal.id} LIMIT 1` as { didit_session_id: string; status: string }[]
    if (existing[0]?.status === 'PENDING') return apiError(response, 409, 'KYC_ALREADY_STARTED', 'A verificação já foi iniciada.', correlationId)
    const session = await createDiditSession(proposal.id)
    await sql`INSERT INTO kyc_verifications (proposal_id, provider, didit_session_id, status, created_at, updated_at)
      VALUES (${proposal.id}, 'DIDIT', ${session.session_id}, 'PENDING', NOW(), NOW())
      ON CONFLICT (proposal_id) DO UPDATE SET didit_session_id = EXCLUDED.didit_session_id, status = 'PENDING', updated_at = NOW()`
    // A verificação leva o cliente para fora do site e o traz de volta; sem renovar a janela
    // de 1 hora ele retorna da Didit para um link já expirado.
    await extendOnboardingWindow(proposal.id, 24)
    await audit(proposal.id, 'DIDIT_KYC_SESSION_CREATED', 'SYSTEM')
    return json(response, 201, { success: true, data: { url: session.url } })
  } catch (error) {
    const code = error instanceof Error && error.message === 'DIDIT_NOT_CONFIGURED' ? 'KYC_NOT_CONFIGURED' : 'KYC_SESSION_FAILED'
    return apiError(response, 503, code, 'A verificação de identidade ainda não está disponível.', correlationId)
  }
}
