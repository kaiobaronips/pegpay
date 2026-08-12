import { useState } from "react";
import { Link } from "react-router";

import Reveal from "@/components/Reveal";
import { whatsappUrl } from "@/lib/contato";
import { PERGUNTAS_DESTAQUE, type Pergunta } from "@/lib/faq";

interface FaqProps {
  /** Lista a exibir. Por padrão, só as destacadas (uso na home). */
  perguntas?: Pergunta[];
  titulo?: string;
  texto?: string;
  /** Link para a página de ajuda completa. Some quando já estamos nela. */
  mostrarLinkAjuda?: boolean;
}

export default function Faq({
  perguntas = PERGUNTAS_DESTAQUE,
  titulo = "Ficou com alguma dúvida?",
  texto = "As respostas diretas para as perguntas mais comuns. Se restar algo, fale com a gente no WhatsApp — gente de verdade, sem robô de telefone.",
  mostrarLinkAjuda = true,
}: FaqProps) {
  const [aberta, setAberta] = useState(0);

  return (
    <section id="duvidas" className="scroll-mt-[68px] bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div>
              <h2 className="font-archivo text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[54px]">
                {titulo}
              </h2>
              <p className="mt-5 max-w-[38ch] text-[16px] leading-relaxed text-ink/70">
                {texto}
              </p>

              <a
                href={whatsappUrl("Olá! Tenho uma dúvida sobre os empréstimos da PegPay.")}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-block bg-peg px-7 py-3.5 font-archivo text-[15px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
              >
                Falar com a gente
              </a>

              {mostrarLinkAjuda && (
                <p className="mt-5 text-[15px]">
                  <Link
                    to="/ajuda"
                    className="font-semibold text-peg-deep underline underline-offset-4 hover:text-peg"
                  >
                    Ver todas as perguntas
                  </Link>
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border-2 border-ink">
              {perguntas.map((item, i) => (
                <div key={item.p} className="border-b-2 border-ink last:border-b-0">
                  <button
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-peg-soft/60 md:px-8"
                    onClick={() => setAberta(aberta === i ? -1 : i)}
                    aria-expanded={aberta === i}
                  >
                    <span className="font-archivo text-[17px] font-extrabold tracking-[-0.01em]">
                      {item.p}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className={`shrink-0 transition-transform duration-300 ${
                        aberta === i ? "rotate-45" : ""
                      }`}
                    >
                      <path d="M7 1h2v6h6v2H9v6H7V9H1V7h6z" fill="#E94E1B" />
                    </svg>
                  </button>
                  <div className={`faq-panel ${aberta === i ? "open" : ""}`}>
                    <div>
                      <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink/70 md:px-8">
                        {item.r}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
