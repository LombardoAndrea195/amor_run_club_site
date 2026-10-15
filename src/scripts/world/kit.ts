import * as THREE from "three";

export const palette = {
  cream: "#f5e6cc",
  pasta: "#f0b955",
  red: "#c8281e",
  ink: "#1d1b1a",
  stone: "#e6d6b8",
  cobble: "#dcc6a0",
  soil: "#b98a5e",
  soilDark: "#8f6644",
  grass: "#9fc47c",
  pine: "#4f7a45",
  pineDark: "#3f6838",
  trunk: "#8a5a3b",
  water: "#8ccbd8",
  skins: ["#f1c7a5", "#d9a57f", "#b77b54", "#8d5a3b", "#f5d4b8"],
  shirts: ["#c8281e", "#1d1b1a", "#f4efe6", "#e58a3a", "#2f5d50", "#f0b955", "#5b7fb8", "#c8281e"],
};

const cache = new Map<string, THREE.MeshStandardMaterial>();
export function clay(color: string, flat = true, doubleSided = false) {
  const key = color + flat + doubleSided;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color, roughness: 0.88, metalness: 0, flatShading: flat,
      side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
    });
    cache.set(key, m);
  }
  return m;
}

export function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, cast = true, receive = false) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

export const rand = (() => {
  let s = 20260415;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
})();
export const pick = <T>(a: readonly T[]) => a[Math.floor(rand() * a.length)];

/** Floating diorama plinth: chamfered top slab with a rocky root underneath. */
export function plinth(radius: number, top: string) {
  const g = new THREE.Group();
  const R = radius;
  const side = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0.01, -3.2),
      new THREE.Vector2(R - 0.9, -3.2),
      new THREE.Vector2(R, -2.3),
      new THREE.Vector2(R, -0.45),
      new THREE.Vector2(R - 0.45, 0),
      new THREE.Vector2(0.01, 0),
    ],
    40,
  );
  g.add(mesh(side, clay(palette.soil, true, true), false, true));
  const lid = mesh(new THREE.CylinderGeometry(R - 0.45, R - 0.3, 0.3, 48), clay(top, false), false, true);
  lid.position.y = 0.15;
  g.add(lid);
  const root = mesh(new THREE.ConeGeometry(R * 0.82, 8, 7, 2), clay(palette.soilDark), false, false);
  root.rotation.x = Math.PI;
  root.position.y = -3.2 - 4;
  g.add(root);
  return g;
}

export const TOP = 0.3;

export function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function sign(text: string, w: number, h: number, bg: string, fg: string, font = "Bowlby One") {
  const tex = canvasTexture(1024, Math.round((1024 * h) / w), (c) => {
    c.fillStyle = bg;
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    c.fillStyle = fg;
    c.textAlign = "center";
    c.textBaseline = "middle";
    let size = c.canvas.height * 0.62;
    c.font = `${size}px "${font}", sans-serif`;
    while (c.measureText(text).width > c.canvas.width * 0.88) {
      size *= 0.92;
      c.font = `${size}px "${font}", sans-serif`;
    }
    c.fillText(text, c.canvas.width / 2, c.canvas.height / 2 + size * 0.06);
  });
  return mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), false);
}

export function stripes(a: string, b: string, n = 8) {
  return canvasTexture(512, 256, (c) => {
    for (let i = 0; i < n; i++) {
      c.fillStyle = i % 2 ? b : a;
      c.fillRect((i * 512) / n, 0, 512 / n, 256);
    }
  });
}

export function umbrellaPine(scale = 1) {
  const g = new THREE.Group();
  const h = 2.6 + rand() * 1.4;
  const trunk = mesh(new THREE.CylinderGeometry(0.14, 0.22, h, 6), clay(palette.trunk));
  trunk.position.y = h / 2;
  trunk.rotation.z = (rand() - 0.5) * 0.15;
  g.add(trunk);
  const crown = mesh(new THREE.IcosahedronGeometry(1.6, 1), clay(rand() > 0.5 ? palette.pine : palette.pineDark));
  crown.scale.set(1.1, 0.42, 1.1);
  crown.position.y = h + 0.3;
  g.add(crown);
  g.scale.setScalar(scale);
  return g;
}

export function cypress(scale = 1) {
  const g = new THREE.Group();
  const c = mesh(new THREE.ConeGeometry(0.55, 3.6, 7), clay(palette.pineDark));
  c.position.y = 2;
  g.add(c);
  const t = mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.4, 5), clay(palette.trunk));
  t.position.y = 0.2;
  g.add(t);
  g.scale.setScalar(scale);
  return g;
}

