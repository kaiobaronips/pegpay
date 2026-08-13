import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import Logo from "@/components/Logo";
import { WHATSAPP_URL } from "@/lib/contato";
import { LISTA_PRODUTOS } from "@/lib/produtos";

const NAV = [
  { label: "Sobre nós", to: "/sobre-nos" },
  { label: "Renda extra", to: "/renda-extra" },
  { label: "Segurança", to: "/seguranca" },
  { label: "Garantias", to: "/garantias" },
  { label: "Ajuda", to: "/ajuda" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [dropAberto, setDropAberto] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fechar = () => {
    setMenuAberto(false);
    setDropAberto(false);
  };

  // Fecha o dropdown ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!dropAberto) return;
    const onClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropAberto(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropAberto(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropAberto]);

  const ativo = (to: string) => pathname === to;
  const emProdutos = pathname.startsWith("/para-voce");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-paper/95 backdrop-blur-sm transition-shadow rule-b ${
        scrolled ? "shadow-[0_2px_0_0_var(--ink)]" : ""
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center gap-4 px-5 md:px-8">
        {/* Logo e nav agrupados com gap curto — o grupo da direita (CTA +
            hamburger) é empurrado pelo ml-auto abaixo. Antes, os três
            filhos do header dividiam o espaço em justify-between, o que
            afastava a nav do logo mais do que o desejado. */}
        <div className="flex items-center gap-8 xl:gap-10">
          <Logo size={42} wordSize={27} />

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Navegação principal">
            {/* Para você — com subpáginas. Abre no hover (desktop) e no
                clique (toque e teclado). */}
            <div
              className="relative"
              ref={dropRef}
              onMouseEnter={() => setDropAberto(true)}
              onMouseLeave={() => setDropAberto(false)}
            >
              <button
                type="button"
                onClick={() => setDropAberto((v) => !v)}
                aria-expanded={dropAberto}
                aria-haspopup="true"
                // Sem uppercase e sem tracking do token .label (pedido
                // específico do header, não vale para o resto do site que
                // usa .label) — 16px, letter-spacing normal.
                className={`flex items-center gap-1.5 whitespace-nowrap font-semibold text-[16px] transition-colors hover:text-peg ${
                  emProdutos ? "text-peg" : "text-ink/70"
                }`}
              >
              Para você
              <svg
                width="10"
                height="7"
                viewBox="0 0 10 7"
                aria-hidden="true"
                className={`transition-transform ${dropAberto ? "rotate-180" : ""}`}
              >
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>

            {dropAberto && (
              // pt-[18px] mantém o ponteiro dentro do elemento no caminho
              // entre o botão e o painel — sem isso o menu fecha no meio.
              <div className="absolute left-0 top-full w-[320px] pt-[18px]">
                <div className="border-2 border-ink bg-paper shadow-[8px_8px_0_0_var(--ink)]">
                {LISTA_PRODUTOS.map((p) => (
                  <Link
                    key={p.id}
                    to={p.slug}
                    onClick={fechar}
                    className="block border-b-2 border-ink/10 px-5 py-4 transition-colors last:border-0 hover:bg-peg-soft/60"
                  >
                    <span className="block font-archivo text-[15px] font-extrabold tracking-[-0.01em]">
                      {p.nomeCurto}
                    </span>
                    <span className="mt-1 block text-[13px] leading-snug text-ink/60">
                      {p.chamada}
                    </span>
                  </Link>
                ))}
                </div>
              </div>
            )}
          </div>

            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={fechar}
                className={`whitespace-nowrap font-semibold text-[16px] transition-colors hover:text-peg ${
                  ativo(item.to) ? "text-peg" : "text-ink/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden whitespace-nowrap bg-peg px-5 py-2.5 font-archivo text-[16px] font-extrabold leading-none text-paper transition-colors hover:bg-peg-dark sm:inline-block"
          >
            Quero meu crédito
          </a>
          <a
            href="#app"
            className="hidden whitespace-nowrap border-2 border-ink bg-paper px-5 py-2.5 font-archivo text-[16px] font-extrabold leading-none text-ink transition-colors hover:bg-ink hover:text-paper sm:inline-block"
          >
            Baixe e Peg
          </a>
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] border-2 border-ink xl:hidden"
            onClick={() => setMenuAberto((v) => !v)}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
          >
            <span className={`h-[2px] w-5 bg-ink transition-transform ${menuAberto ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-[2px] w-5 bg-ink transition-opacity ${menuAberto ? "opacity-0" : ""}`} />
            <span className={`h-[2px] w-5 bg-ink transition-transform ${menuAberto ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Menu móvel */}
      <div className={`faq-panel border-ink bg-paper xl:hidden ${menuAberto ? "open border-t-2" : ""}`}>
        <div>
          <nav className="flex flex-col px-5 py-4" aria-label="Menu móvel">
            <span className="mt-1 font-semibold text-[16px] text-ink/40">
              Para você
            </span>
            {LISTA_PRODUTOS.map((p) => (
              <Link
                key={p.id}
                to={p.slug}
                onClick={fechar}
                className="border-b border-ink/10 py-3 pl-3 font-archivo text-[17px] font-extrabold"
              >
                {p.nomeCurto}
              </Link>
            ))}

            <span className="mt-5 font-semibold text-[16px] text-ink/40">
              Institucional
            </span>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={fechar}
                className="border-b border-ink/10 py-3 pl-3 font-archivo text-[17px] font-extrabold last:border-0"
              >
                {item.label}
              </Link>
            ))}

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 bg-peg px-5 py-3.5 text-center font-archivo font-extrabold text-paper"
            >
              Quero meu crédito
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
