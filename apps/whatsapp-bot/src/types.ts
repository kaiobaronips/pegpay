export type ConversationState =
  | 'MENU'
  | 'CARD_CONFIRMATION' // Estado legado para conversas iniciadas antes da atualização do fluxo.
  | 'PRODUCT_ACCEPTANCE'
  | 'DISCLOSURE_CONFIRMATION'
  | 'CARD_AVAILABILITY'
  | 'CARD_OWNERSHIP'
  | 'AMOUNT'
  | 'INSTALLMENTS'
  | 'ONBOARDING'

export interface Conversation {
  state: ConversationState
  amountCents?: number
  installments?: number
  handledMessageIds: Set<string>
}

export interface WatiInboundMessage {
  id?: string
  eventType?: string
  owner?: boolean
  senderName?: string
  text?: string | null
  waId?: string
  buttonReply?: { text?: string } | null
  interactiveButtonReply?: { title?: string } | null
  listReply?: { title?: string } | null
}

export function isWatiInboundMessage(value: unknown): value is WatiInboundMessage {
  if (!value || typeof value !== 'object') return false
  const payload = value as Record<string, unknown>
  const shortString = (candidate: unknown, max: number) => candidate === undefined || (typeof candidate === 'string' && candidate.length <= max)
  const nullableShortString = (candidate: unknown, max: number) => candidate === undefined || candidate === null || (typeof candidate === 'string' && candidate.length <= max)
  const nestedText = (candidate: unknown, key: 'text' | 'title') => candidate === undefined || candidate === null
    || (typeof candidate === 'object' && !Array.isArray(candidate) && shortString((candidate as Record<string, unknown>)[key], 2_000))
  return shortString(payload.id, 200)
    && shortString(payload.eventType, 80)
    && (payload.owner === undefined || typeof payload.owner === 'boolean')
    && shortString(payload.senderName, 100)
    && nullableShortString(payload.text, 2_000)
    && shortString(payload.waId, 40)
    && nestedText(payload.buttonReply, 'text')
    && nestedText(payload.interactiveButtonReply, 'title')
    && nestedText(payload.listReply, 'title')
}
