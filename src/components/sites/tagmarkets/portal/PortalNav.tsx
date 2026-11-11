"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { flagSrc, portalLanguages } from "./languages";

type PortalNavProps = {
  /** Route prefix used by the language switcher: `/login` or `/live_signup`. */
  langBase: string;
  /** When present, the auth buttons are replaced with the signed-in account. */
  account?: { email: string; onSignOut: () => void };
};

export function PortalNav({ langBase, account }: PortalNavProps) {
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const close = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setLangOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [langOpen]);

  return (
    <nav className="navbar navbar-default navbar-fixed-top" ref={navRef}>
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className={`navbar-toggle collapsed${menuOpen ? "" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="navbar"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <Link className="navbar-brand" href="/dashboard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sites/tagmarkets/portal/logo_small.png" alt="Tag Markets" />
          </Link>
        </div>
        <div
          id="navbar"
          className={`navbar-collapse collapse${menuOpen ? " in" : ""}`}
          aria-expanded={menuOpen}
        >
          <div className="navbar-top">
            <ul className="nav navbar-nav navbar-right">
              <li className={`dropdown lang-select${langOpen ? " open" : ""}`}>
                <a
                  href="#"
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  data-hover="dropdown"
                  data-close-others="true"
                  aria-expanded={langOpen}
                  onClick={(event) => {
                    event.preventDefault();
                    setLangOpen((value) => !value);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={flagSrc("en")} alt="" />
                  <span className="text-uppercase">English</span>{" "}
                  <i className="fa fa-angle-down" />
                </a>
                <ul className="dropdown-menu dropdown-menu-default">
                  {portalLanguages.map((language) => (
                    <li key={language.code}>
                      <a href={`https://portal.tagmarkets.com/${language.code}${langBase}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={flagSrc(language.code)} alt="" />{" "}
                        <span>{language.label}</span>{" "}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              {account ? (
                <>
                  <li>
                    <span className="navbar-account-email">{account.email}</span>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-theme-secondary text-uppercase"
                      value=""
                      onClick={account.onSignOut}
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      type="button"
                      className="btn btn-theme-primary text-uppercase"
                      value=""
                      onClick={() => router.push("/login")}
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-theme-secondary text-uppercase"
                      value=""
                      onClick={() => router.push("/live_signup")}
                    >
                      Register Now
                    </button>
                  </li>
                </>
              )}
              {account ? null : (
                <p className="font-weight-bold font-size-sm text-primary text-right">
                  Trading Forex &amp; CFDs is Risky
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
