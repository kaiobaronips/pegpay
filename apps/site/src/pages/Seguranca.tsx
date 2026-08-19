import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleDollarSign,
  Eye,
  KeyRound,
  Link2Off,
  LockKeyhole,
  MessageCircle,
  Search,
  ShieldCheck,
  Smartphone,
  UserRoundX,
  type LucideIcon,
} from "lucide-react";
import { useLocation } from "react-router";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WHATSAPP_EXIBICAO, WHATSAPP_URL } from "@/lib/contato";
import { breadcrumbSchema, organizacaoSchema } from "@/lib/schema";
import { useJsonLd, useSeo } from "@/lib/seo";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";

const ASSUNTOS = [
  {
    id: "pagamento-antecipado",
    titulo: "Pagamento antecipado",
    descricao: "A PegPay nunca cobra para liberar crédito.",
    palavras: "taxa deposito garantia pix dinheiro liberar crédito",
  },
  {
    id: "nunca-pedimos",
    titulo: "O que nunca pedimos",
    descricao: "Senhas, códigos, transferências ou acesso remoto.",
    palavras: "senha sms código verificação aplicativo acesso remoto",
  },
  {
    id: "canais-oficiais",
    titulo: "Canais oficiais",
    descricao: "Confira onde falar com a PegPay com segurança.",
    palavras: "whatsapp telefone site aplicativo contato número",
  },
  {
    id: "protecao-de-dados",
    titulo: "Proteção de dados",
    descricao: "Veja as camadas de proteção usadas na jornada.",
    palavras: "dados criptografia identidade privacidade monitoramento",
  },
  {
    id: "suspeitou",
    titulo: "Suspeitei de um golpe",
    descricao: "Saiba o que fazer agora e fale com a PegPay.",
    palavras: "fraude golpe boletim ocorrência banco ajuda emergência",
  },
];

const NUNCA_PEDIMOS: Array<{
  titulo: string;
  texto: string;
  Icone: LucideIcon;
  destaque?: boolean;
}> = [
  {
    titulo: "Senha ou código",
    texto: "Nunca informe sua senha nem códigos recebidos por SMS, e-mail ou WhatsApp.",
    Icone: KeyRound,
  },
  {
    titulo: "Pix para liberar crédito",
    texto: "Não existe taxa, seguro, depósito de garantia ou parcela antecipada.",
    Icone: CircleDollarSign,
    destaque: true,
  },
  {
    titulo: "Transferência para pessoa",
    texto: "A PegPay não solicita transferências para contas de pessoas físicas.",
    Icone: UserRoundX,
  },
  {
    titulo: "Acesso ao seu aparelho",
    texto: "Não pedimos a instalação de aplicativos de acesso remoto ao celular ou computador.",
    Icone: Smartphone,
  },
];

const SINAIS_DE_GOLPE = [
  {
    numero: "01",
    titulo: "Pressa demais",
    texto: "A pessoa diz que a oferta acaba em minutos ou ameaça cancelar seu crédito.",
  },
  {
    numero: "02",
    titulo: "Bom demais",
    texto: "Promete aprovação garantida, juros irreais ou dinheiro sem nenhuma análise.",
  },
  {
    numero: "03",
    titulo: "Canal estranho",
    texto: "Usa número diferente do oficial, perfil desconhecido ou link encurtado.",
  },
];

const CAMADAS_DE_PROTECAO = [
  "Criptografia dos dados em trânsito e em repouso.",
  "Autenticação da conta e verificação de identidade.",
  "Acesso interno limitado ao que cada função precisa.",
  "Registro auditável de operações críticas.",
  "Monitoramento e mecanismos antifraude ao longo da jornada.",
];

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function Selo({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
      "inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-2 text-[12px] font-extrabold uppercase",
      className,
      )}
    >
      {children}
    </span>
  );
}

