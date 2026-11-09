/* FERMA — 3D sahna (Three.js): o'tloq, ombor, tovuqxona, ariq-oxur, daraxtlar,
   yuruvchi hayvonlar (tovuq, qo'y, sigir, ot), kun va tun yorug'ligi.
   Farm3D(container, { onAnimal }) :
     setAnimals([{ id, t, status }])   — hayvonlarni sahnada yangilash
     setFeed({ water, hay, grain })      — oxur va yem ko'rinishi
     focus(id)                           — hayvonga kamera
     destroy()                                                                   */
(() => {
  "use strict";
  const T = window.THREE;
  const rand = (a, b) => a + Math.random() * (b - a);

  // ---------- Teksturalar ----------
  function canvasTex(w, h, draw, repeat) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    if (repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat, repeat); }
    t.anisotropy = 4;
    return t;
  }
  const grassTex = () => canvasTex(256, 256, (x, w, h) => {
    x.fillStyle = "#5f9e3a"; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      const g = 110 + Math.random() * 70 | 0;
      x.strokeStyle = `rgba(${50 + Math.random() * 40 | 0},${g},${30 + Math.random() * 30 | 0},.55)`;
      x.lineWidth = 1 + Math.random();
      const px = Math.random() * w, py = Math.random() * h;
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + rand(-2, 2), py - rand(3, 8)); x.stroke();
    }
  }, 28);
  const dirtTex = () => canvasTex(128, 128, (x, w, h) => {
    x.fillStyle = "#9b7b55"; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${90 + Math.random() * 60 | 0},${70 + Math.random() * 40 | 0},${40 + Math.random() * 30 | 0},.5)`; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  }, 6);
  const woodTex = () => canvasTex(128, 128, (x, w, h) => {
    x.fillStyle = "#8b5a2b"; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { x.strokeStyle = `rgba(60,35,15,${0.15 + Math.random() * 0.25})`; x.lineWidth = 1 + Math.random() * 2; const y = Math.random() * h; x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(w / 3, y + rand(-4, 4), (2 * w) / 3, y + rand(-4, 4), w, y); x.stroke(); }
  });
  const barnTex = () => canvasTex(256, 256, (x, w, h) => {
    x.fillStyle = "#b3261e"; x.fillRect(0, 0, w, h);
    for (let i = 0; i < w; i += 16) { x.fillStyle = "rgba(0,0,0,.18)"; x.fillRect(i, 0, 2, h); x.fillStyle = "rgba(255,255,255,.05)"; x.fillRect(i + 2, 0, 3, h); }
  });
  const cowTex = () => canvasTex(256, 128, (x, w, h) => {
    x.fillStyle = "#f4f1ea"; x.fillRect(0, 0, w, h);
    x.fillStyle = "#1c1a18";
    for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, rand(14, 34), rand(10, 24), Math.random() * 3, 0, 7); x.fill(); }
  });
  const skyTex = (top, mid, bot) => canvasTex(4, 256, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, top); g.addColorStop(0.55, mid); g.addColorStop(1, bot);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  });
  const emojiCache = {};
  const emojiTex = (e) => emojiCache[e] || (emojiCache[e] = canvasTex(64, 64, (x) => { x.font = "48px serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(e, 32, 36); }));

  // ---------- Hayvonlar ----------
  // Yumaloq shakl (ellipsoid) — tanalar shu bilan quriladi
  const SPH = {};
  const sph = (seg = 20) => SPH[seg] || (SPH[seg] = new T.SphereGeometry(1, seg, Math.round(seg * 0.7)));
  function ell(mat, rx, ry, rz, x, y, z, g, seg) {
    const m = mesh(sph(seg), mat, x, y, z, g);
    m.scale.set(rx, ry, rz);
    return m;
  }
  // Bargli/junli shakl: tepalari tasodifiy siljitilgan ikosaedr
  function lumpy(r, detail, amt) {
    const geo = new T.IcosahedronGeometry(r, detail), p = geo.attributes.position, v = new T.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + (Math.random() - 0.5) * amt); p.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals();
    return geo;
  }
  const shadowTex = () => canvasTex(64, 64, (x) => {
    const g = x.createRadialGradient(32, 32, 2, 32, 32, 31);
    g.addColorStop(0, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  });
  let SHADOW_MAT = null;
  function blobShadow(g, sx, sz) {
    if (!SHADOW_MAT) SHADOW_MAT = new T.MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false });
    const s = new T.Mesh(new T.PlaneGeometry(1, 1), SHADOW_MAT);
    s.rotation.x = -Math.PI / 2; s.position.y = 0.03; s.scale.set(sx, sz, 1); s.renderOrder = 1;
    g.add(s);
  }
  function std(color, rough = 0.85, extra = {}) { return new T.MeshStandardMaterial({ color, roughness: rough, ...extra }); }
  const MAT = {};
  function mats() {
    if (MAT.ready) return MAT;
    Object.assign(MAT, {
      ready: true,
      white: std(0xf7f3ea, 0.9), brownHen: std(0xa0582a, 0.85), darkHen: std(0x6b3416, 0.85), dark: std(0x2a211b), red: std(0xd62828, 0.55), orange: std(0xf2a93b, 0.5),
      yellow: std(0xe9b949, 0.6), pink: std(0xe8a39a, 0.65), wool: std(0xefe8d8, 1), woolShade: std(0xe2d9c4, 1), woolFace: std(0x2b2622, 0.8), eye: std(0x050505, 0.15),
      eyeWhite: std(0xf5f5f0, 0.3), horn: std(0xe8dcc2, 0.4), cow: new T.MeshStandardMaterial({ map: cowTex(), roughness: 0.75 }), cowDark: std(0x1c1a18, 0.75),
      horse: std(0x6e3f1f, 0.45), horse2: std(0xc58a4c, 0.5), horse3: std(0x3a2a22, 0.45), mane: std(0x1a110b, 0.9), mane2: std(0xf1e6cf, 0.9),
      hoof: std(0x2b2b2b, 0.6), muzzle: std(0x2e2420, 0.6), roosterTail: std(0x0f3d2e, 0.35, { metalness: 0.3 }), roosterRed: std(0xb33a16, 0.6)
    });
    return MAT;
  }
  function mesh(geo, mat, x = 0, y = 0, z = 0, g) {
    const m = new T.Mesh(geo, mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    if (g) g.add(m);
    return m;
  }
  function leg(g, mat, x, y, z, len, r, hoof) {
    const pivot = new T.Group(); pivot.position.set(x, y, z); g.add(pivot);
    mesh(new T.CylinderGeometry(r, r * 0.62, len * 0.55, 10), mat, 0, -len * 0.27, 0, pivot);
    mesh(new T.CylinderGeometry(r * 0.6, r * 0.5, len * 0.5, 8), mat, 0, -len * 0.72, 0, pivot);
    if (hoof) mesh(new T.CylinderGeometry(r * 0.55, r * 0.68, len * 0.1, 10), hoof, 0, -len * 0.97, 0, pivot);
    return pivot;
  }
  // ---------- Tovuq / xo'roz ----------
  function buildChicken(kind) {
    const M = mats(), g = new T.Group(), body = new T.Group(); g.add(body);
    const rooster = kind === "rooster";
    const f = kind === "brown" ? M.brownHen : rooster ? M.roosterRed : M.white;
    const s = rooster ? 1.15 : 1;
    ell(f, 0.27 * s, 0.25 * s, 0.33 * s, 0, 0.42 * s, 0, body);
    ell(f, 0.22 * s, 0.22 * s, 0.2 * s, 0, 0.47 * s, 0.17 * s, body); // ko'krak
    [-1, 1].forEach((k) => { const w = ell(kind === "brown" ? M.darkHen : f, 0.06 * s, 0.17 * s, 0.26 * s, k * 0.25 * s, 0.45 * s, -0.02, body); w.rotation.x = -0.25; });
    const tailM = rooster ? M.roosterTail : kind === "brown" ? M.darkHen : f;
    [-0.5, -0.15, 0.2, 0.55].forEach((a, i) => { const t = ell(tailM, 0.04 * s, (rooster ? 0.32 : 0.2) * s, 0.12 * s, a * 0.12, (0.62 + i * 0.02) * s, -0.3 * s, body); t.rotation.x = rooster ? -0.9 : -0.5; t.rotation.z = a * 0.6; });
    ell(f, 0.1 * s, 0.16 * s, 0.1 * s, 0, 0.62 * s, 0.24 * s, body).rotation.x = 0.4; // bo'yin
    const head = new T.Group(); head.position.set(0, 0.76 * s, 0.3 * s); body.add(head);
    ell(f, 0.11 * s, 0.12 * s, 0.12 * s, 0, 0, 0, head);
    const beak = mesh(new T.ConeGeometry(0.04 * s, 0.12 * s, 8), M.orange, 0, -0.02, 0.14 * s, head); beak.rotation.x = Math.PI / 2 + 0.25;
    [-0.04, 0.02, 0.07].forEach((zz, i) => ell(M.red, 0.018 * s, (0.05 + (rooster ? 0.025 : 0) - Math.abs(i - 1) * 0.012) * s, 0.035 * s, 0, 0.12 * s, zz * s, head));
    ell(M.red, 0.025 * s, (rooster ? 0.07 : 0.045) * s, 0.025 * s, 0, -0.1 * s, 0.1 * s, head);
    [-1, 1].forEach((k) => ell(M.eye, 0.018, 0.022, 0.018, k * 0.085 * s, 0.03 * s, 0.06 * s, head, 8));
    const legs = [-1, 1].map((k) => {
      const p = new T.Group(); p.position.set(k * 0.09 * s, 0.24 * s, 0); g.add(p);
      mesh(new T.CylinderGeometry(0.02, 0.018, 0.24 * s, 6), M.orange, 0, -0.12 * s, 0, p);
      [-0.5, 0, 0.5].forEach((a) => { const toe = mesh(new T.CylinderGeometry(0.012, 0.01, 0.1, 5), M.orange, Math.sin(a) * 0.04, -0.23 * s, Math.cos(a) * 0.04, p); toe.rotation.x = Math.PI / 2; toe.rotation.z = -a; });
      return p;
    });
    blobShadow(g, 0.7 * s, 0.8 * s);
    return { g, body, head, legs, speed: 1.4, step: 14, size: 0.65 * s, peck: true, rooster };
  }
  // ---------- Qo'y ----------
  function buildSheep() {
    const M = mats(), g = new T.Group(), body = new T.Group(); g.add(body);
    ell(M.wool, 0.46, 0.42, 0.62, 0, 0.98, 0, body);
    const puff = lumpy(0.2, 1, 0.25);
    for (let i = 0; i < 34; i++) {
      const u = Math.random() * Math.PI * 2, v = Math.acos(rand(-0.35, 1));
      const x = Math.sin(v) * Math.cos(u) * 0.44, y = Math.cos(v) * 0.4, z = Math.sin(v) * Math.sin(u) * 0.6;
      mesh(puff, i % 3 ? M.wool : M.woolShade, x, 0.98 + y, z, body).scale.setScalar(rand(0.8, 1.25));
    }
    const head = new T.Group(); head.position.set(0, 1.12, 0.62); body.add(head);
    const hd = ell(M.woolFace, 0.14, 0.16, 0.24, 0, -0.04, 0.12, head); hd.rotation.x = 0.45;
    [[0, 0.12, -0.02], [0.08, 0.1, -0.06], [-0.08, 0.1, -0.06]].forEach(([x, y, z]) => mesh(puff, M.wool, x, y, z, head).scale.setScalar(0.65));
    [-1, 1].forEach((k) => {
      const e = ell(M.woolFace, 0.12, 0.035, 0.06, k * 0.17, 0.02, 0.0, head); e.rotation.z = k * -0.35;
      ell(M.eyeWhite, 0.03, 0.03, 0.03, k * 0.1, 0.02, 0.17, head, 8); ell(M.eye, 0.018, 0.02, 0.018, k * 0.11, 0.02, 0.19, head, 8);
    });
    mesh(puff, M.wool, 0, 1.05, -0.66, body).scale.setScalar(0.6);
    const legs = [[-0.2, 0.32], [0.2, 0.32], [-0.2, -0.32], [0.2, -0.32]].map(([x, z]) => leg(g, M.woolFace, x, 0.72, z, 0.72, 0.065, M.hoof));
    blobShadow(g, 1.3, 1.8);
    return { g, body, head, legs, speed: 1.1, step: 8, size: 1.15 };
  }
  // ---------- Sigir ----------
  function buildCow() {
    const M = mats(), g = new T.Group(), body = new T.Group(); g.add(body);
    ell(M.cow, 0.6, 0.6, 1.1, 0, 1.38, 0, body);
    ell(M.cow, 0.55, 0.62, 0.55, 0, 1.42, 0.62, body);
    ell(M.cow, 0.56, 0.6, 0.55, 0, 1.45, -0.7, body);
    ell(M.pink, 0.24, 0.17, 0.28, 0, 0.86, -0.45, body);
    [[-0.08, -0.36], [0.08, -0.36], [-0.08, -0.54], [0.08, -0.54]].forEach(([x, z]) => mesh(new T.CylinderGeometry(0.025, 0.02, 0.12, 6), M.pink, x, 0.7, z, body));
    const neck = ell(M.cow, 0.34, 0.4, 0.42, 0, 1.6, 1.08, body); neck.rotation.x = -0.4;
    const head = new T.Group(); head.position.set(0, 1.72, 1.45); body.add(head);
    const skull = ell(M.cow, 0.25, 0.27, 0.34, 0, 0, 0.08, head); skull.rotation.x = 0.35;
    ell(M.pink, 0.2, 0.16, 0.16, 0, -0.2, 0.4, head);
    [-1, 1].forEach((k) => {
      ell(M.cowDark, 0.03, 0.025, 0.02, k * 0.08, -0.2, 0.55, head, 8);
      const ear = ell(M.cowDark, 0.16, 0.045, 0.09, k * 0.33, 0.08, -0.06, head); ear.rotation.z = k * -0.25;
      const horn = mesh(new T.ConeGeometry(0.045, 0.26, 8), M.horn, k * 0.2, 0.28, -0.08, head); horn.rotation.z = -k * 0.9; horn.rotation.x = -0.2;
      ell(M.eyeWhite, 0.05, 0.05, 0.04, k * 0.2, 0.06, 0.3, head, 10); ell(M.eye, 0.035, 0.04, 0.03, k * 0.215, 0.06, 0.33, head, 10);
    });
    const tail = new T.Group(); tail.position.set(0, 1.75, -1.18); body.add(tail);
    mesh(new T.CylinderGeometry(0.035, 0.025, 1.0, 6), M.cow, 0, -0.5, -0.05, tail);
    ell(M.cowDark, 0.07, 0.16, 0.07, 0, -1.02, -0.05, tail);
    const legs = [[-0.3, 0.72], [0.3, 0.72], [-0.3, -0.72], [0.3, -0.72]].map(([x, z]) => leg(g, M.cow, x, 1.05, z, 1.05, 0.14, M.hoof));
    blobShadow(g, 1.8, 3);
    return { g, body, head, legs, tail, speed: 0.9, step: 6, size: 1.8 };
  }
  // ---------- Ot ----------
  function buildHorse(v) {
    const M = mats(), coat = [M.horse, M.horse2, M.horse3][v % 3], mane = v % 3 === 1 ? M.mane2 : M.mane, g = new T.Group(), body = new T.Group(); g.add(body);
    ell(coat, 0.5, 0.55, 1.05, 0, 1.72, 0, body);
    ell(coat, 0.48, 0.58, 0.5, 0, 1.78, 0.72, body);
    ell(coat, 0.5, 0.58, 0.52, 0, 1.8, -0.72, body);
    const neck = new T.Group(); neck.position.set(0, 1.95, 0.95); neck.rotation.x = 0.55; body.add(neck);
    ell(coat, 0.22, 0.62, 0.32, 0, 0.42, 0, neck);
    for (let i = 0; i < 9; i++) { const m = mesh(new T.BoxGeometry(0.07, 0.2, 0.16), mane, 0, 0.05 + i * 0.12, -0.24 + i * 0.004, neck); m.rotation.z = (i % 2 ? 1 : -1) * 0.15; }
    const head = new T.Group(); head.position.set(0, 0.98, 0.08); neck.add(head);
    const hd = ell(coat, 0.17, 0.2, 0.42, 0, 0.02, 0.22, head); hd.rotation.x = 1.0;
    const mz = ell(M.muzzle, 0.15, 0.15, 0.16, 0, -0.3, 0.42, head); mz.rotation.x = 1.0;
    if (v % 2) ell(M.mane2, 0.05, 0.02, 0.3, 0, 0.05, 0.36, head).rotation.x = 1.05;
    [-1, 1].forEach((k) => {
      const ear = mesh(new T.ConeGeometry(0.05, 0.2, 6), coat, k * 0.09, 0.26, -0.05, head); ear.rotation.z = -k * 0.15;
      ell(M.eye, 0.035, 0.04, 0.04, k * 0.16, 0.08, 0.13, head, 10);
    });
    mesh(new T.BoxGeometry(0.05, 0.16, 0.2), mane, 0, 0.18, 0.05, head);
    const tail = new T.Group(); tail.position.set(0, 2.05, -1.2); body.add(tail);
    [[0, 0], [0.05, 0.03], [-0.05, 0.03], [0, 0.06]].forEach(([x, a]) => { const t = mesh(new T.ConeGeometry(0.11, 1.25, 7), mane, x, -0.6, -0.12, tail); t.rotation.x = Math.PI + 0.2 + a; });
    const legs = [[-0.25, 0.7], [0.25, 0.7], [-0.25, -0.7], [0.25, -0.7]].map(([x, z]) => leg(g, coat, x, 1.4, z, 1.4, 0.12, M.hoof));
    blobShadow(g, 1.6, 3.1);
    return { g, body, head, legs, tail, speed: 1.6, step: 7, size: 2.3 };
  }
  // ---------- Haqiqiy ot modeli (games/models/horse.bin, ZBrush OBJ dan) ----------
  // Skelet yo'q — oyoq, bosh va dum shader ichida mintaqalar bo'yicha bukiladi.
  let HORSE = null, horsePromise = null;
  function preloadHorse() {
    if (horsePromise) return horsePromise;
    horsePromise = fetch("games/models/horse.bin?v=1").then((r) => { if (!r.ok) throw new Error("horse"); return r.arrayBuffer(); }).then((buf) => {
      const dv = new DataView(buf), nV = dv.getUint32(0, true), nI = dv.getUint32(4, true), k = dv.getFloat32(8, true);
      const q = new Int16Array(buf, 12, nV * 3), pos = new Float32Array(nV * 3);
      for (let i = 0; i < q.length; i++) pos[i] = q[i] * k;
      const geo = new T.BufferGeometry();
      geo.setAttribute("position", new T.BufferAttribute(pos, 3));
      geo.setIndex(new T.BufferAttribute(new Uint16Array(buf, 12 + nV * 6, nI), 1));
      geo.computeVertexNormals();
      // Oyoqlar: pastki nuqtalar bo'yicha 4 ta markaz (old-chap, old-o'ng, orqa-chap, orqa-o'ng)
      const legOf = (x, z) => (z > -0.45 ? 0 : 2) + (x > 0 ? 1 : 0);
      const cen = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
      const isTail = (x, y, z) => z < -1.17 && Math.abs(x) < 0.13 && y > 0.5;
      for (let i = 0; i < nV; i++) {
        const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
        if (y < 0.45 && !isTail(x, y, z)) { const c = cen[legOf(x, z)]; c[0] += x; c[1] += z; c[2]++; }
      }
      const PIV_Y = [1.02, 1.02, 1.12, 1.12];
      const pivZ = cen.map((c) => c[1] / Math.max(1, c[2]));
      // Yolning tepa chizig'i (mane uchun): har z bo'lagida eng yuqori y
      const top = {};
      for (let i = 0; i < nV; i++) { const z = pos[i * 3 + 2], y = pos[i * 3 + 1], kz = Math.round(z * 20); if (Math.abs(pos[i * 3]) < 0.08) top[kz] = Math.max(top[kz] ?? -9, y); }
      const leg = new Float32Array(nV * 4), lw = new Float32Array(nV), hw = new Float32Array(nV), tw = new Float32Array(nV), col = new Float32Array(nV * 3);
      const ss = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
      for (let i = 0; i < nV; i++) {
        const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
        let c = [1, 1, 1];
        if (isTail(x, y, z)) {
          tw[i] = ss(1.62, 1.2, y);
          c = [0.16, 0.12, 0.1];
        } else {
          const L = legOf(x, z);
          leg[i * 4 + L] = 1;
          lw[i] = ss(PIV_Y[L] - 0.02, PIV_Y[L] - 0.32, y);
          if (y < 0.075) c = [0.14, 0.13, 0.12]; // tuyoq
          else if (y < 0.36) { const t = ss(0.36, 0.12, y); c = [1 - 0.55 * t, 1 - 0.58 * t, 1 - 0.6 * t]; }
        }
        hw[i] = z > 0.4 && y > 1.2 ? ss(0.42, 0.95, z) : 0;
        if (z > 1.18) { const t = ss(1.18, 1.33, z); c = [c[0] * (1 - 0.6 * t), c[1] * (1 - 0.62 * t), c[2] * (1 - 0.64 * t)]; } // tumshuq
        const kz = Math.round(z * 20);
        if (z > 0.3 && z < 1.05 && Math.abs(x) < 0.07 && top[kz] !== undefined && y > top[kz] - 0.07) c = [0.16, 0.12, 0.1]; // yol
        col.set(c, i * 3);
      }
      geo.setAttribute("aLeg", new T.BufferAttribute(leg, 4));
      geo.setAttribute("aLW", new T.BufferAttribute(lw, 1));
      geo.setAttribute("aHW", new T.BufferAttribute(hw, 1));
      geo.setAttribute("aTW", new T.BufferAttribute(tw, 1));
      geo.setAttribute("color", new T.BufferAttribute(col, 3));
      HORSE = { geo, pivZ: new T.Vector4(...pivZ), pivY: new T.Vector4(...PIV_Y), headP: new T.Vector3(0, 1.45, 0.45), tailP: new T.Vector3(0, 1.62, -1.28),
        coat: (v) => HORSE_COATS[v % 4], shadow: [1.4, 3.0], speed: 1.6, step: 7, size: 2.45 };
      return HORSE;
    }).catch((e) => { console.warn("Ot modeli yuklanmadi:", e); horsePromise = null; return null; });
    return horsePromise;
  }
  const HORSE_COATS = [0x7a4a26, 0xb4733d, 0x3a2a22, 0xcfc6b8];
  // Umumiy quruvchi: M — model (geo, pivZ, pivY, headP, tailP ...)
  function buildReal(M, v) {
    const u = {
      uLegA: { value: new T.Vector4() }, uPivZ: { value: M.pivZ }, uPivY: { value: M.pivY },
      uHead: { value: 0 }, uTail: { value: 0 }, uHeadP: { value: M.headP }, uTailP: { value: M.tailP }
    };
    const mat = new T.MeshStandardMaterial({ color: M.coat ? M.coat(v) : 0xffffff, roughness: M.rough || 0.48, metalness: 0.04, vertexColors: true });
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = `attribute vec4 aLeg; attribute float aLW; attribute float aHW; attribute float aTW;
uniform vec4 uLegA; uniform vec4 uPivZ; uniform vec4 uPivY; uniform float uHead; uniform float uTail; uniform vec3 uHeadP; uniform vec3 uTailP;
vec3 rotX(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x, v.y * c - v.z * s, v.y * s + v.z * c); }
vec3 rotZ(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x * c - v.y * s, v.x * s + v.y * c, v.z); }
` + sh.vertexShader
        .replace("#include <beginnormal_vertex>", `vec3 objectNormal = vec3(normal);
