import { config } from '../config.js'

export interface HCredBank { idBanco: string; nome: string; codigo: string; ispb: string }
export interface HCredTable { tipo: string; tabela: string }
export interface HCredSimulation { prazo: string; parcela: string; limite?: string; valorFinanciado?: string }

export class HCredIntegrationError extends Error {
  constructor(public readonly code: 'DISABLED' | 'MISCONFIGURED' | 'UPSTREAM' | 'INVALID_RESPONSE', message: string) {
    super(message)
  }
}

let cachedToken: { value: string; expiresAt: number } | undefined

function assertSandboxConfiguration(): void {
  if (!config.hcred.enabled) throw new HCredIntegrationError('DISABLED', 'Integração H Cred ainda não foi habilitada.')
  let base: URL
  try { base = new URL(config.hcred.apiBaseUrl) } catch { throw new HCredIntegrationError('MISCONFIGURED', 'URL sandbox da H Cred inválida.') }
  if (base.protocol !== 'https:' || base.hostname !== 'sandbox.hcred.com.br' || base.pathname.replace(/\/$/, '') !== '/v3') throw new HCredIntegrationError('MISCONFIGURED', 'A integração só pode operar no sandbox nesta etapa.')
  if (!config.hcred.username || !config.hcred.apiKey) throw new HCredIntegrationError('MISCONFIGURED', 'Credenciais sandbox da H Cred não configuradas.')
}

async function jsonRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${config.hcred.apiBaseUrl}${path}`, { ...init, redirect: 'error', signal: AbortSignal.timeout(10_000) })
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) throw new HCredIntegrationError('UPSTREAM', `H Cred respondeu HTTP ${response.status}.`)
  if (!body || typeof body !== 'object') throw new HCredIntegrationError('INVALID_RESPONSE', 'Resposta inválida da H Cred.')
  return body as T
}

async function accessToken(): Promise<string> {
  assertSandboxConfiguration()
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value
  const response = await jsonRequest<{ status?: unknown; token?: unknown; expira_em?: unknown }>('/auth/', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ usuario: config.hcred.username, api_key: config.hcred.apiKey }),
  })
  if (response.status !== 'sucesso' || typeof response.token !== 'string' || typeof response.expira_em !== 'number') throw new HCredIntegrationError('INVALID_RESPONSE', 'Token sandbox inválido retornado pela H Cred.')
  cachedToken = { value: response.token, expiresAt: Date.now() + response.expira_em * 1_000 }
  return cachedToken.value
}

async function authenticated<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await accessToken()
  return jsonRequest<T>(path, { ...init, headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json', ...(init?.headers ?? {}) } })
}

function results(value: unknown): unknown[] {
  if (!value || typeof value !== 'object' || !Array.isArray((value as Record<string, unknown>).resultado)) throw new HCredIntegrationError('INVALID_RESPONSE', 'Catálogo inválido retornado pela H Cred.')
  return (value as Record<string, unknown>).resultado as unknown[]
}

let catalogCache: { value: { banks: HCredBank[]; tables: HCredTable[] }; expiresAt: number } | undefined

export async function hcredCatalog(): Promise<{ banks: HCredBank[]; tables: HCredTable[] }> {
  if (catalogCache && catalogCache.expiresAt > Date.now()) return catalogCache.value
  const [banksResponse, tablesResponse] = await Promise.all([authenticated<unknown>('/bancos/lista/'), authenticated<unknown>('/tabelas/lista/')])
  const banks = results(banksResponse).filter((item): item is HCredBank => Boolean(item && typeof item === 'object' && typeof (item as HCredBank).idBanco === 'string' && typeof (item as HCredBank).nome === 'string'))
  const tables = results(tablesResponse).filter((item): item is HCredTable => Boolean(item && typeof item === 'object' && typeof (item as HCredTable).tipo === 'string' && typeof (item as HCredTable).tabela === 'string'))
  catalogCache = { value: { banks, tables }, expiresAt: Date.now() + 5 * 60_000 }
  return catalogCache.value
}

export async function hcredSimulate(input: { type: string; table: string; amountCents?: number; limitCents?: number }): Promise<HCredSimulation[]> {
  if ((!input.amountCents && !input.limitCents) || (input.amountCents && input.limitCents)) throw new HCredIntegrationError('INVALID_RESPONSE', 'Informe somente valor solicitado ou limite.')
  const payload = input.amountCents ? { tipo: input.type, tabela: input.table, valorSolicitado: input.amountCents / 100 } : { tipo: input.type, tabela: input.table, limite: (input.limitCents as number) / 100 }
  const response = await authenticated<unknown>('/simular/', { method: 'POST', body: JSON.stringify(payload) })
  return results(response).filter((item): item is HCredSimulation => Boolean(item && typeof item === 'object' && typeof (item as HCredSimulation).prazo === 'string' && typeof (item as HCredSimulation).parcela === 'string'))
}
