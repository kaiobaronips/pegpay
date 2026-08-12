import { Link } from "react-router";

import PaginaInterna from "@/components/PaginaInterna";
import Faq from "@/sections/Faq";
import { WHATSAPP_EXIBICAO, whatsappUrl } from "@/lib/contato";
import { LISTA_PRODUTOS } from "@/lib/produtos";
import { PERGUNTAS } from "@/lib/faq";

const ATALHOS = [
  {
    titulo: "Segurança e golpes",
    texto: "Como identificar um contato falso e o que a PegPay nunca vai pedir de você.",
    href: "/seguranca",
  },
  {
    titulo: "Regras da garantia",
    texto: "O que significa dar um bem em garantia, o que muda e qual é o risco.",
    href: "/garantias",
  },
  {
    titulo: "Privacidade dos seus dados",
    texto: "Quais dados a gente coleta, para que usa e o que você pode exigir da gente.",
    href: "/privacidade",
  },
  {
    titulo: "Sobre a PegPay",
    texto: "Quem somos, desde quando, e por que a gente faz o que faz.",
    href: "/sobre-nos",
  },
];

export default function Ajuda() {
  return (
    <PaginaInterna
      kicker="Ajuda"
      titulo="Resposta direta, sem fila."
      resumo="Escolha o assunto e fale com o time da PegPay pelo WhatsApp oficial. Não temos formulário de cadastro nem robô de telefone — do outro lado tem gente."
    >
      {/* Produtos */}
      <div className="grid gap-px border-2 border-ink bg-ink md:grid-cols-3">
        {LISTA_PRODUTOS.map((p, i) => (
          <div key={p.id} className="flex flex-col bg-paper p-7 md:p-8">
            <span className="tnum font-archivo text-[13px] font-extrabold text-peg">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-4 font-archivo text-[21px] font-extrabold leading-tight tracking-[-0.02em]">
              {p.nomeCurto}
            </h2>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/70">{p.descricao}</p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                to={p.slug}
                className="border-2 border-ink px-5 py-3 text-center font-archivo text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Ver detalhes
              </Link>
              <a
                href={whatsappUrl(`Olá! Quero saber sobre ${p.nome.toLowerCase()}.`)}
                target="_blank"
                rel="noreferrer"
                className="bg-peg px-5 py-3 text-center font-archivo text-[15px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
              >
                Falar com a gente
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Contato */}
      <div className="mt-16 border-2 border-ink bg-peg-soft/40 p-7 md:p-10">
        <h2 className="font-archivo text-[26px] font-extrabold tracking-[-0.02em]">
          Falar com a PegPay
        </h2>
        <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-ink/75">
          Nosso canal oficial é o WhatsApp. Atendemos em horário comercial e
          respondemos em até 1 dia útil. A PegPay não tem atendimento por
          telefone e nunca entra em contato pelas redes sociais.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <a
            href={whatsappUrl("Olá! Preciso de ajuda com a PegPay.")}
            target="_blank"
            rel="noreferrer"
            className="bg-peg px-8 py-4 font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
          >
            Abrir conversa no WhatsApp
          </a>
          <span className="tnum font-archivo text-[17px] font-bold">{WHATSAPP_EXIBICAO}</span>
        </div>
      </div>

      {/* Atalhos */}
      <h2 className="mt-16 font-archivo text-[28px] font-extrabold tracking-[-0.025em] md:text-[36px]">
        Atalhos
      </h2>
      <div className="mt-8 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2">
        {ATALHOS.map((a) => (
          <Link
            key={a.titulo}
            to={a.href}
            className="group flex flex-col bg-paper p-7 transition-colors hover:bg-peg-soft/50 md:p-8"
          >
            <h3 className="font-archivo text-[19px] font-extrabold tracking-[-0.015em]">
              {a.titulo}
            </h3>
            <p className="mt-2 max-w-[42ch] text-[14px] leading-relaxed text-ink/70">{a.texto}</p>
            <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true" className="mt-6 transition-transform group-hover:translate-x-1">
              <path d="M0 7h28M22 1l7 6-7 6" fill="none" stroke="#E94E1B" strokeWidth="2.5" />
            </svg>
          </Link>
        ))}
      </div>

      {/* FAQ completo — sai da casca para ocupar a largura toda */}
      <div className="-mx-5 mt-4 md:-mx-8">
        <Faq
          perguntas={PERGUNTAS}
          titulo="Perguntas frequentes"
          texto="Todas as dúvidas que mais aparecem, reunidas. Se a sua não estiver aqui, chama a gente no WhatsApp."
          mostrarLinkAjuda={false}
        />
      </div>
    </PaginaInterna>
  );
}
