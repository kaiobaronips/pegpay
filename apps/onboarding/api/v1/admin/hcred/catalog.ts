import type { ServerResponse } from 'node:http'
import { requireAdmin } from '../../../../server/admin-auth.js'
import { config } from '../../../../server/config.js'
import { hcredCatalog, HCredIntegrationError } from '../../../../server/integrations/hcred.js'
import { apiError, json, requestId, type ApiRequest } from '../../../../server/http.js'

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)
  if (!(await requireAdmin(request))) return apiError(response, 401, 'UNAUTHORIZED', 'Faça login para continuar.', correlationId)
  if (!config.hcred.enabled) return json(response, 200, { success: true, data: { mode: 'disabled', banks: [], tables: [] } })
  try {
    const catalog = await hcredCatalog()
    return json(response, 200, { success: true, data: { mode: 'sandbox', ...catalog } })
  } catch (error) {
    const code = error instanceof HCredIntegrationError ? error.code : 'UPSTREAM'
    return apiError(response, 502, `HCRED_${code}`, 'Não foi possível consultar o catálogo sandbox da H Cred.', correlationId)
  }
}
