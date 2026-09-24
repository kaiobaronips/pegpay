import type { ServerResponse } from 'node:http'
import { decryptJson, encryptJson } from '../../../server/crypto.js'
import { extendOnboardingWindow, proposalByToken, sql } from '../../../server/db.js'
import { apiError, json, proposalToken, readJson, requestId, type ApiRequest } from '../../../server/http.js'
import { isRateLimited, rateLimits } from '../../../server/rate-limit.js'
import { parseSubmission } from '../../../server/validation.js'

function personalData(input: NonNullable<ReturnType<typeof parseSubmission>>): Record<string, string> {
  return {
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
  }
}

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  try {
    if (request.method === 'GET') {
      if (await isRateLimited(request, rateLimits.draftRead)) return apiError(response, 429, 'TOO_MANY_REQUESTS', 'Muitas solicitações. Aguarde alguns minutos.', correlationId)
      const token = proposalToken(request)
      if (!token) return apiError(response, 400, 'TOKEN_REQUIRED', 'Link de cadastro inválido.', correlationId)
      const proposal = await proposalByToken(token)
      if (!proposal) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada ou link expirado.', correlationId)
      if (!proposal.personal_data_ciphertext) return json(response, 200, { success: true, data: { form: null, consent: Boolean(proposal.consented_at) } })
      const form = decryptJson(proposal.personal_data_ciphertext)
      return json(response, 200, { success: true, data: { form, consent: Boolean(proposal.consented_at) } })
    }

    if (request.method === 'POST') {
      if (await isRateLimited(request, rateLimits.draftWrite)) return apiError(response, 429, 'TOO_MANY_REQUESTS', 'Muitas solicitações. Aguarde alguns minutos.', correlationId)
      const input = parseSubmission(await readJson(request))
      if (!input) return apiError(response, 400, 'INVALID_PROPOSAL_DATA', 'Revise os dados informados antes de continuar.', correlationId)
      const proposal = await proposalByToken(input.token)
      if (!proposal) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada ou link expirado.', correlationId)
      if (proposal.status !== 'DRAFT') return apiError(response, 409, 'PROPOSAL_ALREADY_SUBMITTED', 'Esta proposta já foi enviada.', correlationId)

      const encrypted = encryptJson(personalData(input))
      await sql`WITH changed AS (
        UPDATE credit_proposals SET personal_data_ciphertext = ${encrypted},
          consent_version = '2026-09-20-privacy-v1', consented_at = COALESCE(consented_at, NOW()), updated_at = NOW()
        WHERE id = ${proposal.id} AND status = 'DRAFT'
        RETURNING id
      )
      INSERT INTO proposal_audit_log (proposal_id, event_type, actor_type, occurred_at)
      SELECT id, 'PROPOSAL_DRAFT_SAVED', 'CUSTOMER', NOW() FROM changed`
      await extendOnboardingWindow(proposal.id, 2)
      return json(response, 200, { success: true, data: { saved: true } })
    }

    return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'proposal_draft_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível salvar os dados do cadastro.', correlationId)
  }
}
