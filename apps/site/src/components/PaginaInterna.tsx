import { type ReactNode } from "react";
import { useLocation } from "react-router";

import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import { WHATSAPP_URL } from "@/lib/contato";
import { breadcrumbSchema, organizacaoSchema } from "@/lib/schema";
import { useJsonLd, useSeo } from "@/lib/seo";

interface PaginaInternaProps {
  kicker: string;
  titulo: string;
  resumo: string;
  /**
   * Meta description, quando o `resumo` visível passa de ~155 caracteres e
   * seria truncado no resultado de busca. Só existe para o buscador — não
   * altera nada do que o cliente lê na página. Sem isso, cai no `resumo`.
   */
  descricaoSeo?: string;
  /** Só nas páginas com valor jurídico ou de política. */
  atualizadoEm?: string;
  children: ReactNode;
}

/** Casca das páginas internas: mesmo cabeçalho, rodapé e réguas da home. */
export default function PaginaInterna({
  kicker,
  titulo,
  resumo,
  descricaoSeo,
  atualizadoEm,
  children,
}: PaginaInternaProps) {
  const { pathname } = useLocation();
  // O resumo da página costuma ser a melhor meta description: descreve a
  // página em uma frase e já está no tom da marca. Quando ele é longo
  // demais para o buscador, a página passa um `descricaoSeo` mais curto.
  useSeo(`${kicker} — PegPay`, descricaoSeo ?? resumo, pathname);
  // A organização vai junto em toda página interna (sempre com o mesmo
  // `@id`): sem isso, um crawler que caia direto em /seguranca ou
  // /garantias não teria como saber de que empresa a página fala.
  useJsonLd([organizacaoSchema(), breadcrumbSchema(titulo, pathname)]);

  return (
    <div className="min-h-screen bg-paper font-archivo text-ink">
      <Header />
      <main className="pt-[68px]">
        <section className="rule-b bg-paper">
          <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-20">
            <p className="label text-peg">{kicker}</p>
            <h1 className="mt-4 max-w-[18ch] font-archivo text-[42px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[64px]">
              {titulo}
            </h1>
            <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-ink/70">{resumo}</p>
            {atualizadoEm && (
              <p className="label mt-8 text-ink/45">Atualizado em {atualizadoEm}</p>
            )}
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-20">{children}</div>
        </section>

        <section className="waves-ink text-paper">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h2 className="max-w-[20ch] font-archivo text-[30px] font-extrabold leading-[1.05] tracking-[-0.025em] md:text-[38px]">
                Ficou com alguma dúvida?
              </h2>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-paper/70">
                Fale direto com o time no WhatsApp oficial da PegPay. Gente de verdade,
                sem robô de telefone.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 self-start bg-peg px-8 py-4 font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-peg-dark md:self-auto"
            >
              Entrar em contato
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/** Bloco de texto de uma página interna — título com régua e corpo legível. */
export function Bloco({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <article className="rule-t grid gap-4 py-9 first:pt-0 md:grid-cols-[220px_1fr] md:gap-10">
      <div className="flex items-baseline gap-4">
        <span className="tnum font-archivo text-[13px] font-extrabold text-peg">{numero}</span>
        <h2 className="font-archivo text-[21px] font-extrabold leading-tight tracking-[-0.015em]">
          {titulo}
        </h2>
      </div>
      <div className="max-w-[68ch] space-y-4 text-[15px] leading-relaxed text-ink/75">
        {children}
      </div>
    </article>
  );
}

/** Lista com o marcador quadrado da marca. */
export function Lista({ itens }: { itens: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {itens.map((item, i) => (
        <li key={i} className="flex gap-3">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="mt-[6px] shrink-0">
            <path d="M0 0h9l3 3v9H0z" fill="#E94E1B" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
