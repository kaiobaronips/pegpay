import { useEffect, useId } from "react";

import type { JsonLdSchema } from "@/lib/schema";

export const TITULO_PADRAO = "PegPay — Crédito sem enrolação";
// Até ~155 caracteres: acima disso o Google trunca a descrição no
// resultado de busca. Vale para todo texto usado como meta description.
export const DESCRICAO_PADRAO =
  "Crédito para quem o banco não enxerga: empréstimo com cartão, consignado CLT e com garantia de veículo ou imóvel. Fale com gente de verdade.";
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

/**
 * Injeta dado estruturado (schema.org) da página atual como
 * `<script type="application/ld+json">`, e remove ao desmontar.
 *
 * Cada chamada (ex.: `PaginaInterna` para breadcrumb + a própria página
 * para FAQ/Service/Organization) usa um id próprio via `useId()`, para que
 * várias chamadas na mesma árvore não se sobrescrevam.
 *
 * Client-rendered (sem SSR) — crawlers que não executam JavaScript não veem
 * este script. É best-effort dentro da arquitetura SPA atual; ver
 * `docs/growth/` para a limitação registrada pelo pegpay-seo-strategist.
 */
export function useJsonLd(schema: JsonLdSchema | JsonLdSchema[]) {
  const id = `pegpay-json-ld-${useId()}`;
  // Serializar fora do efeito dá uma dependência estável (string) em vez do
  // objeto, que é recriado a cada render — sem precisar silenciar o
  // exhaustive-deps.
  const json = JSON.stringify(schema);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = json;
    document.head.appendChild(script);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [id, json]);
}
