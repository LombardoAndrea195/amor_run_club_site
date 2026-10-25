import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import Motto from "./sections/Motto";
import About from "./sections/About";
import Reels from "./sections/Reels";
import Gallery from "./sections/Gallery";
import Events from "./sections/Events";
import Join from "./sections/Join";
import Footer from "./sections/Footer";
import { LenisContext } from "./lenis";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const raf = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, anchors: true, lerp: 0.1 }}>
      <LenisContext.Provider value={lenisRef}>
        <a className="skip" href="#main">Skip to content</a>
        <Nav />
        <main id="main">
          <Hero />
          <Motto />
          <About />
          <Reels />
          <Gallery />
          <Events />
          <Join />
        </main>
        <Footer />
      </LenisContext.Provider>
    </ReactLenis>
  );
}
