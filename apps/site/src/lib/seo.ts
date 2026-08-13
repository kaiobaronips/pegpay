import { useEffect } from "react";

export const TITULO_PADRAO = "PegPay — Crédito sem enrolação";
export const DESCRICAO_PADRAO =
  "PegPay — crédito sem enrolação para quem o banco não enxerga. Empréstimo com cartão de crédito, consignado CLT e empréstimo com garantia de veículo ou imóvel. Fale com gente de verdade.";
const ORIGEM = "https://www.pegpay.com.br";

function setMeta(seletor: string, atributo: string, valor: string) {
  const el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(seletor);
  if (el) el.setAttribute(atributo, valor);
}

/**
 * Título, descrição e canonical por página.
 *
 * O site é uma SPA: sem isso, toda rota herda a meta description e o
 * canonical da home, o que faz o Google tratar as páginas de produto como
 * duplicatas. Não substitui SSR para indexação completa, mas corrige a
 * duplicação para os crawlers que executam JavaScript.
 */
export function useSeo(titulo: string, descricao: string, caminho: string) {
  useEffect(() => {
    document.title = titulo;
    setMeta('meta[name="description"]', "content", descricao);
    setMeta('meta[property="og:title"]', "content", titulo);
    setMeta('meta[property="og:description"]', "content", descricao);
    setMeta('meta[property="og:url"]', "content", `${ORIGEM}${caminho}`);
    setMeta('link[rel="canonical"]', "href", `${ORIGEM}${caminho}`);

    return () => {
      document.title = TITULO_PADRAO;
      setMeta('meta[name="description"]', "content", DESCRICAO_PADRAO);
      setMeta('meta[property="og:title"]', "content", TITULO_PADRAO);
      setMeta('meta[property="og:description"]', "content", DESCRICAO_PADRAO);
      setMeta('meta[property="og:url"]', "content", `${ORIGEM}/`);
      setMeta('link[rel="canonical"]', "href", `${ORIGEM}/`);
    };
  }, [titulo, descricao, caminho]);
}
