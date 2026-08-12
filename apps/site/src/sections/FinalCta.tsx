import Reveal from "@/components/Reveal";
import { APP_ANCORA, WHATSAPP_URL } from "@/lib/contato";

export default function FinalCta() {
  return (
    <section className="waves-ink text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="font-archivo text-[44px] font-extrabold leading-[1.0] tracking-[-0.04em] md:text-[64px]">
                Chega de ouvir não.
                <br />
                <span className="text-peg">Peg o seu crédito.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-relaxed text-paper/70">
                Fale com a gente pelo WhatsApp. Sem compromisso, sem fila e sem
                formulário interminável — do outro lado tem gente de verdade.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-peg px-9 py-4 font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
                >
                  Entrar em contato
                </a>
                <a
                  href={APP_ANCORA}
                  className="border-2 border-paper/40 px-9 py-4 font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  Baixar o app
                </a>
              </div>
              <p className="label mt-5 text-paper/45">Resposta em até 1 dia útil</p>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <figure className="border-2 border-paper/25">
              <img
                src="/images/cta.jpg"
                alt="Gráfico de barras laranja subindo com pilhas de moedas douradas sobre fundo escuro"
                loading="lazy"
                className="block w-full"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
