import Reveal from "@/components/Reveal";

const PILARES = [
  {
    titulo: "Taxa de garantia, não de susto",
    texto:
      "Com um bem lastreando o contrato, o risco cai — e a taxa cai junto. A partir de 1,29% a.m., contra mais de 8% a.m. do crédito pessoal comum.",
  },
  {
    titulo: "Parcela fixa do começo ao fim",
    texto:
      "A parcela que você vê na simulação é a que você paga até a última. Sem reajuste escondido, sem surpresa no boleto.",
  },
  {
    titulo: "Custo sempre visível",
    texto:
      "CET, prazo e garantia aparecem junto do valor — nunca em letra menor depois. Você decide sabendo exatamente quanto custa.",
  },
];

export default function Features() {
  return (
    <section className="waves-ink text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="label text-paper/50">04 · Por que a PegPay</p>
          <h2 className="mt-3 max-w-[20ch] font-archivo text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[56px]">
            Com a PegPay, o patrimônio trabalha por você.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal delay={80}>
            <div className="flex h-full flex-col gap-8">
              {PILARES.map((p, i) => (
                <div key={p.titulo} className="flex gap-6 border-b-2 border-paper/15 pb-8 last:border-0">
                  <span className="tnum font-archivo text-[22px] font-extrabold text-peg">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-archivo text-[21px] font-extrabold tracking-[-0.015em]">
                      {p.titulo}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-paper/65">
                      {p.texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid content-start gap-8">
            <Reveal delay={160}>
              <figure className="border-2 border-paper/25">
                <img
                  src="/images/app.jpg"
                  alt="Mão segurando celular com tela laranja, cercada de gráficos e moedas douradas"
                  loading="lazy"
                  className="block aspect-[3/2] w-full object-cover"
                />
              </figure>
            </Reveal>
            <Reveal delay={240}>
              <figure className="border-2 border-paper/25">
                <img
                  src="/images/analise.jpg"
                  alt="Documentos com lupa, gráfico de barras e símbolo de porcentagem sobre fundo laranja"
                  loading="lazy"
                  className="block aspect-[3/2] w-full object-cover"
                />
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
