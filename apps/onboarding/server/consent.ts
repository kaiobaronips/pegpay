/**
 * Versão única do consentimento, compartilhada por quem grava e por quem exibe o aviso.
 * Era constante duplicada em `draft.ts` e `submit.ts`, e já divergia do texto mostrado ao
 * cliente — registrar consentimento para uma versão que o titular nunca viu invalida o registro.
 */
export const CONSENT_VERSION = '2026-09-24-privacy-v2'
