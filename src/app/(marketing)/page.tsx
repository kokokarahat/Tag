import { Header } from "@/components/sites/tagmarkets/Header";
import { MobileNav } from "@/components/sites/tagmarkets/MobileNav";
import { RiskBar } from "@/components/sites/tagmarkets/RiskBar";
import { Hero } from "@/components/sites/tagmarkets/Hero";
import { Stats } from "@/components/sites/tagmarkets/Stats";
import { TradeSection } from "@/components/sites/tagmarkets/TradeSection";
import { CopyXSection } from "@/components/sites/tagmarkets/CopyXSection";
import { AmplifySection } from "@/components/sites/tagmarkets/AmplifySection";
import { ArenaSection } from "@/components/sites/tagmarkets/ArenaSection";
import { CtaSection } from "@/components/sites/tagmarkets/CtaSection";
import { Footer } from "@/components/sites/tagmarkets/Footer";
import { WhatsAppFloat } from "@/components/sites/tagmarkets/WhatsAppFloat";
import { ScrollReveal } from "@/components/sites/tagmarkets/ScrollReveal";
import { JurisdictionHeight } from "@/components/sites/tagmarkets/JurisdictionHeight";
import { VisitTracker } from "@/components/sites/tagmarkets/VisitTracker";

export default function Home() {
  return (
    <div className="tm-site">
      <VisitTracker page="home" />
      <div className="site-header">
        <RiskBar />
        <Header />
        <MobileNav />
      </div>

      <main>
        <Hero />
        <Stats />
        <TradeSection />
        <CopyXSection />
        <AmplifySection />
        <ArenaSection />
        <CtaSection />
      </main>

      <Footer />
      <WhatsAppFloat />
      <ScrollReveal />
      <JurisdictionHeight />
    </div>
  );
}
