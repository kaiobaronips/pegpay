import type { IncomingMessage } from 'node:http'
import { requestActorHash } from './crypto.js'
import { clientIp } from './http.js'
import { sql } from './db.js'

/**
 * Janela deslizante por (escopo, origem). A origem é o IP sob HMAC — nunca o IP em claro,
 * porque IP é dado pessoal e a tabela não é criptografada.
 */
export interface RateLimitRule {
  scope: string
  limit: number
  windowSeconds: number
}

export const rateLimits = {
  draftRead: { scope: 'draft_read', limit: 60, windowSeconds: 300 },
  draftWrite: { scope: 'draft_write', limit: 40, windowSeconds: 300 },
  session: { scope: 'session_read', limit: 60, windowSeconds: 300 },
  kycSession: { scope: 'kyc_session', limit: 5, windowSeconds: 900 },
  kycStatus: { scope: 'kyc_status', limit: 60, windowSeconds: 600 },
  submit: { scope: 'proposal_submit', limit: 10, windowSeconds: 900 },
} as const satisfies Record<string, RateLimitRule>

/**
 * Consome uma unidade da janela e devolve `true` quando o pedido passa do teto.
 * Em falha de banco a chamada **não** bloqueia o cliente: o endpoint segue e a falha é logada,
 * porque derrubar o cadastro inteiro por indisponibilidade do contador é pior que perder a contagem.
 */
export async function isRateLimited(request: IncomingMessage, rule: RateLimitRule, subject?: string): Promise<boolean> {
  const actorHash = requestActorHash(`${rule.scope}:${subject ?? clientIp(request)}`)
  try {
    const rows = await sql`
      INSERT INTO request_rate_limits (scope, actor_id_hash, window_started_at, hits)
      VALUES (${rule.scope}, ${actorHash}, NOW(), 1)
      ON CONFLICT (scope, actor_id_hash) DO UPDATE SET
        hits = CASE
          WHEN request_rate_limits.window_started_at < NOW() - MAKE_INTERVAL(secs => ${rule.windowSeconds}::int) THEN 1
          ELSE request_rate_limits.hits + 1
        END,
        window_started_at = CASE
          WHEN request_rate_limits.window_started_at < NOW() - MAKE_INTERVAL(secs => ${rule.windowSeconds}::int) THEN NOW()
          ELSE request_rate_limits.window_started_at
        END
      RETURNING hits` as { hits: number }[]
    return (rows[0]?.hits ?? 0) > rule.limit
  } catch {
    console.error(JSON.stringify({ level: 'warn', service: 'onboarding', event: 'rate_limit_unavailable', scope: rule.scope }))
    return false
  }
}
