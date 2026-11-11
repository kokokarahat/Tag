import { Footer } from "./Footer";
import { Header } from "./Header";
import { InnerInteractions } from "./InnerInteractions";
import { JurisdictionHeight } from "./JurisdictionHeight";
import { MobileNav } from "./MobileNav";
import { RiskBar } from "./RiskBar";
import { WhatsAppFloat } from "./WhatsAppFloat";

/**
 * Shared shell for every cloned marketing inner page.
 *
 * `mainHtml` is the source page's `<main>` markup, rendered verbatim so the
 * text, classes and structure stay identical to the live site. Interactions are
 * wired by `InnerInteractions` against the same data attributes the source
 * scripts used.
 */
export function InnerPage({ mainHtml }: { mainHtml: string }) {
  return (
    <div className="tm-site">
      <div className="site-header">
        <RiskBar />
        <Header />
        <MobileNav />
      </div>

      <main className="tm-inner" dangerouslySetInnerHTML={{ __html: mainHtml }} />

      <Footer />
      <WhatsAppFloat />
      <InnerInteractions />
      <JurisdictionHeight />
    </div>
  );
}
