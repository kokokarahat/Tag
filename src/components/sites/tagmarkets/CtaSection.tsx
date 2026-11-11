import { PORTAL_URL } from "./data";

export function CtaSection() {
  return (
    <section className="home-cta reveal-on-scroll">
      <div className="tm-container">
        <div className="home-cta-box">
          <img src="/sites/tagmarkets/home/cta-waves.svg" alt="" />
          <div className="home-cta-content">
            <h2>Ready for your next move?</h2>
            <p>Explore TAG Markets&apos; platforms, tools and account options.</p>
            <div className="home-actions">
              <a className="tm-button black" href={PORTAL_URL}>
                Start Trading
              </a>
              <a className="tm-button light" href={PORTAL_URL}>
                Free demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
