import Reveal from "@/components/Reveal";
import { WHATSAPP_URL } from "@/lib/contato";

const BENEFICIOS = [
  "Peça crédito quando precisar, sem repetir cadastro",
  "Acompanhe contrato, parcelas e vencimentos",
  "Envie documentos direto pela câmera",
  "Receba novas ofertas conforme constrói histórico",
];

/**
 * Bloco de download do app na home. O app ainda não existe (ADR-003), então
 * o CTA leva ao WhatsApp e os selos das lojas ficam no rodapé, sem link.
 */
export default function AppBlock() {
  return (
    <section className="bg-peg text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <div>
              <p className="label text-paper/70">App PegPay</p>
              <h2 className="mt-4 max-w-[16ch] font-archivo text-[38px] font-extrabold leading-[1.0] tracking-[-0.04em] md:text-[56px]">
                Leve a gente no bolso.
              </h2>
              <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-paper/85">
                No app você pede crédito, acompanha tudo e volta a pedir quando
                precisar — sem começar do zero de novo.
              </p>

              <ul className="mt-8 space-y-0">
                {BENEFICIOS.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 border-b border-paper/20 py-3 text-[15px] font-semibold last:border-0"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="mt-[6px] shrink-0">
                      <path d="M0 0h9l3 3v9H0z" fill="#F3F2F2" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-ink px-8 py-4 font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-black"
                >
                  Quero meu crédito
                </a>
                <a
                  href="#app"
                  className="border-2 border-paper px-8 py-4 font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-paper hover:text-peg"
                >
                  Baixar o app
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <figure className="offset-shadow border-2 border-ink">
              <img
                src="/images/tela.png"
                alt="Telas do aplicativo PegPay"
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
