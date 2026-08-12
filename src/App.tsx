import { Route, Routes } from "react-router";

import ScrollToTop from "@/components/ScrollToTop";
import CentralDeAjuda from "@/pages/CentralDeAjuda";
import Home from "@/pages/Home";
import Privacidade from "@/pages/Privacidade";
import Seguranca from "@/pages/Seguranca";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/seguranca" element={<Seguranca />} />
        <Route path="/central-de-ajuda" element={<CentralDeAjuda />} />
      </Routes>
    </>
  );
}
