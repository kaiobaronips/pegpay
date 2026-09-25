import { config } from './config.js'
import { conversationFor, createOnboardingLink, saveConversation } from './store.js'
import type { WatiInboundMessage } from './types.js'

export interface InteractiveButtonsReply { kind: 'buttons'; body: string; buttons: string[] }
export interface InteractiveListReply { kind: 'list'; body: string; buttonText: string; rows: { title: string; description: string }[] }
export type FlowReply = string | InteractiveButtonsReply | InteractiveListReply

const support = 'Se precisar de ajuda, fale com nossa equipe pelo contato@pegpay.com.br ou (11) 99216-6696.'
const choices = (body: string, buttons: string[]): InteractiveButtonsReply => ({ kind: 'buttons', body, buttons })
const productMenu = (): InteractiveListReply => ({
  kind: 'list',
  body: 'Vamos lá!\nPrimeiro eu preciso entender o que você está buscando.\nSelecione abaixo qual dos produtos você busca na PegPay.',
  buttonText: 'Ver produtos',
  rows: [
    { title: 'Empréstimo com Cartão', description: 'Use o limite disponível do cartão.' },
    { title: 'Empréstimo Consignado', description: 'Modalidade para trabalhadores CLT.' },
    { title: 'Empréstimo com Garantia', description: 'Garantia de imóvel ou veículo.' },
  ],
})

