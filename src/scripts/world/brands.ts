import * as THREE from "three";
import {
  TOP, clay, mesh, palette, plinth, rand, sign, umbrellaPine, cypress,
  runner, cheerer, lap, canvasTexture, type Runner,
} from "./kit";
import type { Scene } from "./scenes";

/* ---------- Giant pasta, one shape per collaboration ---------- */

const pastaMat = () => new THREE.MeshStandardMaterial({ color: palette.pasta, roughness: 0.7 });

export function fusilli() {
  const g = new THREE.Group();
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 7;
    pts.push(new THREE.Vector3(Math.cos(a) * 0.55, i * 0.035, Math.sin(a) * 0.55));
  }
  const m = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, 0.32, 10), pastaMat());
  g.add(m);
  return g;
}

export function farfalla() {
  const g = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.6, 0.9, 1.6, 1.1, 1.8, 0.7);
  shape.lineTo(1.8, -0.7);
  shape.bezierCurveTo(1.6, -1.1, 0.6, -0.9, 0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 });
  for (const s of [1, -1]) {
    const w = mesh(geo, pastaMat());
    w.scale.x = s;
    w.rotation.y = s * 0.25;
    g.add(w);
  }
  const knot = mesh(new THREE.SphereGeometry(0.32, 12, 10), pastaMat());
  knot.scale.set(0.8, 1.2, 0.9);
  knot.position.z = 0.09;
  g.add(knot);
  return g;
}

export function penne() {
  const geo = new THREE.CylinderGeometry(0.55, 0.55, 3.4, 40, 6, true);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // diagonal cut at both ends + light ridges
    const k = 1 + 0.05 * Math.cos(Math.atan2(v.z, v.x) * 14);
    const y = v.y + (Math.abs(v.y) > 1.6 ? v.x * 0.7 * Math.sign(v.y) : 0);
    pos.setXYZ(i, v.x * k, y, v.z * k);
  }
  geo.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({ color: palette.pasta, roughness: 0.7, side: THREE.DoubleSide });
  const g = new THREE.Group();
  g.add(mesh(geo, m));
  return g;
}

export function spaghettiPlate() {
  const g = new THREE.Group();
  const plate = mesh(new THREE.CylinderGeometry(2.2, 1.6, 0.35, 32), clay("#fbfaf6", false));
  g.add(plate);
  const mat = pastaMat();
  for (let i = 0; i < 9; i++) {
    const t = mesh(new THREE.TorusGeometry(0.5 + rand() * 0.9, 0.07, 6, 40), mat);
    t.rotation.set(Math.PI / 2 + (rand() - 0.5) * 0.9, rand() * 3, 0);
    t.position.set((rand() - 0.5) * 0.5, 0.35 + i * 0.07, (rand() - 0.5) * 0.5);
    g.add(t);
  }
  const sauce = mesh(new THREE.SphereGeometry(0.75, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), clay(palette.red, false));
  sauce.position.y = 0.95;
  sauce.scale.y = 0.55;
  g.add(sauce);
  const basil = mesh(new THREE.SphereGeometry(0.22, 8, 6), clay("#3f8a3a"));
  basil.scale.set(1.3, 0.3, 0.8);
  basil.position.set(0.2, 1.38, 0.1);
  g.add(basil);
  return g;
}

/** A spinning giant pasta on a little pedestal. */
function pastaMonument(piece: THREE.Group, scale: number, lift: number) {
  const g = new THREE.Group();
  const ped = mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.8, 20), clay("#fbeedd", false), true, true);
  ped.position.y = 0.4;
  g.add(ped);
  piece.scale.setScalar(scale);
  piece.position.y = lift;
  g.add(piece);
  const spin = (t: number) => {
    piece.rotation.y = t * 0.6;
    piece.position.y = lift + Math.sin(t * 1.6) * 0.15;
  };
  return { group: g, spin };
}

/** Finish/start arch with a brand panel on top. */
function arch(text: string, bg: string, fg: string, width = 8) {
  const g = new THREE.Group();
  for (const x of [-width / 2, width / 2]) {
    const post = mesh(new THREE.BoxGeometry(0.6, 4.4, 0.6), clay(bg));
    post.position.set(x, 2.2, 0);
    g.add(post);
  }
  const beam = sign(text, width + 0.6, 1.2, bg, fg);
  beam.position.y = 4.7;
  g.add(beam);
  const back = mesh(new THREE.BoxGeometry(width + 0.6, 1.2, 0.3), clay(bg));
  back.position.set(0, 4.7, -0.16);
  g.add(back);
  return g;
}

