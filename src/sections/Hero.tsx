import Reveal from "@/components/Reveal";

const STATS = [
  { value: "1,29%", label: "a.m. · taxa a partir de" },
  { value: "R$ 500 mil", label: "libere com garantia" },
  { value: "2 dias úteis", label: "para o dinheiro cair" },
  { value: "R$ 0", label: "de tarifa de abertura" },
];

export default function Hero() {
  return (
    <section id="topo" className="bg-paper pt-[68px]">
      <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-12 md:px-8 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Reveal>
              <p className="label mb-5 inline-block bg-ink px-3 py-1.5 text-paper">
                Crédito com garantia · veículo ou imóvel
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-archivo text-[52px] font-extrabold leading-[0.98] tracking-[-0.045em] md:text-[76px]">
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
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-[46ch] text-[17px] leading-relaxed text-ink/75">
                Use o patrimônio que você já tem para pegar dinheiro mais barato.
                Simulação em 2 minutos, parcela fixa do começo ao fim e o custo
                sempre na cara — nunca em letra miúda.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#simulador"
                  className="offset-shadow-sm bg-peg px-8 py-4 font-archivo text-[16px] font-extrabold text-paper transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-peg-dark hover:shadow-[4px_4px_0_0_var(--ink)]"
                >
                  Simule em 2 minutos
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
            <figure className="offset-shadow border-2 border-ink">
              <img
                src="/images/hero.jpg"
                alt="Ilustração isométrica: carro, moedas, cartão e gráfico de crescimento sobre fundo laranja PegPay"
                className="block h-auto w-full"
                loading="eager"
              />
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
