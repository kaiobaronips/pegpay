import { Link } from "react-router";

import PaginaInterna from "@/components/PaginaInterna";
import { whatsappUrl } from "@/lib/contato";

type Topico = {
  numero: string;
  titulo: string;
  texto: string;
  itens: string[];
  cta: string;
  mensagem: string;
};

const TOPICOS: Topico[] = [
  {
    numero: "01",
    titulo: "Empréstimo com cartão de crédito",
    texto:
      "Você usa o limite disponível no seu cartão para pegar o dinheiro, sem precisar ter o nome limpo. O valor depende do limite que você tem livre.",
    itens: [
      "Não exige nome limpo",
      "Depende do limite disponível no cartão",
      "Jornada digital, do começo ao fim",
    ],
    cta: "Falar sobre cartão de crédito",
    mensagem: "Olá! Quero saber sobre o empréstimo com cartão de crédito da PegPay.",
  },
  {
    numero: "02",
    titulo: "Empréstimo CLT com desconto em folha",
    texto:
      "Para quem tem carteira assinada: as parcelas são descontadas direto da folha de pagamento. Desconto automático significa menos risco e condições mais competitivas.",
    itens: [
      "Exige vínculo empregatício formal",
      "Parcela descontada em folha",
      "Valor limitado pela margem consignável",
    ],
    cta: "Falar sobre crédito CLT",
    mensagem: "Olá! Quero saber sobre o empréstimo CLT com desconto em folha da PegPay.",
  },
  {
    numero: "03",
    titulo: "Crédito com garantia de veículo ou imóvel",
    texto:
      "Você usa um bem que já é seu como garantia e paga menos juros por isso. O bem fica alienado, mas continua no seu nome e no seu uso durante todo o contrato.",
    itens: [
      "Veículo: de R$ 5 mil a R$ 300 mil, em até 72×",
      "Imóvel: de R$ 50 mil a R$ 500 mil, em até 120×",
      "Taxa a partir de 1,29% a.m. (veículo) e 0,99% a.m. (imóvel)",
    ],
    cta: "Falar sobre crédito com garantia",
    mensagem: "Olá! Quero saber sobre o crédito com garantia da PegPay.",
  },
];

const ATALHOS = [
  {
    titulo: "Simular uma operação",
    texto: "Faça as contas em 2 minutos, sem compromisso e sem consulta que suje seu score.",
    href: "/#simulador",
    interno: false,
  },
  {
    titulo: "Dúvidas frequentes",
    texto: "As perguntas mais comuns sobre taxas, prazos, atraso e contratação.",
    href: "/#duvidas",
    interno: false,
  },
  {
    titulo: "Segurança e golpes",
    texto: "Como identificar um contato falso e o que a PegPay nunca vai pedir de você.",
    href: "/seguranca",
    interno: true,
  },
  {
    titulo: "Privacidade dos seus dados",
    texto: "Quais dados a gente coleta, para que usa e o que você pode exigir da gente.",
    href: "/privacidade",
    interno: true,
  },
];

export default function CentralDeAjuda() {
  return (
    <PaginaInterna
      kicker="Central de ajuda"
      titulo="Resposta direta, sem fila."
      resumo="Escolha o assunto e fale com o time da PegPay pelo WhatsApp oficial. Não temos formulário de cadastro nem robô de telefone — do outro lado tem gente."
      atualizadoEm="agosto de 2026"
    >
      <div className="grid gap-px border-2 border-ink bg-ink md:grid-cols-3">
        {TOPICOS.map((t) => (
          <article key={t.titulo} className="flex flex-col bg-paper p-7 md:p-8">
            <span className="tnum font-archivo text-[13px] font-extrabold text-peg">
              {t.numero}
            </span>
            <h2 className="mt-4 font-archivo text-[22px] font-extrabold leading-tight tracking-[-0.02em]">
              {t.titulo}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{t.texto}</p>
            <ul className="rule-t mt-6 space-y-0">
              {t.itens.map((i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border-b border-ink/10 py-2.5 text-[14px] font-semibold last:border-0"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="mt-[5px] shrink-0">
                    <path d="M0 0h9l3 3v9H0z" fill="#E94E1B" />
                  </svg>
                  {i}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-7">
              <a
                href={whatsappUrl(t.mensagem)}
                target="_blank"
                rel="noreferrer"
                className="block bg-peg px-5 py-3.5 text-center font-archivo text-[15px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
              >
                {t.cta}
              </a>
            </div>
          </article>
        ))}
      </div>

      <h2 className="mt-16 font-archivo text-[30px] font-extrabold leading-tight tracking-[-0.025em] md:text-[38px]">
        Atalhos
      </h2>
      <div className="mt-8 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2">
        {ATALHOS.map((a) =>
          a.interno ? (
            <Link
              key={a.titulo}
              to={a.href}
              className="group flex flex-col bg-paper p-7 transition-colors hover:bg-peg-soft/50 md:p-8"
            >
              <h3 className="font-archivo text-[19px] font-extrabold tracking-[-0.015em]">
                {a.titulo}
              </h3>
              <p className="mt-2 max-w-[42ch] text-[14px] leading-relaxed text-ink/70">{a.texto}</p>
              <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true" className="mt-6">
                <path d="M0 7h28M22 1l7 6-7 6" fill="none" stroke="#E94E1B" strokeWidth="2.5" />
              </svg>
            </Link>
          ) : (
            <a
              key={a.titulo}
              href={a.href}
              className="group flex flex-col bg-paper p-7 transition-colors hover:bg-peg-soft/50 md:p-8"
            >
              <h3 className="font-archivo text-[19px] font-extrabold tracking-[-0.015em]">
                {a.titulo}
              </h3>
              <p className="mt-2 max-w-[42ch] text-[14px] leading-relaxed text-ink/70">{a.texto}</p>
              <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true" className="mt-6">
                <path d="M0 7h28M22 1l7 6-7 6" fill="none" stroke="#E94E1B" strokeWidth="2.5" />
              </svg>
            </a>
          )
        )}
      </div>
    </PaginaInterna>
  );
}
