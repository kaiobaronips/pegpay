/**
 * Consentimento de cookies — categorias granulares (necessários, analytics,
 * marketing), no padrão do Google Consent Mode v2.
 *
 * Versionado: se a política mudar de um jeito que exija novo aceite, basta
 * incrementar CONSENT_VERSAO — quem já decidiu na versão antiga volta a ver
 * o aviso.
 */
export type CategoriaConsentimento = "analytics" | "marketing";

export type PreferenciasConsentimento = {
  necessarios: true;
  analytics: boolean;
  marketing: boolean;
};

const CHAVE = "pegpay:consentimento-cookies";
const VERSAO = 2;

type Armazenado = {
  versao: number;
  preferencias: PreferenciasConsentimento;
};

const PADRAO_NAO_DECIDIDO: PreferenciasConsentimento = {
  necessarios: true,
  analytics: false,
  marketing: false,
};

export function consentimentoJaDecidido(): boolean {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return false;
    const dados = JSON.parse(bruto) as Armazenado;
    return dados.versao === VERSAO;
  } catch {
    // Storage bloqueado (modo privado restritivo, JSON corrompido etc.) —
    // trata como não decidido; o aviso reaparece, o que é seguro por padrão.
    return false;
  }
}

export function obterPreferencias(): PreferenciasConsentimento {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return PADRAO_NAO_DECIDIDO;
    const dados = JSON.parse(bruto) as Armazenado;
    if (dados.versao !== VERSAO) return PADRAO_NAO_DECIDIDO;
    return dados.preferencias;
  } catch {
    return PADRAO_NAO_DECIDIDO;
  }
}

export function salvarPreferencias(preferencias: Omit<PreferenciasConsentimento, "necessarios">) {
  const dados: Armazenado = {
    versao: VERSAO,
    preferencias: { necessarios: true, ...preferencias },
  };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // Sem storage disponível, não há o que persistir — o aviso volta a
    // aparecer na próxima visita, o que é aceitável.
  }
}

export function aceitarTodos() {
  salvarPreferencias({ analytics: true, marketing: true });
}

export function rejeitarNaoEssenciais() {
  salvarPreferencias({ analytics: false, marketing: false });
}
