import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ScrollReveal from "../components/rb/ScrollReveal";
import { photo, site } from "../data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });
  }, { scope: root });

  return (
    <section className="about" id="rome" ref={root}>
      <div className="about__photo">
        <img data-parallax src={photo("group-piazza")} alt="Around a hundred Amor Run Club members posing together in a sunny Roman piazza" loading="lazy" />
      </div>
      <div className="about__text">
        <h2 className="display">Explore Rome</h2>
        <ScrollReveal baseOpacity={0.12} enableBlur blurStrength={4} containerClassName="about__reveal" textClassName="about__reveal-text">
          {site.about}
        </ScrollReveal>
        <div className="about__links">
          <a className="pill pill--ghost" href={site.links.strava} target="_blank" rel="noopener noreferrer">Join us on Strava</a>
          <a className="pill pill--ghost" href={site.links.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp community</a>
        </div>
      </div>
    </section>
  );
}
