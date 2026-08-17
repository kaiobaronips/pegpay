import AppBlock from "@/sections/AppBlock";
import Faq from "@/sections/Faq";
import Features from "@/sections/Features";
import FinalCta from "@/sections/FinalCta";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import HowItWorks from "@/sections/HowItWorks";
import Marquee from "@/sections/Marquee";
import Produtos from "@/sections/Produtos";
import Proof from "@/sections/Proof";
import { PERGUNTAS_DESTAQUE } from "@/lib/faq";
import { faqSchema, organizacaoSchema, siteSchema } from "@/lib/schema";
import { DESCRICAO_PADRAO, TITULO_PADRAO, useJsonLd, useSeo } from "@/lib/seo";

/**
 * Home institucional. Sem simulador e sem taxa (ADR-003): o papel dela é
 * explicar a empresa e levar o cliente ao app ou ao atendimento.
 */
export default function Home() {
  useSeo(TITULO_PADRAO, DESCRICAO_PADRAO, "/");
  // FAQ da home mostra só as perguntas "destaque" — o schema espelha
  // exatamente isso, não a lista completa (que só existe em /ajuda).
  useJsonLd([siteSchema(), organizacaoSchema(), faqSchema(PERGUNTAS_DESTAQUE)]);

  return (
    <div className="min-h-screen bg-paper font-archivo text-ink">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Produtos />
        <HowItWorks />
        <AppBlock />
        <Features />
        <Proof />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
