import * as THREE from "three";
import {
  TOP, clay, mesh, palette, plinth, rand, pick, sign, stripes, umbrellaPine, cypress,
  runner, cheerer, lap, canvasTexture, type Runner,
} from "./kit";

export type Scene = { group: THREE.Group; runners: Runner[]; tick?: (t: number, dt: number) => void };

function windowsOn(b: THREE.Group, w: number, h: number, d: number, color = "#5a4636") {
  const geo = new THREE.BoxGeometry(0.42, 0.62, 0.08);
  const mat = clay(color);
  const cols = Math.max(2, Math.floor(w / 1.1));
  const rows = Math.max(2, Math.floor((h - 0.8) / 1.25));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const m = mesh(geo, mat, false);
      m.position.set(-w / 2 + (w / cols) * (c + 0.5), 1.2 + r * 1.25, d / 2 + 0.03);
      b.add(m);
    }
}

function building(w: number, h: number, d: number, color: string) {
  const b = new THREE.Group();
  const box = mesh(new THREE.BoxGeometry(w, h, d), clay(color), true, true);
  box.position.y = h / 2;
  b.add(box);
  const roof = mesh(new THREE.BoxGeometry(w + 0.3, 0.3, d + 0.3), clay("#b5654a"));
  roof.position.y = h + 0.15;
  b.add(roof);
  windowsOn(b, w, h, d);
  return b;
}

/* 01 · Piazza: the meeting point */
export function piazza(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12, palette.cobble));
  const runners: Runner[] = [];

  const basin = mesh(new THREE.CylinderGeometry(2.3, 2.5, 0.7, 24), clay(palette.stone, false), true, true);
  basin.position.y = TOP + 0.35;
  group.add(basin);
  const water = mesh(new THREE.CylinderGeometry(2.05, 2.05, 0.1, 24), clay(palette.water, false), false, true);
  water.position.y = TOP + 0.68;
  group.add(water);
  const amphora = mesh(
    new THREE.LatheGeometry(
      [[0.01, 0], [0.5, 0], [0.75, 0.6], [0.8, 1.2], [0.5, 1.9], [0.3, 2.2], [0.45, 2.5], [0.01, 2.5]].map(
        ([x, y]) => new THREE.Vector2(x, y),
      ),
      18,
    ),
    clay("#d8c4a2", false),
  );
  amphora.position.y = TOP + 0.6;
  group.add(amphora);

  const colors = ["#e9a77c", "#f0c987", "#d98a6a", "#f2d3a6", "#c9765a", "#efb98f", "#e7c49a"];
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * 0.95 + (i / 6) * Math.PI * 0.9;
    const b = building(3.2 + rand() * 0.8, 4 + rand() * 3.2, 3, colors[i]);
    b.position.set(Math.cos(a) * 9.3, TOP, Math.sin(a) * 9.3);
    b.lookAt(0, TOP, 0);
    group.add(b);
  }

  const banner = sign("AMOR RUN CLUB", 7, 1.3, palette.red, "#fbeedd");
  banner.position.set(0, TOP + 4.2, -4.6);
  group.add(banner);
  for (const x of [-3.5, 3.5]) {
    const pole = mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.9, 6), clay(palette.ink));
    pole.position.set(x, TOP + 2.45, -4.62);
    group.add(pole);
  }

  for (let row = 0; row < 3; row++)
    for (let i = 0; i < 9 - row; i++) {
      const r = cheerer();
      const span = (8 - row) * 0.95;
      r.group.position.set(-span / 2 + i * 0.95 + (rand() - 0.5) * 0.2, TOP, 3.4 + row * 1.15 + (rand() - 0.5) * 0.3);
      r.group.rotation.y = (rand() - 0.5) * 0.4;
      group.add(r.group);
      runners.push(r);
    }

  for (const [x, z] of [[-9, 4], [9.5, 2.5], [7.5, 7]]) {
    const p = umbrellaPine(0.85);
    p.position.set(x, TOP, z);
    group.add(p);
  }
  return { group, runners };
}

