/**
 * Canais oficiais de contato da PegPay.
 *
 * O site não possui formulário próprio de cadastro: toda conversão acontece
 * pelo WhatsApp oficial ou pelo download do app.
 */

/** +55 (41) 98860-8752 — número oficial de atendimento. */
export const WHATSAPP_NUMERO = "5541988608752";
export const WHATSAPP_EXIBICAO = "+55 (41) 98860-8752";

/** Monta o link do WhatsApp com uma mensagem inicial já preenchida. */
export function whatsappUrl(mensagem = "Olá! Quero falar com a PegPay sobre crédito.") {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export const WHATSAPP_URL = whatsappUrl();

/**
 * Encarregado de dados (DPO) — art. 41 da LGPD. Identidade e canal
 * divulgados publicamente na política de privacidade, conforme exige o
 * art. 41, §1º.
 */
export const DPO_NOME = "Dr. Clovis Pimenta Junior";
export const DPO_EMAIL = "privacidade@pegpay.com.br";
export const DPO_EMAIL_URL = `mailto:${DPO_EMAIL}`;

/**
 * Âncora da faixa de download do app, no rodapé.
 * As URLs das lojas ainda não existem — enquanto isso, os botões de "baixar o
 * app" levam o cliente até os selos, em vez de apontar para um destino inválido.
 */
export const APP_ANCORA = "#app";
