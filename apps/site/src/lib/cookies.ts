/**
 * Consentimento de cookies.
 *
 * Versionado: se a política mudar de um jeito que exija novo aceite, basta
 * incrementar COOKIES_VERSAO — quem já aceitou a versão antiga volta a ver
 * o aviso.
 */
const CHAVE = "pegpay:cookies-aceitos";
const VERSAO = 1;

export function cookiesJaAceitos(): boolean {
  try {
    return localStorage.getItem(CHAVE) === String(VERSAO);
  } catch {
    // Storage bloqueado (modo privado restritivo, etc.) — trata como não
    // aceito ainda; o aviso reaparece, o que é seguro por padrão.
    return false;
  }
}

export function aceitarCookies() {
  try {
    localStorage.setItem(CHAVE, String(VERSAO));
  } catch {
    // Sem storage disponível, não há o que persistir — o aviso volta a
    // aparecer na próxima visita, o que é aceitável.
  }
}
