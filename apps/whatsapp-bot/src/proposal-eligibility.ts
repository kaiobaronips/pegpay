/**
 * Uma proposta viva bloqueia a criação de outra: duas em paralelo confundiriam a análise da
 * instituição parceira e o cliente não saberia qual é a dele.
 *
 * Proposta encerrada não bloqueia. Antes bloqueava, e isso tornava a recompra impossível —
 * quem teve uma proposta aprovada ou recusada nunca mais conseguia abrir outra pelo WhatsApp,
 * justamente o segundo e o terceiro empréstimo que o produto existe para gerar. Recusa também
 * não é permanente: quem não era elegível num mês pode ser no outro.
 */
const IN_FLIGHT = new Set(['RECEIVED', 'UNDER_REVIEW', 'PENDING'])

export function blocksNewProposal(status: string): boolean {
  return IN_FLIGHT.has(status)
}

/** Rascunho é retomado no lugar de gerar outro, para o cliente não perder o que já preencheu. */
export function resumesExisting(status: string): boolean {
  return status === 'DRAFT'
}
