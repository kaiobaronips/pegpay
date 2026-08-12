import PaginaProduto from "@/components/PaginaProduto";
import { PRODUTOS } from "@/lib/produtos";

const PASSOS = [
  {
    titulo: "Diga o que você tem",
    texto:
      "Veículo ou imóvel, no seu nome. A gente confere a documentação e estima quanto dá para liberar com aquele bem como garantia.",
  },
  {
    titulo: "Avaliação e análise",
    texto:
      "Envie a documentação do bem pelo celular. A avaliação define o valor disponível, e a análise leva horas, não semanas.",
  },
  {
    titulo: "Assine e receba",
    texto:
      "Com o contrato assinado, o bem é alienado como garantia e o dinheiro cai na sua conta. Você continua usando o carro ou morando no imóvel.",
  },
];

const PERGUNTAS = [
  {
    p: "O bem sai do meu nome?",
    r: "Não. Alienação não é venda. O bem continua registrado em seu nome e no seu uso durante todo o contrato — ele apenas fica gravado como garantia da operação. Quitadas as parcelas, a alienação é removida.",
  },
  {
    p: "Posso continuar usando o veículo?",
    r: "Sim, normalmente. Você dirige, viaja e usa como sempre usou. O que você não pode fazer é vender ou transferir o bem enquanto o contrato estiver ativo.",
  },
  {
    p: "Serve para carro financiado?",
    r: "Depende do quanto falta pagar. Bem quitado é o caso mais simples; se ainda houver financiamento, fale com a gente que avaliamos a situação específica.",
  },
  {
    p: "E se eu não conseguir pagar?",
    r: "Fale com a gente antes de atrasar. Dá para remarcar data ou renegociar. A execução da garantia é o último recurso — nosso trabalho é fazer a parcela caber no seu mês desde o começo. Leia também a nossa página de Garantias, onde explicamos os riscos com todas as letras.",
  },
  {
    p: "Que documentos preciso do bem?",
    r: "Para veículo, o documento do carro e comprovação de que está no seu nome. Para imóvel, a matrícula atualizada. O time confirma a lista exata conforme o seu caso.",
  },
];

export default function EmprestimoGarantia() {
  return <PaginaProduto produto={PRODUTOS.garantia} passos={PASSOS} perguntas={PERGUNTAS} />;
}
