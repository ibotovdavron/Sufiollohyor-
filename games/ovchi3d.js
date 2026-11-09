/* OVCHI 3D — keng dala, o'rmon va cho'lda ov.
   O'txo'rlar (yovvoyi ot, bizon, arxar) qochadi, yirtqichlar (bo'ri, ayiq) ovchiga hujum qiladi.
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
    arxar: { name: "Arxar", icon: "🐏", pred: false, hp: 60, walk: 1.3, run: 8.5, price: 70, n: 8, herd: [2, 4], biome: "desert", h: 1.0, len: 1.6, sense: 30 },
    ot: { name: "Yovvoyi ot", icon: "🐎", pred: false, hp: 110, walk: 1.6, run: 10, price: 120, n: 7, herd: [2, 3], biome: "field", h: 1.75, len: 2.3, sense: 34 },
    bizon: { name: "Bizon", icon: "🦬", pred: false, hp: 170, walk: 1.0, run: 7, price: 180, n: 6, herd: [2, 3], biome: "field", h: 1.7, len: 3.0, sense: 26 },
    bori: { name: "Bo‘ri", icon: "🐺", pred: true, hp: 70, walk: 1.5, run: 9.5, price: 150, n: 6, herd: [2, 3], biome: "forest", h: 0.85, len: 1.6, sense: 40, dmg: 12, bite: 1.1, reach: 1.9 },
    ayiq: { name: "Ayiq", icon: "🐻", pred: true, hp: 230, walk: 1.2, run: 7.2, price: 320, n: 3, herd: [1, 1], biome: "forest", h: 1.6, len: 2.0, sense: 28, dmg: 28, bite: 1.7, reach: 2.6 },
  };
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
  const HALF = 190, CAMP = { x: 0, z: 120 };
  function biome(x, z) {
    const n = fbm(x * 0.012 + 7, z * 0.012 - 3);
    const forest = sstep(-25, -70, z + (n - 0.5) * 60);
    const desert = sstep(45, 95, x + (n - 0.5) * 60) * (1 - forest);
    return { forest, desert, field: Math.max(0, 1 - forest - desert) };
  }
  function heightAt(x, z) {
    const b = biome(x, z);
    let h = (fbm(x * 0.009, z * 0.009) - 0.45) * 16;
    h *= 0.55 + 0.7 * b.forest;
    h += (Math.sin(x * 0.055 + Math.cos(z * 0.032) * 2.2) * 2.6 + Math.sin(z * 0.08 + x * 0.02) * 1.4) * b.desert;
    const edge = Math.max(Math.abs(x), Math.abs(z));
    h += sstep(150, 195, edge) * (34 + fbm(x * 0.03, z * 0.03) * 22);
    const dc = Math.hypot(x - CAMP.x, z - CAMP.z);
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
    const SEG = LOW ? 120 : 190;
    const tg = new T.PlaneGeometry(HALF * 2, HALF * 2, SEG, SEG); tg.rotateX(-Math.PI / 2);
    const tp = tg.attributes.position, tc = new Float32Array(tp.count * 3), tmp = new T.Color();
    const C = { grass: new T.Color(0x5b7d2e), grass2: new T.Color(0x7a8f3a), forest: new T.Color(0x2f4a22), soil: new T.Color(0x5a4630), sand: new T.Color(0xd2b783), sand2: new T.Color(0xc29d68), rock: new T.Color(0x8b8478) };
    for (let i = 0; i < tp.count; i++) {
      const x = tp.getX(i), z = tp.getZ(i), y = heightAt(x, z); tp.setY(i, y);
      const b = biome(x, z), n = fbm(x * 0.08, z * 0.08);
      tmp.copy(C.grass).lerp(C.grass2, n * 0.8);
      tmp.lerp(C.forest, b.forest * 0.85); if (b.forest > 0.5 && n > 0.62) tmp.lerp(C.soil, 0.45);
      tmp.lerp(tmp.clone().copy(C.sand).lerp(C.sand2, n), b.desert);
      const edge = Math.max(Math.abs(x), Math.abs(z)); tmp.lerp(C.rock, sstep(150, 180, edge) * 0.85);
      if (Math.hypot(x - CAMP.x, z - CAMP.z) < 12) tmp.lerp(C.soil, 0.6);
      tc[i * 3] = tmp.r; tc[i * 3 + 1] = tmp.g; tc[i * 3 + 2] = tmp.b;
    }
    tg.setAttribute("color", new T.BufferAttribute(tc, 3)); tg.computeVertexNormals();
    const detail = canvasTex(256, (g, s) => { g.fillStyle = "#bbb"; g.fillRect(0, 0, s, s); for (let i = 0; i < 4000; i++) { g.globalAlpha = rr(0.1, 0.35); g.fillStyle = Math.random() < 0.5 ? "#888" : "#ddd"; g.fillRect(Math.random() * s, Math.random() * s, rr(1, 3), rr(1, 3)); } }, 90);
    const ground = new T.Mesh(tg, new T.MeshStandardMaterial({ vertexColors: true, map: detail, roughness: 0.96 }));
    ground.receiveShadow = true; scene.add(ground);

    /* ---------- O'simliklar va toshlar (instanced) ---------- */
    const mtx = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(), ps = new T.Vector3(), Y = new T.Vector3(0, 1, 0);
    const trunks = new Map(); // to'qnashuv uchun: "cx,cz" → [[x,z,r]]
    const addTrunk = (x, z, r) => { const k = Math.floor(x / 10) + "," + Math.floor(z / 10); if (!trunks.has(k)) trunks.set(k, []); trunks.get(k).push([x, z, r]); };
    function scatter(n, test, tries = 20) { const out = []; let k = 0; while (out.length < n && k < n * tries) { k++; const x = rr(-HALF + 15, HALF - 15), z = rr(-HALF + 15, HALF - 15); if (Math.hypot(x - CAMP.x, z - CAMP.z) < 16) continue; if (test(x, z, biome(x, z))) out.push([x, z]); } return out; }
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
    const D = LOW ? 0.45 : 1;
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
      gOff.forEach(([ox, oz, r, s, k], i) => { const x = Math.round(cx / 10) * 10 + ox, z = Math.round(cz / 10) * 10 + oz, b = biome(x, z); const keep = b.desert < 0.35 && Math.max(Math.abs(x), Math.abs(z)) < 160 && k > b.forest * 0.6;
        q.setFromAxisAngle(Y, r); const ss = keep ? s * (1 - b.desert) : 0.0001; sc.set(ss, ss * (b.forest > 0.5 ? 0.7 : 1), ss); ps.set(x, heightAt(x, z) - 0.05, z); mtx.compose(ps, q, sc); grass.setMatrixAt(i, mtx); });
      grass.instanceMatrix.needsUpdate = true;
    }

    /* ---------- Lager (boshlang'ich joy) ---------- */
    const camp = new T.Group(); camp.position.set(CAMP.x, heightAt(CAMP.x, CAMP.z), CAMP.z); scene.add(camp);
    { const tent = new T.Mesh(new T.ConeGeometry(2.6, 3, 4, 1, true), new T.MeshStandardMaterial({ color: 0xc8a46a, roughness: 0.9, side: T.DoubleSide })); tent.position.set(-4.5, 1.5, 6); tent.rotation.y = Math.PI / 4; tent.castShadow = true; camp.add(tent);
      const logs = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 1.2, 6), new T.MeshStandardMaterial({ color: 0x5a3a22 })); [0, 1, 2].forEach((i) => { const l = logs.clone(); l.rotation.z = Math.PI / 2; l.rotation.y = i * 1.05; l.position.y = 0.15; camp.add(l); });
      [[3, 2], [-2, 4], [4, -3]].forEach(([x, z]) => { const s = new T.Mesh(new T.CylinderGeometry(0.4, 0.45, 0.45, 8), new T.MeshStandardMaterial({ color: 0x6b4a2a })); s.position.set(x, 0.22, z); s.castShadow = true; camp.add(s); }); }
    const glowTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,240,200,1)"); gr.addColorStop(0.3, "rgba(255,160,60,.8)"); gr.addColorStop(1, "rgba(255,80,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
    const flame = new T.Sprite(new T.SpriteMaterial({ map: glowTex, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); flame.position.y = 0.6; flame.scale.set(1.2, 1.6, 1); camp.add(flame);
    const fireL = new T.PointLight(0xff8a3a, 1.6, 14, 2); fireL.position.y = 1; camp.add(fireL);

    /* ---------- Holat ---------- */
    const me = { x: CAMP.x, z: CAMP.z - 9, y: 0, yaw: Math.PI, pitch: 0, vx: 0, vz: 0, hp: 100, crouch: false, bob: 0, stepT: 0, hurtT: 0, regenT: 0 };
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
      <div class="ov-prompt" data-prompt hidden></div>
      <div class="ov-weap"><b data-wname>Revolver</b><span><b data-mag>6</b> / <small data-ammo>30</small></span><em data-wstate></em></div>
      <div class="ov-dmg" data-dmg></div>
      <div class="ov-panel" data-panel hidden></div>
      <button class="ov-btn menu" data-b="menu" type="button">☰</button>
      <button class="ov-btn shop" data-b="shop" type="button">🏪<small>Do‘kon</small></button>
      ${MOBILE ? `<div class="ov-joy" data-joy><i></i></div>
        <button class="ov-tb fire" data-tb="fire">🎯</button><button class="ov-tb aim" data-tb="aim">🔭</button><button class="ov-tb pick" data-tb="pick">🎒</button>
        <button class="ov-tb rel" data-tb="reload">↻</button><button class="ov-tb sw" data-tb="switch">🔫</button><button class="ov-tb run" data-tb="run">🏃</button><button class="ov-tb cr" data-tb="crouch">⇩</button>` : ""}`;
    container.appendChild(hud);
    const $ = (s) => hud.querySelector(s);
    const ui = { hp: $("[data-hp]"), hpn: $("[data-hpn]"), money: $("[data-money]"), bag: $("[data-bag]"), map: $("[data-map]"), cross: $("[data-cross]"), hitm: $("[data-hitm]"), scope: $("[data-scope]"), warn: $("[data-warn]"), ban: $("[data-ban]"), prompt: $("[data-prompt]"), wname: $("[data-wname]"), mag: $("[data-mag]"), ammo: $("[data-ammo]"), wstate: $("[data-wstate]"), dmg: $("[data-dmg]"), panel: $("[data-panel]") };
    let banT = 0, warnT = 0;
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
    let FARM = null, FOX = null, BEAR = null, MERCH = null;
    async function loadAnimals() {
      const F = window.SofiFarm3D && window.SofiFarm3D.animals;
      const jobs = [];
      if (F) jobs.push(Promise.all([F.preloadHorse(), F.preloadQ()]).then(() => (FARM = F)).catch(() => {}));
      jobs.push(loadGLTF("games/models/fox.glb?v=1").then((g) => (FOX = g)).catch(() => {}));
      jobs.push(loadLBM("ayiq").then((m) => (BEAR = m)).catch(() => {}));
      jobs.push(loadLBM("lawman").then((m) => (MERCH = m)).catch(() => {}));
      await Promise.all(jobs);
    }
    function boxAnimal(cfg, color) { const g = new T.Group(), body = new T.Group(); g.add(body); const m = new T.Mesh(new T.BoxGeometry(cfg.len * 0.35, cfg.h * 0.5, cfg.len), new T.MeshStandardMaterial({ color })); m.position.y = cfg.h * 0.6; m.castShadow = true; body.add(m); return { g, body, legs: [{ rotation: { x: 0 } }, { rotation: { x: 0 } }, { rotation: { x: 0 } }, { rotation: { x: 0 } }], head: { rotation: { x: 0 } }, tail: { rotation: { x: 0, z: 0 } }, sync() {} }; }
    let vN = 0;
    /** Rangni yorqinlik bo'yicha qayta bo'yash (tulki → bo'ri, sigir → bizon) */
    function recolor(mat, rgb, keep, gain = 1) {
      const prev = mat.onBeforeCompile && mat.onBeforeCompile !== T.Material.prototype.onBeforeCompile ? mat.onBeforeCompile : null;
      mat.customProgramCacheKey = () => "rc" + rgb + keep + gain + (prev ? prev.toString() : "");
      mat.onBeforeCompile = (sh, r) => { if (prev) prev(sh, r); sh.fragmentShader = sh.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
        { float lum = dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11)); diffuseColor.rgb = mix(vec3(lum) * pow(vec3(${rgb}), vec3(2.2)) * ${gain.toFixed(2)}, diffuseColor.rgb, ${keep.toFixed(2)}); }`); };
      mat.needsUpdate = true;
    }
    function makeVisual(type) {
      const cfg = ANIMALS[type];
      if (type === "bori") {
        if (!FOX) return { ...boxAnimal(cfg, 0x777777), kind: "box" };
        const root = T.SkeletonUtils.clone(FOX.scene);
        root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; o.material = o.material.clone();
          recolor(o.material, "0.72, 0.7, 0.66", 0.08); } });
        root.updateMatrixWorld(true); const fb = new T.Box3().setFromObject(root); const s = cfg.len / Math.max(1e-3, fb.max.z - fb.min.z, fb.max.x - fb.min.x); root.scale.setScalar(s);
        const g = new T.Group(); g.add(root);
        const mixer = new T.AnimationMixer(root), acts = {}; FOX.animations.forEach((c) => (acts[c.name] = mixer.clipAction(c)));
        let cur = null; const play = (n) => { if (cur === n || !acts[n]) return; acts[n].reset().fadeIn(0.2).play(); if (cur && acts[cur]) acts[cur].fadeOut(0.2); cur = n; };
        play("Survey");
        return { g, body: root, mixer, play, kind: "fox" };
      }
      if (type === "ayiq") {
        if (!BEAR) return { ...boxAnimal(cfg, 0x5a3a24), kind: "box" };
        const u = { uSwing: { value: 0 } };
        const mat = new T.MeshStandardMaterial({ map: BEAR.tex, roughness: 0.8 }); recolor(mat, "1.0, 0.82, 0.64", 0.05);
        const rc = mat.onBeforeCompile; mat.customProgramCacheKey = () => "bear"; mat.onBeforeCompile = (sh) => { rc(sh); sh.uniforms.uSwing = u.uSwing; sh.vertexShader = "uniform float uSwing;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
          float wl = smoothstep(0.62, 0.15, position.y); float side = position.x > 0.0 ? 1.0 : -1.0; float fz = position.z > 0.0 ? 1.0 : -1.0;
          float a = uSwing * side * fz * wl; float yy = transformed.y - 0.62, zz = transformed.z; transformed.y = 0.62 + yy * cos(a) - zz * sin(a); transformed.z = yy * sin(a) + zz * cos(a);`); };
        const mesh = new T.Mesh(BEAR.geo, mat); mesh.castShadow = true;
        const s = cfg.h / (BEAR.geo.boundingBox.max.y - BEAR.geo.boundingBox.min.y); mesh.scale.setScalar(s);
        const g = new T.Group(), body = new T.Group(); body.add(mesh); g.add(body);
        return { g, body, u, kind: "bear" };
      }
      if (!FARM) return { ...boxAnimal(cfg, 0x8a6a4a), kind: "box" };
      let v;
      if (type === "ot") v = FARM.buildReal(FARM.horse(), vN++);
      else if (type === "bizon") v = FARM.buildReal(FARM.cow(), vN++);
      else v = FARM.buildReal(FARM.sheep(), vN++);
      const tint = { bizon: ["0.42, 0.29, 0.2", 0.0, 1.0], arxar: ["0.78, 0.58, 0.38", 0.05, 1.0] }[type];
      if (tint) v.g.traverse((o) => { if (o.isMesh) { const pb = o.material.onBeforeCompile; o.material = o.material.clone(); o.material.onBeforeCompile = pb; recolor(o.material, ...tint); } });
      v.g.scale.setScalar({ ot: 0.85, bizon: 1.0, arxar: 0.85 }[type]);
      v.g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      return { ...v, kind: "farm" };
    }
    function spawn(type, x, z, herd) {
      const cfg = ANIMALS[type], vis = makeVisual(type);
      vis.g.position.set(x, heightAt(x, z), z); scene.add(vis.g);
      const a = { type, cfg, vis, x, z, yaw: Math.random() * 6.28, hp: cfg.hp, state: "graze", t: rr(2, 6), tx: x, tz: z, speed: 0, ph: Math.random() * 6, herd, home: [x, z], attackT: 0, soundT: rr(5, 20), alive: true, deadT: 0, fall: 0 };
      animals.push(a); return a;
    }
    function spawnPos(type, far) {
      const want = ANIMALS[type].biome;
      for (let k = 0; k < 200; k++) {
        const x = rr(-150, 150), z = rr(-150, 150), b = biome(x, z);
        if (Math.hypot(x - CAMP.x, z - CAMP.z) < 60) continue;
        if (far && Math.hypot(x - me.x, z - me.z) < far) continue;
        const w = want === "forest" ? b.forest : want === "desert" ? b.desert : b.field;
        if (w > 0.6 || (type === "bori" && b.field > 0.7 && Math.random() < 0.3)) return [x, z];
      }
      return [rr(-120, 120), rr(-120, 60)];
    }
    function spawnHerd(type, far = 0) {
      const cfg = ANIMALS[type], [hx, hz] = spawnPos(type, far), n = Math.round(rr(cfg.herd[0], cfg.herd[1] + 0.99) - 0.49), herd = { id: Math.random(), alarm: 0 };
      for (let i = 0; i < Math.max(1, n); i++) spawn(type, hx + rr(-6, 6), hz + rr(-6, 6), herd);
    }
    function populate() { Object.keys(ANIMALS).forEach((type) => { let have = 0; while (have < ANIMALS[type].n) { const before = animals.length; spawnHerd(type); have += animals.length - before; } }); }

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
        if (target && target.alive) { const fall = best > W.range ? 0.5 : 1; damage(target, W.dmg * (head ? 2 : 1) * fall, head); hitAny = true; }
        else if (best < 400) dust(end);
      }
      if (hitAny) { ui.hitm.classList.remove("on"); void ui.hitm.offsetWidth; ui.hitm.classList.add("on"); Snd.hit(); }
      // otish ovozi hayvonlarni cho'chitadi
      animals.forEach((a) => { if (!a.alive) return; const dd = Math.hypot(a.x - me.x, a.z - me.z); if (!a.cfg.pred && dd < 120) alarm(a); else if (a.cfg.pred && dd < 70) { if (a.state !== "chase") startChase(a); } });
      if (st.mag[id] <= 0 && save.ammo > 0) setTimeout(reload, 350);
    }
    function reload() {
      const id = save.cur, W = WEAPONS[id];
      if (st.reloadT > 0 || st.mag[id] >= W.mag) return;
      if (save.ammo <= 0) { warn("O‘q tugadi! Do‘kondan sotib oling 🏪"); return; }
      st.reloadT = W.reload; st.aim = false; Snd.reload();
    }
    function damage(a, dmg, head) {
      a.hp -= dmg; a.hurtT = 0.3;
      if (a.hp <= 0) {
        a.alive = false; a.state = "dead"; a.fall = 0.001;
        save.kills = save.kills || {}; save.kills[a.type] = (save.kills[a.type] || 0) + 1; persist();
        banner(`<b>${a.cfg.icon} ${a.cfg.name}${head ? " · 🎯 boshiga!" : ""}</b><small>Borib oling: ${MOBILE ? "🎒 tugma" : "E tugmasi"} · +${a.cfg.price} 💰</small>`, 2600);
        const ring = new T.Mesh(new T.RingGeometry(0.9, 1.15, 32), new T.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0.8, depthWrite: false, side: T.DoubleSide }));
        ring.rotation.x = -Math.PI / 2; ring.position.set(a.x, heightAt(a.x, a.z) + 0.08, a.z); scene.add(ring);
        const tag = new T.Sprite(new T.SpriteMaterial({ map: canvasTex(128, (g) => { g.font = "90px system-ui"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("🎒", 64, 64); }, 1), transparent: true, depthTest: false }));
        tag.position.set(a.x, heightAt(a.x, a.z) + a.cfg.h + 0.8, a.z); tag.scale.setScalar(0.8); scene.add(tag);
        carcasses.push({ a, ring, tag });
        if (a.herd) a.herd.alarm = 8;
      } else {
        if (a.cfg.pred) startChase(a); else alarm(a);
      }
    }
    function alarm(a) { a.state = "flee"; a.t = rr(7, 11); if (a.herd) a.herd.alarm = Math.max(a.herd.alarm, 6); }
    function startChase(a) { if (a.state === "chase") return; a.state = "chase"; a.t = 20; const dd = Math.hypot(a.x - me.x, a.z - me.z), pan = 0; if (a.type === "bori") Snd.wolf(dd, pan); else Snd.bear(dd, pan); }
    function pickUp() {
      let best = null, bd = 3.2;
      carcasses.forEach((c) => { const d = Math.hypot(c.a.x - me.x, c.a.z - me.z); if (d < bd) { bd = d; best = c; } });
      if (!best) return;
      if (save.bag.length >= save.bagCap) { warn(`🎒 Xalta to‘la (${save.bagCap}). Do‘konni chaqirib soting yoki kattaroq xalta oling`); return; }
      save.bag.push(best.a.type); persist(); Snd.pick();
      scene.remove(best.a.vis.g); scene.remove(best.ring); scene.remove(best.tag);
      carcasses.splice(carcasses.indexOf(best), 1); animals.splice(animals.indexOf(best.a), 1);
      banner(`<b>🎒 ${best.a.cfg.icon} ${best.a.cfg.name} xaltada</b><small>${save.bag.length}/${save.bagCap} · do‘konda sotish mumkin</small>`);
    }

    /* ---------- Hayvonlar aqli ---------- */
    let respawnT = 30;
    function updateAnimals(dt, t) {
      const pRun = Math.hypot(me.vx, me.vz) > 5, sense = me.crouch ? 0.45 : pRun ? 1.35 : 1;
      for (const a of animals) {
        const dx = me.x - a.x, dz = me.z - a.z, d = Math.hypot(dx, dz), far = d > 150;
        if (!a.alive) { if (a.fall < 1) { a.fall = Math.min(1, a.fall + dt * 1.8); a.vis.g.rotation.z = (a.fall * a.fall) * Math.PI / 2 * (a.ph > 3 ? 1 : -1); if (a.vis.play) a.vis.play("Survey"); } continue; }
        a.t -= dt; a.attackT -= dt; a.soundT -= dt;
        const c = a.cfg;
        if (a.herd && a.herd.alarm > 0 && !c.pred && a.state !== "flee") alarm(a);
        let want = 0, run = false;
        if (!c.pred) {
          if (a.state !== "flee" && d < c.sense * sense) alarm(a);
          if (a.state === "flee") { const away = Math.atan2(-dx, -dz); a.tyaw = away + Math.sin(t * 0.7 + a.ph) * 0.5; want = c.run; run = true; if (a.t <= 0 && d > 60) { a.state = "graze"; a.t = rr(3, 7); } }
          else if (a.state === "graze") { want = 0; if (a.t <= 0) { a.state = "walk"; a.t = rr(4, 9); const r = rr(5, 25), an = Math.random() * 6.28; a.tx = a.home[0] + Math.cos(an) * r; a.tz = a.home[1] + Math.sin(an) * r; } }
          else if (a.state === "walk") { a.tyaw = Math.atan2(a.tx - a.x, a.tz - a.z); want = c.walk; if (a.t <= 0 || Math.hypot(a.tx - a.x, a.tz - a.z) < 1.5) { a.state = "graze"; a.t = rr(4, 10); } }
        } else {
          if (a.state !== "chase" && d < c.sense * sense && !st.dead) startChase(a);
          if (a.state === "chase") {
            a.tyaw = Math.atan2(dx, dz);
            if (st.dead || d > 90 || (a.t <= 0 && d > 45)) { a.state = "walk"; a.t = rr(4, 8); a.tx = a.home[0]; a.tz = a.home[1]; }
            else if (d < c.reach) { want = 0; if (a.attackT <= 0) { a.attackT = c.bite; hurtMe(c.dmg, a); } }
            else { want = c.run * (a.hp < c.hp * 0.3 && a.type === "bori" ? -0.8 : 1); run = true; }
          } else if (a.state === "graze") { if (a.t <= 0) { a.state = "walk"; a.t = rr(5, 10); const r = rr(8, 35), an = Math.random() * 6.28; a.tx = a.home[0] + Math.cos(an) * r; a.tz = a.home[1] + Math.sin(an) * r; } }
          else { a.tyaw = Math.atan2(a.tx - a.x, a.tz - a.z); want = c.walk; if (a.t <= 0 || Math.hypot(a.tx - a.x, a.tz - a.z) < 1.5) { a.state = "graze"; a.t = rr(3, 8); } }
        }
        if (a.tyaw !== undefined) a.yaw += angDiff(a.yaw, a.tyaw) * Math.min(1, dt * (run ? 5 : 2.5));
        a.speed += (want - a.speed) * Math.min(1, dt * 3);
        const nx = a.x + Math.sin(a.yaw) * a.speed * dt, nz = a.z + Math.cos(a.yaw) * a.speed * dt;
        if (Math.abs(nx) < 160 && Math.abs(nz) < 160) { a.x = nx; a.z = nz; } else { a.yaw += Math.PI * 0.6; a.tyaw = a.yaw; }
        // ovoz
        if (a.soundT <= 0 && d < 90) { a.soundT = rr(10, 25); const pan = clamp(Math.sin(Math.atan2(-dx, -dz) - me.yaw), -1, 1) * -1; ({ ot: Snd.neigh, bizon: Snd.moo, arxar: Snd.baa, bori: (dd, p) => Snd.wolf(dd, p, a.state !== "chase"), ayiq: Snd.bear })[a.type](d, pan); }
        // ko'rinish
        const g = a.vis.g, y = heightAt(a.x, a.z);
        g.position.set(a.x, y, a.z); g.rotation.y = a.yaw;
        if (far) continue;
        const sp = Math.abs(a.speed);
        if (a.vis.kind === "farm") {
          a.ph += dt * sp * 3.2; const amp = clamp(sp / 3, 0, 1) * (run ? 0.7 : 0.45), s = Math.sin(a.ph) * amp;
          a.vis.legs[0].rotation.x = s; a.vis.legs[3].rotation.x = s; a.vis.legs[1].rotation.x = -s; a.vis.legs[2].rotation.x = -s;
          a.vis.head.rotation.x = a.state === "graze" ? 0.7 + Math.sin(t * 2 + a.ph) * 0.08 : run ? -0.1 : 0.1;
          a.vis.tail.rotation.z = Math.sin(t * 3 + a.ph) * 0.4;
          a.vis.body.position.y = run ? Math.abs(Math.cos(a.ph)) * 0.08 : 0; a.vis.sync();
        } else if (a.vis.kind === "fox") { a.vis.play(sp > 4 ? "Run" : sp > 0.4 ? "Walk" : "Survey"); a.vis.mixer.update(dt * (sp > 4 ? sp / 7 : 1)); }
        else if (a.vis.kind === "bear") { a.ph += dt * sp * 2.6; a.vis.u.uSwing.value = Math.sin(a.ph) * clamp(sp / 3, 0, 1) * 0.5; a.vis.body.position.y = Math.abs(Math.cos(a.ph)) * clamp(sp / 4, 0, 1) * 0.1; a.vis.body.rotation.z = Math.sin(a.ph) * 0.05 * clamp(sp / 2, 0, 1); if (a.state === "chase" && d < c.reach + 0.5) a.vis.body.rotation.x = -0.25 + Math.sin(t * 8) * 0.15; else a.vis.body.rotation.x = 0; }
      }
      if (animals.some((a) => a.herd && a.herd.alarm > 0)) animals.forEach((a) => { if (a.herd && a.herd.alarm > 0) a.herd.alarm -= dt / Math.max(1, animals.filter((b) => b.herd === a.herd).length); });
      // yangi hayvonlar (uzoqda paydo bo'ladi)
      respawnT -= dt;
      if (respawnT <= 0) { respawnT = 25; Object.keys(ANIMALS).forEach((type) => { const live = animals.filter((a) => a.type === type && a.alive).length; if (live < ANIMALS[type].n * 0.6) spawnHerd(type, 100); }); }
    }
    function hurtMe(dmg, a) {
      if (st.dead) return;
      me.hp -= dmg; me.hurtT = 8; st.shake = 0.5; Snd.hurt();
      ui.dmg.classList.remove("on"); void ui.dmg.offsetWidth; ui.dmg.classList.add("on");
      warn(`⚠️ ${a.cfg.icon} ${a.cfg.name} hujum qilmoqda!`);
      if (me.hp <= 0) die();
    }
    function die() {
      st.dead = true; me.hp = 0; const lost = save.bag.length; save.bag = []; persist(); if (document.pointerLockElement) document.exitPointerLock();
      ui.panel.hidden = false;
      ui.panel.innerHTML = `<div class="ov-shop dead"><span class="big">🩹</span><h2>Siz yaralandingiz</h2><p>Yirtqichlar xavfli! ${lost ? `Xaltadagi ${lost} ta o‘lja yo‘qoldi.` : ""} Lagerda tiklanasiz — pul va qurollar saqlanadi.</p><button class="ov-big" data-s2="respawn" type="button">🏕 Lagerga qaytish</button></div>`;
      ui.panel.querySelector("[data-s2]").onclick = () => { st.dead = false; me.hp = 100; me.x = CAMP.x; me.z = CAMP.z - 6; me.yaw = Math.PI; ui.panel.hidden = true; animals.forEach((a) => { if (a.state === "chase") { a.state = "walk"; a.tx = a.home[0]; a.tz = a.home[1]; a.t = 6; } }); lockIt(); };
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
      if (e.code === "KeyR") reload(); if (e.code === "KeyE") pickUp(); if (e.code === "KeyQ") summonMerchant(); if (e.code === "KeyH") useMed();
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
          if (k === "fire") { fireHeld = true; fire(); } if (k === "aim") st.aim = !st.aim; if (k === "pick") pickUp(); if (k === "reload") reload(); if (k === "switch") switchWeapon(); if (k === "run") { runT = !runT; b.classList.toggle("lit", runT); } if (k === "crouch") { me.crouch = !me.crouch; b.classList.toggle("lit", me.crouch); } }, { passive: false });
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
        <p class="ov-tip">${MOBILE ? "Chap — yurish, o‘ng — qarash · 🎯 otish · 🔭 nishon · 🎒 o‘ljani olish · 🔫 qurol almashtirish · 🏃 yugurish · ⇩ cho‘kkalash (hayvonlar sezmaydi)" : "W A S D — yurish · Shift — yugurish · C — cho‘kkalash (hayvonlar sezmaydi) · Sichqoncha — qarash · Chap tugma — otish · O‘ng — nishon/durbin · R — o‘qlash · E — o‘ljani olish · Q — do‘kon · H — aptechka · 1–4 — qurollar"}</p>
        ${save.med ? `<button class="ov-big ghost" data-b="med" type="button">🩹 Aptechka ishlatish (${save.med})</button>` : ""}
        <div class="ov-row"><button class="ov-big" data-b="resume" type="button">▶ Davom etish</button><button class="ov-big ghost" data-b="exit" type="button">🚪 Chiqish</button></div></div>`;
    }
    function begin() {
      Snd.init(); Snd.ambience(true);
      st.started = true; st.paused = false; ui.panel.hidden = true; lockIt();
      banner(`<b>🏹 Ov boshlandi!</b><small>🌲 Shimolda o‘rmon (bo‘ri, ayiq) · 🌾 Markazda dala (ot, bizon) · 🏜 Sharqda cho‘l (arxar)</small>`, 5000);
    }

    /* ---------- Xarita ---------- */
    const mctx = ui.map.getContext("2d"), MS = ui.map.width;
    const base = document.createElement("canvas"); base.width = base.height = MS;
    { const g = base.getContext("2d"), img = g.createImageData(MS, MS);
      for (let j = 0; j < MS; j++) for (let i = 0; i < MS; i++) { const x = (i / MS) * HALF * 2 - HALF, z = (j / MS) * HALF * 2 - HALF, b = biome(x, z), e = sstep(150, 180, Math.max(Math.abs(x), Math.abs(z))); const k = (j * MS + i) * 4;
        const r = 90 * b.field + 40 * b.forest + 210 * b.desert, gg = 130 * b.field + 80 * b.forest + 180 * b.desert, bl = 55 * b.field + 40 * b.forest + 120 * b.desert;
        img.data[k] = lerp(r, 130, e); img.data[k + 1] = lerp(gg, 125, e); img.data[k + 2] = lerp(bl, 115, e); img.data[k + 3] = 230; }
      g.putImageData(img, 0, 0); }
    const toMap = (x, z) => [((x + HALF) / (HALF * 2)) * MS, ((z + HALF) / (HALF * 2)) * MS];
    function drawMap() {
      mctx.clearRect(0, 0, MS, MS); mctx.drawImage(base, 0, 0);
      const [cx, cz] = toMap(CAMP.x, CAMP.z); mctx.font = "18px system-ui"; mctx.textAlign = "center"; mctx.textBaseline = "middle"; mctx.fillText("🏕", cx, cz);
      carcasses.forEach((c) => { const [x, z] = toMap(c.a.x, c.a.z); mctx.fillStyle = "#ffd36a"; mctx.beginPath(); mctx.arc(x, z, 4, 0, 6.28); mctx.fill(); });
      animals.forEach((a) => { if (!a.alive) return; const d = Math.hypot(a.x - me.x, a.z - me.z); if (d > 60 && !(a.cfg.pred && a.state === "chase")) return; const [x, z] = toMap(a.x, a.z); mctx.fillStyle = a.cfg.pred ? "#ff4040" : "#9cff7a"; mctx.globalAlpha = 0.85; mctx.beginPath(); mctx.arc(x, z, a.cfg.pred && a.state === "chase" ? 4 : 2.6, 0, 6.28); mctx.fill(); mctx.globalAlpha = 1; });
      if (merchant) { const [x, z] = toMap(merchant.position.x, merchant.position.z); mctx.fillText("🏪", x, z); }
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
        if (!MOBILE) me.crouch = keys.has("KeyC") || keys.has("ControlLeft");
        const run = (keys.has("ShiftLeft") || runT) && !me.crouch && !st.aim && iz < 0;
        const sp = me.crouch ? 2.0 : st.aim ? 2.4 : run ? 7.5 : 4.3;
        const cs = Math.cos(me.yaw), sn = Math.sin(me.yaw);
        me.vx += ((ix * cs + iz * sn) * sp - me.vx) * Math.min(1, dt * 10); me.vz += ((-ix * sn + iz * cs) * sp - me.vz) * Math.min(1, dt * 10);
        me.x += me.vx * dt; me.z += me.vz * dt;
        me.x = clamp(me.x, -165, 165); me.z = clamp(me.z, -165, 165);
        // daraxtlar
        for (let ox = -1; ox <= 1; ox++) for (let oz = -1; oz <= 1; oz++) (trunks.get((Math.floor(me.x / 10) + ox) + "," + (Math.floor(me.z / 10) + oz)) || []).forEach(([tx, tz, r]) => { const dx = me.x - tx, dz = me.z - tz, d = Math.hypot(dx, dz), R = r + 0.35; if (d < R && d > 1e-6) { me.x = tx + dx / d * R; me.z = tz + dz / d * R; } });
        me.y = heightAt(me.x, me.z);
        const v = Math.hypot(me.vx, me.vz);
        if (v > 0.5) { me.bob += dt * v * 2.2; me.stepT -= dt * v; if (me.stepT <= 0) { me.stepT = 1.5; Snd.step(me.crouch ? 0.4 : run ? 1 : 0.7, biome(me.x, me.z).desert > 0.5); } }
        if (st.fireT > 0) st.fireT -= dt;
        if (fireHeld && WEAPONS[save.cur].auto) fire();
        if (st.reloadT > 0) { st.reloadT -= dt; if (st.reloadT <= 0) { const W = WEAPONS[save.cur], n = Math.min(W.mag - st.mag[save.cur], save.ammo); st.mag[save.cur] += n; save.ammo -= n; persist(); } }
        if (me.hurtT > 0) me.hurtT -= dt; else if (me.hp < 100) { me.regenT += dt; if (me.regenT > 2.5) { me.regenT = 0; me.hp = Math.min(100, me.hp + 2); } }
        // o'lja yaqinmi?
        const near = carcasses.find((c) => Math.hypot(c.a.x - me.x, c.a.z - me.z) < 3.2);
        ui.prompt.hidden = !near; if (near) ui.prompt.innerHTML = `${MOBILE ? "🎒" : "<kbd>E</kbd>"} ${near.a.cfg.icon} ${near.a.cfg.name}ni olish (+${near.a.cfg.price} 💰)`;
        if (Math.hypot(me.x - gCenter[0], me.z - gCenter[1]) > 18) placeGrass(me.x, me.z);
        updateAnimals(dt, t);
      } else if (st.started) updateAnimals(st.paused ? 0 : dt * 0.5, t);
      mx = 0; my = 0;
      // kamera
      st.shake = Math.max(0, st.shake - dt);
      const eye = me.crouch ? 1.1 : 1.65, shk = st.shake * 0.05;
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
      populate();
      ui.panel.innerHTML = `<div class="ov-shop"><span class="big">🏹</span><h2>Ovga tayyormisiz?</h2>
        <p>Keng dalada, o‘rmonda va cho‘lda hayvonlarni ovlang. O‘txo‘rlar (🐎 ot, 🦬 bizon, 🐏 arxar) sizni sezsa qochadi — <b>cho‘kkalab</b> yaqinlashing. Yirtqichlar (🐺 bo‘ri, 🐻 ayiq) <b>o‘zi hujum qiladi</b> — ehtiyot bo‘ling!</p>
        <p class="ov-tip">Otilgan hayvonni borib oling 🎒, keyin 🏪 do‘konni chaqirib soting va yangi qurollar sotib oling.</p>
        <div class="ov-row"><button class="ov-big" data-b="start" type="button">▶ Ovni boshlash</button><button class="ov-big ghost" data-b="exit" type="button">🚪 Chiqish</button></div></div>`;
    })();
    return { destroy: () => destroy(false), debug: { me, st, animals, carcasses, save, camera, renderer, scene, fire: () => fire(), damage, pickUp, summonMerchant, heightAt, equip, openShop } };
  }

  window.SofiOvchi3D = { create, WEAPONS, ANIMALS };
})();
