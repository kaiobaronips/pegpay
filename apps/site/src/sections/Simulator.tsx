import { useMemo, useState } from "react";

import Reveal from "@/components/Reveal";
import { APP_ANCORA, whatsappUrl } from "@/lib/contato";

type Garantia = "veiculo" | "imovel";

const CONFIG: Record<
  Garantia,
  { rotulo: string; taxa: number; cet: number; min: number; max: number; passo: number; nMin: number; nMax: number; nPadrao: number }
> = {
  veiculo: {
    rotulo: "Veículo",
    taxa: 0.0129,
    cet: 0.0149,
    min: 5000,
    max: 300000,
    passo: 1000,
    nMin: 12,
    nMax: 72,
    nPadrao: 36,
  },
  imovel: {
    rotulo: "Imóvel",
    taxa: 0.0099,
    cet: 0.0114,
    min: 50000,
    max: 500000,
    passo: 5000,
    nMin: 24,
    nMax: 120,
    nPadrao: 60,
  },
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) =>
  `${(n * 100).toFixed(2).replace(".", ",")}% a.m.`;

/** Parcela da Tabela Price para um valor, uma taxa mensal e um número de parcelas. */
const pmt = (valor: number, taxa: number, parcelas: number) =>
  (valor * taxa) / (1 - Math.pow(1 + taxa, -parcelas));

export default function Simulator() {
  const [garantia, setGarantia] = useState<Garantia>("veiculo");
  const [valor, setValor] = useState(50000);
  const [prazo, setPrazo] = useState(36);

  const cfg = CONFIG[garantia];

  const trocarGarantia = (g: Garantia) => {
    setGarantia(g);
    const c = CONFIG[g];
    setValor((v) => Math.min(c.max, Math.max(c.min, v)));
    setPrazo(c.nPadrao);
  };

  // A parcela e o total são calculados pelo CET — o custo que o cliente
  // realmente paga, com juros, IOF e tarifas. Calcular pela taxa nominal
  // exibiria um total menor do que o próprio CET ao lado implica.
  const parcela = useMemo(() => pmt(valor, cfg.cet, prazo), [valor, prazo, cfg]);

  const total = parcela * prazo;

  return (
    <section id="simulador" className="waves-ink scroll-mt-[68px] text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="mt-3 max-w-[16ch] font-archivo text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[56px]">
            Faça as contas.
            <br />
            Leva 2 minutos.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* Controles */}
          <Reveal delay={100}>
            <div className="border-2 border-paper/25 p-6 md:p-9">
              <p className="label mb-4 text-paper/50">O que você tem de garantia?</p>
              <div className="grid grid-cols-2 border-2 border-paper/25" role="tablist" aria-label="Tipo de garantia">
                {(Object.keys(CONFIG) as Garantia[]).map((g) => (
                  <button
                    key={g}
                    role="tab"
                    aria-selected={garantia === g}
                    onClick={() => trocarGarantia(g)}
                    className={`py-3.5 font-archivo text-[15px] font-extrabold transition-colors ${
                      garantia === g
                        ? "bg-peg text-paper"
                        : "bg-transparent text-paper/60 hover:text-paper"
                    }`}
                  >
                    {CONFIG[g].rotulo}
                  </button>
                ))}
              </div>

              <div className="mt-10">
                <div className="flex items-end justify-between gap-4">
                  <label htmlFor="valor" className="label text-paper/50">
                    Quanto você quer pegar?
                  </label>
                  <output className="tnum font-archivo text-[26px] font-extrabold leading-none text-paper">
                    {brl.format(valor)}
                  </output>
                </div>
                <input
                  id="valor"
                  type="range"
                  className="peg-range mt-5"
                  min={cfg.min}
                  max={cfg.max}
                  step={cfg.passo}
                  value={valor}
                  onChange={(e) => setValor(Number(e.target.value))}
                />
                <div className="tnum mt-2 flex justify-between text-[12px] text-paper/40">
                  <span>{brl.format(cfg.min)}</span>
                  <span>{brl.format(cfg.max)}</span>
                </div>
              </div>

              <div className="mt-9">
                <div className="flex items-end justify-between gap-4">
                  <label htmlFor="prazo" className="label text-paper/50">
                    Em quantas parcelas?
                  </label>
                  <output className="tnum font-archivo text-[26px] font-extrabold leading-none text-paper">
                    {prazo}×
                  </output>
                </div>
                <input
                  id="prazo"
                  type="range"
                  className="peg-range mt-5"
                  min={cfg.nMin}
                  max={cfg.nMax}
                  step={1}
                  value={prazo}
                  onChange={(e) => setPrazo(Number(e.target.value))}
                />
                <div className="tnum mt-2 flex justify-between text-[12px] text-paper/40">
                  <span>{cfg.nMin}×</span>
                  <span>{cfg.nMax}×</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Resultado — espelho da tela de simulação do manual */}
          <Reveal delay={200}>
            <div className="flex h-full flex-col bg-paper text-ink">
              <div className="rule-b flex items-center justify-between px-6 py-4 md:px-8">
                <span className="label text-ink/55">Sua simulação</span>
                <span className="bg-mint px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
                  Sem compromisso
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-8">
                <p className="text-[15px] text-ink/70">
                  Você pega{" "}
                  <strong className="tnum font-extrabold text-ink">{brl.format(valor)}</strong>
                </p>
                <p className="mt-2 font-archivo text-[40px] font-extrabold leading-none tracking-[-0.02em] text-peg md:text-[52px]">
                  <span className="tnum">{prazo}×</span> de{" "}
                  <span className="tnum">{brl.format(parcela)}</span>
                </p>
                <dl className="mt-8 space-y-3 border-t-2 border-ink/15 pt-6 text-[14px]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/60">Taxa a partir de</dt>
                    <dd className="tnum font-bold">{pct(cfg.taxa)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/60">CET estimado</dt>
                    <dd className="tnum font-bold">{pct(cfg.cet)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/60">Total estimado</dt>
                    <dd className="tnum font-bold">{brl.format(total)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/60">Garantia</dt>
                    <dd className="font-bold">{cfg.rotulo}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/60">Liberação</dt>
                    <dd className="font-bold">até 2 dias úteis</dd>
                  </div>
                </dl>
              </div>
              <div className="px-6 pb-6 md:px-8">
                <a
                  href={whatsappUrl(
                    `Olá! Simulei ${brl.format(valor)} em ${prazo}× com garantia de ${cfg.rotulo.toLowerCase()} e quero contratar.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-peg py-4 text-center font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
                >
                  Entrar em contato
                </a>
                <a
                  href={APP_ANCORA}
                  className="mt-3 block border-2 border-ink py-3.5 text-center font-archivo text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Baixar o app
                </a>
                <p className="mt-4 text-[12px] leading-relaxed text-ink/50">
                  Valores estimados: a parcela e o total já consideram o CET. A taxa
                  final depende da análise do seu perfil e da garantia. CET, prazo e
                  garantia sempre visíveis antes de contratar.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
