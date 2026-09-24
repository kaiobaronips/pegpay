import type { ServerResponse } from 'node:http'
import { decryptJson, encryptJson } from '../../../server/crypto.js'
import { extendOnboardingWindow, proposalByToken, sql } from '../../../server/db.js'
import { apiError, json, proposalToken, readJson, requestId, type ApiRequest } from '../../../server/http.js'
import { isRateLimited, rateLimits } from '../../../server/rate-limit.js'
import { CONSENT_VERSION } from '../../../server/consent.js'
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

/** Mantém os últimos dígitos, o suficiente para o cliente reconhecer o que já preencheu. */
function tail(value: string, visible: number): string {
  const clean = value.trim()
  if (clean.length <= visible) return clean ? '•'.repeat(clean.length) : ''
  return `${'•'.repeat(Math.min(clean.length - visible, 8))}${clean.slice(-visible)}`
}

/**
 * Quem reabre o cadastro não precisa receber o dossiê de volta em claro. Um link vazado
 * devolveria CPF, RG, endereço e conta bancária completos — insumo pronto para abrir crédito
 * no nome do titular. O POST continua recebendo e gravando o valor inteiro.
 */
function maskedForm(form: Record<string, string>): Record<string, string> {
  return {
    ...form,
    cpf: tail(form.cpf ?? '', 2),
    rg: tail(form.rg ?? '', 2),
    birthDate: form.birthDate ? `••••-••-${(form.birthDate).slice(-2)}` : '',
    bankAccount: tail(form.bankAccount ?? '', 2),
    bankBranch: tail(form.bankBranch ?? '', 2),
    pixKey: tail(form.pixKey ?? '', 3),
    email: form.email ? form.email.replace(/^(.)[^@]*(@.*)$/, (_m, a: string, b: string) => `${a}•••${b}`) : '',
    phone: tail(form.phone ?? '', 4),
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
      // Enquanto é rascunho o titular está preenchendo e precisa dos valores de volta. Depois de
      // enviada a tela é só leitura, então um link vazado não tem por que devolver o dossiê.
      const readOnly = proposal.status !== 'DRAFT'
      return json(response, 200, { success: true, data: { form: readOnly ? maskedForm(form) : form, masked: readOnly, consent: Boolean(proposal.consented_at) } })
    }

    if (request.method === 'POST') {
      if (await isRateLimited(request, rateLimits.draftWrite)) return apiError(response, 429, 'TOO_MANY_REQUESTS', 'Muitas solicitações. Aguarde alguns minutos.', correlationId)
      const token = proposalToken(request)
      if (!token) return apiError(response, 400, 'TOKEN_REQUIRED', 'Link de cadastro inválido.', correlationId)
      const input = parseSubmission(await readJson(request))
      if (!input) return apiError(response, 400, 'INVALID_PROPOSAL_DATA', 'Revise os dados informados antes de continuar.', correlationId)
      const proposal = await proposalByToken(token)
      if (!proposal) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada ou link expirado.', correlationId)
      if (proposal.status !== 'DRAFT') return apiError(response, 409, 'PROPOSAL_ALREADY_SUBMITTED', 'Esta proposta já foi enviada.', correlationId)

      const encrypted = encryptJson(personalData(input))
      await sql`WITH changed AS (
        UPDATE credit_proposals SET personal_data_ciphertext = ${encrypted},
          consent_version = ${CONSENT_VERSION}, consented_at = COALESCE(consented_at, NOW()), updated_at = NOW()
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
