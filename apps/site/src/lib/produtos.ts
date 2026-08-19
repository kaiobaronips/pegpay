/**
 * Configuração dos três produtos de crédito da PegPay.
 *
 * **Não há taxa neste arquivo, e não deve voltar a haver.** As taxas
 * provisórias que viviam aqui foram removidas em 2026-08-16: não eram
 * política oficial de crédito (Blueprint §11 e §15.4) e alimentavam uma
 * parcela em reais exibida ao cliente no simulador. Ver a atualização do
 * ADR-003.
 *
 * Os limites de valor e prazo abaixo definem apenas as faixas dos controles
 * do simulador — não são promessa de aprovação nem política de limite.
 *
 * Quando Risco definir a política real, ela vive no backend, não aqui: o
 * site nunca é autoridade sobre crédito, pricing ou limite.
 */

export type ProdutoId = "cartao" | "clt" | "garantia";

export interface Produto {
  id: ProdutoId;
  slug: string;
  nome: string;
  nomeCurto: string;
  chamada: string;
  descricao: string;
  /**
   * Meta description, quando a `descricao` visível passa de ~155 caracteres
   * e seria truncada no resultado de busca. Só existe para o buscador.
   */
  descricaoSeo?: string;
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
  /** Dimensões reais do arquivo — reservam espaço no layout e evitam CLS. */
  imagemW: number;
  imagemH: number;
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
    imagem: "/images/hero-cartao.jpeg",
    imagemW: 1586,
    imagemH: 992,
    imagemAlt:
      "Cartão de crédito PegPay preto com o símbolo e o logotipo da marca, ao lado de moedas de ouro empilhadas",
  },

  clt: {
    id: "clt",
    slug: "/para-voce/credito-consignado-clt",
    nome: "Crédito Consignado CLT",
    nomeCurto: "Consignado CLT",
    chamada: "Carteira assinada abre porta.",
    descricao:
      "Para quem trabalha com carteira assinada. A parcela é descontada direto da folha de pagamento — você não corre risco de esquecer, e as condições ficam mais leves por isso.",
    descricaoSeo:
      "Crédito consignado para quem tem carteira assinada: a parcela é descontada direto da folha, sem risco de esquecer o vencimento.",
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
    imagemW: 1672,
    imagemH: 941,
    imagemAlt:
      "Ilustração PegPay: mão segura um crachá digital de trabalhador com capacete, cercado por ícones de porcentagem e gráficos de crescimento, representando o crédito consignado CLT",
  },

  garantia: {
    id: "garantia",
    slug: "/para-voce/emprestimo-com-garantia",
    nome: "Empréstimo com garantia",
    nomeCurto: "Empréstimo com garantia",
    chamada: "O que você já tem vira o que você precisa.",
    descricao:
      "Use o veículo ou o imóvel que já é seu como garantia. O bem continua no seu nome e no seu uso — ele só fica alienado enquanto o contrato durar.",
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
    imagemW: 1536,
    imagemH: 930,
    imagemAlt:
      "Ilustração PegPay de veículo com escudo e chave representando crédito com garantia",
  },
};

export const LISTA_PRODUTOS: Produto[] = [
  PRODUTOS.cartao,
  PRODUTOS.clt,
  PRODUTOS.garantia,
];

/*
 * `calcularParcela` (Tabela Price) foi removida em 2026-08-16 junto com as
 * taxas provisórias. Além de operar sobre números que não eram política
 * oficial, cálculo de parcela é autoridade do backend, não do site — ver
 * "Regras inegociáveis" no CLAUDE.md e a atualização do ADR-003.
 */
