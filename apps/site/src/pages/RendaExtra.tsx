import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Megaphone,
  MessageCircle,
  Share2,
  ShieldCheck,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router";

import { whatsappUrl } from "@/lib/contato";
import { breadcrumbSchema, organizacaoSchema } from "@/lib/schema";
import { useJsonLd, useSeo } from "@/lib/seo";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";

type Etapa = {
  titulo: string;
  texto: string;
  Icone: LucideIcon;
};

const COMO_FUNCIONA: Etapa[] = [
  {
    titulo: "Você entra no programa",
    texto:
      "Fale com o nosso time pelo WhatsApp. A gente apresenta as regras e orienta o seu cadastro.",
    Icone: UserPlus,
  },
  {
    titulo: "Compartilha a PegPay",
    texto:
      "Use somente os materiais oficiais para indicar pessoas da sua rede que estejam buscando crédito.",
    Icone: Share2,
  },
  {
    titulo: "Acompanha as indicações",
    texto:
      "Quando uma indicação se torna contrato, ela pode gerar comissão conforme as regras do programa.",
    Icone: BadgeCheck,
  },
];

const PERFIS: Etapa[] = [
  {
    titulo: "Quem já é cliente",
    texto: "Conhece a experiência da PegPay e quer apresentar a marca para outras pessoas.",
    Icone: Users,
  },
  {
    titulo: "Profissional autônomo",
    texto: "Conversa diariamente com clientes, parceiros e uma rede local de confiança.",
    Icone: MessageCircle,
  },
  {
    titulo: "Criador de conteúdo",
    texto: "Produz conteúdo para uma comunidade e sabe comunicar com responsabilidade.",
    Icone: Megaphone,
  },
  {
    titulo: "Pessoa bem conectada",
    texto: "Tem uma rede ativa e gosta de aproximar pessoas de soluções que podem ajudar.",
    Icone: Share2,
  },
];

const REGRAS = [
  {
    titulo: "Nunca prometa aprovação",
    texto: "Toda solicitação passa por análise. A indicação não garante crédito.",
  },
  {
    titulo: "Nunca informe condições",
    texto: "Taxa, prazo, parcela e CET são apresentados pelos canais oficiais durante a proposta.",
  },
  {
    titulo: "Nunca cobre adiantamento",
    texto: "A PegPay não solicita pagamento antecipado para liberar crédito.",
  },
  {
    titulo: "Use o material oficial",
    texto: "Não altere textos, imagens ou promessas. Em caso de dúvida, fale com o nosso time.",
  },
];

