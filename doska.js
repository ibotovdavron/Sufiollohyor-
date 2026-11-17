/* ELEKTRON DOSKA
   1) Chizish: barmoq / stilus / sichqoncha (qalam, o'chirg'ich, orqaga, saqlash).
   2) Jonli kamera: shu qurilma kamerasi yoki telefon kamerasi (WebRTC, kod orqali ulanadi).
   3) Qo'l ishoralari (MediaPipe Hands): ✌️ kub, 3 barmoq — prizma, 4 — piramida, 🖐 shar, 👌 chimchilab ushlash, ✊ o'chirish, ☝️ havoda chizish.
   ?net=local — internet bazasisiz sinov (shu brauzer oynalari orasida). */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const qs = new URLSearchParams(location.search);
  const LOCAL = qs.get("net") === "local";
  // Kamera faqat xavfsiz (https) sahifada ishlaydi — http bilan ochilsa, https ga o'tamiz
  if (location.protocol === "http:" && !/^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname)) {
    const to = "https://" + location.host + location.pathname + location.search + location.hash;
    // https haqiqatan ochilishini tekshirib, keyin o'tamiz (sertifikat bo'lmasa sahifa buzilmasin)
    fetch("https://" + location.host + "/doska.css", { mode: "no-cors", cache: "no-store" }).then(() => location.replace(to)).catch(() => {});
  }
  if ("serviceWorker" in navigator && location.protocol !== "file:") addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

  // =====================================================================
  // Signal kanali (telefon ↔ doska): Supabase Realtime yoki BroadcastChannel
  // =====================================================================
  let sb = null;
  async function joinRoom(code, onMsg) {
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    if (!LOCAL && window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
      sb = sb || window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false } });
      const ch = sb.channel("sofi-doska-" + code, { config: { broadcast: { self: false } } });
      ch.on("broadcast", { event: "s" }, ({ payload }) => onMsg(payload));
      await new Promise((res, rej) => {
        const t = setTimeout(() => rej(new Error("Internetga ulanib bo‘lmadi")), 9000);
        ch.subscribe((s) => { if (s === "SUBSCRIBED") { clearTimeout(t); res(); } else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") { clearTimeout(t); rej(new Error("Aloqa xatosi")); } });
      });
      return { send: (d) => ch.send({ type: "broadcast", event: "s", payload: d }), leave: () => sb.removeChannel(ch) };
    }
    const bc = new BroadcastChannel("sofi-doska-" + code);
    bc.onmessage = (e) => onMsg(e.data);
    return { send: (d) => bc.postMessage(d), leave: () => bc.close() };
  }
  const ICE = { iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun.cloudflare.com:3478"] }], iceCandidatePoolSize: 4 };
  /** Nomzod ulanish taklifidan oldin kelsa — yo'qotmasdan navbatda saqlaymiz */
  async function addIce(pc, c) { if (pc.remoteDescription && pc.remoteDescription.type) { try { await pc.addIceCandidate(c); } catch (e) { /* eskirgan nomzod */ } } else (pc._q = pc._q || []).push(c); }
  async function flushIce(pc) { const q = pc._q || []; pc._q = []; for (const c of q) { try { await pc.addIceCandidate(c); } catch (e) { /* bo'sh */ } } }

  // =====================================================================
  // TELEFON REJIMI: kamera → doska
  // =====================================================================
  if (qs.has("cam")) {
    $("dk").hidden = true; $("dk").style.display = "none"; $("dkPhone").hidden = false;
    const codeIn = $("dkpCode"), st = $("dkpStatus"), vid = $("dkpVideo");
    let facing = "environment", stream = null, pc = null, room = null, helloT = 0;
    codeIn.value = (qs.get("cam") || "").replace(/\D/g, "").slice(0, 4);
    const say = (t) => (st.textContent = t);
    async function camera() {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 960 }, height: { ideal: 540 }, frameRate: { ideal: 30, max: 30 } }, audio: false });
      vid.srcObject = stream;
      if (pc) { const s = pc.getSenders().find((x) => x.track && x.track.kind === "video"); if (s) await s.replaceTrack(stream.getVideoTracks()[0]); room && room.send({ t: "mirror", v: facing === "user" }); }
    }
    async function connect() {
      const code = codeIn.value.trim();
      if (!/^\d{4}$/.test(code)) return say("4 xonali kodni kiriting");
      try {
        say("Kamera ochilmoqda va doska qidirilmoqda…");
        const camP = camera();
        if (room) room.leave(); if (pc) pc.close(); clearInterval(helloT);
        room = await joinRoom(code, async (m) => {
          try {
            if (m.t === "ready" && !pc) {
              clearInterval(helloT);
              pc = new RTCPeerConnection(ICE);
              stream.getTracks().forEach((t) => pc.addTrack(t, stream));
              pc.onicecandidate = (e) => e.candidate && room.send({ t: "ice", from: "p", c: e.candidate.toJSON() });
              pc.onconnectionstatechange = () => { if (pc.connectionState === "connected") say("✅ Ulandi — kamera doskaga uzatilmoqda"); if (["failed", "disconnected"].includes(pc.connectionState)) say("⚠️ Aloqa uzildi. Qayta “Ulash” ni bosing."); };
              const offer = await pc.createOffer(); await pc.setLocalDescription(offer);
              room.send({ t: "offer", sdp: offer.sdp, mirror: facing === "user" });
            } else if (m.t === "answer" && pc && !pc.remoteDescription) { await pc.setRemoteDescription({ type: "answer", sdp: m.sdp }); await flushIce(pc); }
            else if (m.t === "ice" && m.from === "b" && pc) await addIce(pc, m.c);
          } catch (e) { say("Xato: " + e.message); }
        });
        pc = null;
        await camP;
        say("Doska qidirilmoqda…");
        const hello = () => room.send({ t: "hello" }); hello(); helloT = setInterval(hello, 700);
        try { if (navigator.wakeLock) await navigator.wakeLock.request("screen"); } catch (e) { /* bo'sh */ }
      } catch (e) { say("❌ " + (e.name === "NotAllowedError" ? "Kameraga ruxsat berilmadi" : e.message)); }
    }
    $("dkpGo").onclick = connect;
    $("dkpFlip").onclick = async () => { facing = facing === "user" ? "environment" : "user"; try { await camera(); } catch (e) { say("❌ " + e.message); } };
    window.DOSKA_PHONE = { connect };
    return;
  }

  // =====================================================================
  // DOSKA
  // =====================================================================
  const root = $("dk"), video = $("dkVideo"), cDraw = $("dkDraw"), c3d = $("dk3d"), cHand = $("dkHand");
  const g = cDraw.getContext("2d"), gh = cHand.getContext("2d");
  const statusEl = $("dkStatus"), panel = $("dkPanel");
  let W = 0, H = 0, DPR = 1;
  const COLORS = ["#ffffff", "#fde047", "#f87171", "#4ade80", "#60a5fa", "#f472b6", "#111827"];
  const S = { tool: "pen", color: COLORS[0], size: 5, strokes: [], cur: null, bg: "board", mirror: true, hands: false, airDraw: true };
  let statusT = 0;
  const status = (t, ms = 3500) => { statusEl.textContent = t; statusEl.hidden = !t; clearTimeout(statusT); if (t && ms) statusT = setTimeout(() => (statusEl.hidden = true), ms); };

  // ---------- chizish ----------
  function paint(st, from = 0) {
    const p = st.pts; if (!p.length) return;
    g.save(); g.lineCap = "round"; g.lineJoin = "round"; g.lineWidth = st.size;
    g.globalCompositeOperation = st.erase ? "destination-out" : "source-over"; g.strokeStyle = st.color; g.fillStyle = st.color;
    if (p.length === 1) { g.beginPath(); g.arc(p[0][0], p[0][1], st.size / 2, 0, 7); g.fill(); }
    else {
      g.beginPath();
      const i0 = Math.max(1, from);
      g.moveTo(...(i0 > 1 ? [(p[i0 - 2][0] + p[i0 - 1][0]) / 2, (p[i0 - 2][1] + p[i0 - 1][1]) / 2] : p[0]));
      for (let i = i0; i < p.length; i++) { const mx = (p[i - 1][0] + p[i][0]) / 2, my = (p[i - 1][1] + p[i][1]) / 2; g.quadraticCurveTo(p[i - 1][0], p[i - 1][1], mx, my); }
      g.stroke();
    }
    g.restore();
  }
  function redraw() { g.clearRect(0, 0, W, H); S.strokes.forEach((s) => paint(s)); }
  function strokeStart(x, y, opt = {}) { const st = { color: opt.color || S.color, size: opt.size || (S.tool === "erase" ? S.size * 4 : S.size), erase: opt.erase ?? S.tool === "erase", pts: [[x, y]] }; S.strokes.push(st); paint(st); return st; }
  function strokeAdd(st, x, y) { const l = st.pts[st.pts.length - 1]; if (Math.hypot(x - l[0], y - l[1]) < 1.5) return; st.pts.push([x, y]); paint(st, st.pts.length - 1); }

  // ---------- 3D shakllar (Three.js, piksel koordinatalarida ortografik kamera) ----------
  const T = window.THREE;
  const renderer = new T.WebGLRenderer({ canvas: c3d, alpha: true, antialias: true, preserveDrawingBuffer: true });
  const scene = new T.Scene(), cam = new T.OrthographicCamera(0, 1, 0, 1, -2000, 2000);
  scene.add(new T.AmbientLight(0xffffff, 0.65)); const sun = new T.DirectionalLight(0xffffff, 0.9); sun.position.set(-0.5, 0.8, 1); scene.add(sun);
  const KINDS = { kub: ["🧊 Kub", () => new T.BoxGeometry(1.5, 1.5, 1.5)], prizma: ["🔺 Prizma", () => new T.CylinderGeometry(1, 1, 1.8, 3)], piramida: ["⛰ Piramida", () => new T.ConeGeometry(1.15, 1.7, 4)], shar: ["⚽ Shar", () => new T.SphereGeometry(1, 32, 20)], silindr: ["🥫 Silindr", () => new T.CylinderGeometry(0.8, 0.8, 1.8, 40)], konus: ["🍦 Konus", () => new T.ConeGeometry(0.95, 1.8, 40)], oltiburchak: ["⬡ 6-prizma", () => new T.CylinderGeometry(1, 1, 1.5, 6)], tetraedr: ["△ Tetraedr", () => new T.TetrahedronGeometry(1.25)], oktaedr: ["◇ Oktaedr", () => new T.OctahedronGeometry(1.2)] };
  const SCOL = [0xf97316, 0x38bdf8, 0xfacc15, 0x22c55e, 0xa78bfa, 0xef4444, 0x2dd4bf, 0xf472b6];
  const shapes = []; let sel = null, rotMode = false;
  function addShape(kind, x, y, quiet) {
    if (shapes.length >= 10) { const o = shapes.shift(); scene.remove(o.mesh); }
    const geo = KINDS[kind][1](), col = SCOL[(shapes.length + Object.keys(KINDS).indexOf(kind)) % SCOL.length];
    const mesh = new T.Mesh(geo, new T.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.86, roughness: 0.55, flatShading: !/shar|silindr|konus/.test(kind) }));
    mesh.add(new T.LineSegments(new T.EdgesGeometry(geo, 20), new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })));
    const sh = { kind, mesh, x, y, s: Math.max(55, Math.min(W, H) * 0.11), rx: 0.45, ry: 0.6, rz: 0, held: false, pop: 0 };
    scene.add(mesh); shapes.push(sh);
    if (!quiet) status(`${KINDS[kind][0]} qo‘shildi — ✋ bilan ushlab suring`, 2200);
    return sh;
  }
  function delShape(sh) { const i = shapes.indexOf(sh); if (i < 0) return; scene.remove(sh.mesh); shapes.splice(i, 1); if (sel === sh) select(null); }
  const shapeAt = (x, y, pad = 1.15) => { let best = null, bd = 1e9; for (const sh of shapes) { const d = Math.hypot(x - sh.x, y - sh.y); if (d < sh.s * 1.25 * pad && d < bd) { bd = d; best = sh; } } return best; };
  const selBar = $("dkSel");
  function select(sh) { sel = sh; selBar.hidden = !sh; }
  function render3d(dt) {
    for (const sh of shapes) {
      if (!sh.held && sel !== sh) sh.ry += dt * 0.5;
      sh.pop = Math.min(1, sh.pop + dt * 4);
      const k = sh.s * (0.6 + 0.4 * (1 - Math.pow(1 - sh.pop, 3)));
      sh.mesh.position.set(sh.x, H - sh.y, 0); sh.mesh.scale.setScalar(k); sh.mesh.rotation.set(sh.rx, sh.ry, sh.rz);
      sh.mesh.material.emissive.setHex(sh.held || sel === sh ? 0x333333 : 0);
    }
    if (sel) { selBar.style.left = Math.max(110, Math.min(W - 110, sel.x)) + "px"; selBar.style.top = Math.min(H - 60, sel.y + sel.s * 1.5 + 8) + "px"; }
    renderer.render(scene, cam);
  }

  // ---------- o'lcham ----------
  function resize() {
    W = root.clientWidth; H = root.clientHeight; DPR = Math.min(2, window.devicePixelRatio || 1);
    for (const c of [cDraw, cHand]) { c.width = W * DPR; c.height = H * DPR; }
    g.setTransform(DPR, 0, 0, DPR, 0, 0); gh.setTransform(DPR, 0, 0, DPR, 0, 0);
    renderer.setPixelRatio(DPR); renderer.setSize(W, H, false);
    cam.left = 0; cam.right = W; cam.top = H; cam.bottom = 0; cam.updateProjectionMatrix();
    redraw();
  }
  addEventListener("resize", resize);

  // ---------- ko'rsatkich (barmoq / sichqoncha) ----------
  const ptrs = new Map(); let drag = null, pinch0 = null;
  cDraw.addEventListener("pointerdown", (e) => {
    cDraw.setPointerCapture(e.pointerId); $("dkShapes").hidden = true;
    const x = e.clientX, y = e.clientY; ptrs.set(e.pointerId, [x, y]);
    const hit = shapeAt(x, y, 1);
    if (S.tool === "move" || (hit && S.tool !== "erase" && sel === hit)) {
      if (ptrs.size === 2 && sel) { const [a, b] = [...ptrs.values()]; pinch0 = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), a: Math.atan2(b[1] - a[1], b[0] - a[0]), s: sel.s, rz: sel.rz }; drag = null; return; }
      select(hit); if (hit) { hit.held = true; drag = { sh: hit, ox: hit.x - x, oy: hit.y - y, lx: x, ly: y }; }
      return;
    }
    select(null);
    if (ptrs.size === 1) S.cur = strokeStart(x, y);
  });
  cDraw.addEventListener("pointermove", (e) => {
    if (!ptrs.has(e.pointerId)) return;
    const x = e.clientX, y = e.clientY; ptrs.set(e.pointerId, [x, y]);
    if (pinch0 && ptrs.size === 2 && sel) { const [a, b] = [...ptrs.values()]; sel.s = Math.max(30, Math.min(Math.min(W, H) * 0.45, pinch0.s * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch0.d)); sel.rz = pinch0.rz - (Math.atan2(b[1] - a[1], b[0] - a[0]) - pinch0.a); return; }
    if (drag) { if (rotMode) { drag.sh.ry += (x - drag.lx) * 0.012; drag.sh.rx += (y - drag.ly) * 0.012; } else { drag.sh.x = x + drag.ox; drag.sh.y = y + drag.oy; } drag.lx = x; drag.ly = y; return; }
    if (S.cur) { const ev = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; for (const c of ev.length ? ev : [e]) strokeAdd(S.cur, c.clientX, c.clientY); }
  });
  const up = (e) => { ptrs.delete(e.pointerId); if (drag) { drag.sh.held = false; drag = null; } if (ptrs.size < 2) pinch0 = null; S.cur = null; };
  cDraw.addEventListener("pointerup", up); cDraw.addEventListener("pointercancel", up);
  cDraw.addEventListener("wheel", (e) => { const sh = shapeAt(e.clientX, e.clientY, 1) || sel; if (!sh) return; e.preventDefault(); sh.s = Math.max(30, Math.min(Math.min(W, H) * 0.45, sh.s * (e.deltaY < 0 ? 1.08 : 0.92))); }, { passive: false });

  // ---------- kamera ----------
  let localStream = null, pc = null, room = null;
  function setVideo(stream, mirror) {
    video.srcObject = stream; video.play().catch(() => {});
    root.classList.toggle("has-cam", !!stream); S.mirror = mirror; root.classList.toggle("mirror", mirror);
    if (stream && S.bg !== "cam") setBg("cam");
    if (stream) setTimeout(() => preloadHands().catch(() => {}), 400); // ishoralar tugmasi bosilganda tayyor tursin
    if (!stream && S.bg === "cam") setBg("board");
    mark();
  }
  async function toggleCam() {
    if (localStream) { localStream.getTracks().forEach((t) => t.stop()); localStream = null; setVideo(null, true); return; }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { status("📱 Bu doskaning brauzerida kamera yo‘q — telefon kamerasini ulaymiz", 6000); await phoneCam(); mark(); return; }
      localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      closePhone(); setVideo(localStream, true); status("📷 Kamera yoqildi. Qo‘l ishoralari uchun “🖐 Ishoralar” ni bosing.");
    } catch (e) {
      if (e.name === "NotFoundError" || e.name === "NotReadableError" || e.name === "OverconstrainedError") { status("📱 Doskada kamera topilmadi — telefon kamerasini ulaymiz", 6000); await phoneCam(); mark(); return; }
      status("❌ " + (e.name === "NotAllowedError" ? "Kameraga ruxsat berilmadi. Brauzer sozlamalaridan ruxsat bering yoki 📱 Telefon tugmasini bosing." : e.message), 7000);
    }
  }
  function closePhone() { if (pc) { pc.close(); pc = null; } if (room) { room.leave(); room = null; } }
  async function phoneCam() {
    closePhone();
    const code = String(Math.floor(1000 + Math.random() * 9000));
    const url = location.origin + location.pathname + "?cam=" + code + (LOCAL ? "&net=local" : "");
    showPanel(`<h2>📱 Telefonni kamera qilib ulash</h2>
      <div>1. Telefonda shu manzilni oching:</div><span class="url">${url.replace(/^https?:\/\//, "")}</span>
      <div style="margin-top:8px">2. Yoki telefonda <b>Doska → 📱 Telefon</b> sahifasida kodni kiriting:</div><div class="code">${code}</div>
      <div class="muted" id="dkPhSt">⏳ Telefon kutilmoqda…</div>
      <div class="muted">Telefon va doska bitta Wi-Fi tarmog‘ida bo‘lsa, aloqa eng ishonchli ishlaydi. Telefonni shtativga yoki kitoblar ustiga o‘rnatib, qo‘lingiz ko‘rinadigan qilib qo‘ying.</div>`);
    const say = (t) => { const el = $("dkPhSt"); if (el) el.textContent = t; };
    try {
      room = await joinRoom(code, async (m) => {
        try {
          if (m.t === "hello") {
            if (pc && pc.connectionState !== "failed" && pc.connectionState !== "closed") { if (pc.signalingState === "stable" && !pc.remoteDescription) room.send({ t: "ready" }); return; }
            pc = new RTCPeerConnection(ICE);
            pc.onicecandidate = (e) => e.candidate && room.send({ t: "ice", from: "b", c: e.candidate.toJSON() });
            pc.ontrack = (e) => { if (localStream) { localStream.getTracks().forEach((t) => t.stop()); localStream = null; } setVideo(e.streams[0] || new MediaStream([e.track]), pc._mirror || false); if (S.wantHands && !S.hands) { S.hands = true; mark(); initHands(); } say("✅ Telefon ulandi!"); status("📱 Telefon kamerasi ulandi", 3000); setTimeout(() => (panel.hidden = true), 900); };
            pc.onconnectionstatechange = () => { if (pc && ["failed", "disconnected", "closed"].includes(pc.connectionState)) status("⚠️ Telefon bilan aloqa uzildi", 5000); };
            room.send({ t: "ready" }); say("📶 Telefon topildi, ulanmoqda…");
          } else if (m.t === "offer" && pc && !pc.remoteDescription) { pc._mirror = !!m.mirror; await pc.setRemoteDescription({ type: "offer", sdp: m.sdp }); await flushIce(pc); const a = await pc.createAnswer(); await pc.setLocalDescription(a); room.send({ t: "answer", sdp: a.sdp }); }
          else if (m.t === "ice" && m.from === "p" && pc) await addIce(pc, m.c);
          else if (m.t === "mirror") { S.mirror = !!m.v; root.classList.toggle("mirror", S.mirror); }
        } catch (e) { say("Xato: " + e.message); }
      });
    } catch (e) { say("❌ " + e.message); }
  }

  // ---------- qo'l ishoralari ----------
  const HL = { lm: null, loading: false, last: 0, hands: [{}, {}] };
  let handsP = null;
  /** Modulni fonda yuklash (bir marta). Kamera yoki telefon ulanishi bilan boshlanadi. */
  function preloadHands() {
    if (!handsP) handsP = (async () => {
      const v = await import("./lib/mediapipe/vision_bundle.mjs");
      const fs = await v.FilesetResolver.forVisionTasks("lib/mediapipe/wasm");
      const mk = (delegate) => v.HandLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: "lib/mediapipe/hand_landmarker.task", delegate }, runningMode: "VIDEO", numHands: 2, minHandDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
      try { return await mk("GPU"); } catch (e) { return await mk("CPU"); }
    })().catch((e) => { handsP = null; throw e; });
    return handsP;
  }
  async function initHands() {
    if (HL.lm || HL.loading) return; HL.loading = true;
    const t0 = performance.now();
    const slow = setTimeout(() => status("⏳ Qo‘l tanish moduli yuklanmoqda (faqat birinchi marta biroz vaqt oladi)…", 0), 300);
    try {
      HL.lm = await preloadHands();
      clearTimeout(slow);
      status("🖐 Ishoralar yoqildi: ✌️ kub · 3 prizma · 4 piramida · 🖐 shar → o‘rtada chiqadi · 👌 ko‘chirish · ✊ aylantirish", 7000);
      HL.loadMs = Math.round(performance.now() - t0);
    } catch (e) { clearTimeout(slow); S.hands = false; mark(); status("❌ Qo‘l tanish moduli yuklanmadi: " + e.message, 7000); }
    HL.loading = false;
  }
  const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  /** Normallashgan nuqta → ekran (object-fit: cover va ko'zgu hisobga olinadi) */
  function toScreen(p) {
    const vw = video.videoWidth || 1, vh = video.videoHeight || 1, k = Math.max(W / vw, H / vh);
    let x = (W - vw * k) / 2 + p.x * vw * k; const y = (H - vh * k) / 2 + p.y * vh * k;
    if (S.mirror) x = W - x; return [x, y];
  }
  function classify(P) {
    const size = d2(P[0], P[9]) || 1;
    const ext = [d2(P[4], P[17]) > d2(P[3], P[17]) * 1.08 && d2(P[4], P[5]) > size * 0.55];
    for (const [tip, pip] of [[8, 6], [12, 10], [16, 14], [20, 18]]) ext.push(d2(P[tip], P[0]) > d2(P[pip], P[0]) * 1.12);
    const n = ext.filter(Boolean).length;
    const pinch = d2(P[4], P[8]) < size * 0.3 && d2(P[8], P[0]) > size * 1.05;
    let gname = "other";
    if (pinch) gname = "pinch";
    else if (n === 0 || (n === 1 && ext[0] && !ext[1])) gname = "fist";
    else if (ext[1] && !ext[2] && !ext[3] && !ext[4]) gname = "point";
    else if (ext[1] && ext[2] && !ext[3] && !ext[4]) gname = "two";
    else if (ext[1] && ext[2] && ext[3] && !ext[4]) gname = "three";
    else if (ext[1] && ext[2] && ext[3] && ext[4] && !ext[0]) gname = "four";
    else if (n === 5) gname = "five";
    return { g: gname, size, n };
  }
  const SPAWN = { two: "kub", three: "prizma", four: "piramida", five: "shar" };
  const GLABEL = { pinch: "👌 ko‘chirish", fist: "✊ aylantirish", point: "☝️ chizish", two: "✌️ kub", three: "3 — prizma", four: "4 — piramida", five: "🖐 shar", other: "" };
  const BONES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
  const HOLD = 1.0, GAIN = 1.8;
  /** Boshqariladigan shakl: tanlangan yoki oxirgi qo'shilgan */
  const active = () => (sel && shapes.includes(sel) ? sel : shapes[shapes.length - 1] || null);
  const clampXY = (sh) => { sh.x = Math.max(sh.s * 0.6, Math.min(W - sh.s * 0.6, sh.x)); sh.y = Math.max(70 + sh.s * 0.5, Math.min(H - sh.s * 0.6, sh.y)); };
  /** Yangi shakl ekran o'rtasida chiqadi (band bo'lsa — yonida) */
  function spawnCenter(kind) {
    const offs = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1]], step = Math.min(W, H) * 0.22;
    let pos = [W / 2, H / 2 + 20];
    for (const [ox, oy] of offs) { const x = W / 2 + ox * step, y = H / 2 + 20 + oy * step; if (!shapes.some((q) => Math.hypot(q.x - x, q.y - y) < q.s * 1.4)) { pos = [x, y]; break; } }
    const sh = addShape(kind, pos[0], pos[1], true); select(sh);
    status(`${KINDS[kind][0]} chiqdi — 👌 bilan ko‘chiring, ✊ bilan aylantiring (qo‘l istalgan joyda)`, 3500);
    return sh;
  }
  function processHands(list, dt) {
    gh.clearRect(0, 0, W, H);
    const seen = [];
    const both = list.length === 2;
    list.forEach((lm, i) => {
      const hs = HL.hands[i] || (HL.hands[i] = {});
      let P = lm.map(toScreen);
      if (hs.P && hs.P.length === 21) P = P.map((p, k) => [hs.P[k][0] + (p[0] - hs.P[k][0]) * 0.6, hs.P[k][1] + (p[1] - hs.P[k][1]) * 0.6]);
      hs.P = P; seen.push(i);
      const { g: gs, size } = classify(P);
      if (gs === hs.g) hs.t = (hs.t || 0) + dt; else { hs.g = gs; hs.t = 0; hs.armed = true; if (hs.stroke) hs.stroke = null; }
      const palm = P[9], pin = [(P[4][0] + P[8][0]) / 2, (P[4][1] + P[8][1]) / 2];
      const ang = Math.atan2(P[9][1] - P[0][1], P[9][0] - P[0][0]);
      let link = null;
      // 👌 masofadan ko'chirish: qo'l qayerda bo'lishidan qat'i nazar, faol shakl qo'l harakati bilan siljiydi
      if (gs === "pinch") {
        if (!hs.grab) { const sh = active(); if (sh) { hs.grab = { sh, lx: pin[0], ly: pin[1], a0: ang, rz0: sh.rz, s0: sh.s, size0: size }; sh.held = true; select(sh); } }
        else {
          const G = hs.grab, sh = G.sh;
          const other = HL.hands[1 - i];
          const twoPinch = both && other && other.g === "pinch";
          if (!twoPinch || i === 0) { sh.x += (pin[0] - G.lx) * GAIN; sh.y += (pin[1] - G.ly) * GAIN; clampXY(sh); }
          G.lx = pin[0]; G.ly = pin[1];
          if (!twoPinch) {
            sh.rz = G.rz0 - (ang - G.a0);
            // qo'lni kameraga yaqinlashtirsa — kattalashadi, uzoqlashtirsa — kichrayadi
            const r = size / G.size0, rr = 1 + Math.sign(r - 1) * Math.max(0, Math.abs(r - 1) - 0.1);
            const target = Math.max(30, Math.min(Math.min(W, H) * 0.45, G.s0 * Math.pow(rr, 1.6)));
            sh.s += (target - sh.s) * 0.25;
          }
          link = [pin, sh];
        }
      } else if (hs.grab) { hs.grab.sh.held = false; hs.grab = null; }
      // ✊ masofadan aylantirish: mushtni surish — shakl 3D da aylanadi
      if (gs === "fist") {
        if (!hs.rot) { const sh = active(); if (sh) { hs.rot = { sh, lx: palm[0], ly: palm[1] }; sh.held = true; select(sh); } }
        else { const R = hs.rot; R.sh.ry += (palm[0] - R.lx) * 0.014; R.sh.rx += (palm[1] - R.ly) * 0.014; R.lx = palm[0]; R.ly = palm[1]; link = [palm, R.sh]; }
      } else if (hs.rot) { hs.rot.sh.held = false; hs.rot = null; }
      // shakl chiqarish (ishorani HOLD soniya ushlab turish) — ekran o'rtasida
      if (hs.armed && hs.t >= HOLD && SPAWN[gs]) { spawnCenter(SPAWN[gs]); hs.armed = false; }
      // ☝️ havoda chizish
      if (gs === "point" && S.airDraw && hs.t > 0.15) { const tip = P[8]; if (!hs.stroke) hs.stroke = strokeStart(tip[0], tip[1], { erase: false, size: Math.max(4, S.size) }); else strokeAdd(hs.stroke, tip[0], tip[1]); }
      // skelet
      gh.lineWidth = 3; gh.strokeStyle = "rgba(134,239,172,.9)"; gh.beginPath(); for (const [a, b] of BONES) { gh.moveTo(P[a][0], P[a][1]); gh.lineTo(P[b][0], P[b][1]); } gh.stroke();
      gh.fillStyle = "#fff"; for (const k of [4, 8, 12, 16, 20]) { gh.beginPath(); gh.arc(P[k][0], P[k][1], 5, 0, 7); gh.fill(); }
      if (gs === "pinch") { gh.strokeStyle = "#fde047"; gh.lineWidth = 4; gh.beginPath(); gh.arc(pin[0], pin[1], 16, 0, 7); gh.stroke(); }
      // qo'l va boshqarilayotgan shakl orasidagi “nur”
      if (link) {
        const [from, sh] = link;
        gh.save(); gh.strokeStyle = "rgba(253,224,71,.85)"; gh.lineWidth = 3; gh.setLineDash([8, 8]); gh.lineDashOffset = -performance.now() / 30;
        gh.beginPath(); gh.moveTo(from[0], from[1]); gh.lineTo(sh.x, sh.y); gh.stroke(); gh.setLineDash([]);
        gh.beginPath(); gh.arc(sh.x, sh.y, sh.s * 1.25, 0, 7); gh.stroke(); gh.restore();
      }
      if (GLABEL[gs]) {
        gh.font = "800 16px system-ui, sans-serif"; gh.textAlign = "center"; const tw = gh.measureText(GLABEL[gs]).width + 18;
        gh.fillStyle = "rgba(0,0,0,.6)"; gh.fillRect(P[0][0] - tw / 2, P[0][1] + 14, tw, 26); gh.fillStyle = "#fff"; gh.fillText(GLABEL[gs], P[0][0], P[0][1] + 32);
        if (SPAWN[gs] && hs.armed) { gh.strokeStyle = "#fde047"; gh.lineWidth = 6; gh.beginPath(); gh.arc(palm[0], palm[1], size * 0.55, -Math.PI / 2, -Math.PI / 2 + Math.min(1, hs.t / HOLD) * Math.PI * 2); gh.stroke(); }
      }
    });
    // ikki qo'l bilan chimchilash — qo'llarni yaqinlashtirish/uzoqlashtirish bilan kattalashtirish
    const A = HL.hands[0], B = HL.hands[1];
    if (seen.length === 2 && A.g === "pinch" && B.g === "pinch" && (A.grab || B.grab)) {
      const G = A.grab || B.grab, d = d2(A.P[8], B.P[8]);
      if (!G.d0) { G.d0 = d; G.s0 = G.sh.s; } G.sh.s = Math.max(30, Math.min(Math.min(W, H) * 0.45, G.s0 * d / G.d0));
    } else { if (A.grab) A.grab.d0 = 0; if (B.grab) B.grab.d0 = 0; }
    HL.hands.forEach((hs, i) => { if (!seen.includes(i)) { if (hs.grab) hs.grab.sh.held = false; if (hs.rot) hs.rot.sh.held = false; HL.hands[i] = {}; } });
  }
  window.DOSKA = { S, shapes, addShape, classify, HL, processHands, active: () => active() };

  // ---------- asboblar paneli ----------
  const colorsEl = $("dkColors");
  COLORS.forEach((c, i) => { const b = document.createElement("button"); b.type = "button"; b.style.background = c; b.className = i === 0 ? "on" : ""; b.title = "Rang"; b.onclick = () => { S.color = c; colorsEl.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); if (S.tool !== "pen") setTool("pen"); }; colorsEl.append(b); });
  $("dkSize").oninput = (e) => (S.size = Number(e.target.value));
  function setTool(t) { S.tool = t; document.querySelectorAll("[data-tool]").forEach((b) => b.classList.toggle("on", b.dataset.tool === t)); cDraw.style.cursor = t === "move" ? "grab" : "crosshair"; if (t !== "move") select(null); }
  function setBg(b) { S.bg = b; root.dataset.bg = b; if (b === "white" && S.color === "#ffffff") colorsEl.lastChild.click(); if (b !== "white" && S.color === "#111827") colorsEl.firstChild.click(); }
  function mark() { const q = (a) => document.querySelector(`[data-act="${a}"]`); q("cam").classList.toggle("on", !!localStream); q("phone").classList.toggle("on", !!pc); q("hands").classList.toggle("on", S.hands); q("mirror").classList.toggle("on", S.mirror && !!video.srcObject); }
  function showPanel(html) { panel.innerHTML = `<button class="x" aria-label="Yopish">✕</button>` + html; panel.hidden = false; panel.querySelector(".x").onclick = () => (panel.hidden = true); }
  const shapesEl = $("dkShapes");
  Object.entries(KINDS).forEach(([k, [label]]) => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.onclick = () => { addShape(k, W / 2 + (Math.random() - 0.5) * 120, H / 2 + (Math.random() - 0.5) * 80); shapesEl.hidden = true; setTool("move"); }; shapesEl.append(b); });
  selBar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-s]"); if (!b || !sel) return;
    const a = b.dataset.s;
    if (a === "smaller") sel.s = Math.max(30, sel.s * 0.85); if (a === "bigger") sel.s = Math.min(Math.min(W, H) * 0.45, sel.s * 1.18);
    if (a === "rotate") { rotMode = !rotMode; b.classList.toggle("on", rotMode); status(rotMode ? "🔄 Aylantirish: shaklni suring" : "✋ Ko‘chirish: shaklni suring", 2000); }
    if (a === "color") sel.mesh.material.color.setHex(SCOL[(SCOL.indexOf(sel.mesh.material.color.getHex()) + 1) % SCOL.length]);
    if (a === "del") delShape(sel);
  });
  const BGS = ["board", "black", "white", "cam"];
  $("dkBar").addEventListener("click", async (e) => {
    const t = e.target.closest("[data-tool]"); if (t) return setTool(t.dataset.tool);
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = b.dataset.act;
    if (a === "undo") { S.strokes.pop(); redraw(); }
    else if (a === "clear") { if (!S.strokes.length && !shapes.length) return; if (confirm("Doskani tozalaymizmi? (yozuvlar va shakllar o‘chadi)")) { S.strokes.length = 0; redraw(); while (shapes.length) delShape(shapes[0]); } }
    else if (a === "bg") { let i = BGS.indexOf(S.bg); do { i = (i + 1) % BGS.length; } while (BGS[i] === "cam" && !video.srcObject); setBg(BGS[i]); status({ board: "Yashil doska", black: "Qora doska", white: "Oq doska", cam: "Kamera fonda" }[S.bg], 1500); }
    else if (a === "shape") shapesEl.hidden = !shapesEl.hidden;
    else if (a === "cam") await toggleCam();
    else if (a === "phone") { if (pc) { closePhone(); setVideo(null, true); status("Telefon uzildi"); } else await phoneCam(); mark(); }
    else if (a === "hands") {
      S.hands = !S.hands; mark();
      S.wantHands = S.hands;
      if (S.hands) { if (!video.srcObject) { await toggleCam(); if (!video.srcObject) { S.hands = false; mark(); if (pc || room) status("📱 Telefon ulanishi bilan ishoralar o‘zi yoqiladi", 6000); return; } } await initHands(); }
      else { gh.clearRect(0, 0, W, H); status("Ishoralar o‘chirildi", 1500); }
    }
    else if (a === "mirror") { S.mirror = !S.mirror; root.classList.toggle("mirror", S.mirror); mark(); }
    else if (a === "save") save();
    else if (a === "full") { if (document.fullscreenElement) document.exitFullscreen(); else (document.documentElement.requestFullscreen || (() => {})).call(document.documentElement).catch?.(() => {}); }
    else if (a === "help") help();
  });
  function help() {
    showPanel(`<h2>❓ Doskadan foydalanish</h2>
      <table>
        <tr><td>✏️</td><td><b>Yozish</b> — barmoq, stilus yoki sichqoncha bilan. 🧽 o‘chirg‘ich, ↶ orqaga, 🎨 fon.</td></tr>
        <tr><td>🧊</td><td><b>Shakl qo‘shish</b> — kub, prizma, piramida, shar… ✋ bilan suring, ikki barmoq bilan kattalashtiring va burang.</td></tr>
        <tr><td>📷</td><td><b>Kamera</b> — shu qurilma kamerasi doskada jonli ko‘rinadi.</td></tr>
        <tr><td>📱</td><td><b>Telefon</b> — telefonni kamera qilib ulash: doskada kod chiqadi, telefonda shu kod kiritiladi.</td></tr>
        <tr><td>🖐</td><td><b>Qo‘l ishoralari</b> (kamera yoqilgan bo‘lsin, ishorani ≈1 soniya ushlab turing):</td></tr>
        <tr><td>✌️</td><td>2 barmoq — <b>kub</b></td></tr>
        <tr><td>3</td><td>3 barmoq — <b>prizma</b> · 4 barmoq — <b>piramida</b></td></tr>
        <tr><td>🖐</td><td>ochiq kaft — <b>shar</b></td></tr>
        <tr><td>🎯</td><td>Yangi shakl <b>ekran o‘rtasida</b> chiqadi. Uni <b>uzoqdan</b> boshqarasiz — qo‘lni shaklga olib borish shart emas.</td></tr>
        <tr><td>👌</td><td>bosh va ko‘rsatkich barmoqni birlashtirib qo‘lni suring — shakl shu tomonga <b>ko‘chadi</b>; bilakni burasangiz — <b>buriladi</b>; qo‘lni kameraga yaqinlashtirsangiz — <b>kattalashadi</b>, uzoqlashtirsangiz — kichrayadi; ikki qo‘l bilan ham kattalashtirish mumkin</td></tr>
        <tr><td>✊</td><td>musht qilib qo‘lni suring — shakl <b>3D da aylanadi</b> (har tomondan ko‘rsatish uchun)</td></tr>
        <tr><td>🗑</td><td>shaklni o‘chirish — shakl ostidagi 🗑 tugmasi</td></tr>
        <tr><td>☝️</td><td>ko‘rsatkich barmoq — <b>havoda chizish</b> <label style="white-space:nowrap"><input type="checkbox" id="dkAir" ${S.airDraw ? "checked" : ""}> yoqilgan</label></td></tr>
      </table>
      <p class="muted">Yorug‘lik yaxshi bo‘lsa va qo‘l kameradan 0,5–1,5 m masofada to‘liq ko‘rinsa, ishoralar aniqroq taniladi.</p>`);
    $("dkAir").onchange = (e) => (S.airDraw = e.target.checked);
  }
  function save() {
    const c = document.createElement("canvas"); c.width = W * DPR; c.height = H * DPR; const x = c.getContext("2d");
    x.fillStyle = { board: "#0f3a2c", black: "#0b0d12", white: "#f8fafc", cam: "#000" }[S.bg]; x.fillRect(0, 0, c.width, c.height);
    if (S.bg === "cam" && video.videoWidth) { const k = Math.max(c.width / video.videoWidth, c.height / video.videoHeight), w = video.videoWidth * k, hh = video.videoHeight * k; x.save(); if (S.mirror) { x.translate(c.width, 0); x.scale(-1, 1); } x.drawImage(video, (c.width - w) / 2, (c.height - hh) / 2, w, hh); x.restore(); }
    x.drawImage(cDraw, 0, 0); renderer.render(scene, cam); x.drawImage(c3d, 0, 0, c.width, c.height);
    const a = document.createElement("a"); a.download = "doska-" + new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-") + ".png"; a.href = c.toDataURL("image/png"); a.click();
    status("💾 Rasm saqlandi", 2000);
  }
  addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "z") { S.strokes.pop(); redraw(); } if (e.key === "Escape") { panel.hidden = true; shapesEl.hidden = true; } if (e.key === "Delete" && sel) delShape(sel); });

  // ---------- asosiy sikl ----------
  let lastT = performance.now();
  function loop(t) {
    const dt = Math.min(0.1, (t - lastT) / 1000); lastT = t;
    if (S.hands && HL.lm && video.readyState >= 2 && video.videoWidth && t - HL.last > 55) {
      const ddt = Math.min(0.3, (t - HL.last) / 1000); HL.last = t;
      try { const r = HL.lm.detectForVideo(video, t); HL.lastLm = r.landmarks; processHands(r.landmarks || [], ddt); HL.count = (r.landmarks || []).length; } catch (e) { /* kadr tashlab ketiladi */ }
    }
    render3d(dt);
    requestAnimationFrame(loop);
  }
  resize(); requestAnimationFrame(loop);
  if (!localStorage.getItem("sofi_doska_seen")) { try { localStorage.setItem("sofi_doska_seen", "1"); } catch (e) { /* bo'sh */ } help(); }
})();
