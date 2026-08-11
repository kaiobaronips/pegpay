import { useState } from "react";
import Reveal from "@/components/Reveal";

const PERGUNTAS = [
  {
    p: "O que é crédito com garantia?",
    r: "É um empréstimo lastreado em um bem seu — veículo ou imóvel. Como a garantia reduz o risco da operação, a taxa cai bastante: a partir de 1,29% a.m. na PegPay. O bem fica alienado, mas continua com você, no seu nome, durante todo o contrato.",
  },
  {
    p: "Quanto eu consigo pegar?",
    r: "Com garantia de veículo, de R$ 5 mil a R$ 300 mil — até 70% do valor do bem. Com garantia de imóvel, de R$ 50 mil a R$ 1 milhão — até 60% do valor. A simulação mostra o seu limite estimado em 2 minutos.",
  },
  {
    p: "O meu veículo fica no meu nome?",
    r: "Sim. O bem fica alienado à PegPay apenas como garantia do contrato. Você continua usando normalmente e, quitadas as parcelas, a alienação é removida. Nada de transferência de propriedade.",
  },
  {
    p: "Tem tarifa de abertura ou custo escondido?",
    r: "Não. Tarifa de abertura: R$ 0. O CET — custo efetivo total, com juros, IOF e qualquer tarifa — aparece junto do valor na simulação e no contrato. Custo na cara, nunca em letra miúda.",
  },
  {
    p: "E se eu atrasar uma parcela?",
    r: "A gente negocia antes de cobrar. Você pode remarcar a data ou renegociar o contrato direto no app. A garantia é o último recurso — nosso trabalho é fazer a parcela caber no seu mês desde o começo.",
  },
  {
    p: "A PegPay entra em contato pelas redes sociais?",
    r: "Nunca. Toda a jornada acontece dentro do app ou do site oficial. Desconfie de qualquer contato pedindo pagamento antecipado para liberar crédito: a PegPay nunca faz essa cobrança.",
  },
];

export default function Faq() {
  const [aberta, setAberta] = useState(0);

  return (
    <section id="duvidas" className="scroll-mt-[68px] bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div>
              <p className="label text-ink/50">05 · Dúvidas</p>
              <h2 className="mt-3 font-archivo text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[56px]">
                Ficou com alguma dúvida?
              </h2>
              <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-ink/70">
                As respostas diretas para as perguntas mais comuns. Se restar algo,
                fale com a gente no chat do app — gente de verdade, sem robô de telefone.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border-2 border-ink">
              {PERGUNTAS.map((item, i) => (
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
