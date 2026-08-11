import Reveal from "@/components/Reveal";

const STEPS = [
  {
    n: "1",
    titulo: "Simule",
    texto:
      "Diga quanto você quer e o que tem de garantia. 2 minutos, online, sem compromisso e sem consulta que suje seu score.",
  },
  {
    n: "2",
    titulo: "Envie os documentos",
    texto:
      "Tudo digital: foto do documento e do veículo, ou a matrícula do imóvel. A análise leva horas, não semanas.",
  },
  {
    n: "3",
    titulo: "Receba em até 2 dias úteis",
    texto:
      "Assinou o contrato, o dinheiro cai na sua conta por Pix. E o bem continua com você, no seu nome.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-[68px] bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="label text-ink/50">02 · Como funciona</p>
          <h2 className="mt-3 max-w-[20ch] font-archivo text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[56px]">
            Três passos. Nenhuma fila.
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