/* 02 · Colosseo: the run through Rome */
export function colosseo(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12.5, "#c9c08f"));
  const runners: Runner[] = [];
  const travertine = clay("#e6d3b0", true, true);

  const ring = (r0: number, r1: number, h: number, len: number) =>
    mesh(
      new THREE.LatheGeometry(
        [new THREE.Vector2(r0, 0), new THREE.Vector2(r1, 0), new THREE.Vector2(r1, h), new THREE.Vector2(r0, h), new THREE.Vector2(r0, 0)],
        48,
        Math.PI * 0.62,
        len,
      ),
      travertine,
      true,
      true,
    );
  const outer = ring(5.1, 6.1, 5.6, Math.PI * 2 * 0.78);
  outer.position.y = TOP;
  group.add(outer);
  const inner = ring(4.1, 5.1, 3.2, Math.PI * 2);
  inner.position.y = TOP;
  group.add(inner);
  const arena = mesh(new THREE.CylinderGeometry(4.1, 4.1, 0.2, 32), clay("#e3c58e", false), false, true);
  arena.position.y = TOP + 0.1;
  group.add(arena);

  const archGeo = new THREE.BoxGeometry(0.62, 1.05, 0.2);
  const arches = new THREE.InstancedMesh(archGeo, clay("#7d6248"), 3 * 34);
  const dummy = new THREE.Object3D();
  let n = 0;
  for (let tier = 0; tier < 3; tier++)
    for (let i = 0; i < 34; i++) {
      const a = Math.PI * 0.62 + (i + 0.5) * ((Math.PI * 2 * 0.78) / 34);
      dummy.position.set(Math.sin(a) * 6.12, TOP + 1 + tier * 1.6, Math.cos(a) * 6.12);
      dummy.rotation.set(0, a, 0);
      dummy.updateMatrix();
      arches.setMatrixAt(n++, dummy.matrix);
    }
  group.add(arches);

  const road = mesh(new THREE.RingGeometry(7.6, 9.9, 64), clay("#77716b", false), false, true);
  road.rotation.x = -Math.PI / 2;
  road.position.y = TOP + 0.02;
  group.add(road);
  const lane = mesh(new THREE.RingGeometry(8.72, 8.8, 64), clay("#f4efe6", false), false, true);
  lane.rotation.x = -Math.PI / 2;
  lane.position.y = TOP + 0.03;
  group.add(lane);

  for (let i = 0; i < 16; i++) {
    const rad = i % 2 ? 8.25 : 9.3;
    const r = lap(runner(), rad, rad, 2.2 + rand() * 1.4, (i / 16) * Math.PI * 2);
    group.add(r.group);
    runners.push(r);
  }
  for (const a of [0.3, 0.9, 2.2, 2.7, 4.1, 5.4]) {
    const c = cypress(0.9 + rand() * 0.3);
    c.position.set(Math.cos(a) * 11, TOP, Math.sin(a) * 11);
    group.add(c);
  }
  return { group, runners };
}

/* 03 · Park: every pace */
export function parco(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12.5, palette.grass));
  const runners: Runner[] = [];

  const path = mesh(new THREE.RingGeometry(6.9, 8.3, 72), clay("#e5cf9f", false), false, true);
  path.rotation.x = -Math.PI / 2;
  path.position.y = TOP + 0.02;
  const pathWrap = new THREE.Group();
  pathWrap.scale.set(1.18, 1, 1);
  pathWrap.add(path);
  group.add(pathWrap);

  const pond = mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.08, 28), clay(palette.water, false), false, true);
  pond.scale.set(1.4, 1, 1);
  pond.position.set(1.2, TOP + 0.03, 0.6);
  group.add(pond);

  const spots = [[-3, -2.5], [-1.5, 2.5], [-4, 1.5], [3.5, -3], [-10, -4], [10.6, 3], [0, -10.5], [-6, 9.5], [6.5, -9], [-11, 3]];
  for (const [x, z] of spots) {
    const p = umbrellaPine(0.75 + rand() * 0.35);
    p.position.set(x, TOP, z);
    p.rotation.y = rand() * 6;
    group.add(p);
  }

  for (let i = 0; i < 14; i++) {
    const speed = i % 4 === 0 ? 1 : 1.6 + rand() * 2.2;
    const r = lap(runner(), 7.6 * 1.18, 7.6, speed, (i / 14) * Math.PI * 2);
    group.add(r.group);
    runners.push(r);
  }
  return { group, runners };
}

