import type { IncomingMessage, ServerResponse } from 'node:http'
import { config as botConfig } from '../../src/config.js'
import { sendStatusTemplate } from '../../src/wati.js'

const MAX_BODY_BYTES = 8_192
const validStatuses = new Set(['RECEIVED', 'UNDER_REVIEW', 'PENDING', 'APPROVED', 'REJECTED'])
const statusCopy: Record<string, string> = {
  RECEIVED: 'Proposta recebida',
  UNDER_REVIEW: 'Em análise',
  PENDING: 'Pendência na proposta',
  APPROVED: 'Proposta aprovada',
  REJECTED: 'Proposta não aprovada',
}

function respond(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.setHeader('cache-control', 'no-store')
  response.end(JSON.stringify(body))
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  let phoneForLog = ''
  if (request.method !== 'POST') return respond(response, 405, { error: 'method_not_allowed' })
  if (!botConfig.proposalStatusWebhookSecret || !botConfig.statusTemplateName) return respond(response, 503, { error: 'status_notifications_not_configured' })
  if (request.headers['x-pegpay-status-secret'] !== botConfig.proposalStatusWebhookSecret) return respond(response, 401, { error: 'unauthorized' })
  try {
    const body = await readJson(request)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return respond(response, 400, { error: 'invalid_payload' })
    const input = body as Record<string, unknown>
    const phone = typeof input.phone === 'string' ? input.phone.replace(/\D/g, '') : ''
    phoneForLog = phone
    const name = typeof input.name === 'string' ? input.name.trim() : ''
    const protocol = typeof input.protocol === 'string' ? input.protocol.trim() : ''
    const status = typeof input.status === 'string' ? input.status : ''
    const notificationId = typeof input.notificationId === 'string' ? input.notificationId : ''
    if (!/^\d{12,13}$/.test(phone) || !name || name.length > 160 || !/^PP-\d{8}-[A-F0-9]{6}$/.test(protocol) || !validStatuses.has(status) || !/^[0-9a-f-]{36}$/i.test(notificationId)) return respond(response, 400, { error: 'invalid_payload' })
    await sendStatusTemplate(phone, name, protocol, statusCopy[status]!, notificationId)
    return respond(response, 200, { accepted: true })
  } catch (error) {
    // Telefone mascarado: comprimento e 4 últimos dígitos bastam para distinguir número
    // errado de template errado, sem gravar dado pessoal no log.
    const shape = phoneForLog ? `${phoneForLog.length}d***${phoneForLog.slice(-4)}` : 'ausente'
    console.error('wati_status_notification_error', error instanceof Error ? error.message : 'unknown', `phone=${shape}`)
    return respond(response, 502, { error: 'provider_error' })
  }
}
