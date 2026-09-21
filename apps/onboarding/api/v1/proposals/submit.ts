import type { ServerResponse } from 'node:http'
import { encryptJson } from '../../../server/crypto.js'
import { proposalByToken, sql } from '../../../server/db.js'
import { apiError, json, readJson, requestId, type ApiRequest } from '../../../server/http.js'
import { parseSubmission } from '../../../server/validation.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const input = parseSubmission(await readJson(request))
    if (!input) return apiError(response, 400, 'INVALID_PROPOSAL_DATA', 'Revise os dados informados e tente novamente.', correlationId)
    const proposal = await proposalByToken(input.token)
    if (!proposal) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada ou link expirado.', correlationId)
    if (proposal.status !== 'DRAFT') return json(response, 200, { success: true, data: { protocol: proposal.protocol, status: proposal.status } })

    const documents = await sql`SELECT kind FROM proposal_documents WHERE proposal_id = ${proposal.id} AND validation_status = 'VALID'` as { kind: string }[]
    const kinds = new Set(documents.map((document) => document.kind))
    if (!kinds.has('SELFIE_WITH_DOCUMENT') || !kinds.has('IDENTITY_DOCUMENT_FRONT') || !kinds.has('IDENTITY_DOCUMENT_BACK')) return apiError(response, 409, 'DOCUMENTS_REQUIRED', 'Envie a selfie e a frente e o verso do documento antes de continuar.', correlationId)

    const encrypted = encryptJson({
      fullName: input.fullName,
      cpf: input.cpf,
      birthDate: input.birthDate,
      email: input.email,
      rg: input.rg,
      phone: input.phone,
      zipCode: input.zipCode,
      street: input.street,
      addressNumber: input.addressNumber,
      district: input.district,
      city: input.city,
      state: input.state,
      receiptMethod: input.receiptMethod,
      bankName: input.bankName,
      bankBranch: input.bankBranch,
      bankAccount: input.bankAccount,
      bankAccountType: input.bankAccountType,
      pixKeyType: input.pixKeyType ?? '',
      pixKey: input.pixKey ?? '',
    })
    const updated = await sql`WITH changed AS (UPDATE credit_proposals SET
        personal_data_ciphertext = ${encrypted}, consent_version = '2026-09-20',
        consented_at = NOW(), submitted_at = NOW(), status = 'RECEIVED', updated_at = NOW()
      WHERE id = ${proposal.id} AND status = 'DRAFT'
      RETURNING id, protocol
    ), logged AS (
      INSERT INTO proposal_audit_log (proposal_id, event_type, actor_type, occurred_at)
      SELECT id, 'PROPOSAL_SUBMITTED', 'CUSTOMER', NOW() FROM changed
    ) SELECT protocol FROM changed` as { protocol: string }[]
    if (!updated[0]) return apiError(response, 409, 'PROPOSAL_ALREADY_UPDATED', 'A proposta já foi atualizada.', correlationId)
    return json(response, 200, { success: true, data: { protocol: updated[0].protocol, status: 'RECEIVED' } })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'proposal_submit_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível enviar a proposta.', correlationId)
  }
}
