import { randomUUID } from 'node:crypto'
import type { ServerResponse } from 'node:http'
import { del, get } from '@vercel/blob'
import { audit, proposalByToken, sql } from '../../../server/db.js'
import { apiError, json, readJson, requestId, type ApiRequest } from '../../../server/http.js'
import { isDocumentKind } from '../../../server/validation.js'

function validSignature(bytes: Uint8Array, contentType: string): boolean {
  if (contentType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (contentType === 'image/png') return bytes.slice(0, 8).every((byte, index) => byte === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index])
  if (contentType === 'application/pdf') return Buffer.from(bytes.slice(0, 5)).toString('ascii') === '%PDF-'
  return false
}

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const body = await readJson(request)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return apiError(response, 400, 'INVALID_INPUT', 'Dados de upload inválidos.', correlationId)
    const input = body as Record<string, unknown>
    if (typeof input.token !== 'string' || typeof input.pathname !== 'string' || !isDocumentKind(input.kind)) return apiError(response, 400, 'INVALID_INPUT', 'Dados de upload inválidos.', correlationId)
    const proposal = await proposalByToken(input.token)
    if (!proposal || proposal.status !== 'DRAFT') return apiError(response, 409, 'PROPOSAL_NOT_AVAILABLE', 'Esta proposta não aceita novos arquivos.', correlationId)
    const expectedPrefix = `proposals/${proposal.id}/${input.kind.toLowerCase()}/`
    if (!input.pathname.startsWith(expectedPrefix)) return apiError(response, 403, 'INVALID_DOCUMENT_PATH', 'Arquivo não pertence a esta proposta.', correlationId)

    const result = await get(input.pathname, { access: 'private', useCache: false })
    if (!result || result.statusCode !== 200 || result.blob.size > 4 * 1024 * 1024) return apiError(response, 400, 'INVALID_DOCUMENT', 'Arquivo inválido ou muito grande.', correlationId)
    const reader = result.stream.getReader()
    const signature = new Uint8Array(8)
    let signatureLength = 0
    while (signatureLength < signature.length) {
      const chunk = await reader.read()
      if (chunk.done) break
      const available = Math.min(chunk.value.length, signature.length - signatureLength)
      signature.set(chunk.value.slice(0, available), signatureLength)
      signatureLength += available
    }
    await reader.cancel()
    const bytes = signature.slice(0, signatureLength)
    if (!validSignature(bytes, result.blob.contentType)) {
      await del(input.pathname)
      return apiError(response, 400, 'INVALID_DOCUMENT_CONTENT', 'O conteúdo do arquivo não corresponde ao formato informado.', correlationId)
    }

    const previous = await sql`SELECT blob_pathname FROM proposal_documents WHERE proposal_id = ${proposal.id} AND kind = ${input.kind}` as { blob_pathname: string }[]
    await sql`INSERT INTO proposal_documents
        (id, proposal_id, kind, blob_pathname, content_type, size_bytes, etag, validation_status, created_at)
      VALUES (${randomUUID()}, ${proposal.id}, ${input.kind}, ${input.pathname}, ${result.blob.contentType}, ${result.blob.size}, ${result.blob.etag}, 'VALID', NOW())
      ON CONFLICT (proposal_id, kind) DO UPDATE SET
        blob_pathname = EXCLUDED.blob_pathname,
        content_type = EXCLUDED.content_type,
        size_bytes = EXCLUDED.size_bytes,
        etag = EXCLUDED.etag,
        validation_status = 'VALID',
        created_at = NOW()`
    const oldPath = previous[0]?.blob_pathname
    if (oldPath && oldPath !== input.pathname) await del(oldPath)
    await audit(proposal.id, `DOCUMENT_${input.kind}_FORMAT_ACCEPTED`, 'CUSTOMER')
    return json(response, 200, { success: true, data: { kind: input.kind } })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'confirm_upload_failed', requestId: correlationId }))
    return apiError(response, 500, 'INTERNAL_ERROR', 'Não foi possível validar o documento.', correlationId)
  }
}
