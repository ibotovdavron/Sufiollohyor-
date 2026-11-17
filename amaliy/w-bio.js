/* BIOLOGIYA jonli tajribalari (1-qism):
   microscope — virtual mikroskop (piyoz, og‘iz epiteliysi, elodeya, tufelka, bakteriya, qon, suvo‘t, ustitsalar)
   cell — interaktiv hujayra (o‘simlik / hayvon / bakteriya)    heart — uradigan yurak va qon aylanish doiralari
   breath — nafas olish (o‘pka va diafragma)    reaction — reaksiya tezligi testi va refleks yoyi
   arm — antagonist muskullar (biseps / triseps)    digest — ovqatning hazm yo‘li bo‘ylab sayohati
   photosyn — fotosintez (elodeyada kislorod pufakchalari)    enzyme — amilazaning kraxmalga ta’siri (yod sinamasi)
   phago — leykotsit bakteriyalarni yutadi (fagotsitoz) */
(() => {
  "use strict";
  const { h, s, svg, slider, buttons, button, frame, W } = window.AK;
  const { animCanvas, label } = window.FIZ;
  const PI = Math.PI, TAU = PI * 2;
  /** Takrorlanuvchi tasodifiy sonlar (har safar bir xil manzara) */
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  window.BIO = { rng, clamp };

  // ===================================================================
  // 1. VIRTUAL MIKROSKOP
  // ===================================================================
  const SPEC = {
    piyoz: {
      name: "🧅 Piyoz po‘sti (yod bilan bo‘yalgan)", bg: "#f5e9c8", min: 40,
      info: "Piyoz po‘sti hujayralari cho‘ziq, g‘ishtdek terilgan. Har birida <b>hujayra devori</b> (qalin chegara), <b>sitoplazma</b> va yod bilan to‘q sariq bo‘yalgan <b>yadro</b> ko‘rinadi. Xloroplast yo‘q — piyoz po‘sti yorug‘likda emas.",
      init(R) { const cells = []; for (let r = -8; r <= 8; r++) { const off = (r % 2) * 0.5; for (let k = -6; k <= 6; k++) cells.push({ x: (k + off) * 110 + (R() - 0.5) * 8, y: r * 34, w: 104 + (R() - 0.5) * 10, h: 30, nx: (R() - 0.5) * 50, ny: (R() - 0.5) * 6 }); } return { cells }; },
      draw(c, d) {
        for (const q of d.cells) {
          c.fillStyle = "#f3d9a0"; c.strokeStyle = "#8a5a1a"; c.lineWidth = 2.2; c.beginPath(); c.rect(q.x - q.w / 2, q.y - q.h / 2, q.w, q.h); c.fill(); c.stroke();
          c.fillStyle = "#b9651c"; c.beginPath(); c.ellipse(q.x + q.nx, q.y + q.ny, 8, 6, 0, 0, TAU); c.fill(); c.fillStyle = "#7c2d12"; c.beginPath(); c.arc(q.x + q.nx + 2, q.y + q.ny - 1, 2, 0, TAU); c.fill();
        }
      },
      labels(d) { const q = d.cells.find((x) => Math.abs(x.x) < 60 && Math.abs(x.y) < 20) || d.cells[0]; return [["Hujayra devori", q.x - q.w / 2, q.y - q.h / 2], ["Yadro", q.x + q.nx, q.y + q.ny], ["Sitoplazma", q.x + q.w * 0.3, q.y + 6]]; },
    },
    epiteliy: {
      name: "👄 Og‘iz bo‘shlig‘i epiteliysi (metilen ko‘ki)", bg: "#eef4fb", min: 100,
      info: "Odam hujayralari yassi, noto‘g‘ri ko‘pburchak shaklda, <b>hujayra devori yo‘q</b> — faqat yupqa <b>membrana</b>. Markazda ko‘k bo‘yalgan <b>yadro</b>. O‘simlik hujayrasidan farqi: devor, plastida va katta vakuola yo‘q.",
      init(R) { const cells = []; for (let i = 0; i < 26; i++) { const a = R() * TAU, r = 30 + R() * 230, n = 7, pts = []; for (let k = 0; k < n; k++) { const t = (k / n) * TAU; pts.push([Math.cos(t) * (34 + R() * 12), Math.sin(t) * (28 + R() * 12)]); } cells.push({ x: Math.cos(a) * r, y: Math.sin(a) * r * 0.7, rot: R() * TAU, pts }); } return { cells }; },
      draw(c, d) {
        for (const q of d.cells) {
          c.save(); c.translate(q.x, q.y); c.rotate(q.rot);
          c.fillStyle = "rgba(147,197,253,.35)"; c.strokeStyle = "rgba(37,99,235,.6)"; c.lineWidth = 1.2; c.beginPath(); q.pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); c.fill(); c.stroke();
          c.fillStyle = "#1e40af"; c.beginPath(); c.ellipse(2, 0, 7, 6, 0, 0, TAU); c.fill(); c.restore();
        }
      },
      labels(d) { const q = d.cells.reduce((a, b) => (Math.hypot(a.x, a.y) < Math.hypot(b.x, b.y) ? a : b)); return [["Yadro", q.x, q.y], ["Hujayra membranasi", q.x + 34, q.y - 14], ["Sitoplazma", q.x - 18, q.y + 14]]; },
    },
    elodeya: {
      name: "🌿 Elodeya bargi (tirik hujayralar)", bg: "#e7f5df", min: 100,
      info: "Tirik barg hujayralarida yashil <b>xloroplastlar</b> devor bo‘ylab aylanib harakatlanadi — bu <b>sitoplazma harakati (siklez)</b>. Xloroplastlarda <b>fotosintez</b> bo‘ladi. Ko‘rinib turgan qalin chegara — <b>hujayra devori</b>.",
      init(R) { const cells = []; for (let r = -5; r <= 5; r++) for (let k = -5; k <= 5; k++) { const ch = []; for (let i = 0; i < 16; i++) ch.push({ p: R(), sp: 0.04 + R() * 0.03 }); cells.push({ x: k * 70 + (r % 2) * 35, y: r * 44, w: 66, h: 40, ch }); } return { cells }; },
      draw(c, d, t) {
        for (const q of d.cells) {
          c.fillStyle = "#d9f2c9"; c.strokeStyle = "#3f6212"; c.lineWidth = 2; c.beginPath(); c.rect(q.x - q.w / 2, q.y - q.h / 2, q.w, q.h); c.fill(); c.stroke();
          const P = 2 * (q.w + q.h) - 24;
          for (const k of q.ch) {
            let u = ((k.p + t * k.sp) % 1) * P, x, y; const W2 = q.w - 12, H2 = q.h - 12;
            if (u < W2) { x = -W2 / 2 + u; y = -H2 / 2; } else if ((u -= W2) < H2) { x = W2 / 2; y = -H2 / 2 + u; } else if ((u -= H2) < W2) { x = W2 / 2 - u; y = H2 / 2; } else { u -= W2; x = -W2 / 2; y = H2 / 2 - u; }
            c.fillStyle = "#15803d"; c.beginPath(); c.ellipse(q.x + x, q.y + y, 4, 2.6, 0, 0, TAU); c.fill();
          }
        }
      },
      labels(d) { const q = d.cells[60]; return [["Xloroplast", q.x - q.w / 2 + 8, q.y - q.h / 2 + 6], ["Hujayra devori", q.x + q.w / 2, q.y], ["Vakuola", q.x, q.y]]; },
    },
    tufelka: {
      name: "🦠 Tufelka infuzoriyasi (tirik)", bg: "#eef7f5", min: 40,
      info: "Tufelka — bir hujayrali hayvonsimon organizm. U tanasidagi minglab <b>kiprikchalar</b> yordamida buralib suzadi. Ichida <b>hazm vakuolalari</b>, ritmik qisqaruvchi <b>qisqaruvchi vakuolalar</b> (ortiqcha suvni chiqaradi) va ikkita yadro bor.",
      init(R) { const o = []; for (let i = 0; i < 4; i++) o.push({ x: (R() - 0.5) * 300, y: (R() - 0.5) * 200, a: R() * TAU, v: 30 + R() * 25, ph: R() * 6 }); const dirt = []; for (let i = 0; i < 40; i++) dirt.push([(R() - 0.5) * 700, (R() - 0.5) * 500, 1 + R() * 3]); return { o, dirt }; },
      draw(c, d, t, dt) {
        c.fillStyle = "rgba(120,113,108,.35)"; for (const [x, y, r] of d.dirt) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
        for (const p of d.o) {
          p.a += Math.sin(t * 0.7 + p.ph) * dt * 0.8; p.x += Math.cos(p.a) * p.v * dt; p.y += Math.sin(p.a) * p.v * dt;
          if (Math.hypot(p.x, p.y) > 260) p.a = Math.atan2(-p.y, -p.x) + (Math.random() - 0.5);
          c.save(); c.translate(p.x, p.y); c.rotate(p.a);
          c.strokeStyle = "rgba(13,148,136,.55)"; c.lineWidth = 1; for (let k = 0; k < 40; k++) { const u = (k / 40) * TAU, ex = Math.cos(u) * 40, ey = Math.sin(u) * 15 * (1 - 0.25 * Math.cos(u * 2)); c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex * 1.12 + Math.sin(t * 20 + k) * 1.5, ey * 1.25); c.stroke(); }
          c.fillStyle = "rgba(204,251,241,.85)"; c.strokeStyle = "#0f766e"; c.lineWidth = 1.5; c.beginPath(); c.ellipse(0, 0, 40, 15, 0, 0, TAU); c.fill(); c.stroke();
          c.fillStyle = "#a16207"; for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(-18 + k * 9, (k % 2 ? 5 : -4), 3, 0, TAU); c.fill(); }
          const pulse = 3 + 2.5 * Math.max(0, Math.sin(t * 4 + p.ph)); c.fillStyle = "rgba(59,130,246,.55)"; c.beginPath(); c.arc(-28, 0, pulse, 0, TAU); c.fill(); c.beginPath(); c.arc(26, 0, 5 - pulse + 3, 0, TAU); c.fill();
          c.fillStyle = "#6d28d9"; c.beginPath(); c.ellipse(4, 0, 9, 5, 0, 0, TAU); c.fill();
          c.restore();
        }
      },
      labels(d) { const p = d.o[0]; return [["Kiprikchalar", p.x + Math.cos(p.a) * 44, p.y + Math.sin(p.a) * 44], ["Yadro", p.x, p.y]]; },
    },
    bakteriya: {
      name: "🧫 Pichan tayoqchasi (bakteriyalar)", bg: "#f6f1fb", min: 400,
      info: "Bakteriyalar juda kichik (1–5 mkm) — ularni faqat katta kattalashtirishda ko‘rish mumkin. Pichan tayoqchasi — <b>tayoqchasimon (batsilla)</b>, ba’zilari zanjir hosil qiladi. <b>Yadrosi yo‘q</b> — prokariot.",
      init(R) { const b = []; for (let i = 0; i < 140; i++) b.push({ x: (R() - 0.5) * 520, y: (R() - 0.5) * 380, a: R() * TAU, l: 7 + R() * 5, ch: R() < 0.25 ? 2 + Math.floor(R() * 3) : 1, v: R() * 6 }); return { b }; },
      draw(c, d, t, dt) {
        c.fillStyle = "#7c3aed"; c.lineCap = "round";
        for (const q of d.b) {
          q.a += (Math.random() - 0.5) * dt; q.x += Math.cos(q.a) * q.v * dt; q.y += Math.sin(q.a) * q.v * dt;
          c.strokeStyle = "#6d28d9"; c.lineWidth = 2.6;
          for (let k = 0; k < q.ch; k++) { const ox = Math.cos(q.a) * (q.l + 1.5) * k, oy = Math.sin(q.a) * (q.l + 1.5) * k; c.beginPath(); c.moveTo(q.x + ox, q.y + oy); c.lineTo(q.x + ox + Math.cos(q.a) * q.l, q.y + oy + Math.sin(q.a) * q.l); c.stroke(); }
        }
        c.lineCap = "butt";
      },
      labels(d) { const q = d.b.find((x) => x.ch > 1) || d.b[0]; return [["Bakteriyalar zanjiri", q.x, q.y]]; },
    },
    qon: {
      name: "🩸 Odam qoni surtmasi", bg: "#fbf0f0", min: 400,
      info: "<b>Eritrotsitlar</b> — yadrosiz, ikki tomoni botiq qizil disklar (1 mm³ da 4,5–5 mln), kislorod tashiydi. <b>Leykotsitlar</b> — yadroli, kattaroq, binafsha bo‘yalgan (6–8 ming), mikroblarni yo‘q qiladi. Mayda <b>trombotsitlar</b> qon ivishida qatnashadi.",
      init(R) { const e = []; for (let i = 0; i < 160; i++) e.push([(R() - 0.5) * 560, (R() - 0.5) * 420]); const l = []; for (let i = 0; i < 4; i++) l.push([(R() - 0.5) * 320, (R() - 0.5) * 240]); const tr = []; for (let i = 0; i < 25; i++) tr.push([(R() - 0.5) * 520, (R() - 0.5) * 380]); return { e, l, tr }; },
      draw(c, d) {
        for (const [x, y] of d.e) { const g = c.createRadialGradient(x, y, 2, x, y, 9); g.addColorStop(0, "#fca5a5"); g.addColorStop(0.6, "#ef4444"); g.addColorStop(1, "#b91c1c"); c.fillStyle = g; c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill(); }
        for (const [x, y] of d.l) { c.fillStyle = "#e9d5ff"; c.beginPath(); c.arc(x, y, 15, 0, TAU); c.fill(); c.fillStyle = "#6b21a8"; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(x - 6 + k * 6, y + (k % 2 ? 3 : -3), 4.5, 0, TAU); c.fill(); } }
        c.fillStyle = "#a855f7"; for (const [x, y] of d.tr) { c.beginPath(); c.arc(x, y, 2, 0, TAU); c.fill(); }
      },
      labels(d) { const [x, y] = d.l[0]; return [["Leykotsit", x, y], ["Eritrotsit", d.e[0][0], d.e[0][1]], ["Trombotsit", d.tr[0][0], d.tr[0][1]]]; },
    },
    suvot: {
      name: "🟢 Ko‘k-yashil suvo‘t (sianobakteriya — nostok)", bg: "#effaf3", min: 100,
      info: "Sianobakteriyalar — fotosintez qiluvchi <b>prokariotlar</b>. Nostok hujayralari marjondek ipga tizilgan; orasida kattaroq <b>geterotsistalar</b> — havodagi azotni o‘zlashtiradi.",
      init(R) { const f = []; for (let i = 0; i < 9; i++) { let x = (R() - 0.5) * 420, y = (R() - 0.5) * 300, a = R() * TAU; const pts = []; for (let k = 0; k < 26; k++) { a += (R() - 0.5) * 0.6; x += Math.cos(a) * 11; y += Math.sin(a) * 11; pts.push([x, y, R() < 0.07]); } f.push(pts); } return { f }; },
      draw(c, d, t) { for (const pts of d.f) pts.forEach(([x, y, het], i) => { c.fillStyle = het ? "#fde68a" : "#0d9488"; c.strokeStyle = "#115e59"; c.beginPath(); c.arc(x + Math.sin(t + i * 0.3) * 0.6, y, het ? 6.5 : 5, 0, TAU); c.fill(); c.stroke(); }); },
      labels(d) { const p = d.f[0][10]; const hz = d.f.flat().find((q) => q[2]) || p; return [["Hujayralar ipi", p[0], p[1]], ["Geterotsista", hz[0], hz[1]]]; },
    },
    ustitsa: {
      name: "🍃 Barg epidermisi — ustitsalar", bg: "#eef9e8", min: 100,
      info: "Barg ostidagi <b>ustitsalar</b> — ikkita loviyasimon <b>tutashtiruvchi hujayra</b> orasidagi tirqish. Yorug‘likda va suv yetarli bo‘lganda ochiladi: CO₂ kiradi, O₂ va suv bug‘i chiqadi (<b>transpiratsiya</b>). “Yorug‘lik” surgichini o‘zgartiring!",
      init(R) { const st = []; for (let i = 0; i < 18; i++) st.push([(R() - 0.5) * 460, (R() - 0.5) * 320, R() * PI]); const ep = []; for (let i = 0; i < 70; i++) ep.push([(R() - 0.5) * 560, (R() - 0.5) * 420, 26 + R() * 14, R() * PI]); return { st, ep }; },
      draw(c, d, t, dt, st) {
        c.strokeStyle = "rgba(77,124,15,.45)"; c.lineWidth = 1.4; for (const [x, y, r, a] of d.ep) { c.beginPath(); c.ellipse(x, y, r, r * 0.6, a, 0, TAU); c.stroke(); }
        const open = clamp((st.light - 20) / 70, 0, 1);
        for (const [x, y, a] of d.st) {
          c.save(); c.translate(x, y); c.rotate(a);
          c.fillStyle = "#4ade80"; c.strokeStyle = "#166534"; c.lineWidth = 1.5;
          for (const sg of [-1, 1]) { c.beginPath(); c.ellipse(sg * (5 + open * 3), 0, 6, 14, 0, 0, TAU); c.fill(); c.stroke(); c.fillStyle = "#15803d"; c.beginPath(); c.arc(sg * (5 + open * 3), -4, 1.6, 0, TAU); c.arc(sg * (5 + open * 3), 4, 1.6, 0, TAU); c.fill(); c.fillStyle = "#4ade80"; }
          c.fillStyle = "#14532d"; c.beginPath(); c.ellipse(0, 0, 0.6 + open * 3.2, 9, 0, 0, TAU); c.fill();
          c.restore();
        }
      },
      labels(d) { const [x, y] = d.st[0]; return [["Ustitsa tirqishi", x, y], ["Tutashtiruvchi hujayra", x + 10, y + 12]]; },
    },
  };
  W.microscope = (root, p) => {
    const keys = p.specs || Object.keys(SPEC);
    let key = p.spec || keys[0], mag = Math.max(SPEC[key].min, p.mag || 100), focus = 30, light = 70, showLab = false;
    const { stage, controls, out } = frame(root, p.title || "🔬 Virtual mikroskop — fokus va kattalashtirishni sozlang");
    const data = {}; keys.forEach((k, i) => (data[k] = SPEC[k].init(rng(1234 + i * 97))));
    const st = { light };
    const target = 50;
    animCanvas(stage, 320, 320, (c, dt, t) => {
      const sp = SPEC[key], R = 152, cx = 160, cy = 160, z = mag / 100 * 0.55;
      c.clearRect(0, 0, 320, 320);
      c.fillStyle = "#0b0f14"; c.fillRect(0, 0, 320, 320);
      c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
      c.fillStyle = sp.bg; c.fillRect(0, 0, 320, 320);
      const blur = Math.abs(focus - target) / 6;
      if ("filter" in c) c.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
      c.save(); c.translate(cx, cy); c.scale(z, z); st.light = light; sp.draw(c, data[key], t, dt, st); c.restore();
      if ("filter" in c) c.filter = "none";
      const dark = clamp(1 - light / 100, 0, 0.92); if (dark > 0.02) { c.fillStyle = `rgba(0,0,0,${dark})`; c.fillRect(0, 0, 320, 320); }
      const vg = c.createRadialGradient(cx, cy, R * 0.6, cx, cy, R); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.55)"); c.fillStyle = vg; c.fillRect(0, 0, 320, 320);
      c.restore();
      c.strokeStyle = "#334155"; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R + 3, 0, TAU); c.stroke();
      if (showLab && blur < 1.5 && sp.labels) for (const [txt, x, y] of sp.labels(data[key])) { const sx = cx + x * z, sy = cy + y * z; if (Math.hypot(sx - cx, sy - cy) > R - 10) continue; c.strokeStyle = "#fde047"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 18, sy - 18); c.stroke(); c.beginPath(); c.arc(sx, sy, 2.5, 0, TAU); c.fillStyle = "#fde047"; c.fill(); label(c, sx + 18 + 40, sy - 22, txt, "#fde047", "rgba(0,0,0,.7)", 11); }
      label(c, 270, 302, `×${mag}`, "#e2e8f0", "rgba(15,23,42,.8)", 12);
    });
    const magBtns = () => [40, 100, 400].map((m) => `×${m}`);
    const magSeg = buttons(magBtns(), (i) => { mag = [40, 100, 400][i]; if (mag < SPEC[key].min) out.innerHTML = `⚠️ Bu ob’ektni ko‘rish uchun kamida <b>×${SPEC[key].min}</b> kerak.`; else info(); }, [40, 100, 400].indexOf(mag));
    controls.append(
      buttons(keys.map((k) => SPEC[k].name), (i) => { key = keys[i]; if (mag < SPEC[key].min) { mag = SPEC[key].min; magSeg.querySelectorAll("button").forEach((b, j) => b.classList.toggle("on", [40, 100, 400][j] === mag)); } focus = 20 + Math.random() * 60; fs.set(focus); info(); }, keys.indexOf(key)),
      magSeg,
    );
    const fs = slider({ label: "🎯 Fokus (vint)", min: 0, max: 100, value: focus, fmt: (v) => (Math.abs(v - target) < 6 ? "aniq ✅" : "xira"), onInput: (v) => { focus = v; info(); } });
    controls.append(fs, slider({ label: "💡 Yorug‘lik (ko‘zgu/diafragma)", min: 5, max: 100, value: light, fmt: (v) => v + " %", onInput: (v) => (light = v) }), button("🏷 Belgilar", (e) => { showLab = !showLab; e.target.classList.toggle("on", showLab); }));
    function info() {
      const sp = SPEC[key], sharp = Math.abs(focus - target) < 6;
      out.innerHTML = (sharp ? "" : "🎯 <b>Fokus vintini aylantiring</b> — tasvir hali xira. ") + sp.info + `<br><small>Kattalashtirish = okulyar × obyektiv (masalan, 10× × 40× = ×400).</small>`;
    }
    info();
  };

  // ===================================================================
  // 2. INTERAKTIV HUJAYRA
  // ===================================================================
  const ORG = {
    membrana: ["Hujayra membranasi", "Hujayrani o‘rab turadi, moddalarning kirib-chiqishini nazorat qiladi (yarim o‘tkazuvchan). Lipid ikki qavati va oqsillardan iborat."],
    devor: ["Hujayra devori", "O‘simliklarda <b>sellyulozadan</b>, zamburug‘larda <b>xitindan</b>, bakteriyalarda <b>mureindan</b> iborat qattiq qobiq. Shakl va himoya beradi."],
    sitoplazma: ["Sitoplazma", "Hujayraning ichki yarim suyuq muhiti; organoidlar shu yerda joylashgan, unda moddalar almashinuvi reaksiyalari boradi."],
    yadro: ["Yadro", "Irsiy axborot (DNK, xromosomalar) saqlanadigan “boshqaruv markazi”. Ikki qavatli membranasida teshiklar (poralar) bor."],
    yadrocha: ["Yadrocha", "Yadro ichidagi zich tanacha — ribosomalar shu yerda yig‘iladi."],
    mitoxondriya: ["Mitoxondriya", "Hujayraning “elektr stansiyasi”: kislorod yordamida glukozani parchalab, <b>ATF</b> (energiya) hosil qiladi. Ikki membranali, o‘z DNKsi bor."],
    ribosoma: ["Ribosomalar", "Mayda membranasiz organoidlar — <b>oqsil sintezi</b> shu yerda bo‘ladi. Prokariot va eukariotlarda bor."],
    ept: ["Endoplazmatik to‘r (EPT)", "Kanalchalar tizimi: <b>donador EPT</b> (ribosomali) oqsil sintezlaydi, <b>silliq EPT</b> lipid va uglevodlarni."],
    golji: ["Golji majmuasi", "Moddalarni “qadoqlaydi”, saralaydi va hujayradan tashqariga chiqarishga tayyorlaydi; lizosomalarni hosil qiladi."],
    lizosoma: ["Lizosomalar", "Fermentli pufakchalar — keraksiz moddalar va eskirgan organoidlarni hazm qiladi (“hujayra tozalovchisi”)."],
    vakuola: ["Markaziy vakuola", "O‘simlik hujayrasidagi hujayra shirasi bilan to‘lgan katta pufak: suv zahirasi, turgor bosimi, keraksiz moddalar."],
    xloroplast: ["Xloroplastlar", "Yashil plastidalar, ichida <b>xlorofill</b>. Yorug‘lik energiyasi hisobiga CO₂ va suvdan glukoza hosil qiladi — <b>fotosintez</b>."],
    sentriola: ["Sentriolalar", "Hayvon hujayrasida — hujayra bo‘linishida bo‘linish urchug‘ini hosil qiladi."],
    nukleoid: ["Nukleoid", "Bakteriyada yadro o‘rnida — membranasiz, halqasimon DNK joylashgan soha."],
    plazmida: ["Plazmidalar", "Kichik halqasimon DNK molekulalari; masalan, antibiotikka chidamlilik genlarini tashiydi. Gen muhandisligida ishlatiladi."],
    xivchin: ["Xivchin", "Bakteriyaning harakat organoidi — parrak kabi aylanib, uni suyuqlikda harakatlantiradi."],
    kapsula: ["Kapsula (shilliq qavat)", "Devorni o‘rab turuvchi himoya qavati — bakteriyani qurib qolishdan va immun hujayralardan saqlaydi."],
  };
  W.cell = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧫 Hujayra ichiga sayohat — organoidni bosing");
    const KINDS = ["O‘simlik hujayrasi", "Hayvon hujayrasi", "Bakteriya (prokariot)"];
    let kind = p.kind ?? 0, quiz = null, score = 0, asked = 0;
    const g = svg(440, 300, "fz-svg bio-cell");
    stage.append(g);
    const hit = (id, el) => { el.dataset.org = id; el.classList.add("bc-org"); el.addEventListener("click", (e) => { e.stopPropagation(); pick(id, el); }); return el; };
    function draw() {
      g.innerHTML = "";
      const cx = 220, cy = 150;
      if (kind === 0) {
        hit("devor", s("rect", { x: 40, y: 30, width: 360, height: 240, rx: 18, fill: "#a3e635", opacity: 0.55, stroke: "#3f6212", "stroke-width": 8 }, g));
        hit("membrana", s("rect", { x: 50, y: 40, width: 340, height: 220, rx: 14, fill: "none", stroke: "#facc15", "stroke-width": 3 }, g));
        hit("sitoplazma", s("rect", { x: 53, y: 43, width: 334, height: 214, rx: 12, fill: "#ecfccb", opacity: 0.9 }, g));
        hit("vakuola", s("rect", { x: 150, y: 80, width: 190, height: 140, rx: 50, fill: "#bae6fd", stroke: "#0284c7", "stroke-width": 2 }, g));
        [[90, 75], [100, 230], [360, 60], [370, 230], [250, 245], [75, 150]].forEach(([x, y], i) => { const gg = hit("xloroplast", s("g", { transform: `translate(${x},${y}) rotate(${i * 37})`, class: "bc-wob", style: `--d:${i * 0.4}s` }, g)); s("ellipse", { rx: 16, ry: 8, fill: "#16a34a", stroke: "#14532d" }, gg); for (let k = -1; k <= 1; k++) s("line", { x1: k * 6, y1: -6, x2: k * 6, y2: 6, stroke: "#bbf7d0", "stroke-width": 1.5 }, gg); });
        drawCommon(95, 120, false);
      } else if (kind === 1) {
        hit("membrana", s("path", { d: "M70 150 C60 60 190 30 250 45 C360 60 400 120 380 190 C360 260 240 275 160 255 C90 240 75 200 70 150Z", fill: "#fde4ec", stroke: "#db2777", "stroke-width": 3.5 }, g));
        hit("sitoplazma", s("path", { d: "M90 150 C85 80 190 55 250 65 C345 80 375 125 360 185 C345 245 240 255 165 238 C110 225 92 195 90 150Z", fill: "#fff1f5", opacity: 0.9 }, g));
        [[300, 210], [130, 210]].forEach(([x, y]) => hit("lizosoma", s("circle", { cx: x, cy: y, r: 10, fill: "#fdba74", stroke: "#c2410c" }, g)));
        const sg = hit("sentriola", s("g", { transform: "translate(310,95)" }, g)); s("rect", { x: -10, y: -4, width: 20, height: 8, rx: 3, fill: "#a78bfa" }, sg); s("rect", { x: -4, y: -12, width: 8, height: 20, rx: 3, fill: "#8b5cf6" }, sg);
        drawCommon(cx - 20, cy - 5, true);
      } else {
        hit("kapsula", s("rect", { x: 70, y: 85, width: 300, height: 130, rx: 65, fill: "#e9d5ff", opacity: 0.6, stroke: "#a855f7", "stroke-width": 2, "stroke-dasharray": "5 4" }, g));
        hit("devor", s("rect", { x: 82, y: 97, width: 276, height: 106, rx: 53, fill: "none", stroke: "#7c3aed", "stroke-width": 6 }, g));
        hit("membrana", s("rect", { x: 90, y: 105, width: 260, height: 90, rx: 45, fill: "#f5f3ff", stroke: "#facc15", "stroke-width": 2 }, g));
        const fl = hit("xivchin", s("path", { d: "M370 150 q20 -18 40 0 t40 0", fill: "none", stroke: "#7c3aed", "stroke-width": 3, class: "bc-flag" }, g));
        hit("nukleoid", s("path", { d: "M170 150 c10 -30 60 -30 70 0 c10 30 -55 35 -40 5 c10 -20 40 -10 30 8", fill: "none", stroke: "#2563eb", "stroke-width": 3 }, g));
        [[290, 125], [300, 172]].forEach(([x, y]) => hit("plazmida", s("circle", { cx: x, cy: y, r: 9, fill: "none", stroke: "#0ea5e9", "stroke-width": 2.5 }, g)));
        const rb = hit("ribosoma", s("g", {}, g)); for (let i = 0; i < 26; i++) s("circle", { cx: 115 + (i * 37) % 220, cy: 118 + (i * 23) % 64, r: 2.4, fill: "#334155" }, rb);
        void fl;
      }
      g.addEventListener("click", () => {});
    }
    function drawCommon(x, y, big) {
      const ep = hit("ept", s("path", { d: `M${x + 50} ${y - 40} q20 -12 40 0 t40 0 M${x + 52} ${y - 28} q20 -12 40 0 t40 0 M${x + 54} ${y - 16} q20 -12 40 0`, fill: "none", stroke: "#0891b2", "stroke-width": 3 }, g));
      for (let i = 0; i < 8; i++) s("circle", { cx: x + 60 + i * 11, cy: y - 44 + (i % 2) * 12, r: 2, fill: "#334155", "pointer-events": "none" }, g);
      void ep;
      const gl = hit("golji", s("g", { transform: `translate(${x + 150},${y + 40})` }, g)); [0, 7, 14].forEach((d) => s("path", { d: `M-22 ${d} q22 -12 44 0`, fill: "none", stroke: "#ea580c", "stroke-width": 4, "stroke-linecap": "round" }, gl));
      hit("yadro", s("circle", { cx: x, cy: y, r: big ? 42 : 30, fill: "#c4b5fd", stroke: "#6d28d9", "stroke-width": 3 }, g));
      hit("yadrocha", s("circle", { cx: x + 6, cy: y - 4, r: big ? 12 : 8, fill: "#6d28d9" }, g));
      [[x + 90, y + 70], [x + 200, y - 60], [x - 10, y + 80]].forEach(([mx, my], i) => { const mg = hit("mitoxondriya", s("g", { transform: `translate(${mx},${my}) rotate(${i * 50})`, class: "bc-wob", style: `--d:${i * 0.5}s` }, g)); s("ellipse", { rx: 18, ry: 9, fill: "#fb7185", stroke: "#be123c", "stroke-width": 2 }, mg); s("path", { d: "M-12 0 q3 -6 6 0 t6 0 t6 0 t6 0", fill: "none", stroke: "#fff1f2", "stroke-width": 1.5 }, mg); });
      const rb = hit("ribosoma", s("g", {}, g)); for (let i = 0; i < 14; i++) s("circle", { cx: x - 40 + (i * 53) % 260, cy: y + 30 + (i * 31) % 70, r: 2.2, fill: "#334155" }, rb);
    }
    function pick(id, el) {
      g.querySelectorAll(".on").forEach((e) => e.classList.remove("on"));
      g.querySelectorAll(`[data-org="${id}"]`).forEach((e) => e.classList.add("on"));
      if (quiz) {
        asked++; const ok = id === quiz; if (ok) score++;
        out.innerHTML = (ok ? "✅ To‘g‘ri! " : `❌ Bu — <b>${ORG[id][0]}</b>. `) + `Hisob: <b>${score}/${asked}</b>`;
        setTimeout(ask, 1100); return;
      }
      out.innerHTML = `<b>${ORG[id][0]}</b> — ${ORG[id][1]}`;
    }
    const present = () => [...new Set([...g.querySelectorAll("[data-org]")].map((e) => e.dataset.org))];
    function ask() { const list = present(); quiz = list[Math.floor(Math.random() * list.length)]; out.innerHTML = `🎯 Hujayradan toping: <b>${ORG[quiz][0]}</b>` + (asked ? ` · Hisob: <b>${score}/${asked}</b>` : ""); }
    controls.append(buttons(KINDS, (i) => { kind = i; quiz = null; draw(); out.innerHTML = ["O‘simlik hujayrasi: <b>devor, xloroplast, katta vakuola</b> bor.", "Hayvon hujayrasi: devor va plastidalar yo‘q, <b>sentriolalar</b> va lizosomalar bor.", "Bakteriya — <b>prokariot</b>: yadro yo‘q (nukleoid), membranali organoidlar yo‘q, faqat ribosomalar."][i]; }, kind),
      button("🎯 Organoidni top o‘yini", (e) => { if (quiz) { quiz = null; e.target.innerHTML = "🎯 Organoidni top o‘yini"; out.innerHTML = `Natija: <b>${score}/${asked}</b>`; return; } score = 0; asked = 0; e.target.innerHTML = "⏹ O‘yinni tugatish"; ask(); }));
    draw();
    out.innerHTML = "Organoidni bosing — u haqida ma’lumot chiqadi. Hujayra turini almashtirib, farqlarni toping.";
  };

  // ===================================================================
  // 3. URADIGAN YURAK VA QON AYLANISH DOIRALARI
  // ===================================================================
  W.heart = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "❤️ Yurak va qon aylanish doiralari — jonli");
    let bpm = 72, phase = 0, taps = [];
    const parts = []; for (let i = 0; i < 46; i++) parts.push({ u: i / 46, loop: i % 3 === 0 ? 0 : 1 });
    const ecg = new Array(160).fill(0);
    // kichik doira: o'ng qorincha → o'pka → chap bo'lmacha; katta doira: chap qorincha → tana → o'ng bo'lmacha
    const loopPath = (L, u) => {
      if (L === 0) { const a = u * TAU; return [220 + Math.cos(a - PI / 2) * 120, 72 + Math.sin(a - PI / 2) * 46]; }
      const a = u * TAU; return [220 + Math.cos(a + PI / 2) * 150, 205 + Math.sin(a + PI / 2) * 62];
    };
    animCanvas(stage, 440, 300, (c, dt, t) => {
      phase += dt * bpm / 60; const b = phase % 1;
      const sys = b < 0.15 ? Math.sin((b / 0.15) * PI) : 0, atr = b > 0.82 ? Math.sin(((b - 0.82) / 0.18) * PI) : 0;
      c.clearRect(0, 0, 440, 300);
      // o'pka va tana
      c.fillStyle = "rgba(244,114,182,.18)"; c.beginPath(); c.ellipse(220, 26, 80, 20, 0, 0, TAU); c.fill(); label(c, 220, 30, "🫁 O‘pka — gaz almashinuvi", "#f9a8d4", "rgba(0,0,0,0)", 11);
      c.fillStyle = "rgba(148,163,184,.15)"; c.beginPath(); c.ellipse(220, 262, 120, 22, 0, 0, TAU); c.fill(); label(c, 220, 266, "🧍 Tana a’zolari — kapillyarlar", "#cbd5e1", "rgba(0,0,0,0)", 11);
      c.lineWidth = 6; for (const L of [0, 1]) { c.beginPath(); for (let i = 0; i <= 80; i++) { const [x, y] = loopPath(L, i / 80); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.strokeStyle = "rgba(148,163,184,.25)"; c.stroke(); }
      const speed = bpm / 60 * 0.12;
      for (const q of parts) {
        q.u = (q.u + dt * speed * (1 + sys * 1.5)) % 1;
        const [x, y] = loopPath(q.loop, q.u);
        const oxy = q.loop === 0 ? q.u > 0.5 : q.u < 0.5; // kichik doira: o'pkadan keyin qizil
        c.fillStyle = oxy ? "#ef4444" : "#3b82f6"; c.beginPath(); c.arc(x, y, 4.5, 0, TAU); c.fill();
      }
      // yurak
      const sc = 1 - sys * 0.08;
      c.save(); c.translate(220, 140); c.scale(sc, sc);
      c.fillStyle = "#991b1b"; c.beginPath(); c.moveTo(0, 52); c.bezierCurveTo(-70, 10, -62, -48, -22, -46); c.bezierCurveTo(-8, -46, 0, -36, 0, -28); c.bezierCurveTo(0, -36, 8, -46, 22, -46); c.bezierCurveTo(62, -48, 70, 10, 0, 52); c.fill();
      const ch = (x, y, w, hh, col, a) => { c.fillStyle = col; c.globalAlpha = 0.85 + a * 0.15; c.beginPath(); c.ellipse(x, y, w * (1 - a * 0.15), hh * (1 - a * 0.15), 0, 0, TAU); c.fill(); c.globalAlpha = 1; };
      ch(-22, -22, 15, 11, "#60a5fa", atr); ch(22, -22, 15, 11, "#f87171", atr); ch(-18, 12, 17, 20, "#3b82f6", sys); ch(20, 12, 19, 22, "#ef4444", sys);
      c.restore();
      label(c, 172, 118, "O‘ng bo‘lmacha", "#bfdbfe", "rgba(0,0,0,.5)", 10); label(c, 270, 118, "Chap bo‘lmacha", "#fecaca", "rgba(0,0,0,.5)", 10);
      label(c, 168, 176, "O‘ng qorincha", "#bfdbfe", "rgba(0,0,0,.5)", 10); label(c, 274, 176, "Chap qorincha", "#fecaca", "rgba(0,0,0,.5)", 10);
      // EKG
      const v = b < 0.03 ? -0.3 : b < 0.06 ? 1 : b < 0.09 ? -0.5 : b > 0.3 && b < 0.42 ? Math.sin(((b - 0.3) / 0.12) * PI) * 0.3 : b > 0.85 && b < 0.93 ? Math.sin(((b - 0.85) / 0.08) * PI) * 0.15 : 0;
      ecg.push(v); ecg.shift();
      c.strokeStyle = "#22c55e"; c.lineWidth = 2; c.beginPath(); ecg.forEach((e, i) => { const x = 8 + i * 0.75, y = 150 - e * 26; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
      label(c, 60, 196, `${bpm} zarba/daq`, "#86efac", "rgba(0,0,0,.6)", 12);
    });
    const info = () => {
      const mv = (bpm * 70) / 1000;
      out.innerHTML = `Yurak har daqiqada <b>${bpm}</b> marta qisqarib, har gal ~70 ml qon haydaydi → daqiqasiga <b>${mv.toFixed(1)} litr</b>, kuniga <b>${Math.round(mv * 60 * 24).toLocaleString("uz")} litr</b>!<br>🔵 Vena qoni (CO₂ ko‘p) → <b>o‘ng</b> qism → o‘pka (<b>kichik doira</b>) → 🔴 arterial qon (O₂ ko‘p) → <b>chap</b> qism → tana (<b>katta doira</b>).`;
    };
    controls.append(buttons(["😴 Uyqu (55)", "🙂 Tinch (72)", "🚶 Yurish (100)", "🏃 Yugurish (150)"], (i) => { bpm = [55, 72, 100, 150][i]; sl.set(bpm); info(); }, 1));
    const sl = slider({ label: "Yurak urishi", min: 40, max: 190, value: bpm, fmt: (v) => v + " /daq", onInput: (v) => { bpm = v; info(); } });
    const tapB = button("💓 O‘z pulsimni o‘lchash — har urishda bosing", () => {
      const now = performance.now(); taps = taps.filter((x) => now - x < 8000); taps.push(now);
      if (taps.length < 4) { tapB.innerHTML = `💓 Bosishda davom eting… (${taps.length})`; return; }
      const iv = (taps[taps.length - 1] - taps[0]) / (taps.length - 1), my = Math.round(60000 / iv);
      tapB.innerHTML = `💓 Pulsingiz ≈ <b>${my}</b> /daq — bosishda davom eting`;
      if (my > 30 && my < 220) { bpm = my; sl.set(my); info(); }
    });
    controls.append(sl, tapB);
    info();
  };

  // ===================================================================
  // 4. NAFAS OLISH
  // ===================================================================
  W.breath = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🫁 Nafas olish — o‘pka va diafragma");
    let rate = 16, ph = 0, deep = 0.5;
    const mol = []; for (let i = 0; i < 40; i++) mol.push({ x: 0, y: 0, k: i % 2, life: Math.random() });
    animCanvas(stage, 440, 280, (c, dt) => {
      ph += dt * rate / 60; const s1 = (1 - Math.cos((ph % 1) * TAU)) / 2; // 0..1 nafas olish
      const inhale = (ph % 1) < 0.5, vol = 0.6 + s1 * deep;
      c.clearRect(0, 0, 440, 280);
      // ko'krak qafasi
      c.strokeStyle = "rgba(226,232,240,.35)"; c.lineWidth = 5; for (let k = 0; k < 6; k++) { const y = 90 + k * 22, w = 120 + k * 8 + s1 * deep * 12; c.beginPath(); c.ellipse(220, y, w, 16, 0, PI * 0.05, PI * 0.95, true); c.stroke(); }
      // traxeya
      c.fillStyle = "#fda4af"; c.fillRect(212, 20, 16, 70); c.strokeStyle = "#be123c"; for (let y = 24; y < 88; y += 7) { c.beginPath(); c.moveTo(212, y); c.lineTo(228, y); c.stroke(); }
      // o'pkalar
      for (const sg of [-1, 1]) {
        c.save(); c.translate(220 + sg * 62, 150); c.scale(vol, vol);
        const gr = c.createRadialGradient(0, 0, 10, 0, 0, 80); gr.addColorStop(0, "#fecdd3"); gr.addColorStop(1, "#f43f5e"); c.fillStyle = gr;
        c.beginPath(); c.moveTo(-sg * 18, -70); c.bezierCurveTo(sg * 60, -80, sg * 70, 40, sg * 50, 75); c.bezierCurveTo(sg * 10, 85, -sg * 30, 70, -sg * 30, 30); c.closePath(); c.fill();
        c.strokeStyle = "#9f1239"; c.lineWidth = 2; c.beginPath(); c.moveTo(-sg * 40, -70); c.lineTo(-sg * 10, -20); c.lineTo(sg * 10, 10); c.moveTo(-sg * 10, -20); c.lineTo(sg * 20, -30); c.moveTo(sg * 10, 10); c.lineTo(sg * 25, 40); c.stroke();
        c.restore();
      }
      // diafragma
      const dy = 230 + s1 * deep * 22; c.strokeStyle = "#f59e0b"; c.lineWidth = 7; c.beginPath(); c.moveTo(90, 238); c.quadraticCurveTo(220, dy - 50 + s1 * deep * 40, 350, 238); c.stroke();
      label(c, 380, 228, "Diafragma", "#fcd34d", "rgba(0,0,0,.55)", 11);
      // molekulalar
      for (const m of mol) {
        m.life += dt * (rate / 60) * 1.1; if (m.life > 1) { m.life = 0; m.k = inhale ? 0 : 1; }
        const u = m.life, x = 220 + (m.k ? -1 : 1) * 4, y = m.k ? 150 - u * 150 : u * 150;
        if (inhale !== (m.k === 0)) continue;
        c.fillStyle = m.k ? "#94a3b8" : "#38bdf8"; c.beginPath(); c.arc(x + Math.sin(u * 20) * 3, y, 4, 0, TAU); c.fill();
      }
      label(c, 60, 30, inhale ? "⬇ Nafas olish" : "⬆ Nafas chiqarish", inhale ? "#7dd3fc" : "#cbd5e1", "rgba(0,0,0,.6)", 13);
      label(c, 66, 52, "🔵 O₂   ⚪ CO₂", "#e2e8f0", "rgba(0,0,0,.5)", 11);
    });
    const info = () => { const vm = rate * (0.5 * (0.4 + deep * 1.6)); out.innerHTML = `Daqiqasiga <b>${rate}</b> marta nafas, har safar ~${(0.5 * (0.4 + deep * 1.6)).toFixed(1)} l havo → <b>${vm.toFixed(1)} l/daq</b> (o‘pka ventilyatsiyasi).<br>Nafas olishda <b>diafragma</b> qisqarib pastga tushadi, qovurg‘alar ko‘tariladi — ko‘krak qafasi kengayadi, havo o‘pkaga kiradi. Alveolalarda O₂ qonga o‘tadi, CO₂ chiqadi.`; };
    controls.append(buttons(["😴 Tinch (12)", "🙂 Odatiy (16)", "🏃 Yugurish (35)"], (i) => { rate = [12, 16, 35][i]; deep = [0.35, 0.5, 0.9][i]; info(); }, 1),
      slider({ label: "Nafas chuqurligi", min: 0.1, max: 1, step: 0.05, value: deep, fmt: (v) => Math.round(v * 100) + " %", onInput: (v) => { deep = v; info(); } }));
    info();
  };

  // ===================================================================
  // 5. REAKSIYA TEZLIGI TESTI + REFLEKS YOYI
  // ===================================================================
  W.reaction = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⚡ Reaksiya tezligingizni o‘lchang — refleks yoyi");
    const pad = h("button", { type: "button", class: "bio-rt" }, "▶ Boshlash uchun bosing");
    const arc = svg(440, 120, "fz-svg");
    stage.append(pad, arc);
    const nodes = [[30, 90, "👁 Retseptor"], [130, 40, "Sezuvchi neyron"], [220, 70, "🧠 Markaz (orqa/bosh miya)"], [310, 40, "Harakat neyroni"], [410, 90, "💪 Ishchi organ"]];
    s("polyline", { points: nodes.map(([x, y]) => `${x},${y}`).join(" "), fill: "none", stroke: "#64748b", "stroke-width": 4 }, arc);
    nodes.forEach(([x, y, t]) => { s("circle", { cx: x, cy: y, r: 9, fill: "#a78bfa" }, arc); s("text", { x, y: y + 24, "text-anchor": "middle", class: "fz-t", fill: "currentColor", text: t }, arc); });
    const imp = s("circle", { r: 7, fill: "#fde047", opacity: 0 }, arc);
    let state = 0, t0 = 0, timer = 0; const res = [];
    function fire(ms) {
      imp.setAttribute("opacity", 1); const T0 = performance.now(), dur = Math.max(400, ms * 2);
      const step = () => { const u = Math.min(1, (performance.now() - T0) / dur), k = u * (nodes.length - 1), i = Math.min(nodes.length - 2, Math.floor(k)), f = k - i; imp.setAttribute("cx", nodes[i][0] + (nodes[i + 1][0] - nodes[i][0]) * f); imp.setAttribute("cy", nodes[i][1] + (nodes[i + 1][1] - nodes[i][1]) * f); if (u < 1) requestAnimationFrame(step); else imp.setAttribute("opacity", 0); };
      step();
    }
    pad.onclick = () => {
      if (state === 0 || state === 3) { state = 1; pad.className = "bio-rt wait"; pad.textContent = "⏳ Kuting… yashil bo‘lganda bosing!"; timer = setTimeout(() => { state = 2; pad.className = "bio-rt go"; pad.textContent = "🟢 BOSING!"; t0 = performance.now(); }, 1200 + Math.random() * 2600); }
      else if (state === 1) { clearTimeout(timer); state = 3; pad.className = "bio-rt bad"; pad.textContent = "❌ Erta bosdingiz! Qayta urinish uchun bosing"; }
      else if (state === 2) {
        const ms = Math.round(performance.now() - t0); res.push(ms); state = 3; pad.className = "bio-rt"; pad.textContent = `⚡ ${ms} ms — yana urinish uchun bosing`; fire(ms);
        const avg = Math.round(res.reduce((a, b) => a + b, 0) / res.length), best = Math.min(...res);
        out.innerHTML = `Urinishlar: ${res.slice(-6).map((x) => `<b>${x}</b>`).join(", ")} ms · o‘rtacha <b>${avg} ms</b> · eng yaxshi <b>${best} ms</b>.<br>${avg < 220 ? "🏆 A’lo — sportchi darajasi!" : avg < 300 ? "👍 Yaxshi — odatiy reaksiya (200–300 ms)." : "🙂 Sekinroq — charchoq, telefonga chalg‘ish reaksiyani sekinlashtiradi."} Signal ko‘z → miya → muskul yo‘lini <b>refleks yoyi</b> bo‘ylab bosib o‘tadi.`;
      }
    };
    controls.append(button("↺ Natijalarni tozalash", () => { res.length = 0; out.innerHTML = "Natijalar tozalandi."; }));
    out.innerHTML = "<b>Tajriba:</b> tugmani bosing, u <b>yashil</b> bo‘lishi bilan imkon qadar tez bosing. 5 marta urinib, o‘rtachasini hisoblang. Haydovchilar uchun reaksiya vaqti nega muhim?";
  };

  // ===================================================================
  // 6. ANTAGONIST MUSKULLAR (biseps / triseps)
  // ===================================================================
  W.arm = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "💪 Qo‘lni bukib-yozing — muskullar qanday ishlaydi?");
    const g = svg(440, 260, "fz-svg"); stage.append(g);
    let ang = 40, load = 2, prev = 40;
    function draw() {
      g.innerHTML = "";
      const sx = 120, sy = 60, ex = 160, ey = 190, a = (ang * PI) / 180, L = 150;
      const hx = ex + Math.cos(-a) * L, hy = ey + Math.sin(-a) * L;
      const bending = ang >= prev;
      s("line", { x1: sx, y1: sy, x2: ex, y2: ey, stroke: "#f1f5f9", "stroke-width": 14, "stroke-linecap": "round" }, g);
      s("line", { x1: ex, y1: ey, x2: hx, y2: hy, stroke: "#f1f5f9", "stroke-width": 11, "stroke-linecap": "round" }, g);
      s("circle", { cx: ex, cy: ey, r: 11, fill: "#e2e8f0", stroke: "#94a3b8", "stroke-width": 2 }, g);
      const ix = ex + Math.cos(-a) * 30, iy = ey + Math.sin(-a) * 30;
      const bulge = 14 + ang / 8 + load * 1.5;
      const mx = (sx + 22 + ix) / 2 + 14 + ang / 6, my = (sy + 20 + iy) / 2;
      s("path", { d: `M${sx + 18} ${sy + 20} Q${mx + bulge} ${my} ${ix} ${iy} Q${mx} ${my} ${sx + 18} ${sy + 20}`, fill: bending ? "#ef4444" : "#fca5a5", stroke: "#991b1b", "stroke-width": 2 }, g);
      const tx = ex - 18, ty = ey + 4;
      s("path", { d: `M${sx - 12} ${sy + 18} Q${(sx + tx) / 2 - 22 + ang / 10} ${(sy + ty) / 2} ${tx} ${ty} Q${(sx + tx) / 2 - 10} ${(sy + ty) / 2} ${sx - 12} ${sy + 18}`, fill: !bending ? "#3b82f6" : "#93c5fd", stroke: "#1e3a8a", "stroke-width": 2 }, g);
      s("text", { x: hx + 6, y: hy - 8, "font-size": 26, text: load > 0 ? "🏋" : "✋" }, g);
      s("text", { x: 250, y: 40, class: "fz-t", fill: "#fca5a5", text: `Biseps: ${bending ? "QISQARMOQDA" : "bo‘shashmoqda"}` }, g);
      s("text", { x: 250, y: 60, class: "fz-t", fill: "#93c5fd", text: `Triseps: ${!bending ? "QISQARMOQDA" : "bo‘shashmoqda"}` }, g);
      const F = Math.round(load * 9.8 * 7);
      s("text", { x: 250, y: 84, class: "fz-t", fill: "currentColor", text: `Bisepsga tushadigan kuch ≈ ${F} N` }, g);
    }
    controls.append(slider({ label: "Tirsak burchagi (bukish)", min: 0, max: 140, value: ang, fmt: (v) => v + "°", onInput: (v) => { prev = ang; ang = v; draw(); } }),
      slider({ label: "Qo‘ldagi yuk", min: 0, max: 10, value: load, fmt: (v) => v + " kg", onInput: (v) => { load = v; draw(); } }));
    draw();
    out.innerHTML = "<b>Antagonist muskullar</b> qarama-qarshi ishlaydi: bukishda <b>biseps</b> qisqaradi, triseps bo‘shashadi; yozishda — aksincha. Muskul faqat <b>tortadi</b>, itarmaydi. Tirsak — richag: muskul yukka yaqin emas, shuning uchun yukdan ~7 marta katta kuch beradi.";
  };

  // ===================================================================
  // 7. OVQAT HAZM QILISH YO'LI
  // ===================================================================
  const TRACT = [
    ["Og‘iz bo‘shlig‘i", [220, 30], "≈ 1 daqiqa", "Tishlar maydalaydi, so‘lakdagi <b>amilaza</b> kraxmalni parchalay boshlaydi.", { u: "kraxmal → maltoza (qisman)", o: "—", y: "—" }],
    ["Qizilo‘ngach", [220, 80], "≈ 5–10 soniya", "Muskullar to‘lqinsimon qisqarib (peristaltika) luqmani oshqozonga suradi.", { u: "—", o: "—", y: "—" }],
    ["Oshqozon", [260, 130], "2–4 soat", "Xlorid kislota mikroblarni o‘ldiradi; <b>pepsin</b> oqsillarni parchalaydi.", { u: "—", o: "oqsil → peptidlar", y: "qisman" }],
    ["Ingichka ichak (o‘n ikki barmoqli)", [220, 180], "3–5 soat", "Jigar <b>o‘ti</b> yog‘ni emulsiyalaydi; oshqozonosti bezi shirasi (tripsin, lipaza, amilaza) va ichak shirasi parchalashni tugatadi; <b>vorsinkalar</b> orqali qonga so‘riladi.", { u: "→ glukoza", o: "→ aminokislotalar", y: "→ glitserin + yog‘ kislotalari" }],
    ["Yo‘g‘on ichak", [220, 235], "10–30 soat", "Suv so‘riladi, foydali bakteriyalar ba’zi vitaminlarni (K, B) hosil qiladi; hazm bo‘lmagan qoldiqlar chiqariladi.", { u: "kletchatka — qisman bakteriyalar", o: "—", y: "—" }],
  ];
  W.digest = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🍽 Ovqatning sayohati — hazm yo‘li bo‘ylab");
    const g = svg(440, 270, "fz-svg"); stage.append(g);
    const d = "M220 20 L220 100 C220 120 300 110 290 140 C280 165 200 150 190 170 C170 190 280 190 260 205 C240 220 160 205 170 225 C180 245 300 240 290 255";
    s("path", { d, fill: "none", stroke: "#fda4af", "stroke-width": 22, "stroke-linecap": "round", opacity: 0.55 }, g);
    const path = s("path", { d, fill: "none", stroke: "#be123c", "stroke-width": 2, "stroke-dasharray": "4 5" }, g);
    const pins = TRACT.map(([n, [x, y]], i) => { const gg = s("g", { class: "tx-pin" }, g); s("circle", { cx: x, cy: y, r: 7, class: "tx-c" }, gg); s("text", { x: x + (i % 2 ? -12 : 14), y: y + 4, class: "tx-lab", "text-anchor": i % 2 ? "end" : "start", text: n }, gg); gg.addEventListener("click", () => show(i)); return gg; });
    const food = s("text", { "font-size": 22, "text-anchor": "middle", "dominant-baseline": "middle", text: "🍞" }, g);
    let foodKind = 0, anim = 0;
    const FOODS = [["🍞 Non (uglevod)", "u", "🍞"], ["🍗 Go‘sht (oqsil)", "o", "🍗"], ["🧈 Sariyog‘ (yog‘)", "y", "🧈"]];
    function show(i) {
      pins.forEach((q, j) => q.classList.toggle("on", j === i));
      const [n, , tm, txt, eff] = TRACT[i], k = FOODS[foodKind][1];
      out.innerHTML = `<b>${n}</b> (${tm}) — ${txt}<br>${FOODS[foodKind][0]}: <b>${eff[k]}</b>`;
    }
    function go() {
      cancelAnimationFrame(anim); const L = path.getTotalLength(), T0 = performance.now(), D = 9000;
      const stops = TRACT.map(([, [x, y]]) => { let best = 0, bd = 1e9; for (let l = 0; l <= L; l += 4) { const q = path.getPointAtLength(l), dd = Math.hypot(q.x - x, q.y - y); if (dd < bd) { bd = dd; best = l; } } return best / L; });
      let shown = -1;
      const step = () => { const u = Math.min(1, (performance.now() - T0) / D), q = path.getPointAtLength(u * L); food.setAttribute("x", q.x); food.setAttribute("y", q.y); const i = stops.filter((sv) => sv <= u + 0.01).length - 1; if (i !== shown && i >= 0) { shown = i; show(i); } food.setAttribute("font-size", 22 - u * 10); if (u < 1 && g.isConnected) anim = requestAnimationFrame(step); };
      step();
    }
    controls.append(buttons(FOODS.map((f) => f[0]), (i) => { foodKind = i; food.textContent = FOODS[i][2]; go(); }, 0), button("▶ Sayohatni boshlash", go));
    food.setAttribute("x", 220); food.setAttribute("y", 20);
    out.innerHTML = "Ovqatni tanlang va ▶ ni bosing — u og‘izdan yo‘g‘on ichakkacha yo‘l bosadi. Bu yo‘l kattalarda ~<b>8–9 metr</b>, ovqat 24–72 soatda o‘tadi. Nuqtalarni bosib, har bir bo‘limda nima bo‘lishini o‘qing.";
  };

  // ===================================================================
  // 8. FOTOSINTEZ — elodeyada O2 pufakchalari
  // ===================================================================
  W.photosyn = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌿 Fotosintez — kislorod pufakchalarini sanang");
    let dist = 20, co2 = 1, temp = 25, count = 0, tCount = 0, rateNow = 0;
    const bub = [];
    const rate = () => { const L = 400 / (dist * dist) * 25; const lightF = L / (L + 4); const tf = Math.exp(-((temp - 28) ** 2) / 180) * (temp > 45 ? 0 : 1); return 30 * lightF * (co2 / (co2 + 0.6)) * tf; };
    animCanvas(stage, 440, 280, (c, dt, t) => {
      c.clearRect(0, 0, 440, 280);
      const lx = 60 + (dist - 10) * 6;
      // lampa
      const glow = c.createRadialGradient(lx, 130, 4, lx, 130, 70); glow.addColorStop(0, "rgba(253,224,71,.9)"); glow.addColorStop(1, "rgba(253,224,71,0)"); c.fillStyle = glow; c.beginPath(); c.arc(lx, 130, 70, 0, TAU); c.fill();
      c.font = "30px system-ui"; c.textAlign = "center"; c.fillText("💡", lx - 20, 140);
      // stakan
      c.fillStyle = "rgba(125,211,252,.25)"; c.strokeStyle = "#7dd3fc"; c.lineWidth = 2; c.fillRect(300, 60, 110, 200); c.strokeRect(300, 60, 110, 200);
      // elodeya
      c.strokeStyle = "#15803d"; c.lineWidth = 4; c.beginPath(); c.moveTo(355, 255); c.quadraticCurveTo(345 + Math.sin(t) * 3, 180, 355, 120); c.stroke();
      c.fillStyle = "#22c55e"; for (let k = 0; k < 9; k++) { const y = 245 - k * 14, sg = k % 2 ? 1 : -1; c.beginPath(); c.ellipse(355 + sg * 9, y, 10, 3.5, sg * 0.5, 0, TAU); c.fill(); }
      const r = rate(); rateNow = r;
      if (Math.random() < r * dt / 1.2) bub.push({ x: 355 + (Math.random() - 0.5) * 6, y: 120, r: 2 + Math.random() * 2.5 });
      for (const b of bub) { b.y -= dt * 60; b.x += Math.sin(b.y / 8) * 0.3; }
      for (let i = bub.length - 1; i >= 0; i--) if (bub[i].y < 62) { bub.splice(i, 1); count++; }
      c.strokeStyle = "#e0f2fe"; c.lineWidth = 1.2; for (const b of bub) { c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.stroke(); }
      tCount += dt;
      label(c, 355, 40, `O₂ pufakchalari: ${count}`, "#e0f2fe", "rgba(2,132,199,.6)", 12);
      label(c, 160, 262, `≈ ${Math.round(r * 2)} ta / daqiqa`, "#bbf7d0", "rgba(21,128,61,.6)", 12);
    });
    const info = () => { out.innerHTML = `<b>6CO₂ + 6H₂O —(yorug‘lik, xlorofill)→ C₆H₁₂O₆ + 6O₂</b><br>Hozirgi tezlik: ~<b>${Math.round(rateNow * 2)}</b> pufakcha/daq. Lampani yaqinlashtiring, CO₂ (soda) qo‘shing, haroratni o‘zgartiring — qaysi omil eng kuchli ta’sir qiladi? Juda yuqori haroratda fermentlar buziladi — fotosintez to‘xtaydi.`; };
    controls.append(
      slider({ label: "💡 Lampa masofasi", min: 10, max: 50, value: dist, fmt: (v) => v + " sm", onInput: (v) => { dist = v; setTimeout(info, 50); } }),
      slider({ label: "🫧 CO₂ (ichimlik sodasi)", min: 0.05, max: 3, step: 0.05, value: co2, fmt: (v) => (v < 0.3 ? "kam" : v < 1.5 ? "o‘rtacha" : "ko‘p"), onInput: (v) => { co2 = v; setTimeout(info, 50); } }),
      slider({ label: "🌡 Suv harorati", min: 0, max: 50, value: temp, fmt: (v) => v + " °C", onInput: (v) => { temp = v; setTimeout(info, 50); } }),
      button("↺ Sanoqni nolga", () => { count = 0; tCount = 0; }));
    info();
  };

  // ===================================================================
  // 9. AMILAZANING KRAXMALGA TA'SIRI (yod sinamasi)
  // ===================================================================
  W.enzyme = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧪 Laboratoriya: so‘lak amilazasi kraxmalni parchalaydi");
    const tubes = [{ t: 0, n: "Muz (0 °C)" }, { t: 37, n: "Tana (37 °C)" }, { t: 80, n: "Qaynoq (80 °C)" }, { t: 37, n: "Amilazasiz", ctl: true }];
    let time = 0, play = false, ph = 7;
    const speed = (tb) => (tb.ctl ? 0 : Math.exp(-((tb.t - 37) ** 2) / 260) * (tb.t > 60 ? 0 : 1) * Math.exp(-((ph - 7) ** 2) / 3));
    const col = (k) => { const a = [30, 27, 75], b = [253, 230, 138]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`; };
    animCanvas(stage, 440, 230, (c, dt) => {
      if (play) time = Math.min(600, time + dt * 40);
      c.clearRect(0, 0, 440, 230);
      tubes.forEach((tb, i) => {
        const x = 45 + i * 105, k = 1 - Math.exp(-speed(tb) * time / 120);
        c.fillStyle = col(k); c.beginPath(); c.moveTo(x, 70); c.lineTo(x, 180); c.arc(x + 20, 180, 20, PI, 0, true); c.lineTo(x + 40, 70); c.closePath(); c.fill();
        c.strokeStyle = "#e2e8f0"; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, 30); c.lineTo(x, 180); c.arc(x + 20, 180, 20, PI, 0, true); c.lineTo(x + 40, 30); c.stroke();
        label(c, x + 20, 20, tb.n, "#e2e8f0", "rgba(0,0,0,.5)", 10);
        label(c, x + 20, 222, k > 0.85 ? "kraxmal yo‘q ✅" : k > 0.3 ? "parchalanmoqda" : "kraxmal bor", k > 0.85 ? "#86efac" : "#fde68a", "rgba(0,0,0,.55)", 10);
      });
      label(c, 220, 130, `⏱ ${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")} daq`, "#fff", "rgba(0,0,0,.0)", 11);
    });
    controls.append(button("▶ / ⏸ Vaqt", () => (play = !play)), button("↺ Qaytadan", () => { time = 0; play = false; }),
      slider({ label: "Muhit pH", min: 2, max: 11, step: 0.5, value: ph, fmt: (v) => v + (v < 6 ? " (kislotali)" : v > 8 ? " (ishqoriy)" : " (neytral)"), onInput: (v) => (ph = v) }));
    out.innerHTML = "<b>Tajriba:</b> kraxmal kleysteriga so‘lak qo‘shildi va <b>yod</b> tomizildi. Yod kraxmal bilan <b>to‘q ko‘k</b> rang beradi. Amilaza kraxmalni parchalasa — rang sarg‘ayadi. ▶ ni bosing: qaysi probirkada tez? Nega 80 °C da ish bermaydi? (Ferment — oqsil, qizdirilganda buziladi.)";
  };

  // ===================================================================
  // 10. FAGOTSITOZ — leykotsit bakteriyalarni yutadi
  // ===================================================================
  W.phago = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🛡 Leykotsit mikroblarni ovlaydi — fagotsitoz (I. Mechnikov)");
    const L = { x: 220, y: 140, r: 26 }, bac = []; let eaten = 0;
    const add = (x, y) => bac.push({ x: x ?? Math.random() * 440, y: y ?? Math.random() * 280, a: Math.random() * TAU, dead: 0 });
    for (let i = 0; i < 8; i++) add();
    const cv = animCanvas(stage, 440, 280, (c, dt, t) => {
      c.clearRect(0, 0, 440, 280); c.fillStyle = "#3f0d12"; c.fillRect(0, 0, 440, 280);
      for (let i = 0; i < 14; i++) { const x = (i * 97 + t * 12) % 470 - 15, y = (i * 53) % 280; c.fillStyle = "rgba(239,68,68,.55)"; c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill(); }
      const live = bac.filter((b) => !b.dead);
      let tgt = null, bd = 1e9; for (const b of live) { const d = Math.hypot(b.x - L.x, b.y - L.y); if (d < bd) { bd = d; tgt = b; } }
      if (tgt) { const a = Math.atan2(tgt.y - L.y, tgt.x - L.x); L.x += Math.cos(a) * 34 * dt; L.y += Math.sin(a) * 34 * dt; if (bd < L.r) { tgt.dead = 1; eaten++; L.r = Math.min(40, L.r + 0.8); } }
      L.r = Math.max(26, L.r - dt * 0.4);
      for (const b of live) { b.a += (Math.random() - 0.5) * dt * 3; b.x = clamp(b.x + Math.cos(b.a) * 12 * dt, 5, 435); b.y = clamp(b.y + Math.sin(b.a) * 12 * dt, 5, 275); c.strokeStyle = "#a3e635"; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(b.x - 5, b.y); c.lineTo(b.x + 5, b.y); c.stroke(); }
      c.lineCap = "butt";
      c.fillStyle = "rgba(233,213,255,.9)"; c.beginPath(); for (let k = 0; k <= 24; k++) { const a = (k / 24) * TAU, rr = L.r + Math.sin(a * 5 + t * 3) * 3; k ? c.lineTo(L.x + Math.cos(a) * rr, L.y + Math.sin(a) * rr) : c.moveTo(L.x + Math.cos(a) * rr, L.y + Math.sin(a) * rr); } c.closePath(); c.fill();
      c.fillStyle = "#7e22ce"; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(L.x - 8 + k * 8, L.y + (k % 2 ? 4 : -4), 5, 0, TAU); c.fill(); }
      label(c, 70, 20, `Yutilgan mikroblar: ${eaten}`, "#f5d0fe", "rgba(0,0,0,.55)", 12);
    });
    cv.addEventListener("pointerdown", (e) => { const r = cv.getBoundingClientRect(); add(((e.clientX - r.left) / r.width) * 440, ((e.clientY - r.top) / r.height) * 280); });
    controls.append(button("🦠 +5 mikrob (yara ifloslandi)", () => { for (let i = 0; i < 5; i++) add(); }));
    out.innerHTML = "Ekranni bosing — mikrob paydo bo‘ladi. <b>Leykotsit</b> (oq qon tanachasi) ularni quvib, o‘ziga yutib hazm qiladi — <b>fagotsitoz</b>. Buni 1882-yilda <b>I. I. Mechnikov</b> kashf qilgan. Qizil disklar — <b>eritrotsitlar</b>.";
  };
})();
