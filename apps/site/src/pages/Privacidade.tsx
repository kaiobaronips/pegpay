import PaginaInterna, { Bloco, Lista } from "@/components/PaginaInterna";
import { WHATSAPP_EXIBICAO, WHATSAPP_URL } from "@/lib/contato";

/**
 * MINUTA — revisada por auditoria jurídica (agente advogado, 2026-08-14) à
 * luz da LGPD, mas ainda precisa de validação por advogado com OAB ativa
 * antes de valer como política oficial. Pendências apontadas na auditoria,
 * que precisam de decisão humana da PegPay:
 *
 * 1. Nomear o encarregado de dados (DPO) — art. 41 LGPD. Bloco 09 usa o
 *    WhatsApp como canal provisório enquanto isso não acontece.
 * 2. Confirmar o CNPJ real da PegPay — o placeholder do rodapé/Bloco 01
 *    não pode ir ao ar como identificação oficial do controlador.
 * 3. Definir prazos de retenção por categoria de dado junto com jurídico
 *    e compliance (Bloco 07 hoje só declara o critério, sem prazo fechado).
 * 4. Confirmar fornecedores de KYC/antifraude quando contratados, para
 *    nomeá-los no Bloco 05 em vez da descrição genérica de categoria.
 * 5. Validar com a Giro.Tech se o desenho de controladoria conjunta
 *    (art. 42, §1º, I) do Bloco 01 reflete o que os contratos entre
 *    PegPay/H CRED/Giro.Tech de fato estabelecem.
 *
 * A auditoria também corrigiu um erro de fundo: a versão anterior descrevia
 * coleta de dado cadastral/financeiro/KYC como se já acontecesse pelo site
 * — o site não tem cadastro, login ou formulário; essa coleta é do produto
 * PegPay (app), ainda em desenvolvimento. O texto abaixo separa
 * explicitamente "o que o site coleta hoje" de "o que o app vai coletar".
 */
