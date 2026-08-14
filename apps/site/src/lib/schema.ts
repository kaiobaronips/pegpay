/**
 * Construtores de dado estruturado (schema.org / JSON-LD) do site.
 *
 * Regra do projeto: nenhum campo aqui pode conter dado que a PegPay não tem
 * de verdade. Sem `aggregateRating`, sem `review`, sem número fabricado.
 * Sem `offers`/preço em produto de crédito (ADR-003: o site nunca declara
 * taxa ou CET).
 *
 * `sameAs` fica de fora deliberadamente: os links sociais do rodapé hoje
 * apontam para domínios genéricos (`instagram.com`, não um perfil real), e
 * declarar perfil inexistente como identidade da marca é markup enganoso.
 *
 * `legalName`/`taxID` também ficam de fora enquanto o CNPJ real não for
 * confirmado — o rodapé usa um placeholder.
 */
import { WHATSAPP_NUMERO } from "@/lib/contato";
import type { Pergunta } from "@/lib/faq";
import type { Produto } from "@/lib/produtos";

const ORIGEM = "https://www.pegpay.com.br";

/**
 * Identidade estável da organização. Usar o mesmo `@id` em todas as páginas
 * permite que buscadores e engines generativas resolvam Organization,
 * Service.provider e breadcrumbs como uma única entidade, em vez de tratar
 * cada página como uma empresa diferente.
 */
const ORG_ID = `${ORIGEM}/#organizacao`;

export type JsonLdSchema = Record<string, unknown>;

/**
 * A PegPay é correspondente bancário, não instituição financeira — por
 * isso o tipo é `Organization` genérico, nunca `FinancialService` ou
 * `BankOrCreditUnion`, que implicariam registro regulatório que não é da
 * PegPay (é da Giro.Tech, a financeira parceira).
 */
export function organizacaoSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "PegPay Soluções Digitais",
    url: ORIGEM,
    logo: `${ORIGEM}/images/logo-pegpay.svg`,
    foundingDate: "2019",
    description:
      "Correspondente bancário de crédito — empréstimo com cartão de crédito, consignado CLT e empréstimo com garantia de veículo ou imóvel.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${WHATSAPP_NUMERO}`,
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
  };
}

/**
 * `Service`, não `Product` — cada modalidade de crédito é um serviço
 * prestado, não um item com preço fixo à venda. Sem `offers`: o site não
 * divulga taxa ou CET (ADR-003), então declarar uma oferta com preço aqui
 * seria markup enganoso.
 */
export function servicoSchema(produto: Produto): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${ORIGEM}${produto.slug}#servico`,
    serviceType: produto.nome,
    name: produto.nome,
    description: produto.descricao,
    url: `${ORIGEM}${produto.slug}`,
    // Carrega o mesmo `@id` da organização (liga as páginas a uma entidade
    // só) e também nome e url — sem isso, um crawler que veja apenas esta
    // página encontraria uma referência pendurada, sem identificação.
    provider: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "PegPay Soluções Digitais",
      url: ORIGEM,
    },
    areaServed: "BR",
    inLanguage: "pt-BR",
  };
}

/** Gerado a partir do array real de perguntas — nunca reescreve a resposta. */
export function faqSchema(perguntas: Pergunta[]): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "pt-BR",
    mainEntity: perguntas.map((item) => ({
      "@type": "Question",
      name: item.p,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.r,
      },
    })),
  };
}

/** Home > página atual — hierarquia rasa, mas real e verificável. */
export function breadcrumbSchema(tituloPagina: string, caminho: string): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: ORIGEM },
      { "@type": "ListItem", position: 2, name: tituloPagina, item: `${ORIGEM}${caminho}` },
    ],
  };
}
