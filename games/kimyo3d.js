/* KIMYO LABORATORIYASI 3D — xona, jihozlar, shisha idishlar, suyuqlik va reaksiya effektlari.
   new SofiLab3D(container, opts) — opts.onPick(name)
   setVessel(type) · setLiquid({ level, color, opacity, cloud, cloudColor }) · setPpt(amount, color)
   pour(kind, color, opts) → Promise · addMetal(shape, color) · clearAll()
   fx: bubbles(rate, dur) · foam(amount) · smoke(color, dur) · steam(dur) · flash(color) · glow(color, dur)
       heat(on) · flameColor(color|null) · sodium(color, dur) · crystals(color) · coatMetal(color) · shrinkMetal()
       mirror() · snake() · splint(kind, result) · straw() · setTemp(t) · view(name)                                  */
(() => {
  "use strict";
  const T = window.THREE;
  const rand = (a, b) => a + Math.random() * (b - a);
  const BENCH_Y = 0.92;

  // ---------- Teksturalar ----------
  const cnv = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); return c; };
  const tex = (c, rep, srgb = true) => { const t = new T.CanvasTexture(c); if (srgb) t.encoding = T.sRGBEncoding; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
  const noise = (x, w, h, n, a, c = "0,0,0") => { for (let i = 0; i < n; i++) { x.fillStyle = `rgba(${c},${Math.random() * a})`; x.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } };
  const hex = (c) => "#" + c.toString(16).padStart(6, "0");

  function periodicPoster() {
    const C = window.SofiChem;
    return tex(cnv(2048, 1200, (x, w, h) => {
      x.fillStyle = "#f8f6f0"; x.fillRect(0, 0, w, h);
      x.fillStyle = "#1d2b44"; x.font = "bold 58px Arial"; x.textAlign = "center"; x.fillText("D. I. MENDELEYEVNING KIMYOVIY ELEMENTLAR DAVRIY JADVALI", w / 2, 76);
      const cw = 106, ch = 116, ox = (w - cw * 18) / 2, oy = 110;
      C.ELEMENTS.forEach((e) => {
        let col = e.group - 1, row = e.period - 1;
        if (e.f !== undefined) { col = 2 + e.f + 0.5; row = e.period === 6 ? 7.4 : 8.4; }
        const X = ox + col * cw, Y = oy + row * ch;
        x.fillStyle = e.color; x.fillRect(X + 2, Y + 2, cw - 4, ch - 4);
        x.strokeStyle = "rgba(0,0,0,.35)"; x.lineWidth = 2; x.strokeRect(X + 2, Y + 2, cw - 4, ch - 4);
        x.fillStyle = "#111"; x.textAlign = "left"; x.font = "bold 20px Arial"; x.fillText(e.z, X + 8, Y + 26);
        x.textAlign = "center"; x.font = "bold 44px Arial"; x.fillText(e.sym, X + cw / 2, Y + 72);
        x.font = "15px Arial"; x.fillText(e.name.slice(0, 11), X + cw / 2, Y + 96);
        x.font = "13px Arial"; x.fillText(String(e.mass), X + cw / 2, Y + 110);
      });
    }));
  }
  function label(text, sub, bg = "#fff") {
    return tex(cnv(256, 160, (x, w, h) => {
      x.fillStyle = bg; x.fillRect(0, 0, w, h); x.strokeStyle = "#333"; x.lineWidth = 4; x.strokeRect(6, 6, w - 12, h - 12);
      x.fillStyle = "#111"; x.textAlign = "center"; x.font = "bold 54px Arial"; x.fillText(text, w / 2, 78);
      x.font = "22px Arial"; x.fillText(sub.slice(0, 18), w / 2, 122);
    }));
  }

  // ---------- Materiallar ----------
  const M = {};
  const std = (k, o) => M[k] || (M[k] = new T.MeshStandardMaterial(o));
  function glassMat() {
    if (M.glass) return M.glass;
    const m = new T.MeshStandardMaterial({ color: 0xb9d3de, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.3, side: T.DoubleSide, depthWrite: false, envMapIntensity: 1.4 });
    // Fresnel: chetlarda shisha yorqinroq va xiraroq ko'rinadi — haqiqiy shisha kabi
    m.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace("#include <output_fragment>", `
        float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.5);
        diffuseColor.a = clamp(diffuseColor.a + fres * 0.65, 0.0, 0.92);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.92, 0.97, 1.0), fres * 0.5);
        #include <output_fragment>`);
    };
    return (M.glass = m);
  }

  function Lab3D(container, opts = {}) {
    if (!T) throw new Error("THREE yo‘q");
    if (T.ColorManagement) T.ColorManagement.legacyMode = false;
    let renderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); } catch (e) { throw new Error("WebGL yo‘q"); }
    const mobile = matchMedia("(max-width: 700px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.6 : 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.domElement.className = "kl-canvas";
    container.appendChild(renderer.domElement);
    const scene = new T.Scene();
    scene.background = new T.Color(0x141c22);
    const camera = new T.PerspectiveCamera(42, 1, 0.01, 60);

    // Aks muhit (shisha va metall yaltirashi uchun)
    const pmrem = new T.PMREMGenerator(renderer);
    {
      const s = new T.Scene();
      s.add(new T.Mesh(new T.BoxGeometry(10, 4, 8), new T.MeshBasicMaterial({ color: 0x5f6b70, side: T.BackSide })));
      const lamp = new T.Mesh(new T.BoxGeometry(3, 0.1, 0.6), new T.MeshBasicMaterial({ color: 0xffffff })); lamp.position.set(0, 1.9, 0); s.add(lamp);
      const lamp2 = lamp.clone(); lamp2.position.set(0, 1.9, 2); s.add(lamp2);
      const win = new T.Mesh(new T.PlaneGeometry(4, 2), new T.MeshBasicMaterial({ color: 0xbfe3ff })); win.position.set(0, 0.5, -3.9); s.add(win);
      const dark = new T.Mesh(new T.BoxGeometry(10, 0.1, 8), new T.MeshBasicMaterial({ color: 0x55585c })); dark.position.y = -1.95; s.add(dark);
      scene.environment = pmrem.fromScene(s, 0.04).texture;
    }

    // ---------- Yorug'lik ----------
    scene.add(new T.HemisphereLight(0xf4f8ff, 0x55504a, 0.32));
    const key = new T.SpotLight(0xfff4e6, 1.5, 12, 0.6, 0.7, 1.2);
    key.position.set(0.6, 3.0, 1.2); key.target.position.set(0, BENCH_Y, 0); key.castShadow = true;
    key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048); key.shadow.bias = -0.0002; key.shadow.normalBias = 0.01;
    scene.add(key, key.target);
    const winLight = new T.DirectionalLight(0xdcecff, 0.4); winLight.position.set(-2, 3, -4); scene.add(winLight);
    const fill = new T.PointLight(0xffffff, 0.3, 8); fill.position.set(-1.5, 2.6, 1.5); scene.add(fill);

    // ---------- Xona ----------
    const RW = 8, RD = 6.5, RH = 3.2;
    const floorT = tex(cnv(256, 256, (x, w, h) => { x.fillStyle = "#9aa0a4"; x.fillRect(0, 0, w, h); noise(x, w, h, 5000, 0.12); noise(x, w, h, 2000, 0.1, "255,255,255"); x.strokeStyle = "rgba(0,0,0,.18)"; x.lineWidth = 2; x.strokeRect(0, 0, w, h); }), [RW / 0.6, RD / 0.6]);
    const floor = new T.Mesh(new T.PlaneGeometry(RW, RD), new T.MeshStandardMaterial({ map: floorT, roughness: 0.55 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const tileT = tex(cnv(128, 128, (x, w, h) => { x.fillStyle = "#c9d3d4"; x.fillRect(0, 0, w, h); x.strokeStyle = "#a3aeb0"; x.lineWidth = 3; x.strokeRect(0, 0, w, h); }), [RW / 0.2, 1.4 / 0.2]);
    const paint = new T.MeshStandardMaterial({ color: 0x7f9499, roughness: 0.9 });
    const tileM = new T.MeshStandardMaterial({ map: tileT, roughness: 0.25 });
    const wall = (w, h, x, y, z, ry, m) => { const o = new T.Mesh(new T.PlaneGeometry(w, h), m); o.position.set(x, y, z); o.rotation.y = ry; o.receiveShadow = true; scene.add(o); return o; };
    // orqa (-z), chap (-x), o'ng (+x), old (+z)
    [[RW, 0, -RD / 2, 0], [RD, -RW / 2, 0, Math.PI / 2], [RD, RW / 2, 0, -Math.PI / 2], [RW, 0, RD / 2, Math.PI]].forEach(([w, x, z, ry]) => {
      wall(w, 1.4, x, 0.7, z, ry, tileM.clone());
      wall(w, RH - 1.4, x, 1.4 + (RH - 1.4) / 2, z, ry, paint);
    });
    const ceil = new T.Mesh(new T.PlaneGeometry(RW, RD), new T.MeshStandardMaterial({ color: 0xf2f2f0, roughness: 1 })); ceil.rotation.x = Math.PI / 2; ceil.position.y = RH; scene.add(ceil);
    for (let i = -1; i <= 1; i++) for (let j = 0; j < 2; j++) { const p = new T.Mesh(new T.BoxGeometry(1.2, 0.03, 0.3), new T.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.7 })); p.position.set(i * 2.4, RH - 0.02, -1 + j * 2.2); scene.add(p); }
    // Deraza (orqa devor)
    const sky = tex(cnv(256, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#7fb7ee"); g.addColorStop(0.7, "#cfe6f7"); g.addColorStop(0.71, "#8fb36a"); g.addColorStop(1, "#6f9a4f"); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = "rgba(255,255,255,.8)"; for (let i = 0; i < 5; i++) { x.beginPath(); x.ellipse(Math.random() * w, 40 + Math.random() * 70, 40, 14, 0, 0, 7); x.fill(); } }));
    const winM = new T.Mesh(new T.PlaneGeometry(2.4, 1.3), new T.MeshBasicMaterial({ map: sky })); winM.position.set(-1.6, 2.05, -RD / 2 + 0.01); scene.add(winM);
    const frameM = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    [[2.5, 0.06, 0, 0.68], [2.5, 0.06, 0, -0.68], [0.06, 1.4, -1.22, 0], [0.06, 1.4, 1.22, 0], [0.04, 1.3, 0, 0]].forEach(([w, h, dx, dy]) => { const f = new T.Mesh(new T.BoxGeometry(w, h, 0.06), frameM); f.position.set(-1.6 + dx, 2.05 + dy, -RD / 2 + 0.03); scene.add(f); });
    // Davriy jadval plakati (chap devor)
    const poster = new T.Mesh(new T.PlaneGeometry(3.2, 1.875), new T.MeshStandardMaterial({ map: periodicPoster(), roughness: 0.6 }));
    poster.position.set(-RW / 2 + 0.02, 2.15, -0.2); poster.rotation.y = Math.PI / 2; poster.userData.pick = "jadval"; scene.add(poster);
    // Doska (o'ng devor)
    const board = tex(cnv(1024, 512, (x, w, h) => {
      x.fillStyle = "#1f3a2e"; x.fillRect(0, 0, w, h); noise(x, w, h, 3000, 0.06, "255,255,255");
      x.fillStyle = "rgba(255,255,255,.88)"; x.font = "48px 'Comic Sans MS', cursive"; x.textAlign = "left";
      ["2H₂ + O₂ → 2H₂O", "NaOH + HCl → NaCl + H₂O", "CaCO₃ + 2HCl → CaCl₂ + CO₂↑", "Zn + CuSO₄ → ZnSO₄ + Cu"].forEach((t, i) => x.fillText(t, 60, 110 + i * 92));
    }));
    const bd = new T.Mesh(new T.PlaneGeometry(2.6, 1.3), new T.MeshStandardMaterial({ map: board, roughness: 0.9 })); bd.position.set(RW / 2 - 0.02, 1.95, 0.4); bd.rotation.y = -Math.PI / 2; scene.add(bd);
    const bdf = new T.Mesh(new T.BoxGeometry(0.04, 1.4, 2.7), new T.MeshStandardMaterial({ color: 0x8a5a36 })); bdf.position.set(RW / 2 - 0.01, 1.95, 0.4); scene.add(bdf);
    // Xavfsizlik plakati (orqa devor)
    const safeT = tex(cnv(512, 700, (x, w, h) => {
      x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.fillStyle = "#e0231b"; x.fillRect(0, 0, w, 110); x.fillStyle = "#fff"; x.font = "bold 44px Arial"; x.textAlign = "center"; x.fillText("XAVFSIZLIK", w / 2, 72);
      x.fillStyle = "#111"; x.font = "28px Arial"; x.textAlign = "left";
      ["🥽 Ko‘zoynak taqing", "🧤 Qo‘lqop kiying", "👃 Hidlamang, tatib ko‘rmang", "🔥 Olovdan ehtiyot bo‘ling", "👩‍🏫 O‘qituvchiga quloq soling", "🧴 Moddalarni aralashtirmang", "🚿 Tegsa — ko‘p suv bilan yuving"].forEach((t, i) => x.fillText(t, 30, 180 + i * 72));
    }));
    const sp = new T.Mesh(new T.PlaneGeometry(0.7, 0.95), new T.MeshStandardMaterial({ map: safeT, roughness: 0.7 })); sp.position.set(1.0, 2.0, -RD / 2 + 0.02); scene.add(sp);
    // Soat
    const clk = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.04, 40), new T.MeshStandardMaterial({ map: tex(cnv(256, 256, (x) => { x.fillStyle = "#fff"; x.beginPath(); x.arc(128, 128, 124, 0, 7); x.fill(); x.strokeStyle = "#222"; x.lineWidth = 8; x.stroke(); x.fillStyle = "#222"; for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.28; x.fillRect(128 + Math.cos(a) * 100 - 4, 128 + Math.sin(a) * 100 - 4, 8, 8); } x.lineWidth = 7; x.beginPath(); x.moveTo(128, 128); x.lineTo(128, 60); x.stroke(); x.beginPath(); x.moveTo(128, 128); x.lineTo(180, 128); x.stroke(); })) }));
    clk.rotation.x = Math.PI / 2; clk.position.set(2.4, 2.6, -RD / 2 + 0.03); scene.add(clk);

    // ---------- Javonlar va reaktiv shishalari (orqa devor) ----------
    const wood = new T.MeshStandardMaterial({ color: 0x8a6342, roughness: 0.6 });
    const metalM = new T.MeshStandardMaterial({ color: 0xb8bec4, roughness: 0.3, metalness: 0.85 });
    const bottles = new T.Group(); scene.add(bottles);
    const REAG = (window.SofiChem && window.SofiChem.REAGENTS) || [];
    [1.45, 1.85, 2.25].forEach((y, si) => {
      const sh = new T.Mesh(new T.BoxGeometry(3.4, 0.03, 0.32), wood); sh.position.set(2.0, y, -RD / 2 + 0.17); sh.castShadow = true; sh.receiveShadow = true; scene.add(sh);
      for (let i = 0; i < 14; i++) {
        const r = REAG[(si * 14 + i) % REAG.length] || {};
        const brown = i % 3 === 0, tall = 0.13 + (i % 2) * 0.04;
        const g = new T.Group(); g.position.set(0.45 + i * 0.235, y + 0.015, -RD / 2 + 0.17 + rand(-0.04, 0.04));
        const bm = new T.MeshStandardMaterial({ color: brown ? 0x6b3a12 : 0xe8f1f4, roughness: 0.05, transparent: !brown, opacity: brown ? 1 : 0.4, envMapIntensity: 1.6 });
        const b = new T.Mesh(new T.CylinderGeometry(0.04, 0.042, tall, 20), bm); b.position.y = tall / 2; b.castShadow = true; g.add(b);
        if (!brown && r.color) { const liq = new T.Mesh(new T.CylinderGeometry(0.036, 0.038, tall * 0.6, 20), new T.MeshStandardMaterial({ color: r.color, roughness: 0.2, transparent: true, opacity: 0.85 })); liq.position.y = tall * 0.32; g.add(liq); }
        const neck = new T.Mesh(new T.CylinderGeometry(0.015, 0.03, 0.03, 16), bm); neck.position.y = tall + 0.015; g.add(neck);
        const cap = new T.Mesh(new T.CylinderGeometry(0.017, 0.017, 0.025, 16), new T.MeshStandardMaterial({ color: [0x1d1d1d, 0xb02a2a, 0x2a5ab0, 0xf2f2f2][i % 4], roughness: 0.5 })); cap.position.y = tall + 0.04; g.add(cap);
        const lb = new T.Mesh(new T.PlaneGeometry(0.062, 0.042), new T.MeshStandardMaterial({ map: label(r.f || "?", r.name || ""), roughness: 0.8 })); lb.position.set(0, tall * 0.5, 0.0425); g.add(lb);
        bottles.add(g);
      }
    });
    // ---------- Mo'rili shkaf (o'ng burchak) ----------
    const hood = new T.Group(); hood.position.set(RW / 2 - 0.55, 0, -1.9); hood.rotation.y = -Math.PI / 2; scene.add(hood);
    const hoodM = new T.MeshStandardMaterial({ color: 0xeef0ee, roughness: 0.5 });
    const hb = (w, h, d, x, y, z, m = hoodM) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; hood.add(o); return o; };
    hb(1.6, 0.9, 0.9, 0, 0.45, 0); hb(1.6, 0.04, 0.95, 0, 0.92, 0, new T.MeshStandardMaterial({ color: 0x1b1c1e, roughness: 0.35 }));
    hb(0.05, 1.3, 0.9, -0.8, 1.6, 0); hb(0.05, 1.3, 0.9, 0.8, 1.6, 0); hb(1.6, 1.3, 0.05, 0, 1.6, -0.45); hb(1.65, 0.35, 0.95, 0, 2.42, 0);
    const sash = new T.Mesh(new T.PlaneGeometry(1.55, 0.9), glassMat()); sash.position.set(0, 1.75, 0.45); hood.add(sash);
    const hl = new T.PointLight(0xfff6e8, 0.6, 2); hl.position.set(0, 2.1, 0); hood.add(hl);
    const hlab = new T.Mesh(new T.PlaneGeometry(0.5, 0.12), new T.MeshStandardMaterial({ map: label("MO‘RILI SHKAF", ""), roughness: 0.8 })); hlab.position.set(0, 2.42, 0.48); hood.add(hlab);
    // O't o'chirgich va ko'z yuvgich
    const ext = new T.Group(); ext.position.set(-RW / 2 + 0.3, 0, 2.2); scene.add(ext);
    { const e = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.5, 20), new T.MeshStandardMaterial({ color: 0xc8161b, roughness: 0.3, metalness: 0.2 })); e.position.y = 0.35; e.castShadow = true; ext.add(e); const t = new T.Mesh(new T.CylinderGeometry(0.03, 0.04, 0.08, 12), new T.MeshStandardMaterial({ color: 0x222222 })); t.position.y = 0.64; ext.add(t); }

    // ---------- Laboratoriya stoli (markazda) ----------
    const bench = new T.Group(); scene.add(bench);
    const cab = new T.MeshStandardMaterial({ color: 0xf4f4f2, roughness: 0.45 });
    const top = new T.MeshStandardMaterial({ color: 0x17181a, roughness: 0.28, metalness: 0.05 });
    const bb = (w, h, d, x, y, z, m) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; bench.add(o); return o; };
    bb(3.2, BENCH_Y - 0.05, 1.3, 0, (BENCH_Y - 0.05) / 2, 0, cab);
    bb(3.3, 0.05, 1.4, 0, BENCH_Y - 0.025, 0, top);
    for (let i = 0; i < 6; i++) { bb(0.5, 0.36, 0.01, -1.3 + i * 0.52, 0.62, 0.656, cab).material = cab; bb(0.12, 0.02, 0.02, -1.3 + i * 0.52, 0.72, 0.668, metalM); bb(0.5, 0.004, 0.012, -1.3 + i * 0.52, 0.42, 0.656, new T.MeshStandardMaterial({ color: 0xc9c9c6 })); }
    // Rakovina va kran
    bb(0.5, 0.02, 0.4, 1.3, BENCH_Y + 0.0, 0.25, new T.MeshStandardMaterial({ color: 0xc8ccd1, roughness: 0.25, metalness: 0.8 }));
    { const f = new T.Mesh(new T.CylinderGeometry(0.015, 0.015, 0.32, 12), metalM); f.position.set(1.3, BENCH_Y + 0.16, 0.48); bench.add(f); const s = new T.Mesh(new T.TorusGeometry(0.08, 0.013, 8, 20, Math.PI), metalM); s.position.set(1.3, BENCH_Y + 0.32, 0.4); s.rotation.y = Math.PI / 2; bench.add(s); }
    // Stullar
    for (const x of [-1, 0.2]) { const st = new T.Group(); st.position.set(x, 0, 1.15); scene.add(st); const seat = new T.Mesh(new T.CylinderGeometry(0.18, 0.18, 0.05, 24), new T.MeshStandardMaterial({ color: 0x2f4f7a, roughness: 0.6 })); seat.position.y = 0.66; seat.castShadow = true; st.add(seat); const leg = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 0.64, 10), metalM); leg.position.y = 0.32; st.add(leg); const base = new T.Mesh(new T.CylinderGeometry(0.2, 0.22, 0.03, 24), metalM); base.position.y = 0.015; st.add(base); }

    // Stoldagi bezak jihozlar: probirkalar shtativi, kolbalar, mikroskop, tarozi, ko'zoynak
    const decor = new T.Group(); decor.position.y = BENCH_Y; scene.add(decor);
    {
      const rack = new T.Group(); rack.position.set(-0.9, 0, -0.25); decor.add(rack);
      const rw = new T.MeshStandardMaterial({ color: 0xd9b88a, roughness: 0.7 });
      [[0.42, 0.015, 0.12, 0, 0.08], [0.42, 0.015, 0.12, 0, 0.0075], [0.015, 0.09, 0.12, -0.2, 0.045], [0.015, 0.09, 0.12, 0.2, 0.045]].forEach(([w, h, d, x, y]) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), rw); o.position.set(x, y, 0); o.castShadow = true; rack.add(o); });
      const cs = [0xe23a4a, 0x2a8ae0, 0xf2c94c, 0x35c06f, 0x9a4ae0, null];
      cs.forEach((c, i) => {
        const tb = new T.Mesh(new T.CylinderGeometry(0.011, 0.011, 0.15, 16, 1, true), glassMat()); tb.position.set(-0.16 + i * 0.064, 0.09, 0); rack.add(tb);
        if (c) { const l = new T.Mesh(new T.CylinderGeometry(0.0095, 0.0095, 0.06, 16), new T.MeshStandardMaterial({ color: c, roughness: 0.1, transparent: true, opacity: 0.85 })); l.position.set(-0.16 + i * 0.064, 0.045, 0); rack.add(l); }
      });
      // Konussimon kolbalar (bezak)
      [[0x2a8ae0, -1.35, 0.2], [0x35c06f, -1.18, 0.33]].forEach(([c, x, z]) => {
        const pts = [[0, 0], [0.05, 0], [0.052, 0.004], [0.017, 0.1], [0.017, 0.14], [0.02, 0.145]].map(([r, y]) => new T.Vector2(r, y));
        const fl = new T.Mesh(new T.LatheGeometry(pts, 32), glassMat()); fl.position.set(x, 0, z); decor.add(fl);
        const lp = [[0, 0.003], [0.047, 0.003], [0.033, 0.04], [0, 0.04]].map(([r, y]) => new T.Vector2(r, y));
        const lq = new T.Mesh(new T.LatheGeometry(lp, 32), new T.MeshStandardMaterial({ color: c, transparent: true, opacity: 0.8, roughness: 0.1 })); lq.position.set(x, 0, z); decor.add(lq);
      });
      // Mikroskop
      const mic = new T.Group(); mic.position.set(-0.4, 0, -0.45); mic.rotation.y = 0.5; decor.add(mic);
      const dk = new T.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.4, metalness: 0.4 }), wh = new T.MeshStandardMaterial({ color: 0xf0f0ee, roughness: 0.4 });
      [[0.16, 0.025, 0.2, 0, 0.0125, 0, dk], [0.04, 0.22, 0.05, 0, 0.13, -0.06, wh], [0.12, 0.012, 0.1, 0, 0.12, 0.02, dk]].forEach(([w, h, d, x, y, z, m]) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; mic.add(o); });
      const tube = new T.Mesh(new T.CylinderGeometry(0.018, 0.022, 0.14, 16), dk); tube.position.set(0, 0.24, 0.0); tube.rotation.x = -0.4; tube.castShadow = true; mic.add(tube);
      // Tarozi
      const bal = new T.Group(); bal.position.set(0.75, 0, -0.42); decor.add(bal);
      const bx = new T.Mesh(new T.BoxGeometry(0.22, 0.07, 0.26), wh); bx.position.y = 0.035; bx.castShadow = true; bal.add(bx);
      const pan = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.008, 32), metalM); pan.position.set(0, 0.075, -0.03); bal.add(pan);
      const scr = new T.Mesh(new T.PlaneGeometry(0.1, 0.03), new T.MeshStandardMaterial({ map: tex(cnv(128, 40, (x, w, h) => { x.fillStyle = "#0b2a1c"; x.fillRect(0, 0, w, h); x.fillStyle = "#4dff9a"; x.font = "bold 28px monospace"; x.fillText("0.00 g", 8, 30); })), emissive: 0x113322 }));
      scr.position.set(0, 0.04, 0.131); bal.add(scr);
      // Ko'zoynak
      const gog = new T.Group(); gog.position.set(0.45, 0.02, 0.4); gog.rotation.y = -0.3; decor.add(gog);
      const gm = new T.MeshStandardMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.45, roughness: 0.05 });
      [-0.045, 0.045].forEach((x) => { const l = new T.Mesh(new T.SphereGeometry(0.04, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.4), gm); l.position.x = x; l.rotation.x = -Math.PI / 2; gog.add(l); });
      const strap = new T.Mesh(new T.TorusGeometry(0.09, 0.006, 6, 24, Math.PI), new T.MeshStandardMaterial({ color: 0x1d4ed8 })); strap.rotation.x = Math.PI / 2; strap.position.z = -0.04; gog.add(strap);
      // Daftar
      const nb = new T.Mesh(new T.BoxGeometry(0.21, 0.012, 0.29), new T.MeshStandardMaterial({ map: tex(cnv(128, 180, (x, w, h) => { x.fillStyle = "#fbfbf6"; x.fillRect(0, 0, w, h); x.strokeStyle = "#9cc0e8"; for (let i = 20; i < h; i += 12) { x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); } x.fillStyle = "#2a3a6a"; x.font = "12px Arial"; x.fillText("Tajriba №7", 10, 16); })) }));
      nb.position.set(-0.6, 0.006, 0.35); nb.rotation.y = 0.15; nb.castShadow = true; decor.add(nb);
    }

    // ---------- Ish joyi: shtativ, to'r, gorelka ----------
    const work = new T.Group(); work.position.set(0.15, BENCH_Y, 0.05); scene.add(work);
    const tripod = new T.Group(); work.add(tripod);
    const ring = new T.Mesh(new T.TorusGeometry(0.075, 0.006, 8, 40), metalM); ring.rotation.x = Math.PI / 2; ring.position.y = 0.2; tripod.add(ring);
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; const l = new T.Mesh(new T.CylinderGeometry(0.005, 0.005, 0.21, 8), metalM); l.position.set(Math.cos(a) * 0.08, 0.1, Math.sin(a) * 0.08); l.rotation.z = Math.cos(a) * 0.08; l.rotation.x = -Math.sin(a) * 0.08; l.castShadow = true; tripod.add(l); }
    const gauzeT = tex(cnv(128, 128, (x, w, h) => { x.clearRect(0, 0, w, h); x.strokeStyle = "#6c7075"; x.lineWidth = 1.2; for (let i = 0; i < w; i += 6) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); } x.fillStyle = "rgba(230,230,225,.95)"; x.beginPath(); x.arc(64, 64, 30, 0, 7); x.fill(); }));
    const gauze = new T.Mesh(new T.BoxGeometry(0.16, 0.003, 0.16), new T.MeshStandardMaterial({ map: gauzeT, transparent: true, alphaTest: 0.1, roughness: 0.8, metalness: 0.3 })); gauze.position.y = 0.206; tripod.add(gauze);
    // Gaz gorelkasi (Bunzen)
    const burner = new T.Group(); work.add(burner);
    const bbase = new T.Mesh(new T.CylinderGeometry(0.045, 0.05, 0.015, 24), new T.MeshStandardMaterial({ color: 0x23262b, roughness: 0.4, metalness: 0.5 })); bbase.position.y = 0.0075; bbase.castShadow = true; burner.add(bbase);
    const btube = new T.Mesh(new T.CylinderGeometry(0.011, 0.012, 0.12, 16), metalM); btube.position.y = 0.075; btube.castShadow = true; burner.add(btube);
    const hose = new T.Mesh(new T.TorusGeometry(0.15, 0.006, 6, 20, Math.PI / 1.4), new T.MeshStandardMaterial({ color: 0xc45a1a, roughness: 0.6 })); hose.position.set(0.14, 0.01, 0); hose.rotation.x = Math.PI / 2; burner.add(hose);
    // Olov (ikki qatlam, qo'shiluvchi aralashtirish)
    const flameGroup = new T.Group(); flameGroup.position.y = 0.135; flameGroup.visible = false; burner.add(flameGroup);
    const fOuter = new T.Mesh(new T.ConeGeometry(0.016, 0.075, 20, 1, true), new T.MeshBasicMaterial({ color: 0x6aa8ff, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
    fOuter.position.y = 0.0375; flameGroup.add(fOuter);
    const fInner = new T.Mesh(new T.ConeGeometry(0.009, 0.035, 16, 1, true), new T.MeshBasicMaterial({ color: 0x1a4cff, transparent: true, opacity: 0.8, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
    fInner.position.y = 0.0175; flameGroup.add(fInner);
    const flameLight = new T.PointLight(0x7ab0ff, 0, 0.8, 2); flameLight.position.y = 0.05; flameGroup.add(flameLight);

    // ---------- Idishlar ----------
    // profil: [r, y] tashqi; ichki — qalinlik ayirilgan; level uchun ichki profil kerak
    const VES = {
      stakan: { name: "Kimyoviy stakan", out: [[0, 0], [0.04, 0], [0.042, 0.003], [0.042, 0.12], [0.046, 0.124]], h: 0.12, onRing: true },
      kolba: { name: "Konussimon kolba", out: [[0, 0], [0.055, 0], [0.057, 0.004], [0.018, 0.11], [0.018, 0.16], [0.022, 0.165]], h: 0.155, onRing: true },
      probirka: { name: "Probirka", out: [[0, 0], [0.006, 0.0012], [0.0105, 0.006], [0.012, 0.014], [0.012, 0.16], [0.014, 0.163]], h: 0.158, holder: true },
      silindr: { name: "O‘lchov silindri", out: [[0, 0], [0.026, 0], [0.026, 0.26], [0.03, 0.264]], h: 0.258, onBench: true },
      kristallizator: { name: "Kristallizator", out: [[0, 0], [0.085, 0], [0.087, 0.004], [0.087, 0.07], [0.09, 0.072]], h: 0.068, onBench: true },
      tigel: { name: "Chinni tigel", out: [[0, 0], [0.018, 0], [0.026, 0.035], [0.028, 0.038]], h: 0.036, onRing: true, porcelain: true },
      chinni: { name: "Chinni kosacha", out: [[0, 0.004], [0.025, 0], [0.045, 0.012], [0.052, 0.026], [0.054, 0.028]], h: 0.026, onRing: true, porcelain: true }
    };
    const inner = (pts, t) => pts.map(([r, y], i) => [Math.max(0, r - t), i === 0 ? y + t : y]);
    let vtype = "stakan", vessel = null, vInfo = null, liquid = null, liqTop = null, pptLayer = null, mirrorMesh = null, holder = null;
    const vesselGroup = new T.Group(); work.add(vesselGroup);
    const liqMat = new T.MeshStandardMaterial({ color: 0x9fd0ea, roughness: 0.05, transparent: true, opacity: 0.5, depthWrite: false, envMapIntensity: 1.5 });
    const liqTopMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.02, metalness: 0.1, transparent: true, opacity: 0.45, depthWrite: false, envMapIntensity: 2 });
    let LS = { level: 0, color: 0x9fd0ea, opacity: 0.5, cloud: 0, cloudColor: 0xffffff };
    function radiusAt(pts, y) {
      for (let i = 1; i < pts.length; i++) { const [r0, y0] = pts[i - 1], [r1, y1] = pts[i]; if (y >= y0 && y <= y1) return y1 === y0 ? r1 : r0 + ((r1 - r0) * (y - y0)) / (y1 - y0); }
      return pts[pts.length - 1][0];
    }
    function buildVessel(type) {
      vtype = type; vInfo = VES[type] || VES.stakan;
      vesselGroup.clear(); vesselGroup.position.set(0, 0, 0);
      const pts = vInfo.out.map(([r, y]) => new T.Vector2(r, y));
      const mat = vInfo.porcelain ? new T.MeshStandardMaterial({ color: 0xf6f6f2, roughness: 0.25 }) : glassMat();
      vessel = new T.Mesh(new T.LatheGeometry(pts, 48), mat); vessel.renderOrder = 4; vessel.castShadow = !!vInfo.porcelain; vesselGroup.add(vessel);
      // shkala chiziqlari
      if (!vInfo.porcelain && type !== "probirka") {
        const scaleT = tex(cnv(64, 256, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 10; i++) { const y = h - 20 - i * 22; x.fillRect(0, y, i % 2 ? 14 : 26, 2); if (i % 2 === 0 && i) { x.font = "12px Arial"; x.fillText(i * 10, 30, y + 5); } } }));
        const rMid = radiusAt(vInfo.out, vInfo.h * 0.5);
        const sc = new T.Mesh(new T.CylinderGeometry(rMid + 0.0005, rMid + 0.0005, vInfo.h * 0.8, 24, 1, true, -0.25, 0.5), new T.MeshBasicMaterial({ map: scaleT, transparent: true, depthWrite: false }));
        sc.position.y = vInfo.h * 0.45; vesselGroup.add(sc);
      }
      const baseY = vInfo.onRing ? 0.208 : vInfo.holder ? 0.11 : 0.0;
      vesselGroup.position.y = baseY;
      vesselGroup.position.x = vInfo.onBench ? -0.28 : 0;
      tripod.visible = !!vInfo.onRing || !!vInfo.holder;
      ring.visible = gauze.visible = !!vInfo.onRing;
      // Probirka ushlagich (shtativ qisqichi)
      if (holder) { work.remove(holder); holder = null; }
      if (vInfo.holder) {
        holder = new T.Group(); work.add(holder);
        const rod = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 0.5, 10), metalM); rod.position.set(-0.16, 0.25, -0.05); holder.add(rod);
        const bs = new T.Mesh(new T.BoxGeometry(0.16, 0.012, 0.1), new T.MeshStandardMaterial({ color: 0x23262b, roughness: 0.4 })); bs.position.set(-0.16, 0.006, -0.05); holder.add(bs);
        const arm = new T.Mesh(new T.CylinderGeometry(0.004, 0.004, 0.16, 8), metalM); arm.rotation.z = Math.PI / 2; arm.position.set(-0.08, 0.24, -0.02); holder.add(arm);
        const clamp = new T.Mesh(new T.TorusGeometry(0.016, 0.004, 6, 16), metalM); clamp.rotation.x = Math.PI / 2; clamp.position.set(0, 0.24, 0); holder.add(clamp);
        ring.visible = gauze.visible = false;
      }
      const ip = inner(vInfo.out, vInfo.porcelain ? 0.003 : 0.0015);
      vInfo.inner = ip;
      liquid = new T.Mesh(new T.BufferGeometry(), liqMat); liquid.renderOrder = 2; vesselGroup.add(liquid);
      liqTop = new T.Mesh(new T.CircleGeometry(1, 40), liqTopMat); liqTop.rotation.x = -Math.PI / 2; liqTop.renderOrder = 3; vesselGroup.add(liqTop);
      pptLayer = new T.Mesh(new T.CylinderGeometry(1, 1, 1, 32), new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })); pptLayer.visible = false; vesselGroup.add(pptLayer);
      mirrorMesh = null;
      thermo.position.set(radiusAt(ip, vInfo.h * 0.6) * 0.45, 0, 0.0);
      thermo.visible = !vInfo.porcelain && type !== "probirka";
      vesselGroup.add(thermo);
      applyLiquid();
      clearFx();
    }
    // Termometr
    const thermo = new T.Group();
    {
      const g = new T.Mesh(new T.CylinderGeometry(0.0032, 0.0032, 0.17, 10), glassMat()); g.position.y = 0.095; thermo.add(g);
      const bulb = new T.Mesh(new T.SphereGeometry(0.005, 12, 8), new T.MeshStandardMaterial({ color: 0xd8262b, roughness: 0.2 })); bulb.position.y = 0.012; thermo.add(bulb);
      const col = new T.Mesh(new T.CylinderGeometry(0.0013, 0.0013, 1, 6), new T.MeshStandardMaterial({ color: 0xd8262b, emissive: 0x400000 })); col.name = "col"; thermo.add(col);
      thermo.rotation.z = -0.18;
    }
    let tempNow = 22, tempGoal = 22;
    function setThermo(t) { const c = thermo.getObjectByName("col"); const L = 0.015 + Math.min(1, Math.max(0, (t + 10) / 110)) * 0.14; c.scale.y = L; c.position.y = 0.012 + L / 2; }
    function applyLiquid() {
      if (!vInfo) return;
      const h = Math.max(0, Math.min(0.97, LS.level)) * vInfo.h;
      const ip = vInfo.inner;
      if (h < 0.001) { liquid.visible = liqTop.visible = false; return; }
      liquid.visible = liqTop.visible = true;
      const pts = [];
      const y0 = ip[0][1];
      ip.forEach(([r, y]) => { if (y <= h) pts.push(new T.Vector2(r, Math.max(y, y0))); });
      pts.push(new T.Vector2(radiusAt(ip, h), h));
      liquid.geometry.dispose(); liquid.geometry = new T.LatheGeometry(pts, 40);
      const rTop = radiusAt(ip, h);
      liqTop.scale.set(rTop, rTop, 1); liqTop.position.y = h;
      const c = new T.Color(LS.color).lerp(new T.Color(LS.cloudColor), LS.cloud);
      liqMat.color.copy(c); liqMat.opacity = Math.min(0.97, LS.opacity + LS.cloud * 0.6);
      liqTopMat.color.copy(c).lerp(new T.Color(0xffffff), 0.35); liqTopMat.opacity = Math.min(0.9, liqMat.opacity + 0.1);
      liqMat.roughness = LS.cloud > 0.4 ? 0.5 : 0.05;
    }
    this.setLiquid = (o) => { Object.assign(LS, o); applyLiquid(); };
    this.setVessel = (t) => buildVessel(t);
    const liquidTopY = () => vesselGroup.position.y + Math.max(0.004, LS.level * vInfo.h);
    const liquidR = () => radiusAt(vInfo.inner, Math.max(0.005, LS.level * vInfo.h * 0.5));
    // Cho'kma qatlami
    let pptAmt = 0, pptCol = 0xffffff;
    this.setPpt = (amount, color) => {
      pptAmt = amount; if (color != null) pptCol = color;
      if (!pptLayer) return;
      if (amount <= 0) { pptLayer.visible = false; return; }
      const r = radiusAt(vInfo.inner, 0.006) * 0.98, h = Math.min(vInfo.h * 0.25, 0.002 + amount * 0.004);
      pptLayer.visible = true; pptLayer.scale.set(r, h, r); pptLayer.position.y = vInfo.inner[0][1] + h / 2; pptLayer.material.color.set(pptCol);
    };

    // ---------- Zarrachalar ----------
    const dummy = new T.Object3D();
    function pool(n, geo, mat) { const m = new T.InstancedMesh(geo, mat, n); m.count = 0; m.frustumCulled = false; m.instanceMatrix.setUsage(T.DynamicDrawUsage); vesselGroup.parent.add(m); return { m, items: [] }; }
    const bubbleP = pool(220, new T.SphereGeometry(1, 10, 8), new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.55, envMapIntensity: 2.5, depthWrite: false }));
    const pptP = pool(260, new T.IcosahedronGeometry(1, 0), new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }));
    const foamP = pool(mobile ? 450 : 800, new T.SphereGeometry(1, 10, 8), new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));
    const dropP = pool(80, new T.SphereGeometry(1, 8, 6), new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.85 }));
    const crysP = pool(160, new T.OctahedronGeometry(1, 0), new T.MeshStandardMaterial({ color: 0xe8ecef, roughness: 0.15, metalness: 0.9 }));
    // Tutun / bug' (spritelar)
    const smokeT = new T.CanvasTexture(cnv(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); }));
    const smokes = [];
    function spawnSmoke(color, x, y, z, size = 0.04, life = 2.5, vy = 0.05) {
      if (smokes.length > 90) return;
      const s = new T.Sprite(new T.SpriteMaterial({ map: smokeT, color, transparent: true, depthWrite: false, opacity: 0 }));
      s.position.set(x, y, z); s.scale.setScalar(size); work.add(s);
      smokes.push({ s, t: 0, life, vy, grow: size * 2.5, op: color === 0xffffff ? 0.5 : 0.7 });
    }
    // Yorqin chaqnash
    const flashLight = new T.PointLight(0xffffff, 0, 3, 1.5); work.add(flashLight);
    const flashSprite = new T.Sprite(new T.SpriteMaterial({ map: smokeT, color: 0xffffff, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0 })); flashSprite.scale.setScalar(0.4); work.add(flashSprite);
    const glowLight = new T.PointLight(0xff6a1a, 0, 1.2, 2); work.add(glowLight);

    const FX = { bubble: 0, bubbleT: 0, bubbleCol: 0xffffff, foam: 0, foamLeft: 0, smoke: 0, smokeCol: 0xffffff, steam: 0, flash: 0, glow: 0, glowCol: 0xff6a1a, sodium: null, crystals: 0, crysCol: 0xe8ecef, snake: null, heat: false, flameCol: null };
    function clearFx() {
      [bubbleP, pptP, foamP, dropP, crysP].forEach((p) => { p.items = []; p.m.count = 0; });
      smokes.forEach((o) => work.remove(o.s)); smokes.length = 0;
      FX.bubble = FX.foamLeft = FX.smoke = FX.steam = FX.flash = FX.glow = FX.crystals = 0; FX.sodium = null;
      if (FX.snake) { work.remove(FX.snake); FX.snake = null; }
      metals.forEach((m) => vesselGroup.remove(m.g)); metals.length = 0;
      if (mirrorMesh) { vesselGroup.remove(mirrorMesh); mirrorMesh = null; }
      if (pptLayer) pptLayer.visible = false;
    }
    this.clearAll = () => { LS.level = 0; LS.cloud = 0; applyLiquid(); clearFx(); tempGoal = 22; };

    // ---------- Metall bo'laklari ----------
    const metals = [];
    function makeMetal(shape, color) {
      const mm = new T.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.9, envMapIntensity: 1.6 });
      const g = new T.Group();
      const r = liquidR() * 0.6 || 0.01;
      if (shape === "nail") { const b = new T.Mesh(new T.CylinderGeometry(0.0022, 0.0022, Math.min(0.09, vInfo.h * 0.9), 10), mm); b.position.y = Math.min(0.045, vInfo.h * 0.45); b.rotation.z = 0.25; g.add(b); const hd = new T.Mesh(new T.CylinderGeometry(0.005, 0.005, 0.002, 14), mm); hd.position.set(-0.011, Math.min(0.088, vInfo.h * 0.88), 0); hd.rotation.z = 0.25; g.add(hd); }
      else if (shape === "wire") { const curve = new T.CatmullRomCurve3(Array.from({ length: 30 }, (_, i) => new T.Vector3(Math.cos(i * 0.9) * r * 0.6, 0.004 + i * (vInfo.h * 0.8) / 30, Math.sin(i * 0.9) * r * 0.6))); g.add(new T.Mesh(new T.TubeGeometry(curve, 80, 0.0012, 6), mm)); }
      else if (shape === "ribbon") { const b = new T.Mesh(new T.BoxGeometry(0.004, Math.min(0.06, vInfo.h * 0.8), 0.0004), mm); b.position.y = Math.min(0.03, vInfo.h * 0.4); b.rotation.z = 0.5; g.add(b); }
      else if (shape === "foil") { for (let i = 0; i < 3; i++) { const b = new T.Mesh(new T.IcosahedronGeometry(0.006, 0), mm); b.position.set(rand(-r, r) * 0.5, 0.006, rand(-r, r) * 0.5); b.scale.set(1, 0.6, 1); g.add(b); } }
      else if (shape === "chunk") { const b = new T.Mesh(new T.BoxGeometry(0.006, 0.004, 0.005), mm); b.position.y = 0.003; g.add(b); g.userData.float = true; }
      else { for (let i = 0; i < 5; i++) { const b = new T.Mesh(new T.DodecahedronGeometry(0.0035, 0), mm); b.position.set(rand(-r, r) * 0.6, vInfo.inner[0][1] + 0.003, rand(-r, r) * 0.6); g.add(b); } }
      g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      g.userData.mat = mm; g.userData.shape = shape; g.userData.scale = 1;
      return g;
    }
    this.addMetal = (shape, color) => { const g = makeMetal(shape, color); g.position.y = vInfo.inner[0][1]; vesselGroup.add(g); metals.push({ g, shape }); return g; };
    this.coatMetal = (color, dur = 6) => { metals.forEach((m) => { m.coatTo = new T.Color(color); m.coatT = 0; m.coatDur = dur; }); };
    this.shrinkMetal = (dur = 8) => { metals.forEach((m) => { m.shrinkT = 0; m.shrinkDur = dur; }); };
    this.removeMetal = () => { metals.forEach((m) => vesselGroup.remove(m.g)); metals.length = 0; };

    // ---------- Effektlar ----------
    this.bubbles = (rate = 1, dur = 6, color = 0xffffff) => { FX.bubble = rate; FX.bubbleT = dur; FX.bubbleCol = color; };
    this.foam = (amount = 1, color = 0xffffff) => { FX.foamLeft = Math.min(foamP.m.instanceMatrix.count, Math.round(amount * 220)); foamP.m.material.color.set(color); };
    this.smoke = (color = 0xdddddd, dur = 4) => { FX.smoke = dur; FX.smokeCol = color; };
    this.steam = (dur = 5) => { FX.steam = dur; };
    this.flash = (color = 0xffffff, dur = 2.5) => { FX.flash = dur; flashLight.color.set(color); flashSprite.material.color.set(color); };
    this.glow = (color = 0xff6a1a, dur = 4) => { FX.glow = dur; FX.glowCol = color; glowLight.color.set(color); };
    this.sodium = (color = 0xffa21a, dur = 6) => { FX.sodium = { t: 0, dur, color, x: 0, z: 0, a: rand(0, 6.28) }; };
    this.crystals = (color = 0xe8ecef) => { FX.crystals = 140; crysP.m.material.color.set(color); };
    this.precipitate = (color, amount = 1) => {
      pptP.m.material.color.set(color);
      const r = liquidR(), top = liquidTopY();
      for (let i = 0; i < 120 * amount && pptP.items.length < 260; i++) { const a = rand(0, 6.28), rr = Math.sqrt(Math.random()) * r * 0.9; pptP.items.push({ x: Math.cos(a) * rr, y: rand(vInfo.inner[0][1] + 0.003, Math.max(0.006, LS.level * vInfo.h - 0.002)), z: Math.sin(a) * rr, vy: -rand(0.002, 0.006), s: rand(0.0016, 0.0032), rot: rand(0, 6) }); }
    };
    this.mirror = () => {
      if (mirrorMesh) return;
      const pts = vInfo.inner.map(([r, y]) => new T.Vector2(Math.max(0, r - 0.0004), y));
      mirrorMesh = new T.Mesh(new T.LatheGeometry(pts, 48), new T.MeshStandardMaterial({ color: 0xdfe5ea, metalness: 1, roughness: 0.05, transparent: true, opacity: 0, side: T.DoubleSide, envMapIntensity: 2.5 }));
      mirrorMesh.renderOrder = 3; vesselGroup.add(mirrorMesh);
    };
    this.snake = () => {
      if (FX.snake) return;
      const g = new T.Group(); g.position.copy(vesselGroup.position); g.userData.t = 0; work.add(g);
      const m = new T.MeshStandardMaterial({ color: 0x0f0f10, roughness: 0.95 });
      for (let i = 0; i < 26; i++) { const b = new T.Mesh(new T.IcosahedronGeometry(0.024, 1), m); b.position.set(rand(-0.004, 0.004), i * 0.009, rand(-0.004, 0.004)); b.scale.set(1, 0.7, 1); b.visible = false; b.castShadow = true; g.add(b); }
      FX.snake = g;
    };
    this.heat = (on) => { FX.heat = !!on; flameGroup.visible = FX.heat || FX.flameCol != null; };
    this.flameColor = (c) => {
      FX.flameCol = c;
      fOuter.material.color.set(c != null ? c : 0x6aa8ff); fOuter.material.opacity = c != null ? 0.85 : 0.55;
      fOuter.scale.set(c != null ? 1.4 : 1, c != null ? 1.5 : 1, c != null ? 1.4 : 1);
      flameLight.color.set(c != null ? c : 0x7ab0ff);
      flameGroup.visible = FX.heat || c != null;
    };
    this.setTemp = (t) => { tempGoal = t; };

    // Cho'p (yonayotgan yoki cho'g'langan) sinovi
    let splintG = null;
    this.splint = (kind, result) => new Promise((res) => {
      if (splintG) work.remove(splintG);
      splintG = new T.Group(); work.add(splintG);
      const stick = new T.Mesh(new T.CylinderGeometry(0.0018, 0.0018, 0.16, 8), new T.MeshStandardMaterial({ color: 0xd9b88a, roughness: 0.8 }));
      stick.rotation.z = Math.PI / 2.6; splintG.add(stick);
      const tip = new T.Sprite(new T.SpriteMaterial({ map: smokeT, color: kind === "ember" ? 0xff5a1a : 0xffb030, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
      tip.position.set(-0.07, -0.03, 0); tip.scale.setScalar(kind === "ember" ? 0.012 : 0.03); splintG.add(tip);
      const topY = vesselGroup.position.y + vInfo.h + 0.01;
      splintG.position.set(0.2, topY + 0.12, 0);
      const t0 = performance.now();
      const step = () => {
        const t = (performance.now() - t0) / 1000;
        const k = Math.min(1, t / 1.2);
        splintG.position.set(0.2 - 0.13 * k, topY + 0.12 - 0.08 * k, 0);
        tip.scale.setScalar((kind === "ember" ? 0.012 : 0.03) * (1 + Math.sin(t * 30) * 0.1));
        if (t > 1.2 && !splintG.userData.done) {
          splintG.userData.done = true;
          if (result === "pop") { this.flash(0xffd08a, 0.6); tip.material.opacity = 0; }
          else if (result === "relight") { tip.material.color.set(0xffc040); tip.scale.setScalar(0.05); }
          else if (result === "out") { tip.material.opacity = 0; spawnSmoke(0xbbbbbb, splintG.position.x - 0.07, splintG.position.y - 0.03, 0, 0.02, 2); }
        }
        if (t < 3.2) requestAnimationFrame(step); else { work.remove(splintG); splintG = null; res(); }
      };
      step();
    });
    // Somoncha bilan puflash
    this.straw = () => new Promise((res) => {
      const st = new T.Mesh(new T.CylinderGeometry(0.003, 0.003, 0.2, 10), new T.MeshStandardMaterial({ color: 0xff5a7a, roughness: 0.4 }));
      st.position.set(0.006, vesselGroup.position.y + 0.1, 0); st.rotation.z = 0.12; work.add(st);
      this.bubbles(1.5, 3);
      setTimeout(() => { work.remove(st); res(); }, 3000);
    });
    // Alanga sinovi: sim halqa
    this.flameTest = (color) => new Promise((res) => {
      this.view("flame");
      const loop = new T.Group(); work.add(loop);
      const w = new T.Mesh(new T.CylinderGeometry(0.0008, 0.0008, 0.15, 6), metalM); w.rotation.z = Math.PI / 2.2; loop.add(w);
      const l = new T.Mesh(new T.TorusGeometry(0.004, 0.0008, 6, 14), metalM); l.position.set(-0.072, -0.016, 0); loop.add(l);
      const bx = burner.position.x;
      loop.position.set(bx + 0.13, 0.2, 0);
      const was = FX.heat;
      this.heat(true);
      const t0 = performance.now();
      const step = () => {
        const t = (performance.now() - t0) / 1000;
        const k = Math.min(1, t / 1.0);
        loop.position.set(bx + 0.13 - 0.06 * k, 0.2 - 0.02 * k, 0);
        if (t > 1.0 && t < 4.8) this.flameColor(color); else if (t >= 4.8) this.flameColor(null);
        if (t < 5.3) requestAnimationFrame(step); else { work.remove(loop); this.heat(was); res(); }
      };
      step();
    });

    // ---------- Quyish animatsiyasi ----------
    const pourG = new T.Group(); pourG.visible = false; work.add(pourG);
    const pBottle = new T.Group(); pourG.add(pBottle);
    const pbm = new T.MeshStandardMaterial({ color: 0xe8f1f4, roughness: 0.04, transparent: true, opacity: 0.4, envMapIntensity: 1.8 });
    { const b = new T.Mesh(new T.CylinderGeometry(0.03, 0.032, 0.1, 24), pbm); b.position.y = 0.05; pBottle.add(b); const n = new T.Mesh(new T.CylinderGeometry(0.01, 0.022, 0.03, 16), pbm); n.position.y = 0.115; pBottle.add(n); }
    const pLiq = new T.Mesh(new T.CylinderGeometry(0.027, 0.029, 0.06, 24), new T.MeshStandardMaterial({ color: 0xdcecf4, transparent: true, opacity: 0.7, roughness: 0.1 })); pLiq.position.y = 0.033; pBottle.add(pLiq);
    const stream = new T.Mesh(new T.CylinderGeometry(0.0025, 0.0018, 1, 10), new T.MeshStandardMaterial({ color: 0xdcecf4, transparent: true, opacity: 0.7, roughness: 0.05 })); stream.visible = false; work.add(stream);
    const spoon = new T.Group(); spoon.visible = false; work.add(spoon);
    { const h = new T.Mesh(new T.BoxGeometry(0.15, 0.002, 0.008), metalM); h.position.x = 0.07; spoon.add(h); const s = new T.Mesh(new T.SphereGeometry(0.01, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), metalM); spoon.add(s); }
    const pipette = new T.Group(); pipette.visible = false; work.add(pipette);
    { const g = new T.Mesh(new T.CylinderGeometry(0.003, 0.0015, 0.08, 10), glassMat()); g.position.y = 0.04; pipette.add(g); const bulb = new T.Mesh(new T.SphereGeometry(0.008, 12, 10), new T.MeshStandardMaterial({ color: 0x1d1d1d, roughness: 0.6 })); bulb.position.y = 0.088; bulb.scale.y = 1.4; pipette.add(bulb); }
    let pouring = null;
    this.pour = (kind, color, o = {}) => new Promise((res) => {
      const top = vesselGroup.position.y + vInfo.h, vx = vesselGroup.position.x;
      const c = color != null ? color : 0xdcecf4;
      pouring = { kind, t: 0, start: performance.now(), dur: kind === "liquid" ? 2.2 : kind === "metal" ? 1.6 : 1.8, res, c, top, vx, from: LS.level, to: o.toLevel, shape: o.shape, metalColor: o.metalColor, opaque: o.opaque };
      if (kind === "liquid") { pourG.visible = true; pLiq.material.color.set(c); pLiq.material.opacity = o.opaque ? 0.98 : 0.75; stream.material.color.set(c); stream.material.opacity = o.opaque ? 0.98 : 0.7; }
      if (kind === "solid") { spoon.visible = true; pptP.m.material.color.set(c); }
      if (kind === "indicator") { pipette.visible = true; dropP.m.material.color.set(c); }
    });
    function stepPour(dt) {
      const p = pouring; if (!p) return;
      // haqiqiy vaqt bo'yicha — sekin qurilmalarda ham animatsiya o'z vaqtida tugaydi
      p.t = (performance.now() - p.start) / 1000;
      const k = p.t / p.dur;
      if (p.kind === "liquid") {
        const tilt = Math.min(1, k * 3) * (k > 0.85 ? (1 - k) / 0.15 : 1);
        pourG.position.set(p.vx + 0.09, p.top + 0.05, 0);
        pBottle.rotation.z = tilt * 1.9;
        const mouth = new T.Vector3(0, 0.13, 0).applyEuler(pBottle.rotation).add(pourG.position);
        const sY = liquidTopY();
        if (k > 0.2 && k < 0.88) {
          stream.visible = true;
          const len = Math.max(0.01, mouth.y - sY);
          stream.scale.set(1, len, 1); stream.position.set(mouth.x - 0.003, sY + len / 2, mouth.z);
          if (p.to != null) { LS.level = p.from + (p.to - p.from) * Math.min(1, (k - 0.2) / 0.68); applyLiquid(); }
          if (Math.random() < 0.5) bubbleP.items.length < 200 && bubbleP.items.push(newBubble(mouth.x - p.vx - 0.003, sY - vesselGroup.position.y - 0.005, mouth.z, 0.0012));
        } else stream.visible = false;
      } else if (p.kind === "solid") {
        spoon.position.set(p.vx + 0.02, p.top + 0.03, 0);
        spoon.rotation.x = Math.min(1, k * 2.5) * 1.6 * (k > 0.8 ? (1 - k) / 0.2 : 1);
        if (k > 0.3 && k < 0.8 && Math.random() < 0.8 && pptP.items.length < 260) pptP.items.push({ x: rand(-0.008, 0.008), y: p.top - vesselGroup.position.y + 0.02, z: rand(-0.008, 0.008), vy: -0.08, s: rand(0.0009, 0.0016), rot: rand(0, 6), dissolve: true });
      } else if (p.kind === "indicator") {
        pipette.position.set(p.vx + 0.005, p.top + 0.04, 0);
        if (k > 0.3 && Math.floor(p.t * 3) !== p.lastDrop && dropP.items.length < 60) { p.lastDrop = Math.floor(p.t * 3); dropP.items.push({ x: 0.005, y: p.top - vesselGroup.position.y + 0.035, z: 0, vy: 0 }); }
      } else if (p.kind === "metal") {
        if (!p.obj) { p.obj = makeMetal(p.shape, p.metalColor); vesselGroup.add(p.obj); metals.push({ g: p.obj, shape: p.shape }); }
        const y0 = vInfo.h + 0.06, y1 = vInfo.inner[0][1];
        p.obj.position.y = y0 + (y1 - y0) * Math.min(1, k * k * 1.6);
        if (k > 0.62 && !p.splash) { p.splash = true; for (let i = 0; i < 14; i++) bubbleP.items.length < 200 && bubbleP.items.push(newBubble(rand(-0.01, 0.01), rand(0.004, 0.02), rand(-0.01, 0.01), 0.0014)); }
      }
      if (p.t >= p.dur) { pourG.visible = stream.visible = spoon.visible = pipette.visible = false; pouring = null; if (p.to != null) { LS.level = p.to; applyLiquid(); } p.res(); }
    }
    const newBubble = (x, y, z, s) => ({ x, y, z, s: s || rand(0.0008, 0.0022), vy: rand(0.02, 0.05), w: rand(0, 6) });

    // ---------- Kamera ----------
    const cam = { theta: 0.35, phi: 1.22, r: 0.75, target: new T.Vector3(0.15, BENCH_Y + 0.22, 0.05) };
    let goal = null;
    const VIEWS = {
      close: { theta: 0.3, phi: 1.25, r: 0.62, y: 0.2 },
      flame: { theta: 0.55, phi: 1.32, r: 0.55, y: 0.14 },
      room: { theta: 0.55, phi: 1.12, r: 3.6, y: 0.4 },
      poster: { theta: -1.45, phi: 1.5, r: 2.4, y: 1.2, tx: -2.4, tz: -0.2 }
    };
    this.view = (name) => { const v = VIEWS[name] || VIEWS.close; goal = { ...v, tx: v.tx != null ? v.tx : 0.15 + (vInfo && vInfo.onBench ? -0.28 : 0), tz: v.tz != null ? v.tz : 0.05 }; };
    function applyCam() {
      const { theta, phi, r, target } = cam;
      camera.position.set(target.x + r * Math.sin(phi) * Math.sin(theta), target.y + r * Math.cos(phi), target.z + r * Math.sin(phi) * Math.cos(theta));
      camera.lookAt(target);
    }
    const el = renderer.domElement, pointers = new Map(); let drag = null, pinch = null;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", (e) => { el.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), r: cam.r }; drag = null; } else drag = { x: e.clientX, y: e.clientY, th: cam.theta, ph: cam.phi, moved: false }; });
    el.addEventListener("pointermove", (e) => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pointers.size === 2) { const [a, b] = [...pointers.values()]; cam.r = Math.max(0.25, Math.min(5, (pinch.r * pinch.d) / Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)))); goal = null; return; }
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 6) drag.moved = true;
      if (drag.moved) { cam.theta = drag.th - dx * 0.005; cam.phi = Math.max(0.35, Math.min(1.55, drag.ph - dy * 0.004)); goal = null; }
    });
    const ray = new T.Raycaster(), ndc = new T.Vector2();
    el.addEventListener("pointerup", (e) => {
      pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null;
      if (drag && !drag.moved && opts.onPick) {
        const r = el.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects([poster, bottles, hood], true)[0];
        if (hit) { let o = hit.object; while (o && !o.userData.pick && o.parent) o = o.parent; opts.onPick(hit.object === poster ? "jadval" : bottles.children.includes(hit.object.parent) || hit.object.parent === bottles ? "javon" : "boshqa"); }
      }
      if (pointers.size === 0) drag = null;
    });
    el.addEventListener("pointercancel", (e) => { pointers.delete(e.pointerId); drag = null; pinch = null; });
    el.addEventListener("wheel", (e) => { e.preventDefault(); cam.r = Math.max(0.25, Math.min(5, cam.r * (1 + Math.sign(e.deltaY) * 0.08))); goal = null; }, { passive: false });

    function resize() { const w = container.clientWidth, h = container.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 0.8 ? 58 : 42; camera.updateProjectionMatrix(); }
    const ro = new ResizeObserver(resize); ro.observe(container); resize();

    // ---------- Sikl ----------
    const clock = new T.Clock(); let raf = 0, alive = true;
    function setInst(p, fn) {
      let n = 0;
      for (let i = p.items.length - 1; i >= 0; i--) { const it = p.items[i]; if (fn(it) === false) { p.items.splice(i, 1); continue; } }
      p.items.forEach((it) => { dummy.position.set(it.wx, it.wy, it.wz); dummy.scale.setScalar(it.ws); dummy.rotation.set(it.rot || 0, it.rot || 0, 0); dummy.updateMatrix(); p.m.setMatrixAt(n++, dummy.matrix); });
      p.m.count = n; p.m.instanceMatrix.needsUpdate = true;
    }
    function loop() {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05), now = clock.elapsedTime;
      const vp = vesselGroup.position, wp = work.position;
      const top = LS.level * vInfo.h, r = liquidR();
      stepPour(dt);
      // pufakchalar
      if (FX.bubbleT > 0) { FX.bubbleT -= dt; const n = FX.bubble * 60 * dt; for (let i = 0; i < n + (Math.random() < n % 1 ? 1 : 0); i++) if (bubbleP.items.length < 210) { const mt = metals[0]; const a = rand(0, 6.28), rr = Math.sqrt(Math.random()) * r * 0.85; bubbleP.items.push(newBubble(mt ? rand(-0.008, 0.008) : Math.cos(a) * rr, vInfo.inner[0][1] + 0.002, mt ? rand(-0.008, 0.008) : Math.sin(a) * rr)); } }
      setInst(bubbleP, (b) => { b.y += b.vy * dt * (1 + FX.bubble * 0.4); b.w += dt * 8; b.x += Math.sin(b.w) * 0.0006 * dt * 60 * 0.02; if (b.y > top) return false; b.wx = vp.x + b.x ; b.wy = vp.y + b.y ; b.wz = vp.z + b.z ; b.ws = b.s; });
      // cho'kma zarralari
      setInst(pptP, (p) => {
        if (p.dissolve) { p.y += p.vy * dt; if (p.y < top) { p.s *= 0.93; if (p.s < 0.0003) return false; } }
        else { p.y = Math.max(vInfo.inner[0][1] + 0.002, p.y + p.vy * dt); p.rot += dt; }
        p.wx = vp.x + p.x ; p.wy = vp.y + p.y ; p.wz = vp.z + p.z ; p.ws = p.s;
      });
      // tomchilar
      setInst(dropP, (d) => { d.vy -= 9.8 * dt * 0.3; d.y += d.vy * dt; if (d.y < top) return false; d.wx = vp.x + d.x ; d.wy = vp.y + d.y ; d.wz = vp.z + d.z ; d.ws = 0.0025; });
      // ko'pik
      if (FX.foamLeft > 0) { const n = Math.min(FX.foamLeft, Math.ceil(dt * 160)); FX.foamLeft -= n; const rt = radiusAt(vInfo.inner, vInfo.h * 0.98); for (let i = 0; i < n; i++) foamP.items.push({ x: rand(-rt, rt) * 0.6, y: top, z: rand(-rt, rt) * 0.6, vy: rand(0.04, 0.09), vx: 0, vz: 0, s: rand(0.004, 0.009), out: false }); }
      setInst(foamP, (f) => {
        const H = vInfo.h + 0.004, rimR = radiusAt(vInfo.inner, vInfo.h);
        if (!f.out) { f.y += f.vy * dt; if (f.y > H) { f.out = true; const a = Math.atan2(f.z, f.x) || rand(0, 6.28); f.vx = Math.cos(a) * rand(0.01, 0.03); f.vz = Math.sin(a) * rand(0.01, 0.03); f.vy = rand(0.005, 0.03); } }
        else { f.vy -= 0.06 * dt; f.x += f.vx * dt; f.z += f.vz * dt; f.y += f.vy * dt; const d = Math.hypot(f.x, f.z); if (d < rimR + 0.006 && f.y < H) f.y = H; const floorY = -vp.y + 0.002 + f.s; if (f.y < floorY) { f.y = floorY; f.vx *= 0.9; f.vz *= 0.9; f.vy = 0; } }
        f.wx = vp.x + f.x ; f.wy = vp.y + f.y ; f.wz = vp.z + f.z ; f.ws = f.s;
      });
      // kristallar (mis sim atrofida)
      if (FX.crystals > 0 && Math.random() < 0.5) { FX.crystals--; const a = rand(0, 6.28), rr = rand(0.002, liquidR() * 0.6), y = rand(0.004, Math.max(0.006, top * 0.9)); crysP.items.push({ x: Math.cos(a) * rr, y, z: Math.sin(a) * rr, s: 0.0002, g: rand(0.0012, 0.0028), rot: rand(0, 6) }); }
      setInst(crysP, (c) => { if (c.s < c.g) c.s += dt * 0.0006; c.wx = vp.x + c.x ; c.wy = vp.y + c.y ; c.wz = vp.z + c.z ; c.ws = c.s; });
      // tutun va bug'
      if (FX.smoke > 0) { FX.smoke -= dt; if (Math.random() < 0.5) spawnSmoke(FX.smokeCol, vp.x + rand(-0.01, 0.01), vp.y + vInfo.h + 0.01, rand(-0.01, 0.01), 0.04, 3, 0.06); }
      if (FX.steam > 0 || (FX.heat && tempNow > 70 && LS.level > 0.02)) { FX.steam = Math.max(0, FX.steam - dt); if (Math.random() < 0.3) spawnSmoke(0xffffff, vp.x + rand(-0.01, 0.01), vp.y + vInfo.h, rand(-0.01, 0.01), 0.03, 2.5, 0.05); }
      for (let i = smokes.length - 1; i >= 0; i--) { const o = smokes[i]; o.t += dt; const k = o.t / o.life; o.s.position.y += o.vy * dt; o.s.position.x += Math.sin(now + i) * 0.003 * dt; o.s.scale.setScalar(0.03 + k * o.grow); o.s.material.opacity = Math.min(1, k * 4) * (1 - k) * o.op; if (k >= 1) { work.remove(o.s); smokes.splice(i, 1); } }
      // chaqnash
      if (FX.flash > 0) { FX.flash -= dt; const f = Math.max(0, Math.min(1, FX.flash)) * (0.8 + Math.random() * 0.4); flashLight.intensity = f * 6; flashLight.position.set(vp.x, vp.y + vInfo.h * 0.5, 0); flashSprite.position.copy(flashLight.position); flashSprite.material.opacity = f; flashSprite.scale.setScalar(0.25 + f * 0.25); }
      else { flashLight.intensity = 0; flashSprite.material.opacity = 0; }
      if (FX.glow > 0) { FX.glow -= dt; glowLight.intensity = Math.min(1, FX.glow) * (1.4 + Math.sin(now * 12) * 0.3); glowLight.position.set(vp.x, vp.y + 0.01, 0); } else glowLight.intensity = 0;
      // natriy sharchasi
      if (FX.sodium) {
        const s = FX.sodium; s.t += dt; s.a += rand(-2, 2) * dt * 3;
        const rr = liquidR() * 0.6;
        s.x = Math.max(-rr, Math.min(rr, s.x + Math.cos(s.a) * dt * 0.06)); s.z = Math.max(-rr, Math.min(rr, s.z + Math.sin(s.a) * dt * 0.06));
        metals.forEach((m) => { if (m.g.userData.float) { m.g.position.set(s.x, top + 0.001, s.z); m.g.scale.setScalar(Math.max(0.01, 1 - s.t / s.dur)); m.g.children[0].geometry = m.g.children[0].geometry.type === "SphereGeometry" ? m.g.children[0].geometry : new T.SphereGeometry(0.0035, 12, 10); } });
        if (Math.random() < 0.6) spawnSmoke(s.color, vp.x + s.x, vp.y + top + 0.004, s.z, 0.012, 0.5, 0.03);
        if (s.t > s.dur) { FX.sodium = null; metals.forEach((m) => { if (m.g.userData.float) vesselGroup.remove(m.g); }); }
      }
      // metall qoplanishi va erishi
      metals.forEach((m) => {
        if (m.coatTo) { m.coatT += dt; const k = Math.min(1, m.coatT / m.coatDur); m.g.userData.mat.color.lerp(m.coatTo, k * 0.05); m.g.userData.mat.roughness = 0.3 + k * 0.4; m.g.userData.mat.metalness = 0.9 - k * 0.4; if (k >= 1) m.coatTo = null; }
        if (m.shrinkDur) { m.shrinkT += dt; const k = Math.min(1, m.shrinkT / m.shrinkDur); m.g.scale.setScalar(Math.max(0.35, 1 - k * 0.65)); if (k >= 1) m.shrinkDur = 0; }
      });
      // ko'zgu
      if (mirrorMesh && mirrorMesh.material.opacity < 0.92) mirrorMesh.material.opacity += dt * 0.12;
      // shakar ilon
      if (FX.snake) { const g = FX.snake; g.userData.t += dt; g.children.forEach((b, i) => { b.visible = g.userData.t * 4 > i; }); if (g.userData.t < 7 && Math.random() < 0.4) spawnSmoke(0xeeeeee, vp.x + rand(-0.01, 0.01), vp.y + Math.min(0.24, g.userData.t * 0.035) + 0.03, 0, 0.04, 2.5, 0.07); }
      // olov tebranishi
      if (flameGroup.visible) { const f = 1 + Math.sin(now * 40) * 0.06 + Math.random() * 0.06; fOuter.scale.y = (FX.flameCol != null ? 1.5 : 1) * f; fInner.scale.y = f; flameLight.intensity = 0.7 + Math.random() * 0.2; }
      // harorat
      if (FX.heat && LS.level > 0.01) tempGoal = Math.max(tempGoal, Math.min(100, tempNow + 8));
      tempNow += (tempGoal - tempNow) * Math.min(1, dt * 0.8);
      if (!FX.heat && tempGoal > 22) tempGoal = Math.max(22, tempGoal - dt * 1.5);
      setThermo(tempNow);
      // kamera
      if (goal) { cam.theta += (goal.theta - cam.theta) * 0.07; cam.phi += (goal.phi - cam.phi) * 0.07; cam.r += (goal.r - cam.r) * 0.07; cam.target.x += (goal.tx - cam.target.x) * 0.07; cam.target.z += (goal.tz - cam.target.z) * 0.07; cam.target.y += (BENCH_Y + goal.y - cam.target.y) * 0.07; if (Math.abs(goal.r - cam.r) < 0.002) goal = null; }
      applyCam();
      renderer.render(scene, camera);
    }
    this.getTemp = () => tempNow;
    this._dbg = { scene, camera, T };
    this.vesselName = () => vInfo.name;
    buildVessel("stakan");
    this.view("close");
    raf = requestAnimationFrame(loop);
    this.destroy = () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); pmrem.dispose(); el.remove(); };
  }
  Lab3D.VESSELS = ["stakan", "kolba", "probirka", "silindr", "kristallizator", "tigel", "chinni"];
  Lab3D.VESSEL_NAMES = { stakan: "Stakan", kolba: "Kolba", probirka: "Probirka", silindr: "Silindr", kristallizator: "Kristallizator", tigel: "Tigel", chinni: "Chinni kosa" };

  // ---------- Atom modeli (element kartasi uchun alohida kichik sahna) ----------
  function Atom3D(container, el) {
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.outputEncoding = T.sRGBEncoding;
    container.appendChild(renderer.domElement);
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(40, 1, 0.1, 100);
    scene.add(new T.AmbientLight(0xffffff, 0.6)); const dl = new T.DirectionalLight(0xffffff, 1.2); dl.position.set(3, 4, 5); scene.add(dl);
    const nucleus = new T.Group(); scene.add(nucleus);
    const pm = new T.MeshStandardMaterial({ color: 0xe5484d, roughness: 0.35 }), nm = new T.MeshStandardMaterial({ color: 0x9aa3ad, roughness: 0.35 });
    const nN = Math.min(40, el.protons + el.neutrons), rN = 0.25 + Math.cbrt(nN) * 0.12;
    for (let i = 0; i < nN; i++) { const s = new T.Mesh(new T.SphereGeometry(0.12, 14, 10), i % 2 ? nm : pm); const v = new T.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize().multiplyScalar(Math.cbrt(Math.random()) * rN); s.position.copy(v); nucleus.add(s); }
    const shells = [], em = new T.MeshStandardMaterial({ color: 0x3fa9ff, emissive: 0x1a5aff, emissiveIntensity: 0.8, roughness: 0.2 });
    el.shells.forEach((n, i) => {
      const R = 0.9 + i * 0.55, g = new T.Group(); g.rotation.set(rand(-0.6, 0.6), rand(0, 6.28), rand(-0.3, 0.3)); scene.add(g);
      const orbit = new T.Mesh(new T.TorusGeometry(R, 0.008, 6, 80), new T.MeshBasicMaterial({ color: 0x9fb8d8, transparent: true, opacity: 0.45 })); orbit.rotation.x = Math.PI / 2; g.add(orbit);
      const shown = Math.min(n, 18);
      for (let k = 0; k < shown; k++) { const a = (k / shown) * Math.PI * 2; const e = new T.Mesh(new T.SphereGeometry(0.07, 12, 8), em); e.position.set(Math.cos(a) * R, 0, Math.sin(a) * R); g.add(e); }
      shells.push({ g, speed: 0.9 / (i + 1) + 0.2 });
    });
    const maxR = 0.9 + Math.max(0, el.shells.length - 1) * 0.55;
    camera.position.set(0, maxR * 0.7, maxR * 2.1 + 0.8); camera.lookAt(0, 0, 0);
    let raf = 0, alive = true;
    const fit = () => { const w = container.clientWidth, h = container.clientHeight; if (w && h) { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); } };
    const ro = new ResizeObserver(fit); ro.observe(container); fit();
    const clock = new T.Clock();
    (function loop() { if (!alive) return; raf = requestAnimationFrame(loop); const t = clock.getElapsedTime(); shells.forEach((s) => (s.g.children.forEach((c, i) => { if (i > 0) { const a = Math.atan2(c.position.z, c.position.x) + s.speed * 0.02; const R = Math.hypot(c.position.x, c.position.z); c.position.set(Math.cos(a) * R, 0, Math.sin(a) * R); } }))); nucleus.rotation.y = t * 0.4; renderer.render(scene, camera); })();
    this.destroy = () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); };
  }
  window.SofiLab3D = Lab3D;
  window.SofiAtom3D = Atom3D;
})();
