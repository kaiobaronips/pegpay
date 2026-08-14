import { useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  BadgeCheck,
  Bolt,
  Eye,
  HandHeart,
  LockKeyhole,
  UsersRound,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocation } from "react-router";

import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/contato";
import { breadcrumbSchema, organizacaoSchema } from "@/lib/schema";
import { useJsonLd, useSeo } from "@/lib/seo";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";

const JEITOS_DE_TRABALHAR = [
  {
    numero: "01",
    titulo: "Tecnologia com gente junto",
    texto: "O app e o site resolvem a burocracia. Quando o caso pede atenção, tem uma pessoa do outro lado.",
  },
  {
    numero: "02",
    titulo: "Análise além do score",
    texto: "A leitura considera mais contexto para entender diferentes realidades financeiras.",
  },
  {
    numero: "03",
    titulo: "Crédito responsável",
    texto: "A oportunidade só faz sentido quando a parcela cabe no mês e a decisão é consciente.",
  },
  {
    numero: "04",
    titulo: "Custo na cara",
    texto: "Condições, taxas e encargos aparecem antes da assinatura, em linguagem direta.",
  },
];

const VALORES = [
  {
    nome: "Acesso",
    texto: "Criar possibilidades financeiras para mais gente, respeitando histórias e momentos diferentes.",
    classe: "bg-[#54F58B] text-ink",
    Icone: HandHeart,
  },
  {
    nome: "Transparência",
    texto: "Informação simples, clara e objetiva para que cada escolha seja feita com confiança.",
    classe: "bg-cream text-ink",
    Icone: Eye,
  },
  {
    nome: "Agilidade",
    texto: "Decidir e executar rápido, sem transformar a vida de quem precisa de crédito em uma fila.",
    classe: "bg-paper text-ink",
    Icone: Bolt,
  },
  {
    nome: "Responsabilidade",
    texto: "Crédito deve gerar oportunidade e autonomia, nunca dependência.",
    classe: "bg-ink text-paper",
    Icone: BadgeCheck,
  },
  {
    nome: "Segurança",
    texto: "Proteger dados, dinheiro, operações e a confiança de quem escolhe a PegPay.",
    classe: "bg-[#FFB4A0] text-ink",
    Icone: LockKeyhole,
  },
  {
    nome: "Proximidade",
    texto: "Falar a língua de quem está do outro lado e tornar o complicado mais fácil de entender.",
    classe: "bg-[#BBD7FF] text-ink",
    Icone: UsersRound,
  },
];

