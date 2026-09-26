import { randomUUID } from 'node:crypto'
import { decryptJson } from './crypto.js'
import { audit, sql, type ProposalStatus } from './db.js'
import { config } from './config.js'

const statuses = new Set<ProposalStatus>(['RECEIVED', 'UNDER_REVIEW', 'PENDING', 'APPROVED', 'REJECTED'])

function internationalPhone(value: string | undefined): string | null {
  const digits = value?.replace(/\D/g, '') ?? ''
  if (!/^\d{10,11}$/.test(digits)) return null
  return `55${digits}`
}

/** Best-effort delivery: a provider failure never changes the proposal status. */
export async function notifyProposalStatus(proposalId: string, status: ProposalStatus, protocol: string): Promise<void> {
  if (!statuses.has(status) || !config.whatsapp.statusWebhookUrl || !config.whatsapp.statusWebhookSecret) return
  const notificationId = randomUUID()
  let claimed: { id: string }[]
  try {
    // A proposta já foi confirmada no banco. Se o registro de notificação falhar (migração
    // pendente, banco indisponível), o aviso se perde — mas a mudança de status não pode falhar.
    claimed = await sql`INSERT INTO proposal_whatsapp_notifications
        (id, proposal_id, proposal_status, state, attempts, created_at, updated_at)
      VALUES (${notificationId}, ${proposalId}, ${status}, 'PENDING', 1, NOW(), NOW())
      ON CONFLICT (proposal_id, proposal_status) DO NOTHING
      RETURNING id` as { id: string }[]
  } catch {
    console.error(JSON.stringify({ level: 'warn', service: 'onboarding', event: 'whatsapp_status_claim_failed', proposalId, status }))
    return
  }
  if (!claimed[0]) return

  try {
    const rows = await sql`SELECT personal_data_ciphertext FROM credit_proposals WHERE id = ${proposalId} LIMIT 1` as { personal_data_ciphertext: string | null }[]
    const customer = rows[0]?.personal_data_ciphertext ? decryptJson(rows[0].personal_data_ciphertext) : null
    const phone = internationalPhone(customer?.phone)
    const name = customer?.fullName?.trim()
    if (!phone || !name) throw new Error('CUSTOMER_CONTACT_UNAVAILABLE')
    const response = await fetch(config.whatsapp.statusWebhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-pegpay-status-secret': config.whatsapp.statusWebhookSecret,
      },
      body: JSON.stringify({ phone, name, protocol, status, notificationId }),
      signal: AbortSignal.timeout(5_000),
      redirect: 'error',
    })
    if (!response.ok) throw new Error(`WHATSAPP_STATUS_HTTP_${response.status}`)
    await sql`UPDATE proposal_whatsapp_notifications SET state = 'SENT', sent_at = NOW(), updated_at = NOW() WHERE id = ${notificationId}`
    await audit(proposalId, `WHATSAPP_STATUS_${status}_SENT`, 'SYSTEM')
  } catch (error) {
    // O motivo ia só para `last_error` no banco, fora do alcance de quem lê o log. Diagnosticar
    // exigia consultar o Postgres — e sem acesso a ele a falha virava um mistério.
    console.error(JSON.stringify({ level: 'warn', service: 'onboarding', event: 'whatsapp_status_notification_failed', proposalId, status, reason: error instanceof Error ? error.message.slice(0, 200) : 'UNKNOWN' }))
    try {
      await sql`UPDATE proposal_whatsapp_notifications SET state = 'FAILED', last_error = ${error instanceof Error ? error.message.slice(0, 120) : 'UNKNOWN'}, updated_at = NOW() WHERE id = ${notificationId}`
      await audit(proposalId, `WHATSAPP_STATUS_${status}_FAILED`, 'SYSTEM')
    } catch { /* O registro do fracasso não pode derrubar a mudança de status já confirmada. */ }
  }
}
