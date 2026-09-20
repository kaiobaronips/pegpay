import type { ServerResponse } from 'node:http'
import { requireAdmin } from '../../../server/admin-auth.js'
import { decryptJson, requestActorHash } from '../../../server/crypto.js'
import { audit, sql, type ProposalRow } from '../../../server/db.js'
import { apiError, json, requestId, type ApiRequest } from '../../../server/http.js'

interface AdminProposalRow extends ProposalRow { document_count: string | number }

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const adminEmail = await requireAdmin(request)
    if (!adminEmail) return apiError(response, 401, 'UNAUTHORIZED', 'Faça login para continuar.', correlationId)
    const rows = await sql`SELECT p.id, p.protocol, p.status, p.amount_cents, p.installments,
        p.personal_data_ciphertext, p.consented_at, p.submitted_at, p.created_at, p.updated_at,
        COUNT(d.id)::int AS document_count
      FROM credit_proposals p LEFT JOIN proposal_documents d ON d.proposal_id = p.id AND d.validation_status = 'VALID'
      WHERE p.status <> 'DRAFT'
      GROUP BY p.id ORDER BY p.created_at DESC LIMIT 100` as AdminProposalRow[]
    const proposals = rows.map((row) => {
      const customer = row.personal_data_ciphertext ? decryptJson(row.personal_data_ciphertext) : null
      return {
      id: row.id,
      protocol: row.protocol,
      status: row.status,
      amountCents: row.amount_cents === null ? null : Number(row.amount_cents),
      installments: row.installments,
      customer: customer ? { fullName: customer.fullName, cpfMasked: `***.***.***-${customer.cpf?.slice(-2) ?? '**'}` } : null,
      documentCount: Number(row.document_count),
      submittedAt: row.submitted_at,
      createdAt: row.created_at,
      }
    })
    await Promise.all(rows.map((row) => audit(row.id, 'ADMIN_LIST_VIEWED', 'ADMIN', requestActorHash(adminEmail))))
    return json(response, 200, { success: true, data: { email: adminEmail, proposals } })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'admin_proposals_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível consultar as propostas.', correlationId)
  }
}
