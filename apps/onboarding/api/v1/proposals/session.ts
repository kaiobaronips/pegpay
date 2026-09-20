import type { ServerResponse } from 'node:http'
import { proposalByToken, sql } from '../../../server/db.js'
import { apiError, json, requestId, type ApiRequest } from '../../../server/http.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  const url = new URL(request.url ?? '/', `https://${request.headers.host ?? 'localhost'}`)
  const token = url.searchParams.get('token')?.trim()
  if (!token || token.length > 128) return apiError(response, 400, 'INVALID_TOKEN', 'Link de proposta inválido.', correlationId)

  try {
    const proposal = await proposalByToken(token)
    if (!proposal) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada ou link expirado.', correlationId)
    const documents = await sql`SELECT kind FROM proposal_documents WHERE proposal_id = ${proposal.id} AND validation_status = 'VALID'` as { kind: string }[]
    return json(response, 200, {
      success: true,
      data: {
        id: proposal.id,
        protocol: proposal.protocol,
        status: proposal.status,
        amountCents: proposal.amount_cents === null ? null : Number(proposal.amount_cents),
        installments: proposal.installments,
        documents: documents.map((document) => document.kind),
      },
    })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'proposal_session_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível abrir a proposta.', correlationId)
  }
}
