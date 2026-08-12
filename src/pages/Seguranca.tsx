import PaginaInterna, { Bloco, Lista } from "@/components/PaginaInterna";
import { WHATSAPP_EXIBICAO, WHATSAPP_URL } from "@/lib/contato";

/**
 * Página de segurança e prevenção a golpes. Descreve práticas gerais e os
 * canais oficiais — sem citar fornecedores ou certificações não confirmadas.
 */
export default function Seguranca() {
  return (
    <PaginaInterna
      kicker="Segurança"
      titulo="Golpe não avisa. A gente avisa."
      resumo="Como a PegPay protege seus dados e seu dinheiro, o que a gente nunca vai pedir e o que fazer se alguém entrar em contato se passando pela PegPay."
      atualizadoEm="agosto de 2026"
    >
      <Bloco numero="01" titulo="A PegPay nunca pede pagamento antecipado">
        <p>
          Esta é a regra mais importante desta página. A PegPay{" "}
          <strong className="font-semibold text-ink">
            nunca cobra qualquer valor para liberar crédito
          </strong>
          . Nem taxa, nem seguro, nem "depósito de garantia", nem antecipação de
          parcela. Se alguém pedir isso em nome da PegPay, é golpe — encerre a conversa
          e avise a gente.
        </p>
      </Bloco>

      <Bloco numero="02" titulo="O que a gente nunca vai pedir">
        <Lista
          itens={[
            "Sua senha do app, do banco ou de qualquer outro serviço.",
            "Código de verificação recebido por SMS, e-mail ou WhatsApp.",
            "Pagamento antecipado, sob qualquer nome, para liberar o crédito.",
            "Transferência para conta de pessoa física.",
            "Instalação de aplicativo de acesso remoto ao seu celular ou computador.",
          ]}
        />
      </Bloco>

      <Bloco numero="03" titulo="Canais oficiais">
        <p>
          Toda a jornada da PegPay acontece em três lugares, e só neles: este site
          (pegpay.com.br), o aplicativo PegPay e o WhatsApp oficial{" "}
          <a
            className="font-semibold text-peg underline underline-offset-4"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            {WHATSAPP_EXIBICAO}
          </a>
          .
        </p>
        <p>
          Antes de responder qualquer contato, confira o número. Perfis em redes
          sociais, números diferentes do oficial e links encurtados recebidos por
          mensagem não são canais da PegPay.
        </p>
      </Bloco>

      <Bloco numero="04" titulo="Como protegemos seus dados">
        <Lista
          itens={[
            "Criptografia dos dados em trânsito e em repouso.",
            "Autenticação da sua conta e verificação de identidade no onboarding.",
            "Controle de acesso por perfil: cada pessoa do time vê só o necessário.",
            "Registro auditável das operações críticas da sua conta e do seu contrato.",
            "Monitoramento contínuo e mecanismos antifraude ao longo da jornada.",
          ]}
        />
        <p>
          O tratamento dos seus dados pessoais está descrito na página de{" "}
          <a className="font-semibold text-peg underline underline-offset-4" href="/privacidade">
            Privacidade
          </a>
          .
        </p>
      </Bloco>

      <Bloco numero="05" titulo="Como se proteger">
        <Lista
          itens={[
            "Baixe o app apenas pelas lojas oficiais da Apple e do Google.",
            "Não compartilhe senhas nem códigos de verificação com ninguém — nem com quem disser que é da PegPay.",
            "Desconfie de urgência: golpe sempre tem pressa e sempre tem uma oferta boa demais.",
            "Confira o remetente antes de clicar em qualquer link recebido por mensagem.",
            "Mantenha o sistema do seu celular e o app atualizados.",
          ]}
        />
      </Bloco>

      <Bloco numero="06" titulo="Suspeitou? Fale com a gente">
        <p>
          Se você recebeu um contato estranho em nome da PegPay, ou acha que caiu em um
          golpe, entre em contato pelo WhatsApp oficial o quanto antes. Quanto mais
          rápido a gente souber, mais rápido consegue agir — e mais gente a gente
          consegue avisar.
        </p>
        <p>
          Em caso de fraude consumada, registre também um boletim de ocorrência e
          comunique o seu banco.
        </p>
      </Bloco>
    </PaginaInterna>
  );
}
