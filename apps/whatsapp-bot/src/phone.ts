/**
 * O WhatsApp identifica celular brasileiro de forma inconsistente: fora de São Paulo, muitos
 * números continuam registrados **sem o nono dígito**, mesmo tendo-o na vida real. Confirmado
 * em produção — o cliente digitou `43 98425-4609` e o WATI conhece o contato como
 * `554384254609`, doze dígitos, sem o 9. Enviar a forma errada devolve `validWhatsAppNumber:
 * false` e a notificação some sem o cliente saber.
 *
 * Como não há como descobrir qual forma o WhatsApp guardou sem perguntar a ele, geramos as
 * duas e deixamos quem envia tentar em ordem.
 */
export function whatsappCandidates(digits: string): string[] {
  const clean = digits.replace(/\D/g, '')
  if (!/^55\d{10,11}$/.test(clean)) return clean ? [clean] : []

  const ddd = clean.slice(2, 4)
  const subscriber = clean.slice(4)

  // 9 dígitos começando com 9: existe a variante curta, sem ele.
  if (subscriber.length === 9 && subscriber.startsWith('9')) {
    return [clean, `55${ddd}${subscriber.slice(1)}`]
  }
  // 8 dígitos: existe a variante longa, com o 9 na frente.
  if (subscriber.length === 8) {
    return [clean, `55${ddd}9${subscriber}`]
  }
  return [clean]
}
