/* eslint-disable react-refresh/only-export-components --
   Entrada usada só pelo build em Node; nunca passa por Fast Refresh. */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

import App from "@/App";
import { ColetorHead, ContextoHead } from "@/lib/seo";

// Reexportado para o script de prerender: o build de servidor gera um bundle
// único, então `rotas.ts` não vira um arquivo próprio em dist-ssr.
export { ROTAS_ESTATICAS } from "@/lib/rotas";

/**
 * Entrada usada só no build, pelo script de prerender (`scripts/prerender.mjs`).
 * O navegador continua entrando por `main.tsx`.
 *
 * Sem `StrictMode` de propósito: aqui o objetivo é uma passada única de
 * render, e o coletor de head acumula schemas durante ela.
 */
export function render(caminho: string) {
  const coletor = new ColetorHead();

  const html = renderToString(
    <ContextoHead.Provider value={coletor}>
      <StaticRouter location={caminho}>
        <App />
      </StaticRouter>
    </ContextoHead.Provider>,
  );

  return { html, coletor };
}
