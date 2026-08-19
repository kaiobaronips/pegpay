import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Ajusta o scroll a cada troca de rota: topo quando não há âncora, ou a seção
 * correspondente quando a URL traz um `#`. Sem isso, um link como
 * `/#simulador` vindo de uma página interna abriria a home no topo.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    // A seção só existe depois que a rota renderiza. O salto instantâneo é
    // forçado via inline style porque `scroll-behavior: smooth` (global, em
    // index.css) faria o navegador animar tanto o salto nativo do próprio
    // `<a href="#...">` quanto este, e os dois brigam pelo mesmo scroll.
    const id = decodeURIComponent(hash.slice(1));
    const root = document.documentElement;
    const scroll = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      el.scrollIntoView({ behavior: "auto", block: "start" });
      root.style.scrollBehavior = previous;
    };
    const frame = requestAnimationFrame(scroll);
    // Imagens lazy acima do alvo ainda podem carregar durante a rolagem e
    // empurrar o layout, deixando o salto curto. Reaplica depois que a
    // página estabiliza.
    const retry = window.setTimeout(scroll, 500);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [pathname, hash]);

  return null;
}
