"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { coinAmount, type DepositCoin } from "@/lib/deposit-wallets";

type Step = "amount" | "method" | "crypto";

type MethodId = "crypto";

const METHODS: Array<{ id: MethodId; title: string; image: string }> = [
  { id: "crypto", title: "Crypto", image: "Crypto.png" },
];

const PRESET_AMOUNTS = [100, 500, 1000];

const CURRENCIES = [
  { code: "USD", sign: "$" },
  { code: "EUR", sign: "€" },
  { code: "AUD", sign: "$" },
  { code: "CAD", sign: "$" },
];

const COIN_STYLES: Record<string, { bg: string; label: string }> = {
  BTC: { bg: "#f7931a", label: "₿" },
  ETH: { bg: "#627eea", label: "Ξ" },
  USDT: { bg: "#26a17b", label: "₮" },
  USDC: { bg: "#2775ca", label: "$" },
  BNB: { bg: "#f3ba2f", label: "B" },
  SOL: { bg: "#000000", label: "S" },
};

export function DepositModal({
  open,
  onClose,
  coins,
}: {
  open: boolean;
  onClose: () => void;
  coins: DepositCoin[];
}) {
  const [step, setStep] = useState<Step>("amount");
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState<number | null>(null);
  const [otherAmount, setOtherAmount] = useState("");
  const [otherActive, setOtherActive] = useState(false);
  const [error, setError] = useState("");
  const [method, setMethod] = useState<MethodId | null>(null);
  const [coin, setCoin] = useState<DepositCoin | null>(null);
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const qrPending = useRef(false);

  const sign = CURRENCIES.find((c) => c.code === currency)?.sign ?? "$";

  useEffect(() => {
    if (step !== "crypto" || !coin?.address) {
      if (!qrPending.current) setQr("");
      return;
    }
    qrPending.current = true;
    const value = coin.address;
    let cancelled = false;
    import("qrcode")
      .then((mod) => mod.toDataURL(value, { margin: 1, width: 220, color: { dark: "#111111", light: "#ffffff" } }))
      .then((url) => {
        if (!cancelled) {
          setQr(url);
          qrPending.current = false;
        }
      })
      .catch(() => {
        setQr("");
        qrPending.current = false;
      });
    return () => {
      cancelled = true;
    };
  }, [step, coin]);

  const selectedAmount = useMemo(() => {
    if (otherActive) {
      const parsed = Number.parseFloat(otherAmount.replace(/,/g, ""));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return amount ?? 0;
  }, [amount, otherActive, otherAmount]);

  if (!open) return null;

  const goNext = () => {
    if (selectedAmount <= 0) {
      setError("You have not selected any amount");
      return;
    }
    setError("");
    setStep("method");
  };

  const chooseMethod = (id: MethodId) => {
    setMethod(id);
    if (id === "crypto") {
      setCoin(coins[0] ?? null);
      setStep("crypto");
    }
  };

  const copyAddress = async () => {
    if (!coin?.address) return;
    try {
      await navigator.clipboard.writeText(coin.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const title =
    step === "amount"
      ? "Make a Deposit"
      : step === "method"
        ? "Payment method"
        : "Deposit";

  return (
    <div
      className="modal fade in tm-deposit-modal"
      id="depositView"
      role="dialog"
      style={{ zIndex: 10000, display: "block" }}
    >
      <div
        className={`modal-dialog modal-dialog-centered modal-deposit-view margin-top-20 ${
          step === "amount" ? "modal-smc" : "modal-lg"
        }`}
      >
        <div className="modal-content">
          <div className="modal-header">
            <div className="row">
              <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                <strong className="make-deposit-title" style={{ fontSize: 18 }}>
                  {title}
                </strong>
              </div>
              <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                <a
                  href="#"
                  className="btn btn-default btn-modal-close"
                  title="Close"
                  onClick={(event) => {
                    event.preventDefault();
                    onClose();
                  }}
                >
                  <i className="fal fa-times" />
                </a>
              </div>
            </div>
          </div>
          <div className="modal-body deposit-view-content">
            {step === "amount" && (
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 margin-bottom-20">
                    <label className="choose_currency-lang">Choose your Currency</label>
                    <select
                      className="form-control deposit-currency-select"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value)}
                    >
                      {CURRENCIES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="select_amount">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <label>Select Amount</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 margin-bottom-10">
                    <div className="row">
                      {PRESET_AMOUNTS.map((value) => (
                        <div
                          key={value}
                          className="col-xs-12 col-sm-12 col-md-4 col-lg-4 margin-bottom-10"
                        >
                          <button
                            type="button"
                            className={`btn btn-block btn-theme-primary btn-amount-select margin-bottom-10 ${
                              !otherActive && amount === value ? "btn-selected" : ""
                            }`}
                            onClick={() => {
                              setOtherActive(false);
                              setAmount(value);
                              setError("");
                            }}
                          >
                            {sign}
                            {value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </button>
                        </div>
                      ))}
                      <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 margin-bottom-10 other_amount col-other-amount">
                        <button
                          type="button"
                          className={`btn btn-block btn-theme-primary btn-other-amount ${
                            otherActive ? "btn-selected" : ""
                          }`}
                          onClick={() => {
                            setOtherActive(true);
                            setAmount(null);
                            setError("");
                          }}
                        >
                          Other
                        </button>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 margin-bottom-10">
                        <div
                          className="alert alert-danger error_message_amount_selected help-block"
                          style={{ display: error ? "block" : "none" }}
                        >
                          {error}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xs-12 col-sm-12 col-md-12 col-lg-12 margin-bottom-20"
                    style={{ display: otherActive ? "block" : "none" }}
                  >
                    <div className="row">
                      <div className="other_amount_placeholder">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <label>Other amount</label>
                          <div className="input-group">
                            <span className="input-group-addon currency_sign">{sign}</span>
                            <input
                              type="text"
                              className="form-control input-other-amount"
                              id="input_other_amount"
                              value={otherAmount}
                              onChange={(event) => {
                                setOtherAmount(event.target.value.replace(/[^0-9.,]/g, ""));
                                setError("");
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 intro_msg">
                    Choose your currency and select the desired amount to proceed
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="row">
                    <hr />
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-offset-7 col-md-5 col-lg-offset-7 col-lg-5">
                  <button type="button" className="btn btn-theme-primary btn-block btn-deposit-next" onClick={goNext}>
                    Next &gt;
                  </button>
                </div>
              </div>
            )}

            {step === "method" && (
              <div className="row" style={{ marginTop: -15 }}>
                <div
                  className="psp-container col-xs-12 col-sm-12 col-md-3 col-lg-3"
                  style={{ backgroundColor: "#F7F7F7" }}
                >
                  <div className="row">
                    <div className="psp-selection-header text-center margin-top-20">
                      <label>
                        <strong>Payment method</strong>
                      </label>
                    </div>
                    <ul className="nav nav-pills psp-list scroll-content-psp nav-pills-responsive">
                      {METHODS.map((item) => (
                        <li
                          key={item.id}
                          className={`deposit-option ${method === item.id ? "selected" : ""}`}
                          data-title={item.title}
                        >
                          <button
                            type="button"
                            className="psp-button"
                            onClick={() => chooseMethod(item.id)}
                            aria-label={item.title}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/sites/tagmarkets/portal/images/media/image/${item.image}`}
                              className="center-block psp-img"
                              width={120}
                              height={80}
                              alt={item.title}
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="psp-content col-md-9" style={{ height: 750 }}>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center" style={{ color: "#444444" }}>
                    <div className="psp-welcome-screen">
                      You have selected the amount of{" "}
                      <strong>
                        <span className="deposit_amount">
                          {sign}
                          {selectedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </strong>{" "}
                      to deposit. To change the amount press{" "}
                      <strong>
                        <a
                          className="btn-deposit-back"
                          style={{ textDecoration: "none", color: "#444444", cursor: "pointer" }}
                          onClick={() => setStep("amount")}
                        >
                          Back
                        </a>
                      </strong>
                      .<br /> Please select your preferred <strong>Payment method</strong> from the left
                      <div className="center-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/sites/tagmarkets/portal/images/media/image/wallet.png"
                          className="margin-top-20"
                          width={100}
                          height={80}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="row">
                    <hr />
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                  <button
                    type="button"
                    className="btn btn-theme-primary btn-block btn-deposit-back"
                    onClick={() => setStep("amount")}
                  >
                    &lt; Back
                  </button>
                </div>
              </div>
            )}

            {step === "crypto" && (
              <div className="row" style={{ marginTop: -15 }}>
                <div className="psp-container col-xs-12 col-sm-12 col-md-4 col-lg-4" style={{ backgroundColor: "#F7F7F7" }}>
                  <div className="row">
                    <div className="psp-selection-header text-center margin-top-20">
                      <label>
                        <strong>Pay with Crypto</strong>
                      </label>
                    </div>
                    <ul className="nav nav-pills psp-list scroll-content-psp">
                      {coins.map((item) => {
                        const style = COIN_STYLES[item.id];
                        return (
                          <li key={item.id} className={`deposit-option coin-option ${coin?.id === item.id ? "selected" : ""}`}>
                            <button type="button" className="coin-button" onClick={() => setCoin(item)}>
                              <span className="coin-icon" style={{ backgroundColor: style?.bg ?? "#333" }}>
                                {style?.label ?? item.symbol.slice(0, 1)}
                              </span>
                              <span className="coin-text">
                                <span className="coin-name">{item.name}</span>
                                <span className="coin-amount">
                                  {coinAmount(selectedAmount, item)} {item.symbol}
                                </span>
                                {item.networks.length > 0 && (
                                  <span className="coin-networks">{item.networks.join(" · ")}</span>
                                )}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className="psp-content col-md-8">
                  <div className="tm-crypto-panel">
                    {coin && (
                      <>
                        <div className="tm-crypto-info">
                          To complete the payment, please <strong>open your crypto wallet</strong> and{" "}
                          <strong>transfer the specified amount</strong> to the address listed here.
                        </div>
                        <div className="tm-crypto-grid">
                          <div className="tm-crypto-address">
                            <div className="tm-crypto-label">
                              <span>{coin.symbol}</span> payment address
                            </div>
                            <div className="input-group">
                              <input
                                className="form-control"
                                readOnly
                                value={coin.address || "Wallet address not configured"}
                                onFocus={(event) => event.currentTarget.select()}
                              />
                              <span className="input-group-btn">
                                <button
                                  type="button"
                                  className="btn btn-theme-primary"
                                  onClick={() => void copyAddress()}
                                  disabled={!coin.address}
                                >
                                  <i className="far fa-copy" /> {copied ? "Copied" : "Copy"}
                                </button>
                              </span>
                            </div>
                            <div className="tm-crypto-label margin-top-20">
                              Amount to send in {coin.symbol}
                            </div>
                            <div className="input-group">
                              <span className="input-group-addon">
                                <span className="coin-icon small" style={{ backgroundColor: COIN_STYLES[coin.id]?.bg }}>
                                  {COIN_STYLES[coin.id]?.label}
                                </span>
                              </span>
                              <input className="form-control" readOnly value={coinAmount(selectedAmount, coin)} />
                            </div>
                            {coin.networks.length > 0 && (
                              <div className="tm-crypto-networks">Networks: {coin.networks.join(" · ")}</div>
                            )}
                            {!coin.address && (
                              <div className="alert alert-warning margin-top-20">
                                Set <code>DEPOSIT_WALLET_{coin.id}</code> in <code>.env.local</code> to receive this
                                deposit in your own wallet.
                              </div>
                            )}
                          </div>
                          <div className="tm-crypto-qr">
                            <div className="tm-qr-tabs">
                              <span className="active">Address</span>
                              <span>Full</span>
                            </div>
                            <div className="tm-qr-box">
                              {qr ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={qr} alt={`${coin.symbol} deposit QR code`} width={220} height={220} />
                              ) : (
                                <div className="tm-qr-placeholder">QR</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="row">
                    <hr />
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                  <button
                    type="button"
                    className="btn btn-theme-primary btn-block"
                    onClick={() => {
                      setStep("method");
                      setCoin(null);
                    }}
                  >
                    &lt; Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
