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

/**
 * O token do cadastro vale como credencial. Em query string ele entra no log de acesso da
 * Vercel, no histórico do navegador e em qualquer proxy no caminho, então a leitura preferida
 * é o header. A query segue aceita apenas para o primeiro acesso, que chega pelo link do WhatsApp.
 */
export function proposalToken(request: IncomingMessage): string {
  const header = request.headers['x-proposal-token']
  if (typeof header === 'string' && header.trim() && header.length <= 128) return header.trim()
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
