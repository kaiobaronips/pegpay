import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CreditCard,
  Headphones,
  LockKeyhole,
  MessageCircle,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import { whatsappUrl } from "@/lib/contato";
import { PERGUNTAS } from "@/lib/faq";
import { LISTA_PRODUTOS } from "@/lib/produtos";
import { breadcrumbSchema, faqSchema, organizacaoSchema } from "@/lib/schema";
import { useJsonLd, useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Atalho = {
  titulo: string;
  texto: string;
  href: string;
  cor: string;
  Icone: LucideIcon;
};

type ResultadoBusca = {
  titulo: string;
  texto: string;
  href: string;
  grupo: string;
};

const ATALHOS: Atalho[] = [
  {
    titulo: "Segurança e golpes",
    texto: "Reconheça contatos falsos e saiba o que a PegPay nunca solicita.",
    href: "/seguranca",
    cor: "bg-mint",
    Icone: ShieldCheck,
  },
  {
    titulo: "Privacidade",
    texto: "Entenda como seus dados são usados e exerça os seus direitos.",
    href: "/privacidade",
    cor: "bg-cream",
    Icone: LockKeyhole,
  },
  {
    titulo: "Garantias",
    texto: "Veja como funcionam operações com veículo ou imóvel em garantia.",
    href: "/garantias",
    cor: "bg-peg-soft",
    Icone: Building2,
  },
  {
    titulo: "SCR do Banco Central",
    texto: "Consulte as principais informações sobre o seu histórico de crédito.",
    href: "/scr-bcb",
    cor: "bg-white",
    Icone: CreditCard,
  },
];

const PERGUNTAS_COM_ID = PERGUNTAS.map((item, indice) => ({
  ...item,
  id: `faq-${indice + 1}`,
}));

const BUSCAS_POPULARES = ["golpe", "nome limpo", "consignado CLT", "garantia"];

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function Ajuda() {
  const { pathname } = useLocation();
  const [busca, setBusca] = useState("");
  const [faqAberta, setFaqAberta] = useState("faq-1");

  const termo = normalizar(busca.trim());

  const resultadosBusca = useMemo<ResultadoBusca[]>(() => {
    if (!termo) return [];

    const resultadosFaq = PERGUNTAS_COM_ID.filter((item) =>
      normalizar(`${item.p} ${item.r}`).includes(termo),
    ).map((item) => ({
      titulo: item.p,
      texto: item.r,
      href: `#${item.id}`,
      grupo: "Pergunta frequente",
    }));

    const resultadosProdutos = LISTA_PRODUTOS.filter((produto) =>
      normalizar(
        `${produto.nome} ${produto.nomeCurto} ${produto.descricao} ${produto.chamada} ${produto.requisitos.join(" ")}`,
      ).includes(termo),
    ).map((produto) => ({
      titulo: produto.nomeCurto,
      texto: produto.descricao,
      href: produto.slug,
      grupo: "Produto",
    }));

    const resultadosAtalhos = ATALHOS.filter((atalho) =>
      normalizar(`${atalho.titulo} ${atalho.texto}`).includes(termo),
    ).map((atalho) => ({
      titulo: atalho.titulo,
      texto: atalho.texto,
      href: atalho.href,
      grupo: "Atalho",
    }));

    return [...resultadosFaq, ...resultadosProdutos, ...resultadosAtalhos].slice(0, 8);
  }, [termo]);

  const perguntasFiltradas = useMemo(() => {
    if (!termo) return PERGUNTAS_COM_ID;

    return PERGUNTAS_COM_ID.filter((item) =>
      normalizar(`${item.p} ${item.r}`).includes(termo),
    );
  }, [termo]);

  useSeo(
    "Ajuda — PegPay",
    "Encontre respostas sobre produtos, segurança, dados e atendimento da PegPay. Use a busca e fale com o time pelo WhatsApp oficial.",
    pathname,
  );
  useJsonLd([organizacaoSchema(), breadcrumbSchema("Ajuda", pathname), faqSchema(PERGUNTAS)]);

  return (
    <div className="min-h-screen bg-paper font-archivo text-ink">
      <Header />

      <main className="overflow-hidden pt-[68px]">
        <section className="relative bg-peg py-12 md:py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 border border-white/50 px-4 py-2 text-sm font-bold text-white">
                <Headphones className="size-4" aria-hidden="true" />
                Central de ajuda PegPay
              </p>
              <h1 className="mt-6 max-w-xl text-balance text-5xl font-extrabold leading-none text-white sm:text-6xl lg:text-7xl">
                Como podemos te ajudar?
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base font-medium leading-relaxed text-white/85 md:text-lg">
                Encontre respostas sobre produtos, contratação e segurança ou fale direto com
                o nosso time.
              </p>

              <div className="mt-8 max-w-xl">
                <label className="offset-shadow-sm flex h-14 items-center gap-3 border-2 border-ink bg-white px-4 focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2 focus-within:ring-offset-peg">
                  <Search className="size-5 shrink-0 text-ink/60" aria-hidden="true" />
                  <span className="sr-only">Pesquisar na central de ajuda</span>
                  <input
                    type="search"
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                    placeholder="Busque uma dúvida ou produto"
                    aria-label="Pesquisar na central de ajuda"
                    className="min-w-0 flex-1 bg-transparent text-base font-medium text-ink placeholder:text-ink/50 focus:outline-none"
                  />
                </label>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/85">
                  <span className="font-bold text-white">Mais buscados:</span>
                  {BUSCAS_POPULARES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setBusca(item)}
                      className="underline decoration-white/40 underline-offset-4 transition-colors duration-150 hover:text-white"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <div className="offset-shadow-sm absolute -left-4 top-8 z-10 hidden items-center gap-2 border-2 border-ink bg-mint px-4 py-3 text-sm font-extrabold sm:flex">
                <ShieldCheck className="size-5" aria-hidden="true" />
                Canal seguro
              </div>
              <img
                src="/images/ajuda-hero.png"
                alt="Ilustração de atendimento digital com celular, lupa, conversa e proteção"
                width="1448"
                height="1086"
                fetchPriority="high"
                className="offset-shadow aspect-[4/3] w-full border-2 border-ink object-cover"
              />
              <div className="offset-shadow-sm absolute -bottom-5 right-4 flex max-w-[220px] items-center gap-3 border-2 border-ink bg-white p-3 sm:right-8">
                <MessageCircle className="size-9 shrink-0 bg-peg p-2 text-white" aria-hidden="true" />
                <p className="text-pretty text-sm font-extrabold leading-tight">
                  Resposta humana quando você precisar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {termo && (
          <section className="border-b border-ink/15 bg-white py-10" aria-live="polite">
            <div className="mx-auto max-w-7xl px-5 md:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-peg-deep">Resultado da busca</p>
                  <h2 className="mt-1 text-balance text-2xl font-extrabold md:text-3xl">
                    {resultadosBusca.length > 0
                      ? `${resultadosBusca.length} resultado${resultadosBusca.length > 1 ? "s" : ""} para “${busca}”`
                      : `Nenhum resultado para “${busca}”`}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  className="self-start text-sm font-bold text-peg underline underline-offset-4"
                >
                  Limpar busca
                </button>
              </div>

              {resultadosBusca.length > 0 ? (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {resultadosBusca.map((resultado) => {
                    const conteudo = (
                      <>
                        <span className="text-xs font-bold text-peg-deep">{resultado.grupo}</span>
                        <h3 className="mt-2 text-balance text-lg font-extrabold">
                          {resultado.titulo}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-ink/65">
                          {resultado.texto}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-peg">
                          Abrir <ArrowRight className="size-4" aria-hidden="true" />
                        </span>
                      </>
                    );

                    return resultado.href.startsWith("#") ? (
                      <a
                        key={`${resultado.grupo}-${resultado.titulo}`}
                        href={resultado.href}
                        onClick={() => setFaqAberta(resultado.href.slice(1))}
                        className="border border-ink/15 bg-paper p-5 transition-colors duration-150 hover:bg-peg-soft"
                      >
                        {conteudo}
                      </a>
                    ) : (
                      <Link
                        key={`${resultado.grupo}-${resultado.titulo}`}
                        to={resultado.href}
                        className="border border-ink/15 bg-paper p-5 transition-colors duration-150 hover:bg-peg-soft"
                      >
                        {conteudo}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 border-2 border-ink bg-paper p-6">
                  <p className="max-w-xl text-pretty text-sm leading-relaxed text-ink/70">
                    Tente outro termo ou fale com a PegPay pelo WhatsApp oficial para receber
                    orientação.
                  </p>
                  <a
                    href={whatsappUrl("Olá! Não encontrei minha dúvida na Central de Ajuda.")}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-peg"
                  >
                    Pedir ajuda <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="bg-paper py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                Escolha o caminho mais rápido.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              <a
                href={whatsappUrl("Olá! Preciso de ajuda com a PegPay.")}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-64 flex-col border-2 border-ink bg-ink p-7 text-white"
              >
                <span className="flex size-12 items-center justify-center bg-peg">
                  <MessageCircle className="size-6" aria-hidden="true" />
                </span>
                <div className="mt-auto">
                  <p className="text-sm font-bold text-white/65">Atendimento oficial</p>
                  <h3 className="mt-2 text-balance text-2xl font-extrabold">
                    Fale com uma pessoa do nosso time.
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                    Abrir WhatsApp <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </a>

              <a
                href="#perguntas-frequentes"
                className="group flex min-h-64 flex-col border-2 border-ink bg-white p-7"
              >
                <span className="flex size-12 items-center justify-center bg-mint">
                  <Search className="size-6" aria-hidden="true" />
                </span>
                <div className="mt-auto">
                  <p className="text-sm font-bold text-ink/55">Dúvidas frequentes</p>
                  <h3 className="mt-2 text-balance text-2xl font-extrabold">
                    Consulte respostas claras e rápidas.
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-peg">
                    Ver perguntas <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </a>

              <Link
                to="/seguranca"
                className="group flex min-h-64 flex-col border-2 border-ink bg-cream p-7"
              >
                <span className="flex size-12 items-center justify-center bg-peg text-white">
                  <ShieldCheck className="size-6" aria-hidden="true" />
                </span>
                <div className="mt-auto">
                  <p className="text-sm font-bold text-ink/55">Segurança primeiro</p>
                  <h3 className="mt-2 text-balance text-2xl font-extrabold">
                    Recebeu uma mensagem suspeita?
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-peg">
                    Confira agora <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-ink/15 bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                  Ajuda para cada tipo de crédito.
                </h2>
              </div>
              <p className="max-w-md text-pretty text-sm leading-relaxed text-ink/65 md:text-base">
                Veja como cada produto funciona, quem pode solicitar e qual caminho seguir.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {LISTA_PRODUTOS.map((produto) => (
                <article key={produto.id} className="overflow-hidden border-2 border-ink bg-paper">
                  <img
                    src={produto.imagem}
                    alt={produto.imagemAlt}
                    loading="lazy"
                    className="aspect-[16/10] w-full border-b-2 border-ink object-cover"
                  />
                  <div className="p-6">
                    <p className="text-sm font-bold text-peg-deep">{produto.chamada}</p>
                    <h3 className="mt-2 text-balance text-2xl font-extrabold leading-tight">
                      {produto.nomeCurto}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-pretty text-sm leading-relaxed text-ink/65">
                      {produto.descricao}
                    </p>
                    <Link
                      to={produto.slug}
                      className="mt-6 inline-flex items-center gap-2 bg-ink px-4 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-peg"
                    >
                      Entender produto <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="perguntas-frequentes" className="scroll-mt-24 bg-paper py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <aside className="overflow-hidden border-2 border-ink bg-ink text-white lg:sticky lg:top-24">
              <img
                src="/images/ajuda-faq.png"
                alt="Ilustração de cartões de perguntas com respostas verificadas"
                width="1448"
                height="1086"
                loading="lazy"
                className="aspect-[4/3] w-full border-b-2 border-ink object-cover"
              />
              <div className="p-7 md:p-8">
                <div className="flex size-12 items-center justify-center bg-peg">
                  <MessageCircle className="size-6" aria-hidden="true" />
                </div>
                <p className="mt-6 text-sm font-bold text-white/65">Perguntas frequentes</p>
                <h2 className="mt-3 max-w-md text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                  Resposta direta, sem enrolação.
                </h2>
                <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-white/70 md:text-base">
                  Reunimos as dúvidas que mais chegam ao time. Se a resposta não estiver aqui,
                  você pode continuar a conversa no canal oficial.
                </p>
                <a
                  href={whatsappUrl("Olá! Minha dúvida não está na Central de Ajuda.")}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 bg-peg px-5 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-white hover:text-ink"
                >
                  Falar com o time <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </aside>

            <div className="overflow-hidden border-2 border-ink bg-white">
              {perguntasFiltradas.length > 0 ? (
                <Accordion
                  type="single"
                  collapsible
                  value={faqAberta}
                  onValueChange={setFaqAberta}
                  className="w-full"
                >
                  {perguntasFiltradas.map((pergunta) => (
                    <AccordionItem
                      key={pergunta.id}
                      id={pergunta.id}
                      value={pergunta.id}
                      className="scroll-mt-24 border-ink/15 px-6 md:px-8"
                    >
                      <AccordionTrigger className="rounded-none py-6 text-balance text-left text-lg font-extrabold leading-tight hover:no-underline md:text-xl">
                        {pergunta.p}
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-pretty text-sm leading-relaxed text-ink/70 md:text-base">
                        {pergunta.r}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="p-8">
                  <h3 className="text-balance text-2xl font-extrabold">Nada bateu com essa busca.</h3>
                  <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-ink/70">
                    Tente um assunto mais amplo ou fale com a PegPay no WhatsApp oficial.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBusca("")}
                    className="mt-5 bg-ink px-5 py-3 text-sm font-bold text-white"
                  >
                    Limpar busca
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-peg-soft py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <h2 className="max-w-lg text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                  Consulte também.
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {ATALHOS.map((atalho) => {
                  const Icone = atalho.Icone;
                  return (
                    <Link
                      key={atalho.titulo}
                      to={atalho.href}
                      className={cn(
                        "group flex min-h-48 flex-col border-2 border-ink p-5",
                        atalho.cor,
                      )}
                    >
                      <Icone className="size-6" aria-hidden="true" />
                      <div className="mt-auto">
                        <h3 className="text-balance text-xl font-extrabold">{atalho.titulo}</h3>
                        <p className="mt-2 text-pretty text-sm leading-relaxed text-ink/65">
                          {atalho.texto}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
                          Abrir página <ArrowRight className="size-4" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ink py-14 text-white md:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h2 className="max-w-xl text-balance text-3xl font-extrabold md:text-4xl">
                Ainda precisa de ajuda?
              </h2>
              <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-white/70 md:text-base">
                Chame a PegPay no WhatsApp oficial. Nunca cobramos pagamento antecipado para
                liberar crédito.
              </p>
            </div>
            <a
              href={whatsappUrl("Olá! Preciso de ajuda com a PegPay.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start bg-peg px-6 py-4 text-sm font-extrabold text-white transition-colors duration-150 hover:bg-white hover:text-ink md:self-auto"
            >
              Entrar em contato <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