export default function RendaExtra() {
  const { pathname } = useLocation();

  useSeo(
    "Renda extra — PegPay",
    "Conheça o programa de indicação da PegPay, entenda como participar e veja as regras para divulgar crédito com responsabilidade.",
    pathname,
  );
  useJsonLd([organizacaoSchema(), breadcrumbSchema("Renda extra", pathname)]);

  return (
    <div className="min-h-screen bg-paper font-archivo text-ink">
      <Header />

      <main className="overflow-hidden pt-[68px]">
        <section className="border-b-2 border-ink bg-peg">
          <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-14 md:px-8 lg:grid-cols-2 lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 border-2 border-ink bg-mint px-4 py-3 text-sm font-extrabold">
                <Users className="size-5" aria-hidden="true" />
                Programa de indicação
              </div>
              <h1 className="mt-7 max-w-2xl text-balance text-5xl font-extrabold leading-none text-paper sm:text-6xl lg:text-7xl">
                Sua rede pode virar renda extra.
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base font-medium leading-relaxed text-paper/85 md:text-lg">
                Indique a PegPay para quem busca crédito. Se a indicação virar contrato, você
                pode receber comissão conforme as regras do programa.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl(
                    "Olá! Quero ser divulgador da PegPay e saber como funciona o programa de renda extra.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 border-2 border-ink bg-ink px-6 py-4 text-sm font-extrabold text-paper hover:bg-paper hover:text-ink"
                >
                  Quero participar
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </a>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-3 border-2 border-ink bg-paper px-6 py-4 text-sm font-extrabold text-ink hover:bg-cream"
                >
                  Entender o programa
                  <ArrowDownRight className="size-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl pb-5 pr-5">
              <img
                src="/images/renda-extra-hero.png"
                alt="Ilustração de pessoas conectadas por indicações feitas pelo celular"
                width="1448"
                height="1086"
                fetchPriority="high"
                className="offset-shadow aspect-[4/3] w-full border-2 border-ink object-cover"
              />
              <div className="offset-shadow-sm absolute -bottom-1 left-5 border-2 border-ink bg-paper px-4 py-3 sm:left-8">
                <p className="max-w-[24ch] text-pretty text-sm font-extrabold leading-tight">
                  Comissão somente para indicação que se torna contrato.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-ink bg-ink py-3 text-paper" aria-hidden="true">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 overflow-hidden px-5 text-xs font-bold md:px-8">
              <span className="whitespace-nowrap">Você indica</span>
              <span className="text-peg">✦</span>
              <span className="whitespace-nowrap">A PegPay orienta</span>
              <span className="text-peg">✦</span>
              <span className="whitespace-nowrap">O crédito passa por análise</span>
              <span className="hidden text-peg sm:inline">✦</span>
              <span className="hidden whitespace-nowrap sm:inline">O contrato pode gerar comissão</span>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-20 bg-paper py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <h2 className="max-w-xl text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                Três passos. Sem complicar.
              </h2>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-ink/70 lg:justify-self-end">
                Você aproxima as pessoas. A PegPay explica o produto, recebe os documentos e
                conduz a análise pelos canais oficiais.
              </p>
            </div>

            <div className="mt-10 grid gap-px border-2 border-ink bg-ink lg:grid-cols-3">
              {COMO_FUNCIONA.map((etapa, indice) => {
                const Icone = etapa.Icone;
                return (
                  <article key={etapa.titulo} className="flex min-h-80 flex-col bg-paper p-7 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <span className="tnum text-5xl font-extrabold leading-none text-peg">
                        0{indice + 1}
                      </span>
                      <Icone className="size-8" aria-hidden="true" />
                    </div>
                    <div className="mt-auto">
                      <h3 className="max-w-xs text-balance text-2xl font-extrabold leading-tight">
                        {etapa.titulo}
                      </h3>
                      <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-ink/70 md:text-base">
                        {etapa.texto}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y-2 border-ink bg-white">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.82fr_1.18fr]">
            <div className="flex min-h-[520px] flex-col justify-between border-b-2 border-ink bg-ink p-8 text-paper md:p-12 lg:border-b-0 lg:border-r-2">
              <Users className="size-14 text-peg" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-paper/60">Para quem é</p>
                <h2 className="mt-3 max-w-lg text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                  Gente que conhece gente.
                </h2>
                <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-paper/70">
                  Não precisa ser especialista em finanças. Precisa comunicar com clareza,
                  respeitar as regras e encaminhar cada pessoa para o canal certo.
                </p>
              </div>
            </div>

            <div className="grid gap-px bg-ink sm:grid-cols-2">
              {PERFIS.map((perfil) => {
                const Icone = perfil.Icone;
                return (
                  <article key={perfil.titulo} className="flex min-h-64 flex-col bg-paper p-7 md:p-8">
                    <Icone className="size-8 text-peg-deep" aria-hidden="true" />
                    <div className="mt-auto">
                      <h3 className="text-balance text-xl font-extrabold">{perfil.titulo}</h3>
                      <p className="mt-3 text-pretty text-sm leading-relaxed text-ink/65">
                        {perfil.texto}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-paper py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="text-sm font-bold text-peg-deep">Por que funciona</p>
                <h2 className="mt-3 max-w-xl text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                  Confiança indica. Análise decide.
                </h2>
                <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink/70">
                  Uma recomendação pessoal pode abrir uma conversa. Mas toda contratação segue
                  os mesmos critérios de análise, transparência e formalização.
                </p>
              </div>

              <div className="border-2 border-ink bg-white">
                {[
                  ["01", "A indicação aproxima", "Quem recebe uma recomendação de alguém conhecido chega com mais contexto para conversar."],
                  ["02", "O time orienta", "A PegPay apresenta as opções disponíveis e explica cada etapa sem transferir essa responsabilidade ao divulgador."],
                  ["03", "A análise continua obrigatória", "Nenhuma indicação substitui a avaliação de crédito ou representa promessa de aprovação."],
                ].map(([numero, titulo, texto]) => (
                  <div key={numero} className="grid gap-3 border-b-2 border-ink p-6 last:border-b-0 sm:grid-cols-[64px_1fr] md:p-7">
                    <span className="tnum text-2xl font-extrabold text-peg">{numero}</span>
                    <div>
                      <h3 className="text-balance text-xl font-extrabold">{titulo}</h3>
                      <p className="mt-2 text-pretty text-sm leading-relaxed text-ink/65">{texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y-2 border-ink bg-cream py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-bold text-peg-deep">Sobre a comissão</p>
              <h2 className="mt-3 max-w-xl text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                Regra clara antes de começar.
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink/70">
                Valores, critérios de elegibilidade, datas e forma de pagamento são apresentados
                durante o cadastro no programa. Assim, você participa sabendo como funciona.
              </p>
              <a
                href={whatsappUrl(
                  "Olá! Quero conhecer as regras e condições do programa de renda extra da PegPay.",
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-3 border-2 border-ink bg-peg px-6 py-4 text-sm font-extrabold text-paper hover:bg-ink"
              >
                Consultar condições
                <ArrowUpRight className="size-5" aria-hidden="true" />
              </a>
            </div>

            <div className="offset-shadow border-2 border-ink bg-ink p-7 text-paper md:p-10">
              <div className="flex items-center gap-3 border-b-2 border-paper/25 pb-5">
                <ShieldCheck className="size-7 text-mint" aria-hidden="true" />
                <p className="font-extrabold">O que precisa ficar claro</p>
              </div>
              <ul className="mt-6 space-y-5">
                {[
                  "A indicação só pode gerar comissão quando se torna contrato.",
                  "Participar do programa não garante renda ou volume de indicações.",
                  "As condições podem ser atualizadas e são confirmadas no cadastro.",
                  "O pagamento segue os critérios e prazos apresentados pelo time responsável.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-pretty text-sm leading-relaxed text-paper/75 md:text-base">
                    <Check className="mt-0.5 size-5 shrink-0 text-mint" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-ink py-16 text-paper md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col gap-5 border-b-2 border-paper/25 pb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold text-mint">Divulgue com responsabilidade</p>
                <h2 className="mt-3 max-w-2xl text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                  Quatro regras que valem sempre.
                </h2>
              </div>
              <Link
                to="/seguranca"
                className="inline-flex items-center gap-2 self-start text-sm font-bold text-paper underline decoration-paper/40 underline-offset-4 md:self-auto"
              >
                Consulte a página de Segurança
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <div>
              {REGRAS.map((regra, indice) => (
                <article key={regra.titulo} className="grid gap-4 border-b-2 border-paper/25 py-7 md:grid-cols-[80px_0.7fr_1.3fr] md:items-center">
                  <span className="tnum text-2xl font-extrabold text-peg">0{indice + 1}</span>
                  <h3 className="text-balance text-xl font-extrabold md:text-2xl">{regra.titulo}</h3>
                  <p className="max-w-xl text-pretty text-sm leading-relaxed text-paper/65 md:text-base">
                    {regra.texto}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-peg py-14 md:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h2 className="max-w-2xl text-balance text-3xl font-extrabold text-paper md:text-4xl">
                Quer fazer parte do programa?
              </h2>
              <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-paper/80 md:text-base">
                Fale com o nosso time e receba as regras atuais antes de decidir.
              </p>
            </div>
            <a
              href={whatsappUrl(
                "Olá! Quero participar do programa de renda extra da PegPay.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-3 self-start border-2 border-ink bg-paper px-7 py-4 text-sm font-extrabold text-ink hover:bg-ink hover:text-paper md:self-auto"
            >
              Falar com a PegPay
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