function Entrada({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduzMovimento = useReducedMotion();

  return (
    <motion.div
      initial={reduzMovimento ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduzMovimento ? 0 : 0.18, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RiscoCircular() {
  return (
    <svg
      viewBox="0 0 330 90"
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-3 left-1/2 w-[106%] -translate-x-1/2 text-peg"
    >
      <path
        d="M11 51C46 5 284 1 319 39c29 31-61 48-159 42C51 75-12 62 11 51Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RabiscoEstrela({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 92 92" aria-hidden="true" className={className}>
      <path
        d="m46 4 7 29 27-13-20 24 27 12-30 1 7 29-18-24-18 24 7-29-30-1 27-12L12 20l27 13 7-29Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Página institucional com linguagem editorial inspirada no ritmo do vídeo de referência. */
export default function SobreNos() {
  const { pathname } = useLocation();
  const [valorAtivo, setValorAtivo] = useState(0);
  const reduzMovimento = useReducedMotion();
  const valor = VALORES[valorAtivo];
  const IconeAtivo = valor.Icone;

  useSeo(
    "Sobre nós — PegPay",
    "Desde 2019, a PegPay usa tecnologia e atendimento humano para ampliar o acesso ao crédito de forma simples, transparente e responsável.",
    pathname,
  );
  // Esta página não usa a casca PaginaInterna, então declara o próprio
  // dado estruturado. É a página institucional — junto com a home, é onde
  // a definição completa da organização faz sentido.
  useJsonLd([organizacaoSchema(), breadcrumbSchema("Sobre nós", pathname)]);

  return (
    <div className="min-h-screen bg-paper font-archivo text-ink">
      <Header />

      <main className="overflow-hidden pt-[68px]">
        <section className="relative bg-peg-soft">
          <div className="mx-auto grid min-h-[620px] max-w-[1200px] items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
            <Entrada className="relative z-10">
              <p className="label text-peg-deep">Sobre nós · desde 2019</p>
              <h1 className="mt-5 max-w-[12ch] text-balance font-archivo text-[48px] font-extrabold leading-[0.96] tracking-[-0.045em] sm:text-[60px] lg:text-[72px]">
                Crédito precisa enxergar gente, não só números.
              </h1>
              <p className="mt-7 max-w-[52ch] text-pretty text-[17px] leading-relaxed text-ink/70 md:text-[19px]">
                A PegPay nasceu para aproximar pessoas de oportunidades financeiras com
                tecnologia, conversa clara e decisões responsáveis.
              </p>
              <a
                href="#nossa-historia"
                className="mt-8 inline-flex items-center gap-3 border-2 border-ink bg-paper px-5 py-3.5 text-[14px] font-extrabold transition-colors hover:bg-ink hover:text-paper"
              >
                Conheça nossa história
                <ArrowDownRight className="size-5" aria-hidden="true" />
              </a>
            </Entrada>

            <Entrada className="relative lg:pl-7">
              <div className="group relative">
                <div className="absolute -left-4 top-8 z-10 bg-[#54F58B] px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink md:-left-7">
                  gente em primeiro lugar
                </div>
                <img
                  src="/images/pegcred.jpg"
                  alt="Profissional trabalhando em uma mesa criativa"
                  className="aspect-[4/3] w-full rounded-[38px] border-2 border-ink object-cover object-center transition-transform duration-200 group-hover:-translate-y-1"
                />
                <div className="absolute -bottom-5 right-6 flex size-20 rotate-6 items-center justify-center rounded-full border-2 border-ink bg-paper text-center text-[11px] font-extrabold uppercase leading-tight tracking-[0.08em] transition-transform duration-200 group-hover:rotate-0">
                  fazer
                  <br />
                  acontecer
                </div>
                <RabiscoEstrela className="absolute -right-6 -top-8 size-20 rotate-12 text-peg md:-right-9 md:size-24" />
              </div>
            </Entrada>
          </div>

          <div className="border-y-2 border-ink bg-ink py-3 text-paper" aria-hidden="true">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 overflow-hidden px-5 text-[12px] font-bold uppercase tracking-[0.16em] md:px-8">
              <span className="whitespace-nowrap">Mais contexto</span>
              <span className="text-peg">✦</span>
              <span className="whitespace-nowrap">Menos burocracia</span>
              <span className="text-peg">✦</span>
              <span className="whitespace-nowrap">Conversa clara</span>
              <span className="hidden text-peg sm:inline">✦</span>
              <span className="hidden whitespace-nowrap sm:inline">Crédito responsável</span>
            </div>
          </div>
        </section>

        <section id="nossa-historia" className="scroll-mt-[84px] bg-paper py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Entrada className="grid items-center gap-10 rounded-[32px] bg-white p-5 shadow-[0_18px_50px_rgba(32,30,29,0.08)] md:p-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
              <div className="relative min-h-[360px] overflow-hidden rounded-[24px] bg-peg md:min-h-[500px]">
                <img
                  src="/images/app.jpg"
                  alt="Ilustração de uma pessoa usando a PegPay pelo celular"
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute bottom-5 left-5 max-w-[220px] border-2 border-ink bg-paper p-4 text-balance text-[16px] font-extrabold leading-tight">
                  Menos papel. Mais espaço para a vida acontecer.
                </div>
              </div>

              <div className="py-3 lg:pr-7">
                <p className="label text-peg-deep">Por que a gente existe</p>
                <h2 className="mt-4 max-w-[16ch] text-balance text-[36px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[48px]">
                  A PegPay nasceu para abrir caminho.
                </h2>
                <div className="mt-7 max-w-[58ch] space-y-5 text-pretty text-[16px] leading-relaxed text-ink/70">
                  <p>
                    Boa parte do mercado financeiro ainda usa modelos que deixam milhões de
                    brasileiros de fora. Gente que trabalha, empreende, consome e movimenta a
                    economia todos os dias — mas que o sistema nem sempre consegue enxergar.
                  </p>
                  <p>
                    A gente desenvolve tecnologia e processos capazes de compreender perfis,
                    comportamentos e realidades financeiras diferentes do padrão que o banco
                    espera.
                  </p>
                  <p className="border-l-4 border-peg pl-5 font-semibold text-ink">
                    Não é sobre conceder um empréstimo a qualquer custo. É sobre criar acesso
                    com clareza, responsabilidade e respeito pelo momento de cada pessoa.
                  </p>
                </div>
              </div>
            </Entrada>
          </div>
        </section>

        <section className="relative border-y-2 border-ink bg-[#66DB99] py-20 md:py-24">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 md:px-8 lg:grid-cols-[1fr_0.78fr]">
            <Entrada>
              <p className="label text-ink/60">Impacto de verdade</p>
              <h2 className="mt-4 max-w-[10ch] text-balance text-[43px] font-extrabold leading-none tracking-[-0.04em] md:text-[58px]">
                PegPay em <span className="relative inline-block">números<RiscoCircular /></span>
              </h2>

              <div className="mt-14 grid gap-9 sm:grid-cols-2">
                <div className="border-t-2 border-ink pt-5">
                  <strong className="tnum block text-[56px] font-extrabold leading-none tracking-[-0.05em] md:text-[72px]">
                    412 mil
                  </strong>
                  <span className="mt-3 block max-w-[18ch] text-pretty text-[17px] font-bold leading-tight">
                    pessoas já foram atendidas
                  </span>
                </div>
                <div className="border-t-2 border-ink pt-5">
                  <strong className="tnum block text-[56px] font-extrabold leading-none tracking-[-0.05em] md:text-[72px]">
                    35%
                  </strong>
                  <span className="mt-3 block max-w-[22ch] text-pretty text-[17px] font-bold leading-tight">
                    encontraram aqui o primeiro crédito formal
                  </span>
                </div>
              </div>
              <p className="mt-9 max-w-[56ch] text-pretty text-[15px] leading-relaxed text-ink/70">
                Esse segundo número diz muito sobre a nossa direção: para mais de um terço de
                quem passou por aqui, a PegPay foi a primeira vez que o crédito formal disse sim.
              </p>
            </Entrada>

            <Entrada className="relative mx-auto w-full max-w-[440px]">
              <div className="absolute left-1/2 top-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink/20" />
              <img
                src="/images/tela.png"
                alt="Ilustração do aplicativo PegPay e recursos financeiros"
                loading="lazy"
                className="relative z-10 w-full drop-shadow-[12px_16px_0_rgba(32,30,29,0.12)]"
              />
              <span className="absolute right-2 top-6 z-20 rotate-6 border-2 border-ink bg-cream px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.1em]">
                desde 2019
              </span>
            </Entrada>
          </div>
        </section>

        <section className="bg-paper py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Entrada className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <div className="relative flex min-h-[380px] items-center justify-center border-2 border-ink bg-white p-8 md:min-h-[520px]">
                <img
                  src="/images/img9.png"
                  alt="Ilustração de tecnologia analisando informações financeiras"
                  loading="lazy"
                  className="w-full max-w-[490px]"
                />
                <span className="absolute left-5 top-5 size-4 bg-peg" aria-hidden="true" />
                <span className="absolute bottom-5 right-5 size-4 rounded-full bg-[#54F58B]" aria-hidden="true" />
              </div>

              <div>
                <p className="label text-peg-deep">Tecnologia + proximidade</p>
                <h2 className="mt-4 max-w-[17ch] text-balance text-[38px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[52px]">
                  Mais contexto para entender. Mais clareza para decidir.
                </h2>
                <div className="mt-7 max-w-[58ch] space-y-5 text-pretty text-[16px] leading-relaxed text-ink/70">
                  <p>
                    A tecnologia ajuda a organizar informações, reduzir etapas e enxergar
                    realidades que modelos tradicionais costumam deixar passar.
                  </p>
                  <p>
                    A presença humana completa esse trabalho: explica, acompanha e transforma
                    dados em uma conversa que faz sentido para quem está do outro lado.
                  </p>
                  <p className="text-[20px] font-extrabold leading-snug text-ink">
                    Um processo mais simples, sem abrir mão de segurança e responsabilidade.
                  </p>
                </div>
              </div>
            </Entrada>
          </div>
        </section>

        <section className="border-y-2 border-ink bg-cream py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Entrada className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label text-peg-deep">Como a gente trabalha</p>
                <h2 className="mt-4 max-w-[13ch] text-balance text-[40px] font-extrabold leading-none tracking-[-0.04em] md:text-[56px]">
                  Quatro ideias que saem do papel.
                </h2>
              </div>
              <p className="max-w-[42ch] text-pretty text-[15px] leading-relaxed text-ink/65">
                O jeito PegPay aparece nas escolhas pequenas: na análise, na conversa e na forma
                de mostrar cada condição.
              </p>
            </Entrada>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {JEITOS_DE_TRABALHAR.map((item, index) => (
                <Entrada key={item.numero}>
                  <motion.article
                    whileHover={reduzMovimento ? undefined : { y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={cn(
                      "flex min-h-[280px] h-full flex-col border-2 border-ink p-6",
                      index === 0 && "bg-peg text-paper",
                      index === 1 && "bg-paper",
                      index === 2 && "bg-[#54F58B]",
                      index === 3 && "bg-ink text-paper",
                    )}
                  >
                    <span className="tnum text-[13px] font-extrabold opacity-60">{item.numero}</span>
                    <h3 className="mt-auto max-w-[13ch] text-balance text-[25px] font-extrabold leading-[1.03] tracking-[-0.025em]">
                      {item.titulo}
                    </h3>
                    <p className="mt-4 text-pretty text-[14px] leading-relaxed opacity-70">{item.texto}</p>
                  </motion.article>
                </Entrada>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-peg py-20 text-paper md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Entrada>
              <p className="label text-paper/65">O que não muda</p>
              <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <h2 className="max-w-[12ch] text-balance text-[42px] font-extrabold leading-none tracking-[-0.04em] md:text-[60px]">
                  Valores para clicar, praticar e cobrar.
                </h2>
                <p className="max-w-[42ch] text-pretty text-[15px] leading-relaxed text-paper/75">
                  Escolha um valor para ver como ele orienta as decisões da PegPay no dia a dia.
                </p>
              </div>
            </Entrada>

            <Entrada className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                {VALORES.map((item, index) => {
                  const Icone = item.Icone;
                  const ativo = index === valorAtivo;

                  return (
                    <button
                      key={item.nome}
                      type="button"
                      onClick={() => setValorAtivo(index)}
                      aria-pressed={ativo}
                      className={cn(
                        "flex min-h-[112px] items-end justify-between gap-4 border-2 p-4 text-left transition-transform duration-200 hover:-translate-y-1",
                        item.classe,
                        ativo ? "border-paper shadow-[6px_6px_0_0_#201E1D]" : "border-ink",
                      )}
                    >
                      <span className="text-balance text-[16px] font-extrabold leading-tight sm:text-[18px]">
                        {item.nome}
                      </span>
                      <Icone className="size-6 shrink-0" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              <div className="relative min-h-[360px] overflow-hidden border-2 border-paper bg-ink p-7 sm:p-10">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={valor.nome}
                    initial={reduzMovimento ? false : { opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduzMovimento ? undefined : { opacity: 0, x: -14 }}
                    transition={{ duration: reduzMovimento ? 0 : 0.18, ease: "easeOut" }}
                    className="flex min-h-[280px] flex-col"
                  >
                    <IconeAtivo className="size-10 text-peg" aria-hidden="true" />
                    <p className="mt-auto text-[12px] font-bold uppercase tracking-[0.16em] text-paper/45">
                      Nosso valor em foco
                    </p>
                    <h3 className="mt-3 text-balance text-[38px] font-extrabold leading-none tracking-[-0.035em] sm:text-[48px]">
                      {valor.nome}
                    </h3>
                    <p className="mt-5 max-w-[46ch] text-pretty text-[17px] leading-relaxed text-paper/70">
                      {valor.texto}
                    </p>
                  </motion.div>
                </AnimatePresence>
                <RabiscoEstrela className="absolute -right-5 -top-5 size-28 text-paper/10" />
              </div>
            </Entrada>
          </div>
        </section>

        <section className="bg-paper py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Entrada className="grid items-stretch gap-0 border-2 border-ink bg-white lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-7 sm:p-10 lg:p-14">
                <p className="label text-peg-deep">Quem responde pela empresa</p>
                <h2 className="mt-4 max-w-[15ch] text-balance text-[38px] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[50px]">
                  Tem nome, endereço e gente responsável.
                </h2>
                <div className="mt-7 max-w-[58ch] space-y-5 text-pretty text-[15px] leading-relaxed text-ink/70">
                  <p>
                    A PegPay Soluções Digitais foi fundada em 2019 por Kaio Pirolo da Silva,
                    João Pedro Perez e Felipe Boim.
                  </p>
                  <p>
                    A empresa atua como correspondente bancário. A contratação do crédito é
                    formalizada com a instituição financeira parceira, conforme as condições
                    apresentadas ao cliente. Os dados institucionais completos estão no rodapé.
                  </p>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-3 bg-ink px-6 py-4 text-[15px] font-extrabold text-paper transition-colors hover:bg-peg"
                >
                  Fale com a PegPay
                  <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="relative min-h-[330px] overflow-hidden border-t-2 border-ink bg-peg lg:min-h-[560px] lg:border-l-2 lg:border-t-0">
                <img
                  src="/images/img6.jpg"
                  alt="Ilustração PegPay sobre atendimento ágil"
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            </Entrada>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
