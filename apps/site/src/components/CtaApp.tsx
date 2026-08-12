import Reveal from "@/components/Reveal";
import { WHATSAPP_URL, whatsappUrl } from "@/lib/contato";

interface CtaAppProps {
  titulo?: string;
  texto?: string;
  mensagem?: string;
  variante?: "escuro" | "laranja";
}

/**
 * Bloco de conversão. O site inteiro leva a dois lugares: falar com o
 * atendimento ou baixar o app. Como o app ainda não existe (ADR-003), os
 * dois botões apontam para o WhatsApp oficial por enquanto.
 */
export default function CtaApp({
  titulo = "Peg o seu crédito.",
  texto = "Fale com a gente pelo WhatsApp. Do outro lado tem gente de verdade, sem robô de telefone e sem formulário interminável.",
  mensagem,
  variante = "escuro",
}: CtaAppProps) {
  const escuro = variante === "escuro";

  return (
    <section className={escuro ? "waves-ink text-paper" : "bg-peg text-paper"}>
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div>
              <h2 className="max-w-[16ch] font-archivo text-[36px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[50px]">
                {titulo}
              </h2>
              <p
                className={`mt-5 max-w-[46ch] text-[16px] leading-relaxed ${
                  escuro ? "text-paper/70" : "text-paper/85"
                }`}
              >
                {texto}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <a
                href={mensagem ? whatsappUrl(mensagem) : WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className={`px-8 py-4 font-archivo text-[16px] font-extrabold transition-colors ${
                  escuro
                    ? "bg-peg text-paper hover:bg-peg-dark"
                    : "bg-ink text-paper hover:bg-black"
                }`}
              >
                Quero meu crédito
              </a>
              <a
                href="#app"
                className={`border-2 px-8 py-4 font-archivo text-[16px] font-extrabold transition-colors ${
                  escuro
                    ? "border-paper/40 text-paper hover:bg-paper hover:text-ink"
                    : "border-paper text-paper hover:bg-paper hover:text-peg"
                }`}
              >
                Baixar o app
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
