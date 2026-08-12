import { Link } from "react-router";

import Reveal from "@/components/Reveal";
import { LISTA_PRODUTOS } from "@/lib/produtos";

/**
 * Grade de produtos da home. Composição inspirada no bloco "Com o Jeitto,
 * você consegue", com a geometria PegPay: canto reto, régua de 2px, sem
 * arredondamento. Nenhuma taxa é exibida (ADR-003).
 */
export default function Produtos() {
  return (
    <section id="para-voce" className="scroll-mt-[68px] bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="max-w-[18ch] font-archivo text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[54px]">
            Com a PegPay,
            <br />
            você consegue.
          </h2>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-ink/70">
            Três caminhos diferentes para o mesmo lugar: dinheiro na sua conta,
            sem burocracia. Escolha o que combina com a sua situação.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px border-2 border-ink bg-ink md:grid-cols-3">
          {LISTA_PRODUTOS.map((p, i) => (
            <Reveal key={p.id} delay={i * 120}>
              <Link
                to={p.slug}
                className="group flex h-full flex-col bg-paper transition-colors hover:bg-peg-soft/40"
              >
                <figure className="overflow-hidden border-b-2 border-ink">
                  <img
                    src={p.imagem}
                    alt={p.imagemAlt}
                    loading="lazy"
                    className="block aspect-[3/2] w-full object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(.7,0,.3,1)] group-hover:scale-[1.04]"
                  />
                </figure>

                <div className="flex flex-1 flex-col p-7 md:p-8">
                  <h3 className="font-archivo text-[24px] font-extrabold leading-tight tracking-[-0.02em]">
                    {p.nomeCurto}
                  </h3>
                  <p className="mt-2 font-archivo text-[15px] font-bold text-peg">
                    {p.chamada}
                  </p>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/70">
                    {p.descricao}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-3 font-archivo text-[15px] font-extrabold text-ink">
                    Saiba mais
                    <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      <path d="M0 7h28M22 1l7 6-7 6" fill="none" stroke="#E94E1B" strokeWidth="2.5" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
