import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import Logo from "@/components/Logo";
import { WHATSAPP_URL } from "@/lib/contato";

const NAV = [
  { anchor: "#simulador", label: "Simulador" },
  { anchor: "#como-funciona", label: "Como funciona" },
  { anchor: "#garantias", label: "Garantias" },
  { anchor: "#duvidas", label: "Dúvidas" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const naHome = pathname === "/";

  /** Nas páginas internas as âncoras precisam voltar para a home. */
  const href = (anchor: string) => (naHome ? anchor : `/${anchor}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-paper/95 backdrop-blur-sm transition-shadow rule-b ${
        scrolled ? "shadow-[0_2px_0_0_var(--ink)]" : ""
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {NAV.map((item) => (
            <a
              key={item.anchor}
              href={href(item.anchor)}
              className="label whitespace-nowrap text-ink/70 transition-colors hover:text-peg"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden whitespace-nowrap bg-peg px-5 py-2.5 font-archivo text-[14px] font-extrabold leading-none text-paper transition-colors hover:bg-peg-dark sm:inline-block"
          >
            Entrar em contato
          </a>
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] border-2 border-ink lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            <span className={`h-[2px] w-5 bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-[2px] w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-[2px] w-5 bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Menu móvel */}
      <div className={`faq-panel border-ink bg-paper lg:hidden ${open ? "open border-t-2" : ""}`}>
        <div>
          <nav className="flex flex-col px-5 py-4" aria-label="Menu móvel">
            {NAV.map((item) => (
              <a
                key={item.anchor}
                href={href(item.anchor)}
                onClick={() => setOpen(false)}
                className="border-b border-ink/10 py-3 font-archivo text-lg font-extrabold last:border-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 bg-peg px-5 py-3 text-center font-archivo font-extrabold text-paper"
            >
              Entrar em contato
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
