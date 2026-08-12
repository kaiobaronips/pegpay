import PaginaInterna, { Bloco, Lista } from "@/components/PaginaInterna";

/**
 * Página institucional. Números: apenas os indicadores oficiais do
 * Blueprint §3. Não acrescente outros sem atualizar o documento.
 */
export default function SobreNos() {
  return (
    <PaginaInterna
      kicker="Sobre nós"
      titulo="O Brasil é feito por quem faz muito com pouco."
      resumo="Desde 2019, a PegPay trabalha para construir uma relação diferente entre pessoas e crédito. Não para conceder empréstimo — para criar acesso."
    >
      <Bloco numero="01" titulo="Por que a gente existe">
        <p>
          Boa parte do mercado financeiro ainda usa modelos que deixam milhões de
          brasileiros de fora. Gente que trabalha, empreende, consome e movimenta
          a economia todos os dias — mas que o sistema não consegue enxergar.
        </p>
        <p>
          A PegPay nasceu para ajudar a mudar isso. A gente desenvolve tecnologia
          e processos capazes de compreender perfis, comportamentos e realidades
          financeiras diferentes do padrão que o banco espera.
        </p>
      </Bloco>

      <Bloco numero="02" titulo="Em números">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <span className="tnum block font-archivo text-[44px] font-extrabold leading-none tracking-[-0.03em] text-peg">
              412 mil
            </span>
            <span className="label mt-3 block text-ink/55">pessoas atendidas</span>
          </div>
          <div>
            <span className="tnum block font-archivo text-[44px] font-extrabold leading-none tracking-[-0.03em] text-peg">
              35%
            </span>
            <span className="label mt-3 block text-ink/55">
              tiveram aqui o primeiro crédito formal
            </span>
          </div>
        </div>
        <p>
          Esse segundo número é o que mais nos orgulha. Para mais de um terço de
          quem passou por aqui, a PegPay foi a primeira vez que o crédito formal
          disse sim.
        </p>
      </Bloco>

      <Bloco numero="03" titulo="Como a gente trabalha">
        <Lista
          itens={[
            <>
              <strong className="font-semibold text-ink">Tecnologia com gente junto.</strong>{" "}
              O app e o site resolvem o que é burocracia. Quem cuida do seu caso é uma pessoa.
            </>,
            <>
              <strong className="font-semibold text-ink">Análise além do score.</strong>{" "}
              Limite no cartão, carteira assinada ou um bem no seu nome contam a seu favor.
            </>,
            <>
              <strong className="font-semibold text-ink">Crédito responsável.</strong>{" "}
              Aprovar quem não tem como pagar não ajuda ninguém. A parcela precisa caber no seu mês.
            </>,
            <>
              <strong className="font-semibold text-ink">Custo na cara.</strong>{" "}
              As condições completas são apresentadas antes de qualquer assinatura. Sem letra miúda.
            </>,
          ]}
        />
      </Bloco>

      <Bloco numero="04" titulo="Nossos valores">
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {[
            ["Acesso", "Criar possibilidades financeiras para mais gente."],
            ["Transparência", "Informação simples, clara e objetiva."],
            ["Agilidade", "Decidir e executar rápido."],
            ["Responsabilidade", "Crédito deve gerar oportunidade, não dependência."],
            ["Segurança", "Proteger dados, dinheiro, operações e confiança."],
            ["Proximidade", "Falar a língua de quem está do outro lado."],
          ].map(([titulo, texto]) => (
            <div key={titulo} className="rule-t pt-4">
              <span className="block font-archivo text-[17px] font-extrabold">{titulo}</span>
              <span className="mt-1 block text-[14px] leading-relaxed text-ink/65">{texto}</span>
            </div>
          ))}
        </div>
      </Bloco>

      <Bloco numero="05" titulo="Quem responde pela empresa">
        <p>
          A PegPay Soluções Digitais foi fundada em 2019 por Kaio Pirolo da Silva,
          João Pedro Perez e Felipe Boim.
        </p>
        <p>
          A empresa atua como correspondente bancário: a análise, a decisão e o
          acompanhamento do seu crédito são nossos; a liberação do dinheiro é
          feita pela instituição financeira parceira, autorizada pelo Banco
          Central. Os dados completos estão no rodapé deste site.
        </p>
      </Bloco>
    </PaginaInterna>
  );
}
