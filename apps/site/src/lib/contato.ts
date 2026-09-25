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
export function whatsappUrl(mensagem = "Olá! Quero falar com a PegPay sobre um empréstimo.") {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export const WHATSAPP_URL = whatsappUrl();

/**
 * Encarregado de dados (DPO) — art. 41 da LGPD. Identidade e canal
 * divulgados publicamente na política de privacidade, conforme exige o
 * art. 41, §1º.
 */
export const DPO_NOME = "Macedo e Macedo Advocacia Especializada";
export const DPO_EMAIL = "privacidade@pegpay.com.br";
export const DPO_EMAIL_URL = `mailto:${DPO_EMAIL}`;

/**
 * Identificação do controlador — art. 9º, I da LGPD. Conferida no comprovante
 * de inscrição da Receita Federal (CNPJ 68.875.695/0001-99, matriz, situação
 * ATIVA desde 31/08/2026), e não no nome fantasia: quem responde juridicamente
 * pelo tratamento é a razão social.
 *
 * Duplicado em `apps/onboarding/src/legal-info.ts`, que serve o portal de
 * cadastro. São deployments separados e ainda não existe pacote compartilhado
 * (ADR-001); ao alterar aqui, alterar lá também.
 */
export const RAZAO_SOCIAL = "PegPay Cred Soluções Ltda";
export const CNPJ = "68.875.695/0001-99";
export const ENDERECO_SEDE =
  "Rua Bom Jesus, 212 — Sala 1904, Andar 19, Juvevê, Curitiba/PR, CEP 80.035-010";

/**
 * Âncora da faixa de download do app, no rodapé.
 * As URLs das lojas ainda não existem — enquanto isso, os botões de "baixar o
 * app" levam o cliente até os selos, em vez de apontar para um destino inválido.
 */
export const APP_ANCORA = "#app";
