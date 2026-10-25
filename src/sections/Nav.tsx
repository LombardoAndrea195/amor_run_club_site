import { useEffect, useState } from "react";
import { asset } from "../data";

const links = [
  ["Rome", "#rome"],
  ["Reels", "#reels"],
  ["Events", "#events"],
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`nav ${solid ? "is-solid" : ""}`}>
      <a href="#top" className="nav__brand" aria-label="Amor Run Club, back to top">
        <img src={asset("brand/wordmark.png")} alt="" height={34} />
      </a>
      <nav aria-label="Primary">
        <ul>
          {links.map(([label, href]) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
          <li><a className="pill pill--sm" href="#join">Join the club</a></li>
        </ul>
      </nav>
    </header>
  );
}
