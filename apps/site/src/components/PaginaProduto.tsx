import { Link } from "react-router";

import CtaApp from "@/components/CtaApp";
import Reveal from "@/components/Reveal";
import SimuladorProduto from "@/components/SimuladorProduto";
import Faq from "@/sections/Faq";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import { WHATSAPP_URL } from "@/lib/contato";
import { LISTA_PRODUTOS, type Produto } from "@/lib/produtos";
import { useSeo } from "@/lib/seo";

interface PaginaProdutoProps {
  produto: Produto;
  /** Como funciona, específico do produto. */
  passos: { titulo: string; texto: string }[];
  /** Perguntas específicas do produto. */
  perguntas: { p: string; r: string }[];
}

export default function PaginaProduto({ produto, passos, perguntas }: PaginaProdutoProps) {
  useSeo(`${produto.nome} — PegPay`, produto.descricao, produto.slug);

  const outros = LISTA_PRODUTOS.filter((p) => p.id !== produto.id);

  return (
    <div className="min-h-screen bg-paper font-archivo text-ink">
      <Header />
      <main className="pt-[68px]">
        {/* Hero do produto */}
        <section className="rule-b bg-paper">
          <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
              <Reveal>
                <div>
                  <p className="label text-peg">Para você</p>
                  <h1 className="mt-4 max-w-[16ch] font-archivo text-[42px] font-extrabold leading-[1.0] tracking-[-0.04em] md:text-[64px]">
                    {produto.chamada}
                  </h1>
                  <p className="mt-6 max-w-[48ch] text-[17px] leading-relaxed text-ink/75">
                    {produto.descricao}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="offset-shadow-sm bg-peg px-8 py-4 font-archivo text-[16px] font-extrabold text-paper transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-peg-dark hover:shadow-[4px_4px_0_0_var(--ink)]"
                    >
                      Quero meu crédito
                    </a>
                    <a
                      href="#como-funciona"
                      className="border-2 border-ink px-8 py-[14px] font-archivo text-[16px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                      Veja como funciona
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <figure className="offset-shadow overflow-hidden border-2 border-ink">
                  <img
                    src={produto.imagem}
                    alt={produto.imagemAlt}
                    className="block h-auto w-full"
                  />
                </figure>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <ul className="rule-t mt-14 grid gap-x-8 gap-y-4 pt-8 md:grid-cols-3">
                {produto.requisitos.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[15px] font-semibold">
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="mt-[6px] shrink-0">
                      <path d="M0 0h9l3 3v9H0z" fill="#E94E1B" />
                    </svg>
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="scroll-mt-[68px] bg-paper">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-24">
            <Reveal>
              <h2 className="max-w-[18ch] font-archivo text-[36px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[50px]">
                Como funciona
              </h2>
            </Reveal>

            <ol className="mt-12 grid gap-px border-2 border-ink bg-ink md:grid-cols-3">
              {passos.map((s, i) => (
                <Reveal as="li" key={s.titulo} delay={i * 120} className="bg-paper">
                  <div className="flex h-full flex-col p-7 md:p-8">
                    <span className="tnum font-archivo text-[56px] font-extrabold leading-none tracking-[-0.04em] text-peg">
                      {i + 1}
                    </span>
                    <h3 className="mt-5 font-archivo text-[21px] font-extrabold tracking-[-0.015em]">
                      {s.titulo}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{s.texto}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Simulador do produto */}
        <SimuladorProduto produto={produto} />

        {/* Destaques */}
        <section className="bg-paper">
          <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-24">
            <div className="grid gap-10 md:grid-cols-3">
              {produto.destaques.map((d, i) => (
                <Reveal key={d.titulo} delay={i * 120}>
                  <div className="rule-t pt-6">
                    <span className="tnum font-archivo text-[13px] font-extrabold text-peg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-archivo text-[21px] font-extrabold leading-snug tracking-[-0.015em]">
                      {d.titulo}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{d.texto}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CtaApp
          titulo="Peg o seu crédito."
          mensagem={`Olá! Quero saber sobre ${produto.nome.toLowerCase()}.`}
          variante="laranja"
        />

        <Faq
          perguntas={perguntas}
          titulo="Dúvidas sobre este produto"
          texto="As perguntas que mais aparecem sobre esta modalidade. Se a sua não estiver aqui, chama a gente no WhatsApp."
        />

        {/* Outros produtos */}
        <section className="rule-t bg-paper">
          <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-20">
            <h2 className="font-archivo text-[26px] font-extrabold tracking-[-0.02em]">
              Talvez estes também sirvam
            </h2>
            <div className="mt-8 grid gap-px border-2 border-ink bg-ink md:grid-cols-2">
              {outros.map((p) => (
                <Link
                  key={p.id}
                  to={p.slug}
                  className="group flex flex-col bg-paper p-7 transition-colors hover:bg-peg-soft/40 md:p-8"
                >
                  <h3 className="font-archivo text-[21px] font-extrabold tracking-[-0.02em]">
                    {p.nomeCurto}
                  </h3>
                  <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink/70">
                    {p.chamada}
                  </p>
                  <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true" className="mt-6 transition-transform group-hover:translate-x-1">
                    <path d="M0 7h28M22 1l7 6-7 6" fill="none" stroke="#E94E1B" strokeWidth="2.5" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
