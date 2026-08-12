import Reveal from "@/components/Reveal";
import { WHATSAPP_URL } from "@/lib/contato";

// ADR-003: nenhuma comparação de taxa. Os pilares falam de experiência,
// não de condição comercial.
const PILARES = [
  {
    titulo: "Quem foi negado no banco costuma conseguir aqui",
    texto:
      "A gente olha além do score. Limite no cartão, carteira assinada ou um bem no seu nome contam a seu favor — e mudam a resposta.",
  },
  {
    titulo: "Parcela fixa do começo ao fim",
    texto:
      "A parcela que você combina é a que você paga até a última. Sem reajuste escondido, sem surpresa no meio do contrato.",
  },
  {
    titulo: "Do outro lado tem gente",
    texto:
      "Nada de robô de telefone nem formulário sem fim. Você fala com uma pessoa de verdade, que acompanha o seu caso até o dinheiro cair.",
  },
];

export default function Features() {
  return (
    <section className="waves-ink text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="max-w-[20ch] font-archivo text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[54px]">
            Crédito feito para a vida real.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <Reveal delay={80}>
            <div className="flex h-full flex-col gap-8">
              {PILARES.map((p, i) => (
                <div key={p.titulo} className="flex gap-6 border-b-2 border-paper/15 pb-8 last:border-0">
                  <span className="tnum font-archivo text-[22px] font-extrabold text-peg">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-archivo text-[21px] font-extrabold leading-snug tracking-[-0.015em]">
                      {p.titulo}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-paper/65">
                      {p.texto}
                    </p>
                  </div>
                </div>
              ))}

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-block self-start bg-peg px-8 py-4 font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
              >
                Quero meu crédito
              </a>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <figure className="border-2 border-paper/20">
              <img
                src="/images/tela.png"
                alt="Tela do aplicativo PegPay"
                loading="lazy"
                className="block w-full object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
