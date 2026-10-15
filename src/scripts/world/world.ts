import * as THREE from "three";
import { piazza, colosseo, parco, pastificio, edicola, finale, clouds, type Scene } from "./scenes";
import { palette } from "./kit";

/**
 * Scroll-driven flight through six clay dioramas of the club's Rome.
 * Scroll position only drives the camera along a fixed path ("scroll = time"),
 * so the visitor is always in control. Every scene keeps living on its own.
 */

const CENTERS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(36, 2, -24),
  new THREE.Vector3(74, -1, 2),
  new THREE.Vector3(110, 1, -24),
  new THREE.Vector3(146, 0, 4),
  new THREE.Vector3(182, 2, -18),
];

/** Seconds of scroll weight spent hovering on each anchor before flying on. */
const HOLD = 1.1;

type Key = { pos: THREE.Vector3; look: THREE.Vector3; anchor?: number };

function buildKeys(portrait: boolean) {
  const k = portrait ? 1.4 : 1;
  const keys: Key[] = [];
  CENTERS.forEach((c, i) => {
    const last = i === CENTERS.length - 1;
    const side = i % 2 ? -1 : 1;
    // establishing: high and wide
    keys.push({
      pos: c.clone().add(new THREE.Vector3(side * 10 * k, 30 * k, 34 * k)),
      look: c.clone(),
      anchor: i === 0 ? 0 : undefined,
    });
    // dive: low, inside the scene
    keys.push({
      pos: c.clone().add(last ? new THREE.Vector3(0, 9 * k, 30 * k) : new THREE.Vector3(-side * 4 * k, 6.5 * k, 15 * k)),
      look: c.clone().add(new THREE.Vector3(0, last ? 3 : 1.8, 0)),
      anchor: i + 1,
    });
    if (!last) {
      // hop: pull up and out toward the next island
      const n = CENTERS[i + 1];
      keys.push({
        pos: c.clone().lerp(n, 0.45).add(new THREE.Vector3(0, 24 * k, 26 * k)),
        look: c.clone().lerp(n, 0.7),
      });
    }
  });
  return keys;
}

