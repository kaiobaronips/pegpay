import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";

import Reveal from "@/components/Reveal";

const STEPS = [
  {
    n: "1",
    titulo: "Fale com a gente",
    texto:
      "Chame no WhatsApp ou baixe o app. Diga quanto você precisa e o que tem em mãos: limite no cartão, carteira assinada ou um bem no seu nome.",
  },
  {
    n: "2",
    titulo: "Envie os documentos",
    texto:
      "Tudo digital, pela câmera do celular. A gente analisa e volta com a resposta e as condições completas — sem você sair de casa.",
  },
  {
    n: "3",
    titulo: "Receba em até 2 dias úteis",
    texto:
      "Assinou o contrato, o dinheiro cai na sua conta. E fica tudo registrado no app para quando você precisar de novo.",
  },
];

const SLIDES_PEGCRED = [
  {
    src: "/images/e-grana-card.png",
    alt: "Pessoa usando o app PegPay com saldo disponível de R$ 540,00",
    href: "/para-voce/emprestimo-com-cartao",
    titulo: (
      <>
        <span className="font-medium">peg-</span>
        <span className="font-extrabold">Cred</span>
      </>
    ),
    descricao: "Aquela grana extra mensal pra você usar como quiser. Tudo direto no app.",
  },
  {
    src: "/images/pegcred.png",
    alt: "Imagem do PegCred",
    href: "/para-voce/credito-consignado-clt",
    titulo: "Crédito consignado CLT",
    descricao: "Um fôlego extra 100% online, com parcelas fixas que cabem no seu boldo.",
  },
];

export default function HowItWorks() {
  const cardRef = useRef<HTMLElement>(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [cardVisivel, setCardVisivel] = useState(false);
  const reduzMovimento = useReducedMotion();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCardVisivel(entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!cardVisivel) return;

    const interval = window.setInterval(() => {
      setImagemAtiva((imagem) => (imagem + 1) % SLIDES_PEGCRED.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [cardVisivel]);

  const slide = SLIDES_PEGCRED[imagemAtiva];
  const transition = { duration: reduzMovimento ? 0 : 0.18, ease: "easeOut" as const };

  return (
    <section id="como-funciona" className="scroll-mt-[68px] bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <article ref={cardRef} className="mx-auto w-full rounded-[22px] bg-[#E94E1B] p-4 text-paper md:w-[1100px] md:max-w-full md:p-7">
          <div className="grid gap-7 md:grid-cols-2 md:items-center lg:grid-cols-[458px_minmax(0,1fr)]">
            <div className="relative aspect-[1.27] w-full overflow-hidden rounded-[18px]">
              <AnimatePresence initial={false} mode="sync">
                <motion.img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  initial={{ opacity: 0, x: "100%" }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: "-100%" }}
                  transition={transition}
                  className="absolute inset-0 size-full object-cover"
                  loading="lazy"
                />
              </AnimatePresence>
            </div>

            <div className="flex min-h-full flex-col items-start py-1 md:py-3">
              <div className="relative min-h-[280px] w-full overflow-hidden md:min-h-[292px]">
                <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={slide.src}
                  initial={{ opacity: 0, x: "100%" }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: "-100%" }}
                  transition={transition}
                  className="absolute inset-x-0 top-0 flex w-full flex-col items-start"
                >
                  <span className="inline-flex items-center gap-6 rounded-full bg-[#4DFF88] px-4 py-2 text-[13px] font-bold leading-none text-ink">
                    Crédito
                    <span className="flex size-4 items-center justify-center rounded-full border border-ink/70 text-[10px]">
                      $
                    </span>
                  </span>
                  <h2
                    className={`mt-5 text-balance font-archivo text-[40px] font-extrabold leading-none ${
                      imagemAtiva === 1 ? "md:text-[44px]" : "md:text-[56px]"
                    }`}
                  >
                    {slide.titulo}
                  </h2>
                  <p className="mt-3 max-w-[32ch] text-pretty text-[18px] leading-snug text-paper/85 md:text-[21px]">
                    {slide.descricao}
                  </p>
                  <Link
                    to={slide.href}
                    className="mt-5 inline-flex items-center gap-2 bg-black px-6 py-4 font-archivo text-[15px] font-extrabold text-paper transition-colors hover:bg-ink/80"
                  >
                    Saiba mais
                    <span aria-hidden="true">→</span>
                  </Link>
                </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-3 flex items-center gap-2 self-end" aria-hidden="true">
                {SLIDES_PEGCRED.map((_, index) => (
                  <span
                    key={index}
                    className={`size-3 rounded-full transition-colors ${
                      imagemAtiva === index ? "bg-paper" : "bg-ink/45"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </article>

        <Reveal>
          <h2 className="mt-20 max-w-[20ch] text-balance font-archivo text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] md:mt-28 md:text-[54px]">
            Três passos.
            <br />
            Nenhuma fila.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-px border-2 border-ink bg-ink md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 120} className="bg-paper">
              <div className="flex h-full flex-col p-7 md:p-9">
                <span className="tnum font-archivo text-[64px] font-extrabold leading-none tracking-[-0.04em] text-peg">
                  {s.n}
                </span>
                <h3 className="mt-6 font-archivo text-[22px] font-extrabold tracking-[-0.015em]">
                  {s.titulo}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{s.texto}</p>
                <span className="mt-auto pt-7">
                  <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true">
                    <path d="M0 7h28M22 1l7 6-7 6" fill="none" stroke="#E94E1B" strokeWidth="2.5" />
                  </svg>
                </span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
