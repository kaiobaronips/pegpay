/**
 * Espelho da constante do servidor (`server/consent.ts`). O front não importa do servidor para
 * não arrastar `config` e suas variáveis de ambiente para o bundle; um teste garante que as duas
 * não divirjam, porque registrar consentimento para uma versão que o titular nunca viu invalida
 * o registro.
 */
export const CONSENT_VERSION = '2026-09-24-privacy-v2'