/* 04 · Pasta shop: the finish line */
export function pastificio(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12, palette.cobble));
  const runners: Runner[] = [];

  const shop = new THREE.Group();
  const body = mesh(new THREE.BoxGeometry(9, 5.2, 4), clay("#f0d6a8"), true, true);
  body.position.y = 2.6;
  shop.add(body);
  const roof = mesh(new THREE.BoxGeometry(9.4, 0.35, 4.4), clay("#b5654a"));
  roof.position.y = 5.35;
  shop.add(roof);
  const door = mesh(new THREE.BoxGeometry(1.4, 2.4, 0.1), clay("#5a3a22"));
  door.position.set(0, 1.2, 2.02);
  shop.add(door);
  for (const x of [-2.9, 2.9]) {
    const win = mesh(new THREE.BoxGeometry(2.2, 1.6, 0.1), clay("#ffd88a", false));
    win.position.set(x, 1.7, 2.02);
    shop.add(win);
  }
  const awningTex = stripes(palette.red, "#fbeedd", 14);
  const awning = mesh(new THREE.PlaneGeometry(9.2, 1.8), new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.9, side: THREE.DoubleSide }));
  awning.position.set(0, 3.15, 2.7);
  awning.rotation.x = -0.75;
  shop.add(awning);
  const s = sign("PASTA FRESCA", 6, 0.9, palette.ink, palette.pasta);
  s.position.set(0, 4.3, 2.03);
  shop.add(s);
  shop.position.set(0, TOP, -5.5);
  group.add(shop);

  // drying rack of fettuccine
  const rack = new THREE.Group();
  const bar = mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.4, 6), clay(palette.trunk));
  bar.rotation.z = Math.PI / 2;
  bar.position.y = 2.2;
  rack.add(bar);
  for (const x of [-1.6, 1.6]) {
    const leg = mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 6), clay(palette.trunk));
    leg.position.set(x, 1.1, 0);
    rack.add(leg);
  }
  const strand = new THREE.BoxGeometry(0.12, 1.3, 0.03);
  for (let i = 0; i < 18; i++) {
    const f = mesh(strand, clay(palette.pasta, false));
    f.position.set(-1.4 + i * 0.165, 1.55, (i % 2) * 0.06);
    rack.add(f);
  }
  rack.position.set(-7, TOP, -0.5);
  rack.rotation.y = 0.6;
  group.add(rack);

  const rigatoneGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.22, 8);
  for (const [x, z] of [[-3.2, 2.2], [3.4, 1.8], [0, 5.2]]) {
    const t = new THREE.Group();
    const top = mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.12, 20), clay("#fbeedd", false), true, true);
    top.position.y = 1.05;
    t.add(top);
    const leg = mesh(new THREE.CylinderGeometry(0.1, 0.16, 1, 8), clay(palette.ink));
    leg.position.y = 0.5;
    t.add(leg);
    const bowl = mesh(new THREE.SphereGeometry(0.42, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), clay("#f4efe6", false));
    bowl.position.y = 1.52;
    t.add(bowl);
    for (let i = 0; i < 9; i++) {
      const r = mesh(rigatoneGeo, clay(palette.pasta, false), false);
      r.position.set((rand() - 0.5) * 0.45, 1.55 + rand() * 0.08, (rand() - 0.5) * 0.45);
      r.rotation.set(rand() * 3, rand() * 3, rand() * 3);
      t.add(r);
    }
    t.position.set(x, TOP, z);
    group.add(t);
    for (let k = 0; k < 3; k++) {
      const c = cheerer();
      const a = (k / 3) * Math.PI * 2 + rand();
      c.group.position.set(x + Math.cos(a) * 1.8, TOP, z + Math.sin(a) * 1.8);
      c.group.lookAt(x, TOP, z);
      group.add(c.group);
      runners.push(c);
    }
  }
  for (let i = 0; i < 4; i++) {
    const r = lap(runner(), 10.2, 9.6, 2 + rand() * 1.5, (i / 4) * Math.PI * 2);
    group.add(r.group);
    runners.push(r);
  }
  return { group, runners };
}

