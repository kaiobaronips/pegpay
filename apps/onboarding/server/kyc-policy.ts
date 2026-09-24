import type { DiditVerificationStatus } from './integrations/didit.js'

/**
 * Nenhum status da Didit é terminal do nosso lado: a linha só sai de PENDING ou MANUAL_REVIEW
 * quando um webhook chega. Quem fecha a aba no meio nunca gera esse evento, e uma análise manual
 * pode nunca ser concluída. Sem uma janela de escape o cliente fica sem saída, porque o envio da
 * proposta exige KYC aprovado.
 *
 * As janelas são propositalmente diferentes: 30 minutos de PENDING é abandono provável; uma
 * análise manual leva tempo legítimo e só vira abandono depois de dias.
 */
export const ABANDONED_PENDING_MINUTES = 30
export const ABANDONED_REVIEW_MINUTES = 72 * 60

/**
 * Recusa da Didit é frequentemente honesta no nosso público: foto tremida, reflexo no óculos,
 * documento gasto, celular ruim. Por isso o cliente pode tentar de novo. Mas retry sem teto é
 * document shopping — trocar de documento até um passar — então a enésima recusa para de
 * gerar sessão nova e vai para análise humana.
 */
export const MAX_REJECTED_ATTEMPTS = 3

export type KycGate =
  | { action: 'BLOCK'; status: number; code: string; message: string }
  | { action: 'ESCALATE'; status: number; code: string; message: string }
  | { action: 'START'; restartingAbandoned: boolean }

export interface KycGateInput {
  /** `null` quando ainda não existe verificação para a proposta. */
  status: DiditVerificationStatus | null
  /** Minutos desde a última mudança de status; `null` quando não há verificação. */
  ageMinutes: number | null
  /** Quantas tentativas desta proposta já foram recusadas pela Didit. */
  rejectedAttempts: number
}

export function kycSessionGate({ status, ageMinutes, rejectedAttempts }: KycGateInput): KycGate {
  if (status === null) return { action: 'START', restartingAbandoned: false }

  const age = ageMinutes ?? 0

  // Vale mesmo quando o status atual não é REJECTED: quem já esgotou o limite não recomeça
  // por ter deixado uma sessão nova expirar ou ser abandonada.
  const exhausted = rejectedAttempts >= MAX_REJECTED_ATTEMPTS && status !== 'APPROVED' && status !== 'MANUAL_REVIEW'

  switch (status) {
    case 'APPROVED':
      return { action: 'BLOCK', status: 409, code: 'KYC_ALREADY_APPROVED', message: 'Sua identidade já foi verificada. Continue para enviar a proposta.' }

    case 'MANUAL_REVIEW':
      if (age < ABANDONED_REVIEW_MINUTES) {
        return { action: 'BLOCK', status: 409, code: 'KYC_IN_REVIEW', message: 'Sua verificação está em análise. Aguarde o retorno.' }
      }
      return { action: 'START', restartingAbandoned: true }

    case 'PENDING':
      if (age < ABANDONED_PENDING_MINUTES) {
        return { action: 'BLOCK', status: 409, code: 'KYC_ALREADY_STARTED', message: 'A verificação já foi iniciada. Conclua na aba aberta ou aguarde alguns minutos para recomeçar.' }
      }
      if (exhausted) return escalate()
      return { action: 'START', restartingAbandoned: true }

    // A Didit encerrou a sessão nesses casos; o cliente precisa de uma nova para seguir.
    case 'REJECTED':
    case 'EXPIRED':
      if (exhausted) return escalate()
      return { action: 'START', restartingAbandoned: false }
  }
}

function escalate(): KycGate {
  return {
    action: 'ESCALATE',
    status: 409,
    code: 'KYC_MANUAL_REVIEW_REQUIRED',
    message: 'Não conseguimos confirmar sua identidade automaticamente. Nossa equipe vai analisar e entrar em contato.',
  }
}
