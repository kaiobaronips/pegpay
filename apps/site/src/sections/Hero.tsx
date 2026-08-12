import { type ReactNode, useEffect, useState } from "react";

import Reveal from "@/components/Reveal";
import { WHATSAPP_URL } from "@/lib/contato";

type HeroSlide = {
  title: ReactNode;
  description: string;
  imageSrc: string;
  imageAlt: string;
  titleClass?: string;
  descriptionClass?: string;
};

// ADR-003: a home não informa taxa. Os números abaixo são os indicadores
// institucionais oficiais do Blueprint §3 — não invente outros.
const STATS = [
  { value: "412 mil", label: "clientes atendidos" },
  { value: "35%", label: "no primeiro crédito formal" },
  { value: "100%", label: "digital, do início ao fim" },
  { value: "2 dias úteis", label: "para o dinheiro cair" },
];

const HERO_SLIDES: HeroSlide[] = [
  {
    title: (
      <>
        Crédito sem
        <br />
        <span className="relative inline-block text-peg">
          enrolação.
          <svg
            className="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 300 14"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path
              d="M2 10 Q 40 2, 80 8 T 160 8 T 240 8 T 298 6"
              fill="none"
              stroke="#201E1D"
              strokeWidth="4"
            />
          </svg>
        </span>
      </>
    ),
    description:
      "Crédito para quem o banco não enxerga. Três caminhos possíveis, parcela fixa do começo ao fim e gente de verdade do outro lado — nunca um robô de telefone.",
    imageSrc: "/images/hero-credito.jpg",
    // A peça traz texto embutido — o alt precisa carregá-lo para quem usa
    // leitor de tela, além de descrever a cena.
    imageAlt:
      "Ilustração PegPay: uma mão segura um celular de onde saem documentos, uma pasta e moedas, ao lado da frase “Menos papel e sem burocracia, na PegPay o seu crédito é mais rápido”",
  },
  {
    title: (
      <>
        Empréstimo
        <br />
        <span className="inline-block text-ink">rápido no</span>
        <br />
        <span className="relative inline-block text-peg">
          cartão de crédito
          <svg
            className="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 420 14"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path
              d="M2 10 Q 58 2, 112 8 T 220 8 T 328 8 T 418 6"
              fill="none"
              stroke="#201E1D"
              strokeWidth="4"
            />
          </svg>
        </span>
      </>
    ),
    description:
      "Faça seu empréstimo sem precisar ter nome limpo, apenas um cartão de crédito com limite disponível.\nRápido, fácil e seguro.",
    imageSrc: "/images/hero-cartao.jpeg",
    imageAlt:
      "Cartão de crédito PegPay preto com o símbolo e o logotipo da marca, ao lado de moedas de ouro empilhadas",
    titleClass: "text-[42px] md:text-[58px]",
    descriptionClass: "translate-y-2 md:translate-y-3",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section id="topo" className="bg-paper pt-[68px]">
      <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-12 md:px-8 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Reveal delay={80}>
              <div className="relative min-h-[170px] md:min-h-[206px]">
                {HERO_SLIDES.map((slide, index) => (
                  <h1
                    key={slide.imageSrc}
                    aria-hidden={index !== activeSlide}
                    className={`absolute inset-0 font-archivo font-extrabold leading-[0.98] tracking-[-0.045em] transition-all duration-500 ${
                      slide.titleClass ?? "text-[52px] md:text-[76px]"
                    } ${
                      index === activeSlide
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-4 opacity-0"
                    }`}
                  >
                    {slide.title}
                  </h1>
                ))}
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="relative -mt-5 min-h-[108px] md:-mt-4 md:min-h-[84px]">
                {HERO_SLIDES.map((slide, index) => (
                  <p
                    key={slide.description}
                    aria-hidden={index !== activeSlide}
                    className={`absolute inset-0 -translate-y-6 max-w-[46ch] text-[17px] leading-relaxed text-ink/75 transition-all duration-500 md:-translate-y-7 ${
                      slide.descriptionClass ?? ""
                    } ${
                      index === activeSlide
                        ? "opacity-100"
                        : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                  >
                    {slide.description.split("\n").map((line, lineIndex) => (
                      <span key={`${slide.imageSrc}-${lineIndex}`} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={240}>
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
            </Reveal>
          </div>

          <Reveal delay={200}>
            <figure className="offset-shadow relative overflow-hidden border-2 border-ink">
              {HERO_SLIDES.map((slide, index) => (
                <img
                  key={slide.imageSrc}
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  aria-hidden={index !== activeSlide}
                  className={`block h-auto w-full transition-opacity duration-500 ${
                    index === 0 ? "relative" : "absolute inset-0 h-full object-cover"
                  } ${index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ))}
            </figure>
          </Reveal>
        </div>

        {/* Faixa de números — régua de 2px, números tabulares */}
        <Reveal delay={120}>
          <dl className="rule-t mt-16 grid grid-cols-2 gap-x-6 gap-y-8 pt-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="label order-2 mt-1 block text-ink/55">{s.label}</dt>
                <dd className="tnum font-archivo text-[30px] font-extrabold leading-none tracking-[-0.02em] text-peg-deep md:text-[34px]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