/** Página de segurança com orientações práticas e canais oficiais da PegPay. */
export default function Seguranca() {
  const { pathname } = useLocation();
  const [busca, setBusca] = useState("");
  const termo = normalizar(busca.trim());

const resultados = useMemo(() => {
    if (!termo) return [];

return ASSUNTOS.filter((assunto) =>
  normalizar(`${assunto.titulo} ${assunto.descricao} ${assunto.palavras}`).includes(termo),
    );
  }, [termo]);

useSeo(
    "Segurança — PegPay",
    "Aprenda a reconhecer golpes, confira os canais oficiais da PegPay e saiba como proteger seus dados e seu dinheiro.",
    pathname,
  );
useJsonLd([organizacaoSchema(), breadcrumbSchema("Segurança", pathname)]);

  return (
    <div className="min-h-screen bg-paper font-archivo text-ink">
      <Header />

      <main className="overflow-hidden pt-[68px]">
        <section className="relative border-b-2 border-ink bg-peg">
          <div className="mx-auto grid min-h-[590px] max-w-[1200px] items-center gap-12 px-5 py-14 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
            <div className="relative">
              <Selo className="bg-[#54F58B]">
                <ShieldCheck className="size-4" aria-hidden="true" />
                proteção começa pela informação
              </Selo>
              <h1 className="mt-7 max-w-[10ch] whitespace-pre-line text-balance text-[46px] font-extrabold leading-[0.94] text-paper sm:text-[58px] lg:text-[68px]">
                Golpe não avisa.{"\n"}A gente avisa.
              </h1>
              <p className="mt-7 max-w-[52ch] text-pretty text-[17px] font-medium leading-relaxed text-ink/80 md:text-[19px]">
                Informação clara para você reconhecer uma tentativa de fraude, proteger seus
                dados e saber exatamente onde falar com a PegPay.
              </p>
              <a
                href="#pagamento-antecipado"
                className="mt-8 inline-flex items-center gap-3 border-2 border-ink bg-paper px-5 py-3.5 text-[14px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Veja o alerta principal
                <ArrowDownRight className="size-5" aria-hidden="true" />
              </a>
            </div>

            <div className="relative mx-auto w-full max-w-[740px] lg:pl-0">
              <div className="relative">
                <img
                  src="/images/img16.png"
                  width="1536"
                  height="1024"
                  alt="Escudo PegPay protegendo contratos e dados, cercado por elementos financeiros"
                  className="block h-auto w-full object-contain"
                />
              </div>
              <Selo className="absolute bottom-14 left-3 gap-1.5 px-2.5 py-1.5 text-[11px] bg-ink text-paper lg:left-5">
                <BadgeCheck className="size-3.5 text-[#54F58B]" aria-hidden="true" />
                confira antes de confiar
              </Selo>
              <div
                className="absolute -right-4 -top-5 flex size-20 rotate-6 items-center justify-center border-2 border-ink bg-cream text-center text-[11px] font-extrabold uppercase sm:-right-7 sm:size-24"
                aria-hidden="true"
              >
              pare
                <br />e confira
              </div>
            </div>
          </div>

          <div className="border-t-2 border-ink bg-ink py-3 text-paper" aria-hidden="true">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 overflow-hidden px-5 text-[12px] font-bold uppercase md:px-8">
              <span className="whitespace-nowrap">Sem taxa antecipada</span>
              <span className="text-peg">✦</span>
              <span className="whitespace-nowrap">Sem senha compartilhada</span>
              <span className="text-peg">✦</span>
              <span className="whitespace-nowrap">Sem pressa para decidir</span>
              <span className="hidden text-peg sm:inline">✦</span>
              <span className="hidden whitespace-nowrap sm:inline">Só nos canais oficiais</span>
            </div>
          </div>
        </section>

        <section className="relative bg-paper py-16 md:py-20">
          <div className="mx-auto max-w-[1000px] px-5 md:px-8">
            <div className="border-2 border-ink bg-white p-5 shadow-[8px_8px_0_0_#201E1D] md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="label text-peg-deep">Busca rápida</p>
                  <h2 className="mt-2 text-balance text-[25px] font-extrabold leading-tight md:text-[30px]">
                    Como podemos te ajudar?
                  </h2>
                </div>
                <div className="relative w-full md:max-w-[470px]">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink/50"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                    placeholder="Busque por senha, Pix, golpe..."
                    aria-label="Buscar orientação de segurança"
                    className="h-14 rounded-none border-2 border-ink bg-paper pl-12 pr-4 text-[15px] placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-peg"
                  />
                </div>
              </div>

              {termo && (
                <div className="mt-5 border-t-2 border-ink/15 pt-4" aria-live="polite">
                  {resultados.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {resultados.map((resultado) => (
                        <a
                          key={resultado.id}
                          href={`#${resultado.id}`}
                          className="group flex items-center justify-between gap-4 bg-paper p-4 transition-colors hover:bg-peg-soft"
                        >
                          <span>
                            <strong className="block text-[14px]">{resultado.titulo}</strong>
                            <span className="mt-1 block text-pretty text-[13px] text-ink/60">
                              {resultado.descricao}
                            </span>
                          </span>
                          <ChevronRight
                            className="size-5 shrink-0 text-peg transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-pretty text-[14px] text-ink/65">
                      Não encontramos esse assunto. Fale com a gente pelo WhatsApp oficial e
                      conte o que aconteceu.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="pagamento-antecipado" className="scroll-mt-[88px] bg-paper pb-20 md:pb-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid overflow-hidden border-2 border-ink lg:grid-cols-[0.72fr_1.28fr]">
              <div className="flex min-h-[270px] flex-col justify-between bg-ink p-7 text-paper sm:p-10 lg:min-h-[460px]">
                <span className="tnum text-[13px] font-extrabold text-[#FF754B]">REGRA 01</span>
                <div>
                  <AlertTriangle className="size-11 text-peg" aria-hidden="true" />
                  <p className="mt-5 max-w-[12ch] text-balance text-[31px] font-extrabold leading-[1.02] sm:text-[39px]">
                    Pediu dinheiro antes? É golpe.
                  </p>
                </div>
              </div>
              <div className="bg-cream p-7 sm:p-10 lg:p-14">
                <p className="label text-peg-deep">A regra mais importante</p>
                <h2 className="mt-4 max-w-[15ch] text-balance text-[35px] font-extrabold leading-[1.02] sm:text-[48px]">
                  A PegPay nunca cobra para liberar crédito.
                </h2>
                <p className="mt-7 max-w-[58ch] text-pretty text-[17px] leading-relaxed text-ink/70">
                  Nem taxa, nem seguro, nem depósito de garantia, nem antecipação de parcela.
                  Se alguém pedir qualquer pagamento em nome da PegPay, encerre a conversa,
                  não faça a transferência e avise a gente.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-3 bg-peg px-6 py-4 text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Avisar a PegPay
                  <MessageCircle className="size-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="nunca-pedimos" className="scroll-mt-[88px] border-y-2 border-ink bg-peg-soft py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mt-4 max-w-[12ch] text-balance text-[40px] font-extrabold leading-none md:text-[56px]">
                  A gente nunca vai pedir isso.
                </h2>
              </div>
              <p className="max-w-[42ch] text-pretty text-[15px] leading-relaxed text-ink/65">
                Se uma conversa tiver qualquer um destes pedidos, pare por ali. Não responda,
                não clique e não transfira.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {NUNCA_PEDIMOS.map((item, indice) => {
                    const Icone = item.Icone;

  return (
                  <article
                    key={item.titulo}
                    className={cn(
                    "flex min-h-[300px] flex-col border-2 border-ink p-6",
                    item.destaque ? "bg-peg text-paper" : indice === 3 ? "bg-ink text-paper" : "bg-paper",
                    )}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <Icone className="size-8" aria-hidden="true" />
                      <span
                        className={cn(
                        "tnum text-[12px] font-extrabold",
                        item.destaque
                        ? "text-ink/75"
                        : indice === 3
                        ? "text-paper/75"
                        : "text-ink/70",
                        )}
                      >
                        0{indice + 1}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="max-w-[12ch] text-balance text-[24px] font-extrabold leading-[1.03]">
                        {item.titulo}
                      </h3>
                      <p
                        className={cn(
                        "mt-4 text-pretty text-[14px] leading-relaxed",
                        item.destaque
                        ? "text-ink/80"
                        : indice === 3
                        ? "text-paper/75"
                        : "text-ink/70",
                        )}
                      >
                        {item.texto}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-paper py-20 md:py-28">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="relative flex min-h-[390px] items-end justify-center border-2 border-ink bg-white px-7 pb-0 pt-7 md:min-h-[540px]">
              <img
                src="/images/imag20.png"
                width="1254"
                height="1254"
                alt="Ilustração de alerta e proteção digital da PegPay"
                loading="lazy"
                className="w-full max-w-[500px] self-end"
              />
              <Selo className="absolute left-5 top-5 bg-[#54F58B]">
                <Eye className="size-4" aria-hidden="true" />
                ligue o radar
              </Selo>
              <span className="absolute bottom-6 right-6 size-4 bg-peg" aria-hidden="true" />
            </div>

            <div>
              <h2 className="mt-4 max-w-[14ch] whitespace-pre-line text-[40px] font-extrabold leading-none md:text-[54px]">
                Desconfie quando a{"\n"}conversa vier assim.
              </h2>
              <div className="mt-9 space-y-3">
                {SINAIS_DE_GOLPE.map((sinal) => (
                  <article
                    key={sinal.numero}
                    className="grid gap-3 border-t-2 border-ink/30 py-5 sm:grid-cols-[54px_1fr]"
                  >
                    <span className="tnum text-[13px] font-extrabold text-peg-deep">{sinal.numero}</span>
                    <div>
                      <h3 className="text-balance text-[20px] font-extrabold">{sinal.titulo}</h3>
                      <p className="mt-2 max-w-[50ch] text-pretty text-[14px] leading-relaxed text-ink/65">
                        {sinal.texto}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="canais-oficiais" className="scroll-mt-[88px] border-y-2 border-ink bg-[#54F58B] py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
              <div>
                <ShieldCheck className="size-12" aria-hidden="true" />
                <h2 className="mt-6 max-w-[12ch] text-balance text-[40px] font-extrabold leading-none md:text-[54px]">
                  Três lugares. Só eles.
                </h2>
                <p className="mt-6 max-w-[42ch] text-pretty text-[16px] leading-relaxed text-ink/70">
                  Antes de continuar uma conversa, confira o endereço do site e o número do
                  contato. Perfil parecido não é perfil oficial.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  href="https://www.pegpay.com.br"
                  className="group flex min-h-[250px] flex-col border-2 border-ink bg-paper p-5 transition-transform hover:-translate-y-1"
                >
                  <span className="flex size-11 items-center justify-center bg-ink text-paper">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  </span>
                  <strong className="mt-auto text-balance text-[22px] font-extrabold">Site oficial</strong>
                  <span className="mt-2 text-[13px] text-ink/70">pegpay.com.br</span>
                  <ChevronRight className="mt-5 size-5 text-peg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <div className="flex min-h-[250px] flex-col border-2 border-ink bg-peg p-5 text-paper">
                  <span className="flex size-11 items-center justify-center bg-paper text-ink">
                    <Smartphone className="size-5" aria-hidden="true" />
                  </span>
                  <strong className="mt-auto text-balance text-[22px] font-extrabold">App PegPay</strong>
                  <span className="mt-2 text-[13px] text-ink/75">Baixe somente nas lojas oficiais</span>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-[250px] flex-col border-2 border-ink bg-ink p-5 text-paper transition-transform hover:-translate-y-1"
                >
                  <span className="flex size-11 items-center justify-center bg-[#54F58B] text-ink">
                    <MessageCircle className="size-5" aria-hidden="true" />
                  </span>
                  <strong className="mt-auto text-balance text-[22px] font-extrabold">WhatsApp</strong>
                  <span className="tnum mt-2 text-[13px] text-paper/65">{WHATSAPP_EXIBICAO}</span>
                  <ChevronRight className="mt-5 size-5 text-peg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="mt-12 flex items-start gap-3 border-t-2 border-ink/25 pt-6 text-[14px] leading-relaxed text-ink/70">
              <Link2Off className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p className="text-pretty">
                Links encurtados, números diferentes e perfis que abordam você fora desses
                canais devem ser tratados como suspeitos.
              </p>
            </div>
          </div>
        </section>

        <section id="protecao-de-dados" className="scroll-mt-[88px] bg-paper py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid overflow-hidden border-2 border-ink bg-white lg:grid-cols-[0.92fr_1.08fr]">
              <div className="bg-peg-soft p-7 sm:p-10 lg:p-14">
                <LockKeyhole className="size-11 text-peg" aria-hidden="true" />
                <p className="label mt-8 text-peg-deep">Proteção de dados</p>
                <h2 className="mt-4 max-w-[13ch] text-balance text-[38px] font-extrabold leading-none md:text-[52px]">
                  Segurança em mais de uma camada.
                </h2>
                <p className="mt-6 max-w-[46ch] text-pretty text-[15px] leading-relaxed text-ink/65">
                  A proteção acompanha sua jornada, da identificação ao acompanhamento das
                  operações.
                </p>
                <a
                  href="/privacidade"
                  className="mt-8 inline-flex items-center gap-2 font-extrabold text-peg-deep underline underline-offset-4"
                >
                  Leia nossa página de Privacidade
                  <ChevronRight className="size-4" aria-hidden="true" />
                </a>
              </div>
              <div className="p-7 sm:p-10 lg:p-14">
                <ul className="space-y-1">
                  {CAMADAS_DE_PROTECAO.map((camada, indice) => (
                    <li
                      key={camada}
                      className="grid gap-3 border-b-2 border-ink/15 py-5 last:border-b-0 sm:grid-cols-[44px_1fr]"
                    >
                      <span className="flex size-9 items-center justify-center bg-ink text-paper">
                        <Check className="size-4" aria-hidden="true" />
                      </span>
                      <div>
                        <span className="tnum text-[11px] font-extrabold text-peg-deep">CAMADA 0{indice + 1}</span>
                        <p className="mt-1 text-pretty text-[15px] font-semibold leading-relaxed text-ink/75">
                          {camada}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="suspeitou" className="scroll-mt-[88px] waves-ink py-20 text-paper md:py-24">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <Selo className="border-paper bg-peg text-ink">
                  <AlertTriangle className="size-4" aria-hidden="true" />
                  ação rápida
                </Selo>
                <h2 className="mt-7 max-w-[11ch] text-balance text-[43px] font-extrabold leading-none md:text-[62px]">
                  Suspeitou? Pare e fale com a gente.
                </h2>
                <p className="mt-6 max-w-[54ch] text-pretty text-[16px] leading-relaxed text-paper/70">
                  Se recebeu um contato estranho ou acha que caiu em um golpe, quanto mais
                  rápido a gente souber, mais rápido consegue agir e alertar outras pessoas.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-3 bg-peg px-7 py-4 text-[15px] font-extrabold text-ink transition-colors hover:bg-paper"
                >
                  Falar no WhatsApp oficial
                  <MessageCircle className="size-5" aria-hidden="true" />
                </a>
              </div>

              <ol className="border-2 border-paper/30 bg-ink p-6 sm:p-8">
                {[
                  "Não faça nenhum pagamento e interrompa o contato.",
                  "Guarde prints, número, links e comprovantes.",
                  "Avise a PegPay e comunique imediatamente o seu banco.",
                  "Se houve fraude, registre um boletim de ocorrência.",
                ].map((passo, indice) => (
                  <li
                    key={passo}
                    className="grid grid-cols-[42px_1fr] gap-3 border-b border-paper/20 py-5 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <span className="tnum text-[13px] font-extrabold text-[#FF754B]">0{indice + 1}</span>
                    <span className="text-pretty text-[15px] font-semibold leading-relaxed text-paper/80">
                      {passo}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
