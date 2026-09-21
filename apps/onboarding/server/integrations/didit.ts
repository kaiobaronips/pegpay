import { createHmac, timingSafeEqual } from 'node:crypto'
import { config } from '../config.js'

export const DIDIT_WORKFLOW_ID = 'de32b6e3-e86a-4d39-bbc3-d14240cf500e'
const DIDIT_API_BASE = 'https://verification.didit.me/v3'

export interface DiditSession { session_id: string; url: string; status: string }

export interface DiditWebhook { event_id: string; webhook_type: string; session_id?: string; vendor_data?: string; status: string }

function sorted(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sorted)
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value as object).sort().map((key) => [key, sorted((value as Record<string, unknown>)[key])]))
  return value
}

export function isValidDiditSignature(payload: unknown, signature: string, timestamp: string): boolean {
  if (!config.didit.webhookSecret || !/^\d+$/.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false
  const canonical = JSON.stringify(sorted(payload))
  const expected = createHmac('sha256', config.didit.webhookSecret).update(canonical, 'utf8').digest('hex')
  const supplied = Buffer.from(signature, 'hex')
  const expectedBuffer = Buffer.from(expected, 'hex')
  return supplied.length === expectedBuffer.length && timingSafeEqual(supplied, expectedBuffer)
}

export async function createDiditSession(proposalId: string): Promise<DiditSession> {
  if (!config.didit.enabled || !config.didit.apiKey) throw new Error('DIDIT_NOT_CONFIGURED')
  const response = await fetch(`${DIDIT_API_BASE}/session/`, {
    method: 'POST', headers: { 'x-api-key': config.didit.apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({ workflow_id: DIDIT_WORKFLOW_ID, vendor_data: proposalId, callback: 'https://cadastro.pegpay.com.br/kyc/concluido', language: 'pt' }),
    signal: AbortSignal.timeout(8_000), redirect: 'error',
  })
  if (!response.ok) throw new Error('DIDIT_SESSION_CREATE_FAILED')
  const parsed: unknown = await response.json()
  if (!parsed || typeof parsed !== 'object') throw new Error('DIDIT_INVALID_RESPONSE')
  const session = parsed as Record<string, unknown>
  if (typeof session.session_id !== 'string' || typeof session.url !== 'string' || !session.url.startsWith('https://verify.didit.me/')) throw new Error('DIDIT_INVALID_RESPONSE')
  return { session_id: session.session_id, url: session.url, status: typeof session.status === 'string' ? session.status : 'Not Started' }
}
