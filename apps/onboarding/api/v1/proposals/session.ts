import type { ServerResponse } from 'node:http'
import { proposalByToken, sql, type ProposalRow } from '../../../server/db.js'
import { apiError, json, proposalToken, readJson, requestId, setProposalCookie, type ApiRequest } from '../../../server/http.js'
import { isRateLimited, rateLimits } from '../../../server/rate-limit.js'

async function sessionPayload(proposal: ProposalRow): Promise<Record<string, unknown>> {
  const documents = await sql`SELECT kind FROM proposal_documents WHERE proposal_id = ${proposal.id} AND validation_status = 'VALID'` as { kind: string }[]
  const kyc = await sql`SELECT status FROM kyc_verifications WHERE proposal_id = ${proposal.id} LIMIT 1` as { status: string }[]
  return {
    id: proposal.id,
    protocol: proposal.protocol,
    status: proposal.status,
    amountCents: proposal.amount_cents === null ? null : Number(proposal.amount_cents),
    installments: proposal.installments,
    documents: documents.map((document) => document.kind),
    kycStatus: kyc[0]?.status ?? 'NOT_STARTED',
  }
}

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET' && request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)

  try {
    if (await isRateLimited(request, rateLimits.session)) return apiError(response, 429, 'TOO_MANY_REQUESTS', 'Muitas solicitações. Aguarde alguns minutos.', correlationId)

    // POST troca o token do link por um cookie HttpOnly. Depois disso o token nunca mais
    // trafega em URL, corpo ou armazenamento do navegador.
    if (request.method === 'POST') {
      const body = await readJson(request, 4_096)
      const candidate = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>).token : undefined
      const token = typeof candidate === 'string' ? candidate.trim() : ''
      if (!token || token.length > 128) return apiError(response, 400, 'INVALID_TOKEN', 'Link de proposta inválido.', correlationId)
      const proposal = await proposalByToken(token)
      if (!proposal) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada ou link expirado.', correlationId)
      setProposalCookie(response, token)
      return json(response, 200, { success: true, data: await sessionPayload(proposal) })
    }

    const token = proposalToken(request)
    if (!token) return apiError(response, 400, 'INVALID_TOKEN', 'Link de proposta inválido.', correlationId)
    const proposal = await proposalByToken(token)
    if (!proposal) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada ou link expirado.', correlationId)
    return json(response, 200, { success: true, data: await sessionPayload(proposal) })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'proposal_session_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível abrir a proposta.', correlationId)
  }
}
