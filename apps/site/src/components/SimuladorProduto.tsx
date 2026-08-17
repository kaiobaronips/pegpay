import { useState } from "react";

import { type Produto } from "@/lib/produtos";
import { whatsappUrl } from "@/lib/contato";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlCurto = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/**
 * Simulador de produto — qualificador, não calculadora.
 *
 * O cliente escolhe valor e prazo, e o resultado repete o que ele mesmo
 * pediu. **Não exibe parcela**, taxa nem CET.
 *
 * Até 2026-08-16 esta tela mostrava uma parcela em reais, derivada de uma
 * taxa provisória que nunca foi política oficial de crédito — o ADR-003
 * previa que o site não fosse ao ar com aqueles números antes de Risco
 * fornecer os reais, e foi. Um valor de dinheiro inventado apresentado ao
 * cliente fere integridade financeira, que é prioridade 2 do projeto.
 * Ver a atualização no ADR-003.
 */
export default function SimuladorProduto({ produto }: { produto: Produto }) {
  const [valor, setValor] = useState(produto.valorPadrao);
  const [prazo, setPrazo] = useState(produto.prazoPadrao);

  const mensagem = `Olá! Quero ${produto.nome.toLowerCase()} de ${brl.format(
    valor
  )} em ${prazo}×.`;

  return (
    <section id="simulador" className="waves-ink scroll-mt-[68px] text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        {/* Era "Faça as contas": o simulador não faz mais conta nenhuma —
            prometer cálculo e não entregar é o mesmo problema, invertido. */}
        <h2 className="max-w-[16ch] font-archivo text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-[52px]">
          Monte o seu pedido.
          <br />
          Leva 2 minutos.
        </h2>

        {/* minmax(0,…) nas colunas: sem isso, uma trilha 1fr nunca encolhe
            abaixo da largura mínima do conteúdo, e a caixa de controles
            (p-6 + bordas = 52px de cromo) forçava 312px dentro de 280px
            disponíveis a 320px de viewport — 12px de overflow horizontal na
            página inteira. */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* Controles */}
          <div className="min-w-0 border-2 border-paper/25 p-5 sm:p-6 md:p-9">
            <div>
              {/* Empilha em telas estreitas: lado a lado, o rótulo quebrava
                  em três linhas e colava no valor a 320px. */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
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
              {/* Empilha em telas estreitas: lado a lado, o rótulo quebrava
                  em três linhas e colava no valor a 320px. */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
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
          <div className="flex h-full min-w-0 flex-col bg-paper text-ink">
            <div className="rule-b flex items-center justify-between px-6 py-4 md:px-8">
              <span className="label text-ink/55">Seu pedido</span>
              <span className="bg-mint px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
                Sem compromisso
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-center px-6 py-8 md:px-8">
              <p className="text-[15px] text-ink/70">Você quer pegar</p>
              <p className="mt-2 font-archivo text-[38px] font-extrabold leading-none tracking-[-0.02em] text-peg md:text-[50px]">
                <span className="tnum">{brl.format(valor)}</span>
              </p>
              <p className="mt-3 text-[15px] text-ink/70">
                em <strong className="tnum font-extrabold text-ink">{prazo} parcelas</strong>
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
                O site não exibe taxa nem CET (ADR-003) e passou a não exibir
                parcela. O aviso diz ao cliente onde a condição completa —
                inclusive o valor da parcela — vai ser apresentada.
              */}
              <p className="mt-4 text-[12px] leading-relaxed text-ink/50">
                Sujeito a análise. O valor da parcela e as condições completas,
                incluindo taxa e CET, são apresentados pelo nosso time antes de
                qualquer contratação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
