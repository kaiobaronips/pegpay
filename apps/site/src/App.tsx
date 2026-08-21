import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";

import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import { inicializarAnalytics } from "@/lib/analytics";
import { obterPreferencias } from "@/lib/consent";
import Ajuda from "@/pages/Ajuda";
import Garantias from "@/pages/Garantias";
import Home from "@/pages/Home";
import Privacidade from "@/pages/Privacidade";
import RendaExtra from "@/pages/RendaExtra";
import ScrBcb from "@/pages/ScrBcb";
import Seguranca from "@/pages/Seguranca";
import SobreNos from "@/pages/SobreNos";
import TermosCondicoes from "@/pages/TermosCondicoes";
import ConsignadoCLT from "@/pages/produtos/ConsignadoCLT";
import EmprestimoCartao from "@/pages/produtos/EmprestimoCartao";
import EmprestimoGarantia from "@/pages/produtos/EmprestimoGarantia";

export default function App() {
  useEffect(() => {
    // Reaplica uma decisão de consentimento já tomada em visita anterior —
    // o banner só reaparece se ainda não houver decisão para a versão atual.
    inicializarAnalytics(obterPreferencias());
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Para você */}
        <Route path="/para-voce/emprestimo-com-cartao" element={<EmprestimoCartao />} />
        <Route path="/para-voce/credito-consignado-clt" element={<ConsignadoCLT />} />
        <Route path="/para-voce/emprestimo-com-garantia" element={<EmprestimoGarantia />} />

        {/* Institucional */}
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/renda-extra" element={<RendaExtra />} />
        <Route path="/seguranca" element={<Seguranca />} />
        <Route path="/garantias" element={<Garantias />} />
        <Route path="/ajuda" element={<Ajuda />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/scr-bcb" element={<ScrBcb />} />
        <Route path="/termos-e-condicoes-de-uso" element={<TermosCondicoes />} />

        {/* URL antiga, já indexada em produção. O redirecionamento real é o
            308 do `vercel.json`, que acontece no servidor antes de qualquer
            JavaScript — sozinha, esta rota devolvia 200 com o HTML da home
            ao crawler, porque o rewrite de SPA serve index.html e o Navigate
            só roda depois. Mantida como rede de segurança na navegação
            client-side. */}
        <Route path="/central-de-ajuda" element={<Navigate to="/ajuda" replace />} />

        {/* Qualquer outra rota volta para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CookieConsent />
    </>
  );
}
