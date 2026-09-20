import type { ServerResponse } from 'node:http'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { audit, proposalByToken, sql } from '../../server/db.js'
import { apiError, json, readJson, requestId, type ApiRequest } from '../../server/http.js'
import { isDocumentKind } from '../../server/validation.js'

interface UploadPayload { token: string; kind: string }

function parsePayload(value: string | null): UploadPayload | null {
  if (!value) return null
  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const candidate = parsed as Record<string, unknown>
    if (typeof candidate.token !== 'string' || candidate.token.length > 128 || !isDocumentKind(candidate.kind)) return null
    return { token: candidate.token, kind: candidate.kind }
  } catch {
    return null
  }
}

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'POST') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  try {
    const body = await readJson(request, 65_536) as HandleUploadBody
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = parsePayload(clientPayload)
        if (!payload) throw new Error('INVALID_UPLOAD_PAYLOAD')
        const proposal = await proposalByToken(payload.token)
        if (!proposal || proposal.status !== 'DRAFT') throw new Error('PROPOSAL_NOT_AVAILABLE')
        const recent = await sql`SELECT COUNT(*)::int AS count FROM proposal_audit_log
          WHERE proposal_id = ${proposal.id} AND event_type = 'UPLOAD_TOKEN_ISSUED'
            AND occurred_at > NOW() - INTERVAL '1 hour'` as { count: number }[]
        if ((recent[0]?.count ?? 0) >= 12) throw new Error('UPLOAD_LIMIT_REACHED')
        const expectedPrefix = `proposals/${proposal.id}/${payload.kind.toLowerCase()}/`
        if (!pathname.startsWith(expectedPrefix) || pathname.length > 300) throw new Error('INVALID_PATHNAME')
        await audit(proposal.id, 'UPLOAD_TOKEN_ISSUED', 'CUSTOMER')
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maximumSizeInBytes: 4 * 1024 * 1024,
          validUntil: Date.now() + 5 * 60 * 1000,
          addRandomSuffix: true,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({ proposalId: proposal.id, kind: payload.kind }),
        }
      },
      onUploadCompleted: async () => undefined,
    })
    return json(response, 200, result)
  } catch {
    console.error(JSON.stringify({ level: 'warn', service: 'onboarding', event: 'upload_token_rejected', requestId: correlationId }))
    return apiError(response, 400, 'UPLOAD_NOT_ALLOWED', 'O envio não foi autorizado. Reabra o link recebido no WhatsApp.', correlationId)
  }
}