/* ---------- Runners ---------- */

const torsoGeo = new THREE.CapsuleGeometry(0.3, 0.5, 4, 8);
const headGeo = new THREE.SphereGeometry(0.27, 12, 10);
const legGeo = new THREE.CapsuleGeometry(0.1, 0.55, 3, 6);
const armGeo = new THREE.CapsuleGeometry(0.085, 0.45, 3, 6);
const hairGeo = new THREE.SphereGeometry(0.29, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2);
legGeo.translate(0, -0.38, 0);
armGeo.translate(0, -0.3, 0);

export type Runner = {
  group: THREE.Group;
  legs: THREE.Object3D[];
  arms: THREE.Object3D[];
  phase: number;
  update: (t: number, dt: number) => void;
};

export function runner(shirt = pick(palette.shirts)): Runner {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);
  const skin = clay(pick(palette.skins), false);
  const torso = mesh(torsoGeo, clay(shirt, false));
  torso.position.y = 1.25;
  body.add(torso);
  const head = mesh(headGeo, skin);
  head.position.y = 1.95;
  body.add(head);
  const hair = mesh(hairGeo, clay(pick(["#2b1d14", "#5a3a22", "#1d1b1a", "#c99a5b", "#7a4b2a"]), false));
  hair.position.y = 1.98;
  hair.rotation.x = -0.25;
  body.add(hair);
  const shorts = clay(pick(["#1d1b1a", "#2a2a33", "#3b3b3b", "#c8281e"]), false);
  const legs = [-0.14, 0.14].map((x) => {
    const p = new THREE.Group();
    p.position.set(x, 0.92, 0);
    p.add(mesh(legGeo, shorts));
    // A layered sole and upper give every runner a readable running shoe,
    // even at the small scale of the flying camera.
    const sole = mesh(new THREE.BoxGeometry(0.27, 0.09, 0.58), clay("#fbfaf6", false));
    sole.position.set(0, -0.78, 0.18);
    p.add(sole);
    const upper = mesh(new THREE.SphereGeometry(0.17, 10, 7), clay(pick(["#c8281e", "#f0b955", "#36a9e1", "#1d1b1a"]), false));
    upper.scale.set(0.9, 0.55, 1.6);
    upper.position.set(0, -0.69, 0.18);
    p.add(upper);
    body.add(p);
    return p;
  });
  const arms = [-0.38, 0.38].map((x) => {
    const p = new THREE.Group();
    p.position.set(x, 1.5, 0);
    p.rotation.z = x < 0 ? -0.12 : 0.12;
    p.add(mesh(armGeo, skin));
    body.add(p);
    return p;
  });
  const r: Runner = { group, legs, arms, phase: rand() * Math.PI * 2, update: () => {} };
  r.update = (t) => {
    const ph = t * 9 + r.phase;
    legs[0].rotation.x = Math.sin(ph) * 0.85;
    legs[1].rotation.x = -Math.sin(ph) * 0.85;
    arms[0].rotation.x = -Math.sin(ph) * 0.9;
    arms[1].rotation.x = Math.sin(ph) * 0.9;
    body.position.y = Math.abs(Math.sin(ph)) * 0.12;
    body.rotation.x = 0.12;
  };
  return r;
}

/** A runner that stands and cheers (crowd, cafe tables). */
export function cheerer(shirt?: string): Runner {
  const r = runner(shirt);
  const body = r.group.children[0];
  r.update = (t) => {
    const ph = t * 3 + r.phase;
    const up = Math.max(0, Math.sin(ph));
    body.position.y = up * 0.25;
    r.arms[0].rotation.z = -0.12 - up * 2.4;
    r.arms[1].rotation.z = 0.12 + up * 2.4;
    r.legs[0].rotation.x = 0;
    r.legs[1].rotation.x = 0;
  };
  return r;
}

/** Runner travelling an ellipse around a centre, at its own pace. */
export function lap(
  r: Runner,
  a: number,
  b: number,
  speed: number | ((t: number) => number),
  start = rand() * Math.PI * 2,
) {
  let ang = start;
  let clock = rand() * 10;
  const run = r.update;
  r.update = (t, dt) => {
    const v = typeof speed === "number" ? speed : speed(t);
    ang += (v / ((a + b) / 2)) * dt;
    const x = Math.cos(ang) * a;
    const z = Math.sin(ang) * b;
    r.group.position.set(x, TOP, z);
    r.group.rotation.y = Math.atan2(-Math.sin(ang) * a, Math.cos(ang) * b);
    clock += dt * (0.6 + v * 0.12);
    run(clock, dt);
  };
  return r;
}
