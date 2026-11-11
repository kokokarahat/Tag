export function CopyXSection() {
  return (
    <section className="home-copy-block reveal-on-scroll">
      <div className="tm-container">
        <div className="home-feature-card home-copy-feature reveal-on-scroll">
          <div className="home-feature-content">
            <h2>
              CopyX. <br />
              Follow Strategies. Trade Smarter.
            </h2>
            <p>
              Discover trading strategies, compare performance and risk, and automatically copy
              trades from providers you choose.
            </p>
            <p>Explore. Choose. Copy.</p>
            <a className="tm-button main" href="/copy-trade/">
              Start Copy Trading
            </a>
            <p className="home-disclaimer">
              *Past performance is not a reliable indicator of future results. Copy trading involves
              risk, including loss of capital.
            </p>
          </div>
          <div>
            <img src="/sites/tagmarkets/home/copyx-interface.avif" alt="CopyX trading interface" />
            <p className="media-disclaimer">Interface shown for illustration only.</p>
          </div>
        </div>

        <div className="home-mini-cards">
          {[1, 2, 3].map((n) => (
            <div className="home-mini-card" key={n}>
              <img
                src={`/sites/tagmarkets/home/copyx-card-${n}.${n === 2 ? "png" : "svg"}`}
                alt="Copy trading card"
              />
              <p className="media-disclaimer">Interface shown for illustration only.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