vec3 tPos = position;
float la = dot(aLeg, uLegA) * aLW;
if (la != 0.0) { vec3 pv = vec3(0.0, dot(aLeg, uPivY), dot(aLeg, uPivZ)); tPos = rotX(tPos - pv, la) + pv; objectNormal = rotX(objectNormal, la); }
if (aHW > 0.0) { vec3 hp = uHeadP; float ha = uHead * aHW; tPos = rotX(tPos - hp, ha) + hp; objectNormal = rotX(objectNormal, ha); }
if (aTW > 0.0) { vec3 tp = uTailP; float ta = uTail * aTW; tPos = rotZ(tPos - tp, ta) + tp; objectNormal = rotZ(objectNormal, ta); }`)
        .replace("#include <begin_vertex>", "vec3 transformed = tPos;");
    };
    const g = new T.Group(), body = new T.Group(); g.add(body);
    const m = new T.Mesh(M.geos ? M.geos[v % M.geos.length] : M.geo, mat); m.castShadow = true; m.receiveShadow = true; body.add(m);
    const legs = [0, 1, 2, 3].map(() => ({ rotation: { x: 0 } }));
    const head = { rotation: { x: 0 } }, tail = { rotation: { x: 0, z: 0 } };
    blobShadow(g, M.shadow[0], M.shadow[1]);
    // Oyoq tartibi (sikldagi): 0 old-chap, 1 old-o'ng, 2 orqa-chap, 3 orqa-o'ng
    const sync = () => {
      const k = M.legAmp || 0.75;
      u.uLegA.value.set(legs[0].rotation.x * k, legs[1].rotation.x * k, legs[2].rotation.x * k, legs[3].rotation.x * k);
      u.uHead.value = Math.max(-0.35, Math.min(0.9, head.rotation.x * 1.1));
      u.uTail.value = tail.rotation.z * 0.9;
    };
    return { g, body, head, legs, tail, sync, speed: M.speed, step: M.step, size: M.size, real: true };
  }
  const buildRealHorse = (v) => buildReal(HORSE, v);

  // ---------- Quaternius “Farm Animals” (CC0) modellari: sigir va qo'y (silliqlangan) ----------
  // Fayl: nV, nI, k, nP | pozitsiya int16 | material uint8 | asl indeks uint16 | uchburchaklar uint16
  const hash3 = (x, y, z) => { const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); };
  function vnoise(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    let r = 0;
    for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++)
      r += hash3(xi + dx, yi + dy, zi + dz) * (dx ? u : 1 - u) * (dy ? v : 1 - v) * (dz ? w : 1 - w);
    return r;
  }
  function loadQ(url, cfg) {
    return fetch(url).then((r) => { if (!r.ok) throw new Error(url); return r.arrayBuffer(); }).then((buf) => {
      const dv = new DataView(buf), nV = dv.getUint32(0, true), nI = dv.getUint32(4, true), k = dv.getFloat32(8, true), nP = dv.getUint32(12, true);
      let o = 16;
      const q = new Int16Array(buf, o, nV * 3); o += nV * 6;
      const matId = new Uint8Array(buf, o, nV); o += nV + (nV % 2);
      const orig = new Uint16Array(buf, o, nV); o += nV * 2;
      const ind = new Uint16Array(buf, o, nI);
      const pos = new Float32Array(nV * 3);
      for (let i = 0; i < q.length; i++) pos[i] = q[i] * k;
      const a = new T.Vector3(), b = new T.Vector3(), c = new T.Vector3();
      // Silliq normal: bir joydagi uchlar (rang chegarasida ham) bitta normalga ega
      const smooth = () => {
        const acc = new Float32Array(nP * 3);
        for (let t = 0; t < nI; t += 3) {
          const i0 = ind[t], i1 = ind[t + 1], i2 = ind[t + 2];
          a.fromArray(pos, i0 * 3); b.fromArray(pos, i1 * 3); c.fromArray(pos, i2 * 3);
          b.sub(a); c.sub(a); b.cross(c);
          [i0, i1, i2].forEach((i) => { const j = orig[i] * 3; acc[j] += b.x; acc[j + 1] += b.y; acc[j + 2] += b.z; });
        }
        const nrm = new Float32Array(nV * 3);
        for (let i = 0; i < nV; i++) { a.fromArray(acc, orig[i] * 3).normalize(); a.toArray(nrm, i * 3); }
        return nrm;
      };
      let nrm = smooth();
      const shade = new Float32Array(nV).fill(1);
      if (cfg.wool) {
        // Jun: oq qismlarga mayda bo'rtiqlar (bir joydagi uchlar bir xil siljiydi)
        const disp = new Float32Array(nP), done = new Uint8Array(nP);
        for (let i = 0; i < nV; i++) {
          const j = orig[i];
          if (done[j]) continue;
          done[j] = 1;
          const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
          if (!cfg.wool(x, y, z, matId[i])) continue;
          const n = vnoise(x * 18, y * 18, z * 18) * 0.65 + vnoise(x * 41, y * 41, z * 41) * 0.35;
          disp[j] = (n - 0.35) * cfg.woolAmp;
        }
        for (let i = 0; i < nV; i++) {
          const d = disp[orig[i]];
          if (!d) continue;
          pos[i * 3] += nrm[i * 3] * d; pos[i * 3 + 1] += nrm[i * 3 + 1] * d; pos[i * 3 + 2] += nrm[i * 3 + 2] * d;
          shade[i] = 0.86 + (d / cfg.woolAmp + 0.35) * 0.2;
        }
        nrm = smooth();
      }
      const geo = new T.BufferGeometry();
      geo.setAttribute("position", new T.BufferAttribute(pos, 3));
      geo.setAttribute("normal", new T.BufferAttribute(nrm, 3));
      geo.setIndex(new T.BufferAttribute(ind, 1));
      const leg = new Float32Array(nV * 4), lw = new Float32Array(nV), hw = new Float32Array(nV), tw = new Float32Array(nV);
      const ss = (e0, e1, v) => { const t = Math.max(0, Math.min(1, (v - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
      for (let i = 0; i < nV; i++) {
        const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
        const r = cfg.region(x, y, z);
        if (r === "tail") tw[i] = ss(cfg.tailP[1], cfg.tailP[1] - 0.5, y);
        else if (r !== "skip") { const L = (z > cfg.split ? 0 : 2) + (x > 0 ? 1 : 0); leg[i * 4 + L] = 1; lw[i] = ss(cfg.pivY[L] - 0.02, cfg.pivY[L] - cfg.legBlend, y); }
        hw[i] = z > cfg.head[0] && y > cfg.head[1] ? ss(cfg.head[0], cfg.head[2], z) : 0;
      }
      geo.setAttribute("aLeg", new T.BufferAttribute(leg, 4));
      geo.setAttribute("aLW", new T.BufferAttribute(lw, 1));
      geo.setAttribute("aHW", new T.BufferAttribute(hw, 1));
      geo.setAttribute("aTW", new T.BufferAttribute(tw, 1));
      const geos = cfg.palettes.map((pal) => {
        const cl = pal.map((h) => new T.Color(h)), col = new Float32Array(nV * 3);
        for (let i = 0; i < nV; i++) { const cc = cl[matId[i]] || cl[0], sh = shade[i]; col[i * 3] = cc.r * sh; col[i * 3 + 1] = cc.g * sh; col[i * 3 + 2] = cc.b * sh; }
        const g2 = geo.clone(); g2.setAttribute("color", new T.BufferAttribute(col, 3)); return g2;
      });
      return { geos, pivZ: new T.Vector4(...cfg.pivZ), pivY: new T.Vector4(...cfg.pivY), headP: new T.Vector3(0, cfg.headP[0], cfg.headP[1]), tailP: new T.Vector3(0, cfg.tailP[1], cfg.tailP[0]), ...cfg.look };
    }).catch((e) => { console.warn("Model yuklanmadi:", url, e); return null; });
  }
  let COW = null, SHEEP = null, qPromise = null;
  function preloadQ() {
    if (qPromise) return qPromise;
    qPromise = Promise.all([
      loadQ("games/models/cow.bin?v=1", {
        pivY: [0.76, 0.76, 0.82, 0.82], pivZ: [0.43, 0.43, -1.16, -1.16], split: -0.4, legBlend: 0.3,
        region: (x, y, z) => (z < -1.4 && Math.abs(x) < 0.12 ? "tail" : Math.abs(x) < 0.17 && z > -0.98 && z < -0.5 && y < 0.7 ? "skip" : "leg"),
        head: [0.72, 0.95, 1.12], headP: [1.35, 0.72], tailP: [-1.5, 1.58],
        palettes: [[0xf3f0e8, 0x1b1917, 0xe8a0a4], [0xf3ece0, 0x6b3a1c, 0xe8a0a4]],
        look: { shadow: [1.6, 3.4], speed: 0.9, step: 6, size: 1.85, rough: 0.62, legAmp: 0.7 }
      }),
      loadQ("games/models/sheep.bin?v=1", {
        pivY: [0.46, 0.46, 0.46, 0.46], pivZ: [0.19, 0.19, -0.64, -0.64], split: -0.22, legBlend: 0.2,
        region: () => "leg",
        head: [0.45, 0.72, 0.7], headP: [0.9, 0.42], tailP: [-0.8, 0.95],
        wool: (x, y, z, m) => m === 0 && y > 0.38, woolAmp: 0.05,
        palettes: [[0xf1ebdd, 0x1f1b18], [0xe9dfca, 0x2a221d], [0xd8cdb8, 0x3b2d22]],
        look: { shadow: [1.1, 1.9], speed: 1.1, step: 8, size: 1.25, rough: 0.95, legAmp: 0.8 }
      })
    ]).then(([c, sh]) => { COW = c; SHEEP = sh; return [c, sh]; });
    return qPromise;
  }
  let horseN = 0, cowN = 0, sheepN = 0;
  const BUILD = {
    tovuq: () => { const r = Math.random(); return buildChicken(r < 0.12 ? "rooster" : r < 0.5 ? "brown" : "white"); },
    qoy: () => (SHEEP ? buildReal(SHEEP, sheepN++) : buildSheep()), sigir: () => (COW ? buildReal(COW, cowN++) : buildCow()), ot: () => (HORSE ? buildRealHorse(horseN++) : buildHorse(horseN++))
  };

  // =====================================================================
  function Farm3D(container, opts = {}) {
    if (!T) throw new Error("THREE yuklanmadi");
    if (T.ColorManagement) T.ColorManagement.legacyMode = false;
    const self = this;
    let renderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); } catch (e) { throw new Error("WebGL yo‘q"); }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.domElement.className = "fm-canvas";
    container.appendChild(renderer.domElement);

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(45, 1, 0.5, 400);
    const hemi = new T.HemisphereLight(0xcfe8ff, 0x4d6b2a, 0.75); scene.add(hemi);
    const sun = new T.DirectionalLight(0xfff1d6, 1.6);
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -34, right: 34, top: 34, bottom: -34, near: 1, far: 140 });
    sun.shadow.bias = -0.0005; scene.add(sun); scene.add(sun.target);
    const lamp = new T.PointLight(0xffc36b, 0, 22, 1.6); lamp.position.set(-14, 5.2, -5.3); scene.add(lamp);

    // ---------- Yer ----------
    const ground = new T.Mesh(new T.PlaneGeometry(260, 260), new T.MeshStandardMaterial({ map: grassTex(), roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    const dirt = new T.Mesh(new T.PlaneGeometry(10, 9), new T.MeshStandardMaterial({ map: dirtTex(), roughness: 1 }));
    dirt.rotation.x = -Math.PI / 2; dirt.position.set(-12, 0.02, 8.5); dirt.receiveShadow = true; scene.add(dirt);
    const path = new T.Mesh(new T.PlaneGeometry(3, 30), new T.MeshStandardMaterial({ map: dirtTex(), roughness: 1 }));
    path.rotation.x = -Math.PI / 2; path.position.set(-17, 0.015, 0); path.receiveShadow = true; scene.add(path);

    // ---------- Shamolda tebranuvchi o't ----------
    const windU = { value: 0 };
    {
      const blade = new T.BufferGeometry();
      blade.setAttribute("position", new T.Float32BufferAttribute([-0.05, 0, 0, 0.05, 0, 0, -0.03, 0.22, 0.01, 0.03, 0.22, 0.01, 0, 0.5, 0.04], 3));
      blade.setAttribute("color", new T.Float32BufferAttribute([0.45, 0.55, 0.3, 0.45, 0.55, 0.3, 0.8, 0.9, 0.7, 0.8, 0.9, 0.7, 1.15, 1.15, 0.95], 3));
      blade.setIndex([0, 1, 2, 1, 3, 2, 2, 3, 4]);
      blade.computeVertexNormals();
      const gm = new T.MeshStandardMaterial({ roughness: 1, side: T.DoubleSide, vertexColors: true });
      gm.onBeforeCompile = (sh) => {
        sh.uniforms.uWind = windU;
        sh.vertexShader = "uniform float uWind;\n" + sh.vertexShader.replace("#include <begin_vertex>",
          "#include <begin_vertex>\n#ifdef USE_INSTANCING\nvec2 wp = instanceMatrix[3].xz;\nfloat sway = sin(uWind * 1.6 + wp.x * 0.35 + wp.y * 0.22) * 0.5 + sin(uWind * 3.1 + wp.x * 1.3) * 0.18;\ntransformed.x += sway * position.y * position.y * 0.9;\ntransformed.z += sway * position.y * position.y * 0.4;\n#endif");
      };
      const N = matchMedia("(max-width: 700px)").matches ? 14000 : 26000;
      const grass = new T.InstancedMesh(blade, gm, N);
      const m4 = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), pos = new T.Vector3(), sc = new T.Vector3(), col = new T.Color();
      const skip = (x, z) => (x > -18.5 && x < -7 && z > 4 && z < 13.2) || (x > -18.6 && x < -15.4 && z > -15 && z < 15) || (x > -23 && x < -3 && z > -12.5 && z < -3.4) || (x > -31 && x < -23 && z > -2 && z < 6);
      let n = 0;
      while (n < N) {
        const far = n > N * 0.72;
        const x = far ? rand(-60, 60) : rand(-21, 19), z = far ? rand(-50, 40) : rand(-15, 15);
        if (skip(x, z)) continue;
        pos.set(x, 0, z); e.set(rand(-0.15, 0.15), rand(0, 6.28), rand(-0.15, 0.15)); q.setFromEuler(e);
        const h = rand(0.55, 1.35) * (far ? 1.3 : 1); sc.set(rand(0.8, 1.3), h, 1);
        m4.compose(pos, q, sc); grass.setMatrixAt(n, m4);
        col.setHSL(rand(0.22, 0.3), rand(0.45, 0.65), rand(0.26, 0.4)); grass.setColorAt(n, col);
        n++;
      }
      grass.receiveShadow = true; grass.frustumCulled = false;
      scene.add(grass);
    }

    const wood = new T.MeshStandardMaterial({ map: woodTex(), roughness: 0.9 });
    // ---------- Panjara ----------
    const fence = new T.Group(); scene.add(fence);
    const X0 = -20, X1 = 18, Z0 = -14, Z1 = 14;
    const post = new T.CylinderGeometry(0.12, 0.14, 1.3, 6), rail = new T.BoxGeometry(1, 0.1, 0.06);
    const side = (ax, az, bx, bz) => {
      const len = Math.hypot(bx - ax, bz - az), n = Math.ceil(len / 2.4), ang = Math.atan2(bz - az, bx - ax);
      for (let i = 0; i <= n; i++) { const t = i / n; mesh(post, wood, ax + (bx - ax) * t, 0.65, az + (bz - az) * t, fence); }
      [0.45, 0.95].forEach((y) => { const r = mesh(rail, wood, (ax + bx) / 2, y, (az + bz) / 2, fence); r.scale.x = len; r.rotation.y = -ang; });
    };
    side(X0, Z0, X1, Z0); side(X1, Z0, X1, Z1); side(X0, Z1, -15, Z1); side(-12, Z1, X1, Z1); side(X0, Z0, X0, Z1);

    // ---------- Ombor (qizil saroy) ----------
    const barn = new T.Group(); barn.position.set(-13, 0, -8); scene.add(barn);
    const barnMat = new T.MeshStandardMaterial({ map: barnTex(), roughness: 0.85 }), whiteM = std(0xf3efe6, 0.7), roofM = std(0x4b3b35, 0.7);
    mesh(new T.BoxGeometry(9, 5, 7), barnMat, 0, 2.5, 0, barn);
    const roofShape = new T.Shape(); roofShape.moveTo(-4.9, 0); roofShape.lineTo(0, 3); roofShape.lineTo(4.9, 0); roofShape.lineTo(-4.9, 0);
    const roof = mesh(new T.ExtrudeGeometry(roofShape, { depth: 7.6, bevelEnabled: false }), roofM, 0, 5, -3.8, barn);
    const gable = mesh(new T.ShapeGeometry(roofShape), barnMat, 0, 5, 3.52, barn); gable.scale.set(0.92, 0.92, 1);
    mesh(new T.BoxGeometry(3, 3.6, 0.15), wood, 0, 1.8, 3.55, barn);
    [[-1.5, 0], [1.5, 0]].forEach(([x]) => mesh(new T.BoxGeometry(0.15, 3.7, 0.2), whiteM, x, 1.85, 3.6, barn));
    const cross = mesh(new T.BoxGeometry(0.15, 4.2, 0.2), whiteM, 0, 1.8, 3.62, barn); cross.rotation.z = 0.69;
    const cross2 = mesh(new T.BoxGeometry(0.15, 4.2, 0.2), whiteM, 0, 1.8, 3.62, barn); cross2.rotation.z = -0.69;
    mesh(new T.BoxGeometry(1.4, 1.1, 0.12), std(0x1e293b, 0.3, { emissive: 0x000000 }), 0, 6.1, 3.6, barn);
    // Silos
    mesh(new T.CylinderGeometry(1.4, 1.4, 8, 18), std(0xcbd5e1, 0.4, { metalness: 0.6 }), -6.2, 4, -1, barn);
    mesh(new T.SphereGeometry(1.4, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(0x94a3b8, 0.35, { metalness: 0.6 }), -6.2, 8, -1, barn);

    // ---------- Uy ----------
    const house = new T.Group(); house.position.set(-27, 0, 2); house.rotation.y = Math.PI / 2; scene.add(house);
    mesh(new T.BoxGeometry(7, 3.6, 5.5), std(0xe9dcc3, 0.9), 0, 1.8, 0, house);
    const hr = new T.Shape(); hr.moveTo(-4, 0); hr.lineTo(0, 2.2); hr.lineTo(4, 0); hr.lineTo(-4, 0);
    mesh(new T.ExtrudeGeometry(hr, { depth: 6.2, bevelEnabled: false }), std(0x7c2d12, 0.8), 0, 3.6, -3.1, house);
    mesh(new T.BoxGeometry(1.2, 2.2, 0.1), wood, 0, 1.1, 2.78, house);
    [-2.3, 2.3].forEach((x) => mesh(new T.BoxGeometry(1.2, 1, 0.1), std(0x93c5fd, 0.15, { emissive: 0x111111 }), x, 2, 2.78, house));

    // ---------- Tovuqxona ----------
    const coop = new T.Group(); coop.position.set(-12.5, 0, 12.2); scene.add(coop);
    [[-1.2, -0.9], [1.2, -0.9], [-1.2, 0.9], [1.2, 0.9]].forEach(([x, z]) => mesh(new T.CylinderGeometry(0.08, 0.08, 0.8, 6), wood, x, 0.4, z, coop));
    mesh(new T.BoxGeometry(2.8, 1.5, 2.2), std(0xf1c27d, 0.9), 0, 1.55, 0, coop);
    const cr = new T.Shape(); cr.moveTo(-1.6, 0); cr.lineTo(0, 0.9); cr.lineTo(1.6, 0); cr.lineTo(-1.6, 0);
    mesh(new T.ExtrudeGeometry(cr, { depth: 2.6, bevelEnabled: false }), std(0x9a3412, 0.8), 0, 2.3, -1.3, coop);
    const ramp = mesh(new T.BoxGeometry(0.6, 0.05, 1.4), wood, 0.6, 0.45, 1.6, coop); ramp.rotation.x = 0.55;
    mesh(new T.BoxGeometry(0.5, 0.6, 0.05), std(0x1f2937, 0.9), 0.6, 1.2, 1.12, coop);
    // Don (yem) sochilgan joy
    const grain = new T.Group(); grain.position.set(-11.5, 0.05, 8); scene.add(grain);
    const seedGeo = new T.SphereGeometry(0.05, 5, 4), seedMat = std(0xe8c35a, 0.7);
    for (let i = 0; i < 140; i++) mesh(seedGeo, seedMat, rand(-2.5, 2.5), 0, rand(-2, 2), grain);

    // ---------- Oxur (suv) va beda ----------
    const trough = new T.Group(); trough.position.set(5, 0, -9.5); scene.add(trough);
    mesh(new T.BoxGeometry(5, 0.8, 1.3), wood, 0, 0.55, 0, trough);
    const water = mesh(new T.BoxGeometry(4.6, 0.05, 0.95), new T.MeshStandardMaterial({ color: 0x3aa6e0, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.85 }), 0, 0.6, 0, trough);
    const trough2 = trough.clone(); trough2.position.set(-9, 0, 5.5); trough2.scale.set(0.5, 0.7, 0.8); scene.add(trough2);
    const water2 = trough2.children[trough2.children.length - 1];
    const pump = new T.Group(); pump.position.set(8.2, 0, -9.5); scene.add(pump);
    mesh(new T.CylinderGeometry(0.15, 0.15, 1.6, 8), std(0x334155, 0.4, { metalness: 0.7 }), 0, 0.8, 0, pump);
    mesh(new T.BoxGeometry(0.15, 0.15, 0.8), std(0x334155, 0.4, { metalness: 0.7 }), 0, 1.5, -0.3, pump);
    const hay = new T.Group(); scene.add(hay);
    const baleGeo = new T.CylinderGeometry(0.75, 0.75, 1.2, 18), baleMat = new T.MeshStandardMaterial({ color: 0xd9b45a, roughness: 1 });
    const hayStack = new T.Group(); hayStack.position.set(-6, 0, -9.5); scene.add(hayStack);
    [[0, 0.75, 0], [1.6, 0.75, 0], [0.8, 2.1, 0]].forEach(([x, y, z]) => { const m = mesh(baleGeo, baleMat, x, y, z, hayStack); m.rotation.z = Math.PI / 2; });
    const bedaM = [std(0x8fae45, 1), std(0xa8b95a, 1), std(0x7a9a3a, 1)], heap = lumpy(1, 2, 0.45);
    [[2, -2], [10, 4], [3, 7], [12, -6]].forEach(([x, z]) => {
      for (let k = 0; k < 4; k++) { const m = mesh(heap, bedaM[k % 3], x + rand(-0.5, 0.5), 0.15, z + rand(-0.4, 0.4), hay); m.scale.set(rand(0.6, 0.9), rand(0.35, 0.5), rand(0.5, 0.8)); m.rotation.y = rand(0, 6); }
    });

    // ---------- Daraxtlar, toshlar, gullar ----------
    const trunkM = std(0x5b3a22, 0.95), leafM = [std(0x2f6b2a, 0.85), std(0x3d7f33, 0.85), std(0x4f8f2e, 0.85), std(0x2a5e2f, 0.85)];
    const leafGeo = [lumpy(1, 2, 0.35), lumpy(1, 2, 0.4), lumpy(1, 1, 0.3)];
    const tree = (x, z, s = 1) => {
      const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); g.rotation.y = rand(0, 6.28); scene.add(g);
      mesh(new T.CylinderGeometry(0.22, 0.42, 3.4, 9), trunkM, 0, 1.7, 0, g);
      [[0.5, 3.2, 0.6], [-0.5, 3.4, -0.4]].forEach(([a, b, c]) => { const br = mesh(new T.CylinderGeometry(0.08, 0.14, 1.6, 6), trunkM, a * 0.6, b, c * 0.6, g); br.rotation.set(c, 0, -a); });
      [[0, 4, 0, 1.8], [1.0, 3.5, 0.5, 1.3], [-0.9, 3.6, -0.4, 1.35], [0.3, 5.0, -0.3, 1.25], [-0.4, 4.4, 0.8, 1.1], [0.6, 4.3, -0.9, 1.05]]
        .forEach(([a, b, c, r]) => { const l = mesh(leafGeo[Math.random() * 3 | 0], leafM[Math.random() * 4 | 0], a, b, c, g); l.scale.set(r, r * rand(0.8, 0.95), r); });
    };
    const pineM = [std(0x1f4d2b, 0.9), std(0x26592f, 0.9)];
    const pine = (x, z, s = 1) => {
      const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g);
      mesh(new T.CylinderGeometry(0.18, 0.3, 2, 7), trunkM, 0, 1, 0, g);
      [[2.2, 2.6, 1.9], [3.6, 2.0, 1.5], [4.8, 1.5, 1.2]].forEach(([y, r, h]) => mesh(new T.ConeGeometry(r, h * 1.6, 9), pineM[Math.random() * 2 | 0], 0, y, 0, g));
    };
    [[-24, -14], [-26, 12], [24, -16], [26, 4], [22, 16], [-4, 20], [8, 21], [-30, -6], [30, -2], [14, -22], [-16, 22], [32, 14]].forEach(([x, z]) => tree(x, z, rand(0.85, 1.35)));
    for (let i = 0; i < 46; i++) {
      const a = (i / 46) * Math.PI * 2 + rand(-0.05, 0.05), r = rand(46, 62);
      const x = Math.cos(a) * r, z = Math.sin(a) * r * 0.85;
      if (z > 22 && Math.abs(x) < 25) continue; // old tomon ochiq qolsin
      (i % 3 ? pine : tree)(x, z, rand(1.1, 1.8));
    }
    // Uzoq qorli tog'lar (O'zbekiston tog'lari kabi)
    const mtM = new T.MeshStandardMaterial({ color: 0x7d8fa8, roughness: 1, flatShading: true, fog: false }), snowM = new T.MeshStandardMaterial({ color: 0xf4f7fb, roughness: 0.9, flatShading: true, fog: false });
    for (let i = 0; i < 11; i++) {
      const a = -Math.PI * 0.95 + i * 0.19 + rand(-0.04, 0.04), r = rand(175, 195), h = rand(38, 70), w = h * rand(1.1, 1.5);
      const g = new T.Group(); g.position.set(Math.cos(a) * r, -2, Math.sin(a) * r); scene.add(g);
      const m = new T.Mesh(lumpy(1, 1, 0.18), mtM); m.scale.set(w, h, w * 0.7); g.add(m);
      const c = new T.Mesh(new T.ConeGeometry(w * 0.34, h * 0.32, 7), snowM); c.position.y = h * 0.8; g.add(c);
    }
    // Bulutlar
    const cloudTex = canvasTex(256, 128, (x) => {
      for (let i = 0; i < 16; i++) {
        const cx = 40 + Math.random() * 176, cy = 60 + Math.random() * 30 - Math.abs(cx - 128) * 0.12, r = 18 + Math.random() * 26;
        const g = x.createRadialGradient(cx, cy, 1, cx, cy, r);
        g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(0.6, "rgba(255,255,255,.6)"); g.addColorStop(1, "rgba(255,255,255,0)");
        x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
      }
    });
    const clouds = [];
    for (let i = 0; i < 12; i++) {
      const c = new T.Sprite(new T.SpriteMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, opacity: rand(0.7, 0.95) }));
      const w = rand(40, 75); c.scale.set(w, w * 0.45, 1);
      c.position.set(rand(-180, 180), rand(45, 80), rand(-170, -40) * (i % 4 ? 1 : -0.6));
      c.userData.v = rand(0.6, 1.6); scene.add(c); clouds.push(c);
    }
    // Quyosh / oy
    const glowTex = canvasTex(128, 128, (x) => {
      const g = x.createRadialGradient(64, 64, 4, 64, 64, 63);
      g.addColorStop(0, "rgba(255,255,240,1)"); g.addColorStop(0.18, "rgba(255,248,215,.95)"); g.addColorStop(0.35, "rgba(255,225,160,.35)"); g.addColorStop(1, "rgba(255,210,140,0)");
      x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    });
    const sunDisc = new T.Sprite(new T.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, fog: false }));
    sunDisc.scale.set(36, 36, 1); scene.add(sunDisc);
    // Yulduzlar
    const starGeo = new T.BufferGeometry(), sp = [];
    for (let i = 0; i < 700; i++) { const u = Math.random() * 6.28, v = Math.acos(rand(0.08, 1)); sp.push(Math.sin(v) * Math.cos(u) * 190, Math.cos(v) * 190, Math.sin(v) * Math.sin(u) * 190); }
    starGeo.setAttribute("position", new T.Float32BufferAttribute(sp, 3));
    const stars = new T.Points(starGeo, new T.PointsMaterial({ color: 0xffffff, size: 1.3, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.9 }));
    stars.visible = false; scene.add(stars);
    // Qushlar
    const birdM = std(0x2a2a2a, 0.8, { side: T.DoubleSide }), birds = [];
    for (let i = 0; i < 6; i++) {
      const b = new T.Group(), wingG = new T.PlaneGeometry(0.9, 0.35);
      wingG.translate(0.45, 0, 0);
      const l = new T.Mesh(wingG, birdM), r = new T.Mesh(wingG, birdM); r.scale.x = -1;
      l.rotation.x = r.rotation.x = -Math.PI / 2;
      const wl = new T.Group(), wr = new T.Group(); wl.add(l); wr.add(r); b.add(wl, wr);
      b.add(new T.Mesh(new T.SphereGeometry(0.14, 6, 4), birdM)).scale.set(1, 1, 3);
      b.userData = { wl, wr, a: rand(0, 6.28), r: rand(22, 45), y: rand(18, 30), sp: rand(0.12, 0.22) * (i % 2 ? 1 : -1), f: rand(7, 10), cx: rand(-10, 10), cz: rand(-10, 10) };
      scene.add(b); birds.push(b);
    }
    const rockM = std(0x8f8f8f, 1);
    for (let i = 0; i < 18; i++) { const r = mesh(new T.DodecahedronGeometry(rand(0.2, 0.6), 0), rockM, rand(-40, 40), 0.15, rand(-40, 40), scene); if (Math.abs(r.position.x) < 21 && Math.abs(r.position.z) < 15) r.position.x += 45; }
    const flowerCols = [0xf472b6, 0xfde047, 0xffffff, 0xa78bfa, 0xfb7185];
    for (let i = 0; i < 120; i++) { const x = rand(-19, 17), z = rand(-13, 13); if (x < -8 && z < -3) continue; mesh(new T.SphereGeometry(0.07, 6, 4), std(flowerCols[i % 5], 0.6), x, 0.12, z, scene).castShadow = false; }
    // Uzoq tepaliklar
    const hillM = std(0x6e9d4a, 1);
    [[-70, -90, 40], [10, -110, 55], [90, -80, 38], [-110, 20, 45], [110, 40, 50]].forEach(([x, z, r]) => { const h = mesh(new T.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), hillM, x, -r * 0.55, z, scene); h.castShadow = false; });

    // ---------- Hayvonlar ----------
    const animals = new Map();
    const ZONES = { tovuq: [-16, -8, 5, 13], qoy: [-4, 16, -12, 12], sigir: [-4, 16, -12, 12], ot: [-4, 16, -12, 12] };
    const randIn = (t) => { const z = ZONES[t]; return new T.Vector3(rand(z[0], z[1]), 0, rand(z[2], z[3])); };
    function addAnimal(a) {
      const b = BUILD[a.t] ? BUILD[a.t]() : buildSheep();
      const p = randIn(a.t);
      b.g.position.copy(p);
      b.g.rotation.y = rand(0, 6.28);
      b.g.traverse((o) => { o.userData.aid = a.id; });
      const icon = new T.Sprite(new T.SpriteMaterial({ map: emojiTex("😋"), depthTest: false, transparent: true }));
      icon.scale.setScalar(a.t === "tovuq" ? 0.6 : 0.9); icon.position.y = b.size + 0.8; icon.renderOrder = 10;
      b.g.add(icon);
      scene.add(b.g);
      const st = { b, a, icon, target: randIn(a.t), wait: rand(0, 3), phase: rand(0, 6), status: "" };
      animals.set(a.id, st);
      setStatus(st, a.status);
    }
    function setStatus(st, status) {
      if (st.status === status) return;
      st.status = status;
      const e = { fed: "😋", hungry: "🍽️", sick: "🤒", ready: "⭐", product: "🥚", milk: "🥛" }[status] || "";
      st.icon.visible = !!e;
      if (e) st.icon.material.map = emojiTex(e);
      st.icon.material.needsUpdate = true;
    }
    this.setAnimals = function (list) {
      const ids = new Set(list.map((a) => a.id));
      for (const [id, st] of animals) if (!ids.has(id)) { scene.remove(st.b.g); animals.delete(id); }
      list.forEach((a) => { const st = animals.get(a.id); if (!st) addAnimal(a); else { st.a = a; setStatus(st, a.status); } });
    };
    this.setFeed = function (f) {
      water.visible = water2.visible = !!f.water;
      hay.visible = !!f.hay;
      grain.visible = !!f.grain;
    };
    this.setFeed({});

    // ---------- Kun va tun ----------
    let lastHour = -1;
    let applyTime = function (h) {
      const day = h >= 6 && h < 19, dusk = (h >= 17 && h < 19) || (h >= 6 && h < 7.5);
      const a = ((h - 6) / 13) * Math.PI;
      sun.position.set(Math.cos(a) * 60, Math.max(8, Math.sin(a) * 70), 30);
      if (day && !dusk) { scene.background = skyTex("#5aa9ec", "#a9d6f5", "#e8f4fb"); scene.fog = new T.Fog(0xcfe6f2, 70, 210); sun.intensity = 1.6; sun.color.set(0xfff1d6); hemi.intensity = 0.75; lamp.intensity = 0; renderer.toneMappingExposure = 1; }
      else if (dusk) { scene.background = skyTex("#3b4f8c", "#f59e6b", "#ffd29a"); scene.fog = new T.Fog(0xf3b483, 60, 190); sun.intensity = 1.1; sun.color.set(0xffa463); hemi.intensity = 0.5; lamp.intensity = 1.2; renderer.toneMappingExposure = 0.95; }
      else { scene.background = skyTex("#050a1f", "#13224a", "#273a63"); scene.fog = new T.Fog(0x16244a, 50, 170); sun.position.set(-40, 60, -20); sun.intensity = 0.35; sun.color.set(0x9db4ff); hemi.intensity = 0.25; lamp.intensity = 2.4; renderer.toneMappingExposure = 0.9; }
    };
    const _applyTime = applyTime;
    applyTime = function (h) {
      _applyTime(h);
      const night = !(h >= 6 && h < 19), dusk = (h >= 17 && h < 19) || (h >= 6 && h < 7.5);
      stars.visible = night;
      birds.forEach((b) => (b.visible = !night));
      const dir = sun.position.clone().normalize();
      sunDisc.position.copy(dir.multiplyScalar(170));
      sunDisc.material.color.set(night ? 0xc9d6ff : dusk ? 0xffb37a : 0xffffff);
      sunDisc.scale.setScalar(night ? 16 : dusk ? 44 : 36);
      clouds.forEach((c) => c.material.color.set(night ? 0x2a3557 : dusk ? 0xffc3a0 : 0xffffff));
      self.isNight = night;
    };
    this.setHour = (h) => { lastHour = h; applyTime(h); };
    const realHour = () => { const d = new Date(); return d.getHours() + d.getMinutes() / 60; };
    applyTime(realHour());

    // ---------- Kamera boshqaruvi ----------
    const cam = { theta: 0.65, phi: 0.92, r: 40, target: new T.Vector3(-1, 0, 0) };
    let camGoal = null;
    function applyCam() {
      const { theta, phi, r, target } = cam;
      camera.position.set(target.x + r * Math.sin(phi) * Math.sin(theta), target.y + r * Math.cos(phi), target.z + r * Math.sin(phi) * Math.cos(theta));
      camera.lookAt(target);
    }
    const el = renderer.domElement, ray = new T.Raycaster(), ndc = new T.Vector2(), pointers = new Map();
    let drag = null, pinch = null;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), r: cam.r }; drag = null; }
      else drag = { x: e.clientX, y: e.clientY, th: cam.theta, ph: cam.phi, moved: false };
    });
    el.addEventListener("pointermove", (e) => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pointers.size === 2) { const [a, b] = [...pointers.values()]; cam.r = Math.max(12, Math.min(75, pinch.r * pinch.d / Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)))); camGoal = null; return; }
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 7) drag.moved = true;
      if (drag.moved) { cam.theta = drag.th - dx * 0.006; cam.phi = Math.max(0.35, Math.min(1.38, drag.ph - dy * 0.005)); camGoal = null; }
    });
    const end = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (drag && !drag.moved && pointers.size === 0) {
        const r = el.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const objs = []; animals.forEach((st) => objs.push(st.b.g));
        const hit = ray.intersectObjects(objs, true)[0];
        if (hit && hit.object.userData.aid != null && opts.onAnimal) opts.onAnimal(hit.object.userData.aid);
        else if (opts.onGround) opts.onGround();
      }
      if (pointers.size === 0) drag = null;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", (e) => { pointers.delete(e.pointerId); drag = null; pinch = null; });
    el.addEventListener("wheel", (e) => { e.preventDefault(); cam.r = Math.max(12, Math.min(75, cam.r * (1 + Math.sign(e.deltaY) * 0.08))); camGoal = null; }, { passive: false });
    this.focus = function (id) {
      const st = animals.get(id);
      if (!st) return;
      camGoal = { id, r: st.a.t === "tovuq" ? 9 : 14 };
    };
    this.overview = () => { camGoal = { overview: true, r: 40 }; };

    function resize() {
      const w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.fov = w / h < 0.8 ? 60 : 45; camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize); ro.observe(container); resize();

    // ---------- Animatsiya sikli ----------
    const clock = new T.Clock();
    const hearts = [];
    let raf = 0, alive = true, timeCheck = 0;
    const tmp = new T.Vector3();
    function loop() {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05), now = clock.elapsedTime;
      animals.forEach((st) => {
        const { b } = st, sick = st.status === "sick", speed = b.speed * (sick ? 0.35 : 1);
        if (st.wait > 0) {
          st.wait -= dt;
          b.head.rotation.x += ((st.graze ? 0.6 : 0) - b.head.rotation.x) * 0.08;
          b.legs.forEach((l) => (l.rotation.x *= 0.85));
          b.body.position.y *= 0.85;
          if (st.wait <= 0) { st.target = randIn(st.a.t); st.graze = false; }
        } else {
          tmp.subVectors(st.target, b.g.position); tmp.y = 0;
          const d = tmp.length();
          if (d < 0.3) { st.wait = rand(1.5, sick ? 8 : 5); st.graze = Math.random() < 0.65; }
          else {
            tmp.normalize();
            const want = Math.atan2(tmp.x, tmp.z);
            let diff = want - b.g.rotation.y; while (diff > Math.PI) diff -= 2 * Math.PI; while (diff < -Math.PI) diff += 2 * Math.PI;
            b.g.rotation.y += diff * Math.min(1, dt * 4);
            b.g.position.addScaledVector(tmp, speed * dt * (Math.abs(diff) > 1 ? 0.3 : 1));
            st.phase += dt * b.step * (sick ? 0.5 : 1);
            const s = Math.sin(st.phase);
            b.legs.forEach((l, i) => (l.rotation.x = s * 0.5 * (i % 2 === (i < 2 ? 0 : 1) ? 1 : -1)));
            b.body.position.y = Math.abs(Math.cos(st.phase)) * 0.05 * b.size;
            b.head.rotation.x += (0 - b.head.rotation.x) * 0.1;
          }
        }
        // Ovoz chiqarayotgan hayvon boshini ko'taradi
        if (st.call > 0) {
          st.call -= dt;
          b.head.rotation.x += (-0.45 + Math.sin(now * 28) * 0.05 - b.head.rotation.x) * 0.25;
          b.body.position.y = Math.abs(Math.sin(now * 14)) * 0.02 * b.size;
        } else if (b.peck && st.wait > 0 && st.graze) b.head.rotation.x = Math.max(0, Math.sin(now * 9 + st.phase)) * 1.1;
        if (b.tail) { b.tail.rotation.z = Math.sin(now * 2.3 + st.phase) * 0.28; b.tail.rotation.x = 0.12 + Math.sin(now * 1.1 + st.phase) * 0.06; }
        st.icon.position.y = b.size + 0.8 + Math.sin(now * 2 + st.phase) * 0.08;
        if (b.sync) b.sync();
      });
      windU.value = now;
      clouds.forEach((c) => { c.position.x += c.userData.v * dt; if (c.position.x > 200) c.position.x = -200; });
      birds.forEach((bd) => {
        const u = bd.userData; u.a += u.sp * dt;
        bd.position.set(u.cx + Math.cos(u.a) * u.r, u.y + Math.sin(u.a * 3) * 1.5, u.cz + Math.sin(u.a) * u.r);
        bd.rotation.y = -u.a + (u.sp > 0 ? Math.PI : 0); bd.rotation.z = u.sp > 0 ? 0.2 : -0.2;
        const f = Math.sin(now * u.f + u.a * 10) * 0.7; u.wl.rotation.z = f; u.wr.rotation.z = -f;
      });
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i]; h.userData.t += dt;
        const t = Math.max(0, h.userData.t) / h.userData.life;
        if (h.userData.t > 0) h.position.y += dt * 1.2;
        h.material.opacity = h.userData.t < 0 ? 0 : Math.max(0, 1 - t);
        if (t >= 1) { scene.remove(h); h.material.dispose(); hearts.splice(i, 1); }
      }
      if (camGoal) {
        let tx = -1, tz = 0;
        if (camGoal.id != null && animals.get(camGoal.id)) { const p = animals.get(camGoal.id).b.g.position; tx = p.x; tz = p.z; }
        cam.target.x += (tx - cam.target.x) * 0.08; cam.target.z += (tz - cam.target.z) * 0.08;
        cam.r += (camGoal.r - cam.r) * 0.06;
        if (camGoal.overview && Math.abs(cam.r - camGoal.r) < 0.2) camGoal = null;
      }
      applyCam();
      timeCheck += dt;
      if (timeCheck > 30 && lastHour < 0) { timeCheck = 0; applyTime(realHour()); }
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(loop);

    // ---------- Ovoz va effektlar uchun ----------
    this.call = function (id) {
      const st = animals.get(id);
      if (!st) return null;
      st.call = 1.3; st.wait = Math.max(st.wait, 1.4);
      const v = st.b.g.position.clone(); v.y += st.b.size;
      const dist = camera.position.distanceTo(v);
      v.project(camera);
      return { rooster: !!st.b.rooster, pan: Math.max(-1, Math.min(1, v.x)), vol: Math.max(0.18, Math.min(1, 20 / dist)), onscreen: Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1 && v.z < 1 };
    };
    this.celebrate = function (emoji = "❤️") {
      animals.forEach((st) => {
        for (let k = 0; k < (st.a.t === "tovuq" ? 1 : 2); k++) {
          const h = new T.Sprite(new T.SpriteMaterial({ map: emojiTex(emoji), transparent: true, depthWrite: false }));
          h.scale.setScalar(st.a.t === "tovuq" ? 0.5 : 0.8);
          h.position.copy(st.b.g.position); h.position.y += st.b.size + 0.4 + k * 0.4; h.position.x += rand(-0.4, 0.4);
          h.userData = { t: -k * 0.3 - Math.random() * 0.4, life: 1.8 };
          scene.add(h); hearts.push(h);
        }
      });
    };
    this.kinds = () => [...animals.values()].map((st) => ({ id: st.a.id, t: st.a.t, status: st.status }));

    this.destroy = function () {
      alive = false; cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      renderer.dispose(); el.remove();
    };
  }
  Farm3D.preload = () => Promise.all([preloadHorse(), preloadQ()]);
  // Boshqa o'yinlar (Ovchi) uchun: haqiqiy hayvon modellari
  Farm3D.animals = { preloadHorse, preloadQ, buildReal, horse: () => HORSE, cow: () => COW, sheep: () => SHEEP };
  window.SofiFarm3D = Farm3D;
})();