function flagBanner(text: string, bg: string, fg: string) {
  const g = new THREE.Group();
  const pole = mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.5, 6), clay(palette.ink));
  pole.position.y = 2.25;
  g.add(pole);
  const flag = sign(text, 2.6, 1.3, bg, fg);
  flag.position.set(1.33, 3.7, 0);
  g.add(flag);
  return g;
}

/* Season marks: a big year badge on posts plus a coloured rim on the plinth,
   so the 2025 collaborations and the 2026 ones read at a glance. */
const yearColor = (year: number) => (year === 2025 ? palette.red : "#e6b84a");

function yearBadge(year: number) {
  const bg = yearColor(year);
  const g = new THREE.Group();
  const board = sign(String(year), 3.6, 2, bg, year === 2025 ? "#fbeedd" : palette.ink);
  board.position.y = 3.1;
  g.add(board);
  const back = mesh(new THREE.BoxGeometry(3.6, 2, 0.24), clay(bg));
  back.position.set(0, 3.1, -0.13);
  g.add(back);
  for (const x of [-1.5, 1.5]) {
    const post = mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.1, 6), clay(palette.ink));
    post.position.set(x, 1.55, -0.02);
    g.add(post);
  }
  return g;
}

function yearRing(group: THREE.Group, year: number, radius = 11.6) {
  const ring = mesh(new THREE.TorusGeometry(radius, 0.16, 8, 96), clay(yearColor(year), false), false);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = TOP + 0.03;
  group.add(ring);
}

function brandRunners(group: THREE.Group, runners: Runner[], shirts: string[], n = 10, a = 9.6, b = 9.2) {
  for (let i = 0; i < n; i++) {
    const r = lap(runner(shirts[i % shirts.length]), a, b, 2.2 + rand() * 1.6, (i / n) * Math.PI * 2);
    group.add(r.group);
    runners.push(r);
  }
}

/* Tuesday intervals with the coach */
export function pista(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12.5, palette.grass));
  const runners: Runner[] = [];

  const wrap = new THREE.Group();
  wrap.scale.set(1.3, 1, 1);
  const track = mesh(new THREE.RingGeometry(6.2, 8.6, 72), clay("#b5452f", false), false, true);
  track.rotation.x = -Math.PI / 2;
  track.position.y = TOP + 0.02;
  wrap.add(track);
  for (const r of [6.8, 7.4, 8]) {
    const l = mesh(new THREE.RingGeometry(r, r + 0.05, 72), clay("#fbfaf6", false), false, true);
    l.rotation.x = -Math.PI / 2;
    l.position.y = TOP + 0.03;
    wrap.add(l);
  }
  group.add(wrap);

  const coneGeo = new THREE.ConeGeometry(0.22, 0.5, 10);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const c = mesh(coneGeo, clay("#f07b22", false));
    c.position.set(Math.cos(a) * 8.9 * 1.3, TOP + 0.25, Math.sin(a) * 8.9);
    group.add(c);
  }

  // the coach: cap, whistle, clipboard, watching the stopwatch
  const coach = cheerer("#1d1b1a");
  const body = coach.group.children[0];
  const cap = mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.14, 14), clay(palette.red, false));
  cap.position.y = 2.17;
  body.add(cap);
  const brim = mesh(new THREE.BoxGeometry(0.42, 0.04, 0.32), clay(palette.red, false));
  brim.position.set(0, 2.12, 0.3);
  body.add(brim);
  const board = mesh(new THREE.BoxGeometry(0.5, 0.65, 0.05), clay("#c99a5b", false));
  board.position.set(0.35, 1.25, 0.38);
  board.rotation.x = -0.5;
  body.add(board);
  coach.update = (t) => {
    // checks the clipboard, then raises the stopwatch arm on every rep
    const rep = Math.sin(t * 1.1) > 0.4;
    coach.arms[1].rotation.x = rep ? -2.2 : -0.5;
    coach.arms[0].rotation.x = -0.6;
    body.rotation.y = Math.sin(t * 0.5) * 0.6;
  };
  coach.group.position.set(0, TOP, 2);
  coach.group.scale.setScalar(1.25);
  group.add(coach.group);
  runners.push(coach);

  const label = sign("INTERVALS", 4.5, 0.9, palette.ink, palette.pasta);
  label.rotation.x = -Math.PI / 2;
  label.position.set(0, TOP + 0.04, -2.5);
  group.add(label);

  // reps: everyone sprints together, then jogs to recover
  const pace = (t: number) => (Math.sin(t * 1.1) > 0.4 ? 7 : 1.6);
  for (let i = 0; i < 12; i++) {
    const lane = 6.5 + (i % 3) * 0.6;
    const r = lap(runner(), lane * 1.3, lane, (t) => pace(t) * (0.9 + (i % 4) * 0.05), -1.2 + i * 0.22);
    group.add(r.group);
    runners.push(r);
  }

  const pedestal = pastaMonument(penne(), 0.6, 2.2);
  pedestal.group.position.set(-3.6, TOP, 1.6);
  pedestal.group.scale.setScalar(0.8);
  group.add(pedestal.group);

  return { group, runners, tick: (t) => pedestal.spin(t) };
}

