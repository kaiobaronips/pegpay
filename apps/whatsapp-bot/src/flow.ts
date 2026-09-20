import { config } from './config.js'
import { conversationFor, createOnboardingLink, saveConversation } from './store.js'
import type { WatiInboundMessage } from './types.js'

const menu = `Olá! Você está falando com a PegPay.\n\nEscolha uma opção:\n1. Solicitar crédito\n2. Acompanhar proposta\n3. Tirar uma dúvida\n\nUsaremos esta conversa apenas para atender sua solicitação. Segurança: nunca pedimos senha, CVV, token, código SMS ou código do WhatsApp.`

function clean(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
}

function parseAmount(text: string): number | null {
  const normalized = text.replace(/\s|R\$/gi, '').replace(/\./g, '').replace(',', '.')
  const value = Number(normalized)
  if (!Number.isFinite(value) || value <= 0 || value > 1_000_000) return null
  return Math.round(value * 100)
}

function parseInstallments(text: string): number | null {
  const value = Number(text.trim())
  if (!Number.isInteger(value) || value < 1 || value > 48) return null
  return value
}

export function messageText(payload: WatiInboundMessage): string {
  return payload.text ?? payload.buttonReply?.text ?? payload.interactiveButtonReply?.title ?? payload.listReply?.title ?? ''
}

export async function nextReply(key: string, rawText: string): Promise<string> {
  const conversation = await conversationFor(key)
  const text = clean(rawText)
  let reply: string

  if (['menu', 'inicio', 'início', 'oi', 'ola', 'olá'].includes(text)) {
    conversation.state = 'MENU'
    reply = menu
    await saveConversation(key, conversation)
    return reply
  }

  switch (conversation.state) {
    case 'MENU':
      if (text === '1' || text.includes('solicitar') || text.includes('credito')) {
        conversation.state = 'CARD_CONFIRMATION'
        reply = 'Para seguir, confirme: o cartão de crédito está no seu nome e possui limite disponível?\n\nResponda SIM ou NÃO.\n\nNão envie foto do cartão, número, CVV ou senha por aqui.'
        break
      }
      if (text === '2' || text.includes('acompanhar')) reply = 'Para acompanhar sua proposta, escreva para contato@pegpay.com.br ou ligue para (11) 99216-6696.'
      else if (text === '3' || text.includes('duvida') || text.includes('dúvida')) reply = 'Para dúvidas sobre propostas, fale com contato@pegpay.com.br. Para valores e recebimentos: administrativo@pegpay.com.br. Reclamações: sac@pegpay.com.br.'
      else reply = menu
      break

    case 'CARD_CONFIRMATION':
      if (text === 'sim') {
        conversation.state = 'AMOUNT'
        reply = 'Qual valor você pretende solicitar? Envie apenas o valor em reais, por exemplo: 1500.'
        break
      }
      if (text === 'nao' || text === 'não') {
        conversation.state = 'MENU'
        reply = 'Este produto exige cartão de crédito próprio com limite disponível. Quando estiver pronto, envie MENU para ver as opções.'
        break
      }
      reply = 'Responda SIM se o cartão está no seu nome e possui limite disponível, ou NÃO para voltar ao menu.'
      break

    case 'AMOUNT': {
      const amountCents = parseAmount(rawText)
      if (!amountCents) reply = 'Não consegui entender o valor. Envie somente números, por exemplo: 1500.'
      else {
        conversation.amountCents = amountCents
        conversation.state = 'INSTALLMENTS'
        reply = 'Em quantas parcelas você gostaria de simular? Envie um número de 1 a 48. As condições finais dependem da análise.'
      }
      break
    }

    case 'INSTALLMENTS': {
      const installments = parseInstallments(rawText)
      if (!installments) reply = 'Informe a quantidade de parcelas com um número de 1 a 48.'
      else {
        conversation.installments = installments
        conversation.state = 'ONBOARDING'
        const destination = await createOnboardingLink(key, config.cadastroUrl, conversation.amountCents, installments)
        reply = destination.url
          ? `Recebemos sua pré-solicitação. Agora conclua o cadastro seguro pelo link individual:\n${destination.url}\n\nO link expira em 1 hora. Não o compartilhe. A análise e as condições finais dependem da documentação e da aprovação.`
          : `Sua proposta ${destination.protocol} já foi recebida e está em processamento. Para acompanhamento, fale com contato@pegpay.com.br.`
      }
      break
    }

    case 'ONBOARDING': {
      const destination = await createOnboardingLink(key, config.cadastroUrl, conversation.amountCents, conversation.installments)
      reply = destination.url
        ? `Para continuar sua solicitação, use este novo link individual e seguro:\n${destination.url}\n\nO link expira em 1 hora. Não o compartilhe. Se precisar de ajuda, fale com contato@pegpay.com.br ou (11) 99216-6696.`
        : `Sua proposta ${destination.protocol} já foi recebida e está em processamento. Não é necessário enviar outro cadastro. Para acompanhamento, fale com contato@pegpay.com.br.`
      break
    }
  }

  await saveConversation(key, conversation)
  return reply
}
