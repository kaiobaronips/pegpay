import { Navigate, Route, Routes } from "react-router";

import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import Ajuda from "@/pages/Ajuda";
import Garantias from "@/pages/Garantias";
import Home from "@/pages/Home";
import Privacidade from "@/pages/Privacidade";
import RendaExtra from "@/pages/RendaExtra";
import Seguranca from "@/pages/Seguranca";
import SobreNos from "@/pages/SobreNos";
import ConsignadoCLT from "@/pages/produtos/ConsignadoCLT";
import EmprestimoCartao from "@/pages/produtos/EmprestimoCartao";
import EmprestimoGarantia from "@/pages/produtos/EmprestimoGarantia";

export default function App() {
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

        {/* URL antiga, já indexada em produção */}
        <Route path="/central-de-ajuda" element={<Navigate to="/ajuda" replace />} />

        {/* Qualquer outra rota volta para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CookieConsent />
    </>
  );
}