export function initWorld(opts: {
  canvas: HTMLCanvasElement;
  track: HTMLElement;
  panels: HTMLElement[];
  dots: HTMLButtonElement[];
}) {
  const { canvas, track, panels, dots } = opts;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = matchMedia("(max-width: 760px)").matches;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch {
    document.documentElement.classList.add("no-gl");
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(palette.cream);
  scene.fog = new THREE.Fog(palette.cream, 70, 190);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 400);

  scene.add(new THREE.HemisphereLight("#fff4e0", "#c9a27a", 1.5));
  const sun = new THREE.DirectionalLight("#ffe2b8", 2.4);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(small ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = sc.bottom = -26;
  sc.right = sc.top = 26;
  sc.near = 1;
  sc.far = 120;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  const scenes: Scene[] = [piazza(), colosseo(), parco(), pastificio(), edicola(), finale()];
  scenes.forEach((s, i) => {
    s.group.position.copy(CENTERS[i]);
    s.group.rotation.y = i % 2 ? 0.25 : -0.2;
    scene.add(s.group);
  });

  const cloudSpots: THREE.Vector3[] = [];
  for (let i = 0; i < CENTERS.length - 1; i++) {
    const m = CENTERS[i].clone().lerp(CENTERS[i + 1], 0.5);
    cloudSpots.push(m.clone().add(new THREE.Vector3(-6, 12, -10)), m.clone().add(new THREE.Vector3(8, -14, 6)));
  }
  cloudSpots.push(new THREE.Vector3(-30, 8, -30), new THREE.Vector3(-22, -16, 20), new THREE.Vector3(210, 10, -40), new THREE.Vector3(200, -12, 10));
  const sky = clouds(cloudSpots);
  scene.add(sky);

  let keys: Key[] = [];
  let posCurve: THREE.CatmullRomCurve3;
  let lookCurve: THREE.CatmullRomCurve3;
  // piecewise map: scroll weight → curve key index, with holds at anchors
  let knots: { s: number; u: number }[] = [];
  let total = 0;
  const anchorS: number[] = [];
  const anchorU: number[] = [];

  function layout() {
    const portrait = innerWidth / innerHeight < 0.9;
    keys = buildKeys(portrait);
    posCurve = new THREE.CatmullRomCurve3(keys.map((k) => k.pos), false, "centripetal");
    lookCurve = new THREE.CatmullRomCurve3(keys.map((k) => k.look), false, "centripetal");
    knots = [];
    anchorS.length = 0;
    let s = 0;
    keys.forEach((k, i) => {
      knots.push({ s, u: i });
      if (k.anchor !== undefined) {
        anchorS[k.anchor] = s + HOLD / 2;
        anchorU[k.anchor] = i;
        s += HOLD;
        knots.push({ s, u: i });
      }
      if (i < keys.length - 1) s += 1;
    });
    total = s;
    camera.fov = portrait ? 55 : 40;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
    track.style.height = `${Math.round(total * (small ? 70 : 80))}vh`;
  }

  function uFromS(s: number) {
    for (let i = 0; i < knots.length - 1; i++) {
      const a = knots[i];
      const b = knots[i + 1];
      if (s <= b.s) {
        const f = b.s === a.s ? 0 : (s - a.s) / (b.s - a.s);
        const e = f * f * (3 - 2 * f);
        return a.u + (b.u - a.u) * e;
      }
    }
    return knots[knots.length - 1].u;
  }

  function scrollS() {
    const max = track.offsetHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, (scrollY - track.offsetTop) / max)) : 0;
    return p * total;
  }

  let active = -1;
  function setActive(i: number) {
    if (i === active) return;
    const prev = panels[active];
    if (prev) {
      prev.classList.add("is-hiding");
      prev.classList.remove("is-shown");
      prev.setAttribute("aria-hidden", "true");
      prev.inert = true;
      setTimeout(() => prev.classList.remove("is-hiding"), 200);
    }
    active = i;
    const next = panels[i];
    if (next) {
      next.classList.remove("is-hiding");
      void next.offsetHeight;
      next.classList.add("is-shown");
      next.removeAttribute("aria-hidden");
      next.inert = false;
    }
    dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
  }

  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      const max = track.offsetHeight - innerHeight;
      scrollTo({ top: track.offsetTop + (anchorS[i] / total) * max, behavior: reduce ? "auto" : "smooth" });
    }),
  );

  layout();
  addEventListener("resize", layout);

  let current = uFromS(scrollS());
  const clock = new THREE.Clock();
  let t = 0;
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const s = scrollS();
    // panel follows the nearest anchor
    let best = 0;
    anchorS.forEach((a, i) => {
      if (Math.abs(s - a) < Math.abs(s - anchorS[best])) best = i;
    });
    setActive(Math.abs(s - anchorS[best]) < 0.9 ? best : -1);

    const target = reduce ? anchorU[best] : uFromS(s);
    current = reduce ? target : current + (target - current) * (1 - Math.exp(-dt * 5));

    const max = keys.length - 1;
    posCurve.getPoint(Math.min(1, current / max), pos);
    lookCurve.getPoint(Math.min(1, current / max), look);
    camera.position.copy(pos);
    camera.lookAt(look);

    sun.target.position.copy(look);
    sun.position.copy(look).add(new THREE.Vector3(-22, 40, 18));

    if (!reduce) {
      t += dt;
      // only animate islands near the camera
      scenes.forEach((sc) => {
        if (sc.group.position.distanceTo(look) > 70) return;
        sc.runners.forEach((r) => r.update(t, dt));
        sc.tick?.(t, dt);
      });
      sky.children.forEach((c, i) => (c.position.x += Math.sin(t * 0.1 + i) * dt * 0.4));
    }
    renderer.render(scene, camera);
  }

  // first pose for every runner even when animation is off
  scenes.forEach((sc) => {
    sc.runners.forEach((r) => r.update(0.3, 0.016));
    sc.tick?.(0.3, 0.016);
  });

  let raf = 0;
  const loop = () => {
    frame();
    raf = requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      clock.getDelta();
      loop();
    }
  });
  document.documentElement.classList.add("gl-ready");
}
