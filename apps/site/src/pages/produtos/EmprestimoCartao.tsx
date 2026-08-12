import PaginaProduto from "@/components/PaginaProduto";
import { PRODUTOS } from "@/lib/produtos";

const PASSOS = [
  {
    titulo: "Conte quanto precisa",
    texto:
      "Chame a gente no WhatsApp ou use o app. Você diz o valor e a gente confere quanto do seu limite dá para usar.",
  },
  {
    titulo: "Valide o cartão",
    texto:
      "A análise olha o limite disponível no seu cartão de crédito. Sem consulta que suje o seu nome e sem exigir score alto.",
  },
  {
    titulo: "Receba na conta",
    texto:
      "Aprovado e contrato assinado, o dinheiro cai na sua conta em até 2 dias úteis. As parcelas entram na fatura do cartão.",
  },
];

const PERGUNTAS = [
  {
    p: "Preciso ter o nome limpo?",
    r: "Não. Esta é justamente a modalidade para quem foi negado no banco. O que conta é o limite que você tem disponível no cartão de crédito, não o seu score.",
  },
  {
    p: "Quanto eu consigo pegar?",
    r: "Depende do limite livre no seu cartão. Quanto mais limite disponível, maior o valor possível. O time confere isso com você antes de qualquer coisa.",
  },
  {
    p: "Como eu pago?",
    r: "As parcelas aparecem na fatura do seu cartão de crédito, no mesmo vencimento que você já conhece. Nada de boleto novo para lembrar.",
  },
  {
    p: "Meu limite fica bloqueado?",
    r: "O valor da operação usa parte do limite disponível, e ele vai sendo liberado conforme você paga as faturas — como acontece em qualquer parcelamento no cartão.",
  },
  {
    p: "Preciso trocar de banco ou abrir conta?",
    r: "Não. Você continua com o seu banco e o seu cartão. A PegPay não abre conta nem emite cartão — a gente conecta você ao crédito.",
  },
];

export default function EmprestimoCartao() {
  return <PaginaProduto produto={PRODUTOS.cartao} passos={PASSOS} perguntas={PERGUNTAS} />;
}
