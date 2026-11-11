export function RiskBar() {
  return (
    <section className="risk" aria-label="Risk warning">
      <p className="risk-row">
        <strong>Risk warning.</strong> CFDs and leveraged products carry a high risk of financial
        loss, including the potential loss of your entire invested capital.
      </p>
      <p className="risk-row risk-jurisdiction" data-jurisdiction-notice="">
        <strong>Jurisdictional Disclaimer:</strong> Services are offered subject to T.M Financials
        Ltd’s FSC Mauritius licence permissions and applicable laws and regulatory restrictions in
        each client’s country of residence.
      </p>
    </section>
  );
}
