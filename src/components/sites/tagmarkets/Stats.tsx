export function Stats() {
  return (
    <section className="tm-container home-stats-section reveal-on-scroll" aria-label="Broker highlights">
      <div className="home-stats reveal-on-scroll">
        <div className="home-stat">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5V10c0 8.4 7.1 11.17 8.53 11.64.3.1.63.1.94 0C13.9 21.17 21 18.39 21 10V4.5A1.5 1.5 0 0 0 19.5 3Zm-2.86 6.54-5.5 5.25a.75.75 0 0 1-1.04 0l-2.75-2.62a.75.75 0 1 1 1.04-1.09l2.23 2.13 4.98-4.76a.75.75 0 1 1 1.04 1.09Z" />
          </svg>
          <span>Regulated by the Mauritius FSC*</span>
        </div>
        <div className="home-stat">
          <svg viewBox="0 0 25 24" fill="currentColor" aria-hidden="true">
            <path d="M11.86 14.81a5.63 5.63 0 1 0-6.22 0 9 9 0 0 0-4.25 3.26.75.75 0 0 0 .61 1.19h13.5a.75.75 0 0 0 .61-1.18 9 9 0 0 0-4.25-3.27Z" />
            <path d="M23.76 18.07a9 9 0 0 0-4.25-3.26 5.63 5.63 0 0 0-4.64-10.1.75.75 0 0 0-.4 1.17 7.1 7.1 0 0 1 .55 8.95 10.2 10.2 0 0 1 3.25 3.99.75.75 0 0 0 .68.44h4.19a.75.75 0 0 0 .62-1.19Z" />
          </svg>
          <span>Forex, metals &amp; indices</span>
        </div>
        <div className="home-stat">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.38 18.75h-.75v-15a.75.75 0 0 0-.75-.75h-5.25a.75.75 0 0 0-.75.75V7.5h-4.5a.75.75 0 0 0-.75.75V12h-4.5a.75.75 0 0 0-.75.75v6h-.75a.75.75 0 0 0 0 1.5h18.75a.75.75 0 0 0 0-1.5ZM10.13 9h3.75v9.75h-3.75V9Zm-5.25 4.5h3.75v5.25H4.88V13.5Z" />
          </svg>
          <span>Manual &amp; copy trading</span>
        </div>
      </div>
      <p className="home-stats-disclaimer">
        *Regulation applies to T.M. Financials Ltd, Licence No. GB21026474.
      </p>
    </section>
  );
}
