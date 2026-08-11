import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import Marquee from "@/sections/Marquee";
import Simulator from "@/sections/Simulator";
import HowItWorks from "@/sections/HowItWorks";
import Guarantees from "@/sections/Guarantees";
import Features from "@/sections/Features";
import Proof from "@/sections/Proof";
import Faq from "@/sections/Faq";
import FinalCta from "@/sections/FinalCta";
import Footer from "@/sections/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-paper font-archivo text-ink">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Simulator />
        <HowItWorks />
        <Guarantees />
        <Features />
        <Proof />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