export default function Privacidade() {
  return (
    <PaginaInterna
      kicker="Privacidade"
      titulo="Seus dados, explicados sem letra miúda."
      resumo="Esta página explica quais dados a PegPay coleta, para que usa, com quem compartilha e o que você pode exigir da gente a qualquer momento. Em português claro, do jeito que a gente fala — sem esconder o que ainda estamos ajustando."
      descricaoSeo="Quais dados a PegPay coleta, para que usa, com quem compartilha e quais são os seus direitos pela LGPD. Em português claro, sem letra miúda."
      atualizadoEm="agosto de 2026"
    >
      <Bloco numero="01" titulo="Quem trata seus dados">
        <p>
          A PegPay Soluções Digitais é uma correspondente bancária — não somos banco
          nem instituição financeira. Somos afiliados ao H CRED Group (H Group
          Soluções Ltda, CNPJ 43.261.490/0001-92) e distribuímos produtos de crédito
          da financeira Giro.Tech (Giro Tecnologia), instituição financeira
          registrada no Banco Central do Brasil.
        </p>
        <p>
          Na prática: a PegPay define a forma de indicação e capta seu interesse —
          quem decide, libera e recebe o crédito é a Giro.Tech, segundo essa
          política. Para essa finalidade, PegPay e Giro.Tech tratam seus dados em
          conjunto, cada uma responsável pela parte que lhe cabe, nos termos do
          art. 42 da LGPD (Lei 13.709/2018).
        </p>
      </Bloco>

      <Bloco numero="02" titulo="Quais dados coletamos">
        <p>
          Aqui separamos o que acontece <strong className="font-semibold text-ink">hoje, neste site</strong>,
          do que vai acontecer quando você usar o <strong className="font-semibold text-ink">produto PegPay
          como um todo</strong> — incluindo o aplicativo, que ainda está em
          desenvolvimento.
        </p>
        <div>
          <p className="font-semibold text-ink">Neste site institucional, hoje:</p>
          <p className="mt-2">
            Coletamos apenas dado de navegação — endereço IP, identificadores de
            dispositivo e sessão, páginas visitadas, origem de acesso — via cookies
            necessários e, com o seu consentimento, cookies de Analytics e Marketing
            (detalhes no Bloco 08). Este site não tem cadastro, não tem área logada
            e não tem formulário. Toda conversa vira contato direto pelo nosso
            WhatsApp oficial.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink">No produto PegPay (app, quando disponível):</p>
          <p className="mt-2">
            Quando você criar conta, se cadastrar ou solicitar uma proposta de
            crédito, vamos tratar dados cadastrais (nome, CPF, contato), dados de
            identidade (documento, foto, biometria quando aplicável), dados
            financeiros (renda, vínculo empregatício, histórico de crédito) e dados
            de uso do aplicativo. <strong className="font-semibold text-ink">Essa coleta ainda não está em
            operação</strong> — vamos atualizar esta política, com o detalhamento
            completo dessa etapa, antes do lançamento do app.
          </p>
        </div>
      </Bloco>

      <Bloco numero="03" titulo="Para que usamos">
        <Lista
          itens={[
            "Dado de navegação do site: entender como você chega até a gente, medir desempenho de páginas e campanhas (com o seu consentimento), e manter o site funcionando com segurança.",
            "Contato via WhatsApp: responder sua dúvida ou iniciar seu atendimento.",
            "Dados do produto de crédito, quando o app estiver ativo: avaliar sua proposta, verificar identidade, cumprir exigências regulatórias de prevenção a fraude e lavagem de dinheiro, e formalizar e acompanhar seu contrato.",
          ]}
        />
      </Bloco>

      <Bloco numero="04" titulo="Bases legais">
        <p>Cada finalidade tem sua própria base — não usamos uma base genérica para tudo:</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[14px] leading-relaxed">
            <thead>
              <tr className="border-b-2 border-ink/15 text-left">
                <th className="py-2 pr-4 font-archivo font-extrabold text-ink">Finalidade</th>
                <th className="py-2 font-archivo font-extrabold text-ink">Base legal</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Cookies necessários ao funcionamento do site", "Legítimo interesse do controlador (art. 7º, IX)"],
                ["Cookies de Analytics", "Seu consentimento (art. 7º, I c/c art. 8º)"],
                ["Cookies de Marketing", "Seu consentimento (art. 7º, I c/c art. 8º)"],
                ["Atendimento via WhatsApp a seu pedido", "Procedimento preliminar a pedido do titular (art. 7º, V)"],
                [
                  "Avaliação de proposta de crédito (produto futuro)",
                  "Execução de contrato/procedimento preliminar (art. 7º, V) e obrigação legal de identificação de cliente (KYC/PLD-FT)",
                ],
                [
                  "Consulta a histórico de crédito, incluindo Cadastro Positivo (produto futuro)",
                  "Regime específico da Lei Complementar 166/2019, com direito de exclusão (opt-out) próprio",
                ],
                [
                  "Prevenção a fraude (produto futuro)",
                  "Legítimo interesse (art. 7º, IX), com avaliação documentada de proporcionalidade",
                ],
              ].map(([finalidade, base]) => (
                <tr key={finalidade} className="border-b border-ink/10 align-top">
                  <td className="py-2.5 pr-4 text-ink/75">{finalidade}</td>
                  <td className="py-2.5 text-ink/75">{base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bloco>

      <Bloco numero="05" titulo="Com quem compartilhamos">
        <Lista
          itens={[
            <>
              <strong className="font-semibold text-ink">Giro.Tech (Giro Tecnologia):</strong> recebe
              os dados necessários para decidir, formalizar e liberar seu crédito, na
              condição de instituição financeira responsável pela operação.
            </>,
            <>
              <strong className="font-semibold text-ink">H CRED Group (H Group Soluções Ltda):</strong> grupo
              econômico ao qual a PegPay é afiliada, com acesso aos dados necessários
              à gestão do arranjo de correspondência bancária.
            </>,
            <>
              <strong className="font-semibold text-ink">Prestadores de tecnologia do site:</strong> Google
              (Analytics, com seu consentimento) e Meta (Pixel, com seu
              consentimento) — apenas dado de navegação, nunca dado cadastral ou
              financeiro, já que o site não coleta esse tipo de dado.
            </>,
            <>
              <strong className="font-semibold text-ink">Futuros fornecedores de verificação de identidade e
              antifraude:</strong> quando o app entrar em operação, vamos contratar
              fornecedores especializados em KYC e prevenção a fraude. Assim que
              definidos, listamos aqui os nomes e finalidades específicas.
            </>,
          ]}
        />
        <p>
          Não vendemos seus dados. Não compartilhamos dado financeiro ou cadastral
          com ninguém fora dessa cadeia sem base legal ou seu consentimento
          explícito.
        </p>
      </Bloco>

      <Bloco numero="06" titulo="Seus direitos">
        <p>Conforme o art. 18 da LGPD, você pode a qualquer momento:</p>
        <Lista
          itens={[
            "Confirmar se tratamos algum dado seu.",
            "Acessar o que temos sobre você.",
            "Corrigir dado incompleto, inexato ou desatualizado.",
            "Pedir anonimização, bloqueio ou eliminação de dado desnecessário ou tratado fora da lei.",
            "Pedir portabilidade dos seus dados a outro fornecedor.",
            "Pedir eliminação dos dados tratados com base no seu consentimento.",
            "Saber com quem compartilhamos seus dados.",
            "Saber as consequências de não fornecer o seu consentimento.",
            "Revogar seu consentimento a qualquer momento, sem afetar tratamentos anteriores feitos enquanto ele estava ativo.",
          ]}
        />
        <p>
          Alguns dados precisam ser mantidos mesmo após um pedido de exclusão, por
          exigência legal ou regulatória — por exemplo, registros de operações de
          crédito. Nesses casos, explicamos qual obrigação nos impede de apagar.
        </p>
      </Bloco>

      <Bloco numero="07" titulo="Segurança e retenção">
        <p>
          Usamos medidas técnicas e administrativas para proteger seus dados contra
          acesso não autorizado, perda ou vazamento.
        </p>
        <p>
          Sobre por quanto tempo guardamos: hoje, dado de navegação do site é
          mantido pelo prazo de validade de cada cookie (ver Bloco 08). Para dados
          do produto de crédito, vamos aplicar os prazos legais de guarda documental
          e regulatória do setor financeiro — <strong className="font-semibold text-ink">estamos
          formalizando esses prazos por categoria de dado</strong> e vamos publicar
          aqui assim que definidos. Enquanto isso, qualquer dado é mantido apenas
          pelo tempo necessário à finalidade que motivou sua coleta, conforme
          art. 15 da LGPD.
        </p>
        <p>
          Como a gente protege sua conta e como identificar golpes está detalhado na
          página de <a className="font-semibold text-peg underline underline-offset-4" href="/seguranca">Segurança</a>.
        </p>
      </Bloco>

      <Bloco numero="08" titulo="Cookies">
        <p>Usamos três categorias de cookies:</p>
        <Lista
          itens={[
            <>
              <strong className="font-semibold text-ink">Necessários:</strong> sempre ativos,
              essenciais para o site funcionar (por exemplo, lembrar sua escolha de
              consentimento). Não pedem permissão porque não têm alternativa de
              desligar.
            </>,
            <>
              <strong className="font-semibold text-ink">Analytics</strong> (Google Analytics 4):
              medem como você usa o site, para melhorarmos a experiência. Só ativam
              se você autorizar.
            </>,
            <>
              <strong className="font-semibold text-ink">Marketing</strong> (Meta Pixel): ajudam a
              medir e otimizar nossas campanhas. Só ativam se você autorizar.
            </>,
          ]}
        />
        <p>
          Nada de Analytics ou Marketing carrega antes do seu consentimento
          explícito — usamos o Google Consent Mode v2 para isso. Você decide o que
          aceita no aviso de cookies e pode mudar de ideia a qualquer momento pelo
          link "Preferências de cookies", no rodapé do site.
        </p>
      </Bloco>

      <Bloco numero="09" titulo="Como falar com a gente">
        <p>
          Estamos formalizando a indicação do nosso encarregado de proteção de
          dados (DPO), conforme exige o art. 41 da LGPD. Até lá, qualquer dúvida
          sobre privacidade ou pedido relacionado aos seus direitos pode ser feito
          pelo nosso WhatsApp oficial{" "}
          <a
            className="font-semibold text-peg underline underline-offset-4"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            {WHATSAPP_EXIBICAO}
          </a>
          . Vamos direcionar sua solicitação internamente com prioridade e
          atualizar este canal assim que o encarregado for nomeado. Respondemos em
          até 1 dia útil.
        </p>
      </Bloco>
    </PaginaInterna>
  );
}
