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

    // A seção só existe depois que a rota renderiza.
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
