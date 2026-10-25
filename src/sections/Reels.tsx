import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { asset, photo, reels, site } from "../data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ReelCard({ src, poster, title, index }: (typeof reels)[number] & { index: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || failed || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, [failed]);

  return (
    <article className="reel">
      <div className="reel__frame">
        {failed ? (
          <img src={photo(poster)} alt="" loading="lazy" />
        ) : (
          <video ref={ref} src={asset(src)} poster={photo(poster)} muted loop playsInline preload="metadata"
            aria-label={title} onError={() => setFailed(true)} />
        )}
        <span className="reel__num">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="reel__title">{title}</h3>
    </article>
  );
}

export default function Reels() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 860px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      const distance = () => t.scrollWidth - window.innerWidth;
      gsap.to(t, {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: root.current, pin: true, scrub: 0.8, start: "top top",
          end: () => `+=${distance()}`, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
    });
  }, { scope: root });

  return (
    <section className="reels" id="reels" ref={root} aria-labelledby="reels-title">
      <div className="reels__head">
        <h2 id="reels-title" className="display">From the reels</h2>
        <a className="textlink" href={site.links.instagram} target="_blank" rel="noopener noreferrer">All on Instagram →</a>
      </div>
      <div className="reels__track" ref={track}>
        {reels.map((r, i) => <ReelCard key={r.src} {...r} index={i} />)}
      </div>
    </section>
  );
}
