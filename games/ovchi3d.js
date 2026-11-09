/* OVCHI 3D — keng dala, o'rmon va cho'lda ov.
   O'txo'rlar (ot, bizon, jayron, bug'u) qochadi, yirtqichlar (bo'ri, ayiq) va yovvoyi cho'chqa hujum qiladi. Otga minish, 4 kishigacha birga ov.
   Otilgan hayvonni olib, istalgan joyda chaqiriladigan do'konda sotib, qurol/jihoz sotib olinadi.
   create(container, { save, onSave, onExit }) */
(() => {
  "use strict";
  const T = window.THREE;
  const MOBILE = window.matchMedia && matchMedia("(pointer: coarse)").matches;
  const LOW = /[?&]ovq=low/.test(location.search);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rr = (a, b) => a + Math.random() * (b - a);
  const lerp = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const angDiff = (a, b) => ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

  /* ================= Ma'lumotlar ================= */
  const WEAPONS = {
    revolver: { name: "Revolver", file: "revolver", dmg: 45, pellets: 1, mag: 6, rate: 0.45, reload: 1.6, spread: 0.012, range: 70, zoom: 1.4, price: 0, len: 0.34, pos: [0.17, -0.19, -0.42], snd: "revolver" },
    shotgun: { name: "Ov miltig‘i", file: "shotgun", dmg: 22, pellets: 7, mag: 2, rate: 0.85, reload: 2.2, spread: 0.06, range: 38, zoom: 1.25, price: 450, len: 0.95, pos: [0.2, -0.22, -0.55], snd: "shotgun" },
    rifle: { name: "Avtomat miltiq", file: "assault-rifle", dmg: 34, pellets: 1, mag: 25, rate: 0.11, auto: true, reload: 2.0, spread: 0.018, range: 130, zoom: 1.8, price: 1100, flip: true, len: 0.85, pos: [0.2, -0.22, -0.52], snd: "rifle" },
    sniper: { name: "Snayper miltig‘i", file: "sniper-rifle", dmg: 140, pellets: 1, mag: 5, rate: 1.3, reload: 2.6, spread: 0.002, hipSpread: 0.04, range: 320, zoom: 5, scope: true, price: 1800, len: 1.15, pos: [0.22, -0.24, -0.58], snd: "sniper" },
  };
  const WORDER = ["revolver", "shotgun", "rifle", "sniper"];
  const ANIMALS = {
    jayron: { name: "Jayron", icon: "🦌", pred: false, hp: 70, walk: 1.4, run: 11, price: 90, n: 12, herd: [3, 5], biome: "desert", h: 1.2, len: 1.5, sense: 36, model: "Deer", snd: "bark" },
    ot: { name: "Yovvoyi ot", icon: "🐎", pred: false, hp: 110, walk: 1.6, run: 11, price: 120, n: 11, herd: [3, 4], biome: "field", h: 1.75, len: 2.3, sense: 34, model: "Horse", snd: "neigh" },
    bizon: { name: "Bizon", icon: "🦬", pred: false, hp: 180, walk: 1.0, run: 7.5, price: 190, n: 9, herd: [3, 4], biome: "field", h: 1.8, len: 3.0, sense: 26, model: "Bull", snd: "moo", tint: 0x3d2414 },
    bugu: { name: "Bug‘u", icon: "🫎", pred: false, hp: 140, walk: 1.3, run: 10, price: 220, n: 8, herd: [2, 3], biome: "forest", h: 1.9, len: 2.2, sense: 32, model: "Stag", snd: "bark" },
    tongiz: { name: "Yovvoyi cho‘chqa", icon: "🐗", pred: false, angry: true, hp: 120, walk: 1.2, run: 8.5, price: 170, n: 9, herd: [2, 4], biome: "forest", h: 0.95, len: 1.6, sense: 24, dmg: 14, bite: 1.0, reach: 1.7, snd: "grunt" },
    bori: { name: "Bo‘ri", icon: "🐺", pred: true, hp: 75, walk: 1.5, run: 9.8, price: 150, n: 10, herd: [2, 4], biome: "forest", h: 0.9, len: 1.7, sense: 40, dmg: 12, bite: 1.1, reach: 1.9, model: "Wolf", snd: "wolf", tint: 0x6e6a62 },
    ayiq: { name: "Ayiq", icon: "🐻", pred: true, hp: 240, walk: 1.2, run: 7.6, price: 320, n: 5, herd: [1, 1], biome: "forest", h: 1.5, len: 2.2, sense: 28, dmg: 28, bite: 1.7, reach: 2.6, snd: "bear" },
  };
  const ATYPES = Object.keys(ANIMALS);
  const SHOP_ITEMS = [
    { id: "ammo", name: "O‘q (20 ta)", icon: "🔸", price: 40 },
    { id: "med", name: "Aptechka (+50 ❤)", icon: "🩹", price: 60 },
    { id: "bag6", name: "Katta xalta (6 o‘rin)", icon: "🎒", price: 400, bag: 6 },
    { id: "bag10", name: "Ovchi xaltasi (10 o‘rin)", icon: "🧳", price: 900, bag: 10 },
  ];

  /* ================= Shovqin va relyef ================= */
  const hash2 = (x, y) => { const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); };
  function vnoise(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return lerp(lerp(hash2(xi, yi), hash2(xi + 1, yi), u), lerp(hash2(xi, yi + 1), hash2(xi + 1, yi + 1), u), v); }
  const fbm = (x, y) => vnoise(x, y) * 0.55 + vnoise(x * 2.1, y * 2.1) * 0.28 + vnoise(x * 4.3, y * 4.3) * 0.17;
  const K = 1.8, HALF = Math.round(190 * K), EDGE = 165 * K;
  /* ================= Qishloq (markaz direktori yuborgan xaritadan) =================
     Rasmdagi piksel → o'yin metri. Ko'chalar, uylar va bog'lar shu chiziqlar bo'ylab joylashadi. */
  const VS = 0.4, VC = { px: 565, py: 975, x: -60, z: 95 };
  const vp = ([px, py]) => [VC.x + (px - VC.px) * VS, VC.z + (py - VC.py) * VS];
  const ROADS = [
    [[0, 845], [80, 860], [150, 880], [210, 930], [255, 955], [285, 940], [300, 890], [290, 800], [300, 760]],
    [[235, 700], [235, 760], [250, 800], [290, 800]],
    [[235, 700], [270, 670], [370, 660], [450, 680], [520, 690], [545, 700], [540, 760], [530, 820]],
    [[290, 790], [360, 775], [450, 760], [520, 750], [560, 770], [620, 760], [660, 770], [780, 770], [820, 760]],
    [[300, 880], [360, 860], [430, 840], [520, 830]],
    [[430, 840], [445, 960], [430, 1060], [420, 1160]],
    [[445, 960], [520, 985], [560, 1050], [590, 1130], [580, 1200], [560, 1250], [480, 1340]],
    [[520, 985], [600, 975], [640, 900], [620, 840], [660, 770]],
    [[650, 765], [620, 700], [630, 620], [560, 650]],
    [[660, 770], [700, 850], [700, 950], [690, 1020], [700, 1100]],
    [[780, 770], [760, 830], [740, 900], [720, 1000], [700, 1100], [690, 1250], [800, 1250], [860, 1200], [870, 1100], [830, 1040], [820, 960], [780, 880], [760, 830]],
    [[780, 770], [840, 700], [900, 620]],
    [[820, 760], [900, 720]],
    [[870, 1180], [900, 1150]],
    [[380, 1100], [400, 1000], [430, 960]],
  ].map((r) => r.map(vp));
  const RAVINE = [[180, 980], [215, 1060], [240, 1150], [262, 1250], [290, 1360], [320, 1480]].map(vp);
  const CAMP = (() => { const [x, z] = vp([370, 880]); return { x, z }; })();
  const SEGS = []; ROADS.forEach((r) => { for (let i = 1; i < r.length; i++) SEGS.push([r[i - 1][0], r[i - 1][1], r[i][0], r[i][1]]); });
  function segDist(x, z, s) { const dx = s[2] - s[0], dz = s[3] - s[1], l2 = dx * dx + dz * dz || 1; const t = clamp(((x - s[0]) * dx + (z - s[1]) * dz) / l2, 0, 1); return Math.hypot(x - s[0] - dx * t, z - s[1] - dz * t); }
  function roadDist(x, z) { let d = 1e9; for (const sg of SEGS) { const v = segDist(x, z, sg); if (v < d) d = v; } return d; }
  // qishloq niqobi (yo'llardan uzoqlik bo'yicha) — tez o'qish uchun 4 m to'r
  const VB = { x0: VC.x - 200, z0: VC.z - 200, n: 100, c: 4 };
  let VGRID = null;
  function villageAt(x, z) {
    if (!VGRID) { VGRID = new Float32Array(VB.n * VB.n); for (let j = 0; j < VB.n; j++) for (let i = 0; i < VB.n; i++) VGRID[j * VB.n + i] = sstep(85, 35, roadDist(VB.x0 + i * VB.c, VB.z0 + j * VB.c)); }
    const fx = (x - VB.x0) / VB.c, fz = (z - VB.z0) / VB.c; if (fx < 0 || fz < 0 || fx >= VB.n - 1 || fz >= VB.n - 1) return 0;
    const i = fx | 0, j = fz | 0, u = fx - i, v = fz - j, g = VGRID, n = VB.n;
    return lerp(lerp(g[j * n + i], g[j * n + i + 1], u), lerp(g[(j + 1) * n + i], g[(j + 1) * n + i + 1], u), v);
  }
  function biome(x, z) {
    x /= K; z /= K;
    const n = fbm(x * 0.012 + 7, z * 0.012 - 3);
    const forest = sstep(-25, -70, z + (n - 0.5) * 60);
    const desert = sstep(45, 95, x + (n - 0.5) * 60) * (1 - forest);
    return { forest, desert, field: Math.max(0, 1 - forest - desert) };
  }
  function heightAt(x, z) {
    const b = biome(x, z);
    const x0 = x, z0 = z; x /= K; z /= K;
    let h = (fbm(x * 0.009, z * 0.009) - 0.45) * 16;
    h *= 0.55 + 0.7 * b.forest;
    h += (Math.sin(x * 0.055 + Math.cos(z * 0.032) * 2.2) * 2.6 + Math.sin(z * 0.08 + x * 0.02) * 1.4) * b.desert;
    const edge = Math.max(Math.abs(x), Math.abs(z));
    h += sstep(150, 195, edge) * (34 + fbm(x * 0.03, z * 0.03) * 22);
    h *= 1 - villageAt(x0, z0) * 0.55;
    const dc = Math.hypot(x0 - CAMP.x, z0 - CAMP.z);
    if (dc < 18) h = lerp(h, 0.2, sstep(18, 7, dc));
    return h;
  }

  /* ================= Yordamchilar ================= */
  function canvasTex(size, draw, rep = 1, srgb = true) {
    const c = document.createElement("canvas"); c.width = c.height = size; draw(c.getContext("2d"), size);
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); if (srgb) t.encoding = T.sRGBEncoding; t.anisotropy = 8; return t;
  }
  /** Bir nechta geometriyani bittaga (rang bilan) birlashtirish */
  function merge(parts) {
    const pos = [], nrm = [], col = [];
    parts.forEach(([g, color]) => {
      const n = g.index ? g.toNonIndexed() : g; n.computeVertexNormals();
      const p = n.attributes.position.array, nn = n.attributes.normal.array, c = new T.Color(color);
      for (let i = 0; i < p.length; i += 3) { pos.push(p[i], p[i + 1], p[i + 2]); nrm.push(nn[i], nn[i + 1], nn[i + 2]); col.push(c.r, c.g, c.b); }
    });
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new T.Float32BufferAttribute(nrm, 3)); g.setAttribute("color", new T.Float32BufferAttribute(col, 3));
    g.computeBoundingSphere(); return g;
  }
  function decodeLBM(buf) {
    const dv = new DataView(buf);
    const vc = dv.getUint32(4, true), ic = dv.getUint32(8, true), fl = dv.getUint32(12, true);
    const mn = [0, 1, 2].map((i) => dv.getFloat32(16 + i * 4, true)), mx = [0, 1, 2].map((i) => dv.getFloat32(28 + i * 4, true));
    let o = 40; const q = new Int16Array(buf, o, vc * 3); o += vc * 6; const nq = new Int8Array(buf, o, vc * 3); o += vc * 3; o += (4 - (vc * 3) % 4) % 4;
    const pos = new Float32Array(vc * 3), nrm = new Float32Array(vc * 3);
    for (let i = 0; i < vc * 3; i++) { const a = i % 3; pos[i] = mn[a] + ((q[i] + 32768) / 65535) * (mx[a] - mn[a]); nrm[i] = nq[i] / 127; }
    const g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(pos, 3)); g.setAttribute("normal", new T.BufferAttribute(nrm, 3));
    if (fl & 1) { const u = new Uint16Array(buf, o, vc * 2); o += vc * 4; const uv = new Float32Array(vc * 2); for (let i = 0; i < vc * 2; i++) uv[i] = u[i] / 65535; g.setAttribute("uv", new T.BufferAttribute(uv, 2)); }
    g.setIndex(new T.BufferAttribute(fl & 2 ? new Uint32Array(buf, o, ic) : new Uint16Array(buf, o, ic), 1));
    g.computeBoundingBox(); g.computeBoundingSphere(); return g;
  }
  async function loadLBM(name) {
    const buf = await (await fetch(`games/models/${name}.bin?v=1`)).arrayBuffer();
    const geo = decodeLBM(buf);
    const tex = await new Promise((res) => new T.TextureLoader().load(`games/models/${name}.jpg?v=1`, res, undefined, () => res(null)));
    if (tex) { tex.encoding = T.sRGBEncoding; tex.flipY = false; }
    return { geo, tex };
  }
  const loadGLTF = (url) => new Promise((res, rej) => new T.GLTFLoader().load(url, res, undefined, rej));

  /* ================= Tovushlar ================= */
  const Snd = (() => {
    let ac = null, master = null, verb = null, nb = null, on = true, amb = null;
    const init = () => {
      if (ac) { if (ac.state === "suspended") ac.resume(); return; }
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        const comp = ac.createDynamicsCompressor(); comp.connect(ac.destination);
        master = ac.createGain(); master.gain.value = 0.85; master.connect(comp);
        nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const len = ac.sampleRate * 2.4, ir = ac.createBuffer(2, len, ac.sampleRate);
        for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.4); }
        const cv = ac.createConvolver(); cv.buffer = ir; const vg = ac.createGain(); vg.gain.value = 0.4; cv.connect(vg); vg.connect(master); verb = cv;
      } catch (e) { ac = null; }
    };
    const ok = () => on && ac && ac.state === "running";
    const out = (pan = 0, wet = 0.3, vol = 1) => { const g = ac.createGain(); g.gain.value = vol; let n = g; if (ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = clamp(pan, -1, 1); g.connect(p); n = p; } n.connect(master); if (verb && wet) { const w = ac.createGain(); w.gain.value = wet; g.connect(w); w.connect(verb); } return g; };
    const noise = (t, dur, f0, f1, vol, type, dest, q = 0.8, att = 0.003) => { const s = ac.createBufferSource(); s.buffer = nb; const f = ac.createBiquadFilter(); f.type = type || "lowpass"; f.Q.value = q; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur); const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random()); s.stop(t + dur + 0.05); };
    const tone = (t, dur, f0, f1, vol, type, dest, att = 0.01, vib = 0) => { const o = ac.createOscillator(); o.type = type || "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
      if (vib) { const l = ac.createOscillator(); l.frequency.value = vib; const lg = ac.createGain(); lg.gain.value = f0 * 0.04; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + 0.05); }
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05); };
    const metal = (t, vol, base, dest) => { [1, 2.7, 5.3].forEach((k, i) => tone(t, 0.06 / (i + 1) + 0.03, base * k, base * k * 0.98, vol / (i + 1.5), "sine", dest, 0.001)); noise(t, 0.03, 7000, 3000, vol * 0.6, "highpass", dest, 0.8, 0.001); };
    return {
      init, get on() { return on; }, set(v) { on = v; if (master) master.gain.value = v ? 0.85 : 0; },
      shot(kind) { if (!ok()) return; const t = ac.currentTime, o = out(0, 0.5);
        const K = { revolver: [5500, 0.25, 1.1, 120], shotgun: [3000, 0.45, 1.5, 70], rifle: [6500, 0.16, 0.8, 140], sniper: [4500, 0.55, 1.6, 60] }[kind] || [5000, 0.3, 1, 100];
        noise(t, 0.04, 9000, 2500, 0.9, "highpass", o, 0.6, 0.0005); noise(t, K[1], K[0], 150, K[2], "lowpass", o, 0.9, 0.001); tone(t, K[1], K[3], 35, 1.0, "sine", o, 0.001); noise(t + 0.05, 1.3, 800, 90, 0.3, "lowpass", o, 0.6, 0.05); },
      reload() { if (!ok()) return; const t = ac.currentTime, o = out(0.2, 0.1); metal(t + 0.2, 0.3, 1800, o); metal(t + 0.8, 0.25, 2300, o); metal(t + 1.3, 0.4, 1400, o); },
      empty() { if (!ok()) return; metal(ac.currentTime, 0.25, 2400, out(0.2)); },
      hit() { if (!ok()) return; const t = ac.currentTime; tone(t, 0.08, 1700, 1500, 0.2, "triangle", out(0, 0.1)); },
      step(k = 1, sand) { if (!ok()) return; const t = ac.currentTime, o = out(rr(-0.15, 0.15), 0.05); if (sand) noise(t, 0.12, 3500, 1200, 0.12 * k, "bandpass", o, 1); else { noise(t, 0.13, 5200, 1800, 0.1 * k, "highpass", o, 0.7, 0.01); noise(t, 0.08, 500, 150, 0.1 * k, "lowpass", o); } },
      wolf(dist = 10, pan = 0, howl) { if (!ok()) return; const k = clamp(1 - dist / 120, 0.08, 1), t = ac.currentTime, o = out(pan, 0.6, k);
        if (howl) { tone(t, 2.6, 380, 560, 0.18, "sine", o, 0.5, 5); tone(t + 0.6, 2.2, 560, 420, 0.14, "sine", o, 0.3, 6); }
        else { tone(t, 0.7, 120, 90, 0.35, "sawtooth", o, 0.05, 28); noise(t, 0.7, 900, 300, 0.25, "bandpass", o, 3, 0.05); } },
      bear(dist = 10, pan = 0) { if (!ok()) return; const k = clamp(1 - dist / 120, 0.08, 1), t = ac.currentTime, o = out(pan, 0.6, k); tone(t, 1.3, 95, 60, 0.5, "sawtooth", o, 0.1, 18); noise(t, 1.3, 700, 140, 0.5, "lowpass", o, 1.5, 0.1); },
      neigh(dist = 10, pan = 0) { if (!ok()) return; const k = clamp(1 - dist / 120, 0.08, 1), t = ac.currentTime, o = out(pan, 0.5, k); tone(t, 1.1, 700, 450, 0.12, "sawtooth", o, 0.05, 14); tone(t + 0.1, 0.9, 1100, 600, 0.06, "square", o, 0.05, 16); },
      moo(dist = 10, pan = 0) { if (!ok()) return; const k = clamp(1 - dist / 120, 0.08, 1), t = ac.currentTime, o = out(pan, 0.5, k); tone(t, 1.4, 140, 110, 0.25, "sawtooth", o, 0.2, 4); },
      baa(dist = 10, pan = 0) { if (!ok()) return; const k = clamp(1 - dist / 120, 0.08, 1), t = ac.currentTime, o = out(pan, 0.5, k); tone(t, 0.8, 420, 380, 0.12, "sawtooth", o, 0.03, 22); },
      bark(dist = 10, pan = 0) { if (!ok()) return; const k = clamp(1 - dist / 120, 0.08, 1), t = ac.currentTime, o = out(pan, 0.5, k); for (let i = 0; i < 2; i++) { tone(t + i * 0.32, 0.22, 900, 420, 0.16, "sawtooth", o, 0.01, 30); noise(t + i * 0.32, 0.2, 1800, 600, 0.14, "bandpass", o, 4, 0.01); } },
      grunt(dist = 10, pan = 0, angry) { if (!ok()) return; const k = clamp(1 - dist / 100, 0.08, 1), t = ac.currentTime, o = out(pan, 0.4, k); const n = angry ? 1 : 3;
        for (let i = 0; i < n; i++) { const tt = t + i * 0.28, d = angry ? 0.9 : 0.18; tone(tt, d, angry ? 160 : 120, angry ? 90 : 80, angry ? 0.45 : 0.3, "sawtooth", o, 0.02, angry ? 40 : 55); noise(tt, d, 900, 250, angry ? 0.5 : 0.3, "bandpass", o, 2.5, 0.02); } },
      snort() { if (!ok()) return; const t = ac.currentTime, o = out(0, 0.2, 0.7); noise(t, 0.5, 2200, 500, 0.35, "bandpass", o, 1.2, 0.03); tone(t + 0.05, 0.4, 220, 120, 0.1, "sawtooth", o, 0.02, 25); },
      hoof(k = 1) { if (!ok()) return; const t = ac.currentTime, o = out(rr(-0.2, 0.2), 0.08, k); noise(t, 0.07, 1400, 300, 0.4, "lowpass", o, 2, 0.002); tone(t, 0.06, 140, 80, 0.25, "sine", o, 0.002); },
      far(kind, dist, pan) { if (!ok()) return; const k = clamp(1 - dist / 260, 0.04, 0.8), t = ac.currentTime, o = out(pan, 0.8, k); noise(t, 0.4, 3500, 200, 0.8, "lowpass", o, 0.8, 0.002); tone(t, 0.3, 90, 35, 0.6, "sine", o, 0.002); noise(t + 0.15, 1.6, 600, 80, 0.25, "lowpass", o, 0.6, 0.1); },
      whistle() { if (!ok()) return; const t = ac.currentTime, o = out(0, 0.3, 0.8); tone(t, 0.25, 1800, 2600, 0.12, "sine", o, 0.02); tone(t + 0.32, 0.4, 2000, 1500, 0.12, "sine", o, 0.02); },
      hurt() { if (!ok()) return; const t = ac.currentTime, o = out(0, 0.2); tone(t, 0.3, 200, 90, 0.35, "sawtooth", o); noise(t, 0.3, 2500, 400, 0.25, "bandpass", o, 1.2); },
      coins() { if (!ok()) return; const t = ac.currentTime, o = out(0, 0.3); [1319, 1760, 2093, 2637, 3136].forEach((f, i) => tone(t + i * 0.05, 0.25, f, f, 0.08, "sine", o)); },
      pick() { if (!ok()) return; const t = ac.currentTime, o = out(0, 0.2); noise(t, 0.3, 1200, 400, 0.25, "lowpass", o, 1, 0.05); tone(t + 0.1, 0.2, 660, 880, 0.08, "triangle", o); },
      magic() { if (!ok()) return; const t = ac.currentTime, o = out(0, 0.6); [523, 659, 784, 1046].forEach((f, i) => tone(t + i * 0.08, 0.6, f, f, 0.08, "triangle", o)); noise(t, 0.8, 6000, 2000, 0.08, "highpass", o, 0.5, 0.2); },
      bird() { if (!ok()) return; const t = ac.currentTime, o = out(rr(-0.8, 0.8), 0.5), b = rr(2600, 3800); for (let i = 0; i < 3; i++) tone(t + i * rr(0.08, 0.15), 0.08, b * rr(0.9, 1.1), b * rr(1.2, 1.5), 0.03, "sine", o); },
      ambience(start) {
        if (!ac) return;
        if (!start) { if (amb) { amb.forEach((n) => { try { n.stop(); } catch (e) {} }); amb = null; } return; }
        if (amb) return;
        const s = ac.createBufferSource(); s.buffer = nb; s.loop = true; const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 380; const g = ac.createGain(); g.gain.value = 0.05;
        const l = ac.createOscillator(); l.frequency.value = 0.08; const lg = ac.createGain(); lg.gain.value = 0.035; l.connect(lg); lg.connect(g.gain); l.start(); s.connect(f); f.connect(g); g.connect(master); s.start(); amb = [s, l];
      },
    };
  })();

  /* ================================================================ */
  function create(container, opts) {
    if (T.ColorManagement) T.ColorManagement.legacyMode = false;
    const save = opts.save;
    /* ---------- Tarmoq (do'stlar bilan, 4 kishigacha) ---------- */
    const net = opts.net || null, myCid = net ? net.cid : "solo";
    const peers = new Map(); let hostCid = myCid;
    const isHost = () => hostCid === myCid;
    const send = (m) => { if (net) try { net.send(m); } catch (e) {} };
    const renderer = new T.WebGLRenderer({ antialias: !MOBILE && !LOW, powerPreference: "high-performance" });
    renderer.setPixelRatio(LOW ? 0.5 : Math.min(devicePixelRatio || 1, MOBILE ? 1.4 : 2));
    renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !LOW; renderer.shadowMap.type = T.PCFSoftShadowMap; renderer.autoClear = false;
    renderer.domElement.className = "ov-canvas";
    container.appendChild(renderer.domElement);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(70, 1, 0.08, 900); camera.rotation.order = "YXZ"; scene.add(camera);
    const uTime = { value: 0 };

    /* ---------- Osmon va yorug'lik ---------- */
    const sunDir = new T.Vector3(0.55, 0.42, 0.25).normalize();
    const skyMat = new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { uSun: { value: sunDir } },
      vertexShader: "varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `varying vec3 vD; uniform vec3 uSun; void main(){ float h = max(vD.y, 0.0);
        vec3 c = mix(vec3(0.96,0.83,0.62), vec3(0.32,0.55,0.86), pow(h, 0.5)); if (vD.y < 0.0) c = vec3(0.7,0.66,0.55);
        float s = max(dot(vD, uSun), 0.0); c += vec3(1.0,0.85,0.6) * (pow(s, 700.0) * 5.0 + pow(s, 9.0) * 0.35); gl_FragColor = vec4(c, 1.0); }` });
    scene.add(new T.Mesh(new T.SphereGeometry(600, 32, 16), skyMat));
    scene.fog = new T.Fog(0xd8cdb0, 70, LOW ? 220 : 330);
    { const pm = new T.PMREMGenerator(renderer); const es = new T.Scene(); es.add(new T.Mesh(new T.SphereGeometry(10, 32, 16), skyMat)); scene.environment = pm.fromScene(es, 0.04).texture; pm.dispose(); }
    scene.add(new T.HemisphereLight(0xdbe8ff, 0x6a5a3a, 0.75));
    const sun = new T.DirectionalLight(0xffe2b8, 2.1); sun.castShadow = !LOW;
    sun.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048);
    Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 10, far: 220 }); sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.05;
    scene.add(sun); scene.add(sun.target);

    /* ---------- Yer ---------- */
    const SEG = LOW ? 150 : MOBILE ? 220 : 300;
    const tg = new T.PlaneGeometry(HALF * 2, HALF * 2, SEG, SEG); tg.rotateX(-Math.PI / 2);
    const tp = tg.attributes.position, tc = new Float32Array(tp.count * 3), tmp = new T.Color();
    const C = { grass: new T.Color(0x5b7d2e), grass2: new T.Color(0x7a8f3a), forest: new T.Color(0x2f4a22), soil: new T.Color(0x5a4630), sand: new T.Color(0xd2b783), sand2: new T.Color(0xc29d68), rock: new T.Color(0x8b8478), dry: new T.Color(0x9a8158), dry2: new T.Color(0x7d6f48) };
    for (let i = 0; i < tp.count; i++) {
      const x = tp.getX(i), z = tp.getZ(i), y = heightAt(x, z); tp.setY(i, y);
      const b = biome(x, z), n = fbm(x * 0.08, z * 0.08);
      tmp.copy(C.grass).lerp(C.grass2, n * 0.8);
      tmp.lerp(C.forest, b.forest * 0.85); if (b.forest > 0.5 && n > 0.62) tmp.lerp(C.soil, 0.45);
      tmp.lerp(tmp.clone().copy(C.sand).lerp(C.sand2, n), b.desert);
      const edge = Math.max(Math.abs(x), Math.abs(z)); tmp.lerp(C.rock, sstep(150 * K, 180 * K, edge) * 0.85);
      const vg = villageAt(x, z); if (vg > 0) tmp.lerp(tmp.clone().copy(C.dry).lerp(C.dry2, fbm(x * 0.05 + 3, z * 0.05)), vg * 0.75);
      if (Math.hypot(x - CAMP.x, z - CAMP.z) < 12) tmp.lerp(C.soil, 0.6);
      tc[i * 3] = tmp.r; tc[i * 3 + 1] = tmp.g; tc[i * 3 + 2] = tmp.b;
    }
    tg.setAttribute("color", new T.BufferAttribute(tc, 3)); tg.computeVertexNormals();
    const detail = canvasTex(256, (g, s) => { g.fillStyle = "#bbb"; g.fillRect(0, 0, s, s); for (let i = 0; i < 4000; i++) { g.globalAlpha = rr(0.1, 0.35); g.fillStyle = Math.random() < 0.5 ? "#888" : "#ddd"; g.fillRect(Math.random() * s, Math.random() * s, rr(1, 3), rr(1, 3)); } }, Math.round(90 * K));
    const ground = new T.Mesh(tg, new T.MeshStandardMaterial({ vertexColors: true, map: detail, roughness: 0.96 }));
    ground.receiveShadow = true; scene.add(ground);

    /* ---------- O'simliklar va toshlar (instanced) ---------- */
    const mtx = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(), ps = new T.Vector3(), Y = new T.Vector3(0, 1, 0);
    const trunks = new Map(); // to'qnashuv uchun: "cx,cz" → [[x,z,r]]
    const addTrunk = (x, z, r) => { const k = Math.floor(x / 10) + "," + Math.floor(z / 10); if (!trunks.has(k)) trunks.set(k, []); trunks.get(k).push([x, z, r]); };
    function scatter(n, test, tries = 20) { const out = []; let k = 0; while (out.length < n && k < n * tries) { k++; const x = rr(-HALF + 15, HALF - 15), z = rr(-HALF + 15, HALF - 15); if (Math.hypot(x - CAMP.x, z - CAMP.z) < 16 || vBlocked(x, z)) continue; if (test(x, z, biome(x, z))) out.push([x, z]); } return out; }
    function inst(geo, mat, pts, scaleFn, trunkR) {
      const im = new T.InstancedMesh(geo, mat, pts.length);
      pts.forEach(([x, z], i) => { const s = scaleFn(); q.setFromAxisAngle(Y, Math.random() * 6.28); sc.set(s, s * rr(0.9, 1.15), s); ps.set(x, heightAt(x, z) - 0.1, z); mtx.compose(ps, q, sc); im.setMatrixAt(i, mtx); if (trunkR) addTrunk(x, z, trunkR * s); });
      im.castShadow = true; im.receiveShadow = true; scene.add(im); return im;
    }
    const vmat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
    const pineGeo = merge([[new T.CylinderGeometry(0.18, 0.28, 3, 7).translate(0, 1.5, 0), 0x4a3424], [new T.ConeGeometry(2.2, 3.6, 9).translate(0, 3.4, 0), 0x264a26], [new T.ConeGeometry(1.7, 3, 9).translate(0, 5.1, 0), 0x2c5528], [new T.ConeGeometry(1.1, 2.4, 9).translate(0, 6.6, 0), 0x336030]]);
    const oakGeo = merge([[new T.CylinderGeometry(0.22, 0.34, 3.2, 7).translate(0, 1.6, 0), 0x5a4128], [new T.IcosahedronGeometry(2.3, 1).translate(0, 4.4, 0), 0x4f7a2a], [new T.IcosahedronGeometry(1.7, 1).translate(1.2, 3.8, 0.4), 0x5d8a31], [new T.IcosahedronGeometry(1.6, 1).translate(-1.1, 4, -0.5), 0x46702a]]);
    const bushGeo = merge([[new T.IcosahedronGeometry(0.9, 1).scale(1, 0.7, 1).translate(0, 0.5, 0), 0x4a6e28], [new T.IcosahedronGeometry(0.6, 1).translate(0.6, 0.45, 0.2), 0x557a2c]]);
    const cactusGeo = merge([[new T.CylinderGeometry(0.28, 0.32, 3.2, 8).translate(0, 1.6, 0), 0x4f7a3a], [new T.CylinderGeometry(0.17, 0.19, 1.2, 7).translate(0.55, 1.9, 0), 0x557f3e], [new T.CylinderGeometry(0.17, 0.17, 0.5, 7).rotateZ(Math.PI / 2).translate(0.32, 1.35, 0), 0x557f3e], [new T.CylinderGeometry(0.15, 0.17, 0.9, 7).translate(-0.5, 2.2, 0), 0x557f3e], [new T.CylinderGeometry(0.15, 0.15, 0.45, 7).rotateZ(Math.PI / 2).translate(-0.28, 1.8, 0), 0x557f3e]]);
    const shrubGeo = merge([[new T.IcosahedronGeometry(0.55, 0).scale(1, 0.6, 1).translate(0, 0.3, 0), 0x8f7d4a]]);
    const rockGeo = (() => { const g = new T.IcosahedronGeometry(1, 1); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const v = new T.Vector3().fromBufferAttribute(p, i); v.multiplyScalar(1 + (fbm(v.x * 2 + 5, v.z * 2 + v.y) - 0.5) * 0.5); v.y *= 0.65; p.setXYZ(i, v.x, v.y, v.z); } return merge([[g, 0x8e877c]]); })();
    const D = (LOW ? 0.45 : MOBILE ? 0.7 : 1) * K * K * 0.85;
    /* ---------- Qishloq: ko'chalar, uylar, bog'lar, teraklar ---------- */
    let seed = 20261109; const srnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const sr = (a, b) => a + srnd() * (b - a);
    const houses = [], hGrid = new Map(), hKey = (x, z) => Math.floor(x / 12) + "," + Math.floor(z / 12);
    const nearHouse = (x, z, r) => { for (let ox = -1; ox <= 1; ox++) for (let oz = -1; oz <= 1; oz++) for (const h of hGrid.get((Math.floor(x / 12) + ox) + "," + (Math.floor(z / 12) + oz)) || []) if (Math.hypot(h.x - x, h.z - z) < r + h.r) return true; return false; };
    function vBlocked(x, z) { return villageAt(x, z) > 0.05 && (roadDist(x, z) < 6 || nearHouse(x, z, 2.5)); }
    { // ko'cha lentalari
      const pos = [], idx = [];
      ROADS.forEach((r, ri) => {
        const W = ri === 3 || ri === 10 || ri === 0 ? 3.2 : 2.5; const pts = [];
        for (let i = 1; i < r.length; i++) { const [ax, az] = r[i - 1], [bx, bz] = r[i], L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(L / 2.5)); for (let k = i === 1 ? 0 : 1; k <= n; k++) pts.push([lerp(ax, bx, k / n), lerp(az, bz, k / n)]); }
        const base = pos.length / 3;
        pts.forEach(([x, z], k) => { const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1, nx = -dz / l * W, nz = dx / l * W;
          pos.push(x + nx, heightAt(x + nx, z + nz) + 0.07, z + nz, x - nx, heightAt(x - nx, z - nz) + 0.07, z - nz);
          if (k) { const q = base + k * 2; idx.push(q - 2, q - 1, q, q - 1, q + 1, q); } });
      });
      const rg = new T.BufferGeometry(); rg.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); rg.setIndex(idx); rg.computeVertexNormals();
      const road = new T.Mesh(rg, new T.MeshStandardMaterial({ color: 0x857660, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, side: T.DoubleSide }));
      road.receiveShadow = true; scene.add(road);
    }
    { // uylar: yo'l bo'ylab ikki tomonda
      const list = [];
      const tryHouse = (x, z, ang, w, d) => { if (roadDist(x, z) < Math.max(w, d) / 2 + 2.5 || nearHouse(x, z, Math.max(w, d) * 0.55) || Math.abs(x) > EDGE - 10 || Math.abs(z) > EDGE - 10) return false;
        const h = { x, z, ang, w, d, r: Math.max(w, d) * 0.55 }; houses.push(h); const k = hKey(x, z); if (!hGrid.has(k)) hGrid.set(k, []); hGrid.get(k).push(h); return true; };
      // o'zimizning uy (lager yonida)
      tryHouse(CAMP.x - 9, CAMP.z + 4, 0.1, 11, 8);
      ROADS.forEach((r) => { for (let i = 1; i < r.length; i++) { const [ax, az] = r[i - 1], [bx, bz] = r[i], L = Math.hypot(bx - ax, bz - az), ang = Math.atan2(bx - ax, bz - az);
        for (let t = 5; t < L; t += sr(11, 17)) { const x = lerp(ax, bx, t / L), z = lerp(az, bz, t / L); for (const side of [-1, 1]) { if (srnd() < 0.3) continue; const w = sr(7, 11), d = sr(5.5, 8), off = d / 2 + sr(4, 7);
          tryHouse(x + Math.cos(ang) * off * side, z - Math.sin(ang) * off * side, ang + (side > 0 ? 0 : Math.PI), w, d); } } } });
      const N = houses.length, box = new T.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
      const roofG = (() => { const g = new T.BufferGeometry(); const v = [-0.5, 0, -0.5, 0.5, 0, -0.5, 0, 1, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5, 0, 1, 0.5]; const ix = [0, 2, 1, 3, 4, 5, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 4, 0, 1, 4, 0, 4, 3]; const pos = []; ix.forEach((k) => pos.push(v[k * 3], v[k * 3 + 1], v[k * 3 + 2])); g.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g; })();
      const walls = new T.InstancedMesh(box, new T.MeshStandardMaterial({ roughness: 0.92 }), N), roofs = new T.InstancedMesh(roofG, new T.MeshStandardMaterial({ roughness: 0.55, metalness: 0.25, side: T.DoubleSide }), N);
      const doors = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), new T.MeshStandardMaterial({ color: 0x4a3322, roughness: 0.8 }), N * 3);
      const WALL = [0xe9e2d2, 0xdcd0b8, 0xd2c6ad, 0xece9e1, 0xc9b99a], ROOF = [0xc9ccd0, 0xb3b9be, 0xe4e6e8, 0x8e9aa6, 0x6f86a0, 0xa04a3a, 0x7c8c5c], col = new T.Color();
      const m4 = new T.Matrix4(), qq = new T.Quaternion(), ss = new T.Vector3(), pp = new T.Vector3(), YY = new T.Vector3(0, 1, 0), off = new T.Vector3(); let di = 0;
      houses.forEach((h, i) => {
        const y = Math.min(heightAt(h.x - h.w / 2, h.z), heightAt(h.x + h.w / 2, h.z), heightAt(h.x, h.z - h.d / 2), heightAt(h.x, h.z + h.d / 2)) - 0.3, H = sr(2.8, 3.4) + (i === 0 ? 0.4 : 0);
        qq.setFromAxisAngle(YY, h.ang); pp.set(h.x, y, h.z); ss.set(h.w, H + 0.3, h.d); m4.compose(pp, qq, ss); walls.setMatrixAt(i, m4); walls.setColorAt(i, col.setHex(WALL[(srnd() * WALL.length) | 0]));
        pp.set(h.x, y + H + 0.3, h.z); ss.set(h.w + 0.7, sr(0.9, 1.5), h.d + 0.7); m4.compose(pp, qq, ss); roofs.setMatrixAt(i, m4); roofs.setColorAt(i, col.setHex(i === 0 ? 0x2f6f9f : ROOF[(srnd() * ROOF.length) | 0]));
        // eshik va ikki deraza (yo'l tomonda)
        [[0, 0.3, 2.1, 1.0], [-h.w * 0.3, 1.1, 1.1, 1.2], [h.w * 0.3, 1.1, 1.1, 1.2]].forEach(([ox, oy, hh, ww], k) => { off.set(ox, 0, h.d / 2 + 0.03).applyQuaternion(qq); pp.set(h.x + off.x, y + 0.3 + oy, h.z + off.z); ss.set(ww, hh, 0.08); m4.compose(pp, qq, ss); doors.setMatrixAt(di, m4); doors.setColorAt(di++, col.setHex(k ? 0x2b3d4f : 0x5a3a22)); });
        // to'qnashuv: uy bo'ylab ikki doira
        const ex = Math.sin(h.ang + Math.PI / 2), ez = Math.cos(h.ang + Math.PI / 2), r = Math.min(h.w, h.d) / 2 + 0.2;
        [-1, 0, 1].forEach((k) => addTrunk(h.x + ex * k * (h.w / 2 - r), h.z + ez * k * (h.w / 2 - r), r));
      });
      doors.count = di;
      [walls, roofs].forEach((m) => { m.castShadow = true; m.receiveShadow = true; scene.add(m); }); scene.add(doors);
      // bog'lar: uylar ortida mevali daraxt qatorlari
      const fruitGeo = merge([[new T.CylinderGeometry(0.1, 0.16, 1.4, 6).translate(0, 0.7, 0), 0x5a4128], [new T.IcosahedronGeometry(1.15, 1).scale(1, 0.85, 1).translate(0, 2.1, 0), 0x5c8a30], [new T.IcosahedronGeometry(0.7, 0).translate(0.6, 2.4, 0.3), 0x6b9a38]]);
      const popGeo = merge([[new T.CylinderGeometry(0.12, 0.2, 2, 6).translate(0, 1, 0), 0x6b5a44], [new T.ConeGeometry(0.95, 9, 8).translate(0, 6, 0), 0x4c7a2e], [new T.ConeGeometry(0.7, 4, 8).translate(0, 10, 0), 0x56862f]]);
      const fruits = [], pops = [];
      houses.forEach((h) => { if (srnd() < 0.35) return; const rows = 2 + ((srnd() * 3) | 0), cols = 3 + ((srnd() * 4) | 0), back = h.d / 2 + 5, sp = 4.2, fx = Math.sin(h.ang), fz = Math.cos(h.ang), rx = Math.cos(h.ang), rz = -Math.sin(h.ang);
        for (let a = 0; a < rows; a++) for (let b = 0; b < cols; b++) { const along = -(back + a * sp), side = (b - (cols - 1) / 2) * sp, x = h.x + fx * along + rx * side + sr(-0.5, 0.5), z = h.z + fz * along + rz * side + sr(-0.5, 0.5);
          if (roadDist(x, z) > 3.5 && !nearHouse(x, z, 1.2)) fruits.push([x, z]); } });
      ROADS.forEach((r, ri) => { if (ri % 3) return; for (let i = 1; i < r.length; i++) { const [ax, az] = r[i - 1], [bx, bz] = r[i], L = Math.hypot(bx - ax, bz - az); for (let t = 3; t < L; t += 6) { if (srnd() < 0.55) continue; const x = lerp(ax, bx, t / L) + (bz - az) / L * 4.2, z = lerp(az, bz, t / L) - (bx - ax) / L * 4.2; if (!nearHouse(x, z, 1)) pops.push([x, z]); } } });
      for (let i = 0; i < RAVINE.length - 1; i++) for (let k = 0; k < 14; k++) { const t = srnd(), x = lerp(RAVINE[i][0], RAVINE[i + 1][0], t) + sr(-5, 5), z = lerp(RAVINE[i][1], RAVINE[i + 1][1], t) + sr(-5, 5); (srnd() < 0.3 ? pops : fruits).push([x, z]); }
      const fr = inst(fruitGeo, vmat, fruits, () => rr(0.8, 1.2), 0.25), pp2 = inst(popGeo, vmat, pops, () => rr(0.85, 1.25), 0.25);
      [fr, pp2].forEach((m) => (m.userData.village = true));
    }
    inst(pineGeo, vmat, scatter(1200 * D, (x, z, b) => b.forest > 0.45 && Math.random() < b.forest), () => rr(0.8, 1.35), 0.35);
    inst(oakGeo, vmat, scatter(160 * D, (x, z, b) => b.field > 0.6 && Math.random() < 0.5 || (b.forest > 0.15 && b.forest < 0.5)), () => rr(0.8, 1.3), 0.4);
    inst(bushGeo, vmat, scatter(500 * D, (x, z, b) => b.desert < 0.3), () => rr(0.6, 1.4), 0);
    inst(cactusGeo, vmat, scatter(170 * D, (x, z, b) => b.desert > 0.6), () => rr(0.7, 1.3), 0.35);
    inst(shrubGeo, vmat, scatter(260 * D, (x, z, b) => b.desert > 0.4), () => rr(0.6, 1.4), 0);
    inst(rockGeo, vmat, scatter(320 * D, (x, z, b) => Math.random() < 0.3 + b.desert * 0.5), () => rr(0.4, 1.8), 0);
    // O't: o'yinchi atrofida (siljib turadi)
    const bladeTex = (() => { const c = document.createElement("canvas"); c.width = 64; c.height = 128; const g = c.getContext("2d"); for (let i = 0; i < 9; i++) { const x = 8 + i * 6 + rr(-2, 2), lean = rr(-10, 10); const gr = g.createLinearGradient(0, 128, 0, 0); gr.addColorStop(0, "#3a5a1c"); gr.addColorStop(1, Math.random() < 0.5 ? "#b4c66a" : "#93b04e"); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 3, 128); g.quadraticCurveTo(x + lean * 0.3, 60, x + lean, rr(6, 40)); g.quadraticCurveTo(x + lean * 0.3 + 2, 60, x + 3, 128); g.fill(); } const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t; })();
    const bladeGeo = (() => { const a = new T.PlaneGeometry(0.9, 0.7); a.translate(0, 0.33, 0); const b = a.clone(); b.rotateY(Math.PI / 2); const g = new T.BufferGeometry(); const pa = [...a.toNonIndexed().attributes.position.array, ...b.toNonIndexed().attributes.position.array], ua = [...a.toNonIndexed().attributes.uv.array, ...b.toNonIndexed().attributes.uv.array]; g.setAttribute("position", new T.Float32BufferAttribute(pa, 3)); g.setAttribute("uv", new T.Float32BufferAttribute(ua, 2)); g.computeVertexNormals(); return g; })();
    const grassMat = new T.MeshStandardMaterial({ map: bladeTex, alphaTest: 0.45, side: T.DoubleSide, roughness: 1 });
    grassMat.onBeforeCompile = (sh) => { sh.uniforms.uTime = uTime; sh.vertexShader = "uniform float uTime;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
      vec4 wq = instanceMatrix * vec4(0.0,0.0,0.0,1.0); float w = position.y * 0.35; transformed.x += sin(uTime * 2.0 + wq.x * 0.4 + wq.z * 0.3) * w * 0.3; transformed.z += cos(uTime * 1.6 + wq.z * 0.4) * w * 0.2;`); };
    const GN = LOW ? 1500 : MOBILE ? 3500 : 7000, grass = new T.InstancedMesh(bladeGeo, grassMat, GN), gOff = [];
    for (let i = 0; i < GN; i++) gOff.push([rr(-55, 55), rr(-55, 55), Math.random() * 6.28, rr(0.6, 1.3), Math.random()]);
    grass.receiveShadow = true; scene.add(grass);
    let gCenter = [1e9, 1e9];
    function placeGrass(cx, cz) {
      gCenter = [cx, cz];
      gOff.forEach(([ox, oz, r, s, k], i) => { const x = Math.round(cx / 10) * 10 + ox, z = Math.round(cz / 10) * 10 + oz, b = biome(x, z); const keep = b.desert < 0.35 && Math.max(Math.abs(x), Math.abs(z)) < EDGE && k > b.forest * 0.6;
        q.setFromAxisAngle(Y, r); const ss = keep ? s * (1 - b.desert) : 0.0001; sc.set(ss, ss * (b.forest > 0.5 ? 0.7 : 1), ss); ps.set(x, heightAt(x, z) - 0.05, z); mtx.compose(ps, q, sc); grass.setMatrixAt(i, mtx); });
      grass.instanceMatrix.needsUpdate = true;
    }

    /* ---------- Lager (boshlang'ich joy) ---------- */
    const camp = new T.Group(); camp.position.set(CAMP.x, heightAt(CAMP.x, CAMP.z), CAMP.z); scene.add(camp);
    {
      const logs = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 1.2, 6), new T.MeshStandardMaterial({ color: 0x5a3a22 })); [0, 1, 2].forEach((i) => { const l = logs.clone(); l.rotation.z = Math.PI / 2; l.rotation.y = i * 1.05; l.position.y = 0.15; camp.add(l); });
      [[3, 2], [-2, 4], [4, -3]].forEach(([x, z]) => { const s = new T.Mesh(new T.CylinderGeometry(0.4, 0.45, 0.45, 8), new T.MeshStandardMaterial({ color: 0x6b4a2a })); s.position.set(x, 0.22, z); s.castShadow = true; camp.add(s); }); }
    const glowTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,240,200,1)"); gr.addColorStop(0.3, "rgba(255,160,60,.8)"); gr.addColorStop(1, "rgba(255,80,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
    const flame = new T.Sprite(new T.SpriteMaterial({ map: glowTex, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); flame.position.y = 0.6; flame.scale.set(1.2, 1.6, 1); camp.add(flame);
    const fireL = new T.PointLight(0xff8a3a, 1.6, 14, 2); fireL.position.y = 1; camp.add(fireL);

    /* ---------- Holat ---------- */
    const me = { ride: false, x: CAMP.x, z: CAMP.z - 9, y: 0, yaw: Math.PI, pitch: 0, vx: 0, vz: 0, hp: 100, crouch: false, bob: 0, stepT: 0, hurtT: 0, regenT: 0 };
    me.y = heightAt(me.x, me.z);
    const st = { started: false, paused: false, aim: false, fireT: 0, reloadT: 0, triggered: false, kick: 0, shop: null, shake: 0, mag: {}, noiseT: 0, dead: false };
    WORDER.forEach((w) => (st.mag[w] = save.owned.includes(w) ? WEAPONS[w].mag : 0));
    const animals = [], carcasses = [];

    /* ---------- HUD ---------- */
    const hud = document.createElement("div");
    hud.className = "ov-hud";
    hud.innerHTML = `
      <div class="ov-tl"><div class="ov-hp"><span>❤</span><div><i data-hp></i></div><b data-hpn>100</b></div>
        <div class="ov-chips"><span>💰 <b data-money>0</b></span><span>🎒 <b data-bag>0/3</b></span></div></div>
      <canvas class="ov-map" data-map width="220" height="220"></canvas>
      <div class="ov-cross" data-cross><i></i><i></i><i></i><i></i></div><div class="ov-hitm" data-hitm></div>
      <div class="ov-scope" data-scope hidden><div class="ov-lens"></div></div>
      <div class="ov-warn" data-warn></div><div class="ov-ban" data-ban></div>
      <div class="ov-prompt" data-prompt hidden></div><div class="ov-team" data-team hidden></div><div class="ov-feed" data-feed></div>
      <div class="ov-weap"><b data-wname>Revolver</b><span><b data-mag>6</b> / <small data-ammo>30</small></span><em data-wstate></em></div>
      <div class="ov-dmg" data-dmg></div>
      <div class="ov-panel" data-panel hidden></div>
      <button class="ov-btn menu" data-b="menu" type="button">☰</button>
      <button class="ov-btn shop" data-b="shop" type="button">🏪<small>Do‘kon</small></button>
      ${MOBILE ? `<div class="ov-joy" data-joy><i></i></div>
        <button class="ov-tb fire" data-tb="fire">🎯</button><button class="ov-tb aim" data-tb="aim">🔭</button><button class="ov-tb pick" data-tb="pick">🎒</button>
        <button class="ov-tb rel" data-tb="reload">↻</button><button class="ov-tb sw" data-tb="switch">🔫</button><button class="ov-tb run" data-tb="run">🏃</button><button class="ov-tb cr" data-tb="crouch">⇩</button><button class="ov-tb horse" data-tb="horse">🐎</button>` : ""}`;
    container.appendChild(hud);
    const $ = (s) => hud.querySelector(s);
    const ui = { hp: $("[data-hp]"), hpn: $("[data-hpn]"), money: $("[data-money]"), bag: $("[data-bag]"), map: $("[data-map]"), cross: $("[data-cross]"), hitm: $("[data-hitm]"), scope: $("[data-scope]"), warn: $("[data-warn]"), ban: $("[data-ban]"), prompt: $("[data-prompt]"), team: $("[data-team]"), feed: $("[data-feed]"), wname: $("[data-wname]"), mag: $("[data-mag]"), ammo: $("[data-ammo]"), wstate: $("[data-wstate]"), dmg: $("[data-dmg]"), panel: $("[data-panel]") };
    let banT = 0, warnT = 0;
    const feed = (html) => { const d = document.createElement("div"); d.innerHTML = html; ui.feed.appendChild(d); while (ui.feed.children.length > 4) ui.feed.firstChild.remove(); setTimeout(() => d.remove(), 6000); };
    const banner = (html, ms = 2200) => { ui.ban.innerHTML = html; ui.ban.classList.add("on"); banT = performance.now() + ms; };
    const warn = (t, ms = 2000) => { ui.warn.textContent = t; ui.warn.classList.add("on"); warnT = performance.now() + ms; };
    const persist = () => { opts.onSave && opts.onSave(save); };

    /* ---------- Qurollar (Ultimate Guns Pack, CC0) ---------- */
    const vmScene = new T.Scene(); vmScene.environment = scene.environment;
    vmScene.add(new T.HemisphereLight(0xfff2dd, 0x5a4a30, 1.1)); const vmL = new T.DirectionalLight(0xffe2b8, 1.5); vmL.position.set(1, 2, 1); vmScene.add(vmL);
    const vmCam = new T.PerspectiveCamera(55, 1, 0.01, 10);
    const vmHold = new T.Group(); vmScene.add(vmHold);
    const gunModels = {};
    const flash = new T.Sprite(new T.SpriteMaterial({ map: glowTex, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); flash.visible = false;
    async function loadGun(id) {
      if (gunModels[id]) return gunModels[id];
      const W = WEAPONS[id];
      try {
        const g = await loadGLTF(`games/models/guns/${W.file}.glb?v=1`);
        const m = g.scene; m.updateMatrixWorld(true);
        const bb = new T.Box3().setFromObject(m), size = bb.getSize(new T.Vector3()), ctr = bb.getCenter(new T.Vector3());
        // eng uzun o'q bo'ylab; og'iz — ingichka uch
        const ax = size.x >= size.y && size.x >= size.z ? "x" : size.z >= size.y ? "z" : "y";
        const ends = [0, 0], th = [0, 0];
        m.traverse((o) => { if (!o.isMesh) return; const p = o.geometry.attributes.position, v = new T.Vector3(); for (let i = 0; i < p.count; i += 3) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); const t = (v[ax] - bb.min[ax]) / size[ax]; if (t < 0.12) { ends[0]++; th[0] = Math.max(th[0], Math.abs(v.y - ctr.y)); } if (t > 0.88) { ends[1]++; th[1] = Math.max(th[1], Math.abs(v.y - ctr.y)); } } });
        const muzzleHigh = (th[1] < th[0]) !== !!W.flip; // ingichka uch — stvol
        const k = W.len / size[ax];
        const piv = new T.Group(); m.position.sub(ctr); piv.add(m); piv.scale.setScalar(k);
        if (ax === "x") piv.rotation.y = muzzleHigh ? Math.PI / 2 : -Math.PI / 2;
        else if (ax === "z") piv.rotation.y = muzzleHigh ? Math.PI : 0;
        piv.traverse((o) => { if (o.isMesh) { o.castShadow = false; if (o.material) { o.material = o.material.clone(); o.material.envMapIntensity = 1; } } });
        const holder = new T.Group(); holder.add(piv);
        holder.userData.muzzle = new T.Vector3(0, 0.02, -W.len / 2 - 0.02);
        return (gunModels[id] = holder);
      } catch (e) {
        const holder = new T.Group(); const b = new T.Mesh(new T.BoxGeometry(0.06, 0.08, W.len), new T.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.4 })); holder.add(b); holder.userData.muzzle = new T.Vector3(0, 0, -W.len / 2); return (gunModels[id] = holder);
      }
    }
    async function equip(id) {
      if (!save.owned.includes(id)) return;
      save.cur = id; persist();
      const g = await loadGun(id);
      if (save.cur !== id) return;
      vmHold.clear(); vmHold.add(g); g.add(flash); flash.position.copy(g.userData.muzzle); flash.scale.setScalar(id === "shotgun" ? 0.6 : 0.4);
      st.reloadT = 0; st.aim = false;
      ui.wname.textContent = WEAPONS[id].name;
    }

    /* ---------- Hayvonlar ---------- */
    const RIG = {}; let MERCH = null, HUNTER = null;
    async function loadAnimals() {
      const jobs = ["Wolf", "Horse", "Horse_White", "Bull", "Deer", "Stag"].map((n) => loadGLTF(`games/models/animals/${n}.glb?v=1`).then((g) => (RIG[n] = g)).catch(() => {}));
      jobs.push(loadLBM("lawman").then((m) => (MERCH = m)).catch(() => {}));
      jobs.push(loadLBM("soldier").then((m) => (HUNTER = m)).catch(() => {}));
      await Promise.all(jobs);
    }
    /** Quaternius animatsiyali modeli (CC0): Idle, Walk, Gallop, Eating, Attack, Death */
    function rigVisual(model, len, tint) {
      const G0 = RIG[model]; if (!G0) return null;
      const root = T.SkeletonUtils.clone(G0.scene);
      root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; if (tint && o.material && o.material.name === "Main") { o.material = o.material.clone(); o.material.color.setHex(tint); } } });
      root.updateMatrixWorld(true);
      // kvantlangan skinli mesh o'lchami noto'g'ri chiqadi — suyaklar bo'yicha o'lchaymiz
      const bb = new T.Box3(); root.traverse((o) => { if (o.isBone) bb.expandByPoint(o.getWorldPosition(new T.Vector3())); });
      const sz = bb.getSize(new T.Vector3()), s = (len * 1.15) / Math.max(1e-3, sz.z, sz.x); root.scale.multiplyScalar(s);
      const g = new T.Group(), body = new T.Group(); body.add(root); g.add(body); g.userData.H = sz.y * s;
      const mixer = new T.AnimationMixer(root), acts = {}; G0.animations.forEach((c) => (acts[c.name] = mixer.clipAction(c)));
      if (!acts.Attack) acts.Attack = acts.Attack_Headbutt || acts.Attack_Kick;
      let cur = null;
      const play = (n, once) => { const a = acts[n]; if (!a || cur === n) return; a.reset(); if (once) { a.setLoop(T.LoopOnce, 1); a.clampWhenFinished = true; } else a.setLoop(T.LoopRepeat, Infinity); a.fadeIn(0.25).play(); if (cur && acts[cur]) acts[cur].fadeOut(0.25); cur = n; };
      play("Idle"); mixer.update(Math.random() * 2);
      return { g, body, mixer, play, acts, kind: "rig", get cur() { return cur; } };
    }
    /** Ayiq va yovvoyi cho'chqa — past poligonli, bo'g'imli model */
    function procVisual(type) {
      const M = (c, r = 0.9) => new T.MeshStandardMaterial({ color: c, roughness: r, flatShading: true });
      const ico = (r, d = 1) => new T.IcosahedronGeometry(r, d);
      const g = new T.Group(), body = new T.Group(); g.add(body);
      const add = (par, geo, mat, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = true; par.add(m); return m; };
      const legs = [], head = new T.Group(), tail = new T.Group();
      if (type === "ayiq") {
        const fur = M(0x4a2f1c), dark = M(0x2b1a0f), light = M(0x7a5a3c), black = M(0x111111, 0.4);
        add(body, ico(1, 1), fur, 0, 1.0, -0.05, 0.6, 0.6, 1.0); add(body, ico(0.5, 1), fur, 0, 1.33, 0.42, 1.05, 0.9, 1.1); add(body, ico(0.55, 1), fur, 0, 1.02, -0.62, 1.0, 0.95, 0.9);
        head.position.set(0, 1.18, 0.95); body.add(head);
        add(head, ico(0.36, 1), fur, 0, 0, 0.05, 0.95, 0.85, 1.05); add(head, new T.CylinderGeometry(0.12, 0.19, 0.36, 7).rotateX(Math.PI / 2), light, 0, -0.08, 0.38); add(head, ico(0.07, 0), black, 0, -0.02, 0.57);
        [-1, 1].forEach((sx) => { add(head, ico(0.1, 0), dark, sx * 0.21, 0.27, -0.04); add(head, ico(0.035, 0), black, sx * 0.14, 0.08, 0.3); });
        [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => { const l = new T.Group(); l.position.set(sx * 0.3, 0.98, sz * 0.62); add(l, new T.CylinderGeometry(0.2, 0.15, 0.9, 7).translate(0, -0.45, 0), fur, 0, 0, 0); add(l, new T.BoxGeometry(0.26, 0.12, 0.34), dark, 0, -0.9, 0.05); body.add(l); legs.push(l); });
        tail.position.set(0, 1.15, -1.05); add(tail, ico(0.09, 0), fur, 0, 0, 0); body.add(tail);
      } else {
        const fur = M(0x3e2c1f), dark = M(0x261a12), snout = M(0x5e443a, 0.6), tusk = M(0xece2c8, 0.4), black = M(0x111111, 0.4);
        add(body, ico(1, 1), fur, 0, 0.62, -0.1, 0.36, 0.4, 0.72); add(body, ico(0.45, 1), fur, 0, 0.7, 0.32, 0.9, 1.08, 0.95);
        for (let k = 0; k < 8; k++) { const z = 0.5 - k * 0.13; add(body, new T.ConeGeometry(0.05, 0.16 - k * 0.008, 4), dark, 0, 1.08 - k * 0.025 - Math.abs(z - 0.2) * 0.12, z); }
        head.position.set(0, 0.7, 0.66); body.add(head);
        add(head, new T.ConeGeometry(0.26, 0.62, 7).rotateX(Math.PI / 2), fur, 0, -0.04, 0.25, 1, 1.1, 1); add(head, new T.CylinderGeometry(0.095, 0.095, 0.06, 8).rotateX(Math.PI / 2), snout, 0, -0.08, 0.56);
        [-1, 1].forEach((sx) => { add(head, new T.ConeGeometry(0.025, 0.16, 5).rotateZ(-sx * 0.5), tusk, sx * 0.09, -0.06, 0.44); add(head, new T.ConeGeometry(0.07, 0.17, 4).rotateX(-0.3), dark, sx * 0.13, 0.17, 0.02); add(head, ico(0.025, 0), black, sx * 0.12, 0.05, 0.22); });
        [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => { const l = new T.Group(); l.position.set(sx * 0.16, 0.48, sz * 0.4); add(l, new T.CylinderGeometry(0.065, 0.045, 0.48, 6).translate(0, -0.24, 0), fur, 0, 0, 0); add(l, new T.BoxGeometry(0.08, 0.06, 0.1), black, 0, -0.48, 0.01); body.add(l); legs.push(l); });
        tail.position.set(0, 0.78, -0.78); add(tail, new T.CylinderGeometry(0.015, 0.012, 0.3, 4).translate(0, -0.15, 0), dark, 0, 0, 0); tail.rotation.x = 0.4; body.add(tail);
      }
      return { g, body, legs, head, tail, kind: "proc" };
    }
    function boxAnimal(cfg, color) { const g = new T.Group(), body = new T.Group(); g.add(body); const m = new T.Mesh(new T.BoxGeometry(cfg.len * 0.35, cfg.h * 0.5, cfg.len), new T.MeshStandardMaterial({ color })); m.position.y = cfg.h * 0.6; m.castShadow = true; body.add(m); return { g, body, kind: "box" }; }
    function makeVisual(type) {
      const cfg = ANIMALS[type];
      if (!cfg.model) return procVisual(type);
      return rigVisual(cfg.model, cfg.len, cfg.tint) || boxAnimal(cfg, 0x8a6a4a);
    }
    let aSeq = 0;
    function spawn(type, x, z, herd, id) {
      const cfg = ANIMALS[type], vis = makeVisual(type);
      vis.g.position.set(x, heightAt(x, z), z); scene.add(vis.g);
      const a = { id: id || myCid.slice(0, 4) + "-" + (aSeq++).toString(36), type, cfg, vis, x, z, nx: x, nz: z, yaw: Math.random() * 6.28, hp: cfg.hp, state: "graze", t: rr(2, 6), tx: x, tz: z, speed: 0, ph: Math.random() * 6, herd, home: [x, z], attackT: 0, soundT: rr(5, 20), alive: true, deadT: 0, fall: 0 };
      animals.push(a); return a;
    }
    function spawnPos(type, far) {
      const want = ANIMALS[type].biome;
      for (let k = 0; k < 200; k++) {
        const x = rr(-EDGE + 15, EDGE - 15), z = rr(-EDGE + 15, EDGE - 15), b = biome(x, z);
        if (Math.hypot(x - CAMP.x, z - CAMP.z) < 60 || villageAt(x, z) > 0.2) continue;
        if (far && Math.hypot(x - me.x, z - me.z) < far) continue;
        const w = want === "forest" ? b.forest : want === "desert" ? b.desert : b.field;
        if (w > 0.6 || (type === "bori" && b.field > 0.7 && Math.random() < 0.3)) return [x, z];
      }
      return [rr(-120, 120) * K, rr(-120, 60) * K];
    }
    function spawnHerd(type, far = 0) {
      const cfg = ANIMALS[type], [hx, hz] = spawnPos(type, far), n = Math.round(rr(cfg.herd[0], cfg.herd[1] + 0.99) - 0.49), herd = { id: Math.random(), alarm: 0 };
      for (let i = 0; i < Math.max(1, n); i++) spawn(type, hx + rr(-6, 6), hz + rr(-6, 6), herd);
    }
    function populate() { Object.keys(ANIMALS).forEach((type) => { let have = 0; while (have < ANIMALS[type].n) { const before = animals.length; spawnHerd(type); have += animals.length - before; } }); }

    /* ---------- Mening otim ---------- */
    const horse = { x: CAMP.x + 5, z: CAMP.z - 4, yaw: Math.PI * 0.8, speed: 0, vis: null, call: false, stepT: 0 };
    function makeRideHorse() {
      const v = rigVisual("Horse_White", 2.4); if (!v) return null;
      const H = v.g.userData.H;
      const leather = new T.MeshStandardMaterial({ color: 0x5a3418, roughness: 0.6 }), cloth = new T.MeshStandardMaterial({ color: 0xa8272b, roughness: 0.9 });
      const saddle = new T.Group(); saddle.position.set(0, H * 0.74, -0.12);
      const s1 = new T.Mesh(new T.BoxGeometry(0.7, 0.05, 0.8), cloth); s1.position.y = 0.0; saddle.add(s1);
      const s2 = new T.Mesh(new T.BoxGeometry(0.42, 0.1, 0.55), leather); s2.position.y = 0.06; saddle.add(s2);
      const back = new T.Mesh(new T.BoxGeometry(0.42, 0.14, 0.08), leather); back.position.set(0, 0.14, -0.26); saddle.add(back);
      const horn = new T.Mesh(new T.CylinderGeometry(0.03, 0.04, 0.16, 6), leather); horn.position.set(0, 0.16, 0.25); saddle.add(horn);
      [-1, 1].forEach((sx) => { const st2 = new T.Mesh(new T.BoxGeometry(0.02, 0.5, 0.05), leather); st2.position.set(sx * 0.3, -0.22, 0); saddle.add(st2); });
      v.body.add(saddle); v.H = H; return v;
    }
    function toggleRide() {
      if (st.dead || !horse.vis) return;
      if (me.ride) { me.ride = false; me.x += Math.cos(me.yaw) * 1.7; me.z -= Math.sin(me.yaw) * 1.7; horse.speed = 0; Snd.snort(); return; }
      const d = Math.hypot(horse.x - me.x, horse.z - me.z);
      if (d < 4.2) { me.ride = true; me.crouch = false; me.x = horse.x; me.z = horse.z; me.yaw = horse.yaw + Math.PI; horse.call = false; Snd.snort(); banner(`<b>🐎 Otdasiz!</b><small>${MOBILE ? "🏃 — chopish · 🐎 — tushish" : "Shift — chopish · F — tushish"}</small>`, 2200); }
      else { horse.call = true; Snd.whistle(); banner("<b>🐎 Otingiz kelmoqda…</b>", 1800); }
    }
    function updateHorse(dt) {
      const V = horse.vis; if (!V) return;
      if (me.ride) {
        horse.x = me.x; horse.z = me.z; const v = Math.hypot(me.vx, me.vz); horse.speed = v;
        horse.yaw += angDiff(horse.yaw, v > 0.6 ? Math.atan2(me.vx, me.vz) : me.yaw + Math.PI) * Math.min(1, dt * (v > 0.6 ? 6 : 3));
        horse.stepT -= dt * v; if (horse.stepT <= 0) { horse.stepT = v > 8 ? 1.35 : 1.6; Snd.hoof(v > 8 ? 1 : 0.6); if (v > 8) setTimeout(() => Snd.hoof(0.8), 110); }
      } else if (horse.call) {
        const dx = me.x - horse.x, dz = me.z - horse.z, d = Math.hypot(dx, dz);
        if (d < 3) { horse.call = false; horse.speed = 0; }
        else { horse.yaw += angDiff(horse.yaw, Math.atan2(dx, dz)) * Math.min(1, dt * 5); horse.speed += ((d > 12 ? 12 : 4) - horse.speed) * Math.min(1, dt * 2); horse.x += Math.sin(horse.yaw) * horse.speed * dt; horse.z += Math.cos(horse.yaw) * horse.speed * dt; }
      } else horse.speed *= 0.9;
      V.g.position.set(horse.x, heightAt(horse.x, horse.z), horse.z); V.g.rotation.y = horse.yaw;
      const sp = horse.speed; V.play(sp > 6.5 ? "Gallop" : sp > 0.4 ? "Walk" : "Idle");
      V.mixer.update(dt * (sp > 6.5 ? clamp(sp / 11, 0.7, 1.4) : sp > 0.4 ? clamp(sp / 2, 0.6, 2) : 1));
    }

    /* ---------- Do'stlar ---------- */
    const nameTex = (name, color) => canvasTex(256, (g) => { g.font = "800 34px system-ui"; g.textAlign = "center"; g.textBaseline = "middle"; const w = g.measureText(name).width + 28; g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(128 - w / 2, 106, w, 46); g.fillStyle = color; g.fillText(name, 128, 130); }, 1);
    const PCOL = ["#7dd3fc", "#fca5a5", "#c4b5fd", "#86efac"];
    function makePeer(cid, name) {
      const g = new T.Group(), col = PCOL[peers.size % 4];
      const body = new T.Group(); g.add(body);
      fillHunter(body);
      const tag = new T.Sprite(new T.SpriteMaterial({ map: nameTex(name, col), transparent: true, depthTest: false })); tag.scale.set(3, 3, 1); tag.position.y = 2.1; g.add(tag);
      scene.add(g);
      return { real: !!HUNTER, cid, name, col, g, body, tag, horse: null, x: me.x, z: me.z, tx: me.x, tz: me.z, yaw: 0, tyaw: 0, ride: false, cr: false, dead: false, seen: performance.now(), sp: 0 };
    }
    function fillHunter(body) {
      body.clear();
      if (HUNTER) { const m = new T.Mesh(HUNTER.geo, new T.MeshStandardMaterial({ map: HUNTER.tex, roughness: 0.8 })); const s = 1.8 / (HUNTER.geo.boundingBox.max.y - HUNTER.geo.boundingBox.min.y); m.scale.setScalar(s); m.position.y = -HUNTER.geo.boundingBox.min.y * s; m.castShadow = true; body.add(m); }
      else { const m = new T.Mesh(new T.CapsuleGeometry(0.3, 1.1, 4, 8), new T.MeshStandardMaterial({ color: 0x6b5a3a })); m.position.y = 0.9; body.add(m); }
    }
    function dropPeer(cid) { const p = peers.get(cid); if (!p) return; scene.remove(p.g); if (p.horse) scene.remove(p.horse.g); peers.delete(cid); drawTeam(); }
    function drawTeam() {
      if (!net) return;
      ui.team.hidden = false;
      ui.team.innerHTML = `<b>🔑 ${esc(net.code || "")}</b><span style="color:#fde68a">${esc(net.name)}</span>${[...peers.values()].map((p) => `<span style="color:${p.col}">${esc(p.name)}${p.dead ? " 🩹" : p.ride ? " 🐎" : ""}</span>`).join("")}`;
    }
    function animatePeers(dt) {
      peers.forEach((p) => {
        if (!p.real && HUNTER) { p.real = true; fillHunter(p.body); }
        const ox = p.x, oz = p.z;
        if (Math.hypot(p.tx - p.x, p.tz - p.z) > 15) { p.x = p.tx; p.z = p.tz; } else { p.x += (p.tx - p.x) * Math.min(1, dt * 8); p.z += (p.tz - p.z) * Math.min(1, dt * 8); }
        p.sp = p.sp * 0.8 + (Math.hypot(p.x - ox, p.z - oz) / Math.max(dt, 1e-3)) * 0.2;
        p.yaw += angDiff(p.yaw, p.tyaw) * Math.min(1, dt * 8);
        const y = heightAt(p.x, p.z);
        p.g.position.set(p.x, y, p.z); p.g.rotation.y = p.yaw + Math.PI;
        if (p.ride) {
          if (!p.horse) { p.horse = makeRideHorse(); if (p.horse) scene.add(p.horse.g); }
          if (p.horse) { p.horse.g.visible = true; p.horse.g.position.set(p.x, y, p.z); if (p.sp > 0.6) p.horse.g.rotation.y += angDiff(p.horse.g.rotation.y, Math.atan2(p.x - ox, p.z - oz)) * Math.min(1, dt * 6); p.horse.play(p.sp > 6.5 ? "Gallop" : p.sp > 0.4 ? "Walk" : "Idle"); p.horse.mixer.update(dt); }
          p.body.position.y = (p.horse ? p.horse.H * 0.74 : 1.4) - 0.55; p.body.scale.y = 0.85;
        } else { if (p.horse) p.horse.g.visible = false; p.body.position.y = p.cr ? -0.35 : 0; p.body.scale.y = 1; p.body.position.y += Math.abs(Math.sin(performance.now() / 160)) * Math.min(1, p.sp / 4) * 0.06; }
        p.body.rotation.z = p.dead ? Math.PI / 2 : 0;
        p.tag.position.y = p.ride ? 3.2 : 2.15;
      });
    }
    const SI = ["graze", "walk", "flee", "chase", "dead"];
    let pT = 0, aT = 0;
    function netTick(dt) {
      if (!net) { if (st.loaded && !animals.length) populate(); return; }
      pT -= dt; aT -= dt;
      if (pT <= 0) { pT = 0.12; send({ t: "p", c: myCid, n: net.name, x: +me.x.toFixed(2), z: +me.z.toFixed(2), yaw: +me.yaw.toFixed(2), ride: me.ride ? 1 : 0, cr: me.crouch ? 1 : 0, dead: st.dead ? 1 : 0 }); }
      if (isHost()) {
        if (st.loaded && !animals.length) populate();
        if (aT <= 0) { aT = 0.25; send({ t: "a", h: myCid, s: animals.map((a) => [a.id, ATYPES.indexOf(a.type), Math.round(a.x * 10), Math.round(a.z * 10), Math.round(a.yaw * 100), Math.round(a.speed * 10), SI.indexOf(a.state), a.alive ? 1 : 0, (a.atkT || 0) > 0 ? 1 : 0]) }); }
      }
    }
    function applySnap(list) {
      if (!st.loaded) return;
      const seen = new Set();
      for (const [id, ti, x, z, yaw, spd, si, al, atk] of list) {
        seen.add(id);
        let a = animals.find((q) => q.id === id);
        if (!a) { a = spawn(ATYPES[ti], x / 10, z / 10, null, id); a.yaw = yaw / 100; }
        a.nx = x / 10; a.nz = z / 10; a.nyaw = yaw / 100; a.speed = spd / 10; a.state = SI[si] || "graze";
        if (atk && !(a.atkT > 0)) a.atkT = 0.6;
        if (!al && a.alive) onKill(a, null, false);
      }
      for (let i = animals.length - 1; i >= 0; i--) if (!seen.has(animals[i].id)) removeAnimal(animals[i]);
    }
    function netMsg(m) {
      if (!m || !alive) return;
      if (m.t === "p" && m.c !== myCid) {
        let p = peers.get(m.c); const fresh = !p;
        if (!p) { p = makePeer(m.c, m.n || "Ovchi"); peers.set(m.c, p); p.x = p.tx = m.x; p.z = p.tz = m.z; feed(`👋 ${esc(p.name)} ovga qo‘shildi`); }
        p.tx = m.x; p.tz = m.z; p.tyaw = m.yaw; const ch = p.ride !== !!m.ride || p.dead !== !!m.dead; p.ride = !!m.ride; p.cr = !!m.cr; p.dead = !!m.dead; p.seen = performance.now();
        if (fresh || ch) drawTeam();
      } else if (m.t === "a") { if (m.h !== myCid && !isHost()) applySnap(m.s); }
      else if (m.t === "hit") { if (isHost()) { const a = animals.find((q) => q.id === m.id); if (a) damage(a, m.dmg, m.head, m.by); } }
      else if (m.t === "kill") { const a = animals.find((q) => q.id === m.id); if (a) onKill(a, m.by, m.head); }
      else if (m.t === "take") { if (isHost()) { const a = animals.find((q) => q.id === m.id); if (a && !a.alive) { send({ t: "took", id: m.id, by: m.by }); onTook(m.id, m.by); } } }
      else if (m.t === "took") onTook(m.id, m.by);
      else if (m.t === "bite") { if (m.to === myCid && ANIMALS[m.ty]) hurtMe(m.dmg, ANIMALS[m.ty]); }
      else if (m.t === "s" && m.c !== myCid) { const d = Math.hypot(m.x - me.x, m.z - me.z); if (d > 3) Snd.far(m.w, d, panOf(m.x, m.z)); shotNoise(m.x, m.z); }
      else if (m.t === "bye") dropPeer(m.c);
    }
    function setPeers(list) {
      const ids = new Set(list.map((x) => x.cid)); ids.delete(myCid);
      [...peers.keys()].forEach((cid) => { if (!ids.has(cid)) { const p = peers.get(cid); if (p) feed(`🚪 ${esc(p.name)} chiqib ketdi`); dropPeer(cid); } });
      const sorted = list.filter((x) => x && x.cid).sort((a, b) => (a.at || 0) - (b.at || 0) || String(a.cid).localeCompare(String(b.cid)));
      const nh = sorted.length ? sorted[0].cid : myCid;
      if (nh !== hostCid) { hostCid = nh; if (isHost()) animals.forEach((a) => { a.x = a.nx ?? a.x; a.z = a.nz ?? a.z; a.t = rr(1, 4); if (!a.home) a.home = [a.x, a.z]; }); }
      drawTeam();
    }

    /* ---------- Sotuvchi va do'kon ---------- */
    let merchant = null;
    function summonMerchant() {
      if (st.shop) return;
      if (animals.some((a) => a.alive && a.cfg.pred && a.state === "chase" && Math.hypot(a.x - me.x, a.z - me.z) < 35)) { warn("⚠️ Xavfli! Yirtqich yaqin — do‘konni chaqirib bo‘lmaydi"); return; }
      const fx = -Math.sin(me.yaw), fz = -Math.cos(me.yaw), x = me.x + fx * 4.5, z = me.z + fz * 4.5, y = heightAt(x, z);
      merchant = new T.Group(); merchant.position.set(x, y, z); merchant.rotation.y = Math.atan2(me.x - x, me.z - z);
      if (MERCH) { const m = new T.Mesh(MERCH.geo, new T.MeshStandardMaterial({ map: MERCH.tex, roughness: 0.8 })); const s = 1.8 / (MERCH.geo.boundingBox.max.y - MERCH.geo.boundingBox.min.y); m.scale.setScalar(s); m.castShadow = true; merchant.add(m); }
      // arava
      const cart = new T.Group(); cart.position.set(2.2, 0, -0.6);
      const wood = new T.MeshStandardMaterial({ color: 0x7a5232, roughness: 0.85 }), cloth = new T.MeshStandardMaterial({ color: 0xc23b2b, roughness: 0.9, side: T.DoubleSide });
      const box = new T.Mesh(new T.BoxGeometry(1.6, 0.7, 2.4), wood); box.position.y = 0.9; box.castShadow = true; cart.add(box);
      const roof = new T.Mesh(new T.CylinderGeometry(0.95, 0.95, 2.4, 14, 1, true, 0, Math.PI), cloth); roof.rotation.z = Math.PI / 2; roof.rotation.y = Math.PI / 2; roof.position.y = 1.25; cart.add(roof);
      [[-0.85, -0.8], [0.85, -0.8], [-0.85, 0.8], [0.85, 0.8]].forEach(([wx, wz]) => { const w = new T.Mesh(new T.TorusGeometry(0.42, 0.07, 6, 14), wood); w.position.set(wx, 0.42, wz); w.rotation.y = Math.PI / 2; cart.add(w); });
      const sign = new T.Sprite(new T.SpriteMaterial({ map: canvasTex(256, (g, s2) => { g.fillStyle = "#3a2410"; g.fillRect(0, 60, 256, 136); g.fillStyle = "#ffd36a"; g.font = "900 64px system-ui"; g.textAlign = "center"; g.fillText("🏪 DO‘KON", 128, 148); }, 1) }));
      sign.position.set(0, 2.6, 0); sign.scale.set(2.2, 2.2, 1); cart.add(sign);
      merchant.add(cart); scene.add(merchant);
      merchant.userData.t = 0; Snd.magic(); puff(x, y + 1, z);
      openShop("sell");
    }
    function dismissMerchant() { if (!merchant) return; const m = merchant; merchant = null; puff(m.position.x, m.position.y + 1, m.position.z); setTimeout(() => scene.remove(m), 250); }
    function openShop(tab) {
      st.shop = tab; ui.panel.hidden = false; if (document.pointerLockElement) document.exitPointerLock();
      const bagVal = save.bag.reduce((s, t) => s + ANIMALS[t].price, 0);
      ui.panel.innerHTML = `<div class="ov-shop"><header><span>🧔‍♂️</span><div><b>Sotuvchi</b><small>“Assalomu alaykum, ovchi! Nima olib keldingiz?”</small></div><button class="ov-x" data-s="close" type="button">✕</button></header>
        <div class="ov-tabs">${[["sell", "💰 Sotish"], ["guns", "🔫 Qurollar"], ["items", "🎒 Jihozlar"]].map(([k, n]) => `<button data-s="tab" data-k="${k}" class="${tab === k ? "on" : ""}" type="button">${n}</button>`).join("")}</div>
        <div class="ov-money">Hamyon: <b>💰 ${save.money}</b> tanga</div>
        ${tab === "sell" ? (save.bag.length ? `<div class="ov-list">${save.bag.map((t, i) => `<div class="ov-it"><span class="ic">${ANIMALS[t].icon}</span><b>${ANIMALS[t].name}</b><em>+${ANIMALS[t].price} 💰</em><button data-s="sell1" data-i="${i}" type="button">Sotish</button></div>`).join("")}</div>
            <button class="ov-big" data-s="sellall" type="button">💰 Hammasini sotish (+${bagVal})</button>` : `<p class="ov-empty">Xaltangiz bo‘sh. Ov qilib, o‘ljani olib keling! 🏹<br><small>Narxlar: ${Object.values(ANIMALS).map((a) => `${a.icon} ${a.price}`).join(" · ")}</small></p>`)
          : tab === "guns" ? `<div class="ov-list">${WORDER.map((id) => { const W = WEAPONS[id], own = save.owned.includes(id); return `<div class="ov-it gun ${save.cur === id ? "cur" : ""}"><span class="ic">${["🔫", "💥", "🪖", "🎯"][WORDER.indexOf(id)]}</span><div class="gi"><b>${W.name}</b><small>Zarba ${W.dmg}${W.pellets > 1 ? "×" + W.pellets : ""} · masofa ${W.range} m · o‘qdon ${W.mag}${W.scope ? " · durbin 5×" : ""}${W.auto ? " · avtomat" : ""}</small></div>${own ? (save.cur === id ? `<em>✔ Qo‘lda</em>` : `<button data-s="equip" data-k="${id}" type="button">Olish</button>`) : `<button data-s="buyw" data-k="${id}" type="button" ${save.money < W.price ? "disabled" : ""}>💰 ${W.price}</button>`}</div>`; }).join("")}</div>`
          : `<div class="ov-list">${SHOP_ITEMS.map((it) => { const have = it.bag && save.bagCap >= it.bag; return `<div class="ov-it"><span class="ic">${it.icon}</span><b>${it.name}</b>${it.id === "ammo" ? `<em>Bor: ${save.ammo}</em>` : it.id === "med" ? `<em>Bor: ${save.med}</em>` : ""}${have ? `<em>✔ Bor</em>` : `<button data-s="buyi" data-k="${it.id}" type="button" ${save.money < it.price ? "disabled" : ""}>💰 ${it.price}</button>`}</div>`; }).join("")}</div>`}
        <p class="ov-tip">💡 Do‘konni istalgan joyda chaqirish mumkin (🏪 tugma yoki Q). Yirtqich quvayotgan bo‘lsa — kelmaydi.</p></div>`;
    }
    function closeShop() { st.shop = null; ui.panel.hidden = true; dismissMerchant(); lockIt(); }
    ui.panel.addEventListener("click", (e) => {
      const b = e.target.closest("[data-s]"); if (!b) return;
      const a = b.dataset.s, k = b.dataset.k;
      if (a === "close") return closeShop();
      if (a === "tab") return openShop(k);
      if (a === "sell1") { const i = Number(b.dataset.i), t = save.bag[i]; if (!t) return; save.bag.splice(i, 1); save.money += ANIMALS[t].price; save.earned = (save.earned || 0) + ANIMALS[t].price; Snd.coins(); }
      if (a === "sellall") { const v = save.bag.reduce((s, t) => s + ANIMALS[t].price, 0); save.money += v; save.earned = (save.earned || 0) + v; save.bag = []; Snd.coins(); banner(`<b>💰 +${v} tanga</b>`); }
      if (a === "buyw") { const W = WEAPONS[k]; if (save.money >= W.price && !save.owned.includes(k)) { save.money -= W.price; save.owned.push(k); st.mag[k] = W.mag; Snd.coins(); equip(k); banner(`<b>🔫 ${W.name} sotib olindi!</b>`); } }
      if (a === "equip") equip(k);
      if (a === "buyi") { const it = SHOP_ITEMS.find((x) => x.id === k); if (save.money >= it.price) { save.money -= it.price; if (k === "ammo") save.ammo += 20; if (k === "med") save.med++; if (it.bag) save.bagCap = Math.max(save.bagCap, it.bag); Snd.coins(); } }
      persist(); openShop(st.shop);
    });

    /* ---------- Effektlar ---------- */
    const fx = [];
    function puff(x, y, z, color = 0xffffff, n = 16) {
      for (let i = 0; i < n; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color, transparent: true, opacity: 0.6, depthWrite: false })); s.position.set(x + rr(-0.6, 0.6), y + rr(-0.5, 0.5), z + rr(-0.6, 0.6)); s.scale.setScalar(rr(0.6, 1.2)); scene.add(s); fx.push({ o: s, t: 0, life: rr(0.6, 1.1), v: new T.Vector3(rr(-1, 1), rr(0.5, 1.5), rr(-1, 1)) }); }
    }
    function dust(p) { for (let i = 0; i < 6; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: 0xc8b48a, transparent: true, opacity: 0.5, depthWrite: false })); s.position.copy(p); s.scale.setScalar(0.3); scene.add(s); fx.push({ o: s, t: 0, life: 0.7, v: new T.Vector3(rr(-0.8, 0.8), rr(0.5, 1.5), rr(-0.8, 0.8)), grow: 1.5 }); } }
    function updateFx(dt) { for (let i = fx.length - 1; i >= 0; i--) { const e = fx[i]; e.t += dt; const k = e.t / e.life; if (k >= 1) { scene.remove(e.o); e.o.material.dispose(); fx.splice(i, 1); continue; } e.o.position.addScaledVector(e.v, dt); e.o.material.opacity = (1 - k) * 0.6; if (e.grow) e.o.scale.setScalar(0.3 + k * e.grow); } }

    /* ---------- Otish ---------- */
    function terrainBlock(o, d, maxT) {
      for (let t = 1.5; t < maxT; t += 1.5) { const x = o.x + d.x * t, y = o.y + d.y * t, z = o.z + d.z * t; if (y < heightAt(x, z)) return t; }
      return Infinity;
    }
    function treeBlock(o, d, maxT) {
      let best = Infinity; const seen = new Set();
      for (let t = 0; t < maxT; t += 5) { const x = o.x + d.x * t, z = o.z + d.z * t; for (let ox = -1; ox <= 1; ox++) for (let oz = -1; oz <= 1; oz++) { const k = (Math.floor(x / 10) + ox) + "," + (Math.floor(z / 10) + oz); if (seen.has(k)) continue; seen.add(k); (trunks.get(k) || []).forEach(([tx, tz, r]) => {
        const dx = tx - o.x, dz = tz - o.z, dl = Math.hypot(d.x, d.z) || 1e-6, along = (dx * d.x + dz * d.z) / dl; if (along < 0) return; const px = o.x + d.x / dl * along, pz = o.z + d.z / dl * along;
        if (Math.hypot(px - tx, pz - tz) < r + 0.15) { const tt = along / dl; const y = o.y + d.y * tt; if (y < heightAt(tx, tz) + 4 && tt < best) best = tt; } }); } }
      return best;
    }
    function hitSpheres(a) {
      const c = a.cfg, s = Math.sin(a.yaw), co = Math.cos(a.yaw), y = heightAt(a.x, a.z), out = [];
      const at = (f, h, r, head) => out.push({ x: a.x + s * f, y: y + h, z: a.z + co * f, r, head });
      at(0, c.h * 0.58, Math.max(c.h * 0.36, c.len * 0.24)); at(c.len * 0.28, c.h * 0.6, c.h * 0.33); at(-c.len * 0.28, c.h * 0.58, c.h * 0.33); at(c.len * 0.48, c.h * 0.82, c.h * 0.2, true);
      if (a.fall) out.forEach((p) => (p.y = y + c.h * 0.3));
      return out;
    }
    function fire() {
      const id = save.cur, W = WEAPONS[id];
      if (st.reloadT > 0 || st.fireT > 0 || st.shop || st.dead) return;
      if (st.mag[id] <= 0) { Snd.empty(); reload(); return; }
      st.mag[id]--; st.fireT = W.rate; st.kick = 1;
      Snd.shot(W.snd); flash.visible = true; setTimeout(() => (flash.visible = false), 55);
      const o = camera.position.clone();
      let spread = W.scope && !st.aim ? W.hipSpread : W.spread; spread *= (st.aim ? 0.5 : 1) * (me.crouch ? 0.7 : 1) * (1 + Math.hypot(me.vx, me.vz) * 0.15);
      let hitAny = false;
      for (let p = 0; p < W.pellets; p++) {
        const yaw = me.yaw + rr(-spread, spread), pitch = me.pitch + rr(-spread, spread);
        const d = new T.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
        let best = Math.min(W.range * 1.6, terrainBlock(o, d, W.range * 1.6), treeBlock(o, d, W.range * 1.6)), target = null, head = false;
        for (const a of animals) {
          if (!a.alive && !a.fall) continue;
          if (Math.hypot(a.x - o.x, a.z - o.z) > best + 5) continue;
          for (const sp of hitSpheres(a)) { const ox = o.x - sp.x, oy = o.y - sp.y, oz = o.z - sp.z, b = ox * d.x + oy * d.y + oz * d.z, cc = ox * ox + oy * oy + oz * oz - sp.r * sp.r, h = b * b - cc; if (h < 0) continue; const t = -b - Math.sqrt(h); if (t > 0 && t < best) { best = t; target = a; head = sp.head; } }
        }
        const end = o.clone().addScaledVector(d, Math.min(best, 400));
        if (target && target.alive) { const fall = best > W.range ? 0.5 : 1, dm = W.dmg * (head ? 2 : 1) * fall; if (isHost()) damage(target, dm, head, myCid); else { send({ t: "hit", id: target.id, dmg: dm, head: head ? 1 : 0, by: myCid }); target.hurtT = 0.3; } hitAny = true; }
        else if (best < 400) dust(end);
      }
      if (hitAny) { ui.hitm.classList.remove("on"); void ui.hitm.offsetWidth; ui.hitm.classList.add("on"); Snd.hit(); }
      // otish ovozi hayvonlarni cho'chitadi
      shotNoise(me.x, me.z); send({ t: "s", c: myCid, x: Math.round(me.x), z: Math.round(me.z), w: save.cur });
      if (st.mag[id] <= 0 && save.ammo > 0) setTimeout(reload, 350);
    }
    function reload() {
      const id = save.cur, W = WEAPONS[id];
      if (st.reloadT > 0 || st.mag[id] >= W.mag) return;
      if (save.ammo <= 0) { warn("O‘q tugadi! Do‘kondan sotib oling 🏪"); return; }
      st.reloadT = W.reload; st.aim = false; Snd.reload();
    }
    function shotNoise(x, z) {
      if (!isHost()) return;
      animals.forEach((a) => { if (!a.alive) return; const dd = Math.hypot(a.x - x, a.z - z); if (a.cfg.pred) { if (dd < 70 && a.state !== "chase") startChase(a, nearestPlayer(a).p); } else if (dd < 120) alarm(a); });
    }
    /** Faqat xost: zarba */
    function damage(a, dmg, head, by) {
      if (!a.alive) return;
      a.hp -= dmg; a.hurtT = 0.3;
      if (a.hp <= 0) { send({ t: "kill", id: a.id, by, head: head ? 1 : 0 }); onKill(a, by, head); }
      else {
        const shooter = players().find((p) => p.cid === by) || nearestPlayer(a).p;
        if (a.cfg.pred || (a.cfg.angry && Math.random() < 0.75)) startChase(a, shooter); else alarm(a);
      }
    }
    function onKill(a, by, head) {
      if (!a || !a.alive) return;
      a.alive = false; a.state = "dead"; a.fall = 0.001; a.speed = 0;
      if (a.vis.kind === "rig") a.vis.play("Death", true);
      if (by === myCid) {
        save.kills = save.kills || {}; save.kills[a.type] = (save.kills[a.type] || 0) + 1; persist();
        banner(`<b>${a.cfg.icon} ${a.cfg.name}${head ? " · 🎯 boshiga!" : ""}</b><small>Borib oling: ${MOBILE ? "🎒 tugma" : "E tugmasi"} · +${a.cfg.price} 💰</small>`, 2600);
      } else { const pn = peers.get(by); if (pn) feed(`🎯 ${esc(pn.name)}: ${a.cfg.icon} ${a.cfg.name}`); }
      const ring = new T.Mesh(new T.RingGeometry(0.9, 1.15, 32), new T.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0.8, depthWrite: false, side: T.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.set(a.x, heightAt(a.x, a.z) + 0.08, a.z); scene.add(ring);
      const tag = new T.Sprite(new T.SpriteMaterial({ map: TAG_TEX, transparent: true, depthTest: false }));
      tag.position.set(a.x, heightAt(a.x, a.z) + a.cfg.h + 0.8, a.z); tag.scale.setScalar(0.8); scene.add(tag);
      carcasses.push({ a, ring, tag });
      if (a.herd) a.herd.alarm = 8;
    }
    const TAG_TEX = canvasTex(128, (g) => { g.font = "90px system-ui"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("🎒", 64, 64); }, 1);
    function alarm(a) { if (a.state === "chase") return; a.state = "flee"; a.t = rr(7, 11); if (a.herd) a.herd.alarm = Math.max(a.herd.alarm, 6); }
    function startChase(a, p) {
      if (!p) return; a.tgt = p.cid; if (a.state === "chase") return; a.state = "chase"; a.t = a.cfg.pred ? 20 : 7;
      const dd = Math.hypot(a.x - me.x, a.z - me.z), pan = panOf(a.x, a.z); animalSound(a, dd, pan, true);
    }
    const panOf = (x, z) => clamp(-Math.sin(Math.atan2(-(x - me.x), -(z - me.z)) - me.yaw), -1, 1);
    function animalSound(a, d, pan, angry) {
      const k = a.cfg.snd;
      if (k === "wolf") Snd.wolf(d, pan, !angry); else if (k === "bear") Snd.bear(d, pan); else if (k === "grunt") Snd.grunt(d, pan, angry);
      else if (k === "neigh") Snd.neigh(d, pan); else if (k === "moo") Snd.moo(d, pan); else if (k === "bark") Snd.bark(d, pan);
    }
    function pickUp() {
      let best = null, bd = 3.4;
      carcasses.forEach((c) => { const d = Math.hypot(c.a.x - me.x, c.a.z - me.z); if (d < bd) { bd = d; best = c; } });
      if (!best) return;
      if (save.bag.length >= save.bagCap) { warn(`🎒 Xalta to‘la (${save.bagCap}). Do‘konni chaqirib soting yoki kattaroq xalta oling`); return; }
      if (isHost()) { send({ t: "took", id: best.a.id, by: myCid }); onTook(best.a.id, myCid); }
      else send({ t: "take", id: best.a.id, by: myCid });
    }
    function removeAnimal(a) {
      scene.remove(a.vis.g); const c = carcasses.find((c) => c.a === a);
      if (c) { scene.remove(c.ring); scene.remove(c.tag); carcasses.splice(carcasses.indexOf(c), 1); }
      const i = animals.indexOf(a); if (i >= 0) animals.splice(i, 1);
    }
    function onTook(id, by) {
      const a = animals.find((x) => x.id === id); if (!a) return;
      removeAnimal(a);
      if (by === myCid) {
        if (save.bag.length >= save.bagCap) return;
        save.bag.push(a.type); persist(); Snd.pick();
        banner(`<b>🎒 ${a.cfg.icon} ${a.cfg.name} xaltada</b><small>${save.bag.length}/${save.bagCap} · do‘konda sotish mumkin</small>`);
      }
    }

    /* ---------- Hayvonlar aqli (faqat xost hisoblaydi) ---------- */
    let respawnT = 30;
    function players() {
      const out = [{ cid: myCid, x: me.x, z: me.z, crouch: me.crouch && !me.ride, run: Math.hypot(me.vx, me.vz) > 5, dead: st.dead || !st.started }];
      const now = performance.now();
      peers.forEach((p, cid) => { if (now - p.seen < 4000) out.push({ cid, x: p.x, z: p.z, crouch: p.cr, run: p.ride, dead: p.dead }); });
      return out;
    }
    function nearestPlayer(a, list = players()) {
      let p = list[0], d = 1e9;
      for (const q of list) { if (q.dead) continue; const dd = Math.hypot(q.x - a.x, q.z - a.z); if (dd < d) { d = dd; p = q; } }
      return { p, d };
    }
    function updateAnimals(dt, t) {
      const list = players();
      for (const a of animals) {
        if (!a.alive) continue;
        a.t -= dt; a.attackT -= dt; a.soundT -= dt; a.hurtT = Math.max(0, (a.hurtT || 0) - dt);
        const c = a.cfg, { p: P, d } = nearestPlayer(a, list), dx = P.x - a.x, dz = P.z - a.z;
        const sense = P.crouch ? 0.45 : P.run ? 1.35 : 1;
        if (a.herd && a.herd.alarm > 0 && !c.pred && a.state !== "flee" && a.state !== "chase") alarm(a);
        let want = 0, run = false;
        if (a.state === "chase") {
          const T0 = list.find((q) => q.cid === a.tgt && !q.dead) || (!P.dead && P);
          if (!T0) { a.state = "walk"; a.t = 6; a.tx = a.home[0]; a.tz = a.home[1]; }
          else {
            const tx = T0.x - a.x, tz = T0.z - a.z, td = Math.hypot(tx, tz);
            a.tyaw = Math.atan2(tx, tz);
            if (td > 90 || (a.t <= 0 && td > 40)) { a.state = c.pred ? "walk" : "flee"; a.t = rr(5, 8); a.tx = a.home[0]; a.tz = a.home[1]; }
            else if (td < c.reach) { want = 0; if (a.attackT <= 0) { a.attackT = c.bite; a.atkT = 0.6; bite(T0.cid, c.dmg, a); } }
            else { want = c.run * (a.hp < c.hp * 0.25 && a.type === "bori" ? -0.8 : 1); run = true; }
            if (!c.pred && a.t <= 0) { a.state = "flee"; a.t = 6; }
          }
        } else if (c.pred) {
          if (d < c.sense * sense && !P.dead) startChase(a, P);
          else if (a.state === "graze" || a.state === "flee") { if (a.t <= 0) { a.state = "walk"; a.t = rr(5, 10); const r = rr(8, 35), an = Math.random() * 6.28; a.tx = a.home[0] + Math.cos(an) * r; a.tz = a.home[1] + Math.sin(an) * r; } }
          else { a.tyaw = Math.atan2(a.tx - a.x, a.tz - a.z); want = c.walk; if (a.t <= 0 || Math.hypot(a.tx - a.x, a.tz - a.z) < 1.5) { a.state = "graze"; a.t = rr(3, 8); } }
        } else {
          if (c.angry && d < 9 * sense && !P.dead && a.state !== "flee") startChase(a, P);
          else if (a.state !== "flee" && d < c.sense * sense) alarm(a);
          if (a.state === "flee") { const away = Math.atan2(-dx, -dz); a.tyaw = away + Math.sin(t * 0.7 + a.ph) * 0.5; want = c.run; run = true; if (a.t <= 0 && d > 60) { a.state = "graze"; a.t = rr(3, 7); a.home = [a.x, a.z]; } }
          else if (a.state === "graze") { if (a.t <= 0) { a.state = "walk"; a.t = rr(4, 9); const r = rr(5, 25), an = Math.random() * 6.28; a.tx = a.home[0] + Math.cos(an) * r; a.tz = a.home[1] + Math.sin(an) * r; } }
          else if (a.state === "walk") { a.tyaw = Math.atan2(a.tx - a.x, a.tz - a.z); want = c.walk; if (a.t <= 0 || Math.hypot(a.tx - a.x, a.tz - a.z) < 1.5) { a.state = "graze"; a.t = rr(4, 10); } }
        }
        if (a.tyaw !== undefined) a.yaw += angDiff(a.yaw, a.tyaw) * Math.min(1, dt * (run ? 5 : 2.5));
        a.speed += (want - a.speed) * Math.min(1, dt * 3);
        const nx = a.x + Math.sin(a.yaw) * a.speed * dt, nz = a.z + Math.cos(a.yaw) * a.speed * dt;
        if (Math.abs(nx) < EDGE - 5 && Math.abs(nz) < EDGE - 5) { a.x = nx; a.z = nz; } else { a.yaw += Math.PI * 0.6; a.tyaw = a.yaw; }
      }
      animals.forEach((a) => { if (a.herd && a.herd.alarm > 0) a.herd.alarm -= dt / 3; });
      respawnT -= dt;
      if (respawnT <= 0) { respawnT = 25; ATYPES.forEach((type) => { const live = animals.filter((a) => a.type === type && a.alive).length; if (live < ANIMALS[type].n * 0.6) spawnHerd(type, 110); }); }
    }
    /** Ko'rinish va ovozlar (hamma o'yinchida) */
    function animateAnimals(dt, t) {
      const hostNow = isHost();
      for (const a of animals) {
        if (!hostNow) { // xostdan kelgan holatga silliq yetib borish
          const ex = a.nx - a.x, ez = a.nz - a.z;
          if (Math.hypot(ex, ez) > 12) { a.x = a.nx; a.z = a.nz; } else { a.x += ex * Math.min(1, dt * 6); a.z += ez * Math.min(1, dt * 6); }
          if (a.nyaw !== undefined) a.yaw += angDiff(a.yaw, a.nyaw) * Math.min(1, dt * 8);
          if (a.alive) { a.x += Math.sin(a.yaw) * a.speed * dt * 0.5; a.z += Math.cos(a.yaw) * a.speed * dt * 0.5; }
          a.atkT = Math.max(0, (a.atkT || 0) - dt);
        }
        const dxm = me.x - a.x, dzm = me.z - a.z, dm = Math.hypot(dxm, dzm);
        const g = a.vis.g, y = heightAt(a.x, a.z);
        g.position.set(a.x, y, a.z); g.rotation.y = a.yaw;
        if (!a.alive) {
          if (a.fall < 1) { a.fall = Math.min(1, a.fall + dt * 1.8); if (a.vis.kind !== "rig") g.rotation.z = (a.fall * a.fall) * Math.PI / 2 * (a.ph > 3 ? 1 : -1); }
          if (a.vis.mixer && dm < 120) a.vis.mixer.update(dt);
          continue;
        }
        if (a.soundT === undefined) a.soundT = rr(5, 20);
        a.soundT -= hostNow ? 0 : dt;
        if (a.soundT <= 0 && dm < 110) { a.soundT = rr(10, 25); animalSound(a, dm, panOf(a.x, a.z), a.state === "chase"); }
        g.visible = dm < 260;
        if (dm > 140) continue;
        const sp = Math.abs(a.speed), V = a.vis;
        if (V.kind === "rig") {
          const atk = (a.atkT || 0) > 0;
          V.play(atk ? "Attack" : sp > 3.2 ? "Gallop" : sp > 0.35 ? "Walk" : a.state === "graze" && !a.cfg.pred ? "Eating" : "Idle");
          V.mixer.update(dt * (sp > 3.2 ? clamp(sp / 8, 0.7, 1.5) : sp > 0.35 ? clamp(sp / 1.4, 0.6, 1.6) : 1));
          if (a.hurtT > 0) V.body.rotation.z = Math.sin(t * 40) * 0.06; else V.body.rotation.z = 0;
        } else if (V.kind === "proc") {
          a.ph += dt * sp * (a.type === "ayiq" ? 2.4 : 4.2); const amp = clamp(sp / 3, 0, 1) * (sp > 3 ? 0.75 : 0.45), s = Math.sin(a.ph) * amp;
          V.legs[0].rotation.x = s; V.legs[3].rotation.x = s; V.legs[1].rotation.x = -s; V.legs[2].rotation.x = -s;
          V.head.rotation.x = a.state === "graze" ? 0.45 + Math.sin(t * 2 + a.ph) * 0.1 : sp > 3 ? -0.05 : 0.08;
          V.head.rotation.y = a.state === "graze" ? Math.sin(t * 0.7 + a.ph) * 0.3 : 0;
          V.tail.rotation.z = Math.sin(t * 6 + a.ph) * 0.5;
          V.body.position.y = Math.abs(Math.cos(a.ph)) * clamp(sp / 4, 0, 1) * 0.08;
          V.body.rotation.z = Math.sin(a.ph) * 0.04 * clamp(sp / 2, 0, 1);
          if ((a.atkT || 0) > 0) { const k = Math.sin((a.atkT / 0.6) * Math.PI); V.body.rotation.x = a.type === "ayiq" ? -0.55 * k : 0.15 * k; V.head.rotation.x = a.type === "ayiq" ? -0.4 * k : 0.5 * k; }
          else V.body.rotation.x = 0;
        }
        if (hostNow) a.atkT = Math.max(0, (a.atkT || 0) - dt);
      }
    }
    function bite(cid, dmg, a) { if (cid === myCid) hurtMe(dmg, a.cfg); else send({ t: "bite", to: cid, dmg, ty: a.type, id: a.id }); }
    function hurtMe(dmg, cfg) {
      if (st.dead) return;
      me.hp -= dmg; me.hurtT = 8; st.shake = 0.5; Snd.hurt();
      ui.dmg.classList.remove("on"); void ui.dmg.offsetWidth; ui.dmg.classList.add("on");
      warn(`⚠️ ${cfg.icon} ${cfg.name} hujum qilmoqda!`);
      if (me.hp <= 0) die();
    }
    function die() {
      st.dead = true; me.hp = 0; me.ride = false; horse.call = false; const lost = save.bag.length; save.bag = []; persist(); if (document.pointerLockElement) document.exitPointerLock();
      ui.panel.hidden = false;
      ui.panel.innerHTML = `<div class="ov-shop dead"><span class="big">🩹</span><h2>Siz yaralandingiz</h2><p>Yirtqichlar xavfli! ${lost ? `Xaltadagi ${lost} ta o‘lja yo‘qoldi.` : ""} Uyda tiklanasiz — pul va qurollar saqlanadi.</p><button class="ov-big" data-s2="respawn" type="button">🏡 Uyga qaytish</button></div>`;
      ui.panel.querySelector("[data-s2]").onclick = () => { st.dead = false; me.hp = 100; me.x = CAMP.x; me.z = CAMP.z - 6; me.yaw = Math.PI; horse.x = CAMP.x + 5; horse.z = CAMP.z - 4; ui.panel.hidden = true; animals.forEach((a) => { if (a.state === "chase") { a.state = "walk"; a.tx = a.home[0]; a.tz = a.home[1]; a.t = 6; } }); lockIt(); };
    }

    /* ---------- Boshqaruv ---------- */
    const keys = new Set(); let mx = 0, my = 0, locked = false, joy = { id: null, x: 0, y: 0, ox: 0, oy: 0 }, look = { id: null, x: 0, y: 0 }, fireHeld = false, runT = false;
    const canvas = renderer.domElement;
    const lockIt = () => { if (!MOBILE && canvas.requestPointerLock && st.started && !st.shop && !st.paused && !st.dead) try { canvas.requestPointerLock(); } catch (e) {} };
    const onLock = () => { locked = document.pointerLockElement === canvas; if (!locked && st.started && !st.shop && !st.dead && !MOBILE && !st.paused) showMenu(); };
    document.addEventListener("pointerlockchange", onLock);
    const onMove = (e) => { if (locked && Math.abs(e.movementX) < 250 && Math.abs(e.movementY) < 250) { mx += e.movementX; my += e.movementY; } };
    document.addEventListener("mousemove", onMove);
    const kd = (e) => {
      if (st.shop && e.code === "Escape") return closeShop();
      keys.add(e.code);
      if (e.code === "KeyR") reload(); if (e.code === "KeyE") pickUp(); if (e.code === "KeyQ") summonMerchant(); if (e.code === "KeyH") useMed(); if (e.code === "KeyF") toggleRide();
      const n = ["Digit1", "Digit2", "Digit3", "Digit4"].indexOf(e.code); if (n >= 0 && save.owned.includes(WORDER[n])) equip(WORDER[n]);
      if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
    };
    const ku = (e) => keys.delete(e.code);
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    canvas.addEventListener("mousedown", (e) => { Snd.init(); if (!locked) { lockIt(); return; } if (e.button === 0) { fireHeld = true; fire(); } if (e.button === 2) { st.aim = !st.aim; } });
    window.addEventListener("mouseup", (e) => { if (e.button === 0) fireHeld = false; });
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    function useMed() { if (save.med > 0 && me.hp < 100) { save.med--; me.hp = Math.min(100, me.hp + 50); persist(); Snd.pick(); banner("<b>🩹 +50 ❤</b>", 1200); } }
    function switchWeapon() { const own = WORDER.filter((w) => save.owned.includes(w)); equip(own[(own.indexOf(save.cur) + 1) % own.length]); }
    if (MOBILE) {
      const jEl = $("[data-joy]"), knob = jEl.querySelector("i");
      const rot = () => container.classList.contains("rot"), pt = (x, y) => rot() ? { x: y, y: innerWidth - x } : { x, y };
      hud.querySelectorAll(".ov-tb").forEach((b) => {
        b.addEventListener("touchstart", (e) => { e.preventDefault(); e.stopPropagation(); Snd.init(); b.classList.add("on"); const k = b.dataset.tb;
          if (k === "fire") { fireHeld = true; fire(); } if (k === "aim") st.aim = !st.aim; if (k === "pick") pickUp(); if (k === "reload") reload(); if (k === "switch") switchWeapon(); if (k === "run") { runT = !runT; b.classList.toggle("lit", runT); } if (k === "crouch" && !me.ride) { me.crouch = !me.crouch; b.classList.toggle("lit", me.crouch); } if (k === "horse") toggleRide(); }, { passive: false });
        b.addEventListener("touchend", () => { b.classList.remove("on"); if (b.dataset.tb === "fire") fireHeld = false; });
      });
      container.addEventListener("touchstart", (e) => { Snd.init(); for (const t of e.changedTouches) { if (t.target.closest && t.target.closest(".ov-tb,.ov-btn,.ov-panel,.ov-map")) continue; const c = pt(t.clientX, t.clientY); if (c.x < container.clientWidth * 0.42 && joy.id === null) { const r = jEl.getBoundingClientRect(), cc = pt((r.left + r.right) / 2, (r.top + r.bottom) / 2); joy = { id: t.identifier, ox: cc.x, oy: cc.y, x: 0, y: 0 }; jEl.classList.add("on"); } else if (look.id === null) look = { id: t.identifier, x: c.x, y: c.y }; } }, { passive: true });
      container.addEventListener("touchmove", (e) => { if (e.target.closest && e.target.closest(".ov-panel")) return; for (const t of e.changedTouches) { const c = pt(t.clientX, t.clientY); if (t.identifier === joy.id) { const dx = c.x - joy.ox, dy = c.y - joy.oy, d = Math.min(50, Math.hypot(dx, dy)), a = Math.atan2(dy, dx); joy.x = Math.cos(a) * d / 50; joy.y = Math.sin(a) * d / 50; knob.style.transform = `translate(${joy.x * 38}px,${joy.y * 38}px)`; } else if (t.identifier === look.id) { mx += (c.x - look.x) * 1.4; my += (c.y - look.y) * 1.4; look.x = c.x; look.y = c.y; } } e.preventDefault(); }, { passive: false });
      const te = (e) => { for (const t of e.changedTouches) { if (t.identifier === joy.id) { joy = { id: null, x: 0, y: 0 }; knob.style.transform = ""; jEl.classList.remove("on"); } if (t.identifier === look.id) look.id = null; } };
      container.addEventListener("touchend", te); container.addEventListener("touchcancel", te);
    }
    hud.addEventListener("click", (e) => {
      const b = e.target.closest("[data-b]"); if (!b) return; const k = b.dataset.b;
      if (k === "menu") showMenu(); if (k === "shop") summonMerchant();
      if (k === "resume") { st.paused = false; ui.panel.hidden = true; lockIt(); }
      if (k === "exit") destroy(true);
      if (k === "start") begin();
      if (k === "med") useMed();
    });
    function showMenu() {
      st.paused = true; if (document.pointerLockElement) document.exitPointerLock();
      ui.panel.hidden = false;
      const k = save.kills || {};
      ui.panel.innerHTML = `<div class="ov-shop"><h2>⏸ Dam olish</h2>
        <div class="ov-stats">${Object.keys(ANIMALS).map((t) => `<span>${ANIMALS[t].icon} <b>${k[t] || 0}</b></span>`).join("")}<span>💰 jami ishlab topilgan: <b>${save.earned || 0}</b></span></div>
        <p class="ov-tip">${MOBILE ? "Chap — yurish, o‘ng — qarash · 🎯 otish · 🔭 nishon · 🎒 o‘ljani olish · 🔫 qurol almashtirish · 🏃 yugurish · ⇩ cho‘kkalash (hayvonlar sezmaydi) · 🐎 otga minish/otni chaqirish" : "W A S D — yurish · Shift — yugurish · C — cho‘kkalash (hayvonlar sezmaydi) · Sichqoncha — qarash · Chap tugma — otish · O‘ng — nishon/durbin · R — o‘qlash · E — o‘ljani olish · Q — do‘kon · H — aptechka · F — otga minish / otni chaqirish · 1–4 — qurollar"}</p>
        ${save.med ? `<button class="ov-big ghost" data-b="med" type="button">🩹 Aptechka ishlatish (${save.med})</button>` : ""}
        <div class="ov-row"><button class="ov-big" data-b="resume" type="button">▶ Davom etish</button><button class="ov-big ghost" data-b="exit" type="button">🚪 Chiqish</button></div></div>`;
    }
    function begin() {
      Snd.init(); Snd.ambience(true);
      st.started = true; st.paused = false; ui.panel.hidden = true; lockIt();
      banner(`<b>🏹 Ov boshlandi!</b><small>🌲 Shimolda o‘rmon (bo‘ri, ayiq, bug‘u, to‘ng‘iz) · 🌾 Markazda dala (ot, bizon) · 🏜 Sharqda cho‘l (jayron) · 🏡 Qishloqdagi uyingizdan boshlaysiz, otingiz hovlida!</small>`, 5000);
    }

    /* ---------- Xarita ---------- */
    const mctx = ui.map.getContext("2d"), MS = ui.map.width;
    const base = document.createElement("canvas"); base.width = base.height = MS;
    { const g = base.getContext("2d"), img = g.createImageData(MS, MS);
      for (let j = 0; j < MS; j++) for (let i = 0; i < MS; i++) { const x = (i / MS) * HALF * 2 - HALF, z = (j / MS) * HALF * 2 - HALF, b = biome(x, z), e = sstep(150 * K, 180 * K, Math.max(Math.abs(x), Math.abs(z))); const k = (j * MS + i) * 4;
        const r = 90 * b.field + 40 * b.forest + 210 * b.desert, gg = 130 * b.field + 80 * b.forest + 180 * b.desert, bl = 55 * b.field + 40 * b.forest + 120 * b.desert;
        img.data[k] = lerp(r, 130, e); img.data[k + 1] = lerp(gg, 125, e); img.data[k + 2] = lerp(bl, 115, e); img.data[k + 3] = 230; }
      g.putImageData(img, 0, 0);
      const tm = (x, z) => [((x + HALF) / (HALF * 2)) * MS, ((z + HALF) / (HALF * 2)) * MS];
      g.strokeStyle = "rgba(235,222,190,.9)"; g.lineWidth = 1.6; g.lineJoin = "round";
      ROADS.forEach((r) => { g.beginPath(); r.forEach(([x, z], i) => { const [a, b] = tm(x, z); i ? g.lineTo(a, b) : g.moveTo(a, b); }); g.stroke(); });
      g.fillStyle = "#f4efe4"; houses.forEach((h) => { const [a, b] = tm(h.x, h.z); g.fillRect(a - 1.2, b - 1.2, 2.4, 2.4); }); }
    const toMap = (x, z) => [((x + HALF) / (HALF * 2)) * MS, ((z + HALF) / (HALF * 2)) * MS];
    function drawMap() {
      mctx.clearRect(0, 0, MS, MS); mctx.drawImage(base, 0, 0);
      const [cx, cz] = toMap(CAMP.x, CAMP.z); mctx.font = "18px system-ui"; mctx.textAlign = "center"; mctx.textBaseline = "middle"; mctx.fillText("🏡", cx, cz);
      carcasses.forEach((c) => { const [x, z] = toMap(c.a.x, c.a.z); mctx.fillStyle = "#ffd36a"; mctx.beginPath(); mctx.arc(x, z, 4, 0, 6.28); mctx.fill(); });
      animals.forEach((a) => { if (!a.alive) return; const d = Math.hypot(a.x - me.x, a.z - me.z); if (d > 60 && !(a.cfg.pred && a.state === "chase")) return; const [x, z] = toMap(a.x, a.z); mctx.fillStyle = a.cfg.pred ? "#ff4040" : "#9cff7a"; mctx.globalAlpha = 0.85; mctx.beginPath(); mctx.arc(x, z, a.cfg.pred && a.state === "chase" ? 4 : 2.6, 0, 6.28); mctx.fill(); mctx.globalAlpha = 1; });
      if (merchant) { const [x, z] = toMap(merchant.position.x, merchant.position.z); mctx.fillText("🏪", x, z); }
      if (horse.vis && !me.ride) { const [x, z] = toMap(horse.x, horse.z); mctx.font = "13px system-ui"; mctx.fillText("🐎", x, z); mctx.font = "18px system-ui"; }
      peers.forEach((p) => { const [x, z] = toMap(p.x, p.z); mctx.fillStyle = p.col; mctx.strokeStyle = "#000"; mctx.lineWidth = 1.5; mctx.beginPath(); mctx.arc(x, z, 5, 0, 6.28); mctx.fill(); mctx.stroke(); });
      const [px, pz] = toMap(me.x, me.z); mctx.save(); mctx.translate(px, pz); mctx.rotate(-me.yaw + Math.PI); mctx.fillStyle = "#fff"; mctx.strokeStyle = "#000"; mctx.lineWidth = 1.5; mctx.beginPath(); mctx.moveTo(0, 8); mctx.lineTo(5, -5); mctx.lineTo(-5, -5); mctx.closePath(); mctx.fill(); mctx.stroke(); mctx.restore();
    }

    /* ---------- O'lcham ---------- */
    function resize() {
      const w = container.clientWidth || innerWidth, h = container.clientHeight || innerHeight;
      renderer.setSize(w, h); camera.aspect = w / h; vmCam.aspect = w / h; vmCam.fov = w / h < 1.25 ? 75 : 55; camera.updateProjectionMatrix(); vmCam.updateProjectionMatrix();
      container.classList.toggle("short", h < 520);
    }
    window.addEventListener("resize", resize); resize();

    /* ---------- Asosiy sikl ---------- */
    let raf = 0, alive = true, last = performance.now(), mapT = 0, birdT = 6, hudT = 0;
    const pr = { n: 0, acc: 0, r: renderer.getPixelRatio() };
    function frame() {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      const now = performance.now(), raw = (now - last) / 1000, dt = Math.min(0.05, raw); last = now;
      const t = now / 1000; uTime.value = t;
      if (st.started && !st.paused) { pr.n++; pr.acc += Math.min(raw, 0.5); if (pr.acc > 3) { const fps = pr.n / pr.acc; pr.n = 0; pr.acc = 0; if (fps < 26 && pr.r > 0.55) { pr.r *= 0.78; renderer.setPixelRatio(pr.r); resize(); } } }
      const live = st.started && !st.paused && !st.dead;
      if (live && !st.shop) {
        const zk = st.aim ? 1 / WEAPONS[save.cur].zoom : 1;
        me.yaw -= mx * 0.0023 * zk; me.pitch = clamp(me.pitch - my * 0.0023 * zk, -1.35, 1.35);
        let ix = 0, iz = 0;
        if (keys.has("KeyW") || keys.has("ArrowUp")) iz -= 1; if (keys.has("KeyS") || keys.has("ArrowDown")) iz += 1; if (keys.has("KeyA") || keys.has("ArrowLeft")) ix -= 1; if (keys.has("KeyD") || keys.has("ArrowRight")) ix += 1;
        ix += joy.x; iz += joy.y; const il = Math.hypot(ix, iz); if (il > 1) { ix /= il; iz /= il; }
        if (!MOBILE) me.crouch = !me.ride && (keys.has("KeyC") || keys.has("ControlLeft"));
        const run = (keys.has("ShiftLeft") || runT) && !me.crouch && (me.ride || !st.aim) && iz < 0;
        const sp = me.ride ? (run ? 14 : st.aim ? 4 : 6.5) : me.crouch ? 2.0 : st.aim ? 2.4 : run ? 7.5 : 4.3;
        const cs = Math.cos(me.yaw), sn = Math.sin(me.yaw), acc = me.ride ? 2.6 : 10;
        me.vx += ((ix * cs + iz * sn) * sp - me.vx) * Math.min(1, dt * acc); me.vz += ((-ix * sn + iz * cs) * sp - me.vz) * Math.min(1, dt * acc);
        me.x += me.vx * dt; me.z += me.vz * dt;
        me.x = clamp(me.x, -EDGE, EDGE); me.z = clamp(me.z, -EDGE, EDGE);
        // daraxtlar
        for (let ox = -1; ox <= 1; ox++) for (let oz = -1; oz <= 1; oz++) (trunks.get((Math.floor(me.x / 10) + ox) + "," + (Math.floor(me.z / 10) + oz)) || []).forEach(([tx, tz, r]) => { const dx = me.x - tx, dz = me.z - tz, d = Math.hypot(dx, dz), R = r + (me.ride ? 0.8 : 0.35); if (d < R && d > 1e-6) { me.x = tx + dx / d * R; me.z = tz + dz / d * R; } });
        me.y = heightAt(me.x, me.z);
        const v = Math.hypot(me.vx, me.vz);
        if (v > 0.5) { me.bob += dt * v * (me.ride ? 0.9 : 2.2); me.stepT -= dt * v; if (me.stepT <= 0 && !me.ride) { me.stepT = 1.5; Snd.step(me.crouch ? 0.4 : run ? 1 : 0.7, biome(me.x, me.z).desert > 0.5); } }
        if (st.fireT > 0) st.fireT -= dt;
        if (fireHeld && WEAPONS[save.cur].auto) fire();
        if (st.reloadT > 0) { st.reloadT -= dt; if (st.reloadT <= 0) { const W = WEAPONS[save.cur], n = Math.min(W.mag - st.mag[save.cur], save.ammo); st.mag[save.cur] += n; save.ammo -= n; persist(); } }
        if (me.hurtT > 0) me.hurtT -= dt; else if (me.hp < 100) { me.regenT += dt; if (me.regenT > 2.5) { me.regenT = 0; me.hp = Math.min(100, me.hp + 2); } }
        // o'lja yaqinmi?
        const near = carcasses.find((c) => Math.hypot(c.a.x - me.x, c.a.z - me.z) < 3.4);
        const nearH = !me.ride && horse.vis && Math.hypot(horse.x - me.x, horse.z - me.z) < 4.2;
        ui.prompt.hidden = !near && !nearH;
        if (near) ui.prompt.innerHTML = `${MOBILE ? "🎒" : "<kbd>E</kbd>"} ${near.a.cfg.icon} ${near.a.cfg.name}ni olish (+${near.a.cfg.price} 💰)`;
        else if (nearH) ui.prompt.innerHTML = `${MOBILE ? "🐎" : "<kbd>F</kbd>"} Otga minish`;
        if (Math.hypot(me.x - gCenter[0], me.z - gCenter[1]) > 18) placeGrass(me.x, me.z);
      }
      if (st.started) {
        if (isHost()) updateAnimals(net || (live && !st.shop) ? dt : st.paused ? 0 : dt * 0.5, t);
        animateAnimals(dt, t); animatePeers(dt); updateHorse(dt); netTick(dt);
      }
      mx = 0; my = 0;
      // kamera
      st.shake = Math.max(0, st.shake - dt);
      const eye = me.ride ? (horse.vis ? horse.vis.H * 0.74 + 0.95 : 2.6) : me.crouch ? 1.1 : 1.65, shk = st.shake * 0.05;
      camera.position.set(me.x + rr(-shk, shk), me.y + eye + Math.sin(me.bob * 2) * 0.04, me.z + rr(-shk, shk));
      st.kick = Math.max(0, st.kick - dt * 4);
      camera.rotation.set(me.pitch + st.kick * (save.cur === "sniper" ? 0.06 : 0.03), me.yaw, 0);
      const W = WEAPONS[save.cur], fov = st.aim ? 70 / W.zoom : 70;
      if (Math.abs(camera.fov - fov) > 0.1) { camera.fov += (fov - camera.fov) * Math.min(1, dt * 14); camera.updateProjectionMatrix(); }
      // qurol (ko'rinish)
      const vb = Math.min(1, Math.hypot(me.vx, me.vz) / 5) * 0.012;
      let vx = W.pos[0], vy = W.pos[1], vz = W.pos[2] + st.kick * 0.08, vrx = st.kick * 0.15;
      if (st.aim && !W.scope) { vx = 0; vy = -0.12; }
      if (st.reloadT > 0) { const k = Math.sin((1 - st.reloadT / W.reload) * Math.PI); vy -= k * 0.15; vrx -= k * 0.6; }
      vmHold.position.set(lerp(vmHold.position.x, vx + Math.sin(me.bob) * vb, Math.min(1, dt * 14)), lerp(vmHold.position.y, vy - Math.abs(Math.cos(me.bob)) * vb, Math.min(1, dt * 14)), lerp(vmHold.position.z, vz, Math.min(1, dt * 20)));
      vmHold.rotation.x = lerp(vmHold.rotation.x, vrx, Math.min(1, dt * 14));
      // dunyo
      sun.target.position.set(me.x, 0, me.z); sun.position.copy(sunDir).multiplyScalar(120).add(sun.target.position);
      flame.scale.set(1.1 + Math.sin(t * 13) * 0.15, 1.5 + Math.sin(t * 9) * 0.2, 1); fireL.intensity = 1.4 + Math.sin(t * 11) * 0.3;
      carcasses.forEach((c) => { c.ring.material.opacity = 0.5 + Math.sin(t * 4) * 0.3; c.tag.position.y = heightAt(c.a.x, c.a.z) + c.a.cfg.h * 0.6 + 1 + Math.sin(t * 3) * 0.12; });
      if (merchant) { merchant.userData.t += dt; }
      updateFx(dt);
      birdT -= dt; if (birdT <= 0 && live) { birdT = rr(5, 14); if (biome(me.x, me.z).desert < 0.5) Snd.bird(); }
      mapT -= dt; if (mapT <= 0) { mapT = 0.15; drawMap(); }
      if (now - hudT > 100) { hudT = now; hudUpdate(); }
      if (banT && now > banT) { ui.ban.classList.remove("on"); banT = 0; } if (warnT && now > warnT) { ui.warn.classList.remove("on"); warnT = 0; }
      renderer.clear(); renderer.render(scene, camera);
      const scoped = st.aim && W.scope;
      if (!scoped && st.started) { renderer.clearDepth(); renderer.render(vmScene, vmCam); }
    }
    function hudUpdate() {
      ui.hp.style.width = Math.max(0, me.hp) + "%"; ui.hpn.textContent = Math.max(0, Math.round(me.hp)); ui.hp.parentElement.parentElement.classList.toggle("low", me.hp < 35);
      ui.money.textContent = save.money; ui.bag.textContent = `${save.bag.length}/${save.bagCap}`;
      ui.mag.textContent = st.mag[save.cur] ?? 0; ui.ammo.textContent = save.ammo;
      ui.wstate.textContent = st.reloadT > 0 ? "o‘qlanmoqda…" : st.mag[save.cur] <= 0 ? (save.ammo > 0 ? "R — o‘qlash" : "o‘q yo‘q!") : "";
      const W = WEAPONS[save.cur]; ui.scope.hidden = !(st.aim && W.scope); ui.cross.hidden = st.aim && W.scope;
      ui.cross.classList.toggle("wide", Math.hypot(me.vx, me.vz) > 1 && !st.aim);
    }

    function destroy(user) {
      if (!alive) return; alive = false; cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove); document.removeEventListener("pointerlockchange", onLock);
      if (document.pointerLockElement) document.exitPointerLock();
      Snd.ambience(false); persist();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); }); });
      renderer.dispose(); container.innerHTML = "";
      if (user && opts.onExit) opts.onExit();
    }

    // Boshlash
    ui.panel.hidden = false;
    ui.panel.innerHTML = `<div class="ov-shop"><span class="big">🏹</span><h2>Ovchi</h2><p>⏳ Dala, o‘rmon va cho‘l tayyorlanmoqda…</p></div>`;
    placeGrass(me.x, me.z);
    frame();
    (async () => {
      await Promise.all([loadAnimals(), equip(save.owned.includes(save.cur) ? save.cur : "revolver")]);
      if (!alive) return;
      st.loaded = true; if (isHost()) populate();
      horse.vis = makeRideHorse(); if (horse.vis) scene.add(horse.vis.g);
      ui.panel.innerHTML = `<div class="ov-shop"><span class="big">🏹</span><h2>Ovga tayyormisiz?</h2>
        <p>Keng dalada, o‘rmonda va cho‘lda ov qiling. O‘txo‘rlar (🐎 ot, 🦬 bizon, 🦌 jayron, 🫎 bug‘u) sizni sezsa qochadi — <b>cho‘kkalab</b> yaqinlashing. Yirtqichlar (🐺 bo‘ri, 🐻 ayiq) <b>o‘zi hujum qiladi</b>, 🐗 yovvoyi cho‘chqa esa jahli chiqsa tashlanadi!</p>
        <p>🏡 Ov qishloqdagi uyingizdan boshlanadi. 🐎 Hovlida <b>otingiz</b> turibdi — ${MOBILE ? "🐎 tugma" : "F tugmasi"} bilan mining, uzoqda bo‘lsa hushtak chaling.</p>
        <p class="ov-tip">Otilgan hayvonni borib oling 🎒, keyin 🏪 do‘konni chaqirib soting va yangi qurollar sotib oling.</p>
        <div class="ov-row"><button class="ov-big" data-b="start" type="button">▶ Ovni boshlash</button><button class="ov-big ghost" data-b="exit" type="button">🚪 Chiqish</button></div></div>`;
    })();
    return { destroy: () => destroy(false), netMsg, setPeers, debug: { horse, peers, toggleRide, isHost: () => isHost(), me, st, animals, carcasses, save, camera, renderer, scene, fire: () => fire(), damage, pickUp, summonMerchant, heightAt, equip, openShop } };
  }

  window.SofiOvchi3D = { create, WEAPONS, ANIMALS };
})();
