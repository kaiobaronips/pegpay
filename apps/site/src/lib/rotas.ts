/**
 * Rotas estáticas do site, usadas pela geração de HTML no build.
 *
 * As de produto derivam de `PRODUTOS`, então criar um produto novo já entra
 * aqui sozinho. Precisa continuar espelhando as rotas de `App.tsx` — o
 * script de prerender falha o build se alguma rota daqui não renderizar.
 */
import { LISTA_PRODUTOS } from "@/lib/produtos";

export const ROTAS_ESTATICAS: string[] = [
  "/",
  ...LISTA_PRODUTOS.map((produto) => produto.slug),
  "/sobre-nos",
  "/renda-extra",
  "/seguranca",
  "/garantias",
  "/ajuda",
  "/privacidade",
];
