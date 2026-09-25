import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { config } from './config.js'
import { nextReply, messageText } from './flow.js'
import { conversationKey } from './identity.js'
import { beginInboundEvent, conversationFor, finishInboundEvent, saveConversation } from './store.js'
import { isWatiInboundMessage } from './types.js'
import { sendInteractiveButtons, sendInteractiveList, sendSessionText } from './wati.js'

const MAX_BODY_BYTES = 1_000_000

function respond(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
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

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)
  if (request.method === 'GET' && url.pathname === '/health') return respond(response, 200, { status: 'ok' })

  if (request.method !== 'POST' || url.pathname !== '/webhooks/wati') return respond(response, 404, { error: 'not_found' })
  if (url.searchParams.get('secret') !== config.webhookSecret) return respond(response, 401, { error: 'unauthorized' })

  let inboundEventId: string | undefined
  try {
    const payload = await readJson(request)
    if (!isWatiInboundMessage(payload)) return respond(response, 400, { error: 'invalid_payload' })
    // A WATI usa eventTypes diferentes para texto, botões e respostas de listas.
    // O conteúdo da resposta é validado abaixo; não descartamos a escolha só pelo eventType.
    if (payload.owner || !payload.waId) return respond(response, 200, { ignored: true })

    const key = conversationKey(payload.waId)
    if (payload.id && !(await beginInboundEvent(payload.id, key))) return respond(response, 200, { duplicate: true })
    inboundEventId = payload.id

    const text = messageText(payload)
    if (!text) return respond(response, 200, { ignored: true })
    for (const message of await nextReply(key, text, payload.senderName)) {
      if (typeof message === 'string') await sendSessionText(payload.waId, message)
      else if (message.kind === 'buttons') await sendInteractiveButtons(payload.waId, message.body, message.buttons)
      else await sendInteractiveList(payload.waId, message.body, message.buttonText, message.rows)
    }
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
})

server.listen(config.port, () => console.info(`PegPay WhatsApp bot pronto na porta ${config.port}`))
