/* ARXITEKTOR 3D — sahna, jihozlar katalogi, qurish va ichida yurish.
   Birlik: 1 = 1 metr. Maydon 30×30 katak (x, z: -15..15). Qavat balandligi 3 m.
   Devor turidagi jihozlar katak chegarasida (qirrada), qolganlari katakda turadi.
   Yozuv: { id, t, x, z, l, r, c }  t — tur, x/z — katak (devor uchun tugun), l — qavat, r — burilish 0..3, c — rang indeksi
   new SofiArch3D(container, { onPlace(rec), onPick(id), onErase(id), onMiss() })                              */
(() => {
  "use strict";
  const T = window.THREE;
  const H = 3, HALF = 15, MAXL = 2, BASE = 0.06;
  const rand = (a, b) => a + Math.random() * (b - a);

  // ===================== TEKSTURALAR =====================
  function canvas(w, h, draw) { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); return c; }
  function tex(c, rep, srgb = true) {
    const t = new T.CanvasTexture(c);
    if (srgb) t.encoding = T.sRGBEncoding;
    t.wrapS = t.wrapT = T.RepeatWrapping;
    if (rep) t.repeat.set(rep[0], rep[1]);
    t.anisotropy = 8;
    return t;
  }
  const noise = (x, w, h, n, a, col = "0,0,0") => { for (let i = 0; i < n; i++) { x.fillStyle = `rgba(${col},${Math.random() * a})`; x.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } };
  const TEX = {};
  function getTex(name) {
    if (TEX[name]) return TEX[name];
    let color, bump;
    if (name === "brick") {
      const draw = (bw) => canvas(256, 256, (x, w, h) => {
        x.fillStyle = bw ? "#777" : "#cfc6b8"; x.fillRect(0, 0, w, h);
        const bh = 32, bl = 64;
        for (let r = 0; r < h / bh; r++) for (let k = -1; k < w / bl + 1; k++) {
          const ox = k * bl + (r % 2 ? bl / 2 : 0);
          if (bw) x.fillStyle = `rgb(${200 + Math.random() * 40 | 0},${200 + Math.random() * 40 | 0},${200 + Math.random() * 40 | 0})`;
          else { const v = Math.random(); x.fillStyle = `rgb(${150 + v * 50 | 0},${62 + v * 25 | 0},${42 + v * 18 | 0})`; }
          x.fillRect(ox + 3, r * bh + 3, bl - 6, bh - 6);
        }
        if (!bw) noise(x, w, h, 3000, 0.15);
      });
      color = tex(draw(false)); bump = tex(draw(true), null, false);
    } else if (name === "plaster") {
      color = tex(canvas(256, 256, (x, w, h) => { x.fillStyle = "#f2efe9"; x.fillRect(0, 0, w, h); noise(x, w, h, 6000, 0.05); noise(x, w, h, 2000, 0.06, "255,255,255"); }));
      bump = tex(canvas(128, 128, (x, w, h) => { x.fillStyle = "#888"; x.fillRect(0, 0, w, h); noise(x, w, h, 5000, 0.4); noise(x, w, h, 3000, 0.4, "255,255,255"); }), null, false);
    } else if (name === "wood" || name === "planks") {
      const draw = (bw) => canvas(256, 256, (x, w, h) => {
        const n = name === "planks" ? 8 : 4;
        for (let i = 0; i < n; i++) {
          const v = Math.random();
          x.fillStyle = bw ? "#999" : `rgb(${160 + v * 30 | 0},${108 + v * 22 | 0},${64 + v * 14 | 0})`;
          x.fillRect(0, (i * h) / n, w, h / n);
          for (let k = 0; k < 26; k++) { x.strokeStyle = bw ? "rgba(0,0,0,.25)" : `rgba(70,40,15,${0.08 + Math.random() * 0.15})`; x.lineWidth = 1 + Math.random() * 1.5; const y = (i * h) / n + Math.random() * (h / n); x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(w / 3, y + rand(-3, 3), (2 * w) / 3, y + rand(-3, 3), w, y); x.stroke(); }
          x.fillStyle = bw ? "#333" : "rgba(40,22,8,.55)"; x.fillRect(0, (i * h) / n, w, 2);
        }
      });
      color = tex(draw(false)); bump = tex(draw(true), null, false);
    } else if (name === "parquet") {
      const draw = (bw) => canvas(256, 256, (x, w, h) => {
        const s = 64;
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
          const v = Math.random(), hz = (i + j) % 2;
          for (let k = 0; k < 4; k++) {
            x.fillStyle = bw ? `rgb(${150 + Math.random() * 40 | 0},0,0)`.replace(",0,0", ",150,150") : `rgb(${176 + v * 30 - k * 4 | 0},${120 + v * 22 - k * 3 | 0},${70 + v * 12 | 0})`;
            if (hz) x.fillRect(i * s, j * s + (k * s) / 4, s, s / 4 - 1); else x.fillRect(i * s + (k * s) / 4, j * s, s / 4 - 1, s);
          }
        }
        if (!bw) noise(x, w, h, 2500, 0.08);
      });
      color = tex(draw(false)); bump = tex(draw(true), null, false);
    } else if (name === "tiles" || name === "marble") {
      const mar = name === "marble";
      color = tex(canvas(256, 256, (x, w, h) => {
        x.fillStyle = mar ? "#ece9e4" : "#f4f4f2"; x.fillRect(0, 0, w, h);
        if (mar) for (let i = 0; i < 18; i++) { x.strokeStyle = `rgba(120,120,130,${0.08 + Math.random() * 0.18})`; x.lineWidth = 0.6 + Math.random() * 1.6; x.beginPath(); let px = Math.random() * w, py = Math.random() * h; x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += rand(-50, 50); py += rand(-50, 50); x.lineTo(px, py); } x.stroke(); }
        noise(x, w, h, 1500, 0.04);
        x.strokeStyle = mar ? "rgba(150,150,150,.5)" : "rgba(170,170,170,.9)"; x.lineWidth = 3;
        const n = mar ? 2 : 4; for (let i = 0; i <= n; i++) { x.beginPath(); x.moveTo((i * w) / n, 0); x.lineTo((i * w) / n, h); x.stroke(); x.beginPath(); x.moveTo(0, (i * h) / n); x.lineTo(w, (i * h) / n); x.stroke(); }
      }));
      bump = tex(canvas(128, 128, (x, w, h) => { x.fillStyle = "#ddd"; x.fillRect(0, 0, w, h); x.strokeStyle = "#555"; x.lineWidth = 4; const n = mar ? 2 : 4; for (let i = 0; i <= n; i++) { x.beginPath(); x.moveTo((i * w) / n, 0); x.lineTo((i * w) / n, h); x.stroke(); x.beginPath(); x.moveTo(0, (i * h) / n); x.lineTo(w, (i * h) / n); x.stroke(); } }), null, false);
    } else if (name === "stone") {
      const draw = (bw) => canvas(256, 256, (x, w, h) => {
        x.fillStyle = bw ? "#333" : "#8e8a83"; x.fillRect(0, 0, w, h);
        for (let i = 0; i < 26; i++) { const v = Math.random(); x.fillStyle = bw ? "#bbb" : `rgb(${150 + v * 50 | 0},${146 + v * 46 | 0},${138 + v * 40 | 0})`; x.beginPath(); const cx = Math.random() * w, cy = Math.random() * h, r = rand(18, 34); for (let k = 0; k < 7; k++) { const a = (k / 7) * 6.28; x.lineTo(cx + Math.cos(a) * r * rand(0.75, 1.1), cy + Math.sin(a) * r * rand(0.75, 1.1)); } x.fill(); }
      });
      color = tex(draw(false)); bump = tex(draw(true), null, false);
    } else if (name === "roof") {
      const draw = (bw) => canvas(256, 256, (x, w, h) => {
        x.fillStyle = bw ? "#222" : "#6d2a1c"; x.fillRect(0, 0, w, h);
        for (let r = 0; r < 8; r++) for (let k = -1; k < 9; k++) {
          const v = Math.random(), ox = k * 32 + (r % 2 ? 16 : 0);
          const g = x.createLinearGradient(0, r * 32, 0, r * 32 + 32);
          if (bw) { g.addColorStop(0, "#fff"); g.addColorStop(1, "#444"); } else { g.addColorStop(0, `rgb(${190 + v * 30 | 0},${82 + v * 20 | 0},${52 + v * 10 | 0})`); g.addColorStop(1, `rgb(${120 + v * 20 | 0},${45 + v * 10 | 0},${30 | 0})`); }
          x.fillStyle = g; x.beginPath(); x.ellipse(ox + 16, r * 32 + 14, 15, 18, 0, 0, Math.PI); x.fill(); x.fillRect(ox + 1, r * 32, 30, 14);
        }
      });
      color = tex(draw(false)); bump = tex(draw(true), null, false);
    } else if (name === "fabric") {
      color = tex(canvas(128, 128, (x, w, h) => { x.fillStyle = "#e9e6e0"; x.fillRect(0, 0, w, h); for (let i = 0; i < h; i += 2) { x.fillStyle = `rgba(0,0,0,${0.03 + Math.random() * 0.03})`; x.fillRect(0, i, w, 1); } for (let i = 0; i < w; i += 2) { x.fillStyle = "rgba(0,0,0,.03)"; x.fillRect(i, 0, 1, h); } }));
      bump = tex(canvas(64, 64, (x, w, h) => { x.fillStyle = "#888"; x.fillRect(0, 0, w, h); noise(x, w, h, 2000, 0.5); }), null, false);
    } else if (name === "concrete") {
      color = tex(canvas(256, 256, (x, w, h) => { x.fillStyle = "#b9b6b0"; x.fillRect(0, 0, w, h); noise(x, w, h, 9000, 0.1); noise(x, w, h, 3000, 0.08, "255,255,255"); }));
      bump = tex(canvas(128, 128, (x, w, h) => { x.fillStyle = "#888"; x.fillRect(0, 0, w, h); noise(x, w, h, 4000, 0.5); }), null, false);
    } else if (name === "grass") {
      color = tex(canvas(256, 256, (x, w, h) => {
        x.fillStyle = "#5b8f37"; x.fillRect(0, 0, w, h);
        for (let i = 0; i < 4200; i++) { const g = 100 + Math.random() * 80 | 0; x.strokeStyle = `rgba(${45 + Math.random() * 40 | 0},${g},${28 + Math.random() * 30 | 0},.6)`; x.lineWidth = 1; const px = Math.random() * w, py = Math.random() * h; x.beginPath(); x.moveTo(px, py); x.lineTo(px + rand(-2, 2), py - rand(2, 6)); x.stroke(); }
      }), [40, 40]);
    } else if (name === "suzani") {
      color = tex(canvas(256, 256, (x, w, h) => {
        x.fillStyle = "#8f1d22"; x.fillRect(0, 0, w, h);
        x.strokeStyle = "#e8c36a"; x.lineWidth = 6; x.strokeRect(10, 10, w - 20, h - 20);
        x.strokeStyle = "#1f3f7a"; x.lineWidth = 4; x.strokeRect(24, 24, w - 48, h - 48);
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const cx = 64 + i * 64, cy = 64 + j * 64; x.fillStyle = (i + j) % 2 ? "#e8c36a" : "#f3efe2"; x.beginPath(); for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.28, r = k % 2 ? 10 : 24; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.fill(); x.fillStyle = "#1f3f7a"; x.beginPath(); x.arc(cx, cy, 6, 0, 7); x.fill(); }
      }));
    }
    TEX[name] = { color, bump };
    return TEX[name];
  }

  // ===================== MATERIALLAR =====================
  // Bo'yash ranglari (bolalar tanlaydi)
  const PALETTE = [0xf2efe9, 0xe8d8b8, 0xc9a27a, 0x9c6b43, 0x5b3a26, 0x2f2f33, 0x8aa1b8, 0x3f6e9e, 0x5f8f5a, 0xb84a3a, 0xe0a23a, 0xd98aa8];
  const MATS = {};
  function mat(kind, color, opt = {}) {
    const key = kind + "|" + color + "|" + (opt.rep || "") + "|" + (opt.key || "");
    if (MATS[key]) return MATS[key];
    let m;
    const texKinds = { brick: 1, plaster: 1, wood: 1, planks: 1, parquet: 1, tiles: 1, marble: 1, stone: 1, roof: 1, fabric: 1, concrete: 1, suzani: 1 };
    if (texKinds[kind]) {
      const tx = getTex(kind);
      let map = tx.color, bump = tx.bump;
      if (opt.rep) { map = map.clone(); map.repeat.set(opt.rep[0], opt.rep[1]); map.needsUpdate = true; if (bump) { bump = bump.clone(); bump.repeat.copy(map.repeat); bump.needsUpdate = true; } }
      const rough = { brick: 0.92, plaster: 0.95, wood: 0.6, planks: 0.75, parquet: 0.45, tiles: 0.25, marble: 0.15, stone: 0.95, roof: 0.75, fabric: 1, concrete: 0.9, suzani: 0.95 }[kind];
      m = new T.MeshStandardMaterial({ map, bumpMap: bump || null, bumpScale: kind === "brick" ? 0.04 : kind === "roof" ? 0.05 : 0.015, roughness: rough, color: color ?? 0xffffff });
    } else if (kind === "glass") {
      m = new T.MeshStandardMaterial({ color: 0xbfd8e6, roughness: 0.04, metalness: 0.15, transparent: true, opacity: 0.28, envMapIntensity: 1.6, depthWrite: false });
    } else if (kind === "water") {
      m = new T.MeshStandardMaterial({ color: 0x2b8fc7, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.82, envMapIntensity: 1.4 });
    } else if (kind === "metal") {
      m = new T.MeshStandardMaterial({ color: color ?? 0xb8bcc2, roughness: 0.3, metalness: 0.85 });
    } else if (kind === "glow") {
      m = new T.MeshStandardMaterial({ color: 0xfff3d6, emissive: 0xffd68a, emissiveIntensity: 0.4, roughness: 0.5 });
      m.userData.glow = true;
    } else if (kind === "screen") {
      m = new T.MeshStandardMaterial({ color: 0x0a0d12, roughness: 0.15, metalness: 0.3, emissive: 0x1d3b6e, emissiveIntensity: 0.35 });
    } else if (kind === "leaf") {
      m = new T.MeshStandardMaterial({ color: color ?? 0x3f7d35, roughness: 0.85 });
    } else if (kind === "plastic") {
      m = new T.MeshStandardMaterial({ color: color ?? 0xffffff, roughness: 0.35, metalness: 0.05 });
    } else if (kind === "ceramic") {
      m = new T.MeshStandardMaterial({ color: color ?? 0xf7f7f5, roughness: 0.12, metalness: 0.02 });
    } else if (kind === "clay") {
      m = new T.MeshStandardMaterial({ color: color ?? 0xb7774a, roughness: 0.95 });
    } else m = new T.MeshStandardMaterial({ color: color ?? 0xffffff, roughness: opt.rough ?? 0.7, metalness: opt.metal ?? 0 });
    MATS[key] = m;
    return m;
  }

  // ===================== GEOMETRIYA YORDAMCHILARI =====================
  const GEO = {};
  const boxG = (w, h, d) => GEO["b" + w + "_" + h + "_" + d] || (GEO["b" + w + "_" + h + "_" + d] = new T.BoxGeometry(w, h, d));
  function rboxG(w, h, d, r) {
    const k = "r" + w + "_" + h + "_" + d + "_" + r;
    if (GEO[k]) return GEO[k];
    r = Math.min(r, w / 2 - 0.001, d / 2 - 0.001, h / 2 - 0.001);
    const s = new T.Shape(), x0 = -w / 2 + r, z0 = -d / 2 + r, x1 = w / 2 - r, z1 = d / 2 - r;
    s.moveTo(x0, -d / 2); s.lineTo(x1, -d / 2); s.quadraticCurveTo(w / 2, -d / 2, w / 2, z0); s.lineTo(w / 2, z1); s.quadraticCurveTo(w / 2, d / 2, x1, d / 2);
    s.lineTo(x0, d / 2); s.quadraticCurveTo(-w / 2, d / 2, -w / 2, z1); s.lineTo(-w / 2, z0); s.quadraticCurveTo(-w / 2, -d / 2, x0, -d / 2);
    const g = new T.ExtrudeGeometry(s, { depth: h - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.98, bevelSegments: 3, curveSegments: 4 });
    g.rotateX(-Math.PI / 2); g.translate(0, -h / 2 + r, 0);
    g.computeVertexNormals();
    return (GEO[k] = g);
  }
  const cylG = (rt, rb, h, s = 16) => GEO["c" + rt + "_" + rb + "_" + h + "_" + s] || (GEO["c" + rt + "_" + rb + "_" + h + "_" + s] = new T.CylinderGeometry(rt, rb, h, s));
  const sphG = (r, s = 16) => GEO["s" + r + "_" + s] || (GEO["s" + r + "_" + s] = new T.SphereGeometry(r, s, Math.max(6, s * 0.7 | 0)));
  function add(g, geo, m, x = 0, y = 0, z = 0, shadow = true) {
    const o = new T.Mesh(geo, m); o.position.set(x, y, z);
    o.castShadow = shadow; o.receiveShadow = true;
    g.add(o); return o;
  }
  // y — pastki sath (box markazini emas, ostini beramiz)
  const B = (g, w, h, d, m, x, y, z) => add(g, boxG(w, h, d), m, x, y + h / 2, z);
  const RB = (g, w, h, d, r, m, x, y, z) => add(g, rboxG(w, h, d, r), m, x, y + h / 2, z);
  const C = (g, rt, rb, h, m, x, y, z, s) => add(g, cylG(rt, rb, h, s), m, x, y + h / 2, z);
  const S = (g, r, m, x, y, z, s) => add(g, sphG(r, s), m, x, y, z);
  function lumpyG(r, d, amt) {
    const k = "l" + r + d + amt + (Math.random() * 3 | 0);
    if (GEO[k]) return GEO[k];
    const geo = new T.IcosahedronGeometry(r, d), p = geo.attributes.position, v = new T.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + (Math.random() - 0.5) * amt); p.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals();
    return (GEO[k] = geo);
  }
  const col = (c, def) => (c != null && c >= 0 ? PALETTE[c] : def);

  // ===================== DEVOR TURLARI =====================
  // Devor x o'qi bo'ylab -0.5..0.5, z=0 da, qalinligi 0.2, balandligi H
  const WT = 0.2;
  function wallBody(g, m, h = H) {
    B(g, 1, h, WT, m, 0, 0, 0);
    // burchaklar yopiladi: har uchida ustuncha
    [-0.5, 0.5].forEach((x) => B(g, WT, h, WT, m, x, 0, 0));
  }
  function wallWithHole(g, m, hx0, hx1, hy0, hy1) {
    // teshik: x [hx0,hx1], y [hy0,hy1]
    const L = -0.5, R = 0.5;
    if (hx0 > L) B(g, hx0 - L, H, WT, m, (L + hx0) / 2, 0, 0);
    if (hx1 < R) B(g, R - hx1, H, WT, m, (hx1 + R) / 2, 0, 0);
    if (hy0 > 0) B(g, hx1 - hx0, hy0, WT, m, (hx0 + hx1) / 2, 0, 0);
    B(g, hx1 - hx0, H - hy1, WT, m, (hx0 + hx1) / 2, hy1, 0);
    [-0.5, 0.5].forEach((x) => B(g, WT, H, WT, m, x, 0, 0));
  }
  function windowFrame(g, x0, x1, y0, y1, frameC = 0xf6f6f4) {
    const fm = mat("plastic", frameC), w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, t = 0.06;
    B(g, w, t, WT + 0.04, fm, cx, y0, 0); B(g, w, t, WT + 0.04, fm, cx, y1 - t, 0);
    B(g, t, h, WT + 0.04, fm, x0 + t / 2, y0, 0); B(g, t, h, WT + 0.04, fm, x1 - t / 2, y0, 0);
    B(g, 0.04, h, 0.05, fm, cx, y0, 0);
    add(g, boxG(w - 0.08, h - 0.08, 0.02), mat("glass"), cx, y0 + h / 2, 0, false).userData.glass = true;
    // deraza tokchasi
    B(g, w + 0.12, 0.04, WT + 0.16, mat("marble", 0xffffff), cx, y0 - 0.04, 0);
  }

  // ===================== KATALOG =====================
  // layer: wall | floor | obj | rug | roof ; size: [w, d] katak
  const CAT = [];
  const item = (o) => { CAT.push(o); return o; };
  const WALL_MAT = { devor_gisht: ["brick", 0xffffff], devor_suvoq: ["plaster", null], devor_yogoch: ["planks", 0xffffff] };

  // ---------- QURILISH ----------
  item({ id: "devor_suvoq", cat: "qurilish", name: "Suvoq devor", icon: "⬜", layer: "wall", paint: 0, build: (c) => { const g = new T.Group(); wallBody(g, mat("plaster", col(c, 0xf2efe9), { rep: [1, 3] })); return g; } });
  item({ id: "devor_gisht", cat: "qurilish", name: "G‘isht devor", icon: "🧱", layer: "wall", build: () => { const g = new T.Group(); wallBody(g, mat("brick", 0xffffff, { rep: [1.2, 3.4] })); return g; } });
  item({ id: "devor_yogoch", cat: "qurilish", name: "Yog‘och devor", icon: "🪵", layer: "wall", build: () => { const g = new T.Group(); wallBody(g, mat("planks", 0xffffff, { rep: [1, 2.5] })); return g; } });
  item({ id: "deraza", cat: "qurilish", name: "Derazali devor", icon: "🪟", layer: "wall", paint: 0, build: (c) => { const g = new T.Group(); wallWithHole(g, mat("plaster", col(c, 0xf2efe9), { rep: [1, 3] }), -0.36, 0.36, 0.9, 2.2); windowFrame(g, -0.36, 0.36, 0.9, 2.2); return g; } });
  item({ id: "deraza_gisht", cat: "qurilish", name: "G‘isht + deraza", icon: "🏠", layer: "wall", build: () => { const g = new T.Group(); wallWithHole(g, mat("brick", 0xffffff, { rep: [1.2, 3.4] }), -0.36, 0.36, 0.9, 2.2); windowFrame(g, -0.36, 0.36, 0.9, 2.2); return g; } });
  item({ id: "vitraj", cat: "qurilish", name: "Katta oyna", icon: "🔲", layer: "wall", build: () => { const g = new T.Group(); const fm = mat("metal", 0x2b2d31); B(g, 1, 0.08, WT, fm, 0, 0, 0); B(g, 1, 0.08, WT, fm, 0, H - 0.08, 0); [-0.5, 0, 0.5].forEach((x) => B(g, 0.06, H, WT, fm, x, 0, 0)); B(g, 1, 0.05, 0.08, fm, 0, 1.1, 0); add(g, boxG(0.96, H - 0.16, 0.02), mat("glass"), 0, H / 2, 0, false).userData.glass = true; return g; } });
  item({ id: "eshik", cat: "qurilish", name: "Eshikli devor", icon: "🚪", layer: "wall", pass: true, paint: 0, build: (c) => {
    const g = new T.Group(); wallWithHole(g, mat("plaster", col(c, 0xf2efe9), { rep: [1, 3] }), -0.42, 0.42, 0, 2.15);
    const wd = mat("wood", 0x8a5a36), fm = mat("plastic", 0xf4f2ee);
    B(g, 0.06, 2.15, WT + 0.04, fm, -0.42, 0, 0); B(g, 0.06, 2.15, WT + 0.04, fm, 0.42, 0, 0); B(g, 0.9, 0.06, WT + 0.04, fm, 0, 2.12, 0);
    const door = new T.Group(); door.position.set(-0.38, 0, 0.05); door.rotation.y = -1.15; g.add(door);
    B(door, 0.76, 2.08, 0.04, wd, 0.38, 0.02, 0);
    [0.5, 1.3].forEach((y) => B(door, 0.6, 0.5, 0.012, wd, 0.38, y, 0.024));
    S(door, 0.035, mat("metal", 0xd6b25a), 0.7, 1.0, 0.05);
    return g; } });
  item({ id: "eshik_kirish", cat: "qurilish", name: "Kirish eshigi", icon: "🏛️", layer: "wall", pass: true, build: () => {
    const g = new T.Group(); wallWithHole(g, mat("brick", 0xffffff, { rep: [1.2, 3.4] }), -0.44, 0.44, 0, 2.3);
    const wd = mat("wood", 0x5a3520);
    B(g, 0.88, 2.28, 0.06, wd, 0, 0, 0);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) RB(g, 0.32, 0.58, 0.02, 0.01, wd, -0.2 + j * 0.4, 0.2 + i * 0.7, 0.04);
    C(g, 0.03, 0.03, 0.25, mat("metal", 0xd6b25a), 0.33, 0.95, 0.07, 8);
    B(g, 1.0, 0.1, 0.36, mat("stone", 0xffffff), 0, 2.3, 0.12);
    return g; } });
  item({ id: "past_devor", cat: "qurilish", name: "Past devor", icon: "▬", layer: "wall", paint: 0, low: true, build: (c) => { const g = new T.Group(); const m = mat("plaster", col(c, 0xe8d8b8), { rep: [1, 1] }); B(g, 1, 1, WT, m, 0, 0, 0); [-0.5, 0.5].forEach((x) => B(g, WT, 1, WT, m, x, 0, 0)); B(g, 1.04, 0.06, WT + 0.08, mat("stone", 0xffffff), 0, 1, 0); return g; } });
  item({ id: "panjara", cat: "qurilish", name: "Panjara", icon: "🚧", layer: "wall", paint: 3, low: true, build: (c) => { const g = new T.Group(); const m = mat("wood", col(c, 0x9c6b43)); [-0.5, 0.5].forEach((x) => B(g, 0.1, 1.1, 0.1, m, x, 0, 0)); [0.35, 0.8].forEach((y) => B(g, 1, 0.08, 0.04, m, 0, y, 0.04)); for (let i = 0; i < 5; i++) B(g, 0.1, 1.0, 0.025, m, -0.4 + i * 0.2, 0, 0.07); return g; } });
  item({ id: "darvoza", cat: "qurilish", name: "Darvoza", icon: "⛩️", layer: "wall", pass: true, low: true, build: () => { const g = new T.Group(); const m = mat("metal", 0x2f3135); [-0.5, 0.5].forEach((x) => B(g, 0.12, 1.9, 0.12, mat("brick", 0xffffff), x, 0, 0)); B(g, 0.88, 0.05, 0.04, m, 0, 0.15, 0); B(g, 0.88, 0.05, 0.04, m, 0, 1.55, 0); for (let i = 0; i < 9; i++) { C(g, 0.012, 0.012, 1.45, m, -0.4 + i * 0.1, 0.15, 0, 6); S(g, 0.025, mat("metal", 0xd6b25a), -0.4 + i * 0.1, 1.64, 0, 6); } return g; } });
  item({ id: "pol_parket", cat: "qurilish", name: "Parket pol", icon: "🟫", layer: "floor", size: [1, 1], build: () => floorTile(mat("parquet", 0xffffff, { rep: [0.5, 0.5] })) });
  item({ id: "pol_plitka", cat: "qurilish", name: "Plitka pol", icon: "◻️", layer: "floor", size: [1, 1], paint: 0, build: (c) => floorTile(mat("tiles", col(c, 0xffffff), { rep: [1, 1] })) });
  item({ id: "pol_marmar", cat: "qurilish", name: "Marmar pol", icon: "💠", layer: "floor", size: [1, 1], build: () => floorTile(mat("marble", 0xffffff, { rep: [0.5, 0.5] })) });
  item({ id: "pol_beton", cat: "qurilish", name: "Beton pol", icon: "⬛", layer: "floor", size: [1, 1], build: () => floorTile(mat("concrete", 0xffffff, { rep: [0.5, 0.5] })) });
  item({ id: "tom", cat: "qurilish", name: "Tekis tom", icon: "🟧", layer: "roof", size: [1, 1], build: () => { const g = new T.Group(); B(g, 1.02, 0.22, 1.02, mat("concrete", 0xd9d4cc, { rep: [0.5, 0.5] }), 0, 0, 0); return g; } });
  // Qiya tom: har katak — belgi; sahna barcha tom kataklaridan bitta nishabli (to'rt qiyali) tom yig'adi
  let PICK_MAT = null;
  item({ id: "qiya_tom", cat: "qurilish", name: "Qiya tom", icon: "🔺", layer: "roof", size: [1, 1], autoRoof: true, build: () => {
    const g = new T.Group();
    if (!PICK_MAT) PICK_MAT = new T.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
    const m = add(g, boxG(1, 0.4, 1), PICK_MAT, 0, 0.2, 0, false); m.receiveShadow = false; m.userData.pick = true;
    return g; } });
  item({ id: "ustun", cat: "qurilish", name: "Ustun", icon: "🏛", layer: "obj", size: [1, 1], build: () => { const g = new T.Group(); const m = mat("marble", 0xffffff, { rep: [0.3, 1.5] }); B(g, 0.46, 0.12, 0.46, m, 0, 0, 0); C(g, 0.17, 0.19, H - 0.26, m, 0, 0.12, 0, 20); B(g, 0.46, 0.14, 0.46, m, 0, H - 0.14, 0); return g; } });
  item({ id: "zina", cat: "qurilish", name: "Zinapoya", icon: "🪜", layer: "obj", size: [1, 3], build: () => {
    const g = new T.Group(); const m = mat("wood", 0x9c6b43), s = mat("plaster", 0xf2efe9);
    const n = 14;
    for (let i = 0; i < n; i++) { const y = (i * H) / n, z = 1.4 - (i * 2.8) / n; B(g, 0.94, 0.05, 0.24, m, 0, y + H / n - 0.05, z - 0.1); B(g, 0.9, H / n, 0.02, s, 0, y, z + 0.02); }
    const rail = mat("metal", 0x2f3135);
    for (let i = 0; i < 6; i++) { const t = i / 5; C(g, 0.015, 0.015, 0.9, rail, 0.45, t * H * 0.93, 1.35 - t * 2.75, 6); }
    const hr = add(g, cylG(0.03, 0.03, Math.hypot(H, 2.75), 8), mat("wood", 0x5b3a26), 0.45, H / 2 + 0.88, 0); hr.rotation.x = -Math.atan2(2.75, H);
    return g; } });

  function floorTile(m) { const g = new T.Group(); const t = add(g, boxG(1, BASE, 1), m, 0, BASE / 2, 0, false); t.receiveShadow = true; return g; }

  // ---------- MEBEL ----------
  item({ id: "stul", cat: "mebel", name: "Stul", icon: "🪑", layer: "obj", size: [1, 1], paint: 3, build: (c) => {
    const g = new T.Group(), w = mat("wood", col(c, 0x9c6b43)), f = mat("fabric", 0x8a3b2e);
    [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].forEach(([x, z]) => B(g, 0.05, 0.45, 0.05, w, x, 0, z));
    RB(g, 0.46, 0.06, 0.46, 0.02, w, 0, 0.45, 0); RB(g, 0.42, 0.05, 0.4, 0.02, f, 0, 0.5, 0.01);
    [-0.19, 0.19].forEach((x) => B(g, 0.05, 0.5, 0.05, w, x, 0.5, -0.19));
    RB(g, 0.44, 0.22, 0.04, 0.015, w, 0, 0.74, -0.2);
    return g; } });
  item({ id: "stol", cat: "mebel", name: "Stol", icon: "🍽️", layer: "obj", size: [2, 1], paint: 3, build: (c) => {
    const g = new T.Group(), w = mat("wood", col(c, 0x9c6b43));
    RB(g, 1.6, 0.05, 0.85, 0.02, w, 0, 0.72, 0);
    [[-0.72, -0.35], [0.72, -0.35], [-0.72, 0.35], [0.72, 0.35]].forEach(([x, z]) => C(g, 0.03, 0.025, 0.72, w, x, 0, z, 10));
    B(g, 1.4, 0.07, 0.04, w, 0, 0.64, -0.35); B(g, 1.4, 0.07, 0.04, w, 0, 0.64, 0.35);
    C(g, 0.12, 0.08, 0.06, mat("ceramic", 0xffffff), 0.2, 0.77, 0, 16); S(g, 0.05, mat("plastic", 0xd94a3a), 0.2, 0.86, 0, 10); S(g, 0.045, mat("plastic", 0xe8b02a), 0.27, 0.85, 0.05, 10);
    return g; } });
  item({ id: "divan", cat: "mebel", name: "Divan", icon: "🛋️", layer: "obj", size: [2, 1], paint: 7, build: (c) => {
    const g = new T.Group(), f = mat("fabric", col(c, 0x3f6e9e)), leg = mat("wood", 0x3b2618);
    RB(g, 1.9, 0.32, 0.86, 0.06, f, 0, 0.1, 0.02);
    [-0.45, 0.45].forEach((x) => RB(g, 0.9, 0.14, 0.66, 0.06, f, x, 0.4, 0.08));
    RB(g, 1.9, 0.5, 0.2, 0.08, f, 0, 0.36, -0.34);
    [-0.88, 0.88].forEach((x) => RB(g, 0.16, 0.42, 0.86, 0.07, f, x, 0.1, 0.02));
    [[-0.85, -0.35], [0.85, -0.35], [-0.85, 0.38], [0.85, 0.38]].forEach(([x, z]) => C(g, 0.025, 0.02, 0.1, leg, x, 0, z, 8));
    RB(g, 0.36, 0.34, 0.12, 0.05, mat("fabric", 0xe0a23a), -0.6, 0.5, -0.18).rotation.x = -0.2;
    return g; } });
  item({ id: "kreslo", cat: "mebel", name: "Kreslo", icon: "💺", layer: "obj", size: [1, 1], paint: 9, build: (c) => {
    const g = new T.Group(), f = mat("fabric", col(c, 0xb84a3a)), leg = mat("wood", 0x3b2618);
    RB(g, 0.8, 0.3, 0.8, 0.06, f, 0, 0.12, 0); RB(g, 0.58, 0.12, 0.6, 0.05, f, 0, 0.42, 0.06);
    RB(g, 0.8, 0.5, 0.18, 0.07, f, 0, 0.38, -0.31); [-0.33, 0.33].forEach((x) => RB(g, 0.14, 0.34, 0.8, 0.06, f, x, 0.36, 0));
    [[-0.33, -0.33], [0.33, -0.33], [-0.33, 0.33], [0.33, 0.33]].forEach(([x, z]) => C(g, 0.02, 0.015, 0.12, leg, x, 0, z, 8));
    return g; } });
  item({ id: "karavot", cat: "mebel", name: "Karavot", icon: "🛏️", layer: "obj", size: [2, 2], paint: 0, build: (c) => {
    const g = new T.Group(), w = mat("wood", 0x7a4e30), sheet = mat("fabric", 0xf6f4ef), blanket = mat("fabric", col(c, 0x8aa1b8));
    RB(g, 1.6, 0.3, 2.0, 0.03, w, 0, 0.1, 0.0); RB(g, 1.66, 0.95, 0.08, 0.03, w, 0, 0, -1.0);
    RB(g, 1.5, 0.22, 1.9, 0.08, sheet, 0, 0.38, 0.02);
    RB(g, 1.54, 0.08, 1.35, 0.04, blanket, 0, 0.58, 0.3);
    [-0.38, 0.38].forEach((x) => RB(g, 0.62, 0.14, 0.34, 0.07, sheet, x, 0.6, -0.72));
    [[-0.75, 0.95], [0.75, 0.95]].forEach(([x, z]) => B(g, 0.06, 0.1, 0.06, w, x, 0, z));
    return g; } });
  item({ id: "shkaf", cat: "mebel", name: "Shkaf", icon: "🚪", layer: "obj", size: [1, 1], paint: 1, build: (c) => {
    const g = new T.Group(), w = mat("wood", col(c, 0xe8d8b8));
    RB(g, 0.96, 2.2, 0.58, 0.01, w, 0, 0.05, -0.2); B(g, 0.96, 0.05, 0.56, mat("wood", 0x3b2618), 0, 0, -0.2);
    B(g, 0.008, 2.1, 0.01, mat("plastic", 0x222222), 0, 0.1, 0.095);
    [-0.06, 0.06].forEach((x) => C(g, 0.012, 0.012, 0.25, mat("metal", 0xc0c0c0), x, 1.0, 0.11, 8));
    return g; } });
  item({ id: "javon", cat: "mebel", name: "Kitob javoni", icon: "📚", layer: "obj", size: [1, 1], paint: 3, build: (c) => {
    const g = new T.Group(), w = mat("wood", col(c, 0x9c6b43));
    B(g, 0.04, 1.9, 0.34, w, -0.46, 0, -0.3); B(g, 0.04, 1.9, 0.34, w, 0.46, 0, -0.3); B(g, 0.96, 1.9, 0.02, w, 0, 0, -0.46);
    const books = [0xb84a3a, 0x3f6e9e, 0x5f8f5a, 0xe0a23a, 0x2f2f33, 0xd98aa8, 0xe8d8b8];
    for (let s = 0; s < 5; s++) {
      B(g, 0.9, 0.03, 0.34, w, 0, s * 0.45, -0.3);
      if (s < 4) { let x = -0.42; while (x < 0.36) { const bw = rand(0.03, 0.07), bh = rand(0.25, 0.36); B(g, bw, bh, rand(0.2, 0.26), mat("plastic", books[Math.random() * books.length | 0]), x + bw / 2, s * 0.45 + 0.03, -0.32); x += bw + 0.004; } }
    }
    return g; } });
  item({ id: "tv", cat: "mebel", name: "Televizor", icon: "📺", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(), w = mat("wood", 0x2f2f33);
    RB(g, 0.98, 0.45, 0.45, 0.02, w, 0, 0.04, -0.22); B(g, 0.98, 0.04, 0.45, mat("metal", 0x1b1b1e), 0, 0, -0.22);
    B(g, 0.2, 0.03, 0.18, mat("metal", 0x1b1b1e), 0, 0.49, -0.25); B(g, 0.04, 0.16, 0.04, mat("metal", 0x1b1b1e), 0, 0.5, -0.27);
    RB(g, 0.96, 0.56, 0.04, 0.01, mat("plastic", 0x111114), 0, 0.62, -0.27);
    add(g, boxG(0.92, 0.52, 0.005), mat("screen"), 0, 0.9, -0.248, false);
    return g; } });
  item({ id: "gilam", cat: "mebel", name: "Gilam", icon: "🧶", layer: "rug", size: [2, 2], build: () => { const g = new T.Group(); add(g, boxG(1.9, 0.015, 1.9), mat("suzani", 0xffffff), 0, BASE + 0.008, 0, false); return g; } });
  item({ id: "xontaxta", cat: "mebel", name: "Xontaxta + ko‘rpacha", icon: "🫖", layer: "obj", size: [2, 2], build: () => {
    const g = new T.Group(), w = mat("wood", 0x7a4e30);
    RB(g, 1.1, 0.04, 0.8, 0.02, w, 0, 0.32, 0);
    [[-0.5, -0.35], [0.5, -0.35], [-0.5, 0.35], [0.5, 0.35]].forEach(([x, z]) => B(g, 0.05, 0.32, 0.05, w, x, 0, z));
    add(g, boxG(1.15, 0.005, 0.85), mat("suzani", 0xffffff), 0, 0.365, 0, false);
    C(g, 0.08, 0.06, 0.12, mat("ceramic", 0x2f6fb5), -0.15, 0.36, 0.05, 16); S(g, 0.04, mat("ceramic", 0x2f6fb5), -0.15, 0.5, 0.05, 10);
    [[0.18, 0.1], [0.28, -0.1], [0.05, -0.15]].forEach(([x, z]) => C(g, 0.035, 0.03, 0.05, mat("ceramic", 0x2f6fb5), x, 0.36, z, 12));
    C(g, 0.12, 0.12, 0.03, mat("clay", 0xd9a35a), 0.35, 0.36, 0.2, 18);
    const k = mat("fabric", 0x8f1d22), k2 = mat("fabric", 0x1f3f7a);
    [[0, -0.75, 1.6, 0.45], [0, 0.75, 1.6, 0.45]].forEach(([x, z, lw, ld], i) => RB(g, lw, 0.08, ld, 0.03, i ? k2 : k, x, 0, z));
    [[-0.78, 0, 0.45, 1.1], [0.78, 0, 0.45, 1.1]].forEach(([x, z, lw, ld], i) => RB(g, lw, 0.08, ld, 0.03, i ? k : k2, x, 0, z));
    [[-0.5, -0.9], [0.5, -0.9]].forEach(([x, z]) => RB(g, 0.4, 0.22, 0.14, 0.06, mat("fabric", 0xe8c36a), x, 0.08, z));
    return g; } });
  item({ id: "lampa", cat: "mebel", name: "Torsher", icon: "💡", layer: "obj", size: [1, 1], light: 1.95, build: () => {
    const g = new T.Group(), m = mat("metal", 0x2a2a2e);
    C(g, 0.16, 0.18, 0.03, m, 0, 0, 0, 20); C(g, 0.012, 0.012, 1.6, m, 0, 0.03, 0, 8);
    C(g, 0.13, 0.22, 0.3, mat("glow"), 0, 1.6, 0, 20).userData.lamp = true;
    return g; } });
  item({ id: "plita", cat: "mebel", name: "Gaz plita", icon: "🍳", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(); RB(g, 0.6, 0.86, 0.6, 0.02, mat("ceramic", 0xf3f3f1), 0, 0, -0.18);
    B(g, 0.6, 0.02, 0.6, mat("metal", 0x1d1d20), 0, 0.86, -0.18);
    [[-0.14, -0.32], [0.14, -0.32], [-0.14, -0.04], [0.14, -0.04]].forEach(([x, z]) => C(g, 0.07, 0.07, 0.02, mat("metal", 0x3a3a3e), x, 0.88, z, 16));
    B(g, 0.48, 0.32, 0.01, mat("glass"), 0, 0.3, 0.125);
    [-0.2, -0.07, 0.07, 0.2].forEach((x) => C(g, 0.02, 0.02, 0.03, mat("metal", 0xbbbbbb), x, 0.74, 0.13, 10).rotation.x = Math.PI / 2);
    return g; } });
  item({ id: "muzlatgich", cat: "mebel", name: "Muzlatgich", icon: "🧊", layer: "obj", size: [1, 1], paint: 0, build: (c) => {
    const g = new T.Group(), m = mat("ceramic", col(c, 0xf3f3f1));
    RB(g, 0.7, 1.85, 0.66, 0.04, m, 0, 0.02, -0.15); B(g, 0.69, 0.008, 0.02, mat("plastic", 0x999999), 0, 1.25, 0.18);
    [0.7, 1.45].forEach((y) => B(g, 0.03, 0.4, 0.04, mat("metal", 0xbfc3c8), 0.27, y, 0.2));
    return g; } });
  item({ id: "oshxona", cat: "mebel", name: "Oshxona javoni", icon: "🗄️", layer: "obj", size: [1, 1], paint: 0, build: (c) => {
    const g = new T.Group(), m = mat("wood", col(c, 0xf2efe9));
    RB(g, 0.98, 0.84, 0.6, 0.01, m, 0, 0.04, -0.18); B(g, 1.0, 0.04, 0.64, mat("marble", 0xffffff), 0, 0.88, -0.18);
    B(g, 0.004, 0.76, 0.01, mat("plastic", 0x555555), 0, 0.08, 0.125);
    [-0.06, 0.06].forEach((x) => B(g, 0.02, 0.12, 0.02, mat("metal", 0xbfc3c8), x, 0.6, 0.135));
    RB(g, 0.98, 0.7, 0.34, 0.01, m, 0, 1.55, -0.32);
    return g; } });
  item({ id: "lavabo", cat: "mebel", name: "Qo‘l yuvgich", icon: "🚰", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(); RB(g, 0.6, 0.76, 0.45, 0.02, mat("wood", 0xe8d8b8), 0, 0.04, -0.25);
    RB(g, 0.62, 0.12, 0.48, 0.05, mat("ceramic"), 0, 0.8, -0.25); C(g, 0.02, 0.02, 0.2, mat("metal", 0xd8dce0), 0, 0.92, -0.42, 10);
    add(g, boxG(0.5, 0.7, 0.02), mat("glass", null), 0, 1.5, -0.48, false).userData.glass = true; B(g, 0.54, 0.74, 0.01, mat("metal", 0x9aa3ad), 0, 1.13, -0.495);
    return g; } });
  item({ id: "vanna", cat: "mebel", name: "Vanna", icon: "🛁", layer: "obj", size: [2, 1], build: () => {
    const g = new T.Group(), m = mat("ceramic");
    RB(g, 1.7, 0.55, 0.78, 0.12, m, 0, 0, 0); RB(g, 1.5, 0.1, 0.58, 0.08, mat("water"), 0, 0.42, 0);
    C(g, 0.025, 0.025, 0.25, mat("metal", 0xd8dce0), -0.75, 0.55, 0, 10);
    return g; } });
  item({ id: "kompyuter", cat: "mebel", name: "Kompyuter stoli", icon: "💻", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(), w = mat("wood", 0xe8d8b8), d = mat("plastic", 0x1b1b1e);
    RB(g, 0.98, 0.04, 0.6, 0.01, w, 0, 0.72, -0.18); [-0.46, 0.46].forEach((x) => B(g, 0.04, 0.72, 0.58, w, x, 0, -0.18));
    B(g, 0.5, 0.3, 0.02, d, 0, 0.88, -0.38); add(g, boxG(0.47, 0.27, 0.004), mat("screen"), 0, 1.03, -0.368, false); B(g, 0.12, 0.12, 0.02, d, 0, 0.76, -0.38);
    B(g, 0.38, 0.015, 0.13, d, 0, 0.76, -0.12); B(g, 0.06, 0.02, 0.1, d, 0.28, 0.76, -0.12);
    return g; } });
  item({ id: "pianino", cat: "mebel", name: "Pianino", icon: "🎹", layer: "obj", size: [2, 1], build: () => {
    const g = new T.Group(), m = mat("plastic", 0x121214);
    m.roughness = 0.12;
    RB(g, 1.5, 1.25, 0.5, 0.02, m, 0, 0, -0.2); RB(g, 1.5, 0.08, 0.3, 0.01, m, 0, 0.7, 0.18);
    B(g, 1.36, 0.03, 0.16, mat("ceramic"), 0, 0.75, 0.2);
    for (let i = 0; i < 26; i++) if (i % 7 !== 2 && i % 7 !== 6) B(g, 0.025, 0.02, 0.09, m, -0.63 + i * 0.052, 0.78, 0.17);
    [-0.66, 0.66].forEach((x) => B(g, 0.06, 0.7, 0.06, m, x, 0, 0.3));
    return g; } });
  item({ id: "gul", cat: "mebel", name: "Gul tuvak", icon: "🪴", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(); C(g, 0.2, 0.15, 0.4, mat("ceramic", 0xd9d4cc), 0, 0, 0, 18); C(g, 0.18, 0.18, 0.02, mat("clay", 0x3b2a1e), 0, 0.37, 0, 16);
    for (let i = 0; i < 9; i++) { const l = add(g, sphG(0.18, 10), mat("leaf", 0x3f7d35), Math.cos(i) * 0.1, 0.6 + Math.random() * 0.35, Math.sin(i) * 0.1); l.scale.set(0.4, 1, 0.15); l.rotation.set(rand(-0.6, 0.6), i, rand(-0.6, 0.6)); }
    return g; } });

  // ---------- HOVLI ----------
  item({ id: "daraxt", cat: "hovli", name: "Daraxt", icon: "🌳", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(), tr = mat("wood", 0x5b3a26);
    C(g, 0.12, 0.2, 2.2, tr, 0, 0, 0, 10);
    for (let i = 0; i < 7; i++) add(g, lumpyG(1, 2, 0.35), mat("leaf", [0x3f7d35, 0x356e2d, 0x4b8a38][i % 3]), rand(-0.6, 0.6), 2.6 + rand(-0.3, 0.9), rand(-0.6, 0.6)).scale.setScalar(rand(0.6, 0.95));
    return g; } });
  item({ id: "olma", cat: "hovli", name: "Olma daraxti", icon: "🍎", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(), tr = mat("wood", 0x5b3a26);
    C(g, 0.1, 0.16, 1.6, tr, 0, 0, 0, 10);
    for (let i = 0; i < 6; i++) add(g, lumpyG(0.8, 2, 0.35), mat("leaf", [0x4b8a38, 0x3f7d35][i % 2]), rand(-0.45, 0.45), 2.0 + rand(-0.2, 0.6), rand(-0.45, 0.45)).scale.setScalar(rand(0.7, 0.95));
    for (let i = 0; i < 16; i++) { const a = Math.random() * 6.28, r = rand(0.55, 0.9); S(g, 0.07, mat("plastic", 0xc8281e), Math.cos(a) * r, 1.8 + Math.random() * 0.9, Math.sin(a) * r, 10); }
    return g; } });
  item({ id: "archa", cat: "hovli", name: "Archa", icon: "🌲", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(); C(g, 0.1, 0.14, 0.8, mat("wood", 0x5b3a26), 0, 0, 0, 8);
    [[0.6, 0.9, 1.3], [1.4, 0.72, 1.1], [2.1, 0.52, 0.9], [2.7, 0.32, 0.8]].forEach(([y, r, h]) => C(g, 0, r, h, mat("leaf", 0x24502e), 0, y, 0, 12));
    return g; } });
  item({ id: "buta", cat: "hovli", name: "Buta", icon: "🌿", layer: "obj", size: [1, 1], build: () => { const g = new T.Group(); for (let i = 0; i < 5; i++) add(g, lumpyG(0.4, 2, 0.4), mat("leaf", [0x3f7d35, 0x4b8a38][i % 2]), rand(-0.2, 0.2), 0.35 + rand(0, 0.2), rand(-0.2, 0.2)).scale.setScalar(rand(0.8, 1.1)); return g; } });
  item({ id: "gulzor", cat: "hovli", name: "Gulzor", icon: "🌷", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(); B(g, 0.98, 0.2, 0.98, mat("stone", 0xffffff, { rep: [0.5, 0.2] }), 0, 0, 0); B(g, 0.86, 0.02, 0.86, mat("clay", 0x4a3223), 0, 0.2, 0);
    const cs = [0xe0435a, 0xf2c94c, 0xffffff, 0xb76ad9, 0xff8a3d];
    for (let i = 0; i < 22; i++) { const x = rand(-0.38, 0.38), z = rand(-0.38, 0.38), h = rand(0.15, 0.35); C(g, 0.006, 0.006, h, mat("leaf", 0x3f7d35), x, 0.2, z, 4); S(g, 0.035, mat("plastic", cs[i % 5]), x, 0.2 + h, z, 8); }
    return g; } });
  item({ id: "yolak", cat: "hovli", name: "Tosh yo‘lak", icon: "🪨", layer: "floor", size: [1, 1], build: () => floorTile(mat("stone", 0xffffff, { rep: [0.6, 0.6] })) });
  item({ id: "maysa", cat: "hovli", name: "Maysazor", icon: "🟩", layer: "floor", size: [1, 1], build: () => { const g = new T.Group(); add(g, boxG(1, 0.04, 1), mat("leaf", 0x4f9a3a), 0, 0.02, 0, false); for (let i = 0; i < 30; i++) { const b = add(g, cylG(0, 0.012, rand(0.06, 0.12), 3), mat("leaf", 0x5aa543), rand(-0.48, 0.48), 0.07, rand(-0.48, 0.48), false); b.rotation.z = rand(-0.3, 0.3); } return g; } });
  item({ id: "hovuz", cat: "hovli", name: "Hovuz", icon: "🏊", layer: "obj", size: [2, 2], build: () => {
    const g = new T.Group(), s = mat("tiles", 0x9fd3e6, { rep: [2, 2] });
    B(g, 2, 0.3, 0.14, mat("marble", 0xffffff), 0, 0, -0.93); B(g, 2, 0.3, 0.14, mat("marble", 0xffffff), 0, 0, 0.93);
    B(g, 0.14, 0.3, 2, mat("marble", 0xffffff), -0.93, 0, 0); B(g, 0.14, 0.3, 2, mat("marble", 0xffffff), 0.93, 0, 0);
    B(g, 1.72, 0.02, 1.72, s, 0, 0.02, 0); B(g, 1.72, 0.04, 1.72, mat("water"), 0, 0.2, 0);
    return g; } });
  item({ id: "sori", cat: "hovli", name: "So‘ri", icon: "🛖", layer: "obj", size: [2, 2], build: () => {
    const g = new T.Group(), w = mat("wood", 0x8a5a36);
    [[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]].forEach(([x, z]) => B(g, 0.1, 0.5, 0.1, w, x, 0, z));
    B(g, 1.9, 0.08, 1.9, mat("planks", 0xffffff, { rep: [1, 1] }), 0, 0.42, 0);
    [-0.92, 0.92].forEach((x) => { B(g, 0.06, 0.45, 1.9, w, x, 0.5, 0); for (let i = 0; i < 6; i++) B(g, 0.04, 0.35, 0.04, w, x, 0.5, -0.8 + i * 0.32); });
    B(g, 1.9, 0.45, 0.06, w, 0, 0.5, -0.92);
    add(g, boxG(1.7, 0.03, 1.7), mat("suzani", 0xffffff), 0, 0.515, 0, false);
    RB(g, 0.6, 0.04, 0.45, 0.02, w, 0, 0.7, 0); [[-0.25, -0.18], [0.25, -0.18], [-0.25, 0.18], [0.25, 0.18]].forEach(([x, z]) => B(g, 0.03, 0.18, 0.03, w, x, 0.52, z));
    C(g, 0.07, 0.05, 0.1, mat("ceramic", 0x2f6fb5), 0.1, 0.74, 0, 14);
    return g; } });
  item({ id: "tandir", cat: "hovli", name: "Tandir", icon: "🫓", layer: "obj", size: [1, 1], build: () => {
    const g = new T.Group(), m = mat("clay", 0xb7774a);
    B(g, 0.9, 0.6, 0.9, mat("brick", 0xffffff, { rep: [0.8, 0.6] }), 0, 0, 0);
    const dome = add(g, new T.SphereGeometry(0.42, 22, 14, 0, Math.PI * 2, 0, Math.PI / 2), m, 0, 0.6, 0); dome.scale.y = 1.2;
    C(g, 0.16, 0.18, 0.08, mat("clay", 0x8a5532), 0, 1.06, 0, 18); add(g, cylG(0.13, 0.13, 0.01, 18), mat("plain", 0x1b120c), 0, 1.15, 0, false);
    return g; } });
  item({ id: "skameyka", cat: "hovli", name: "Skameyka", icon: "🪵", layer: "obj", size: [2, 1], build: () => {
    const g = new T.Group(), w = mat("wood", 0x9c6b43), m = mat("metal", 0x2f3135);
    [-0.7, 0.7].forEach((x) => { B(g, 0.05, 0.45, 0.45, m, x, 0, 0); B(g, 0.05, 0.4, 0.05, m, x, 0.45, -0.2); });
    for (let i = 0; i < 4; i++) B(g, 1.6, 0.03, 0.1, w, 0, 0.45, -0.17 + i * 0.12);
    for (let i = 0; i < 2; i++) B(g, 1.6, 0.1, 0.03, w, 0, 0.6 + i * 0.15, -0.22);
    return g; } });
  item({ id: "fonar", cat: "hovli", name: "Chiroq ustuni", icon: "🏮", layer: "obj", size: [1, 1], light: 3.0, build: () => {
    const g = new T.Group(), m = mat("metal", 0x1f2124);
    C(g, 0.12, 0.15, 0.2, m, 0, 0, 0, 12); C(g, 0.04, 0.05, 2.8, m, 0, 0.2, 0, 10);
    C(g, 0.18, 0.1, 0.06, m, 0, 3.0, 0, 6); C(g, 0.13, 0.1, 0.3, mat("glow"), 0, 2.7, 0, 6).userData.lamp = true; C(g, 0.02, 0.18, 0.15, m, 0, 3.06, 0, 6);
    return g; } });
  item({ id: "favvora", cat: "hovli", name: "Favvora", icon: "⛲", layer: "obj", size: [2, 2], build: () => {
    const g = new T.Group(), s = mat("marble", 0xffffff);
    C(g, 0.95, 0.98, 0.4, s, 0, 0, 0, 32); C(g, 0.86, 0.86, 0.02, mat("water"), 0, 0.36, 0, 32);
    C(g, 0.1, 0.14, 0.9, s, 0, 0.4, 0, 14); C(g, 0.4, 0.2, 0.12, s, 0, 1.3, 0, 24); C(g, 0.35, 0.35, 0.01, mat("water"), 0, 1.4, 0, 24);
    C(g, 0.03, 0.05, 0.3, s, 0, 1.4, 0, 10);
    return g; } });
  item({ id: "argimchoq", cat: "hovli", name: "Arg‘imchoq", icon: "🎠", layer: "obj", size: [2, 1], build: () => {
    const g = new T.Group(), m = mat("metal", 0xb84a3a);
    [-0.9, 0.9].forEach((x) => { const a = add(g, cylG(0.04, 0.04, 2.3, 10), m, x, 1.1, -0.35); a.rotation.x = 0.3; const b = add(g, cylG(0.04, 0.04, 2.3, 10), m, x, 1.1, 0.35); b.rotation.x = -0.3; });
    const top = add(g, cylG(0.05, 0.05, 1.9, 10), m, 0, 2.18, 0); top.rotation.z = Math.PI / 2;
    [-0.45, 0.45].forEach((x) => { [-0.18, 0.18].forEach((dx) => C(g, 0.008, 0.008, 1.7, mat("metal", 0xcccccc), x + dx, 0.48, 0, 4)); RB(g, 0.45, 0.04, 0.2, 0.02, mat("wood", 0xe0a23a), x, 0.45, 0); });
    return g; } });
  item({ id: "mashina", cat: "hovli", name: "Mashina", icon: "🚗", layer: "obj", size: [2, 4], paint: 7, build: (c) => {
    const g = new T.Group(), body = new T.MeshStandardMaterial({ color: col(c, 0x3f6e9e), roughness: 0.25, metalness: 0.6 });
    RB(g, 1.75, 0.6, 4.1, 0.2, body, 0, 0.3, 0); RB(g, 1.55, 0.55, 2.1, 0.2, body, 0, 0.8, -0.25);
    const gl = mat("glass"); RB(g, 1.5, 0.46, 2.0, 0.18, new T.MeshStandardMaterial({ color: 0x1a222b, roughness: 0.05, metalness: 0.4, envMapIntensity: 1.5 }), 0, 0.84, -0.25);
    void gl;
    const tire = mat("plain", 0x161616, { rough: 0.9 }), rim = mat("metal", 0xcfd3d8);
    [[-0.82, 1.3], [0.82, 1.3], [-0.82, -1.3], [0.82, -1.3]].forEach(([x, z]) => { const t = add(g, cylG(0.34, 0.34, 0.24, 20), tire, x, 0.34, z); t.rotation.z = Math.PI / 2; const r = add(g, cylG(0.2, 0.2, 0.25, 12), rim, x, 0.34, z); r.rotation.z = Math.PI / 2; });
    [-0.6, 0.6].forEach((x) => { add(g, boxG(0.3, 0.12, 0.04), mat("glow"), x, 0.65, 2.05, false); add(g, boxG(0.3, 0.1, 0.04), mat("plain", 0xb3161b), x, 0.68, -2.05, false); });
    return g; } });

  const BY_ID = {};
  CAT.forEach((c) => { BY_ID[c.id] = c; if (!c.size) c.size = [1, 1]; });
  const CATEGORIES = [
    { id: "qurilish", name: "Qurilish", icon: "🧱" },
    { id: "mebel", name: "Mebel", icon: "🛋️" },
    { id: "hovli", name: "Hovli", icon: "🌳" }
  ];

  // ===================== JOYLASHUV =====================
  // Katakdagi jihoz: x,z — eng kichik burchak katak; r 1/3 da o'lcham almashadi
  const dims = (it, r) => (r % 2 ? [it.size[1], it.size[0]] : [it.size[0], it.size[1]]);
  function placement(rec) {
    const it = BY_ID[rec.t];
    const base = rec.l * H + (it.layer === "roof" ? H : it.layer === "floor" ? (rec.l ? -0.0 : 0) : BASE);
    if (it.layer === "wall") {
      return rec.r % 2 ? { x: rec.x, z: rec.z + 0.5, y: rec.l * H, ry: Math.PI / 2 } : { x: rec.x + 0.5, z: rec.z, y: rec.l * H, ry: 0 };
    }
    const [w, d] = dims(it, rec.r);
    return { x: rec.x + w / 2, z: rec.z + d / 2, y: base, ry: (-rec.r * Math.PI) / 2 };
  }
  function cellsOf(rec) {
    const it = BY_ID[rec.t];
    if (it.layer === "wall") return [`w:${rec.l}:${rec.x}:${rec.z}:${rec.r % 2}`];
    const [w, d] = dims(it, rec.r), out = [];
    for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) out.push(`${it.layer}:${rec.l}:${rec.x + i}:${rec.z + j}`);
    return out;
  }
  function inBounds(rec) {
    const it = BY_ID[rec.t];
    if (it.layer === "wall") return rec.x >= -HALF && rec.z >= -HALF && (rec.r % 2 ? rec.x <= HALF && rec.z < HALF : rec.x < HALF && rec.z <= HALF);
    const [w, d] = dims(it, rec.r);
    return rec.x >= -HALF && rec.z >= -HALF && rec.x + w <= HALF && rec.z + d <= HALF;
  }

  // ===================== SAHNA =====================
  function Arch3D(container, opts = {}) {
    if (!T) throw new Error("THREE yo‘q");
    if (T.ColorManagement) T.ColorManagement.legacyMode = false;
    let renderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }); } catch (e) { throw new Error("WebGL yo‘q"); }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.domElement.className = "ar-canvas";
    container.appendChild(renderer.domElement);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(50, 1, 0.1, 600);

    // Osmon va aks (environment) — realistik yaltiroqlik uchun
    const skyTex = (top, mid, bot) => { const c = canvas(4, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(0.5, mid); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, w, h); }); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t; };
    const pmrem = new T.PMREMGenerator(renderer);
    function envFrom(top, mid, bot, groundC) {
      const s = new T.Scene();
      const sph = new T.Mesh(new T.SphereGeometry(50, 32, 16), new T.MeshBasicMaterial({ map: skyTex(top, mid, bot), side: T.BackSide }));
      s.add(sph);
      const gnd = new T.Mesh(new T.CircleGeometry(48, 24), new T.MeshBasicMaterial({ color: groundC })); gnd.rotation.x = -Math.PI / 2; gnd.position.y = -2; s.add(gnd);
      const sunS = new T.Mesh(new T.SphereGeometry(4, 12, 8), new T.MeshBasicMaterial({ color: 0xffffff })); sunS.position.set(20, 30, 15); s.add(sunS);
      const rt = pmrem.fromScene(s, 0.02);
      return rt.texture;
    }
    const ENV = { day: envFrom("#4f93d8", "#a8d1ef", "#eaf4f8", 0x6a8a4a), night: envFrom("#060b1d", "#14234a", "#2a3a5e", 0x10180e) };

    const hemi = new T.HemisphereLight(0xdcecff, 0x5b6b3a, 0.55); scene.add(hemi);
    const sun = new T.DirectionalLight(0xfff0d8, 2.2);
    sun.position.set(18, 30, 12); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 90 });
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
    scene.add(sun); scene.add(sun.target);

    // Yer
    const ground = new T.Mesh(new T.PlaneGeometry(400, 400), new T.MeshStandardMaterial({ map: getTex("grass").color, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    const plotM = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ color: 0x6fa046, roughness: 1, transparent: true, opacity: 0.25 }));
    plotM.rotation.x = -Math.PI / 2; plotM.position.y = 0.005; scene.add(plotM);
    // Atrof: uzoqdagi daraxtlar va tepaliklar
    const far = new T.Group(); scene.add(far);
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2 + rand(-0.05, 0.05), r = rand(30, 46);
      const t = BY_ID[i % 3 ? "daraxt" : "archa"].build(-1); t.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); t.scale.setScalar(rand(1.2, 2)); t.traverse((o) => { if (o.isMesh) o.castShadow = false; }); far.add(t);
    }
    [[-90, -140, 60], [40, -170, 80], [150, -90, 55], [-170, 30, 70], [160, 90, 60]].forEach(([x, z, r]) => { const h = new T.Mesh(new T.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: 0x6e9150, roughness: 1 })); h.position.set(x, -r * 0.5, z); far.add(h); });
    // Bulutlar
    const cloudT = new T.CanvasTexture(canvas(256, 128, (x) => { for (let i = 0; i < 14; i++) { const cx = 40 + Math.random() * 176, cy = 62 + Math.random() * 26 - Math.abs(cx - 128) * 0.12, r = 18 + Math.random() * 26; const gr = x.createRadialGradient(cx, cy, 1, cx, cy, r); gr.addColorStop(0, "rgba(255,255,255,.95)"); gr.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = gr; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); } }));
    const clouds = [];
    for (let i = 0; i < 10; i++) { const c = new T.Sprite(new T.SpriteMaterial({ map: cloudT, transparent: true, depthWrite: false, fog: false })); const w = rand(50, 90); c.scale.set(w, w * 0.45, 1); c.position.set(rand(-200, 200), rand(60, 95), rand(-200, -60) * (i % 3 ? 1 : -1)); c.userData.v = rand(0.5, 1.4); scene.add(c); clouds.push(c); }

    // To'r (qurish rejimida)
    const gridG = new T.BufferGeometry(), gp = [];
    for (let i = -HALF; i <= HALF; i++) { gp.push(i, 0, -HALF, i, 0, HALF, -HALF, 0, i, HALF, 0, i); }
    gridG.setAttribute("position", new T.Float32BufferAttribute(gp, 3));
    const grid = new T.LineSegments(gridG, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false }));
    grid.position.y = 0.02; scene.add(grid);
    const border = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(30, 0.01, 30)), new T.LineBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.7 }));
    border.position.y = 0.02; scene.add(border);

    // ---------- Jihozlar ----------
    const root = new T.Group(); scene.add(root);
    const pieces = new Map(); // id -> { rec, obj }
    const occ = new Map();    // katak kaliti -> id
    const proto = new Map();  // tur|rang -> namuna guruh
    const lamps = [];
    function protoOf(t, c) {
      const k = t + "|" + c;
      if (!proto.has(k)) proto.set(k, BY_ID[t].build(c));
      return proto.get(k);
    }
    function makeObj(rec) {
      const o = protoOf(rec.t, rec.c).clone();
      const p = placement(rec);
      o.position.set(p.x, p.y, p.z); o.rotation.y = p.ry;
      o.traverse((m) => { m.userData.pid = rec.id; });
      o.userData.rec = rec;
      return o;
    }
    function add1(rec) {
      if (pieces.has(rec.id)) remove1(rec.id);
      const obj = makeObj(rec);
      root.add(obj);
      pieces.set(rec.id, { rec, obj });
      cellsOf(rec).forEach((k) => occ.set(k, rec.id));
      if (BY_ID[rec.t].light) lightsDirty = true;
      if (BY_ID[rec.t].autoRoof) roofDirty = true;
    }
    function remove1(id) {
      const p = pieces.get(id);
      if (!p) return;
      root.remove(p.obj);
      cellsOf(p.rec).forEach((k) => { if (occ.get(k) === id) occ.delete(k); });
      pieces.delete(id);
      if (BY_ID[p.rec.t].light) lightsDirty = true;
      if (BY_ID[p.rec.t].autoRoof) roofDirty = true;
    }
    function canPlace(rec, ignore) {
      if (!BY_ID[rec.t] || !inBounds(rec)) return false;
      return cellsOf(rec).every((k) => !occ.has(k) || occ.get(k) === ignore);
    }
    this.canPlace = canPlace;
    this.setPieces = (list) => { [...pieces.keys()].forEach(remove1); list.forEach(add1); applyView(); };
    this.add = (rec) => { add1(rec); applyView(); };
    this.remove = (id) => { remove1(id); applyView(); };
    this.update = (rec) => { add1(rec); applyView(); };
    this.get = (id) => pieces.get(id) && pieces.get(id).rec;

    // ---------- Avtomatik qiya tom ----------
    const roofs = new T.Group(); scene.add(roofs);
    let roofDirty = true;
    const SLOPE = 0.55;
    function buildRoofs() {
      roofDirty = false;
      roofs.children.slice().forEach((m) => { roofs.remove(m); m.geometry.dispose(); });
      const byL = {};
      pieces.forEach(({ rec }) => { if (rec.t === "qiya_tom") (byL[rec.l] = byL[rec.l] || new Set()).add(rec.x + "," + rec.z); });
      Object.keys(byL).forEach((L) => {
        const R = byL[L], has = (x, z) => R.has(x + "," + z);
        // burchak nuqtalari: tashqi chegara 0, ichkari — chegaradan uzoqligi (Chebyshev)
        const corners = new Map();
        R.forEach((k) => { const [x, z] = k.split(",").map(Number); [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([a, b]) => corners.set((x + a) + "," + (z + b), Infinity)); });
        const q = [];
        corners.forEach((_, k) => {
          const [x, z] = k.split(",").map(Number);
          if (!(has(x, z) && has(x - 1, z) && has(x, z - 1) && has(x - 1, z - 1))) { corners.set(k, 0); q.push(k); }
        });
        while (q.length) {
          const k = q.shift(), [x, z] = k.split(",").map(Number), d = corners.get(k);
          for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
            const nk = (x + a) + "," + (z + b);
            if (corners.has(nk) && corners.get(nk) > d + 1) { corners.set(nk, d + 1); q.push(nk); }
          }
        }
        const y0 = +L * H + H, pos = [], uv = [], idx = [];
        const vid = new Map();
        const V = (x, z) => {
          const k = x + "," + z;
          if (vid.has(k)) return vid.get(k);
          const h = corners.get(k) * SLOPE;
          vid.set(k, pos.length / 3);
          pos.push(x, y0 + h + 0.02, z); uv.push(x * 0.5, (z + h) * 0.5);
          return vid.get(k);
        };
        R.forEach((k) => {
          const [x, z] = k.split(",").map(Number);
          const a = V(x, z), b = V(x + 1, z), c = V(x, z + 1), d = V(x + 1, z + 1);
          const ha = corners.get(x + "," + z), hd = corners.get((x + 1) + "," + (z + 1)), hb = corners.get((x + 1) + "," + z), hc = corners.get(x + "," + (z + 1));
          if (ha === hd && hb !== hc) idx.push(a, c, d, a, d, b); else idx.push(a, c, b, b, c, d);
        });
        const geo = new T.BufferGeometry();
        geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
        geo.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
        geo.setIndex(idx); geo.computeVertexNormals();
        const m = new T.Mesh(geo, mat("roof", 0xffffff, { key: "auto", rep: [1, 1] }));
        m.material.side = T.DoubleSide;
        m.castShadow = true; m.receiveShadow = true; m.userData.level = +L;
        roofs.add(m);
        // tom osti (shift) va chekka taxta
        const under = new T.Mesh(geo.clone(), mat("plaster", 0xe9e3d8, { key: "under" }));
        const up = under.geometry.attributes.position; for (let i = 0; i < up.count; i++) up.setY(i, y0 - 0.02); under.geometry.computeVertexNormals();
        under.material.side = T.DoubleSide; under.receiveShadow = true; under.userData.level = +L; roofs.add(under);
      });
      applyRoofView();
    }
    function applyRoofView() {
      const building = mode === "build" || mode === "select" || mode === "erase";
      roofs.children.forEach((m) => { m.visible = !building || (m.userData.level <= viewLevel && (showRoofs || m.userData.level < viewLevel)); });
    }

    // Chiroqlar (tunda) — eng ko'pi 8 ta haqiqiy yorug'lik
    let lightsDirty = true, night = false;
    const lightPool = [];
    for (let i = 0; i < 8; i++) { const l = new T.PointLight(0xffc98a, 0, 9, 1.8); l.visible = false; scene.add(l); lightPool.push(l); }
    function refreshLights() {
      lightsDirty = false;
      const ls = [];
      pieces.forEach(({ rec, obj }) => { const it = BY_ID[rec.t]; if (it.light && obj.visible) ls.push([obj, it.light]); });
      lightPool.forEach((l, i) => {
        const e = ls[i];
        if (!e || !night) { l.visible = false; l.intensity = 0; return; }
        l.visible = true; l.intensity = e[1] > 2.5 ? 2.2 : 1.6; l.distance = e[1] > 2.5 ? 14 : 8;
        l.position.set(e[0].position.x, e[0].position.y + e[1], e[0].position.z);
      });
    }

    // ---------- Ko'rinish: qavat va tom ----------
    let viewLevel = MAXL, showRoofs = true, mode = "view";
    function applyView() {
      const building = mode === "build" || mode === "select" || mode === "erase";
      pieces.forEach(({ rec, obj }) => {
        const it = BY_ID[rec.t];
        let vis = !building || rec.l <= viewLevel;
        if (building && it.layer === "roof" && rec.l >= viewLevel && !showRoofs) vis = false;
        obj.visible = vis;
      });
      grid.visible = building; grid.position.y = viewLevel * H + 0.02 + (viewLevel ? BASE : 0);
      border.visible = building || mode === "view";
      plotM.visible = building;
      lightsDirty = true;
      if (typeof applyRoofView === "function") applyRoofView();
    }
    this.setLevel = (l) => { viewLevel = Math.max(0, Math.min(MAXL, l)); applyView(); updateGhost(); };
    this.setRoofs = (v) => { showRoofs = !!v; applyView(); };
    this.setMode = (m) => {
      mode = m;
      ghost.visible = false; selBox.visible = false;
      if (m === "walk") startWalk(); else stopWalk();
      applyView();
    };

    // ---------- Arvoh (qo'yishdan oldingi ko'rinish) ----------
    const ghost = new T.Group(); ghost.visible = false; scene.add(ghost);
    const ghostOK = new T.MeshStandardMaterial({ color: 0x35d07f, transparent: true, opacity: 0.55, emissive: 0x0d5a2c, depthWrite: false });
    const ghostBad = new T.MeshStandardMaterial({ color: 0xff5a4f, transparent: true, opacity: 0.55, emissive: 0x5a0d0d, depthWrite: false });
    let tool = null, ghostRec = null, lastPoint = null;
    this.setTool = (t, r = 0, c = -1) => {
      tool = t ? { t, r, c } : null;
      ghost.clear();
      if (tool) {
        const g = BY_ID[t].build(c);
        g.traverse((m) => { if (m.isMesh) { m.material = ghostOK; m.castShadow = false; m.renderOrder = 5; } });
        ghost.add(g);
      }
      updateGhost();
    };
    this.rotateTool = () => { if (tool) { tool.r = (tool.r + 1) % 4; updateGhost(); } return tool ? tool.r : 0; };
    const selBox = new T.Box3Helper(new T.Box3(), 0x35d07f); selBox.visible = false; scene.add(selBox);
    this.highlight = (id) => {
      const p = id && pieces.get(id);
      if (!p) { selBox.visible = false; return; }
      selBox.box.setFromObject(p.obj); selBox.visible = true;
    };
    function recAt(point) {
      if (!tool || !point) return null;
      const it = BY_ID[tool.t];
      const r = tool.r;
      let x, z;
      if (it.layer === "wall") {
        if (r % 2) { x = Math.round(point.x); z = Math.floor(point.z); } else { x = Math.floor(point.x); z = Math.round(point.z); }
      } else {
        const [w, d] = dims(it, r);
        x = Math.floor(point.x - w / 2 + 0.5); z = Math.floor(point.z - d / 2 + 0.5);
      }
      return { t: tool.t, x, z, l: viewLevel, r, c: tool.c };
    }
    function updateGhost() {
      if (!tool || mode !== "build" || !lastPoint) { ghost.visible = false; ghostRec = null; return; }
      ghostRec = recAt(lastPoint);
      const ok = canPlace(ghostRec);
      const p = placement(ghostRec);
      ghost.position.set(p.x, p.y + 0.01, p.z); ghost.rotation.y = p.ry;
      ghost.traverse((m) => { if (m.isMesh) m.material = ok ? ghostOK : ghostBad; });
      ghost.visible = true;
    }

    // ---------- Kamera ----------
    const cam = { theta: 0.75, phi: 0.95, r: 30, target: new T.Vector3(0, 0, 0) };
    let goal = null;
    function applyCam() {
      const { theta, phi, r, target } = cam;
      camera.position.set(target.x + r * Math.sin(phi) * Math.sin(theta), target.y + r * Math.cos(phi), target.z + r * Math.sin(phi) * Math.cos(theta));
      camera.lookAt(target);
    }
    this.home = () => { goal = { theta: 0.75, phi: 0.95, r: 30, x: 0, z: 0 }; };
    this.focusAll = () => {
      if (!pieces.size) { this.home(); return; }
      const b = new T.Box3(); pieces.forEach(({ obj }) => b.expandByObject(obj));
      const c = b.getCenter(new T.Vector3()), s = b.getSize(new T.Vector3());
      goal = { theta: cam.theta, phi: 0.95, r: Math.max(12, Math.min(60, Math.max(s.x, s.z) * 1.5 + 6)), x: c.x, z: c.z };
    };

    // ---------- Ichida yurish ----------
    const walk = { on: false, yaw: 0, pitch: -0.05, pos: new T.Vector3(), keys: {}, input: { f: 0, s: 0 }, level: 0 };
    function startWalk() {
      walk.on = true;
      // eshik yonidan yoki maydon chetidan boshlaymiz
      const doors = [...pieces.values()].filter(({ rec }) => BY_ID[rec.t].pass && rec.l === 0);
      if (doors.length) {
        const d = doors[0].rec, p = placement(d);
        const off = d.r % 2 ? [2.2, 0] : [0, 2.2];
        walk.pos.set(p.x + off[0], 1.6, p.z + off[1]);
        walk.yaw = Math.atan2(off[0], off[1]);
      } else { walk.pos.set(0, 1.6, HALF + 3); walk.yaw = 0; }
      walk.pitch = -0.05; walk.level = 0;
    }
    function stopWalk() { walk.on = false; walk.keys = {}; walk.input = { f: 0, s: 0 }; }
    this.walkInput = (f, s) => { walk.input = { f, s }; };
    const blocked = (x0, z0, x1, z1, l) => {
      // katak chegarasini kesib o'tsa, o'sha qirrada devor bormi?
      const wallAt = (k) => { const id = occ.get(k); return id && !BY_ID[pieces.get(id).rec.t].pass; };
      const cx0 = Math.floor(x0), cx1 = Math.floor(x1), cz0 = Math.floor(z0), cz1 = Math.floor(z1);
      if (cx0 !== cx1) { const ex = Math.max(cx0, cx1); if (wallAt(`w:${l}:${ex}:${Math.floor(z0)}:1`)) return true; }
      if (cz0 !== cz1) { const ez = Math.max(cz0, cz1); if (wallAt(`w:${l}:${Math.floor(x0)}:${ez}:0`)) return true; }
      return false;
    };
    function stepWalk(dt) {
      const k = walk.keys;
      const f = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0) + walk.input.f;
      const s = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0) + walk.input.s;
      if (f || s) {
        const sp = 2.6 * dt, dx = (-Math.sin(walk.yaw) * f + Math.cos(walk.yaw) * s) * sp, dz = (-Math.cos(walk.yaw) * f - Math.sin(walk.yaw) * s) * sp;
        const p = walk.pos, l = walk.level;
        let nx = p.x + dx, nz = p.z + dz;
        if (blocked(p.x, p.z, nx, p.z, l)) nx = p.x;
        if (blocked(nx, p.z, nx, nz, l)) nz = p.z;
        p.x = Math.max(-HALF - 8, Math.min(HALF + 8, nx)); p.z = Math.max(-HALF - 8, Math.min(HALF + 8, nz));
        // zinapoyada: balandlik silliq o'zgaradi
        let stairY = null;
        pieces.forEach(({ rec }) => {
          if (rec.t !== "zina") return;
          const [w, d] = dims(BY_ID.zina, rec.r);
          if (p.x < rec.x || p.x > rec.x + w || p.z < rec.z || p.z > rec.z + d) return;
          const pl = placement(rec), loc = new T.Vector3(p.x - pl.x, 0, p.z - pl.z).applyAxisAngle(new T.Vector3(0, 1, 0), -pl.ry);
          const t = Math.max(0, Math.min(1, (1.5 - loc.z) / 3));
          stairY = rec.l * H + t * H;
        });
        const floorY = stairY !== null ? stairY : walk.level * H;
        walk.level = Math.max(0, Math.min(MAXL, Math.round((floorY - 0.4) / H)));
        if (stairY === null) {
          // yuqori qavatda pol yo'q bo'lsa — pastga tushamiz
          const cell = `floor:${walk.level}:${Math.floor(p.x)}:${Math.floor(p.z)}`, roofCell = `roof:${walk.level - 1}:${Math.floor(p.x)}:${Math.floor(p.z)}`;
          if (walk.level > 0 && !occ.has(cell) && !occ.has(roofCell)) walk.level--;
        }
        walk.eyeY = (stairY !== null ? stairY : walk.level * H) + 1.6;
      }
      walk.pos.y += ((walk.eyeY || 1.6) - walk.pos.y) * 0.25;
      camera.position.copy(walk.pos);
      camera.rotation.order = "YXZ"; camera.rotation.set(walk.pitch, walk.yaw, 0);
    }
    const onKey = (e, v) => { if (walk.on) { walk.keys[e.code] = v; if (v && /Arrow|Key[WASD]/.test(e.code)) e.preventDefault(); } };
    const kd = (e) => onKey(e, true), ku = (e) => onKey(e, false);
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);

    // ---------- Sichqoncha / barmoq ----------
    const el = renderer.domElement, ray = new T.Raycaster(), ndc = new T.Vector2(), pointers = new Map();
    el.style.touchAction = "none";
    let drag = null, pinch = null;
    const plane = new T.Plane(new T.Vector3(0, 1, 0), 0), hitP = new T.Vector3();
    function pointFromEvent(e) {
      const r = el.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      plane.constant = -(viewLevel * H + (tool && BY_ID[tool.t].layer === "roof" ? H : 0));
      return ray.ray.intersectPlane(plane, hitP) ? hitP.clone() : null;
    }
    function pickPiece(e) {
      const r = el.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const vis = []; root.children.forEach((o) => { if (o.visible) vis.push(o); });
      const hits = ray.intersectObjects(vis, true);
      const hit = hits.find((h) => !h.object.userData.glass && !h.object.userData.pick) || hits[0];
      return hit ? hit.object.userData.pid : null;
    }
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), r: cam.r, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, tx: cam.target.x, tz: cam.target.z }; drag = null; }
      else drag = { x: e.clientX, y: e.clientY, th: cam.theta, ph: cam.phi, yaw: walk.yaw, pitch: walk.pitch, moved: false, pan: e.button === 2 || e.shiftKey, tx: cam.target.x, tz: cam.target.z };
    });
    el.addEventListener("contextmenu", (e) => e.preventDefault());
    el.addEventListener("pointermove", (e) => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        if (!walk.on) {
          cam.r = Math.max(5, Math.min(70, (pinch.r * pinch.d) / Math.max(1, Math.hypot(a.x - b.x, a.y - b.y))));
          const mx = (a.x + b.x) / 2 - pinch.cx, my = (a.y + b.y) / 2 - pinch.cy, k = cam.r / 500;
          cam.target.x = pinch.tx - (Math.cos(cam.theta) * mx + Math.sin(cam.theta) * my) * k;
          cam.target.z = pinch.tz - (-Math.sin(cam.theta) * mx + Math.cos(cam.theta) * my) * k;
          goal = null;
        }
        return;
      }
      if (!drag) {
        if (mode === "build" && e.pointerType === "mouse") { lastPoint = pointFromEvent(e); updateGhost(); }
        return;
      }
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 7) drag.moved = true;
      if (!drag.moved) return;
      if (walk.on) { walk.yaw = drag.yaw - dx * 0.005; walk.pitch = Math.max(-1.2, Math.min(1.2, drag.pitch - dy * 0.004)); return; }
      if (drag.pan) {
        const k = cam.r / 600;
        cam.target.x = drag.tx - (Math.cos(cam.theta) * dx + Math.sin(cam.theta) * dy) * k;
        cam.target.z = drag.tz - (-Math.sin(cam.theta) * dx + Math.cos(cam.theta) * dy) * k;
      } else { cam.theta = drag.th - dx * 0.006; cam.phi = Math.max(0.2, Math.min(1.45, drag.ph - dy * 0.005)); }
      goal = null;
    });
    const end = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (drag && !drag.moved && pointers.size === 0 && !walk.on) {
        if (mode === "build" && tool) {
          lastPoint = pointFromEvent(e); updateGhost();
          if (ghostRec && canPlace(ghostRec) && opts.onPlace) opts.onPlace({ ...ghostRec });
          else if (ghostRec && opts.onBlocked) opts.onBlocked();
        } else if (mode === "select" || mode === "view") { const id = pickPiece(e); if (id && opts.onPick) opts.onPick(id); else if (opts.onMiss) opts.onMiss(); }
        else if (mode === "erase") { const id = pickPiece(e); if (id && opts.onErase) opts.onErase(id); }
      }
      if (pointers.size === 0) drag = null;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", (e) => { pointers.delete(e.pointerId); drag = null; pinch = null; });
    el.addEventListener("pointerleave", () => { if (mode === "build" && !drag) { ghost.visible = false; } });
    el.addEventListener("wheel", (e) => { e.preventDefault(); if (walk.on) return; cam.r = Math.max(5, Math.min(70, cam.r * (1 + Math.sign(e.deltaY) * 0.08))); goal = null; }, { passive: false });

    // ---------- Kun va tun ----------
    this.setNight = (v) => {
      night = !!v;
      if (night) {
        scene.background = skyTex("#03060f", "#0b1530", "#1b2a4a"); scene.environment = ENV.night; scene.fog = new T.Fog(0x0b1530, 60, 220);
        sun.intensity = 0.25; sun.color.set(0x9db4ff); hemi.intensity = 0.12; renderer.toneMappingExposure = 1.15;
      } else {
        scene.background = skyTex("#4a8fd6", "#a5cff0", "#e6f2f8"); scene.environment = ENV.day; scene.fog = new T.Fog(0xcfe3ef, 80, 300);
        sun.intensity = 2.2; sun.color.set(0xfff0d8); hemi.intensity = 0.55; renderer.toneMappingExposure = 1.05;
      }
      Object.values(MATS).forEach((m) => { if (m.userData.glow) m.emissiveIntensity = night ? 2.4 : 0.4; if (m.userData.glassNight !== undefined) m.emissiveIntensity = night ? 0.25 : 0; });
      clouds.forEach((c) => c.material.color.set(night ? 0x26304d : 0xffffff));
      lightsDirty = true;
    };
    this.setNight(false);

    function resize() {
      const w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.fov = w / h < 0.8 ? 62 : 50; camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize); ro.observe(container); resize();

    // ---------- Sikl ----------
    const clock = new T.Clock();
    let raf = 0, alive = true;
    function loop() {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      if (walk.on) stepWalk(dt);
      else {
        if (goal) {
          cam.theta += (goal.theta - cam.theta) * 0.08; cam.phi += (goal.phi - cam.phi) * 0.08; cam.r += (goal.r - cam.r) * 0.08;
          cam.target.x += (goal.x - cam.target.x) * 0.08; cam.target.z += (goal.z - cam.target.z) * 0.08;
          if (Math.abs(goal.r - cam.r) < 0.05 && Math.abs(goal.x - cam.target.x) < 0.02) goal = null;
        }
        cam.target.y += (viewLevel * H * (mode === "view" ? 0 : 1) * 0.6 - cam.target.y) * 0.1;
        applyCam();
      }
      clouds.forEach((c) => { c.position.x += c.userData.v * dt; if (c.position.x > 220) c.position.x = -220; });
      if (roofDirty) buildRoofs();
      if (lightsDirty) refreshLights();
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(loop);

    this.snapshot = () => { renderer.render(scene, camera); return renderer.domElement.toDataURL("image/jpeg", 0.8); };
    this.destroy = () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku);
      renderer.dispose(); pmrem.dispose(); el.remove();
    };
  }
  Arch3D.CATALOG = CAT;
  Arch3D.BY_ID = BY_ID;
  Arch3D.CATEGORIES = CATEGORIES;
  Arch3D.PALETTE = PALETTE;
  Arch3D.MAXL = MAXL;
  Arch3D.HALF = HALF;
  window.SofiArch3D = Arch3D;
})();
