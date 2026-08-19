import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link, useLocation } from "react-router";

import Logo from "@/components/Logo";
import { WHATSAPP_URL } from "@/lib/contato";
import { LISTA_PRODUTOS } from "@/lib/produtos";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Sobre nós", to: "/sobre-nos" },
  { label: "Renda extra", to: "/renda-extra" },
  { label: "Segurança", to: "/seguranca" },
  { label: "Ajuda", to: "/ajuda" },
];

const CORES_PRODUTOS = [
  "bg-[#4DFF88] text-ink",
  "bg-peg text-paper",
  "bg-cream text-ink",
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [dropAberto, setDropAberto] = useState(false);
  const [produtoAtivo, setProdutoAtivo] = useState(0);
  const dropRef = useRef<HTMLElement>(null);
  const reduzMovimento = useReducedMotion();
  const { pathname } = useLocation();

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
  const produtoDestaque = LISTA_PRODUTOS[produtoAtivo];

  return (
    <header
      ref={dropRef}
      onMouseLeave={() => setDropAberto(false)}
      className="fixed inset-x-0 top-0 z-50 bg-paper shadow"
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
              onMouseEnter={() => setDropAberto(true)}
            >
              <button
                type="button"
                onClick={() => setDropAberto((v) => !v)}
                aria-expanded={dropAberto}
                aria-haspopup="true"
                aria-controls="menu-para-voce"
                // Sem uppercase e sem tracking do token .label (pedido
                // específico do header, não vale para o resto do site que
                // usa .label) — 15px, letter-spacing normal.
                className={`flex items-center gap-1.5 whitespace-nowrap font-semibold text-[15px] transition-colors hover:text-peg ${
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

          </div>

            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={fechar}
                className={`whitespace-nowrap font-semibold text-[15px] transition-colors hover:text-peg ${
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
            className="hidden whitespace-nowrap bg-peg px-3 py-2 font-archivo text-[14px] font-extrabold leading-none text-paper transition-colors hover:bg-peg-dark sm:inline-block"
          >
            Quero meu crédito
          </a>
          <a
            href="#app"
            className="hidden whitespace-nowrap border-2 border-ink bg-paper px-3 py-2 font-archivo text-[14px] font-extrabold leading-none text-ink transition-colors hover:bg-ink hover:text-paper sm:inline-block"
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

      <AnimatePresence>
        {dropAberto && (
          <motion.div
            id="menu-para-voce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduzMovimento ? 0 : 0.4, ease: "easeOut" }}
            className="absolute inset-x-0 top-full hidden bg-paper shadow-lg xl:block"
          >
          <div className="mx-auto grid max-w-[1200px] gap-10 px-8 py-9 lg:grid-cols-[1.15fr_0.85fr]">
            <nav aria-label="Produtos de crédito">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-3 bg-ink px-4 py-2 text-[13px] font-bold leading-none text-paper">
                    Crédito para você
                    <span className="flex size-4 items-center justify-center border border-paper/70 text-[10px]">
                      $
                    </span>
                  </span>
                  <h2 className="mt-4 max-w-[18ch] text-balance font-archivo text-[28px] font-extrabold leading-tight">
                    Escolha o crédito que combina com o seu momento.
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {LISTA_PRODUTOS.map((produto, index) => (
                  <Link
                    key={produto.id}
                    to={produto.slug}
                    onClick={fechar}
                    onMouseEnter={() => setProdutoAtivo(index)}
                    onFocus={() => setProdutoAtivo(index)}
                    className={cn(
                    "group flex min-h-[104px] items-center gap-4 border-2 border-ink p-3 transition-colors",
                    CORES_PRODUTOS[index],
                    index === 2 && "sm:col-span-2",
                    )}
                  >
                    <img
                      src={produto.imagem}
                      alt=""
                      className="size-20 shrink-0 border-2 border-ink object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block text-balance font-archivo text-[17px] font-extrabold leading-tight">
                        {produto.nomeCurto}
                      </span>
                      <span className="mt-1 block text-pretty text-[13px] leading-snug opacity-75">
                        {produto.chamada}
                      </span>
                      <span className="mt-2 inline-flex items-center gap-2 text-[12px] font-bold">
                        Conhecer
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </nav>

            <div className="border-l-2 border-ink/15 pl-8">
              <img
                src={produtoDestaque.imagem}
                alt={produtoDestaque.imagemAlt}
                className="aspect-[16/8] w-full border-2 border-ink object-cover"
              />
              <p className="mt-5 text-balance font-archivo text-[24px] font-extrabold leading-tight">
                {produtoDestaque.nome}
              </p>
              <p className="mt-2 max-w-[42ch] text-pretty text-[14px] leading-relaxed text-ink/65">
                {produtoDestaque.descricao}
              </p>
              <Link
                to={produtoDestaque.slug}
                onClick={fechar}
                className="mt-5 inline-flex items-center gap-2 bg-ink px-5 py-3 font-archivo text-[14px] font-extrabold text-paper transition-colors hover:bg-peg"
              >
                Saiba mais
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu móvel */}
      <div className={`faq-panel border-ink bg-paper xl:hidden ${menuAberto ? "open border-t-2" : ""}`}>
        <div>
          <nav className="flex flex-col px-5 py-4" aria-label="Menu móvel">
            <span className="mt-1 font-semibold text-[15px] text-ink/40">
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

            <span className="mt-5 font-semibold text-[15px] text-ink/40">
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
