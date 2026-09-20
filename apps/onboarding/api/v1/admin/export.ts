import type { ServerResponse } from 'node:http'
import { requireAdmin } from '../../../server/admin-auth.js'
import { decryptJson, requestActorHash } from '../../../server/crypto.js'
import { audit, sql, type ProposalRow } from '../../../server/db.js'
import { apiError, requestId, type ApiRequest } from '../../../server/http.js'

function cell(value: unknown): string {
  const raw = value === null || value === undefined ? '' : String(value)
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw
  return `"${safe.replace(/"/g, '""')}"`
}

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const adminEmail = await requireAdmin(request)
    if (!adminEmail) return apiError(response, 401, 'UNAUTHORIZED', 'Faça login para continuar.', correlationId)
    const rows = await sql`SELECT id, protocol, status, amount_cents, installments,
        personal_data_ciphertext, consented_at, submitted_at, created_at, updated_at
      FROM credit_proposals WHERE status <> 'DRAFT' ORDER BY created_at DESC LIMIT 1000` as ProposalRow[]
    const header = ['Protocolo', 'Status', 'Valor centavos', 'Parcelas', 'Nome', 'CPF', 'Nascimento', 'E-mail', 'Banco', 'Agência', 'Conta', 'Tipo da conta', 'Enviado em']
    const lines = [header.map(cell).join(';')]
    for (const row of rows) {
      const customer = row.personal_data_ciphertext ? decryptJson(row.personal_data_ciphertext) : {}
      lines.push([row.protocol, row.status, row.amount_cents, row.installments, customer.fullName, customer.cpf, customer.birthDate, customer.email, customer.bankName, customer.bankBranch, customer.bankAccount, customer.bankAccountType, row.submitted_at].map(cell).join(';'))
      await audit(row.id, 'ADMIN_CSV_EXPORTED', 'ADMIN', requestActorHash(adminEmail))
    }
    response.statusCode = 200
    response.setHeader('content-type', 'text/csv; charset=utf-8')
    response.setHeader('content-disposition', `attachment; filename="pegpay-propostas-${new Date().toISOString().slice(0, 10)}.csv"`)
    response.setHeader('cache-control', 'private, no-store')
    response.end(`\uFEFF${lines.join('\r\n')}`)
  } catch {
    return apiError(response, 500, 'EXPORT_FAILED', 'Não foi possível gerar a planilha.', correlationId)
  }
}
