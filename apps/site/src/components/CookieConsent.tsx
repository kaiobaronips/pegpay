import { useState } from "react";
import { Link } from "react-router";

import { aceitarCookies, cookiesJaAceitos } from "@/lib/cookies";

/**
 * Aviso de cookies. Faixa fixa no rodapé, não bloqueia a navegação —
 * o site não tem hoje nenhum cookie não essencial, mas o aviso já fica
 * pronto para quando analytics ou pixel forem adicionados.
 *
 * SPA sem SSR: ler localStorage direto no initializer do useState é seguro
 * aqui (não há hidratação de servidor para descasar).
 */
export default function CookieConsent() {
  const [visivel, setVisivel] = useState(() => !cookiesJaAceitos());

  if (!visivel) return null;

  const aceitar = () => {
    aceitarCookies();
    setVisivel(false);
  };

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t-2 border-ink bg-paper px-5 py-5 shadow-[0_-4px_0_0_rgba(32,30,29,0.15)] md:px-8"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[70ch] text-[14px] leading-relaxed text-ink/75">
          Usamos cookies para o site funcionar direito e entender como você o
          usa. Ao continuar navegando, você concorda com isso — os detalhes
          estão na nossa{" "}
          <Link
            to="/privacidade"
            className="font-semibold text-peg-deep underline underline-offset-4 hover:text-peg"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={aceitar}
          className="w-full shrink-0 whitespace-nowrap bg-peg px-7 py-3 text-center font-archivo text-[15px] font-extrabold text-paper transition-colors hover:bg-peg-dark md:w-auto"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
