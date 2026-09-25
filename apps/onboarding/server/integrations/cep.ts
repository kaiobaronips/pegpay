export interface PostalAddress {
  street: string
  district: string
  city: string
  state: string
}

/**
 * Fronteira do fornecedor de CEP. O ViaCEP é gratuito e não contratado — sem SLA, sem DPA e
 * sem ninguém a acionar se sair do ar. Manter a consulta atrás de uma interface faz a troca
 * por um fornecedor contratado ser a substituição de um arquivo, sem tocar no endpoint nem no
 * formulário, como manda o CLAUDE.md para integração externa.
 */
export interface CepProvider {
  readonly name: string
  /** Devolve `null` quando o CEP não existe; lança quando o fornecedor falha. */
  lookup(cep: string): Promise<PostalAddress | null>
}

interface ViaCepResponse {
  erro?: boolean | string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

export const viaCepProvider: CepProvider = {
  name: 'viacep',
  async lookup(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(5_000),
      redirect: 'error',
    })
    if (!response.ok) throw new Error('CEP_PROVIDER_UNAVAILABLE')
    const payload: unknown = await response.json()
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('CEP_PROVIDER_INVALID_RESPONSE')
    const address = payload as ViaCepResponse
    // O ViaCEP sinaliza CEP inexistente com `erro`, que já veio como boolean e como string.
    if (address.erro || !address.localidade || !address.uf) return null
    return {
      street: address.logradouro?.trim() ?? '',
      district: address.bairro?.trim() ?? '',
      city: address.localidade.trim(),
      state: address.uf.trim().toUpperCase(),
    }
  },
}
