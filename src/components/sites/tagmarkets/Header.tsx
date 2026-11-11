import { Logo } from "./Logo";
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

export function Header() {
  const current = locales[0];

  return (
    <header className="nav">
      <div className="tm-container nav-inner">
        <Logo />

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) =>
            item.children ? (
              <div className="nav-item" key={item.label}>
                <button className="nav-trigger" type="button" aria-haspopup="true">
                  {item.label}
                  <Chevron />
                </button>
                <div className="nav-dropdown">
                  {item.children.map((child) => (
                    <a key={child.label} href={child.href}>
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="nav-actions">
          <div className="nav-item locale-picker">
            <button className="locale-trigger" type="button" aria-label="Select language" aria-haspopup="true">
              <img className="locale-flag" src={`/sites/tagmarkets/flags/${current.flag}.png`} alt="" />
              <span className="sr-only">{current.label}</span>
              <Chevron />
            </button>
            <div className="nav-dropdown locale-dropdown">
              {locales.map((locale) => (
                <a
                  key={locale.code}
                  href={locale.href}
                  lang={locale.code}
                  aria-current={locale.current ? "page" : undefined}
                >
                  <img className="locale-flag" src={`/sites/tagmarkets/flags/${locale.flag}.png`} alt="" />
                  <span>{locale.label}</span>
                </a>
              ))}
            </div>
          </div>
          <a className="tm-button ghost" href={LOGIN_URL}>
            Login
          </a>
          <a className="tm-button black" href={PORTAL_URL}>
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
