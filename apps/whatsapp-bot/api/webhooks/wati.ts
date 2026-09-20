import type { IncomingMessage, ServerResponse } from 'node:http'
import { config as botConfig } from '../../src/config.js'
import { nextReply, messageText } from '../../src/flow.js'
import { conversationKey } from '../../src/identity.js'
import { beginInboundEvent, conversationFor, finishInboundEvent, saveConversation } from '../../src/store.js'
import { isWatiInboundMessage } from '../../src/types.js'
import { sendSessionText } from '../../src/wati.js'

const MAX_BODY_BYTES = 1_000_000

export const config = { maxDuration: 30 }

function respond(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(body))
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_BYTES) throw new Error('Payload excede o limite')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const url = new URL(request.url ?? '/', `https://${request.headers.host ?? 'localhost'}`)
  if (request.method !== 'POST') return respond(response, 405, { error: 'method_not_allowed' })
  if (url.searchParams.get('secret') !== botConfig.webhookSecret) return respond(response, 401, { error: 'unauthorized' })

  let inboundEventId: string | undefined
  try {
    const payload = await readJson(request)
    if (!isWatiInboundMessage(payload)) return respond(response, 400, { error: 'invalid_payload' })
    if (payload.eventType !== 'message' || payload.owner || !payload.waId) return respond(response, 200, { ignored: true })

    const key = conversationKey(payload.waId)
    if (payload.id && !(await beginInboundEvent(payload.id, key))) return respond(response, 200, { duplicate: true })
    inboundEventId = payload.id

    const text = messageText(payload)
    if (!text) return respond(response, 200, { ignored: true })
    await sendSessionText(payload.waId, await nextReply(key, text))
    if (payload.id) {
      const conversation = await conversationFor(key)
      conversation.handledMessageIds.add(payload.id)
      await saveConversation(key, conversation)
    }
    if (payload.id) await finishInboundEvent(payload.id, 'completed')
    return respond(response, 200, { accepted: true })
  } catch (error) {
    if (inboundEventId) await finishInboundEvent(inboundEventId, 'failed')
    console.error('wati_webhook_error', error instanceof Error ? error.message : 'unknown')
    return respond(response, 500, { error: 'internal_error' })
  }
}
