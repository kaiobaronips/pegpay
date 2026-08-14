import { useEffect, useState } from "react";
import { Link } from "react-router";

import { aplicarConsentimento } from "@/lib/analytics";
import {
  aceitarTodos,
  consentimentoJaDecidido,
  obterPreferencias,
  rejeitarNaoEssenciais,
  salvarPreferencias,
  type PreferenciasConsentimento,
} from "@/lib/consent";

/**
 * Aviso de cookies com escolha granular — necessários (sempre ativos),
 * analytics e marketing — no padrão do Google Consent Mode v2. Faixa fixa
 * no rodapé, não bloqueia a navegação.
 *
 * "Reabrir preferências" (Footer) e a página de Privacidade despacham o
 * evento pegpay:abrir-preferencias-cookies para reabrir este painel depois
 * do primeiro aceite.
 *
 * SPA sem SSR: ler localStorage direto no initializer do useState é seguro
 * aqui (não há hidratação de servidor para descasar).
 */
export default function CookieConsent() {
  const [visivel, setVisivel] = useState(() => !consentimentoJaDecidido());
  const [personalizando, setPersonalizando] = useState(false);
  const [rascunho, setRascunho] = useState<PreferenciasConsentimento>(() => obterPreferencias());

  useEffect(() => {
    const abrir = () => {
      setRascunho(obterPreferencias());
      setPersonalizando(true);
      setVisivel(true);
    };
    window.addEventListener("pegpay:abrir-preferencias-cookies", abrir);
    return () => window.removeEventListener("pegpay:abrir-preferencias-cookies", abrir);
  }, []);

  if (!visivel) return null;

  const confirmar = (preferencias: PreferenciasConsentimento) => {
    salvarPreferencias(preferencias);
    aplicarConsentimento(preferencias);
    setVisivel(false);
    setPersonalizando(false);
  };

  const aceitar = () => {
    aceitarTodos();
    aplicarConsentimento({ necessarios: true, analytics: true, marketing: true });
    setVisivel(false);
    setPersonalizando(false);
  };

  const rejeitar = () => {
    rejeitarNaoEssenciais();
    aplicarConsentimento({ necessarios: true, analytics: false, marketing: false });
    setVisivel(false);
    setPersonalizando(false);
  };

  return (
    <div
      role="region"
      aria-label="Preferências de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t-2 border-ink bg-paper px-5 py-5 shadow-[0_-4px_0_0_rgba(32,30,29,0.15)] md:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        {!personalizando ? (
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[70ch] text-[14px] leading-relaxed text-ink/75">
              Usamos cookies necessários para o site funcionar e, com sua
              permissão, cookies de análise e de publicidade. Você escolhe o
              que aceita — os detalhes estão na nossa{" "}
              <Link
                to="/privacidade"
                className="font-semibold text-peg-deep underline underline-offset-4 hover:text-peg"
              >
                Política de Privacidade
              </Link>
              .
            </p>
            <div className="flex w-full shrink-0 flex-col gap-2.5 sm:flex-row md:w-auto">
              <button
                type="button"
                onClick={() => setPersonalizando(true)}
                className="whitespace-nowrap border-2 border-ink bg-paper px-6 py-3 text-center font-archivo text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Personalizar
              </button>
              <button
                type="button"
                onClick={rejeitar}
                className="whitespace-nowrap border-2 border-ink bg-paper px-6 py-3 text-center font-archivo text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Rejeitar não essenciais
              </button>
              <button
                type="button"
                onClick={aceitar}
                className="whitespace-nowrap bg-peg px-7 py-3 text-center font-archivo text-[15px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
              >
                Aceitar todos
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-archivo text-[16px] font-extrabold text-ink">
              Preferências de cookies
            </p>
            <div className="mt-4 space-y-3">
              <PreferenciaLinha
                titulo="Necessários"
                descricao="Fazem o site funcionar — navegação, segurança e memória do seu próprio consentimento. Não podem ser desligados."
                checked
                disabled
              />
              <PreferenciaLinha
                titulo="Analytics"
                descricao="Nos ajudam a entender como o site é usado (Google Analytics), para melhorar páginas e conteúdo."
                checked={rascunho.analytics}
                onChange={(v) => setRascunho((r) => ({ ...r, analytics: v }))}
              />
              <PreferenciaLinha
                titulo="Marketing"
                descricao="Usados para medir e personalizar anúncios (Meta Pixel). Sem esse consentimento, não veiculamos publicidade direcionada a você."
                checked={rascunho.marketing}
                onChange={(v) => setRascunho((r) => ({ ...r, marketing: v }))}
              />
            </div>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPersonalizando(false)}
                className="whitespace-nowrap border-2 border-ink bg-paper px-6 py-3 text-center font-archivo text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => confirmar(rascunho)}
                className="whitespace-nowrap bg-peg px-7 py-3 text-center font-archivo text-[15px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
              >
                Salvar preferências
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PreferenciaLinha({
  titulo,
  descricao,
  checked,
  disabled,
  onChange,
}: {
  titulo: string;
  descricao: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (valor: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4 border-2 border-ink/15 p-4">
      <label className="flex shrink-0 items-center pt-0.5">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="size-5 accent-peg disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={titulo}
        />
      </label>
      <div>
        <p className="font-archivo text-[14px] font-extrabold text-ink">{titulo}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink/60">{descricao}</p>
      </div>
    </div>
  );
}
