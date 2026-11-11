import { PORTAL_URL } from "./data";

export function TradeSection() {
  return (
    <section className="home-dark home-trade reveal-on-scroll">
      <div className="tm-container home-trade-grid">
        <div>
          <div className="home-phone-stack" aria-label="Mobile trading previews">
            <img src="/sites/tagmarkets/home/mobile-trading-top.png" alt="Mobile trading screen" />
            <img
              src="/sites/tagmarkets/home/mobile-trading-bottom.png"
              alt="Mobile trading screen"
            />
          </div>
          <p className="media-disclaimer">Interface shown for illustration only.</p>
        </div>
        <div className="home-split-content">
          <h2>
            Trade <span className="lime">Where</span>
            <br />
            You Want.
          </h2>
          <p>
            Trade on MetaTrader 5 from your phone, browser or desktop. Trading hours vary by
            instrument.
          </p>
          <a className="tm-button main" href={PORTAL_URL}>
            Try A Demo Account
          </a>
        </div>
      </div>
    </section>
  );
}