function newspaperTex() {
  return canvasTexture(256, 340, (c) => {
    c.fillStyle = "#f4efe6";
    c.fillRect(0, 0, 256, 340);
    c.fillStyle = palette.red;
    c.fillRect(0, 0, 256, 60);
    c.fillStyle = "#3b3b3b";
    for (let y = 90; y < 330; y += 16) c.fillRect(18, y, 100 + (y % 3) * 30, 6);
    c.fillStyle = "#c9b48e";
    c.fillRect(140, 90, 98, 120);
  });
}

/* 05 · Edicola: The Runner's Journal */
export function edicola(): Scene {
  const group = new THREE.Group();
  group.add(plinth(12, palette.cobble));
  const runners: Runner[] = [];

  const kiosk = new THREE.Group();
  const box = mesh(new THREE.BoxGeometry(4.6, 3.4, 3.2), clay("#2f5d50"), true, true);
  box.position.y = 1.7;
  kiosk.add(box);
  const roof = mesh(new THREE.BoxGeometry(5.6, 0.3, 4.2), clay("#264c42"));
  roof.position.y = 3.55;
  kiosk.add(roof);
  const panel = sign("THE RUNNER’S JOURNAL", 4.4, 0.8, palette.red, "#fbeedd");
  panel.position.set(0, 3.05, 1.62);
  kiosk.add(panel);
  const paperMat = new THREE.MeshStandardMaterial({ map: newspaperTex(), roughness: 0.9 });
  const paperGeo = new THREE.PlaneGeometry(0.62, 0.82);
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 5; c++) {
      const p = mesh(paperGeo, paperMat, false);
      p.position.set(-1.7 + c * 0.85, 0.9 + r * 0.95, 1.62);
      kiosk.add(p);
    }
  kiosk.position.set(-1.5, TOP, -3.5);
  kiosk.rotation.y = 0.25;
  group.add(kiosk);

  // giant running shoe
  const shoe = new THREE.Group();
  const sole = mesh(new THREE.BoxGeometry(1.7, 0.45, 4), clay("#f4efe6", false));
  sole.position.y = 0.22;
  shoe.add(sole);
  const upper = mesh(new THREE.SphereGeometry(1, 18, 12), clay("#e58a3a", false));
  upper.scale.set(0.82, 0.85, 1.85);
  upper.position.set(0, 0.6, -0.2);
  shoe.add(upper);
  const heel = mesh(new THREE.CylinderGeometry(0.75, 0.82, 1.3, 16), clay("#e58a3a", false));
  heel.position.set(0, 1, -1.1);
  shoe.add(heel);
  const lace = mesh(new THREE.TorusGeometry(0.35, 0.07, 6, 12), clay("#f4efe6", false));
  lace.position.set(0, 1.35, 0.3);
  lace.rotation.x = Math.PI / 2.5;
  shoe.add(lace);
  shoe.position.set(5.2, TOP, 0.5);
  shoe.rotation.y = -0.7;
  group.add(shoe);

  for (let i = 0; i < 7; i++) {
    const c = cheerer();
    const paper = mesh(new THREE.PlaneGeometry(0.5, 0.65), paperMat, false);
    paper.position.set(0, 1.45, 0.45);
    c.group.children[0].add(paper);
    c.group.position.set(-4 + i * 1.3, TOP, 1.6 + Math.sin(i) * 0.9);
    c.group.rotation.y = Math.PI + (rand() - 0.5) * 0.6;
    group.add(c.group);
    runners.push(c);
  }
  for (const [x, z] of [[-9, 3], [8.5, -5]]) {
    const p = umbrellaPine(0.8);
    p.position.set(x, TOP, z);
    group.add(p);
  }
  for (let i = 0; i < 5; i++) {
    const r = lap(runner(), 10, 9.2, 2.4 + rand(), (i / 5) * Math.PI * 2);
    group.add(r.group);
    runners.push(r);
  }
  return { group, runners };
}

