import { neon } from '@neondatabase/serverless'
import { config } from './config.js'

export const sql = neon(config.databaseUrl)

export type ProposalStatus = 'DRAFT' | 'RECEIVED' | 'UNDER_REVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED'
export type DocumentKind = 'SELFIE_WITH_DOCUMENT' | 'IDENTITY_DOCUMENT_FRONT' | 'IDENTITY_DOCUMENT_BACK'

export interface ProposalRow {
  id: string
  protocol: string
  status: ProposalStatus
  amount_cents: string | number | null
  installments: number | null
  personal_data_ciphertext: string | null
  hcred_proposal_id: string | null
  hcred_status: string | null
  hcred_last_checked_at: string | null
  consented_at: string | null
  submitted_at: string | null
  created_at: string
  updated_at: string
}

export async function proposalByToken(token: string): Promise<ProposalRow | undefined> {
  const { sha256 } = await import('./crypto.js')
  const rows = await sql`SELECT id, protocol, status, amount_cents, installments,
      personal_data_ciphertext, hcred_proposal_id, hcred_status, hcred_last_checked_at,
      consented_at, submitted_at, created_at, updated_at
    FROM credit_proposals WHERE onboarding_token_hash = ${sha256(token)}
      AND onboarding_expires_at > NOW()
    LIMIT 1` as ProposalRow[]
  return rows[0]
}

/**
 * O link nasce com 1 hora, mas o KYC tira o cliente do site e o traz de volta minutos depois.
 * Sem renovar a janela ele retorna da Didit para um link morto e perde o cadastro inteiro.
 * Renova apenas para frente e nunca ultrapassa 7 dias desde a criação, para o link não virar eterno.
 */
export async function extendOnboardingWindow(proposalId: string, hours: number): Promise<void> {
  await sql`UPDATE credit_proposals
    SET onboarding_expires_at = LEAST(
          GREATEST(onboarding_expires_at, NOW() + MAKE_INTERVAL(hours => ${hours}::int)),
          created_at + INTERVAL '7 days'
        ),
        updated_at = NOW()
    WHERE id = ${proposalId} AND status = 'DRAFT'`
}

export async function audit(proposalId: string, eventType: string, actorType: 'CUSTOMER' | 'ADMIN' | 'SYSTEM', actorHash?: string): Promise<void> {
  await sql`INSERT INTO proposal_audit_log (proposal_id, event_type, actor_type, actor_id_hash, occurred_at)
    VALUES (${proposalId}, ${eventType}, ${actorType}, ${actorHash ?? null}, NOW())`
}
