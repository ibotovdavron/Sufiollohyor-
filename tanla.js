/* “Doskaga kim chiqadi?” — kamera orqali yuzlarni topib (face-api, SSD MobileNet, kafel usuli) yoki
   ismlar ro'yxatidan tasodifiy o'quvchini tanlash. Kamera tasviri hech qayerga yuborilmaydi — hammasi brauzerda. */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* bo'sh */ } } };

  const st = { mode: "cam", stream: null, faces: [], frameW: 0, frameH: 0, used: new Set(), hi: -1, picking: false, results: [], cur: null, scanning: false };
  const video = $("#tnVideo"), over = $("#tnOver"), ox = over.getContext("2d");

  // ---------- ovoz ----------
  let AC = null;
  const beep = (f, d = 0.05, type = "square", vol = 0.04) => {
    if (!$("#tnSound").checked) return;
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, AC.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + d);
      o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d); } catch (e) { /* bo'sh */ }
  };
  const fanfare = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.22, "triangle", 0.07), i * 110));
  function confetti() {
    const box = document.createElement("div"); box.className = "tn-confetti";
    const cols = ["#fde047", "#38bdf8", "#f472b6", "#22c55e", "#a78bfa", "#fb923c"];
    for (let i = 0; i < 110; i++) { const p = document.createElement("i"); p.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % cols.length]};animation-delay:${Math.random() * 0.5}s;animation-duration:${1.8 + Math.random() * 1.6}s;transform:rotate(${Math.random() * 360}deg)`; box.append(p); }
    document.body.append(box); setTimeout(() => box.remove(), 4000);
  }

  // ---------- rejim ----------
  document.querySelectorAll(".tn-tabs button").forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));
  function setMode(m) {
    st.mode = m;
    document.querySelectorAll(".tn-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.mode === m));
    $("#tnCam").hidden = m !== "cam"; $("#tnNames").hidden = m !== "names";
    $("#tnCamSet").hidden = m !== "cam"; $("#tnNameSet").hidden = m !== "names"; $("#tnScan").hidden = m !== "cam";
    $("#tnHint").textContent = m === "cam" ? "Klaviatura: Probel — tanlash, S — skanerlash" : "Klaviatura: Probel — tanlash";
    if (m === "names") drawNames();
    LS.set("tn_mode", m);
  }

  // ---------- kamera ----------
  async function listDevices() {
    try { const ds = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "videoinput"); const sel = $("#tnDev"), cur = sel.value;
      sel.innerHTML = `<option value="">Standart kamera</option>` + ds.map((d, i) => `<option value="${esc(d.deviceId)}">${esc(d.label || `Kamera ${i + 1}`)}</option>`).join(""); sel.value = cur; } catch (e) { /* bo'sh */ }
  }
  async function camOn() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { toast("Bu brauzer kamerani qo‘llamaydi. “Ismlar ro‘yxati” rejimidan foydalaning."); return; }
    try {
      if (st.stream) st.stream.getTracks().forEach((t) => t.stop());
      const id = $("#tnDev").value;
      st.stream = await navigator.mediaDevices.getUserMedia({ video: { ...(id ? { deviceId: { exact: id } } : {}), width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      video.srcObject = st.stream; await video.play();
      $("#tnCamEmpty").hidden = true; st.faces = []; st.used.clear(); badge();
      listDevices(); loop();
      setTimeout(() => { if (!st.faces.length && !st.scanning) scan(); }, 900);
    } catch (e) {
      toast(e && e.name === "NotAllowedError" ? "Kameraga ruxsat berilmadi. Brauzer manzil satridagi 📷 belgisini bosib ruxsat bering." : "Kamera topilmadi yoki band. “Ismlar ro‘yxati” rejimidan foydalaning.");
    }
  }
  $("#tnCamOn").onclick = camOn;
  $("#tnDev").onchange = () => { if (st.stream) camOn(); };

  // ---------- yuzlarni topish ----------
  let fapiP = null;
  const loadFace = () => fapiP || (fapiP = new Promise((res, rej) => {
    const go = async () => { try { await window.faceapi.nets.ssdMobilenetv1.loadFromUri("lib/face-api"); res(window.faceapi); } catch (e) { fapiP = null; rej(e); } };
    if (window.faceapi) return go();
    const s = document.createElement("script"); s.src = "lib/face-api/face-api.js?v=1.7.15"; s.onload = go; s.onerror = () => { fapiP = null; rej(new Error("yuklanmadi")); }; document.head.append(s);
  }));
  const iou = (a, b) => { const x1 = Math.max(a.x, b.x), y1 = Math.max(a.y, b.y), x2 = Math.min(a.x + a.w, b.x + b.w), y2 = Math.min(a.y + a.h, b.y + b.h); const I = Math.max(0, x2 - x1) * Math.max(0, y2 - y1); return I / (a.w * a.h + b.w * b.h - I || 1); };
  async function scan() {
    if (st.mode !== "cam") return;
    if (!st.stream) { await camOn(); return; }
    if (st.scanning || st.picking) return;
    st.scanning = true; badge("⏳ Sun’iy intellekt yuklanmoqda…");
    let fa;
    try { fa = await loadFace(); } catch (e) { st.scanning = false; badge(); toast("Yuz aniqlash modeli yuklanmadi. Internetni tekshiring yoki “Ismlar ro‘yxati” rejimidan foydalaning."); return; }
    badge("🔍 Yuzlar qidirilmoqda…");
    const W = video.videoWidth, H = video.videoHeight; if (!W) { st.scanning = false; badge(); return; }
    const snap = document.createElement("canvas"); snap.width = W; snap.height = H; snap.getContext("2d").drawImage(video, 0, 0, W, H);
    const opt = new fa.SsdMobilenetv1Options({ minConfidence: 0.4, maxResults: 120 });
    const found = [];
    const run = async (sx, sy, sw, sh) => {
      const t = document.createElement("canvas"), k = Math.min(2.5, 900 / Math.max(sw, sh)) ; t.width = Math.round(sw * k); t.height = Math.round(sh * k);
      t.getContext("2d").drawImage(snap, sx, sy, sw, sh, 0, 0, t.width, t.height);
      const ds = await fa.detectAllFaces(t, opt);
      ds.forEach((d) => { const b = d.box; found.push({ x: sx + b.x / k, y: sy + b.y / k, w: b.width / k, h: b.height / k, s: d.score }); });
    };
    try {
      const grids = [[2, 2], [3, 2]], total = 1 + grids.reduce((a, g) => a + g[0] * g[1], 0); let done = 0;
      const tick = () => badge(`🔍 Yuzlar qidirilmoqda… ${Math.round((++done / total) * 100)}%`);
      await run(0, 0, W, H); tick();
      // kafellar: uzoqdagi kichik yuzlar uchun (ustma-ust tushish bilan)
      for (const [nx, ny] of grids) {
        const tw = W / nx * 1.3, th = H / ny * 1.3;
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const sx = Math.max(0, Math.min(W - tw, (i * W) / nx - (tw - W / nx) / 2)), sy = Math.max(0, Math.min(H - th, (j * H) / ny - (th - H / ny) / 2));
          await run(sx, sy, tw, th); tick();
        }
      }
    } catch (e) { st.scanning = false; badge(); toast("Yuzlarni aniqlashda xato: " + (e.message || e)); return; }
    // ustma-ust tushganlarni birlashtirish (NMS)
    found.sort((a, b) => b.s - a.s);
    const keep = [];
    found.forEach((f) => { if (f.w < 10 || f.w > W * 0.5) return; if (!keep.some((k) => iou(k, f) > 0.25 || (Math.abs(k.x + k.w / 2 - f.x - f.w / 2) < k.w * 0.5 && Math.abs(k.y + k.h / 2 - f.y - f.h / 2) < k.h * 0.5))) keep.push(f); });
    keep.sort((a, b) => a.y + a.h / 2 - (b.y + b.h / 2) || a.x - b.x);
    st.faces = keep.map((f) => ({ ...f, thumb: crop(snap, f) }));
    st.frameW = W; st.frameH = H; st.used.clear(); st.scanning = false; badge();
    if (!st.faces.length) toast("Yuz topilmadi. Kamerani sinfga to‘g‘rilang, yorug‘likni yoqing va qayta “Skanerlash”ni bosing.");
  }
  function crop(src, f) {
    const pad = 0.65, cx = f.x + f.w / 2, cy = f.y + f.h / 2, s = Math.max(f.w, f.h) * (1 + pad * 2);
    const c = document.createElement("canvas"); c.width = c.height = 320;
    c.getContext("2d").drawImage(src, cx - s / 2, cy - s / 2, s, s, 0, 0, 320, 320);
    return c.toDataURL("image/jpeg", 0.85);
  }
  function badge(txt) {
    const b = $("#tnBadge");
    if (txt) { b.hidden = false; b.textContent = txt; return; }
    if (st.mode === "cam" && st.stream) { b.hidden = false; const left = st.faces.length - st.used.size; b.innerHTML = `Topildi: <b>${st.faces.length}</b> o‘quvchi${$("#tnNoRepeat").checked && st.used.size ? ` · qoldi: <b>${left}</b>` : ""}`; }
    else b.hidden = true;
  }
  // ---------- chizish ----------
  function loop() {
    if (!st.stream) return;
    requestAnimationFrame(loop);
    const r = over.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    if (over.width !== Math.round(r.width * dpr)) { over.width = Math.round(r.width * dpr); over.height = Math.round(r.height * dpr); }
    ox.setTransform(dpr, 0, 0, dpr, 0, 0); ox.clearRect(0, 0, r.width, r.height);
    const W = video.videoWidth, H = video.videoHeight; if (!W || !st.faces.length) return;
    // object-fit: contain
    const k = Math.min(r.width / W, r.height / H), offX = (r.width - W * k) / 2, offY = (r.height - H * k) / 2;
    const t = performance.now() / 1000;
    st.faces.forEach((f, i) => {
      const x = offX + f.x * k, y = offY + f.y * k, w = f.w * k, h = f.h * k, on = i === st.hi, used = st.used.has(i);
      const c = on ? "#38bdf8" : used ? "rgba(148,163,184,.55)" : "#22c55e", L = Math.max(6, w * 0.28), pad = on ? 6 + Math.sin(t * 12) * 2 : 2;
      ox.strokeStyle = c; ox.lineWidth = on ? 4 : 2;
      ox.beginPath();
      [[x - pad, y - pad, 1, 1], [x + w + pad, y - pad, -1, 1], [x - pad, y + h + pad, 1, -1], [x + w + pad, y + h + pad, -1, -1]].forEach(([px, py, sx, sy]) => { ox.moveTo(px + sx * L, py); ox.lineTo(px, py); ox.lineTo(px, py + sy * L); });
      ox.stroke();
      if (on) { ox.fillStyle = "rgba(56,189,248,.18)"; ox.fillRect(x - pad, y - pad, w + 2 * pad, h + 2 * pad); }
      if (used && !on) { ox.fillStyle = "rgba(15,23,42,.55)"; ox.font = `700 ${Math.max(10, w * 0.4)}px system-ui`; ox.textAlign = "center"; ox.fillText("✓", x + w / 2, y + h * 0.7); }
    });
  }

  // ---------- ismlar ----------
  let classes = LS.get("tn_classes", { "Mening sinfim": [] }), curClass = LS.get("tn_class", Object.keys(classes)[0]);
  if (!classes[curClass]) curClass = Object.keys(classes)[0];
  function fillClasses() { $("#tnClass").innerHTML = Object.keys(classes).map((c) => `<option ${c === curClass ? "selected" : ""}>${esc(c)}</option>`).join(""); $("#tnList").value = (classes[curClass] || []).join("\n"); }
  const names = () => (classes[curClass] || []).filter(Boolean);
  function drawNames() {
    const n = names(), box = $("#tnNames");
    if (!n.length) { box.innerHTML = `<div class="tn-empty"><div class="tn-empty-ic">📝</div><b>Ro‘yxat bo‘sh</b><p>O‘ng tomondagi maydonga o‘quvchilar ismini yozing (har qatorda bittadan). Ro‘yxat shu kompyuterda saqlanadi.</p></div>`; return; }
    box.innerHTML = `<div class="tn-chips">${n.map((x, i) => `<span class="tn-chip${st.used.has(i) ? " used" : ""}${i === st.hi ? " on" : ""}" data-i="${i}">${esc(x)}</span>`).join("")}</div>`;
  }
  $("#tnList").oninput = () => { classes[curClass] = $("#tnList").value.split("\n").map((s) => s.trim()).filter(Boolean); LS.set("tn_classes", classes); st.used.clear(); drawNames(); };
  $("#tnClass").onchange = () => { curClass = $("#tnClass").value; LS.set("tn_class", curClass); st.used.clear(); fillClasses(); drawNames(); };
  $("#tnClassNew").onclick = () => { const n = (prompt("Yangi sinf nomi (masalan: 7-A):") || "").trim(); if (!n) return; classes[n] = classes[n] || []; curClass = n; LS.set("tn_classes", classes); LS.set("tn_class", n); fillClasses(); drawNames(); };
  $("#tnClassDel").onclick = () => { if (Object.keys(classes).length < 2) { toast("Kamida bitta sinf qolishi kerak."); return; } if (!confirm(`“${curClass}” sinfi o‘chirilsinmi?`)) return; delete classes[curClass]; curClass = Object.keys(classes)[0]; LS.set("tn_classes", classes); LS.set("tn_class", curClass); fillClasses(); drawNames(); };

  // ---------- tanlash ----------
  async function pick() {
    if (st.picking) return;
    const pool = st.mode === "cam" ? st.faces : names();
    if (st.mode === "cam" && !st.stream) { await camOn(); return; }
    if (st.mode === "cam" && !pool.length) { await scan(); if (!st.faces.length) return; return pick(); }
    if (!pool.length) { toast("Avval o‘quvchilar ismini kiriting."); return; }
    let cand = pool.map((_, i) => i).filter((i) => !$("#tnNoRepeat").checked || !st.used.has(i));
    if (!cand.length) { toast("Hamma o‘quvchi chiqdi! Ro‘yxat qaytadan boshlanadi. 🎉"); st.used.clear(); cand = pool.map((_, i) => i); }
    st.picking = true; $("#tnPick").disabled = true;
    const final = cand[(Math.random() * cand.length) | 0];
    const steps = Math.min(24, 12 + cand.length); let delay = 50, prev = -1;
    for (let s = 0; s < steps; s++) {
      let i = s === steps - 1 ? final : cand[(Math.random() * cand.length) | 0];
      if (i === prev && cand.length > 1) i = cand[(cand.indexOf(i) + 1) % cand.length];
      if (s === steps - 1) i = final;
      st.hi = i; prev = i; if (st.mode === "names") drawNames();
      beep(s === steps - 1 ? 880 : 420 + (s % 2) * 80, 0.04);
      await new Promise((r) => setTimeout(r, delay)); delay *= 1.085;
    }
    await new Promise((r) => setTimeout(r, 450));
    st.cur = final; show(final); st.picking = false; $("#tnPick").disabled = false;
  }
  function show(i) {
    const task = $("#tnTask").value.trim() || "Doskaga chiqing!";
    if (st.mode === "cam") { $("#tnFace").innerHTML = `<img src="${st.faces[i].thumb}" alt="Tanlangan o‘quvchi">`; $("#tnWho").textContent = `${i + 1}-o‘quvchi`; }
    else { const n = names()[i]; $("#tnFace").innerHTML = `<span class="tn-initial">${esc((n || "?").trim().charAt(0).toUpperCase())}</span>`; $("#tnWho").textContent = n; }
    $("#tnTaskOut").textContent = task;
    $("#tnModal").hidden = false; fanfare(); confetti();
  }
  $("#tnModal").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-r]"); if (!b) return;
    const i = st.cur, r = b.dataset.r;
    if (r !== "skip") st.used.add(i);
    if (r === "skip") st.used.delete(i);
    st.results.unshift({ r, who: st.mode === "cam" ? `${i + 1}-o‘quvchi` : names()[i], img: st.mode === "cam" ? st.faces[i].thumb : null, t: new Date().toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" }) });
    if (r === "ok") { beep(1046, 0.2, "triangle", 0.08); } else if (r === "bad") beep(180, 0.3, "sawtooth", 0.05);
    $("#tnModal").hidden = true; st.hi = -1; st.cur = null; badge(); drawRes(); if (st.mode === "names") drawNames();
  });
  function drawRes() {
    const ok = st.results.filter((x) => x.r === "ok").length, bad = st.results.filter((x) => x.r === "bad").length, sk = st.results.filter((x) => x.r === "skip").length;
    $("#tnScore").innerHTML = `<span class="ok">✅ ${ok}</span><span class="bad">❌ ${bad}</span><span>⏭ ${sk}</span>`;
    $("#tnRes").innerHTML = st.results.length ? st.results.map((x) => `<div class="tn-ri ${x.r}">${x.img ? `<img src="${x.img}" alt="">` : `<span class="tn-ri-av">${esc((x.who || "?").charAt(0))}</span>`}<b>${esc(x.who || "")}</b><em>${x.r === "ok" ? "✅ To‘g‘ri" : x.r === "bad" ? "❌ Noto‘g‘ri" : "⏭ O‘tkazildi"}</em><small>${x.t}</small></div>`).join("") : `<p class="tn-muted">Hali hech kim tanlanmadi.</p>`;
  }
  $("#tnResClear").onclick = () => { if (st.results.length && !confirm("Natijalar tozalansinmi?")) return; st.results = []; st.used.clear(); badge(); drawRes(); if (st.mode === "names") drawNames(); };
  $("#tnPick").onclick = pick;
  $("#tnScan").onclick = () => { st.faces = []; scan(); };
  $("#tnNoRepeat").onchange = badge;
  $("#tnFs").onclick = () => { const el = $("#tnApp"); try { document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen(); } catch (e) { /* bo'sh */ } };
  document.addEventListener("keydown", (e) => {
    if (/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || "")) return;
    if (!$("#tnModal").hidden) { if (e.key === "1") $("#tnModal [data-r=ok]").click(); if (e.key === "2") $("#tnModal [data-r=bad]").click(); if (e.key === "3" || e.key === "Escape") $("#tnModal [data-r=skip]").click(); return; }
    if (e.code === "Space") { e.preventDefault(); pick(); } else if (e.key === "s" || e.key === "S") { st.faces = []; scan(); }
  });
  function toast(t) { const d = document.createElement("div"); d.className = "tn-toast"; d.textContent = t; document.body.append(d); setTimeout(() => d.remove(), 4200); }

  fillClasses(); drawRes(); setMode(LS.get("tn_mode", "cam"));
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) listDevices();
})();
