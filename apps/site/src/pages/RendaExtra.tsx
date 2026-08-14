import PaginaInterna, { Bloco, Lista } from "@/components/PaginaInterna";
import { whatsappUrl } from "@/lib/contato";

/**
 * Programa de indicação.
 *
 * ⚠️ Nenhum valor de comissão é informado nesta página porque a política de
 * remuneração do divulgador ainda não foi definida (Blueprint §30, regra 7:
 * não invente números). Quando existir, entra aqui.
 */
const COMO_FUNCIONA = [
  {
    titulo: "Você se cadastra",
    texto:
      "Fale com a gente pelo WhatsApp e conte que quer ser divulgador. A gente explica as regras e te dá o material.",
  },
  {
    titulo: "Indica quem precisa",
    texto:
      "Amigos, família, colegas de trabalho, seus seguidores. Quem você conhece que já ouviu não do banco?",
  },
  {
    titulo: "Ganha por indicação",
    texto:
      "Cada indicação que vira contrato gera comissão para você. Quanto mais gente você ajuda, mais você recebe.",
  },
];

export default function RendaExtra() {
  return (
    <PaginaInterna
      kicker="Renda extra"
      titulo="Indique a PegPay. Ganhe por isso."
      resumo="Você já conhece alguém que precisa de crédito e ouviu não do banco. Indique a PegPay, ajude essa pessoa a resolver — e receba comissão por cada indicação que vira contrato."
      descricaoSeo="Indique a PegPay para quem precisa de crédito e receba comissão por cada indicação que vira contrato. Veja como participar."
    >
      <Bloco numero="01" titulo="Como funciona">
        <div className="grid gap-px border-2 border-ink bg-ink sm:grid-cols-3">
          {COMO_FUNCIONA.map((p, i) => (
            <div key={p.titulo} className="flex flex-col bg-paper p-6">
              <span className="tnum font-archivo text-[44px] font-extrabold leading-none text-peg">
                {i + 1}
              </span>
              <h3 className="mt-4 font-archivo text-[18px] font-extrabold tracking-[-0.015em]">
                {p.titulo}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{p.texto}</p>
            </div>
          ))}
        </div>
      </Bloco>

      <Bloco numero="02" titulo="Para quem é">
        <Lista
          itens={[
            "Quem tem uma rede de contatos e quer transformar isso em renda.",
            "Criadores de conteúdo que falam com público das classes C, D e E.",
            "Profissionais autônomos que atendem gente todo dia — cabeleireiro, motorista, vendedor.",
            "Quem já é cliente PegPay e quer indicar o que já usou.",
          ]}
        />
        <p>
          Não precisa ser especialista em finanças. Precisa conhecer gente e
          querer ajudar — a gente cuida do resto.
        </p>
      </Bloco>

      <Bloco numero="03" titulo="Por que dá certo">
        <p>
          Crédito é assunto de confiança. Uma indicação de alguém conhecido vale
          muito mais que um anúncio — e é por isso que a gente prefere remunerar
          quem indica a gastar tudo em publicidade.
        </p>
        <p>
          Você ganha, a pessoa indicada resolve o problema dela, e a PegPay
          cresce com quem realmente confia na gente.
        </p>
      </Bloco>

      <Bloco numero="04" titulo="Quanto eu ganho">
        <p>
          As condições de comissão, os valores e as regras de pagamento são
          apresentados no cadastro do programa. Fale com o nosso time pelo
          WhatsApp que a gente explica tudo, sem enrolação.
        </p>
        <p className="rule-t pt-5 text-[14px] text-ink/60">
          A comissão é paga sobre indicações que se tornam contrato. Indicação
          que não vira operação não gera pagamento — a gente prefere dizer isso
          agora do que decepcionar depois.
        </p>
        <a
          href={whatsappUrl("Olá! Quero ser divulgador da PegPay e saber sobre o programa de renda extra.")}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block bg-peg px-8 py-4 font-archivo text-[16px] font-extrabold text-paper transition-colors hover:bg-peg-dark"
        >
          Quero ser divulgador
        </a>
      </Bloco>

      <Bloco numero="05" titulo="Regras que valem sempre">
        <Lista
          itens={[
            "Nunca prometa aprovação. Quem decide o crédito é a análise, não a indicação.",
            "Nunca informe taxa, prazo ou valor de parcela em nome da PegPay. Encaminhe a pessoa para o nosso time.",
            "Nunca peça dinheiro adiantado a quem você indicar. A PegPay não cobra nada para liberar crédito.",
            "Use apenas os materiais oficiais que a gente entrega.",
          ]}
        />
        <p>
          Divulgador que descumprir essas regras sai do programa. Elas existem
          para proteger quem confia em você — e em nós.
        </p>
      </Bloco>
    </PaginaInterna>
  );
}
