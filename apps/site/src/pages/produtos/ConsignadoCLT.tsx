import PaginaProduto from "@/components/PaginaProduto";
import { PRODUTOS } from "@/lib/produtos";

const PASSOS = [
  {
    titulo: "Confirme o vínculo",
    texto:
      "Você informa onde trabalha e há quanto tempo. A gente verifica se a sua empresa está conveniada e qual a sua margem disponível.",
  },
  {
    titulo: "Escolha o valor",
    texto:
      "Dentro da sua margem consignável, você decide quanto quer e em quantas parcelas. Quanto maior o prazo, menor o valor mensal.",
  },
  {
    titulo: "Parcela sai na folha",
    texto:
      "Contrato assinado, o dinheiro cai na conta. A partir daí, a parcela é descontada direto do salário — sem boleto, sem esquecimento.",
  },
];

const PERGUNTAS = [
  {
    p: "O que é margem consignável?",
    r: "É a parte do seu salário que pode ser comprometida com desconto em folha, definida por lei. Ela limita o valor da parcela — e, por consequência, quanto você consegue pegar.",
  },
  {
    p: "Minha empresa precisa ser conveniada?",
    r: "Sim. O desconto em folha depende de convênio com o empregador. Se a sua empresa ainda não for conveniada, fale com a gente: em muitos casos dá para resolver, ou indicar outra modalidade que sirva para você.",
  },
  {
    p: "E se eu for demitido?",
    r: "O contrato continua válido e o pagamento passa a ser feito por outro meio combinado com o nosso time. Não deixe de avisar — a gente renegocia antes de virar problema.",
  },
  {
    p: "Preciso ter conta no banco onde recebo?",
    r: "Você precisa ter uma conta em seu nome para receber o valor. O desconto da parcela acontece na folha, independentemente do banco.",
  },
  {
    p: "Sou aposentado ou servidor. Serve para mim?",
    r: "Esta modalidade é para trabalhadores com carteira assinada. Se o seu caso for outro, fale com a gente pelo WhatsApp que a gente indica o caminho certo.",
  },
];

export default function ConsignadoCLT() {
  return <PaginaProduto produto={PRODUTOS.clt} passos={PASSOS} perguntas={PERGUNTAS} />;
}
