import { footerColumns } from "./data";

export function Footer() {
  return (
    <footer className="site-footer reveal-on-scroll">
      <div className="tm-container footer-card">
        <div className="footer-grid">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={"highlight" in link && link.highlight ? "footer-highlight-link" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <img className="footer-logo" src="/sites/tagmarkets/logo.svg" alt="Tag Markets" />
        </div>

        <div className="legal">
          <section className="footer-legal-section">
            <h4>Regulatory Information</h4>
            <p>
              TAG Markets is a financial services brand operating through regulated entities in
              multiple jurisdictions.
            </p>
            <p>
              T.M. Financials Ltd, incorporated in Mauritius (Company No. C185265), is regulated by
              the Financial Services Commission (FSC) Mauritius as an Investment Dealer (Licence No.
              GB21026474).
            </p>
            <p>
              TM FINANCIALS SA (PTY) LTD, incorporated in South Africa (Registration No.
              2024/508189/07), is an authorised Financial Services Provider (FSP No. 55237),
              regulated by the Financial Sector Conduct Authority (FSCA).
            </p>
            <p>
              All clients registering through TAG Markets are onboarded with T.M. Financials Ltd
              (Mauritius), which is the contractual counterparty responsible for maintaining trading
              accounts and providing trading services. The South African entity provides marketing
              services only and does not operate client trading accounts.
            </p>
            <p>
              Clients are subject to the regulatory framework and protections applicable to T.M.
              Financials Ltd under FSC Mauritius, rather than those applicable to the South African
              entity.
            </p>
          </section>

          <section className="footer-legal-section">
            <h4>Risk Warning &amp; Disclosure</h4>
            <p>
              Contracts for Difference (CFDs), leveraged foreign exchange, and other financial
              instruments involve significant risks and may not be suitable for all investors.
              Leverage can magnify both potential gains and losses, and you may lose your entire
              invested capital or more, depending on the applicable account terms. Before trading,
              carefully assess your financial circumstances, investment objectives, trading
              experience, and risk tolerance. Ensure you fully understand the risks involved, seek
              independent financial advice where necessary, and never trade with funds you cannot
              afford to lose. Past performance is not a reliable indicator of future results.
            </p>
          </section>

          <section className="footer-legal-section">
            <h4>Jurisdictional Restrictions &amp; Investor Protection</h4>
            <p>
              TAG Markets does not accept clients residing in Spain or the United States. Services
              are offered internationally, subject to applicable laws, regulatory requirements, and
              T.M. Financials Ltd.&apos;s FSC Mauritius license conditions. Client eligibility is
              assessed based on applicable jurisdictional restrictions, and TAG Markets reserves the
              right to decline or restrict services where necessary.
            </p>
            <p>
              TAG Markets is not authorized or regulated by any European Union financial regulatory
              authority. Clients of T.M. Financials Ltd. are subject to the Mauritius regulatory
              framework and should not assume they benefit from EU investor compensation schemes or
              protections applicable to EU-authorized firms. Clients are encouraged to understand
              the applicable regulatory protections before trading.
            </p>
          </section>

          <p>© 2026 Tag Markets. All Rights Reserved.</p>
        </div>
      </div>

      <div className="tm-container footer-wikilicense">
        <a
          className="wl-badge"
          href="https://www.wikilicense.com/en/brand/1303209809"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WikiLicense"
        >
          <img src="/sites/tagmarkets/wikilicense.png" alt="" aria-hidden="true" />
          <span>WikiLicense</span>
        </a>
      </div>
    </footer>
  );
}
