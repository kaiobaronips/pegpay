import { Link } from "react-router";

import PaginaInterna, { Bloco, Lista } from "@/components/PaginaInterna";

/**
 * Regras, diretrizes e riscos do empréstimo com garantia.
 *
 * Esta página existe para ser honesta sobre o risco. O manual da PegPay
 * proíbe dark pattern: quem dá um bem em garantia precisa entender o que
 * acontece se não pagar, dito com todas as letras (ADR-003).
 */
export default function Garantias() {
  return (
    <PaginaInterna
      kicker="Garantias"
      titulo="O que significa dar um bem em garantia."
      resumo="Empréstimo com garantia costuma ter condições melhores porque existe um bem lastreando o contrato. Esta página explica as regras, o que muda na sua vida e — principalmente — o risco que você assume."
      descricaoSeo="Como funciona dar veículo ou imóvel em garantia: as regras da alienação fiduciária, o que muda na prática e o risco que você assume."
      atualizadoEm="agosto de 2026"
    >
      <Bloco numero="01" titulo="O que é alienação fiduciária">
        <p>
          Ao contratar um empréstimo com garantia, o seu veículo ou imóvel fica{" "}
          <strong className="font-semibold text-ink">alienado</strong> como
          garantia da operação. Na prática, o bem continua registrado no seu nome
          e no seu uso — mas fica gravado, e você não pode vendê-lo ou
          transferi-lo enquanto o contrato estiver ativo.
        </p>
        <p>
          Quitadas todas as parcelas, a alienação é removida e o bem volta a ficar
          livre. <strong className="font-semibold text-ink">Alienação não é venda</strong>{" "}
          e não é penhora: ninguém tira o carro da sua garagem porque você assinou
          o contrato.
        </p>
      </Bloco>

      <Bloco numero="02" titulo="O que você pode e o que não pode">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="label mb-3 text-ink/55">Pode</p>
            <Lista
              itens={[
                "Usar o veículo normalmente, todos os dias.",
                "Morar no imóvel ou mantê-lo alugado.",
                "Fazer manutenção e melhorias.",
                "Quitar antes do prazo.",
              ]}
            />
          </div>
          <div>
            <p className="label mb-3 text-ink/55">Não pode</p>
            <Lista
              itens={[
                "Vender ou transferir o bem durante o contrato.",
                "Dar o mesmo bem como garantia em outra operação.",
                "Deixar a documentação do bem irregular.",
                "Deixar o seguro do veículo vencer, quando exigido.",
              ]}
            />
          </div>
        </div>
      </Bloco>

      <Bloco numero="03" titulo="Requisitos do bem">
        <p>
          Nem todo bem serve como garantia. De forma geral, é preciso que ele
          esteja em seu nome, com documentação regular e sem pendências que
          impeçam a alienação.
        </p>
        <Lista
          itens={[
            <>
              <strong className="font-semibold text-ink">Veículo:</strong> quitado ou em
              fase final de financiamento, documentação em dia, sem restrição judicial.
            </>,
            <>
              <strong className="font-semibold text-ink">Imóvel:</strong> matrícula
              atualizada, sem disputa judicial, IPTU e condomínio em situação regular.
            </>,
          ]}
        />
        <p>
          A avaliação do bem define quanto pode ser liberado. O time confirma a
          lista exata de documentos conforme o seu caso.
        </p>
      </Bloco>

      <Bloco numero="04" titulo="O risco, dito com todas as letras">
        <div className="border-2 border-peg bg-peg-soft/40 p-6">
          <p className="font-archivo text-[17px] font-extrabold leading-snug">
            Se você deixar de pagar, pode perder o bem.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
            É isso que "dar em garantia" significa. Em caso de inadimplência
            persistente, a garantia pode ser executada — o veículo ou o imóvel
            pode ser retomado e vendido para quitar a dívida.
          </p>
        </div>
        <p>
          Por isso a gente insiste: a parcela precisa caber no seu mês{" "}
          <strong className="font-semibold text-ink">desde o começo</strong>. Não
          contrate contando com uma renda que ainda não existe.
        </p>
        <p>
          Execução de garantia é o último recurso e ninguém aqui quer chegar
          nesse ponto. <strong className="font-semibold text-ink">Se você
          estiver com dificuldade, fale com a gente antes de atrasar.</strong>{" "}
          Dá para remarcar data e renegociar — e é muito mais fácil resolver no
          começo do problema do que no fim.
        </p>
      </Bloco>

      <Bloco numero="05" titulo="Antes de assinar, confira">
        <Lista
          itens={[
            "O valor da parcela cabe no seu orçamento mesmo em um mês apertado?",
            "Você entendeu o prazo total e quanto vai pagar ao final?",
            "As condições completas, com taxa e CET, foram apresentadas a você?",
            "Você leu o contrato e entendeu o que acontece em caso de atraso?",
            "Você sabe que o bem fica alienado até a quitação?",
          ]}
        />
        <p>
          Se a resposta para qualquer uma dessas for não, não assine. Pergunte
          para o nosso time até ficar claro. Cliente que entende o que está
          contratando é melhor para todo mundo.
        </p>
      </Bloco>

      <Bloco numero="06" titulo="Quer ver as condições?">
        <p>
          A página do produto tem o simulador e explica o passo a passo da
          contratação.
        </p>
        <Link
          to="/para-voce/emprestimo-com-garantia"
          className="mt-2 inline-block bg-peg px-8 py-4 font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
        >
          Ver empréstimo com garantia
        </Link>
      </Bloco>
    </PaginaInterna>
  );
}
