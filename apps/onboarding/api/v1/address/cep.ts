import type { ServerResponse } from 'node:http'
import { proposalByToken } from '../../../server/db.js'
import { apiError, json, proposalToken, requestId, type ApiRequest } from '../../../server/http.js'
import { isRateLimited, rateLimits } from '../../../server/rate-limit.js'

interface ViaCepResponse {
  erro?: boolean
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  const correlationId = requestId(request)
  if (request.method !== 'GET') return apiError(response, 405, 'METHOD_NOT_ALLOWED', 'Método não permitido.', correlationId)

  try {
    // Sem esta guarda o endpoint é um proxy aberto para o ViaCEP hospedado no domínio da
    // PegPay: qualquer um consulta por ele anonimamente, gastando a reputação e o IP da
    // empresa perante um serviço de terceiro. Todo endpoint de cliente aqui resolve a
    // proposta pelo cookie; este não fazia.
    const proposal = await proposalByToken(proposalToken(request))
    if (!proposal) return apiError(response, 404, 'PROPOSAL_NOT_FOUND', 'Proposta não encontrada ou link expirado.', correlationId)

    // Balde por proposta, não por IP: o público compartilha IP em CGNAT de operadora móvel.
    if (await isRateLimited(request, rateLimits.cepLookup, proposal.id)) {
      return apiError(response, 429, 'TOO_MANY_REQUESTS', 'Muitas consultas de CEP. Aguarde alguns minutos.', correlationId)
    }

    const url = new URL(request.url ?? '/', `https://${request.headers.host ?? 'cadastro.pegpay.com.br'}`)
    const cep = (url.searchParams.get('cep') ?? '').replace(/\D/g, '')
    if (cep.length !== 8) return apiError(response, 400, 'INVALID_CEP', 'Informe um CEP válido com 8 números.', correlationId)

    const providerResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(5_000),
      redirect: 'error',
    })
    if (!providerResponse.ok) throw new Error('CEP_PROVIDER_UNAVAILABLE')

    const address = await providerResponse.json() as ViaCepResponse
    if (address.erro || !address.localidade || !address.uf) {
      return apiError(response, 404, 'CEP_NOT_FOUND', 'CEP não encontrado. Confira os números e tente novamente.', correlationId)
    }

    return json(response, 200, {
      success: true,
      data: {
        street: address.logradouro?.trim() ?? '',
        district: address.bairro?.trim() ?? '',
        city: address.localidade.trim(),
        state: address.uf.trim().toUpperCase(),
      },
    })
  } catch {
    console.error(JSON.stringify({ level: 'error', service: 'onboarding', event: 'cep_lookup_failed', requestId: correlationId }))
    return apiError(response, 502, 'CEP_LOOKUP_FAILED', 'Não foi possível consultar o CEP agora. Você pode preencher o endereço manualmente.', correlationId)
  }
}
