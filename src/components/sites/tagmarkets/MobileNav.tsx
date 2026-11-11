"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { locales, navItems, LOGIN_URL, PORTAL_URL } from "./data";

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 6l5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const current = locales[0];

  useEffect(() => {
    document.documentElement.classList.toggle("mobile-menu-open", open);
    return () => document.documentElement.classList.remove("mobile-menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`mobile-navigation ${open ? "is-open" : ""}`} data-mobile-navigation="">
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="mobile-menu-overlay" onClick={() => setOpen(false)} />

      <aside
        id="mobile-menu-panel"
        className="mobile-menu-panel"
        aria-hidden={!open}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mobile-menu-content">
          <Link className="mobile-menu-logo" href="/" aria-label="Tag Markets home">
            <img src="/sites/tagmarkets/logo.svg" alt="Tag Markets" />
          </Link>

          <nav className="mobile-menu-links" aria-label="Mobile navigation">
            {navItems.map((item) =>
              item.children ? (
                <div className="mobile-menu-item" key={item.label}>
                  <button
                    className="mobile-menu-link"
                    type="button"
                    aria-expanded={openSubmenu === item.label}
                    data-submenu-toggle=""
                    onClick={() =>
                      setOpenSubmenu((value) => (value === item.label ? null : item.label))
                    }
                  >
                    <span>{item.label}</span>
                    <Arrow />
                  </button>
                  <div className={`mobile-submenu ${openSubmenu === item.label ? "is-open" : ""}`}>
                    <div className="mobile-submenu-inner">
                      {item.children.map((child) => (
                        <a key={child.label} href={child.href}>
                          <span className="mobile-submenu-dot" />
                          <span>{child.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mobile-menu-item" key={item.label}>
                  <a className="mobile-menu-link" href={item.href}>
                    <span>{item.label}</span>
                    <Arrow />
                  </a>
                </div>
              ),
            )}
          </nav>

          <div className="mobile-language-picker">
            <button
              className="mobile-language-trigger"
              type="button"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((value) => !value)}
            >
              <span className="mobile-language-current">
                <img src={`/sites/tagmarkets/flags/${current.flag}.png`} alt="" />
                {current.label}
              </span>
              <Chevron />
            </button>
            <div className={`mobile-language-options ${langOpen ? "is-open" : ""}`}>
              <div className="mobile-language-options-inner">
                {locales.map((locale) => (
                  <a
                    key={locale.code}
                    href={locale.href}
                    lang={locale.code}
                    aria-current={locale.current ? "page" : undefined}
                  >
                    <img src={`/sites/tagmarkets/flags/${locale.flag}.png`} alt="" />
                    <span>{locale.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mobile-menu-account">
            <a className="tm-button ghost" href={LOGIN_URL}>
              Login
            </a>
            <a className="mobile-menu-start" href={PORTAL_URL}>
              Get Started
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
