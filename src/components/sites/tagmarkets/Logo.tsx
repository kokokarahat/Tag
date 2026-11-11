import Link from "next/link";

const PIECES = [1, 2, 3, 4, 5, 6, 7, 8];

/** The logo "builds itself" from eight clipped copies of the same SVG. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Tag Markets home"
      className={`logo animated-logo ${className}`.trim()}
    >
      <img className="animated-logo-fallback" src="/sites/tagmarkets/logo.svg" alt="Tag Markets" />
      <span className="logo-build" aria-hidden="true">
        {PIECES.map((n) => (
          <img
            key={n}
            className={`logo-piece logo-piece-${n}`}
            src="/sites/tagmarkets/logo.svg"
            alt=""
          />
        ))}
      </span>
    </Link>
  );
}
