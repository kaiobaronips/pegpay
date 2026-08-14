import PaginaInterna, { Bloco, Lista } from "@/components/PaginaInterna";
import { WHATSAPP_EXIBICAO, WHATSAPP_URL } from "@/lib/contato";

/**
 * MINUTA — precisa de validação jurídica antes de valer como política oficial.
 * O texto descreve práticas gerais de LGPD e não cita fornecedores, prazos de
 * retenção ou contato de encarregado que ainda não foram definidos pela PegPay.
 */
export default function Privacidade() {
  return (
    <PaginaInterna
      kicker="Privacidade"
      titulo="Seus dados, explicados sem letra miúda."
      resumo="Esta página explica quais dados a PegPay coleta, para que usa, com quem compartilha e o que você pode exigir da gente a qualquer momento. Em português claro, do jeito que a gente fala."
      atualizadoEm="agosto de 2026"
    >
      <Bloco numero="01" titulo="Quem trata seus dados">
        <p>
          A PegPay Soluções Digitais é a responsável pelo tratamento dos dados
          pessoais coletados neste site e no aplicativo PegPay. Atuamos como
          correspondente bancário e, para executar as operações de crédito,
          compartilhamos dados com as instituições financeiras parceiras
          identificadas no rodapé deste site.
        </p>
      </Bloco>

      <Bloco numero="02" titulo="Quais dados coletamos">
        <Lista
          itens={[
            <>
              <strong className="font-semibold text-ink">Cadastrais:</strong> nome, CPF,
              data de nascimento, endereço, telefone e e-mail.
            </>,
            <>
              <strong className="font-semibold text-ink">De identidade:</strong> documento
              com foto, selfie e demais elementos usados na validação (KYC) e na
              prevenção a fraudes.
            </>,
            <>
              <strong className="font-semibold text-ink">Financeiros:</strong> renda
              declarada ou comprovada, vínculo empregatício, informações sobre o bem
              dado em garantia e dados obtidos em bureaus de crédito.
            </>,
            <>
              <strong className="font-semibold text-ink">De uso:</strong> páginas
              visitadas, dispositivo, endereço IP e interações com o site e o app.
            </>,
          ]}
        />
        <p>
          Coletamos apenas o que é necessário para a finalidade de cada etapa. Se um
          dado não for preciso para analisar, contratar ou acompanhar a sua operação,
          ele não é pedido.
        </p>
      </Bloco>

      <Bloco numero="03" titulo="Para que usamos">
        <Lista
          itens={[
            "Identificar você e cumprir as regras de KYC e prevenção à fraude.",
            "Analisar crédito, definir condições e formalizar o contrato.",
            "Executar a operação: liberação, cobrança, renegociação e atendimento.",
            "Cumprir obrigações legais e regulatórias aplicáveis ao setor financeiro.",
            "Melhorar produtos e comunicação, sempre com base legal adequada.",
          ]}
        />
      </Bloco>

      <Bloco numero="04" titulo="Bases legais">
        <p>
          Cada tratamento tem uma base legal definida pela LGPD (Lei 13.709/2018):
          execução de contrato e procedimentos preliminares, cumprimento de obrigação
          legal ou regulatória, exercício regular de direitos, legítimo interesse e,
          quando nenhuma das anteriores se aplica, o seu consentimento — que pode ser
          revogado a qualquer momento.
        </p>
      </Bloco>

      <Bloco numero="05" titulo="Com quem compartilhamos">
        <p>
          Compartilhamos dados apenas com quem participa da operação: as instituições
          financeiras parceiras autorizadas pelo Banco Central, bureaus de crédito,
          provedores de validação de identidade e antifraude, e autoridades públicas
          quando a lei exigir.
        </p>
        <p>
          A PegPay não vende dados pessoais e não compartilha suas informações com
          terceiros para publicidade de outras empresas.
        </p>
      </Bloco>

      <Bloco numero="06" titulo="Seus direitos">
        <p>
          A LGPD garante a você um conjunto de direitos sobre seus dados. Você pode
          solicitar a qualquer momento:
        </p>
        <Lista
          itens={[
            "Confirmação de que tratamos seus dados e acesso a eles.",
            "Correção de dados incompletos, inexatos ou desatualizados.",
            "Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.",
            "Portabilidade a outro fornecedor, nos termos da regulamentação.",
            "Informação sobre com quem compartilhamos seus dados.",
            "Revogação do consentimento, quando ele for a base do tratamento.",
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
          Aplicamos controles técnicos e organizacionais para proteger seus dados:
          criptografia em trânsito e em repouso, controle de acesso por perfil,
          registro de operações críticas e monitoramento contínuo. Mantemos os dados
          pelo tempo necessário às finalidades acima e aos prazos legais aplicáveis.
        </p>
        <p>
          Como a gente protege sua conta e como identificar golpes está detalhado na
          página de <a className="font-semibold text-peg underline underline-offset-4" href="/seguranca">Segurança</a>.
        </p>
      </Bloco>

      <Bloco numero="08" titulo="Cookies">
        <p>
          Usamos três categorias de cookies, seguindo o padrão de
          consentimento do Google (Google Consent Mode):
        </p>
        <Lista
          itens={[
            <>
              <strong className="font-semibold text-ink">Necessários:</strong> fazem
              o site funcionar e guardam a sua própria escolha de cookies. Não podem
              ser desligados.
            </>,
            <>
              <strong className="font-semibold text-ink">Analytics:</strong> nos
              ajudam a entender como o site é usado (Google Analytics), só ativos com
              o seu consentimento.
            </>,
            <>
              <strong className="font-semibold text-ink">Marketing:</strong> usados
              para medir e personalizar anúncios (Meta Pixel), só ativos com o seu
              consentimento.
            </>,
          ]}
        />
        <p>
          Você decide o que aceita no aviso de cookies e pode mudar de ideia a
          qualquer momento pelo link "Preferências de cookies", no rodapé do site.
        </p>
      </Bloco>

      <Bloco numero="09" titulo="Como falar com a gente">
        <p>
          Para exercer qualquer um dos direitos acima, ou para tirar dúvidas sobre esta
          política, fale com o time da PegPay pelo WhatsApp oficial{" "}
          <a
            className="font-semibold text-peg underline underline-offset-4"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            {WHATSAPP_EXIBICAO}
          </a>
          . Respondemos em até 1 dia útil.
        </p>
      </Bloco>
    </PaginaInterna>
  );
}
