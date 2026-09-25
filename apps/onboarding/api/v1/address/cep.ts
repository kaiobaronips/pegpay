import type { ServerResponse } from 'node:http'
import { proposalByToken, sql } from '../../../server/db.js'
import { viaCepProvider, type PostalAddress } from '../../../server/integrations/cep.js'
import { apiError, json, proposalToken, requestId, type ApiRequest } from '../../../server/http.js'
import { isRateLimited, rateLimits } from '../../../server/rate-limit.js'

const provider = viaCepProvider

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)

  try {
    // Sem esta guarda o endpoint é um proxy aberto para o fornecedor, hospedado no domínio da
    // PegPay: qualquer um consulta por ele anonimamente, gastando a reputação e o IP da empresa
    // perante um serviço de terceiro. Todo endpoint de cliente aqui resolve a proposta pelo cookie.
    const proposal = await proposalByToken(proposalToken(request))
    if (!proposal) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada ou link expirado.', correlationId)

    const url = new URL(request.url ?? '/', `https://${request.headers.host ?? 'cadastro.pegpay.com.br'}`)
    const cep = (url.searchParams.get('cep') ?? '').replace(/\D/g, '')
    if (cep.length !== 8) return apiError(response, 400, 'INVALID_CEP', 'Informe um CEP válido com 8 números.', correlationId)

    // O cache vem antes do rate limit: acerto de cache não toca o fornecedor, então não há
    // motivo para racionar. O teto protege as chamadas de saída, não a leitura local.
    const cached = await sql`SELECT street, district, city, state FROM cep_cache WHERE cep = ${cep} LIMIT 1` as PostalAddress[]
    if (cached[0]) return json(response, 200, { success: true, data: cached[0] })

    // Balde por proposta, não por IP: o público compartilha IP em CGNAT de operadora móvel.
    if (await isRateLimited(request, rateLimits.cepLookup, proposal.id)) {
      return apiError(response, 429, 'TOO_MANY_REQUESTS', 'Muitas consultas de CEP. Aguarde alguns minutos.', correlationId)
    }

    const address = await provider.lookup(cep)
    if (!address) return apiError(response, 404, 'CEP_NOT_FOUND', 'CEP não encontrado. Confira os números e tente novamente.', correlationId)

    // Falha ao gravar o cache não pode derrubar uma consulta que deu certo.
    try {
      await sql`INSERT INTO cep_cache (cep, street, district, city, state, provider, fetched_at)
        VALUES (${cep}, ${address.street}, ${address.district}, ${address.city}, ${address.state}, ${provider.name}, NOW())
        ON CONFLICT (cep) DO NOTHING`
    } catch {
      console.error(JSON.stringify({ level: 'warn', service: 'onboarding', event: 'cep_cache_write_failed', requestId: correlationId }))
    }

    return json(response, 200, { success: true, data: address })
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'cep_lookup_failed', requestId: correlationId, provider: provider.name, reason: error instanceof Error ? error.message : 'UNKNOWN' }))
    return apiError(response, 502, 'CEP_LOOKUP_FAILED', 'Não foi possível consultar o CEP agora. Você pode preencher o endereço manualmente.', correlationId)
  }
}