function nameOf(raw?: string): string {
  return raw?.replace(/\s+/g, ' ').trim().split(' ')[0]?.slice(0, 30) || ''
}
function greeting(name: string): string {
  return name
    ? `Olá ${name}!\nÉ um prazer falar com você.\nEu sou a Cris, e vou te ajudar na sua jornada para solicitar seu empréstimo da forma mais rápida possível.`
    : 'Olá!\nÉ um prazer falar com você.\nEu sou a Cris, e vou te ajudar na sua jornada para solicitar seu empréstimo da forma mais rápida possível.'
}
function menuReplies(name: string): FlowReply[] { return [greeting(name), productMenu()] }
function clean(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase() }
function vocative(name: string): string { return name ? `${name}, ` : '' }
function parseAmount(text: string): number | null {
  const value = Number(text.replace(/\s|R\$/gi, '').replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(value) && value > 0 && value <= 1_000_000 ? Math.round(value * 100) : null
}
function parseInstallments(text: string): number | null {
  const value = Number(text.trim())
  return Number.isInteger(value) && value >= 2 && value <= 18 ? value : null
}
function isYes(text: string): boolean { return /^(sim|sim entendi|sim tenho)$/.test(text.replace(/[.!?,]/g, '').replace(/\s+/g, ' ').trim()) }
function isNo(text: string): boolean { return /^(nao|nao entendi|nao quero ajuda|nao tenho)$/.test(text.replace(/[.!?,]/g, '').replace(/\s+/g, ' ').trim()) }

export function messageText(payload: WatiInboundMessage): string {
  // Em respostas interativas, a WATI pode enviar text como string vazia e
  // colocar a opção escolhida apenas em listReply/buttonReply.
  return [payload.listReply?.title, payload.interactiveButtonReply?.title, payload.buttonReply?.text, payload.text]
    .find((value) => typeof value === 'string' && value.trim().length > 0) ?? ''
}

export async function nextReply(key: string, rawText: string, rawName?: string): Promise<FlowReply[]> {
  const conversation = await conversationFor(key)
  const text = clean(rawText)
  const name = nameOf(rawName)
  const person = vocative(name)
  let reply: FlowReply | FlowReply[]
  const restart = ['menu', 'inicio'].includes(text) || text.includes('novo atendimento') || text.includes('recomecar') || text.includes('comecar novamente') || text.includes('iniciar atendimento')

  if (restart) {
    conversation.state = 'MENU'; conversation.amountCents = undefined; conversation.installments = undefined
    await saveConversation(key, conversation)
    return menuReplies(name)
  }

  switch (conversation.state) {
    case 'MENU':
      if (text === '2' || text.includes('acompanhar')) reply = support
      else if (text === '3' || text.includes('duvida')) reply = 'Posso ajudar com dúvidas sobre a solicitação. Para valores e recebimentos, escreva para administrativo@pegpay.com.br. Para reclamações, sac@pegpay.com.br.'
      else if (text.includes('consignado') || text.includes('clt')) reply = `Entendi, ${name || 'obrigado'}! Essa modalidade ainda não é iniciada por este canal. ${support}`
      else if (text.includes('garantia') || text.includes('imovel') || text.includes('veiculo')) reply = `Entendi, ${name || 'obrigado'}! Para empréstimo com garantia de imóvel ou veículo, nossa equipe pode orientar você. ${support}`
      else if (text.includes('cartao') || text === '1' || text.includes('solicitar') || text.includes('emprestimo')) {
        conversation.state = 'PRODUCT_ACCEPTANCE'
        reply = [
          `Muito bem${name ? `, ${name}` : ''}!\nEntão você está buscando empréstimo com cartão de crédito.\nEu vou te explicar brevemente como funciona, tudo bem?\n\nEsse empréstimo é feito através do seu cartão de crédito.\nNós utilizamos o limite disponível no seu cartão para liberar o valor solicitado, e você pode parcelar em até 18 vezes diretamente na sua fatura mensal.`,
          choices('Agora me diz,\nfaz sentido para você esse modelo de empréstimo?\nÉ isso o que você estava buscando?', ['Sim', 'Não']),
        ]
      } else reply = menuReplies(name)
      break

    case 'PRODUCT_ACCEPTANCE':
      if (isYes(text)) {
        conversation.state = 'DISCLOSURE_CONFIRMATION'
        reply = [
          'Excelente!\nFico feliz em poder te ajudar nesse momento.\nVamos dar sequência na sua solicitação.',
          `Mas${name ? `, ${name}` : ''}, antes eu preciso te dar algumas informações importantes.\nSou muito responsável com meus clientes, por isso preciso que você dê aceite nas informações a seguir, tudo bem?`,
          'A PegPay não é uma fintech nem um banco digital e não oferece conta, saldo, Pix, cartão próprio ou carteira digital. A PegPay também não mantém a custódia do dinheiro; atua apenas como originadora e correspondente bancária.\nSomos responsáveis apenas pelo cadastro, KYC, proposta e acompanhamento dos nossos clientes. A análise e a decisão são de responsabilidade da instituição financeira parceira.\n\nPara contratar o empréstimo, é necessário já ter um cartão ativo com limite disponível.',
          choices('Você compreendeu nossa atuação,\nposso dar sequência no seu empréstimo?', ['Sim, entendi', 'Não, quero ajuda']),
        ]
      } else if (isNo(text)) { conversation.state = 'MENU'; reply = `Sem problema${name ? `, ${name}` : ''}. ${support}\n\nPara começar novamente, envie MENU.` }
      else reply = choices(`${person}faz sentido para você esse modelo de empréstimo?`, ['Sim', 'Não'])
      break

    case 'DISCLOSURE_CONFIRMATION':
      if (isYes(text)) {
        conversation.state = 'CARD_AVAILABILITY'
        reply = [
          'Estou muito feliz que tenha entendido e aceitado.\nAgora a pergunta mais importante:',
          choices('Você possui um cartão de crédito com limite disponível?', ['Sim, tenho', 'Não tenho']),
        ]
      } else if (isNo(text)) { conversation.state = 'MENU'; reply = `Claro${name ? `, ${name}` : ''}. ${support}\n\nQuando quiser recomeçar, envie MENU.` }
      else reply = choices(`${person}você compreendeu nossa atuação?`, ['Sim, entendi', 'Não, quero ajuda'])
      break

    case 'CARD_CONFIRMATION':
      if (isYes(text)) { conversation.state = 'AMOUNT'; reply = `Perfeito${name ? `, ${name}` : ''}! Qual valor você está precisando?\n\nDigite apenas números, sem vírgula ou pontos.\nExemplo: 1500.` }
      else if (isNo(text)) { conversation.state = 'MENU'; reply = `Para esta solicitação, é necessário um cartão ativo, com limite disponível e em seu nome. Quando estiver pronto${name ? `, ${name}` : ''}, envie MENU para recomeçar.` }
      else reply = choices('O cartão está no seu nome e possui limite disponível?', ['Sim', 'Não'])
      break

    case 'CARD_AVAILABILITY':
      if (isYes(text)) { conversation.state = 'CARD_OWNERSHIP'; reply = choices(`${name ? `${name},\n` : ''}esse cartão está no seu nome?`, ['Sim', 'Não']) }
      else if (isNo(text)) { conversation.state = 'MENU'; reply = `Entendi${name ? `, ${name}` : ''}. Para esta solicitação, é necessário ter um cartão ativo com limite disponível. Quando estiver pronto, envie MENU para recomeçar.` }
      else reply = choices('Você possui um cartão de crédito com limite disponível?', ['Sim, tenho', 'Não tenho'])
      break

    case 'CARD_OWNERSHIP':
      if (isYes(text)) { conversation.state = 'AMOUNT'; reply = `Excelente!\nAgora me diz: qual valor você está precisando${name ? `, ${name}` : ''}?\n\nDigite apenas números, sem vírgula ou pontos.\nExemplo: 1500.` }
      else if (isNo(text)) { conversation.state = 'MENU'; reply = `O cartão precisa estar no seu nome${name ? `, ${name}` : ''}. Não use o cartão de outra pessoa. Quando tiver um cartão elegível, envie MENU para recomeçar.` }
      else reply = choices(`${name ? `${name},\n` : ''}esse cartão está no seu nome?`, ['Sim', 'Não'])
      break

    case 'AMOUNT': {
      const amountCents = parseAmount(rawText)
      if (!amountCents) reply = `${person}não consegui entender o valor. Envie somente números, por exemplo: 1500.`
      else {
        conversation.amountCents = amountCents; conversation.state = 'INSTALLMENTS'
        reply = [
          'Mas antes de continuarmos, preciso te dar um breve aviso de segurança, tudo bem?',
          `${name ? `${name}, ` : ''}nunca envie senha, código recebido por SMS ou WhatsApp, CVV nem foto do cartão para mim aqui na nossa conversa.\nDaqui a pouco irei te direcionar para a plataforma segura da PegPay para informar esses dados.`,
          'Aviso dado, agora vamos seguir.',
          'Em quantas parcelas você quer simular o seu empréstimo?\nDigite um número entre 2 e 18.\n\n*As opções finais da simulação podem variar conforme as condições disponíveis na análise do seu perfil.*',
        ]
      }
      break
    }

    case 'INSTALLMENTS': {
      const installments = parseInstallments(rawText)
      if (!installments) reply = `${person}informe um número inteiro entre 2 e 18 para a quantidade de parcelas.`
      else {
        conversation.installments = installments; conversation.state = 'ONBOARDING'
        const destination = await createOnboardingLink(key, config.cadastroUrl, conversation.amountCents, installments)
        reply = destination.url ? [
          `Ok${name ? `, ${name}` : ''},\nanotei sua pré-solicitação certinho.\n\nAgora vou te enviar o link da nossa plataforma de cadastro seguro.\n\nFique tranquilo: a PegPay utiliza ferramentas de segurança conforme as leis da LGPD para operações financeiras.\n\nSeus dados serão utilizados apenas para a pré-elegibilidade da sua solicitação.`,
          `${name ? `${name}, o` : 'O'}brigado por vir até aqui comigo.\n\nPara finalizar, preencha seu cadastro pelo link individual e seguro:\n${destination.url}\n\n*O link expira em 1 hora.*\nNão compartilhe este link.\nSe precisar de ajuda, fale com um agente pelos canais:\ncontato@pegpay.com.br ou (11) 99216-6696.\n\nPara iniciar um novo atendimento desde o começo, envie MENU.`,
        ] : `Sua proposta ${destination.protocol} já foi recebida e está em processamento. ${support}`
      }
      break
    }

    case 'ONBOARDING': {
      const destination = await createOnboardingLink(key, config.cadastroUrl, conversation.amountCents, conversation.installments)
      reply = destination.url ? `${person}para continuar sua solicitação, use este novo link individual e seguro:\n${destination.url}\n\n*O link expira em 1 hora.*\nNão compartilhe este link.\n${support}\n\nPara iniciar um novo atendimento desde o começo, envie MENU.` : `Sua proposta ${destination.protocol} já foi recebida e está em processamento. ${support}`
      break
    }
  }
  await saveConversation(key, conversation)
  return Array.isArray(reply) ? reply : [reply]
}
