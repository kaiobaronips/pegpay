import { createHmac } from 'node:crypto'
import { config } from './config.js'

/** Evita gravar o número de WhatsApp do cliente em texto puro no banco. */
export function conversationKey(whatsappId: string): string {
  return createHmac('sha256', config.conversationHashSecret).update(whatsappId).digest('hex')
}