/* The three founders: a centred wall of front-facing portraits */
export function fondatori(photos: (string | null)[], names: string[], focus: number[] = []): Scene {
  const group = new THREE.Group();
  group.add(plinth(12, "#f3dcc0"));
  const runners: Runner[] = [];
  const loader = new THREE.TextureLoader();

  /** Stretch-free cover: crop the axis that overflows the frame, centred on the face. */
  const cover = (tex: THREE.Texture, imgAspect: number, planeAspect: number, top: number) => {
    const wider = imgAspect > planeAspect;
    const fx = wider ? Math.min(1, planeAspect / imgAspect) : 1;
    const fy = wider ? 1 : Math.min(1, imgAspect / planeAspect);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(fx, fy);
    const v = 1 - top; // three.js reads v up from the image's bottom edge
    tex.offset.set((1 - fx) / 2, fy < 1 ? Math.min(1 - fy, Math.max(0, v - fy / 2)) : 0);
    tex.needsUpdate = true;
  };

  // three cards side by side, dead centre, all facing the camera; the middle leads
  const cards = [
    { x: -4.8, w: 3.7, h: 4.7 },
    { x: 0, w: 4.6, h: 5.7 },
    { x: 4.8, w: 3.7, h: 4.7 },
  ];
  cards.forEach((c, i) => {
    const stand = new THREE.Group();
    const shelf = mesh(new THREE.BoxGeometry(c.w + 0.5, 0.5, 1), clay("#fbeedd"), true, true);
    shelf.position.y = 0.25;
    stand.add(shelf);
    const frame = mesh(new THREE.BoxGeometry(c.w + 0.3, c.h + 0.3, 0.3), clay(palette.ink, false));
    frame.position.y = 0.5 + c.h / 2;
    stand.add(frame);
    const aspect = c.w / c.h;
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.85 });
    mat.map = canvasTexture(512, Math.round(512 / aspect), (g) => {
      g.fillStyle = palette.pasta;
      g.fillRect(0, 0, g.canvas.width, g.canvas.height);
      g.fillStyle = palette.red;
      g.beginPath();
      g.arc(g.canvas.width / 2, g.canvas.height * 0.38, g.canvas.width * 0.23, 0, Math.PI * 2);
      g.fill();
      g.fillRect(g.canvas.width * 0.21, g.canvas.height * 0.58, g.canvas.width * 0.58, g.canvas.height * 0.42);
      g.fillStyle = "#fbeedd";
      g.font = `${g.canvas.width * 0.35}px "Bowlby One", sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(String(i + 1), g.canvas.width / 2, g.canvas.height * 0.37);
    });
    const photo = mesh(new THREE.PlaneGeometry(c.w, c.h), mat, false);
    photo.position.set(0, 0.5 + c.h / 2, 0.16);
    stand.add(photo);
    const src = photos[i];
    if (src)
      loader.load(src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        cover(tex, (tex.image as HTMLImageElement).naturalWidth / (tex.image as HTMLImageElement).naturalHeight, aspect, focus[i] ?? 0.5);
        mat.map = tex;
        mat.needsUpdate = true;
      });
    const plate = sign(names[i] ?? "Founder", c.w, 0.6, palette.red, "#fbeedd");
    plate.position.set(0, 0.25, 0.53);
    stand.add(plate);
    stand.position.set(c.x, TOP, 0.6);
    group.add(stand);
  });

  // "THE FOUNDERS" plaque, mounted on the centre frame
  const header = sign("THE FOUNDERS", 9.4, 1.1, palette.red, "#fbeedd");
  header.position.set(0, 6.75, 0.91);
  group.add(header);
  const headerBack = mesh(new THREE.BoxGeometry(9.4, 1.1, 0.3), clay(palette.red));
  headerBack.position.set(0, 6.75, 0.75);
  group.add(headerBack);

  for (let i = 0; i < 9; i++) {
    const c = cheerer();
    c.group.position.set(-4 + (i % 5) * 2, TOP, 5.4 + Math.floor(i / 5) * 1.6);
    c.group.rotation.y = Math.PI + (rand() - 0.5) * 0.5;
    group.add(c.group);
    runners.push(c);
  }
  const plate = pastaMonument(spaghettiPlate(), 1, 0.8);
  plate.group.position.set(7.5, TOP, 3);
  plate.group.scale.setScalar(0.9);
  group.add(plate.group);
  for (const [x, z] of [[-9, -2], [8.5, -5]]) {
    const p = umbrellaPine(0.8);
    p.position.set(x, TOP, z);
    group.add(p);
  }
  return { group, runners, tick: (t) => plate.spin(t * 0.5) };
}

/* Saucony · London 2025 */
export function londra(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12, "#c9ccc5"));
  const runners: Runner[] = [];

  const tower = new THREE.Group();
  const shaft = mesh(new THREE.BoxGeometry(2, 9, 2), clay("#d8b878"), true, true);
  shaft.position.y = 4.5;
  tower.add(shaft);
  const clockTex = canvasTexture(256, 256, (c) => {
    c.fillStyle = "#fbf4e0";
    c.beginPath();
    c.arc(128, 128, 120, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = palette.ink;
    c.lineWidth = 10;
    c.stroke();
    c.lineWidth = 12;
    c.beginPath();
    c.moveTo(128, 128);
    c.lineTo(128, 50);
    c.moveTo(128, 128);
    c.lineTo(185, 128);
    c.stroke();
  });
  for (let s = 0; s < 4; s++) {
    const face = mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.8 }), false);
    const a = (s * Math.PI) / 2;
    face.position.set(Math.sin(a) * 1.02, 7.6, Math.cos(a) * 1.02);
    face.rotation.y = a;
    tower.add(face);
  }
  const spire = mesh(new THREE.ConeGeometry(1.5, 3, 4), clay("#4a5a4f"));
  spire.position.y = 10.5;
  spire.rotation.y = Math.PI / 4;
  tower.add(spire);
  tower.position.set(-5, TOP, -4);
  group.add(tower);

  const bus = new THREE.Group();
  const bbody = mesh(new THREE.BoxGeometry(5, 3, 1.8), clay("#c8281e"), true, true);
  bbody.position.y = 1.9;
  bus.add(bbody);
  for (const y of [1.6, 2.9])
    for (let i = 0; i < 5; i++) {
      const w = mesh(new THREE.BoxGeometry(0.75, 0.6, 0.05), clay("#2b3540"), false);
      w.position.set(-2 + i * 1, y, 0.92);
      bus.add(w);
    }
  for (const x of [-1.7, 1.7]) {
    const wheel = mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.9, 14), clay(palette.ink));
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, 0.45, 0);
    bus.add(wheel);
  }
  bus.position.set(3.5, TOP, -5);
  bus.rotation.y = -0.4;
  group.add(bus);

  const a = arch("SAUCONY · LONDON 2025", "#e2412b", "#fbf4e0", 7);
  a.position.set(2, TOP, 2.5);
  a.rotation.y = -0.2;
  group.add(a);

  const p = pastaMonument(farfalla(), 1.2, 2.6);
  p.group.position.set(-6.5, TOP, 4);
  group.add(p.group);
  yearRing(group, 2025);
  const yb = yearBadge(2025);
  yb.position.set(7.4, TOP, 4.6);
  yb.rotation.y = -0.55;
  group.add(yb);
  brandRunners(group, runners, ["#e2412b", "#1d1b1a", "#fbf4e0", "#c8281e"]);
  return { group, runners, tick: (t) => p.spin(t) };
}

/* Saucony · Milano 21, 2026 */
export function milano(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12, "#e3dccd"));
  const runners: Runner[] = [];

  const duomo = new THREE.Group();
  const facade = mesh(new THREE.BoxGeometry(8, 5, 3), clay("#f4ede0"), true, true);
  facade.position.y = 2.5;
  duomo.add(facade);
  const gable = mesh(new THREE.ConeGeometry(4.4, 2.2, 4), clay("#f4ede0"));
  gable.position.y = 6.1;
  gable.rotation.y = Math.PI / 4;
  gable.scale.z = 0.5;
  duomo.add(gable);
  const spireGeo = new THREE.ConeGeometry(0.18, 2.2, 6);
  for (let i = 0; i < 9; i++) {
    const s = mesh(spireGeo, clay("#f4ede0"));
    s.position.set(-3.8 + i * 0.95, 5 + 1.1 + (i === 4 ? 2.6 : 0), 1.2);
    if (i === 4) s.scale.setScalar(1.8);
    duomo.add(s);
  }
  const madonnina = mesh(new THREE.SphereGeometry(0.28, 10, 8), clay("#e6b84a", false));
  madonnina.position.set(0, 10.8, 1.2);
  duomo.add(madonnina);
  for (const x of [-2.4, 0, 2.4]) {
    const door = mesh(new THREE.BoxGeometry(1, 2, 0.08), clay("#6b5640"));
    door.position.set(x, 1, 1.52);
    duomo.add(door);
  }
  duomo.position.set(0, TOP, -5.5);
  group.add(duomo);

  const a = arch("MILANO 21 · SAUCONY", "#e2412b", "#fbf4e0", 7);
  a.position.set(0, TOP, 2.6);
  group.add(a);
  const km = sign("21.1 KM", 2.4, 0.9, palette.ink, palette.pasta);
  km.position.set(-6, TOP + 1.5, 3);
  km.rotation.y = 0.5;
  group.add(km);

  const p = pastaMonument(fusilli(), 1, 1);
  p.group.position.set(6.5, TOP, 3.2);
  group.add(p.group);
  yearRing(group, 2026);
  const yb = yearBadge(2026);
  yb.position.set(-7.6, TOP, 4.2);
  yb.rotation.y = 0.55;
  group.add(yb);
  brandRunners(group, runners, ["#e2412b", "#fbf4e0", "#1d1b1a", "#f0b955"]);
  return { group, runners, tick: (t) => p.spin(t) };
}

/* Brooks · Half marathon 2026 */
export function brooks(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12, "#cfe0ee"));
  const runners: Runner[] = [];
  const blue = "#1c3f94";
  const sky = "#36a9e1";

  const a = arch("BROOKS · HALF MARATHON 2026", blue, "#ffffff", 9);
  a.position.set(0, TOP, -1);
  group.add(a);
  const strip = mesh(new THREE.BoxGeometry(9, 0.04, 1.2), clay(sky, false), false, true);
  strip.position.set(0, TOP + 0.02, -1);
  group.add(strip);
  const km = sign("21.1", 2, 1, sky, "#ffffff");
  km.position.set(-6.5, TOP + 1.5, 2);
  km.rotation.y = 0.5;
  group.add(km);
  for (const [x, z, t] of [[6, -4, "21K"], [-6, -5, "2026"]] as const) {
    const f = flagBanner(t, blue, "#ffffff");
    f.position.set(x, TOP, z);
    group.add(f);
  }
  const p = pastaMonument(spaghettiPlate(), 1.1, 0.8);
  p.group.position.set(5.5, TOP, 4);
  group.add(p.group);
  yearRing(group, 2026);
  const yb = yearBadge(2026);
  yb.position.set(-7.6, TOP, 4.6);
  yb.rotation.y = 0.55;
  group.add(yb);
  brandRunners(group, runners, [blue, sky, "#ffffff", "#1d1b1a"], 12);
  return { group, runners, tick: (t) => p.spin(t * 0.5) };
}

/* Under Armour · 2026 */
export function underArmour(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12, "#3a3a3a"));
  const runners: Runner[] = [];

  const stage = mesh(new THREE.BoxGeometry(9, 0.8, 4.5), clay("#1d1b1a"), true, true);
  stage.position.set(0, TOP + 0.4, -4.5);
  group.add(stage);
  const wall = sign("UNDER ARMOUR · 2026", 9, 2.2, "#1d1b1a", "#ffffff");
  wall.position.set(0, TOP + 2.9, -6.7);
  group.add(wall);
  const wallBack = mesh(new THREE.BoxGeometry(9, 2.2, 0.3), clay("#111111"));
  wallBack.position.set(0, TOP + 2.9, -6.9);
  group.add(wallBack);
  for (const x of [-3.4, 3.4]) {
    const spot = mesh(new THREE.CylinderGeometry(0.3, 0.45, 0.7, 10), clay("#d9d9d9", false));
    spot.position.set(x, TOP + 4.6, -5.5);
    spot.rotation.x = 0.8;
    group.add(spot);
  }
  // plyo boxes for the workout
  for (let i = 0; i < 4; i++) {
    const b = mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), clay(i % 2 ? "#c8281e" : "#d9d9d9"), true, true);
    b.position.set(-4.5 + i * 3, TOP + 0.45, 1.5);
    group.add(b);
    const j = cheerer(i % 2 ? "#1d1b1a" : "#ffffff");
    j.group.position.set(-4.5 + i * 3, TOP + 0.9, 1.5);
    group.add(j.group);
    runners.push(j);
  }
  const p = pastaMonument(penne(), 0.8, 2.4);
  p.group.position.set(-7, TOP, -1);
  group.add(p.group);
  yearRing(group, 2026);
  const yb = yearBadge(2026);
  yb.position.set(7.4, TOP, 4.4);
  yb.rotation.y = -0.55;
  group.add(yb);
  brandRunners(group, runners, ["#1d1b1a", "#ffffff", "#c8281e"], 10, 10, 9.5);
  return { group, runners, tick: (t) => p.spin(t) };
}

/* Garmin · 2026 */
export function garmin(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12, "#d6e4ea"));
  const runners: Runner[] = [];

  const watch = new THREE.Group();
  const strap = mesh(new THREE.BoxGeometry(2.6, 9, 0.6), clay("#1d1b1a"), true, true);
  strap.position.y = 4.5;
  watch.add(strap);
  const caseM = mesh(new THREE.CylinderGeometry(2.4, 2.4, 1, 40), clay("#2b2f33", false));
  caseM.rotation.x = Math.PI / 2;
  caseM.position.set(0, 5, 0.4);
  watch.add(caseM);
  const screenTex = canvasTexture(512, 512, (c) => {
    c.fillStyle = "#0b0d10";
    c.beginPath();
    c.arc(256, 256, 256, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#36a9e1";
    c.font = '64px "Bowlby One", sans-serif';
    c.textAlign = "center";
    c.fillText("PACE", 256, 170);
    c.fillStyle = "#ffffff";
    c.font = '120px "Bowlby One", sans-serif';
    c.fillText("5:00", 256, 300);
    c.fillStyle = palette.pasta;
    c.font = '48px "Bowlby One", sans-serif';
    c.fillText("/KM", 256, 370);
  });
  const screen = mesh(new THREE.CircleGeometry(2.1, 40), new THREE.MeshStandardMaterial({ map: screenTex, roughness: 0.4 }), false);
  screen.position.set(0, 5, 0.92);
  watch.add(screen);
  for (const [y, z] of [[6.3, 0.2], [3.7, 0.2]]) {
    const btn = mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3), clay("#9aa3a8"));
    btn.position.set(2.5, y, z);
    watch.add(btn);
  }
  watch.position.set(-1, TOP, -4.5);
  watch.rotation.y = 0.2;
  group.add(watch);

  const f = flagBanner("GARMIN 2026", "#1d1b1a", "#36a9e1");
  f.position.set(5, TOP, -3);
  group.add(f);
  const p = pastaMonument(farfalla(), 1.1, 2.6);
  p.group.position.set(6, TOP, 3.5);
  group.add(p.group);
  yearRing(group, 2026);
  const yb = yearBadge(2026);
  yb.position.set(-7.4, TOP, 4.4);
  yb.rotation.y = 0.55;
  group.add(yb);
  for (const [x, z] of [[-9, 3], [-7, -6]]) {
    const c = cypress(1);
    c.position.set(x, TOP, z);
    group.add(c);
  }
  brandRunners(group, runners, ["#1d1b1a", "#36a9e1", "#ffffff"], 11);
  return {
    group,
    runners,
    tick: (t) => {
      p.spin(t);
      screen.rotation.z = Math.sin(t * 0.8) * 0.05;
    },
  };
}
