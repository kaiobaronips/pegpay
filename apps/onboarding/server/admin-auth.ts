import type { IncomingMessage, ServerResponse } from 'node:http'
import { sha256 } from './crypto.js'
import { sql } from './db.js'
import { cookie } from './http.js'

const COOKIE_NAME = 'pegpay_admin_session'

export async function requireAdmin(request: IncomingMessage): Promise<string | null> {
  const token = cookie(request, COOKIE_NAME)
  if (!token) return null
  const rows = await sql`SELECT email FROM admin_sessions
    WHERE token_hash = ${sha256(token)} AND expires_at > NOW() AND revoked_at IS NULL
    LIMIT 1` as { email: string }[]
  return rows[0]?.email ?? null
}

export function setAdminCookie(response: ServerResponse, token: string): void {
  response.setHeader('set-cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`)
}

export function clearAdminCookie(response: ServerResponse): void {
  response.setHeader('set-cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`)
}
