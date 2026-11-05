/* SNAYPER — 3D dunyo: osmon, maydon, ikki uy (qizil va ko'k), panalar, daraxtlar,
   robot personajlar (RobotExpressive, Quaternius, CC0) va snayper miltiq modeli.
   Barcha o'lchamlar metrda. Qizil jamoa z<0 da, ko'k jamoa z>0 da. */
(() => {
  "use strict";
  const T = window.THREE;

  const BOUND = { x: 38, z: 62 };
  const HOUSE_Z = 48;
  const TEAM = { r: { col: 0xd93a32, css: "#ef4444" }, b: { col: 0x2176d9, css: "#3b82f6" } };
  const MOBILE = window.matchMedia && matchMedia("(pointer: coarse)").matches;
  const LOW = /[?&]snq=low/.test(location.search);

  /* ---------- Yordamchilar ---------- */
  let seed = 1234567;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const rr = (a, b) => a + (b - a) * rnd();

  function tex(size, draw, rep = 1) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    draw(g, size);
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(rep, rep);
    t.encoding = T.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }
  function speckle(g, s, n, cols, rmin, rmax, a = 1) {
    for (let i = 0; i < n; i++) {
      g.globalAlpha = a * rr(0.3, 1);
      g.fillStyle = cols[(rnd() * cols.length) | 0];
      const r = rr(rmin, rmax);
      g.beginPath(); g.arc(rnd() * s, rnd() * s, r, 0, 6.283); g.fill();
    }
    g.globalAlpha = 1;
  }

  /* ---------- Teksturalar ---------- */
  function makeTextures() {
    const grass = tex(512, (g, s) => {
      g.fillStyle = "#4f7a2e"; g.fillRect(0, 0, s, s);
      speckle(g, s, 2600, ["#5d8a35", "#44692a", "#6a9a3c", "#3e5f24", "#7da848"], 1, 5, 0.55);
      g.strokeStyle = "rgba(160,200,90,.25)";
      for (let i = 0; i < 1400; i++) { const x = rnd() * s, y = rnd() * s; g.beginPath(); g.moveTo(x, y); g.lineTo(x + rr(-2, 2), y - rr(3, 8)); g.stroke(); }
      speckle(g, s, 90, ["#6b5a3a", "#7a6847"], 2, 7, 0.35);
    });
    const dirt = tex(512, (g, s) => {
      g.fillStyle = "#8a7552"; g.fillRect(0, 0, s, s);
      speckle(g, s, 3200, ["#9c8660", "#76633f", "#a8936b", "#6a573a", "#b5a07a"], 1, 4, 0.6);
      speckle(g, s, 260, ["#5b4b31", "#c2b08a"], 2, 6, 0.4);
    });
    const brick = tex(512, (g, s) => {
      g.fillStyle = "#b7a38c"; g.fillRect(0, 0, s, s);
      const rows = 16, bw = s / 6, bh = s / rows;
      for (let r = 0; r < rows; r++) {
        const off = (r % 2) * bw / 2;
        for (let c = -1; c < 7; c++) {
          const h = rr(0, 1);
          g.fillStyle = `rgb(${150 + h * 45 | 0},${62 + h * 25 | 0},${44 + h * 18 | 0})`;
          g.fillRect(c * bw + off + 2, r * bh + 2, bw - 4, bh - 4);
          g.globalAlpha = 0.25; g.fillStyle = "#000";
          g.fillRect(c * bw + off + 2, r * bh + bh - 5, bw - 4, 3);
          g.globalAlpha = 1;
        }
      }
      speckle(g, s, 1400, ["#000", "#fff"], 0.5, 1.6, 0.08);
    });
    const plaster = tex(512, (g, s) => {
      g.fillStyle = "#d9dfe6"; g.fillRect(0, 0, s, s);
      speckle(g, s, 3500, ["#c8d0d9", "#e7ecf1", "#b9c3ce"], 1, 4, 0.45);
      g.strokeStyle = "rgba(90,100,115,.18)"; g.lineWidth = 1.5;
      for (let i = 0; i < 9; i++) { let x = rnd() * s, y = rnd() * s; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += rr(-14, 14); y += rr(6, 18); g.lineTo(x, y); } g.stroke(); }
      const grd = g.createLinearGradient(0, s * 0.75, 0, s);
      grd.addColorStop(0, "rgba(0,0,0,0)"); grd.addColorStop(1, "rgba(70,60,40,.22)");
      g.fillStyle = grd; g.fillRect(0, 0, s, s);
    });
    const concrete = tex(512, (g, s) => {
      g.fillStyle = "#9a9a94"; g.fillRect(0, 0, s, s);
      speckle(g, s, 4000, ["#8a8a85", "#a9a9a3", "#7d7d78", "#b4b4ad"], 1, 3, 0.5);
      speckle(g, s, 60, ["#5f5f5a"], 2, 5, 0.4);
      g.strokeStyle = "rgba(60,60,58,.35)"; g.lineWidth = 2;
      g.strokeRect(1, 1, s - 2, s - 2);
    });
    const wood = tex(512, (g, s) => {
      g.fillStyle = "#8b5e34"; g.fillRect(0, 0, s, s);
      const planks = 6, pw = s / planks;
      for (let p = 0; p < planks; p++) {
        const h = rr(-18, 18);
        g.fillStyle = `rgb(${135 + h | 0},${90 + h * 0.7 | 0},${52 + h * 0.4 | 0})`;
        g.fillRect(p * pw + 1, 0, pw - 2, s);
        g.strokeStyle = "rgba(60,35,15,.35)";
        for (let k = 0; k < 14; k++) { const x = p * pw + rr(4, pw - 4); g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + rr(-6, 6), s * 0.3, x + rr(-6, 6), s * 0.7, x + rr(-3, 3), s); g.stroke(); }
        g.fillStyle = "rgba(30,18,8,.6)"; g.fillRect(p * pw, 0, 2, s);
      }
    });
    const crate = tex(256, (g, s) => {
      g.fillStyle = "#9a6b3a"; g.fillRect(0, 0, s, s);
      for (let i = 0; i < 5; i++) { g.fillStyle = i % 2 ? "#8c5f31" : "#a5753f"; g.fillRect(0, i * s / 5, s, s / 5 - 2); }
      g.strokeStyle = "#5b3b1c"; g.lineWidth = 18; g.strokeRect(9, 9, s - 18, s - 18);
      g.lineWidth = 16; g.beginPath(); g.moveTo(14, 14); g.lineTo(s - 14, s - 14); g.stroke();
      g.strokeStyle = "rgba(255,230,180,.15)"; g.lineWidth = 2; g.strokeRect(18, 18, s - 36, s - 36);
      speckle(g, s, 500, ["#000"], 0.5, 1.5, 0.15);
    });
    const sand = tex(256, (g, s) => {
      g.fillStyle = "#b59c6e"; g.fillRect(0, 0, s, s);
      speckle(g, s, 1800, ["#a68d5f", "#c4ab7b", "#9a8256"], 0.8, 2.5, 0.6);
      g.strokeStyle = "rgba(80,60,30,.3)";
      for (let i = 0; i < 40; i++) { g.beginPath(); g.moveTo(rnd() * s, 0); g.lineTo(rnd() * s, s); g.stroke(); }
    });
    const bark = tex(256, (g, s) => {
      g.fillStyle = "#4e3a28"; g.fillRect(0, 0, s, s);
      for (let i = 0; i < 70; i++) { g.strokeStyle = rnd() > 0.5 ? "rgba(25,15,8,.7)" : "rgba(110,90,65,.5)"; g.lineWidth = rr(1, 3); const x = rnd() * s; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + rr(-8, 8), s); g.stroke(); }
    });
    const blade = (() => {
      const c = document.createElement("canvas"); c.width = 64; c.height = 128;
      const g = c.getContext("2d");
      for (let i = 0; i < 9; i++) {
        const x = 8 + i * 6 + rr(-2, 2), lean = rr(-12, 12);
        const grd = g.createLinearGradient(0, 128, 0, 0);
        grd.addColorStop(0, "#2f4a19"); grd.addColorStop(1, rnd() > 0.5 ? "#9ec65a" : "#7fae45");
        g.fillStyle = grd;
        g.beginPath(); g.moveTo(x - 3, 128); g.quadraticCurveTo(x + lean * 0.3, 60, x + lean, rr(4, 40)); g.quadraticCurveTo(x + lean * 0.3 + 2, 60, x + 3, 128); g.fill();
      }
      const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t;
    })();
    const cloud = (() => {
      const c = document.createElement("canvas"); c.width = 256; c.height = 128;
      const g = c.getContext("2d");
      for (let i = 0; i < 26; i++) {
        const x = rr(50, 206), y = rr(48, 90), r = rr(18, 40);
        const grd = g.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, "rgba(255,255,255,.85)"); grd.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
      }
      const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t;
    })();
    return { grass, dirt, brick, plaster, concrete, wood, crate, sand, bark, blade, cloud };
  }

  /* ---------- Batch: ko'p qutini bitta mesh qilib birlashtirish ---------- */
  class Batch {
    constructor() { this.pos = []; this.nor = []; this.uv = []; this.col = []; }
    add(geo, ao) {
      const g = geo.index ? geo.toNonIndexed() : geo;
      const p = g.attributes.position.array, n = g.attributes.normal.array, u = g.attributes.uv.array;
      for (let i = 0; i < p.length; i += 3) {
        this.pos.push(p[i], p[i + 1], p[i + 2]);
        this.nor.push(n[i], n[i + 1], n[i + 2]);
        const k = ao ? ao(p[i], p[i + 1], p[i + 2], n[i + 1]) : 1;
        this.col.push(k, k, k);
      }
      for (let i = 0; i < u.length; i++) this.uv.push(u[i]);
    }
    mesh(mat) {
      const g = new T.BufferGeometry();
      g.setAttribute("position", new T.Float32BufferAttribute(this.pos, 3));
      g.setAttribute("normal", new T.Float32BufferAttribute(this.nor, 3));
      g.setAttribute("uv", new T.Float32BufferAttribute(this.uv, 2));
      g.setAttribute("color", new T.Float32BufferAttribute(this.col, 3));
      g.computeBoundingSphere();
      const m = new T.Mesh(g, mat);
      m.castShadow = true; m.receiveShadow = true;
      return m;
    }
  }

  /** Quti geometriyasi: UV dunyo o'lchamiga qarab (tekstura cho'zilmaydi). */
  function boxGeo(w, h, d, tile) {
    const g = new T.BoxGeometry(w, h, d);
    const uv = g.attributes.uv;
    const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
      const i = f * 4 + k;
      uv.setXY(i, uv.getX(i) * dims[f][0] / tile, uv.getY(i) * dims[f][1] / tile);
    }
    return g;
  }
  const aoFn = (x, y, z, ny) => { const a = Math.min(1, 0.62 + y * 0.32); return ny < -0.5 ? 0.7 : a; };

  /* ---------- Dunyo qurish ---------- */
  function build(renderer) {
    seed = 1234567;
    const TX = makeTextures();
    const scene = new T.Scene();
    const colliders = [];   // {min:[x,y,z], max:[x,y,z]}
    const ramps = [];       // {x0,x1,z0,z1, axis, a0, a1, y0, y1}
    const updaters = [];
    const uTime = { value: 0 };

    const M = {
      brick: new T.MeshStandardMaterial({ map: TX.brick, roughness: 0.92, vertexColors: true }),
      plaster: new T.MeshStandardMaterial({ map: TX.plaster, roughness: 0.88, vertexColors: true }),
      concrete: new T.MeshStandardMaterial({ map: TX.concrete, roughness: 0.95, vertexColors: true }),
      wood: new T.MeshStandardMaterial({ map: TX.wood, roughness: 0.8, vertexColors: true }),
      crate: new T.MeshStandardMaterial({ map: TX.crate, roughness: 0.85, vertexColors: true }),
      sand: new T.MeshStandardMaterial({ map: TX.sand, roughness: 1, vertexColors: true }),
      trim: new T.MeshStandardMaterial({ color: 0x3a3f45, roughness: 0.6, metalness: 0.3, vertexColors: true }),
      redTrim: new T.MeshStandardMaterial({ color: 0xa3201b, roughness: 0.55, vertexColors: true }),
      blueTrim: new T.MeshStandardMaterial({ color: 0x1b4f9c, roughness: 0.55, vertexColors: true }),
    };
    const TILE = { brick: 2, plaster: 2.5, concrete: 3, wood: 2.4, crate: 1.2, sand: 1.2, trim: 1, redTrim: 1, blueTrim: 1 };
    const B = {};
    const batch = (k) => B[k] || (B[k] = new Batch());

    function box(mat, cx, cy, cz, w, h, d, col = true) {
      const g = boxGeo(w, h, d, TILE[mat]);
      g.translate(cx, cy, cz);
      batch(mat).add(g, aoFn);
      if (col) colliders.push({ min: [cx - w / 2, cy - h / 2, cz - d / 2], max: [cx + w / 2, cy + h / 2, cz + d / 2] });
    }
    /** Min/max bilan quti. */
    const boxMM = (mat, x0, y0, z0, x1, y1, z1, col = true) => box(mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0), col);

    /** Devor (x yoki z bo'ylab) teshiklar bilan: holes = [[u0,u1,v0,v1]] devor bo'ylab u, balandlik v. */
    function wall(mat, axis, fixed, u0, u1, y0, y1, th, holes) {
      const us = [u0, u1];
      holes.forEach((h) => us.push(h[0], h[1]));
      const xs = [...new Set(us)].sort((a, b) => a - b);
      for (let i = 0; i < xs.length - 1; i++) {
        const a = xs[i], b = xs[i + 1];
        if (b - a < 1e-4) continue;
        const mid = (a + b) / 2;
        const hs = holes.filter((h) => mid > h[0] && mid < h[1]).sort((p, q) => p[2] - q[2]);
        let y = y0;
        const seg = (ya, yb) => { if (yb - ya < 1e-4) return; if (axis === "x") boxMM(mat, a, ya, fixed - th / 2, b, yb, fixed + th / 2); else boxMM(mat, fixed - th / 2, ya, a, fixed + th / 2, yb, b); };
        hs.forEach((h) => { seg(y, h[2]); y = h[3]; });
        seg(y, y1);
      }
    }
    /** Teshik atrofidagi ramka (faqat ko'rinish). */
    function frame(axis, fixed, h, th, sign) {
      const [u0, u1, v0, v1] = h, t = 0.09, out = fixed + sign * (th / 2 + 0.02);
      const put = (a0, a1, b0, b1) => axis === "x" ? boxMM("trim", a0, b0, out - 0.04, a1, b1, out + 0.04, false) : boxMM("trim", out - 0.04, b0, a0, out + 0.04, b1, a1, false);
      put(u0 - t, u1 + t, v1, v1 + t);
      if (v0 > 0.05) put(u0 - t, u1 + t, v0 - t, v0);
      put(u0 - t, u0, v0, v1); put(u1, u1 + t, v0, v1);
      if (v0 > 0.05) { // deraza tokchasi
        if (axis === "x") boxMM("concrete", u0 - 0.12, v0 - 0.06, out - 0.1 * sign - 0.1, u1 + 0.12, v0, out + 0.12 * sign + 0.1, false);
        else boxMM("concrete", out - 0.12 * sign - 0.1, v0 - 0.06, u0 - 0.12, out + 0.12 * sign + 0.1, v0, u1 + 0.12, false);
      }
    }
    /** Zinapoya: ko'rinishi pog'ona, to'qnashuvi qiya. */
    function stairs(xa, xb, z0, z1, ya, yb) {
      const n = Math.round(Math.abs(yb - ya) / 0.2);
      for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n;
        const xA = xa + (xb - xa) * t0, xB = xa + (xb - xa) * t1;
        boxMM("wood", Math.min(xA, xB), ya, z0, Math.max(xA, xB), ya + (yb - ya) * t1, z1, false);
      }
      ramps.push({ x0: Math.min(xa, xb), x1: Math.max(xa, xb), z0: Math.min(z0, z1), z1: Math.max(z0, z1), axis: "x", a0: xa, a1: xb, y0: ya, y1: yb });
    }

    /* ----- Uy (lokal: old tomoni +z, markaz 0) ----- */
    const spawns = { r: [], b: [] };
    const nests = { r: [], b: [] };
    const nodes = []; // {id, team, x, y, z, nest, link:[]}
    function house(team) {
      const s = team === "r" ? 1 : -1, cz = team === "r" ? -HOUSE_Z : HOUSE_Z;
      const X = (lx) => lx * s, Z = (lz) => cz + lz * s;
      const W = team === "r" ? "brick" : "plaster";
      const ACC = team === "r" ? "redTrim" : "blueTrim";
      const th = 0.3, H1 = 3.0, F2 = 3.2, H2 = 6.2, RF = 6.4;
      const L = (lx0, lx1) => [Math.min(X(lx0), X(lx1)), Math.max(X(lx0), X(lx1))];
      const LZ = (lz0, lz1) => [Math.min(Z(lz0), Z(lz1)), Math.max(Z(lz0), Z(lz1))];
      const holesX = (arr) => arr.map(([a, b, v0, v1]) => { const [p, q] = L(a, b); return [p, q, v0, v1]; });
      const holesZ = (arr) => arr.map(([a, b, v0, v1]) => { const [p, q] = LZ(a, b); return [p, q, v0, v1]; });
      // Old devor (dushman tomonga)
      const front = holesX([[-0.8, 0.8, 0, 2.3], [-5, -3, 1.0, 2.2], [3, 5, 1.0, 2.2], [-5.5, -3.0, 4.2, 5.4], [-1.2, 1.2, 4.2, 5.4], [3.0, 5.5, 4.2, 5.4]]);
      wall(W, "x", Z(5), ...L(-7, 7), 0, H2, th, front);
      front.forEach((h) => frame("x", Z(5), h, th, s));
      // Orqa devor
      const back = holesX([[-0.8, 0.8, 0, 2.3], [-0.8, 0.8, 4.2, 5.2]]);
      wall(W, "x", Z(-5), ...L(-7, 7), 0, H2, th, back);
      back.forEach((h) => frame("x", Z(-5), h, th, -s));
      // Yon devorlar
      const side = holesZ([[-1, 1, 1.0, 2.2], [-1.5, 1.5, 4.2, 5.4]]);
      [-7, 7].forEach((lx) => { wall(W, "z", X(lx), ...LZ(-4.85, 4.85), 0, H2, th, side); side.forEach((h) => frame("z", X(lx), h, th, Math.sign(X(lx)))); });
      // 2-qavat poli (zinapoya teshigi bilan): teshik lx -6.7..-1.5, lz -4.85..-3.3
      const rect = (lx0, lx1, lz0, lz1, y0, y1) => { if (lx1 - lx0 < 1e-3 || lz1 - lz0 < 1e-3) return; const [a, b] = L(lx0, lx1), [c, d] = LZ(lz0, lz1); boxMM("concrete", a, y0, c, b, y1, d); };
      const slab = (y0, y1, hx0, hx1) => {
        rect(-6.85, 6.85, -3.3, 4.85, y0, y1);
        rect(-6.85, Math.min(hx0, hx1), -4.85, -3.3, y0, y1);
        rect(Math.max(hx0, hx1), 6.85, -4.85, -3.3, y0, y1);
      };
      slab(H1, F2, -6.7, -1.5);
      slab(H2, RF, 1.5, 6.7);
      // Pol qoplamalari (yog'och, faqat ko'rinish)
      boxMM("wood", ...[L(-6.85, 6.85)[0], 0, LZ(-4.85, 4.85)[0], L(-6.85, 6.85)[1], 0.03, LZ(-4.85, 4.85)[1]], false);
      // Parapet (tom chekkasi)
      const ph = 1.1;
      wall(W, "x", Z(5.0), ...L(-7.15, 7.15), RF, RF + ph, th, []);
      wall(W, "x", Z(-5.0), ...L(-7.15, 7.15), RF, RF + ph, th, []);
      [-7, 7].forEach((lx) => wall(W, "z", X(lx), ...LZ(-4.85, 4.85), RF, RF + ph, th, []));
      // Rangli hoshiya: faqat devor chekkalari bo'ylab (halqa)
      const ring = (y0, y1, out, w) => {
        const [xa, xb] = L(-7 - out, 7 + out), [za, zb] = LZ(-5 - out, 5 + out);
        boxMM(ACC, xa, y0, za, xb, y1, za + w, false); boxMM(ACC, xa, y0, zb - w, xb, y1, zb, false);
        boxMM(ACC, xa, y0, za + w, xa + w, y1, zb - w, false); boxMM(ACC, xb - w, y0, za + w, xb, y1, zb - w, false);
      };
      ring(RF + ph, RF + ph + 0.1, 0.25, 0.5);
      ring(2.95, 3.2, 0.2, 0.22);
      // Zinapoyalar
      stairs(X(-1.5), X(-6.7), ...LZ(-4.7, -3.35), 0, F2);
      stairs(X(1.5), X(6.7), ...LZ(-4.7, -3.35), F2, RF);
      // To'siq panjarasi teshik bo'yida (faqat ko'rinish + to'qnashuv)
      boxMM("trim", ...[L(-5.7, -1.5)[0], F2, LZ(-3.32, -3.25)[0], L(-5.7, -1.5)[1], F2 + 0.9, LZ(-3.32, -3.25)[1]]);
      boxMM("trim", ...[L(1.5, 5.7)[0], RF, LZ(-3.32, -3.25)[0], L(1.5, 5.7)[1], RF + 0.9, LZ(-3.32, -3.25)[1]]);
      // Zinapoya tagidan o'tib bo'lmasin (yashirin to'siq)
      { const [a, b] = L(-6.7, -3.6), [c, d] = LZ(-4.7, -3.35); colliders.push({ min: [a, 0, c], max: [b, 1.15, d] }); }
      { const [a, b] = L(3.6, 6.7), [c, d] = LZ(-4.7, -3.35); colliders.push({ min: [a, F2, c], max: [b, F2 + 1.15, d] }); }
      // Ichki jihozlar: qutilar va stol (pana)
      box("crate", X(-4.5), 0.5, Z(1.8), 1, 1, 1); box("crate", X(-4.5), 1.4, Z(1.8), 0.8, 0.8, 0.8);
      box("crate", X(4.8), 0.5, Z(2.2), 1, 1, 1);
      box("crate", X(-5.5), F2 + 0.45, Z(2.5), 0.9, 0.9, 0.9);
      box("crate", X(5.2), F2 + 0.45, Z(1.2), 0.9, 0.9, 0.9);
      boxMM("wood", L(-1.6, 1.6)[0], 0.75, LZ(-1.2, 0.2)[0], L(-1.6, 1.6)[1], 0.82, LZ(-1.2, 0.2)[1]);
      // Tom: qum qoplari
      box("sand", X(-2.5), RF + 0.3, Z(3.6), 2.4, 0.6, 0.7); box("sand", X(3), RF + 0.3, Z(3.6), 2.0, 0.6, 0.7);
      // Bayroq
      flag(team, X(-6.2), RF, Z(-4.2));
      // Jamoa belgisi old devorda
      emblem(team, X(-2.05), Z(5) + s * (th / 2 + 0.03), s); emblem(team, X(2.05), Z(5) + s * (th / 2 + 0.03), s);

      // Spawn, uyalar va yo'l tugunlari
      [[-4.5, -0.5], [-2, 0.5], [0, -1.5], [2, 0.5], [4.5, -0.5]].forEach(([lx, lz]) => spawns[team].push({ x: X(lx), y: 0, z: Z(lz), yaw: team === "r" ? Math.PI : 0 }));
      const N = (key, lx, y, lz, nest) => { const n = { id: team + key, team, x: X(lx), y, z: Z(lz), nest: !!nest, link: [] }; nodes.push(n); if (nest) nests[team].push(n); return n; };
      const lk = (a, b) => { a.link.push(b.id); b.link.push(a.id); };
      const h0 = N("h0", 0, 0, 0), h1 = N("h1", 0, 0, 3.9), h2 = N("h2", 0, 0, 6.8);
      const h3 = N("h3", -0.9, 0, -4.0), h4 = N("h4", -6.2, F2, -4.0), h5 = N("h5", -6.0, F2, -2.2), h6 = N("h6", 0, F2, 0);
      const w1 = N("w1", -4.25, F2, 4.35, 1), w2 = N("w2", 0, F2, 4.35, 1), w3 = N("w3", 4.25, F2, 4.35, 1);
      const s0 = N("s0", 0.9, F2, -4.0), s1 = N("s1", 6.2, RF, -4.0), s2 = N("s2", 6.0, RF, -2.2), rc = N("rc", 0, RF, 0);
      const r1 = N("r1", -5, RF, 4.35, 1), r2 = N("r2", 0.3, RF, 4.35, 1), r3 = N("r3", 5.5, RF, 4.35, 1);
      const g1 = N("g1", -4, 0, 4.35, 1), g2 = N("g2", 4, 0, 4.35, 1);
      lk(h0, h1); lk(h1, h2); lk(h0, h3); lk(h3, h4); lk(h4, h5); lk(h5, h6); lk(h6, w1); lk(h6, w2); lk(h6, w3);
      lk(h6, s0); lk(s0, s1); lk(s1, s2); lk(s2, rc); lk(rc, r1); lk(rc, r2); lk(rc, r3); lk(h0, g1); lk(h0, g2); lk(h1, g1); lk(h1, g2);
      return h2;
    }

    /* ----- Bayroq (shamolda hilpiraydi) ----- */
    function flag(team, x, y, z) {
      const pole = new T.Mesh(new T.CylinderGeometry(0.05, 0.06, 4.2, 8), new T.MeshStandardMaterial({ color: 0xcfd4da, metalness: 0.8, roughness: 0.3 }));
      pole.position.set(x, y + 2.1, z); pole.castShadow = true; scene.add(pole);
      const c = document.createElement("canvas"); c.width = 256; c.height = 160;
      const g = c.getContext("2d");
      g.fillStyle = TEAM[team].css; g.fillRect(0, 0, 256, 160);
      g.fillStyle = "rgba(255,255,255,.92)"; g.beginPath(); g.arc(128, 80, 46, 0, 6.283); g.fill();
      g.fillStyle = TEAM[team].css; g.font = "900 64px system-ui"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("🤖", 128, 84);
      const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding;
      const geo = new T.PlaneGeometry(1.9, 1.2, 20, 10);
      geo.translate(0.95, 0, 0);
      const mat = new T.MeshStandardMaterial({ map: t, side: T.DoubleSide, roughness: 0.8 });
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uTime = uTime;
        sh.vertexShader = "uniform float uTime;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
          float k = position.x / 1.9;
          transformed.z += sin(position.x * 3.2 - uTime * 5.0) * 0.18 * k + sin(position.y * 2.0 + uTime * 3.0) * 0.05 * k;
          transformed.y -= k * k * 0.12;`);
      };
      const m = new T.Mesh(geo, mat);
      m.position.set(x, y + 3.6, z); m.castShadow = true;
      m.rotation.y = team === "r" ? 0.4 : Math.PI + 0.4;
      scene.add(m);
    }
    function emblem(team, x, z, s) {
      const c = document.createElement("canvas"); c.width = c.height = 256;
      const g = c.getContext("2d");
      g.fillStyle = TEAM[team].css; g.beginPath(); g.arc(128, 128, 120, 0, 6.283); g.fill();
      g.strokeStyle = "#fff"; g.lineWidth = 12; g.beginPath(); g.arc(128, 128, 100, 0, 6.283); g.stroke();
      g.fillStyle = "#fff"; g.font = "900 120px system-ui"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(team === "r" ? "Q" : "K", 128, 136);
      const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding;
      const m = new T.Mesh(new T.CircleGeometry(0.42, 32), new T.MeshStandardMaterial({ map: t, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2 }));
      m.position.set(x, 1.55, z); m.rotation.y = s > 0 ? 0 : Math.PI;
      scene.add(m);
    }

    const doorR = house("r"), doorB = house("b");

    /* ----- Maydon panalari (markazga nisbatan simmetrik) ----- */
    const sym = (fn) => { fn(1); fn(-1); };
    // O'rtadagi vayrona devor
    sym((k) => {
      wall("concrete", "x", 0, ...(k > 0 ? [12, 20] : [-20, -12]), 0, 2.4, 0.4, []);
    });
    wall("concrete", "x", 0, -4.5, 4.5, 0, 2.6, 0.4, [[-1.2, 1.2, 1.1, 1.9]]);
    box("concrete", 20.2, 0.9, 0, 0.4, 1.8, 0.4); box("concrete", -20.2, 0.9, 0, 0.4, 1.8, 0.4);
    // Qum qoplari, qutilar, beton to'siqlar
    sym((k) => {
      box("sand", -8 * k, 0.45, -34 * k, 3.2, 0.9, 0.8); box("sand", -8 * k, 1.0, -34 * k, 2.4, 0.3, 0.7, false);
      box("sand", 8 * k, 0.45, -34 * k, 3.2, 0.9, 0.8); box("sand", 8 * k, 1.0, -34 * k, 2.4, 0.3, 0.7, false);
      box("crate", -18 * k, 0.6, -24 * k, 1.2, 1.2, 1.2); box("crate", -16.8 * k, 0.6, -24.2 * k, 1.2, 1.2, 1.2); box("crate", -17.4 * k, 1.75, -24.1 * k, 1.1, 1.1, 1.1);
      box("crate", 18 * k, 0.6, -24 * k, 1.2, 1.2, 1.2); box("crate", 18.6 * k, 1.75, -24 * k, 1.1, 1.1, 1.1);
      box("concrete", -10 * k, 0.55, -14 * k, 2.8, 1.1, 0.5); box("concrete", 10 * k, 0.55, -14 * k, 2.8, 1.1, 0.5);
      box("concrete", -27 * k, 0.6, -8 * k, 0.5, 1.2, 3.2); box("concrete", 27 * k, 0.6, 8 * k, 0.5, 1.2, 3.2);
      box("crate", 0, 0.6, -22 * k, 1.2, 1.2, 1.2); box("crate", 1.3 * k, 0.5, -22.4 * k, 1, 1, 1);
      box("wood", -30 * k, 0.9, -38 * k, 3.6, 1.8, 0.15); // eski taxta devor
    });

    // Chegara (ko'rinmas devorlar)
    colliders.push({ min: [-BOUND.x - 1, 0, -BOUND.z - 1], max: [-BOUND.x, 30, BOUND.z + 1] }, { min: [BOUND.x, 0, -BOUND.z - 1], max: [BOUND.x + 1, 30, BOUND.z + 1] },
      { min: [-BOUND.x, 0, -BOUND.z - 1], max: [BOUND.x, 30, -BOUND.z] }, { min: [-BOUND.x, 0, BOUND.z], max: [BOUND.x, 30, BOUND.z + 1] });

    // Batchlarni sahnaga qo'shish
    Object.entries(B).forEach(([k, b]) => scene.add(b.mesh(M[k])));

    /* ----- Maydon tugunlari (botlar uchun) ----- */
    const fieldPts = [["f0", 0, -38.5], ["f1", -8, -35.3, 1], ["f2", 8, -35.3, 1], ["f3", -17.4, -25.6, 1], ["f4", 18.2, -25.6, 1], ["f5", -10, -15.3, 1], ["f6", 10, -15.3, 1], ["f7", -16, -1.1, 1], ["f8", 0, -1.1, 1], ["f9", 16, -1.1, 1], ["fa", 0, -23.6, 1]];
    ["r", "b"].forEach((team) => {
      const k = team === "r" ? 1 : -1;
      const byKey = {};
      fieldPts.forEach(([key, x, z, nest]) => { const n = { id: team + key, team, x: x * k, y: 0, z: z * k, nest: !!nest, link: [] }; nodes.push(n); byKey[key] = n; if (nest) nests[team].push(n); });
      const lk = (a, b) => { byKey[a].link.push(team + b); byKey[b].link.push(team + a); };
      [["f0", "f1"], ["f0", "f2"], ["f1", "f3"], ["f2", "f4"], ["f3", "f5"], ["f4", "f6"], ["f5", "f7"], ["f5", "f8"], ["f6", "f8"], ["f6", "f9"], ["f0", "fa"], ["fa", "f5"], ["fa", "f6"]].forEach(([a, b]) => lk(a, b));
      const door = team === "r" ? doorR : doorB;
      door.link.push(team + "f0"); byKey.f0.link.push(door.id);
    });
    const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

    /* ----- Yer ----- */
    const groundGeo = new T.PlaneGeometry(240, 300, 1, 1);
    groundGeo.rotateX(-Math.PI / 2);
    const guv = groundGeo.attributes.uv;
    for (let i = 0; i < guv.count; i++) guv.setXY(i, guv.getX(i) * 240 / 6, guv.getY(i) * 300 / 6);
    const ground = new T.Mesh(groundGeo, new T.MeshStandardMaterial({ map: TX.grass, roughness: 1 }));
    ground.receiveShadow = true;
    scene.add(ground);
    // Uylar orasidagi tuproq yo'l
    const pathGeo = new T.PlaneGeometry(5, 2 * HOUSE_Z - 10, 1, 30);
    pathGeo.rotateX(-Math.PI / 2);
    const pp = pathGeo.attributes.position, puv = pathGeo.attributes.uv;
    for (let i = 0; i < pp.count; i++) { const z = pp.getZ(i); pp.setX(i, pp.getX(i) * (1 + 0.25 * Math.sin(z * 0.15)) + Math.sin(z * 0.07) * 1.5); puv.setXY(i, puv.getX(i) * 5 / 4, puv.getY(i) * (2 * HOUSE_Z - 10) / 4); }
    const pathMat = new T.MeshStandardMaterial({ map: TX.dirt, roughness: 1, transparent: true, opacity: 0.92, polygonOffset: true, polygonOffsetFactor: -1 });
    pathMat.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace("#include <alphamap_fragment>", "#include <alphamap_fragment>\n diffuseColor.a *= smoothstep(0.0, 0.25, vUv.x / 1.25) * smoothstep(0.0, 0.25, 1.0 - vUv.x / 1.25);"); };
    const path = new T.Mesh(pathGeo, pathMat);
    path.position.y = 0.012; path.receiveShadow = true;
    scene.add(path);
    [-1, 1].forEach((k) => { const yard = new T.Mesh(new T.CircleGeometry(9, 40), pathMat); yard.rotation.x = -Math.PI / 2; yard.position.set(0, 0.011, k * (HOUSE_Z + 8.5)); yard.receiveShadow = true; scene.add(yard); });

    /* ----- Daraxtlar ----- */
    const trunkGeo = new T.CylinderGeometry(0.16, 0.26, 3.2, 8); trunkGeo.translate(0, 1.6, 0);
    const leafGeo = (() => {
      const parts = [];
      for (let i = 0; i < 6; i++) { const g = new T.IcosahedronGeometry(rr(1.1, 1.6), 1); g.translate(rr(-0.9, 0.9), 3.4 + rr(-0.3, 1.2), rr(-0.9, 0.9)); parts.push(g); }
      const b = new Batch(); parts.forEach((g) => b.add(g, (x, y) => 0.55 + Math.min(0.45, (y - 2.6) * 0.22)));
      return b.mesh(null).geometry;
    })();
    const leafMat = new T.MeshStandardMaterial({ color: 0x4c7a2c, roughness: 0.9, vertexColors: true, flatShading: true });
    leafMat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = uTime;
      sh.vertexShader = "uniform float uTime;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        vec4 wp0 = instanceMatrix * vec4(position, 1.0);
        float sway = (position.y - 2.5) * 0.06;
        transformed.x += sin(uTime * 1.3 + wp0.x * 0.3 + wp0.z * 0.2) * sway;
        transformed.z += cos(uTime * 1.1 + wp0.z * 0.3) * sway * 0.7;`);
    };
    const treeSpots = [];
    for (let i = 0; i < 26; i++) { const side = i % 2 ? 1 : -1; treeSpots.push([side * rr(31, 36.5), rr(-58, 58)]); }
    [[-24, -14], [24, 14], [-28, 22], [28, -22], [-12, 32], [12, -32]].forEach((p) => treeSpots.push(p));
    for (let i = 0; i < 40; i++) { const a = rnd() * 6.283; treeSpots.push([Math.cos(a) * rr(48, 70), Math.sin(a) * rr(70, 95)]); }
    const trunks = new T.InstancedMesh(trunkGeo, new T.MeshStandardMaterial({ map: TX.bark, roughness: 1 }), treeSpots.length);
    const leaves = new T.InstancedMesh(leafGeo, leafMat, treeSpots.length);
    const mtx = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(), ps = new T.Vector3();
    treeSpots.forEach(([x, z], i) => {
      const s = rr(0.85, 1.35);
      q.setFromAxisAngle(new T.Vector3(0, 1, 0), rnd() * 6.283); sc.set(s, s * rr(0.9, 1.15), s); ps.set(x, 0, z);
      mtx.compose(ps, q, sc); trunks.setMatrixAt(i, mtx); leaves.setMatrixAt(i, mtx);
      const c = new T.Color().setHSL(0.25 + rr(-0.04, 0.05), 0.5, 0.32 + rr(-0.05, 0.06));
      leaves.setColorAt(i, c);
      if (Math.abs(x) < BOUND.x && Math.abs(z) < BOUND.z) colliders.push({ min: [x - 0.3 * s, 0, z - 0.3 * s], max: [x + 0.3 * s, 3.2 * s, z + 0.3 * s] });
    });
    [trunks, leaves].forEach((m) => { m.castShadow = true; m.receiveShadow = true; scene.add(m); });

    /* ----- Toshlar ----- */
    const rockGeo = new T.IcosahedronGeometry(1, 2);
    const rp = rockGeo.attributes.position;
    for (let i = 0; i < rp.count; i++) { const v = new T.Vector3().fromBufferAttribute(rp, i); const n = 1 + 0.22 * Math.sin(v.x * 4.1 + v.y * 2.3) * Math.cos(v.z * 3.7) + rr(-0.05, 0.05); v.multiplyScalar(n); v.y *= 0.62; rp.setXYZ(i, v.x, v.y, v.z); }
    rockGeo.computeVertexNormals();
    const rockSpots = [];
    sym((k) => { [[-22, -32, 1.3], [22, -40, 1.1], [-6, -9, 0.9], [26, -16, 1.4], [-30, -48, 1.6], [14, -46, 0.8]].forEach(([x, z, s]) => rockSpots.push([x * k, z * k, s])); });
    for (let i = 0; i < 30; i++) rockSpots.push([rr(-36, 36), rr(-58, 58), rr(0.25, 0.5)]);
    const rocks = new T.InstancedMesh(rockGeo, new T.MeshStandardMaterial({ map: TX.concrete, color: 0xa7a197, roughness: 0.95 }), rockSpots.length);
    rockSpots.forEach(([x, z, s], i) => {
      q.setFromEuler(new T.Euler(rr(-0.2, 0.2), rnd() * 6.283, rr(-0.2, 0.2))); sc.set(s * rr(0.9, 1.3), s, s * rr(0.9, 1.2)); ps.set(x, s * 0.25, z);
      mtx.compose(ps, q, sc); rocks.setMatrixAt(i, mtx);
      if (s > 0.7) colliders.push({ min: [x - s * 0.9, 0, z - s * 0.9], max: [x + s * 0.9, s * 0.75, z + s * 0.9] });
    });
    rocks.castShadow = true; rocks.receiveShadow = true; scene.add(rocks);

    /* ----- O't (shamolda tebranadi) ----- */
    const bladeGeo = (() => { const a = new T.PlaneGeometry(0.7, 0.55); a.translate(0, 0.27, 0); const b = a.clone(); b.rotateY(Math.PI / 2); const bt = new Batch(); bt.add(a); bt.add(b); return bt.mesh(null).geometry; })();
    const grassMat = new T.MeshStandardMaterial({ map: TX.blade, alphaTest: 0.45, side: T.DoubleSide, roughness: 1 });
    grassMat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = uTime;
      sh.vertexShader = "uniform float uTime;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        vec4 wq = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        float w = position.y * (0.35 + 0.25 * sin(uTime * 0.7 + wq.x * 0.05));
        transformed.x += sin(uTime * 2.2 + wq.x * 0.4 + wq.z * 0.3) * w * 0.35;
        transformed.z += cos(uTime * 1.7 + wq.z * 0.4) * w * 0.2;`);
    };
    const GN = LOW ? 600 : MOBILE ? 3500 : 9000;
    const grassI = new T.InstancedMesh(bladeGeo, grassMat, GN);
    let gi = 0;
    const blocked = (x, z) => (Math.abs(x) < 8.5 && Math.abs(Math.abs(z) - HOUSE_Z) < 6.5) || Math.abs(x - Math.sin(z * 0.07) * 1.5) < 3;
    while (gi < GN) {
      const x = rr(-40, 40), z = rr(-64, 64);
      if (blocked(x, z)) continue;
      q.setFromAxisAngle(new T.Vector3(0, 1, 0), rnd() * 6.283); const s = rr(0.6, 1.3); sc.set(s, s * rr(0.7, 1.3), s); ps.set(x, 0, z);
      mtx.compose(ps, q, sc); grassI.setMatrixAt(gi, mtx);
      grassI.setColorAt(gi, new T.Color().setHSL(0.24 + rr(-0.03, 0.04), 0.45, 0.42 + rr(-0.08, 0.08)));
      gi++;
    }
    grassI.receiveShadow = true;
    scene.add(grassI);

    /* ----- Panjara (chegara bo'ylab) ----- */
    const postGeo = new T.BoxGeometry(0.14, 1.3, 0.14); postGeo.translate(0, 0.65, 0);
    const fencePts = [];
    for (let z = -BOUND.z; z <= BOUND.z; z += 3) { fencePts.push([-BOUND.x, z]); fencePts.push([BOUND.x, z]); }
    for (let x = -BOUND.x + 3; x < BOUND.x; x += 3) { fencePts.push([x, -BOUND.z]); fencePts.push([x, BOUND.z]); }
    const posts = new T.InstancedMesh(postGeo, new T.MeshStandardMaterial({ map: TX.wood, roughness: 0.9 }), fencePts.length);
    fencePts.forEach(([x, z], i) => { mtx.makeTranslation(x, 0, z); posts.setMatrixAt(i, mtx); });
    posts.castShadow = true; scene.add(posts);
    const railMat = new T.MeshStandardMaterial({ map: TX.wood, roughness: 0.9 });
    [0.5, 1.05].forEach((y) => {
      [[-BOUND.x, 0, 0.08, BOUND.z * 2], [BOUND.x, 0, 0.08, BOUND.z * 2], [0, -BOUND.z, BOUND.x * 2, 0.08], [0, BOUND.z, BOUND.x * 2, 0.08]].forEach(([x, z, w, d]) => {
        const r = new T.Mesh(new T.BoxGeometry(w, 0.12, d), railMat); r.position.set(x, y, z); r.castShadow = true; scene.add(r);
      });
    });

    /* ----- Tog'lar (orqa fon) ----- */
    const mGeo = new T.CylinderGeometry(330, 380, 70, 96, 6, true);
    const mp = mGeo.attributes.position;
    for (let i = 0; i < mp.count; i++) { const x = mp.getX(i), y = mp.getY(i), z = mp.getZ(i); const a = Math.atan2(z, x); if (y > 0) mp.setY(i, y * (0.5 + 0.5 * Math.abs(Math.sin(a * 5) * Math.cos(a * 3.3))) + 20 * Math.sin(a * 17)); }
    mGeo.computeVertexNormals();
    const mount = new T.Mesh(mGeo, new T.MeshStandardMaterial({ color: 0x6f8a6a, roughness: 1, side: T.BackSide, flatShading: true }));
    mount.position.y = 25; scene.add(mount);

    /* ----- Osmon ----- */
    const sunDir = new T.Vector3(0.45, 0.62, 0.35).normalize();
    const skyMat = new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: { uSun: { value: sunDir } },
      vertexShader: "varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `varying vec3 vD; uniform vec3 uSun;
        void main(){ float h = max(vD.y, 0.0);
          vec3 top = vec3(0.23,0.48,0.86), hor = vec3(0.78,0.87,0.95), low = vec3(0.62,0.7,0.62);
          vec3 c = mix(hor, top, pow(h, 0.55));
          if (vD.y < 0.0) c = mix(hor, low, min(1.0, -vD.y * 4.0));
          float s = max(dot(vD, uSun), 0.0);
          c += vec3(1.0,0.9,0.7) * (pow(s, 900.0) * 6.0 + pow(s, 12.0) * 0.25);
          gl_FragColor = vec4(c, 1.0); }`,
    });
    const sky = new T.Mesh(new T.SphereGeometry(450, 32, 16), skyMat);
    scene.add(sky);
    scene.fog = new T.Fog(0xc3d6e6, 90, 380);

    // Muhit yoritilishi (metal miltiq uchun aks)
    const envScene = new T.Scene();
    envScene.add(new T.Mesh(new T.SphereGeometry(10, 32, 16), skyMat.clone()));
    const pm = new T.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(envScene, 0.02).texture;
    pm.dispose();

    // Bulutlar
    const clouds = [];
    for (let i = 0; i < 14; i++) {
      const sp = new T.Sprite(new T.SpriteMaterial({ map: TX.cloud, transparent: true, opacity: rr(0.55, 0.9), depthWrite: false, fog: false }));
      sp.position.set(rr(-260, 260), rr(70, 120), rr(-260, 260)); sp.scale.set(rr(70, 130), rr(30, 50), 1);
      scene.add(sp); clouds.push(sp);
    }
    // Qushlar
    const birdGeo = new T.BufferGeometry();
    birdGeo.setAttribute("position", new T.Float32BufferAttribute([-0.6, 0, 0.1, 0, 0, 0, 0, 0, 0, 0.6, 0, 0.1, 0, 0, -0.25, 0, 0, 0.15], 3));
    birdGeo.setIndex([0, 1, 4, 3, 2, 4, 1, 5, 4, 2, 4, 5]);
    const birds = [];
    for (let i = 0; i < 7; i++) {
      const b = new T.Mesh(birdGeo, new T.MeshBasicMaterial({ color: 0x222222, side: T.DoubleSide }));
      b.userData = { r: rr(40, 90), h: rr(30, 50), sp: rr(0.08, 0.16) * (i % 2 ? 1 : -1), ph: rnd() * 6.283, cx: rr(-30, 30), cz: rr(-40, 40) };
      scene.add(b); birds.push(b);
    }

    /* ----- Yorug'lik ----- */
    const hemi = new T.HemisphereLight(0xcfe6ff, 0x5a6b3a, 0.65);
    scene.add(hemi);
    const sun = new T.DirectionalLight(0xfff1dc, 2.0);
    sun.position.copy(sunDir).multiplyScalar(120);
    sun.castShadow = !LOW;
    sun.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048);
    const sc2 = sun.shadow.camera; sc2.left = -55; sc2.right = 55; sc2.top = 75; sc2.bottom = -75; sc2.near = 20; sc2.far = 260;
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
    scene.add(sun); scene.add(sun.target);

    updaters.push((t, dt) => {
      uTime.value = t;
      clouds.forEach((c) => { c.position.x += dt * 1.6; if (c.position.x > 280) c.position.x = -280; });
      birds.forEach((b) => {
        const u = b.userData, a = u.ph + t * u.sp;
        b.position.set(u.cx + Math.cos(a) * u.r, u.h + Math.sin(t * 0.5 + u.ph) * 2, u.cz + Math.sin(a) * u.r);
        b.rotation.y = -a + (u.sp > 0 ? 0 : Math.PI);
        b.scale.set(1, 1, 1);
        const f = Math.sin(t * 9 + u.ph) * 0.5;
        b.geometry === birdGeo && (b.rotation.z = f * 0.3);
      });
    });

    /* ===== Fizika so'rovlari ===== */
    const STEP = 0.45;
    function groundAt(x, z, feetY, r = 0.15) {
      let best = 0;
      for (const c of colliders) {
        if (x < c.min[0] - r || x > c.max[0] + r || z < c.min[2] - r || z > c.max[2] + r) continue;
        const top = c.max[1];
        if (top <= feetY + STEP && top > best) best = top;
      }
      for (const p of ramps) {
        if (x < p.x0 || x > p.x1 || z < p.z0 || z > p.z1) continue;
        const t = Math.max(0, Math.min(1, (x - p.a0) / (p.a1 - p.a0)));
        const y = p.y0 + (p.y1 - p.y0) * t;
        if (y <= feetY + STEP && y > best) best = y;
      }
      return best;
    }
    /** Silindr tanani devorlardan itarib chiqarish. */
    function pushOut(pos, radius, height) {
      for (let pass = 0; pass < 2; pass++) {
        for (const c of colliders) {
          if (c.max[1] <= pos.y + STEP || c.min[1] >= pos.y + height) continue;
          const cx = Math.max(c.min[0], Math.min(pos.x, c.max[0]));
          const cz = Math.max(c.min[2], Math.min(pos.z, c.max[2]));
          let dx = pos.x - cx, dz = pos.z - cz;
          const d2 = dx * dx + dz * dz;
          if (d2 >= radius * radius) continue;
          if (d2 > 1e-8) { const d = Math.sqrt(d2), k = (radius - d) / d; pos.x += dx * k; pos.z += dz * k; }
          else { // markaz quti ichida — eng yaqin tomonga
            const opts = [[pos.x - c.min[0] + radius, -1, 0], [c.max[0] - pos.x + radius, 1, 0], [pos.z - c.min[2] + radius, 0, -1], [c.max[2] - pos.z + radius, 0, 1]].sort((a, b) => a[0] - b[0]);
            pos.x += opts[0][1] * opts[0][0]; pos.z += opts[0][2] * opts[0][0];
          }
        }
      }
    }
    function ceilingAt(x, z, feetY, height) {
      let best = Infinity;
      for (const c of colliders) {
        if (x < c.min[0] || x > c.max[0] || z < c.min[2] || z > c.max[2]) continue;
        if (c.min[1] >= feetY + height - 0.3 && c.min[1] < best) best = c.min[1];
      }
      return best;
    }
    /** Nur va qutilar kesishuvi: eng yaqin masofa. */
    function rayMap(o, d, maxD) {
      let best = maxD;
      for (const c of colliders) {
        let t0 = 0, t1 = best;
        let ok = true;
        for (let a = 0; a < 3; a++) {
          const inv = 1 / (d[a] || 1e-9);
          let tn = (c.min[a] - o[a]) * inv, tf = (c.max[a] - o[a]) * inv;
          if (tn > tf) { const s = tn; tn = tf; tf = s; }
          if (tn > t0) t0 = tn;
          if (tf < t1) t1 = tf;
          if (t0 > t1) { ok = false; break; }
        }
        if (ok && t0 < best && t0 >= 0) best = t0;
      }
      if (d[1] < 0) { const tg = -o[1] / d[1]; if (tg < best) best = tg; }
      return best;
    }

    return {
      scene, sun, colliders, ramps, spawns, nests, nodes, nodeById, BOUND, TEAM,
      groundAt, pushOut, ceilingAt, rayMap,
      update(t, dt, camPos) {
        updaters.forEach((f) => f(t, dt));
        if (camPos) { sun.target.position.set(camPos.x * 0.3, 0, camPos.z * 0.3); sun.position.copy(sunDir).multiplyScalar(120).add(sun.target.position); }
      },
    };
  }

  /* ========== Robot personaj ========== */
  let ROBOT = null, ROBOT_H = 1;
  function loadRobot() {
    if (ROBOT) return Promise.resolve(ROBOT);
    return new Promise((res, rej) => new T.GLTFLoader().load("games/models/robot.glb?v=1", (g) => {
      ROBOT = g;
      const bb = new T.Box3().setFromObject(g.scene);
      ROBOT_H = bb.max.y - bb.min.y;
      res(g);
    }, undefined, rej));
  }
  const matCache = {};
  function teamMat(src, team) {
    const key = src.name + team;
    if (matCache[key]) return matCache[key];
    const m = src.clone();
    if (src.name === "Main") { m.color = new T.Color(TEAM[team].col); m.roughness = 0.45; m.metalness = 0.35; }
    else if (src.name === "Grey") { m.color = new T.Color(0xd9dde2); m.roughness = 0.4; m.metalness = 0.6; }
    else { m.color = new T.Color(0x16181b); m.roughness = 0.5; m.metalness = 0.3; }
    m.envMapIntensity = 0.8;
    return (matCache[key] = m);
  }
  function makeAvatar(team, height = 1.78) {
    const root = T.SkeletonUtils.clone(ROBOT.scene);
    root.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
        o.material = Array.isArray(o.material) ? o.material.map((m) => teamMat(m, team)) : teamMat(o.material, team);
      }
    });
    const s = height / ROBOT_H;
    root.scale.setScalar(s);
    const wrap = new T.Group();
    wrap.add(root);
    const mixer = new T.AnimationMixer(root);
    const acts = {};
    ROBOT.animations.forEach((clip) => { acts[clip.name] = mixer.clipAction(clip); });
    ["Death", "Jump"].forEach((n) => { if (acts[n]) { acts[n].setLoop(T.LoopOnce); acts[n].clampWhenFinished = true; } });
    let cur = null;
    const play = (name, fade = 0.2) => {
      if (cur === name || !acts[name]) return;
      const next = acts[name];
      next.reset().setEffectiveWeight(1).fadeIn(fade).play();
      if (cur && acts[cur]) acts[cur].fadeOut(fade);
      cur = name;
    };
    play("Idle", 0);
    // Miltiq o'ng qo'lda
    const gun = makeRifle(team, true);
    let hand = null;
    root.traverse((o) => { if (!hand && o.isBone && /^Palm2\.R$/.test(o.name)) hand = o; });
    if (!hand) root.traverse((o) => { if (!hand && o.isBone && /LowerArm\.R/.test(o.name)) hand = o; });
    wrap.add(gun);
    gun.rotation.y = Math.PI;
    const hv = new T.Vector3();
    const syncGun = () => {
      if (!hand) { gun.position.set(-0.25, 1.05, 0.25); return; }
      hand.getWorldPosition(hv); wrap.worldToLocal(hv);
      gun.position.set(hv.x * 0.6 - 0.1, hv.y, Math.max(0.15, hv.z) + 0.25);
    };
    return { obj: wrap, root, mixer, play, get anim() { return cur; }, gun, syncGun };
  }

  /* ========== Snayper miltiq ========== */
  const rifleMats = {};
  function rifleMat(team) {
    if (rifleMats[team]) return rifleMats[team];
    return (rifleMats[team] = {
      metal: new T.MeshStandardMaterial({ color: 0x23262a, metalness: 0.85, roughness: 0.32 }),
      dark: new T.MeshStandardMaterial({ color: 0x101113, metalness: 0.6, roughness: 0.45 }),
      body: new T.MeshStandardMaterial({ color: team === "r" ? 0x5c2a22 : 0x24384f, metalness: 0.1, roughness: 0.62 }),
      accent: new T.MeshStandardMaterial({ color: TEAM[team].col, metalness: 0.2, roughness: 0.4, emissive: TEAM[team].col, emissiveIntensity: 0.15 }),
      lens: new T.MeshStandardMaterial({ color: 0x0b2440, metalness: 1, roughness: 0.05, emissive: 0x0a3a6a, emissiveIntensity: 0.6 }),
    });
  }
  /** Miltiq -z tomonga qaragan, uzunligi ~1.15 m. lite = robot qo'lidagi soddaroq nusxa. */
  function makeRifle(team, lite) {
    const m = rifleMat(team);
    const g = new T.Group();
    const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => { const o = new T.Mesh(geo, mat); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.castShadow = true; g.add(o); return o; };
    const seg = lite ? 8 : 18;
    // Qo'ndoq (stock) — yon profil chizig'idan
    const sh = new T.Shape();
    sh.moveTo(0.05, 0.035); sh.lineTo(0.05, -0.03); sh.lineTo(-0.02, -0.05); sh.lineTo(-0.1, -0.12); sh.lineTo(-0.16, -0.12); sh.lineTo(-0.12, -0.05);
    sh.lineTo(-0.2, -0.04); sh.lineTo(-0.38, -0.07); sh.lineTo(-0.42, -0.08); sh.lineTo(-0.43, 0.04); sh.lineTo(-0.36, 0.05); sh.lineTo(-0.2, 0.035);
    const stock = new T.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: !lite, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2 });
    stock.translate(0, 0, -0.025); stock.rotateY(Math.PI / 2);
    add(stock, m.body, 0, 0, 0.0);
    add(new T.BoxGeometry(0.056, 0.03, 0.12), m.dark, 0, 0.0, 0.43); // yelka yostig'i
    // Qabul qiluvchi qism va old qism
    add(new T.BoxGeometry(0.06, 0.07, 0.34), m.metal, 0, 0.005, -0.17);
    add(new T.BoxGeometry(0.055, 0.06, 0.32), m.body, 0, -0.005, -0.48);
    add(new T.BoxGeometry(0.04, 0.012, 0.3), m.accent, 0, 0.031, -0.48);
    // Stvol
    add(new T.CylinderGeometry(0.011, 0.014, 0.62, seg), m.metal, 0, 0.012, -0.9, Math.PI / 2);
    add(new T.CylinderGeometry(0.02, 0.02, 0.07, seg), m.dark, 0, 0.012, -1.22, Math.PI / 2); // tormoz
    // Magazin
    add(new T.BoxGeometry(0.045, 0.09, 0.08), m.dark, 0, -0.07, -0.16);
    // Tepki va himoya
    add(new T.TorusGeometry(0.03, 0.006, 6, 12, Math.PI), m.dark, 0, -0.04, -0.02, 0, Math.PI / 2, Math.PI);
    // Durbin (optika)
    add(new T.CylinderGeometry(0.022, 0.022, 0.26, seg), m.dark, 0, 0.085, -0.16, Math.PI / 2);
    add(new T.CylinderGeometry(0.032, 0.024, 0.08, seg), m.dark, 0, 0.085, -0.33, Math.PI / 2);
    add(new T.CylinderGeometry(0.026, 0.022, 0.06, seg), m.dark, 0, 0.085, -0.0, Math.PI / 2);
    add(new T.CylinderGeometry(0.014, 0.014, 0.05, 8), m.metal, 0, 0.11, -0.16); // baraban
    add(new T.CylinderGeometry(0.014, 0.014, 0.05, 8), m.metal, 0.03, 0.085, -0.16, 0, 0, Math.PI / 2);
    add(new T.CircleGeometry(0.029, seg), m.lens, 0, 0.085, -0.371, Math.PI, 0, 0);
    [[-0.22], [-0.09]].forEach(([z]) => add(new T.BoxGeometry(0.03, 0.04, 0.025), m.metal, 0, 0.05, z)); // halqalar
    // Zatvor dastagi (animatsiya uchun alohida)
    const bolt = new T.Group();
    const bh = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 0.07, 8), m.metal); bh.rotation.z = Math.PI / 2; bh.position.x = 0.035; bolt.add(bh);
    const knob = new T.Mesh(new T.SphereGeometry(0.013, 10, 8), m.dark); knob.position.x = 0.072; bolt.add(knob);
    bolt.position.set(0, 0.02, -0.07);
    g.add(bolt);
    // Ikki oyoqcha (yig'ilgan)
    if (!lite) { add(new T.CylinderGeometry(0.006, 0.006, 0.2, 6), m.dark, 0.015, -0.04, -0.68, Math.PI / 2 - 0.1); add(new T.CylinderGeometry(0.006, 0.006, 0.2, 6), m.dark, -0.015, -0.04, -0.68, Math.PI / 2 - 0.1); }
    g.userData.bolt = bolt;
    g.userData.muzzle = new T.Vector3(0, 0.012, -1.26);
    return g;
  }

  window.SofiSniperWorld = { build, loadRobot, makeAvatar, makeRifle, TEAM, MOBILE, LOW };
})();
