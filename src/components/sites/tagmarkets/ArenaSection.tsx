import { PORTAL_URL } from "./data";

export function ArenaSection() {
  return (
    <section className="home-dark home-arena reveal-on-scroll">
      <div className="tm-container">
        <div className="home-arena-content">
          <h2>Tag Tournament Arena</h2>
          <p>
            Prove your trading skills, compete against traders world wide and win prizes like luxury
            watches, vacations and supercars.
          </p>
          <a className="tm-button main" href={PORTAL_URL}>
            Start Trading
          </a>
        </div>
        <div className="home-arena-visual">
          <img
            src="/sites/tagmarkets/home/tournament-arena.png"
            alt="Tournament arena visual"
          />
        </div>
        <p className="media-disclaimer">Interface shown for illustration only.</p>
      </div>
    </section>
  );
}
