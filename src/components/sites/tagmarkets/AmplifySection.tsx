import { PORTAL_URL } from "./data";

export function AmplifySection() {
  return (
    <section className="home-amplify reveal-on-scroll">
      <div className="tm-container home-split-grid">
        <div className="home-split-content">
          <h2>Amplify Your Trading Potential</h2>
          <p>
            Access up to 12× your eligible deposit in trading allocation and keep 100% of eligible
            net trading profits, subject to account terms.
          </p>
          <div className="home-actions">
            <a className="tm-button main" href={PORTAL_URL}>
              Get Started
            </a>
            <a className="tm-button light" href="/account-types/">
              View All Account Types
            </a>
          </div>
          <p className="home-disclaimer">
            Additional trading allocation is not withdrawable cash. CFDs carry a high risk of
            financial loss.
          </p>
        </div>
        <div>
          <img
            src="/sites/tagmarkets/home/amplify-interface.png"
            alt="Amplify account interface"
          />
          <p className="media-disclaimer">Interface shown for illustration only.</p>
        </div>
      </div>
    </section>
  );
}
