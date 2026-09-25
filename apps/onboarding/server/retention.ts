import type { ProposalStatus } from './db.js'

/**
 * Prazos definidos com o encarregado e publicados no aviso de privacidade. Ao mudar aqui,
 * mudar `retentionPeriod` em `src/legal-info.ts`: o sistema não pode guardar por mais tempo
 * do que o documento promete ao titular.
 *
 * A LGPD pede o mínimo necessário (arts. 15 e 16), por isso a proposta que nunca virou
 * contrato retém muito menos: guardar cinco anos de dados de quem foi recusado ou desistiu
 * seria retenção excessiva.
 */
export const RETENTION_CONTRACTED_MONTHS = 60
export const RETENTION_UNCONTRACTED_MONTHS = 6

/** Status a partir dos quais a proposta está encerrada e o relógio de retenção começa. */
const closedStatuses = new Set<ProposalStatus>(['APPROVED', 'REJECTED'])

export function isClosed(status: ProposalStatus): boolean {
  return closedStatuses.has(status)
}

/**
 * Meses de retenção a partir do encerramento, ou `null` enquanto a proposta segue viva —
 * uma proposta em análise não tem data de expurgo porque ainda está em uso.
 */
export function retentionMonths(status: ProposalStatus): number | null {
  if (status === 'APPROVED') return RETENTION_CONTRACTED_MONTHS
  if (status === 'REJECTED') return RETENTION_UNCONTRACTED_MONTHS
  return null
}

/** Rascunho que expirou sem envio é abandono: retém como proposta não contratada. */
export const RETENTION_ABANDONED_DRAFT_MONTHS = RETENTION_UNCONTRACTED_MONTHS
