import { Link } from "react-router";

import PaginaInterna, { Bloco, Lista } from "@/components/PaginaInterna";
import { DPO_EMAIL, DPO_EMAIL_URL, WHATSAPP_URL } from "@/lib/contato";

/**
 * MINUTA DE TERMOS DE USO — exige validação jurídica e societária antes da
 * publicação definitiva. O CNPJ da PegPay ainda aparece como placeholder no
 * rodapé e, por isso, não foi repetido aqui. Também precisam ser confirmados:
 * os contratos vigentes de correspondência, o fluxo final do aplicativo e as
 * instituições responsáveis por cada produto de crédito.
 *
 * A referência enviada pelo cliente descreve conta de pagamento, Pix,
 * marketplace, débito automático e parceiros próprios da Jeitto. Esses itens
 * não foram transportados para a PegPay porque não estão confirmados no projeto.
 */
export default function TermosCondicoes() {
  return (
    <PaginaInterna
      kicker="Termos e Condições de Uso"
      titulo={"Tudo combinado.\nSem letra miúda."}
      resumo="Estes termos explicam as regras para usar o site, falar com a PegPay e iniciar uma jornada de crédito com nossas instituições financeiras parceiras. Leia antes de continuar."
      descricaoSeo="Conheça os Termos e Condições de Uso do site e dos serviços da PegPay, incluindo regras de crédito, segurança, privacidade e atendimento."
      atualizadoEm="agosto de 2026"
      heroLaranja
    >
      <Bloco numero="01" titulo="Sobre estes termos" semLinhaSuperior>
        <p>
          Estes Termos e Condições de Uso regulam o acesso ao site da PegPay, o
          contato com nossos canais oficiais e, quando disponível, o uso do
          aplicativo e de outras jornadas digitais da marca. Ao navegar no site
          ou utilizar uma funcionalidade, você concorda com as regras aplicáveis
          àquela atividade.
        </p>
        <p>
          Uma simulação, proposta ou contratação de crédito também terá documentos
          próprios, apresentados antes da confirmação. Em caso de diferença, o
          instrumento específico do produto prevalece para aquela operação, sem
          afastar os direitos assegurados pela legislação brasileira.
        </p>
        <p>
          Se você não concordar com estes termos, não utilize as funcionalidades
          e não prossiga com a solicitação. A simples visita às páginas públicas
          não obriga você a contratar qualquer produto.
        </p>
      </Bloco>

      <Bloco numero="02" titulo="Quem é a PegPay">
        <p>
          A PegPay Soluções Digitais atua na apresentação e no encaminhamento de
          propostas de crédito como correspondente de instituições autorizadas,
          dentro do arranjo comercial e regulatório informado em cada jornada. A
          atividade de correspondente no País é disciplinada pela Resolução CMN
          nº 4.935/2021.
        </p>
        <div className="border-l-4 border-peg bg-peg-soft p-5 text-ink">
          <p className="font-semibold">
            A PegPay não é banco nem instituição financeira. A análise, a aprovação,
            a formalização, a liberação dos recursos e a gestão do contrato cabem à
            instituição financeira identificada na proposta.
          </p>
        </div>
        <p>
          A PegPay é afiliada ao H CRED Group e atua na distribuição de produtos
          de crédito disponibilizados por instituições parceiras, incluindo a
          Giro.Tech no arranjo atualmente divulgado no site. A instituição
          responsável por cada operação será informada antes da contratação.
        </p>
      </Bloco>

      <Bloco numero="03" titulo="Quem pode usar">
        <p>
          O conteúdo público pode ser consultado por qualquer visitante. Para
          solicitar ou contratar crédito, é preciso ser pessoa natural, ter pelo
          menos 18 anos, possuir capacidade civil, CPF regular e fornecer dados
          verdadeiros, completos e atualizados.
        </p>
        <p>
          Você deve usar seus próprios dados e agir em nome próprio. Não é permitido
          criar cadastro para terceiros, se passar por outra pessoa, apresentar
          documento falso ou usar a jornada para fraude, lavagem de dinheiro,
          ocultação de recursos ou qualquer finalidade ilícita.
        </p>
        <p>
          Quando necessário para análise, segurança ou cumprimento de obrigação
          legal, poderão ser solicitados documentos e verificações adicionais. A
          ausência de informação necessária pode impedir o prosseguimento da
          proposta, sempre respeitada a legislação aplicável.
        </p>
      </Bloco>

      <Bloco numero="04" titulo="Simulação, análise e contratação">
        <p>
          Informações exibidas no site têm caráter informativo. Simulações são
          estimativas e podem mudar após a análise cadastral, de risco, de margem,
          da garantia oferecida ou de outros critérios da instituição financeira.
        </p>
        <Lista
          itens={[
            "Enviar uma solicitação não garante aprovação, limite, taxa, prazo ou liberação de crédito.",
            "A aprovação e as condições finais são definidas pela instituição financeira responsável.",
            "Antes da confirmação, você deve receber as condições essenciais da operação, inclusive valor liberado, prazo, parcelas, taxas, tributos, encargos e Custo Efetivo Total (CET).",
            "Você deve revisar os dados, comparar alternativas e avaliar se as parcelas cabem no seu orçamento.",
            "A contratação só é concluída após os aceites, verificações e documentos exigidos para o produto.",
          ]}
        />
        <p>
          As regras de pagamento, atraso, quitação antecipada, cobrança, garantias e
          eventual cessão do crédito constarão no contrato específico. Nenhuma parte
          destes termos reduz o direito do consumidor à informação clara ou à
          liquidação antecipada com redução proporcional dos juros e demais acréscimos,
          quando aplicável.
        </p>
      </Bloco>

      <Bloco numero="05" titulo="Uso correto dos canais">
        <p>Ao utilizar o site e os canais da PegPay, você se compromete a:</p>
        <Lista
          itens={[
            "Fornecer apenas informações verdadeiras e manter seus dados de contato atualizados.",
            "Não tentar acessar áreas, sistemas, contas ou dados sem autorização.",
            "Não introduzir vírus, código malicioso, automações abusivas ou qualquer recurso que prejudique a plataforma.",
            "Não copiar, extrair, revender ou explorar comercialmente o conteúdo e a tecnologia da PegPay sem autorização.",
            "Não usar a marca, o site ou os canais para enganar terceiros, praticar fraude ou violar direitos.",
          ]}
        />
        <p>
          A PegPay poderá limitar o acesso a uma funcionalidade quando houver indício
          concreto de fraude, risco de segurança, uso ilegal, ordem de autoridade ou
          descumprimento destes termos. Quando possível e permitido, informaremos o
          motivo e os caminhos disponíveis para esclarecimento.
        </p>
      </Bloco>

      <Bloco numero="06" titulo="Sua segurança também conta">
        <p>
          Senhas, códigos de verificação, tokens e acessos ao seu celular são pessoais.
          Não compartilhe essas informações e confira sempre o endereço do site, o
          destinatário de mensagens e os documentos antes de confirmar uma ação.
        </p>
        <div className="border-l-4 border-peg bg-peg-soft p-5 text-ink">
          <p className="font-semibold">
            A PegPay não cobra pagamento antecipado para liberar crédito e não pede
            senha, token ou código de verificação por ligação ou mensagem. Desconfie
            de qualquer solicitação desse tipo.
          </p>
        </div>
        <p>
          Se perder o aparelho, suspeitar de acesso indevido ou receber um contato
          falso, procure imediatamente o atendimento oficial. Medidas de segurança
          reduzem riscos, mas nenhum ambiente digital é totalmente imune a falhas;
          por isso, cada ocorrência será analisada conforme as evidências e as
          responsabilidades previstas em lei.
        </p>
        <Link
          to="/seguranca"
          className="inline-flex items-center gap-3 font-extrabold text-peg-deep underline underline-offset-4"
        >
          Veja os alertas de segurança da PegPay
          <span aria-hidden="true">→</span>
        </Link>
      </Bloco>

      <Bloco numero="07" titulo="Privacidade, crédito e SCR">
        <p>
          O tratamento de dados pessoais segue a legislação aplicável e está
          detalhado na Política de Privacidade. Conforme a jornada utilizada,
          poderão ser tratados dados cadastrais, de contato, de navegação, de
          segurança e os necessários para analisar e formalizar uma proposta.
        </p>
        <p>
          Instituições financeiras parceiras podem consultar bases de proteção ao
          crédito e, com a autorização específica exigida, o Sistema de Informações
          de Créditos do Banco Central (SCR). A finalidade, a instituição responsável
          e os dados necessários devem ser informados no fluxo correspondente.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Link
            to="/privacidade"
            className="font-extrabold text-peg-deep underline underline-offset-4"
          >
            Ler a Política de Privacidade
          </Link>
          <Link
            to="/scr-bcb"
            className="font-extrabold text-peg-deep underline underline-offset-4"
          >
            Entender o SCR do Banco Central
          </Link>
        </div>
      </Bloco>

      <Bloco numero="08" titulo="Serviços e sites de terceiros">
        <p>
          A jornada pode levar você ao WhatsApp, às lojas de aplicativos, a sites
          governamentais ou ao ambiente de uma instituição financeira parceira.
          Esses serviços são operados por terceiros e podem ter termos, políticas
          de privacidade e medidas de segurança próprios.
        </p>
        <p>
          A presença de um link não significa que a PegPay controla o serviço de
          destino. Antes de fornecer dados ou contratar, confirme o responsável,
          leia os documentos aplicáveis e verifique se está em um canal oficial.
          A PegPay continua responsável pelos atos que a lei atribuir à sua própria
          atuação e não exclui direitos obrigatórios do consumidor.
        </p>
      </Bloco>

      <Bloco numero="09" titulo="Disponibilidade e atualizações do serviço">
        <p>
          Trabalhamos para manter o site e as jornadas disponíveis e seguras, mas
          interrupções podem ocorrer por manutenção, atualização, falha de rede,
          indisponibilidade de parceiros, evento de força maior ou medida de segurança.
          Sempre que possível, buscaremos reduzir o impacto e restabelecer o serviço.
        </p>
        <p>
          Funcionalidades podem ser incluídas, ajustadas ou descontinuadas. Um novo
          produto só vinculará você depois da apresentação das condições aplicáveis e
          de uma manifestação válida de aceite quando ela for necessária. Alterações
          na plataforma não modificam retroativamente um contrato de crédito já
          assinado.
        </p>
      </Bloco>

      <Bloco numero="10" titulo="Marca e conteúdo">
        <p>
          Textos, identidade visual, logotipos, ilustrações, fotografias, vídeos,
          interfaces, códigos e demais elementos da PegPay são protegidos pela
          legislação de propriedade intelectual ou utilizados mediante licença.
        </p>
        <p>
          Você pode acessar e compartilhar links para uso pessoal e informativo.
          Não pode remover avisos de titularidade, imitar a identidade da marca,
          reproduzir conteúdo em escala, criar página falsa ou explorar esses
          materiais comercialmente sem autorização prévia.
        </p>
      </Bloco>

      <Bloco numero="11" titulo="Responsabilidades e direitos do consumidor">
        <p>
          Cada participante responde pela atividade que efetivamente realiza: a
          PegPay por sua atuação, atendimento e tecnologia; a instituição financeira
          pela análise, contratação e gestão do crédito; e você pela veracidade dos
          dados e pelo uso seguro de suas credenciais.
        </p>
        <p>
          Nada nestes termos afasta responsabilidades que não possam ser excluídas
          pela lei, nem limita direitos previstos no Código de Defesa do Consumidor.
          Eventuais problemas serão avaliados conforme o fato, o nexo causal, as
          evidências disponíveis e as obrigações de cada parte.
        </p>
      </Bloco>

      <Bloco numero="12" titulo="Alterações destes termos">
        <p>
          Estes termos podem ser atualizados para refletir mudanças legais,
          regulatórias, tecnológicas ou nos serviços. A versão vigente e a data da
          última atualização permanecerão disponíveis nesta página.
        </p>
        <p>
          Quando uma mudança for relevante para uma funcionalidade ativa, a PegPay
          adotará uma forma razoável de comunicação e solicitará novo aceite se a
          natureza da alteração ou a legislação exigir. Mudanças nestes termos não
          substituem aditivos ou comunicações previstos no contrato específico de
          uma operação financeira.
        </p>
      </Bloco>

      <Bloco numero="13" titulo="Comunicação e atendimento">
        <p>
          A PegPay poderá enviar informações operacionais pelos canais fornecidos por
          você, respeitando as preferências de comunicação e a legislação aplicável.
          Nunca considere como oficial um pedido de pagamento antecipado ou de
          compartilhamento de senha e código de segurança.
        </p>
        <p>
          Para atendimento geral, fale pelo WhatsApp oficial. Para exercer direitos
          sobre dados pessoais, escreva para o canal de privacidade.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center bg-peg px-6 py-3.5 font-archivo text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            WhatsApp oficial
          </a>
          <a
            href={DPO_EMAIL_URL}
            className="inline-flex items-center border-2 border-ink bg-paper px-6 py-3 font-archivo text-[15px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {DPO_EMAIL}
          </a>
        </div>
      </Bloco>

      <Bloco numero="14" titulo="Lei aplicável e disposições finais">
        <p>
          Estes termos são regidos pelas leis da República Federativa do Brasil,
          inclusive pelo Código de Defesa do Consumidor, pelo Marco Civil da Internet
          e pela Lei Geral de Proteção de Dados, quando aplicáveis.
        </p>
        <p>
          Se uma cláusula for considerada inválida ou inexequível, as demais continuam
          válidas na medida permitida por lei. A tolerância a um descumprimento pontual
          não significa renúncia a direito nem alteração permanente destes termos.
        </p>
        <p>
          Conflitos serão tratados primeiro pelos canais de atendimento, sem impedir o
          acesso aos órgãos de defesa do consumidor ou ao Poder Judiciário. Fica
          preservado o foro do domicílio do consumidor sempre que a legislação assim
          assegurar.
        </p>
        <p>
          Aceites eletrônicos, registros de data e horário, endereço IP, dispositivo e
          outros mecanismos de autenticação podem ser utilizados para demonstrar ações
          realizadas na plataforma, respeitadas as regras de privacidade, segurança e
          a possibilidade de contestação prevista em lei.
        </p>
      </Bloco>
    </PaginaInterna>
  );
}
