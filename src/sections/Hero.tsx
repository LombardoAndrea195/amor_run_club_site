import { useEffect, useRef, useState } from "react";
import SplitText from "../components/rb/SplitText";
import Magnet from "../components/rb/Magnet";
import CircularText from "../components/rb/CircularText";
import { asset, site } from "../data";

export default function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const portrait = typeof window !== "undefined" && matchMedia("(max-width: 700px)").matches;

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      return;
    }
    v.play().catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <video
        ref={video}
        className="hero__video"
        muted loop playsInline preload="auto" aria-hidden="true"
        poster={asset(portrait ? "video/hero-poster-portrait.jpg" : "video/hero-poster.jpg")}
      >
        {portrait && <source src={asset("video/hero-loop-portrait.webm")} type="video/webm" />}
        {portrait && <source src={asset("video/hero-loop-portrait.mp4")} type="video/mp4" />}
        <source src={asset("video/hero-loop.webm")} type="video/webm" />
        <source src={asset("video/hero-loop.mp4")} type="video/mp4" />
      </video>
      <div className="hero__scrim" />

      <div className="hero__content">
        <p className="eyebrow">Run club · Rome</p>
        <SplitText
          tag="h1"
          text="Run, laugh and connect"
          className="hero__title"
          splitType="words"
          trigger="load"
          mask
          delay={90}
          duration={1.1}
          from={{ opacity: 0, y: 80 }}
          to={{ opacity: 1, y: 0 }}
        />
        <p className="hero__sub">Every pace welcome. Free weekly runs through the city, then pasta.</p>
        <div className="hero__ctas">
          <Magnet magnetStrength={3} padding={60}>
            <a className="pill" href="#join">Join the club</a>
          </Magnet>
          <a className="textlink" href={site.links.instagram} target="_blank" rel="noopener noreferrer">
            Follow {site.links.handle}
          </a>
        </div>
      </div>

      <div className="hero__badge" aria-hidden="true">
        <CircularText text="EAT PASTA RUN FASTA " size={170} fontSize={17} spinDuration={18} color="#fbf6f2" />
        <img src={asset("brand/mascot.png")} alt="" />
      </div>

      <button className="hero__toggle" type="button" onClick={toggle} aria-pressed={!playing}
        aria-label={playing ? "Pause background video" : "Play background video"}>
        {playing ? "Pause" : "Play"}
      </button>
    </section>
  );
}