/* The mascot: a running rigatone with a red headband and red sneakers */
export function mascot() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const tube = new THREE.CylinderGeometry(1.1, 1.1, 3.2, 72, 8, false);
  const pos = tube.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    if (r > 1.05) {
      const k = 1 + 0.055 * Math.cos(Math.atan2(v.z, v.x) * 18);
      pos.setXYZ(i, v.x * k, v.y, v.z * k);
    }
  }
  tube.computeVertexNormals();
  const pastaMat = new THREE.MeshStandardMaterial({ color: palette.pasta, roughness: 0.7 });
  const shell = mesh(tube, pastaMat);
  body.add(shell);
  const hole = mesh(new THREE.CircleGeometry(0.72, 32), clay("#9a6a2c", false), false);
  hole.rotation.x = -Math.PI / 2;
  hole.position.y = 1.605;
  body.add(hole);

  const band = mesh(new THREE.TorusGeometry(1.17, 0.17, 10, 48), clay(palette.red, false));
  band.rotation.x = Math.PI / 2;
  band.position.y = 1.05;
  body.add(band);
  const knot = mesh(new THREE.SphereGeometry(0.22, 10, 8), clay(palette.red, false));
  knot.position.set(-1.1, 1.05, -0.35);
  body.add(knot);

  const white = clay("#fbfaf6", false);
  const black = clay(palette.ink, false);
  for (const x of [-0.38, 0.38]) {
    const eye = mesh(new THREE.SphereGeometry(0.3, 16, 12), white);
    eye.scale.set(0.8, 1.15, 0.5);
    eye.position.set(x, 0.42, 1.08);
    body.add(eye);
    const pupil = mesh(new THREE.SphereGeometry(0.13, 12, 10), black);
    pupil.scale.set(0.8, 1.2, 0.5);
    pupil.position.set(x * 0.92, 0.38, 1.24);
    body.add(pupil);
  }
  const smile = mesh(new THREE.TorusGeometry(0.34, 0.06, 8, 20, Math.PI), black);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.12, 1.12);
  body.add(smile);

  const hose = (to: THREE.Vector3, mid: THREE.Vector3, r: number) =>
    mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(), mid, to), 16, r, 8), black);

  const arms = [-1, 1].map((s) => {
    const p = new THREE.Group();
    p.position.set(s * 1.05, 0.1, 0);
    p.add(hose(new THREE.Vector3(s * 0.9, -1.1, 0.2), new THREE.Vector3(s * 0.8, -0.1, 0), 0.11));
    const glove = mesh(new THREE.SphereGeometry(0.3, 14, 10), white);
    glove.position.set(s * 0.9, -1.15, 0.2);
    p.add(glove);
    body.add(p);
    return p;
  });
  const legs = [-1, 1].map((s) => {
    const p = new THREE.Group();
    p.position.set(s * 0.45, -1.55, 0);
    p.add(hose(new THREE.Vector3(s * 0.05, -1.45, 0), new THREE.Vector3(s * 0.25, -0.7, 0.1), 0.12));
    const shoe = mesh(new THREE.SphereGeometry(0.4, 14, 10), clay(palette.red, false));
    shoe.scale.set(0.85, 0.6, 1.45);
    shoe.position.set(s * 0.05, -1.55, 0.25);
    p.add(shoe);
    const sole = mesh(new THREE.BoxGeometry(0.6, 0.1, 1.1), white);
    sole.position.set(s * 0.05, -1.78, 0.25);
    p.add(sole);
    body.add(p);
    return p;
  });

  body.position.y = 3.35;
  const update = (t: number) => {
    const ph = t * 7;
    legs[0].rotation.x = Math.sin(ph) * 0.75;
    legs[1].rotation.x = -Math.sin(ph) * 0.75;
    arms[0].rotation.x = -Math.sin(ph) * 0.8;
    arms[1].rotation.x = Math.sin(ph) * 0.8;
    body.position.y = 3.35 + Math.abs(Math.sin(ph)) * 0.25;
    body.rotation.z = Math.sin(ph) * 0.05;
    shell.scale.y = 1 + Math.cos(ph * 2) * 0.025;
  };
  return { root, update };
}

