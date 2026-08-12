/**
 * Configuração dos três produtos de crédito da PegPay.
 *
 * ⚠️ AS TAXAS ABAIXO SÃO PROVISÓRIAS E NÃO SÃO POLÍTICA OFICIAL.
 *
 * Nenhuma política real de taxa, limite ou prazo foi definida pela área de
 * Risco (ver Blueprint §11 e §15.4). Elas existem aqui apenas para o
 * simulador do site produzir uma parcela estimada.
 *
 * Por decisão da direção (ADR-003), o site NÃO exibe taxa nem CET em
 * nenhuma página — mas a parcela mostrada ao cliente deriva destes números.
 * Antes de o site ir ao ar com eles, Risco precisa fornecer os valores reais.
 *
 * Este é o único lugar do site onde taxa aparece. Não replique.
 */

export type ProdutoId = "cartao" | "clt" | "garantia";

export interface Produto {
  id: ProdutoId;
  slug: string;
  nome: string;
  nomeCurto: string;
  chamada: string;
  descricao: string;
  /** Taxa mensal provisória usada só para estimar a parcela. Nunca exibida. */
  taxaProvisoria: number;
  valorMin: number;
  valorMax: number;
  valorPadrao: number;
  passo: number;
  prazoMin: number;
  prazoMax: number;
  prazoPadrao: number;
  /** O que o cliente precisa ter para se qualificar. */
  requisitos: string[];
  /** Diferenciais, sem citar taxa. */
  destaques: { titulo: string; texto: string }[];
  imagem: string;
  imagemAlt: string;
}

export const PRODUTOS: Record<ProdutoId, Produto> = {
  cartao: {
    id: "cartao",
    slug: "/para-voce/emprestimo-com-cartao",
    nome: "Empréstimo com cartão de crédito",
    nomeCurto: "Empréstimo com cartão",
    chamada: "Seu limite vira dinheiro na conta.",
    descricao:
      "Você usa o limite disponível no seu cartão de crédito para pegar dinheiro — sem precisar ter o nome limpo. Tudo digital, do pedido à liberação.",
    taxaProvisoria: 0.0489,
    valorMin: 300,
    valorMax: 20000,
    valorPadrao: 3000,
    passo: 100,
    prazoMin: 3,
    prazoMax: 18,
    prazoPadrao: 12,
    requisitos: [
      "Cartão de crédito com limite disponível",
      "CPF regular",
      "Não exige nome limpo",
    ],
    destaques: [
      {
        titulo: "Nome sujo não trava",
        texto:
          "A análise olha o limite que você já tem no cartão, não só o seu score. Quem foi negado no banco costuma conseguir aqui.",
      },
      {
        titulo: "Rápido de verdade",
        texto:
          "Sem fila, sem agência, sem papelada. Você fala com a gente, envia o que for preciso e acompanha tudo pelo app.",
      },
      {
        titulo: "Parcela fixa",
        texto:
          "A parcela que você combina é a que você paga até a última. Sem reajuste no meio do caminho.",
      },
    ],
    imagem: "/images/hero-cartao.png",
    imagemAlt:
      "Ilustração PegPay com cartão de crédito, escudo e relógio representando empréstimo rápido",
  },

  clt: {
    id: "clt",
    slug: "/para-voce/credito-consignado-clt",
    nome: "Crédito Consignado CLT",
    nomeCurto: "Consignado CLT",
    chamada: "Carteira assinada abre porta.",
    descricao:
      "Para quem trabalha com carteira assinada. A parcela é descontada direto da folha de pagamento — você não corre risco de esquecer, e as condições ficam mais leves por isso.",
    taxaProvisoria: 0.0189,
    valorMin: 500,
    valorMax: 50000,
    valorPadrao: 8000,
    passo: 500,
    prazoMin: 6,
    prazoMax: 48,
    prazoPadrao: 24,
    requisitos: [
      "Carteira de trabalho assinada",
      "Margem consignável disponível",
      "Empresa conveniada",
    ],
    destaques: [
      {
        titulo: "Desconto direto na folha",
        texto:
          "A parcela sai antes de o salário cair na sua conta. Nada de boleto esquecido nem juros de atraso.",
      },
      {
        titulo: "Condições mais leves",
        texto:
          "Como o desconto é automático, o risco da operação cai — e isso volta para você em condições melhores que as do crédito comum.",
      },
      {
        titulo: "Prazo mais longo",
        texto:
          "Dá para dividir em mais parcelas, deixando o valor mensal menor e mais fácil de caber no orçamento.",
      },
    ],
    imagem: "/images/app.jpg",
    imagemAlt:
      "Ilustração PegPay representando trabalhador com carteira assinada e crédito consignado",
  },

  garantia: {
    id: "garantia",
    slug: "/para-voce/emprestimo-com-garantia",
    nome: "Empréstimo com garantia",
    nomeCurto: "Empréstimo com garantia",
    chamada: "O que você já tem vira o que você precisa.",
    descricao:
      "Use o veículo ou o imóvel que já é seu como garantia. O bem continua no seu nome e no seu uso — ele só fica alienado enquanto o contrato durar.",
    taxaProvisoria: 0.0129,
    valorMin: 5000,
    valorMax: 500000,
    valorPadrao: 50000,
    passo: 1000,
    prazoMin: 12,
    prazoMax: 120,
    prazoPadrao: 48,
    requisitos: [
      "Veículo ou imóvel em seu nome",
      "Bem quitado ou em fase final de financiamento",
      "Documentação regular do bem",
    ],
    destaques: [
      {
        titulo: "O bem continua com você",
        texto:
          "Alienação não é venda. Você continua usando o carro ou morando no imóvel normalmente durante todo o contrato.",
      },
      {
        titulo: "Valores maiores",
        texto:
          "Como existe um bem lastreando a operação, dá para pegar valores bem acima do crédito pessoal comum.",
      },
      {
        titulo: "Prazo longo",
        texto:
          "Mais tempo para pagar significa parcela menor. É o produto certo para quem precisa de fôlego, não de pressa.",
      },
    ],
    imagem: "/images/veiculo.jpg",
    imagemAlt:
      "Ilustração PegPay de veículo com escudo e chave representando crédito com garantia",
  },
};

export const LISTA_PRODUTOS: Produto[] = [
  PRODUTOS.cartao,
  PRODUTOS.clt,
  PRODUTOS.garantia,
];

/** Parcela pela Tabela Price. */
export function calcularParcela(valor: number, taxa: number, prazo: number) {
  return (valor * taxa) / (1 - Math.pow(1 + taxa, -prazo));
}
