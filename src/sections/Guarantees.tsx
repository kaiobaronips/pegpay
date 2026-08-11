import Reveal from "@/components/Reveal";

const GARANTIAS = [
  {
    img: "/images/veiculo.jpg",
    alt: "Ilustração isométrica de carro com escudo e chave sobre fundo laranja",
    chip: "A partir de 1,29% a.m.",
    titulo: "Garantia de veículo",
    texto:
      "Carro, moto ou caminhão — quitado ou financiado. Libere até 70% do valor do bem e continue rodando com ele normalmente.",
    fatos: ["Até 72× para pagar", "Até R$ 300 mil", "Bem continua com você"],
  },
  {
    img: "/images/imovel.jpg",
    alt: "Ilustração isométrica de casa com lupa e pilha de moedas sobre fundo laranja",
    chip: "A partir de 0,99% a.m.",
    titulo: "Garantia de imóvel",
    texto:
      "Casa ou apartamento, residencial ou comercial. Libere até 60% do valor do imóvel com a menor taxa da casa.",
    fatos: ["Até 120× para pagar", "Até R$ 1 milhão", "Alienação, não venda"],
  },
];

export default function Guarantees() {
  return (
    <section id="garantias" className="scroll-mt-[68px] border-t-2 border-ink/15 bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="mt-3 max-w-[22ch] font-archivo text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[56px]">
            O que você já tem
            <br />
            vira o que você precisa.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {GARANTIAS.map((g, i) => (
            <Reveal key={g.titulo} delay={i * 140}>
              <article className="group border-2 border-ink bg-paper">
                <figure className="overflow-hidden border-b-2 border-ink">
                  <img
                    src={g.img}
                    alt={g.alt}
                    loading="lazy"
                    className="block aspect-[3/2] w-full object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(.7,0,.3,1)] group-hover:scale-[1.04]"
                  />
                </figure>
                <div className="p-7 md:p-9">
                  <p className="label inline-block bg-peg px-2.5 py-1 text-paper">{g.chip}</p>
                  <h3 className="mt-4 font-archivo text-[26px] font-extrabold tracking-[-0.02em]">
                    {g.titulo}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{g.texto}</p>
                  <ul className="rule-t mt-6 space-y-0">
                    {g.fatos.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 border-b border-ink/10 py-2.5 text-[14px] font-semibold last:border-0"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                          <path d="M0 0h9l3 3v9H0z" fill="#E94E1B" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
