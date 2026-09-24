import type { IncomingMessage, ServerResponse } from 'node:http'
import { randomUUID } from 'node:crypto'

export type ApiRequest = IncomingMessage & { body?: unknown }

export function json(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.setHeader('cache-control', 'no-store')
  response.setHeader('x-content-type-options', 'nosniff')
  response.end(JSON.stringify(body))
}

export function apiError(response: ServerResponse, status: number, code: string, message: string, requestId: string): void {
  json(response, status, { success: false, error: { code, message, requestId } })
}

export function requestId(request: IncomingMessage): string {
  const supplied = request.headers['x-request-id']
  return typeof supplied === 'string' && supplied.length <= 100 ? supplied : randomUUID()
}

export async function readJson(request: ApiRequest, maxBytes = 32_768): Promise<unknown> {
  if (request.body !== undefined) return request.body
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > maxBytes) throw new Error('BODY_TOO_LARGE')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

export const PROPOSAL_COOKIE = 'pegpay_proposal_session'
export const PROPOSAL_MARKER_COOKIE = 'pegpay_has_proposal'

/**
 * O token do cadastro vale como credencial, então o lugar dele é um cookie HttpOnly: fora do
 * alcance de qualquer script e fora do log de acesso. A query só é lida no primeiro acesso,
 * quando o cliente chega pelo link do WhatsApp e ainda não existe cookie.
 *
 * SameSite=Lax, e não Strict, porque o cliente volta da Didit por navegação de outro domínio —
 * com Strict o cookie não acompanharia esse retorno. Lax continua barrando POST de outro site,
 * que é onde mora o risco de CSRF, já que toda operação que muda estado aqui é POST.
 */
export function setProposalCookie(response: ServerResponse, token: string): void {
  response.setHeader('set-cookie', [
    `${PROPOSAL_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`,
    // Marcador legível por script, sem segredo nenhum: só diz que existe sessão, para a página
    // saber se deve tentar reabrir a proposta ou pedir um link novo.
    `${PROPOSAL_MARKER_COOKIE}=1; Path=/; Secure; SameSite=Lax; Max-Age=86400`,
  ])
}

export function clearProposalCookie(response: ServerResponse): void {
  response.setHeader('set-cookie', [
    `${PROPOSAL_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    `${PROPOSAL_MARKER_COOKIE}=; Path=/; Secure; SameSite=Lax; Max-Age=0`,
  ])
}

export function proposalToken(request: IncomingMessage): string {
  const fromCookie = cookie(request, PROPOSAL_COOKIE)
  if (fromCookie && fromCookie.length <= 128) return fromCookie
  const url = new URL(request.url ?? '/', `https://${request.headers.host ?? 'cadastro.pegpay.com.br'}`)
  const supplied = url.searchParams.get('token')?.trim() ?? ''
  return supplied.length <= 128 ? supplied : ''
}

export function clientIp(request: IncomingMessage): string {
  const forwarded = request.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.socket.remoteAddress ?? 'unknown'
}

export function cookie(request: IncomingMessage, name: string): string | undefined {
  const raw = request.headers.cookie
  if (!raw) return undefined
  for (const entry of raw.split(';')) {
    const [key, ...value] = entry.trim().split('=')
    if (key === name) return decodeURIComponent(value.join('='))
  }
  return undefined
}
