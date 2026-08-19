import { ExternalLink } from "lucide-react";

import PaginaInterna, { Bloco, Lista } from "@/components/PaginaInterna";
import { WHATSAPP_URL } from "@/lib/contato";

const URL_RELATORIO_BCB = "https://www.bcb.gov.br/meubc/relatorioemprestimofinanciamento";
const URL_SCR_BCB = "https://www.bcb.gov.br/estabilidadefinanceira/scr";

/**
 * Conteúdo educativo sobre o SCR. A PegPay atua como correspondente e não
 * alimenta o sistema: registro, consulta e correção cabem às instituições
 * autorizadas, dentro das regras do Banco Central.
 */
export default function ScrBcb() {
  return (
    <PaginaInterna
      kicker="SCR · Banco Central"
      titulo={"Seu crédito tem história.\nO SCR ajuda a contar."}
      resumo="Entenda o que aparece no Sistema de Informações de Créditos, quem pode consultar seus dados e como conferir ou corrigir o seu relatório no Banco Central."
      descricaoSeo="Entenda o SCR do Banco Central, consulte seu relatório pelo Registrato e saiba como corrigir informações sobre empréstimos e financiamentos."
      atualizadoEm="agosto de 2026"
      heroLaranja
    >
      <Bloco numero="01" titulo="O que é o SCR" semLinhaSuperior>
        <p>
          O SCR é o <strong className="font-semibold text-ink">Sistema de Informações de Créditos</strong>,
          um registro administrado pelo Banco Central do Brasil e alimentado mensalmente
          por bancos, financeiras e outras instituições autorizadas. Ele reúne informações
          sobre operações como empréstimos, financiamentos, limites de crédito, valores a
          liberar e outras responsabilidades de crédito.
        </p>
        <p>
          Quando o risco total de crédito de uma pessoa em uma instituição é igual ou
          superior a <strong className="tnum font-semibold text-ink">R$ 200,00</strong>, as
          informações são registradas de forma individualizada no sistema.
        </p>
        <div className="border-l-4 border-peg bg-peg-soft p-5 text-ink">
          <p className="font-semibold">
            A PegPay não é instituição financeira e não envia dados diretamente ao SCR.
            Em uma contratação intermediada pela PegPay, esse registro cabe à instituição
            financeira parceira responsável pela operação.
          </p>
        </div>
      </Bloco>

      <Bloco numero="02" titulo="O que aparece no relatório">
        <p>
          No Meu BC, o documento é chamado de Relatório de Empréstimos e Financiamentos
          (SCR). Ele ajuda você a visualizar seus compromissos de crédito com instituições
          do Sistema Financeiro Nacional.
        </p>
        <Lista
          itens={[
            "Saldo devedor e tipo de cada operação informada.",
            "Dívidas em dia, vencidas e classificações previstas nas regras do sistema.",
            "Limites de crédito, inclusive de cartões e cheque especial.",
            "Créditos a liberar, coobrigações e outros compromissos financeiros.",
            "Nome da instituição responsável por cada informação.",
          ]}
        />
        <p>
          O relatório é organizado por mês de referência. Por isso, ele funciona como um
          histórico e não como uma fatura ou saldo atualizado em tempo real.
        </p>
      </Bloco>

      <Bloco numero="03" titulo="Para que o SCR serve">
        <p>
          Para o Banco Central, o sistema apoia a supervisão das instituições e a prevenção
          de riscos no Sistema Financeiro Nacional. Para as instituições financeiras, as
          informações ajudam a avaliar capacidade de pagamento e risco de crédito de forma
          mais responsável.
        </p>
        <p>Para você, consultar o relatório pode ajudar a:</p>
        <Lista
          itens={[
            "Conhecer os contratos de crédito informados em seu nome.",
            "Avaliar seu nível de endividamento antes de assumir uma nova parcela.",
            "Identificar uma dívida ou operação que você não reconhece.",
            "Organizar uma renegociação ou uma possível portabilidade de crédito.",
          ]}
        />
        <p>
          O SCR pode fazer parte de uma análise, mas{" "}
          <strong className="font-semibold text-ink">
            não garante aprovação, limite, redução de juros ou contratação de crédito
          </strong>
          . A decisão é sempre da instituição financeira responsável, conforme seus
          critérios e as condições do produto.
        </p>
      </Bloco>

      <Bloco numero="04" titulo="Como consultar gratuitamente">
        <p>
          Você pode acessar seu próprio relatório gratuitamente pelo Meu BC, na área do
          Registrato. Atualmente, o acesso exige uma conta gov.br de nível prata ou ouro,
          com a verificação em duas etapas ativada.
        </p>
        <ol className="space-y-3">
          {[
            "Acesse o Relatório de Empréstimos e Financiamentos no site oficial do Banco Central.",
            "Entre com sua conta gov.br e conclua a verificação de segurança.",
            "Escolha o período que deseja consultar e gere o relatório.",
            "Confira instituições, valores, situação e mês de referência das operações.",
          ].map((passo, indice) => (
            <li key={passo} className="grid grid-cols-[34px_1fr] gap-3">
              <span className="tnum flex size-7 items-center justify-center bg-ink text-[11px] font-extrabold text-paper">
                {indice + 1}
              </span>
              <span>{passo}</span>
            </li>
          ))}
        </ol>
        <a
          href={URL_RELATORIO_BCB}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 bg-peg px-6 py-4 font-archivo text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Consultar no Banco Central
          <ExternalLink className="size-5" aria-hidden="true" />
        </a>
      </Bloco>

      <Bloco numero="05" titulo="Quem pode consultar seus dados">
        <p>
          Você pode consultar suas próprias informações pelos canais do Banco Central. Já
          as instituições financeiras só podem acessar os dados consolidados do SCR depois
          de obter sua <strong className="font-semibold text-ink">autorização específica</strong> para
          essa finalidade.
        </p>
        <p>
          Se uma proposta iniciada com a PegPay precisar dessa consulta, a instituição
          financeira parceira responsável pela análise apresentará a autorização nos termos
          e documentos da jornada. Leia antes de aceitar: o texto deve informar quem fará a
          consulta e para qual finalidade.
        </p>
        <p>
          A autorização para consulta não representa aprovação automática nem permite uso
          dos dados para qualquer finalidade diferente da que foi informada.
        </p>
      </Bloco>

      <Bloco numero="06" titulo="SCR não é lista de negativação">
        <p>
          Ter informações no SCR não significa, por si só, que seu CPF esteja negativado. O
          sistema registra operações de crédito e preserva o histórico dos meses anteriores,
          inclusive quando uma dívida esteve em atraso.
        </p>
        <p>
          Uma informação correta não pode ser simplesmente retirada do histórico. O registro
          no SCR também não impede automaticamente que você contrate um novo empréstimo ou
          financiamento: a decisão depende da análise e do acordo com a instituição financeira.
        </p>
      </Bloco>

      <Bloco numero="07" titulo="Paguei, mas o valor ainda aparece">
        <p>
          Isso pode acontecer porque as instituições enviam informações ao SCR uma vez por
          mês. O pagamento ou a renegociação costuma aparecer na próxima data-base,
          disponível para consulta no mês seguinte.
        </p>
        <p>
          O sistema não apaga o que aconteceu no passado: o atraso continua visível nos meses
          em que realmente existiu. Para saber o saldo atual, solicitar quitação ou conferir
          uma parcela em tempo real, fale com a instituição financeira responsável pela
          operação.
        </p>
      </Bloco>

      <Bloco numero="08" titulo="Encontrei uma informação errada">
        <p>
          A inclusão, correção e exclusão de dados são responsabilidade da instituição que
          enviou a operação ao SCR. Se você não reconhece uma dívida ou encontrou um erro:
        </p>
        <Lista
          itens={[
            "Confira no relatório qual instituição aparece como responsável pelo registro.",
            "Procure primeiro os canais de atendimento ou o SAC dessa instituição e guarde o protocolo.",
            "Se não resolver, acione a Ouvidoria da instituição.",
            "Se o problema continuar, você poderá registrar uma reclamação no Banco Central.",
          ]}
        />
        <p>
          Quando um erro é confirmado, a instituição responsável envia a correção ao Banco
          Central. Segundo o BC, a alteração pode aparecer no relatório em até sete dias
          corridos após o envio da informação corrigida.
        </p>
        <p>
          Se a operação foi contratada por meio da PegPay e você não sabe qual instituição
          procurar, fale com a gente. Podemos ajudar a identificar a parceira responsável,
          mas somente ela poderá corrigir o registro enviado ao SCR.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 border-2 border-ink bg-paper px-6 py-3.5 font-archivo text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Falar com a PegPay
          <span aria-hidden="true">→</span>
        </a>
      </Bloco>

      <Bloco numero="09" titulo="Fonte oficial e atualizações">
        <p>
          As regras, formas de acesso e prazos do SCR podem ser atualizados pelo Banco
          Central. Para consultar o conteúdo técnico e a versão mais recente das orientações,
          use sempre o site oficial do BC.
        </p>
        <a
          href={URL_SCR_BCB}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 font-extrabold text-peg-deep underline underline-offset-4"
        >
          Saiba mais sobre o SCR no Banco Central
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </Bloco>
    </PaginaInterna>
  );
}
