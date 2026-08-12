import Faq from "@/sections/Faq";
import Features from "@/sections/Features";
import FinalCta from "@/sections/FinalCta";
import Footer from "@/sections/Footer";
import Guarantees from "@/sections/Guarantees";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import HowItWorks from "@/sections/HowItWorks";
import Marquee from "@/sections/Marquee";
import Proof from "@/sections/Proof";
import Simulator from "@/sections/Simulator";

export default function Home() {
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
