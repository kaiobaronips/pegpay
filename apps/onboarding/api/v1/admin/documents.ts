import type { ServerResponse } from 'node:http'
import { get } from '@vercel/blob'
import { requireAdmin } from '../../../server/admin-auth.js'
import { requestActorHash } from '../../../server/crypto.js'
import { audit, sql } from '../../../server/db.js'
import { apiError, requestId, type ApiRequest } from '../../../server/http.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const adminEmail = await requireAdmin(request)
    if (!adminEmail) return apiError(response, 401, 'UNAUTHORIZED', 'Faça login para continuar.', correlationId)
    const url = new URL(request.url ?? '/', `https://${request.headers.host ?? 'localhost'}`)
    const proposalId = url.searchParams.get('proposalId')
    const kind = url.searchParams.get('kind')
    if (!proposalId || !kind) return apiError(response, 400, 'INVALID_INPUT', 'Documento não informado.', correlationId)
    const rows = await sql`SELECT blob_pathname, content_type FROM proposal_documents
      WHERE proposal_id = ${proposalId} AND kind = ${kind} AND validation_status = 'VALID' LIMIT 1` as { blob_pathname: string; content_type: string }[]
    const document = rows[0]
    if (!document) return apiError(response, 404, 'DOCUMENT_NOT_FOUND', 'Documento não encontrado.', correlationId)
    const result = await get(document.blob_pathname, { access: 'private' })
    if (!result || result.statusCode !== 200) return apiError(response, 404, 'DOCUMENT_NOT_FOUND', 'Documento não encontrado.', correlationId)
    await audit(proposalId, `DOCUMENT_${kind}_VIEWED`, 'ADMIN', requestActorHash(adminEmail))
    response.statusCode = 200
    response.setHeader('content-type', document.content_type)
    response.setHeader('content-disposition', 'attachment')
    response.setHeader('cache-control', 'private, no-store')
    response.setHeader('x-content-type-options', 'nosniff')
    const reader = result.stream.getReader()
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      response.write(Buffer.from(chunk.value))
    }
    response.end()
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'admin_document_failed', requestId: correlationId }))
    if (!response.headersSent) return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível abrir o documento.', correlationId)
    response.end()
  }
}