/* 06 · Finale: the mascot runs, everyone joins */
export function finale(): Scene {
  const group = new THREE.Group();
  const cloth = canvasTexture(512, 512, (c) => {
    const n = 12;
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        c.fillStyle = (x + y) % 2 ? "#fbeedd" : palette.red;
        c.fillRect((x * 512) / n, (y * 512) / n, 512 / n, 512 / n);
      }
  });
  const p = plinth(12, "#fbeedd");
  const lid = p.children[1] as THREE.Mesh;
  lid.material = new THREE.MeshStandardMaterial({ map: cloth, roughness: 0.9 });
  group.add(p);
  const runners: Runner[] = [];

  const m = mascot();
  m.root.scale.setScalar(1.45);
  m.root.position.y = TOP;
  m.root.rotation.y = 0.15;
  group.add(m.root);

  for (let i = 0; i < 18; i++) {
    const rad = 6.5 + (i % 3) * 1.3;
    const r = lap(runner(pick(palette.shirts)), rad, rad, 2.4 + rand() * 1.6, (i / 18) * Math.PI * 2);
    group.add(r.group);
    runners.push(r);
  }

  // confetti
  const count = 260;
  const geo = new THREE.BufferGeometry();
  const posArr = new Float32Array(count * 3);
  const colArr = new Float32Array(count * 3);
  const cols = [palette.red, palette.pasta, "#fbeedd", "#2f5d50", "#e58a3a"].map((c) => new THREE.Color(c));
  for (let i = 0; i < count; i++) {
    posArr[i * 3] = (rand() - 0.5) * 22;
    posArr[i * 3 + 1] = rand() * 16;
    posArr[i * 3 + 2] = (rand() - 0.5) * 22;
    const c = cols[i % cols.length];
    colArr.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colArr, 3));
  const confetti = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.28, vertexColors: true }));
  group.add(confetti);

  const tick = (t: number, dt: number) => {
    m.update(t);
    const a = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = a.getY(i) - dt * (1.2 + (i % 5) * 0.25);
      if (y < TOP) y = 16;
      a.setY(i, y);
      a.setX(i, a.getX(i) + Math.sin(t * 2 + i) * dt * 0.3);
    }
    a.needsUpdate = true;
  };
  return { group, runners, tick };
}

export function clouds(points: THREE.Vector3[]) {
  const group = new THREE.Group();
  const mat = clay("#fffaf1");
  const geo = new THREE.IcosahedronGeometry(1, 1);
  for (const p of points) {
    const c = new THREE.Group();
    const n = 3 + Math.floor(rand() * 3);
    for (let i = 0; i < n; i++) {
      const s = mesh(geo, mat, false);
      const k = 1 + rand() * 1.4;
      s.scale.set(k * 1.3, k, k);
      s.position.set(i * 1.5 - n * 0.7, rand() * 0.6, (rand() - 0.5) * 1.2);
      c.add(s);
    }
    c.position.copy(p);
    group.add(c);
  }
  return group;
}
