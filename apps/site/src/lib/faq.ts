/**
 * Perguntas frequentes, compartilhadas entre a home (resumo) e a página
 * de Ajuda (completa).
 *
 * ADR-003: nenhuma resposta informa taxa, percentual ou CET. Quando a
 * pergunta for sobre custo, a resposta diz onde a informação é apresentada.
 */

export interface Pergunta {
  p: string;
  r: string;
  /** Aparece no resumo da home. */
  destaque?: boolean;
}

export const PERGUNTAS: Pergunta[] = [
  {
    p: "Quais empréstimos a PegPay oferece?",
    r: "Três modalidades: empréstimo com cartão de crédito, crédito consignado CLT e empréstimo com garantia de veículo ou imóvel. Cada uma atende um momento diferente — o time ajuda você a escolher a que faz mais sentido para o seu caso.",
    destaque: true,
  },
  {
    p: "Preciso ter o nome limpo?",
    r: "Não necessariamente. No empréstimo com cartão de crédito, o que conta é o limite disponível no seu cartão. A gente olha além do score: limite no cartão, carteira assinada ou um bem no seu nome pesam a seu favor.",
    destaque: true,
  },
  {
    p: "Quanto tempo leva para o dinheiro cair?",
    r: "Depois do contrato assinado, até 2 dias úteis. A análise costuma levar horas, não semanas — e você acompanha cada etapa pelo app ou direto com quem está cuidando do seu caso.",
    destaque: true,
  },
  {
    p: "Como fico sabendo das condições?",
    r: "O time apresenta as condições completas do seu contrato — valor, prazo, parcela, taxa e CET — antes de qualquer assinatura. Nada de letra miúda: você decide sabendo exatamente quanto custa.",
    destaque: true,
  },
  {
    p: "O meu veículo ou imóvel fica no meu nome?",
    r: "Sim. No empréstimo com garantia, o bem fica alienado à operação apenas como garantia do contrato. Você continua usando o carro ou morando no imóvel normalmente e, quitadas as parcelas, a alienação é removida. Nada de transferência de propriedade.",
    destaque: true,
  },
  {
    p: "Como funciona o consignado CLT?",
    r: "É para quem tem carteira assinada. A parcela é descontada direto da folha de pagamento, então você não corre risco de esquecer o vencimento. O valor disponível depende da sua margem consignável e da empresa onde você trabalha.",
  },
  {
    p: "Preciso ir a alguma agência?",
    r: "Não. Todo o processo é digital: você fala com a gente pelo WhatsApp ou pelo app, envia os documentos pela câmera do celular e acompanha tudo de onde estiver.",
  },
  {
    p: "E se eu atrasar uma parcela?",
    r: "A gente negocia antes de cobrar. Você pode remarcar a data ou renegociar o contrato falando com o nosso time. No empréstimo com garantia, o bem é sempre o último recurso — nosso trabalho é fazer a parcela caber no seu mês desde o começo.",
  },
  {
    p: "A PegPay entra em contato pelas redes sociais?",
    r: "Nunca. Toda a jornada acontece no app, neste site ou no nosso WhatsApp oficial. Desconfie de qualquer contato pedindo pagamento antecipado para liberar crédito: a PegPay nunca faz essa cobrança.",
    destaque: true,
  },
  {
    p: "Como sei que é mesmo a PegPay falando comigo?",
    r: "Confira o número. O nosso WhatsApp oficial está no rodapé deste site e na página de Segurança. Perfis em redes sociais, números diferentes e links encurtados recebidos por mensagem não são canais da PegPay.",
  },
];

export const PERGUNTAS_DESTAQUE = PERGUNTAS.filter((q) => q.destaque);
