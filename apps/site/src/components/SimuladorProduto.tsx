import { useMemo, useState } from "react";

import { calcularParcela, type Produto } from "@/lib/produtos";
import { whatsappUrl } from "@/lib/contato";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlCurto = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/**
 * Simulador de produto.
 *
 * Por decisão da direção (ADR-003), este componente NÃO exibe taxa nem CET —
 * apenas valor, prazo e parcela estimada. A taxa que origina a parcela vive
 * em `lib/produtos.ts` e é provisória.
 */
export default function SimuladorProduto({ produto }: { produto: Produto }) {
  const [valor, setValor] = useState(produto.valorPadrao);
  const [prazo, setPrazo] = useState(produto.prazoPadrao);

  const parcela = useMemo(
    () => calcularParcela(valor, produto.taxaProvisoria, prazo),
    [valor, prazo, produto.taxaProvisoria]
  );

  const mensagem = `Olá! Quero ${produto.nome.toLowerCase()} de ${brl.format(
    valor
  )} em ${prazo}×.`;

  return (
    <section id="simulador" className="waves-ink scroll-mt-[68px] text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <h2 className="max-w-[16ch] font-archivo text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[52px]">
          Faça as contas.
          <br />
          Leva 2 minutos.
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* Controles */}
          <div className="border-2 border-paper/25 p-6 md:p-9">
            <div>
              <div className="flex items-end justify-between gap-4">
                <label htmlFor="valor" className="label text-paper/50">
                  Quanto você precisa?
                </label>
                <output className="tnum font-archivo text-[26px] font-extrabold leading-none text-paper">
                  {brl.format(valor)}
                </output>
              </div>
              <input
                id="valor"
                type="range"
                className="peg-range mt-5"
                min={produto.valorMin}
                max={produto.valorMax}
                step={produto.passo}
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
              />
              <div className="tnum mt-2 flex justify-between text-[12px] text-paper/40">
                <span>{brlCurto.format(produto.valorMin)}</span>
                <span>{brlCurto.format(produto.valorMax)}</span>
              </div>
            </div>

            <div className="mt-10">
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
                min={produto.prazoMin}
                max={produto.prazoMax}
                step={1}
                value={prazo}
                onChange={(e) => setPrazo(Number(e.target.value))}
              />
              <div className="tnum mt-2 flex justify-between text-[12px] text-paper/40">
                <span>{produto.prazoMin}×</span>
                <span>{produto.prazoMax}×</span>
              </div>
            </div>

            <ul className="rule-t mt-10 space-y-0 border-paper/25 pt-2">
              {produto.requisitos.map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-3 border-b border-paper/10 py-3 text-[14px] font-semibold text-paper/80 last:border-0"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
                    <path d="M0 0h9l3 3v9H0z" fill="#E94E1B" />
                  </svg>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Resultado */}
          <div className="flex h-full flex-col bg-paper text-ink">
            <div className="rule-b flex items-center justify-between px-6 py-4 md:px-8">
              <span className="label text-ink/55">Sua estimativa</span>
              <span className="bg-mint px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
                Sem compromisso
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-8">
              <p className="text-[15px] text-ink/70">
                Você pega{" "}
                <strong className="tnum font-extrabold text-ink">{brl.format(valor)}</strong>
              </p>
              <p className="mt-2 font-archivo text-[38px] font-extrabold leading-none tracking-[-0.02em] text-peg md:text-[50px]">
                <span className="tnum">{prazo}×</span> de{" "}
                <span className="tnum">{brl.format(parcela)}</span>
              </p>

              <dl className="mt-8 space-y-3 border-t-2 border-ink/15 pt-6 text-[14px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/60">Produto</dt>
                  <dd className="font-bold">{produto.nomeCurto}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/60">Prazo</dt>
                  <dd className="tnum font-bold">{prazo} meses</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/60">Liberação</dt>
                  <dd className="font-bold">até 2 dias úteis</dd>
                </div>
              </dl>
            </div>

            <div className="px-6 pb-6 md:px-8">
              <a
                href={whatsappUrl(mensagem)}
                target="_blank"
                rel="noreferrer"
                className="block bg-peg py-4 text-center font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
              >
                Quero meu crédito
              </a>
              {/*
                ADR-003: o site não exibe taxa nem CET. O aviso abaixo não
                informa taxa — diz ao cliente que o número é estimativa e
                onde a condição completa será apresentada.
              */}
              <p className="mt-4 text-[12px] leading-relaxed text-ink/50">
                Valor estimado, sujeito a análise. As condições completas,
                incluindo taxa e CET, são apresentadas pelo nosso time antes de
                qualquer contratação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
