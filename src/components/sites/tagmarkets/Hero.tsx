import { PORTAL_URL } from "./data";

export function Hero() {
  return (
    <section className="home-hero reveal-on-scroll">
      <div className="home-hero-container">
        <div className="home-hero-copy">
          <h1>
            <span className="home-hero-title-intro">Your Trading Journey</span> Starts Here
          </h1>
          <p>
            Trade forex, metals, indices and more on MT5, with CopyX copy trading and Amplify
            accounts.
          </p>
          <div className="home-actions">
            <a className="tm-button main" href={PORTAL_URL}>
              Start Trading
            </a>
            <a className="tm-button light" href={PORTAL_URL}>
              Free Demo Account
            </a>
          </div>
        </div>
        <div className="home-hero-media">
          <video autoPlay muted loop playsInline poster="/sites/tagmarkets/home/hero-poster.jpg">
            <source src="/sites/tagmarkets/home/hero-animation.mp4" type="video/mp4" />
          </video>
          <p className="media-disclaimer">Interface shown for illustration only.</p>
        </div>
      </div>
    </section>
  );
}
