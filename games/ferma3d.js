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
  function std(color, rough = 0.85, extra = {}) { return new T.MeshStandardMaterial({ color, roughness: rough, ...extra }); }
  const MAT = {};
  function mats() {
    if (MAT.ready) return MAT;
    Object.assign(MAT, {
      ready: true,
      white: std(0xf7f3ea), brown: std(0x8a5a33), dark: std(0x2a211b), red: std(0xd62828, 0.6), orange: std(0xf59e0b, 0.5),
      yellow: std(0xe9b949, 0.6), pink: std(0xf2a7a0, 0.6), wool: std(0xf1ece0, 1), woolFace: std(0x2b2622), eye: std(0x050505, 0.2),
      horn: std(0xe8dcc2, 0.4), cow: new T.MeshStandardMaterial({ map: cowTex(), roughness: 0.8 }), horse: std(0x7b4a24, 0.55), horse2: std(0xc58a4c, 0.6),
      mane: std(0x1f140c, 0.9), hoof: std(0x2b2b2b, 0.6)
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
    mesh(new T.CylinderGeometry(r, r * 0.85, len, 8), mat, 0, -len / 2, 0, pivot);
    if (hoof) mesh(new T.CylinderGeometry(r * 0.95, r, len * 0.12, 8), hoof, 0, -len, 0, pivot);
    return pivot;
  }
  function buildChicken(color) {
    const M = mats(), g = new T.Group(), body = new T.Group(); g.add(body);
    const feather = color === "brown" ? std(0xa0582a) : M.white;
    const b = mesh(new T.SphereGeometry(0.32, 14, 10), feather, 0, 0.42, 0, body); b.scale.set(1, 0.9, 1.25);
    mesh(new T.ConeGeometry(0.18, 0.35, 8), feather, 0, 0.6, -0.36, body).rotation.x = -0.9;
    const head = new T.Group(); head.position.set(0, 0.72, 0.28); body.add(head);
    mesh(new T.SphereGeometry(0.15, 12, 10), feather, 0, 0, 0, head);
    mesh(new T.ConeGeometry(0.05, 0.14, 6), M.orange, 0, -0.02, 0.17, head).rotation.x = Math.PI / 2;
    [-0.05, 0.02, 0.08].forEach((zz, i) => mesh(new T.SphereGeometry(0.045 - i * 0.006, 8, 6), M.red, 0, 0.14, zz - 0.02, head));
    mesh(new T.SphereGeometry(0.04, 8, 6), M.red, 0, -0.1, 0.12, head);
    [-0.07, 0.07].forEach((xx) => mesh(new T.SphereGeometry(0.022, 6, 6), M.eye, xx, 0.03, 0.12, head));
    const legs = [leg(g, M.orange, -0.1, 0.22, 0, 0.22, 0.025), leg(g, M.orange, 0.1, 0.22, 0, 0.22, 0.025)];
    return { g, body, head, legs, scale: 1, speed: 1.4, step: 14, size: 0.6 };
  }
  function buildSheep() {
    const M = mats(), g = new T.Group(), body = new T.Group(); g.add(body);
    const puff = new T.IcosahedronGeometry(0.32, 1);
    [[0, 0.95, 0], [0.22, 0.98, 0.25], [-0.22, 0.98, 0.25], [0.22, 0.98, -0.25], [-0.22, 0.98, -0.25], [0, 1.15, 0.1], [0, 1.12, -0.2], [0, 0.9, 0.42], [0, 0.92, -0.45]].forEach(([x, y, z]) => mesh(puff, M.wool, x, y, z, body).scale.setScalar(rand(1, 1.25)));
    const head = new T.Group(); head.position.set(0, 1.1, 0.62); body.add(head);
    const hd = mesh(new T.SphereGeometry(0.2, 12, 10), M.woolFace, 0, 0, 0.05, head); hd.scale.set(0.85, 1, 1.25);
    mesh(new T.IcosahedronGeometry(0.16, 1), M.wool, 0, 0.16, -0.02, head);
    [-1, 1].forEach((s) => { const e = mesh(new T.SphereGeometry(0.08, 8, 6), M.woolFace, s * 0.2, 0.05, -0.02, head); e.scale.set(1.6, 0.6, 0.8); mesh(new T.SphereGeometry(0.03, 6, 6), M.eye, s * 0.1, 0.06, 0.2, head); });
    const legs = [[-0.2, 0.32], [0.2, 0.32], [-0.2, -0.32], [0.2, -0.32]].map(([x, z]) => leg(g, M.woolFace, x, 0.7, z, 0.7, 0.07, M.hoof));
    return { g, body, head, legs, speed: 1.1, step: 8, size: 1.1 };
  }
  function buildCow() {
    const M = mats(), g = new T.Group(), body = new T.Group(); g.add(body);
    const b = mesh(new T.CapsuleGeometry(0.55, 1.3, 6, 14), M.cow, 0, 1.35, 0, body); b.rotation.x = Math.PI / 2;
    mesh(new T.SphereGeometry(0.22, 12, 10), M.pink, 0, 0.82, -0.35, body).scale.set(1, 0.7, 1.1);
    const head = new T.Group(); head.position.set(0, 1.62, 1.12); body.add(head);
    mesh(new T.BoxGeometry(0.5, 0.52, 0.62), M.cow, 0, 0, 0.1, head);
    mesh(new T.BoxGeometry(0.46, 0.3, 0.26), M.pink, 0, -0.14, 0.46, head);
    [-1, 1].forEach((s) => {
      mesh(new T.ConeGeometry(0.06, 0.32, 8), M.horn, s * 0.3, 0.32, -0.02, head).rotation.z = -s * 0.8;
      const ear = mesh(new T.BoxGeometry(0.26, 0.08, 0.14), M.dark, s * 0.36, 0.12, -0.08, head); ear.rotation.z = s * 0.3;
      mesh(new T.SphereGeometry(0.045, 8, 6), M.eye, s * 0.2, 0.1, 0.38, head);
      mesh(new T.SphereGeometry(0.035, 6, 6), M.dark, s * 0.1, -0.15, 0.6, head);
    });
    const tail = mesh(new T.CylinderGeometry(0.035, 0.03, 0.9, 6), M.dark, 0, 1.15, -1.25, body); tail.rotation.x = 0.25;
    const legs = [[-0.3, 0.7], [0.3, 0.7], [-0.3, -0.7], [0.3, -0.7]].map(([x, z]) => leg(g, M.cow, x, 1.0, z, 1.0, 0.12, M.hoof));
    return { g, body, head, legs, speed: 0.9, step: 6, size: 1.7 };
  }
  function buildHorse(c2) {
    const M = mats(), coat = c2 ? M.horse2 : M.horse, g = new T.Group(), body = new T.Group(); g.add(body);
    const b = mesh(new T.CapsuleGeometry(0.48, 1.35, 6, 14), coat, 0, 1.65, 0, body); b.rotation.x = Math.PI / 2;
    const neck = new T.Group(); neck.position.set(0, 1.85, 0.85); neck.rotation.x = -0.75; body.add(neck);
    mesh(new T.CylinderGeometry(0.22, 0.34, 1.0, 12), coat, 0, 0.45, 0, neck);
    mesh(new T.BoxGeometry(0.08, 1.0, 0.3), M.mane, 0, 0.5, -0.22, neck);
    const head = new T.Group(); head.position.set(0, 1.0, 0.05); neck.add(head);
    const hd = mesh(new T.BoxGeometry(0.34, 0.36, 0.85), coat, 0, 0, 0.3, head); hd.rotation.x = 0.85;
    [-1, 1].forEach((s) => { mesh(new T.ConeGeometry(0.06, 0.22, 6), coat, s * 0.12, 0.3, -0.05, head); mesh(new T.SphereGeometry(0.04, 6, 6), M.eye, s * 0.17, 0.12, 0.2, head); });
    const tail = mesh(new T.CylinderGeometry(0.09, 0.03, 1.1, 8), M.mane, 0, 1.4, -1.25, body); tail.rotation.x = 0.35;
    const legs = [[-0.27, 0.68], [0.27, 0.68], [-0.27, -0.68], [0.27, -0.68]].map(([x, z]) => leg(g, coat, x, 1.3, z, 1.3, 0.1, M.hoof));
    return { g, body, head, legs, speed: 1.6, step: 7, size: 1.8 };
  }
  const BUILD = { tovuq: () => buildChicken(Math.random() < 0.4 ? "brown" : "white"), qoy: buildSheep, sigir: buildCow, ot: () => buildHorse(Math.random() < 0.4) };

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
    [[2, -2], [10, 4], [3, 7], [12, -6]].forEach(([x, z]) => { const pile = mesh(new T.ConeGeometry(1.1, 0.8, 12), std(0x9fbf52, 1), x, 0.4, z, hay); pile.scale.set(1, 1, 0.8); });

    // ---------- Daraxtlar, toshlar, gullar ----------
    const trunkM = std(0x6b4226, 0.9), leafM = [std(0x2f7d32, 0.9), std(0x3b8f3a, 0.9), std(0x4c9a2a, 0.9)];
    const tree = (x, z, s = 1) => {
      const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g);
      mesh(new T.CylinderGeometry(0.25, 0.38, 3, 8), trunkM, 0, 1.5, 0, g);
      [[0, 3.6, 0, 1.7], [0.8, 3.1, 0.4, 1.2], [-0.7, 3.2, -0.3, 1.25], [0, 4.6, 0, 1.15]].forEach(([a, b, c, r]) => mesh(new T.IcosahedronGeometry(r, 1), leafM[Math.random() * 3 | 0], a, b, c, g));
    };
    [[-24, -14], [-26, 12], [24, -16], [26, 4], [22, 16], [-4, 20], [8, 21], [-30, -6], [30, -2], [14, -22], [-16, 22], [32, 14]].forEach(([x, z]) => tree(x, z, rand(0.85, 1.35)));
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
    function applyTime(h) {
      const day = h >= 6 && h < 19, dusk = (h >= 17 && h < 19) || (h >= 6 && h < 7.5);
      const a = ((h - 6) / 13) * Math.PI;
      sun.position.set(Math.cos(a) * 60, Math.max(8, Math.sin(a) * 70), 30);
      if (day && !dusk) { scene.background = skyTex("#5aa9ec", "#a9d6f5", "#e8f4fb"); scene.fog = new T.Fog(0xcfe6f2, 70, 210); sun.intensity = 1.6; sun.color.set(0xfff1d6); hemi.intensity = 0.75; lamp.intensity = 0; renderer.toneMappingExposure = 1; }
      else if (dusk) { scene.background = skyTex("#3b4f8c", "#f59e6b", "#ffd29a"); scene.fog = new T.Fog(0xf3b483, 60, 190); sun.intensity = 1.1; sun.color.set(0xffa463); hemi.intensity = 0.5; lamp.intensity = 1.2; renderer.toneMappingExposure = 0.95; }
      else { scene.background = skyTex("#050a1f", "#13224a", "#273a63"); scene.fog = new T.Fog(0x16244a, 50, 170); sun.position.set(-40, 60, -20); sun.intensity = 0.35; sun.color.set(0x9db4ff); hemi.intensity = 0.25; lamp.intensity = 2.4; renderer.toneMappingExposure = 0.9; }
    }
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
        st.icon.position.y = b.size + 0.8 + Math.sin(now * 2 + st.phase) * 0.08;
      });
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

    this.destroy = function () {
      alive = false; cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      renderer.dispose(); el.remove();
    };
  }
  window.SofiFarm3D = Farm3D;
})();
