import { neon } from '@neondatabase/serverless'
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { config } from './config.js'
import { blocksNewProposal, resumesExisting } from './proposal-eligibility.js'
import type { Conversation, ConversationState } from './types.js'

const conversations = new Map<string, Conversation>()

/**
 * O fallback em memória existe apenas para executar o bot localmente antes de
 * configurar o Neon. Em produção, DATABASE_URL é obrigatório na Vercel.
 */
export async function conversationFor(key: string): Promise<Conversation> {
  if (!config.databaseUrl) return memoryConversationFor(key)

  const sql = neon(config.databaseUrl)
  const rows = await sql`SELECT state, amount_cents, installments, handled_message_ids
    FROM whatsapp_conversations WHERE conversation_key = ${key}` as ConversationRow[]
  const row = rows[0]
  if (!row) return { state: 'MENU', handledMessageIds: new Set() }
  return {
    state: row.state,
    amountCents: row.amount_cents === null ? undefined : Number(row.amount_cents),
    installments: row.installments ?? undefined,
    handledMessageIds: new Set(Array.isArray(row.handled_message_ids) ? row.handled_message_ids.filter((id): id is string => typeof id === 'string') : []),
  }
}

export async function saveConversation(key: string, conversation: Conversation): Promise<void> {
  if (!config.databaseUrl) {
    conversations.set(key, conversation)
    return
  }

  const sql = neon(config.databaseUrl)
  const handledMessageIds = [...conversation.handledMessageIds].slice(-100)
  await sql`INSERT INTO whatsapp_conversations
      (conversation_key, state, amount_cents, installments, handled_message_ids, updated_at)
    VALUES (${key}, ${conversation.state}, ${conversation.amountCents ?? null}, ${conversation.installments ?? null}, ${JSON.stringify(handledMessageIds)}::jsonb, NOW())
    ON CONFLICT (conversation_key) DO UPDATE SET
      state = EXCLUDED.state,
      amount_cents = EXCLUDED.amount_cents,
      installments = EXCLUDED.installments,
      handled_message_ids = EXCLUDED.handled_message_ids,
      updated_at = NOW()`
}

function memoryConversationFor(key: string): Conversation {
  const existing = conversations.get(key)
  if (existing) return existing
  const created: Conversation = { state: 'MENU', handledMessageIds: new Set() }
  conversations.set(key, created)
  return created
}

interface ConversationRow {
  state: ConversationState
  amount_cents: string | number | null
  installments: number | null
  handled_message_ids: unknown
}

export async function beginInboundEvent(providerMessageId: string, key: string): Promise<boolean> {
  if (!config.databaseUrl) return true
  const sql = neon(config.databaseUrl)
  const rows = await sql`INSERT INTO whatsapp_inbound_events
      (provider_message_id, conversation_key, processing_status, attempts, created_at, updated_at)
    VALUES (${providerMessageId}, ${key}, 'processing', 1, NOW(), NOW())
    ON CONFLICT (provider_message_id) DO UPDATE SET
      processing_status = 'processing',
      attempts = whatsapp_inbound_events.attempts + 1,
      updated_at = NOW()
    WHERE whatsapp_inbound_events.processing_status = 'failed'
    RETURNING provider_message_id` as { provider_message_id: string }[]
  return rows.length === 1
}

export async function finishInboundEvent(providerMessageId: string, status: 'completed' | 'failed'): Promise<void> {
  if (!config.databaseUrl) return
  const sql = neon(config.databaseUrl)
  await sql`UPDATE whatsapp_inbound_events
    SET processing_status = ${status}, updated_at = NOW()
    WHERE provider_message_id = ${providerMessageId}`
}

export interface OnboardingDestination { url?: string; status: string; protocol: string }

export async function createOnboardingLink(key: string, cadastroUrl: string, amountCents?: number, installments?: number): Promise<OnboardingDestination> {
  if (!config.databaseUrl) throw new Error('DATABASE_URL é obrigatória para criar uma proposta segura')
  const sql = neon(config.databaseUrl)
  const token = randomBytes(32).toString('base64url')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const existing = await sql`SELECT id, protocol, status FROM credit_proposals
    WHERE conversation_key = ${key}
    ORDER BY created_at DESC LIMIT 1` as { id: string; protocol: string; status: string }[]
  const current = existing[0]
  // Só bloqueia enquanto a proposta está viva: duas propostas simultâneas confundiriam a
  // análise da instituição parceira. Proposta encerrada não bloqueia nada — o app existe
  // para gerar o segundo e o terceiro empréstimo, e recusado hoje pode ser elegível amanhã.
  if (current && blocksNewProposal(current.status)) return { status: current.status, protocol: current.protocol }
  let protocol: string
  // Rascunho é retomado; encerrada nasce outra, porque sobrescrever a linha apagaria a
  // decisão anterior — o que o CLAUDE.md proíbe para proposta e decisão de crédito.
  if (current && resumesExisting(current.status)) {
    await sql`UPDATE credit_proposals SET onboarding_token_hash = ${tokenHash},
      onboarding_expires_at = NOW() + INTERVAL '1 hour', amount_cents = ${amountCents ?? null},
      installments = ${installments ?? null}, updated_at = NOW()
      WHERE id = ${current.id}`
    protocol = current.protocol
  } else {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    protocol = `PP-${date}-${randomBytes(3).toString('hex').toUpperCase()}`
    await sql`INSERT INTO credit_proposals
      (id, protocol, conversation_key, onboarding_token_hash, onboarding_expires_at, amount_cents, installments, status, created_at, updated_at)
      VALUES (${randomUUID()}, ${protocol}, ${key}, ${tokenHash}, NOW() + INTERVAL '1 hour', ${amountCents ?? null}, ${installments ?? null}, 'DRAFT', NOW(), NOW())`
  }
  return { url: `${cadastroUrl}?token=${encodeURIComponent(token)}`, status: 'DRAFT', protocol }
}
