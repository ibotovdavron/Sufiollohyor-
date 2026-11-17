/* BIOLOGIYA jonli tajribalari (2-qism):
   mitosis — mitoz va meyoz animatsiyasi    punnett — Mendel chatishtirishlari (Pennet katagi + avlod simulyatsiyasi)
   dna — DNK qo‘sh spirali, komplementarlik, transkripsiya va translyatsiya    foodweb — oziq zanjiri va ekologik piramida (10 % qoidasi)
   ecosim — yirtqich va o‘lja populyatsiyalari    dkey — aniqlagich (dixotomik kalit)    body — odam organlar sistemalari
   growth — bakteriyalar ko‘payishi (Petri likopchasi)    tolerance — ekologik omil va chidamlilik chegarasi */
(() => {
  "use strict";
  const { h, s, svg, slider, buttons, button, frame, W } = window.AK;
  const { animCanvas, label, plot } = window.FIZ;
  const { rng, clamp } = window.BIO;
  const PI = Math.PI, TAU = PI * 2;

  // ===================================================================
  // 1. MITOZ VA MEYOZ
  // ===================================================================
  const MIT = [
    ["Interfaza", "Hujayra o‘sadi, <b>DNK ikki hissa ortadi</b> (har xromosoma 2 xromatidli bo‘ladi). Xromosomalar ko‘rinmaydi — xromatin holatida."],
    ["Profaza", "Xromosomalar <b>spirallashib</b> qisqaradi va ko‘rinadi; yadro qobig‘i eriydi; <b>bo‘linish urchug‘i</b> hosil bo‘ladi."],
    ["Metafaza", "Xromosomalar hujayra <b>ekvatorida</b> bir qatorda tiziladi; urchuq iplari sentromeralarga birikadi."],
    ["Anafaza", "Har bir xromosomaning <b>xromatidlari ajralib</b>, qutblarga tortiladi."],
    ["Telofaza", "Qutblarda yangi yadrolar hosil bo‘ladi, xromosomalar yoziladi."],
    ["Sitokinez", "Sitoplazma bo‘linadi — <b>2 ta bir xil</b> (2n) qiz hujayra. Mitoz — o‘sish, tiklanish, jinssiz ko‘payish asosi."],
  ];
  const MEI = [
    ["Meyoz I — profaza I", "Gomologik xromosomalar juftlashadi (<b>konyugatsiya</b>) va qismlarini almashadi — <b>krossingover</b>. Bu irsiy xilma-xillik manbai!"],
    ["Meyoz I — metafaza I", "Gomologik <b>juftlar</b> ekvatorda tiziladi."],
    ["Meyoz I — anafaza I", "<b>Butun xromosomalar</b> (xromatidlar emas!) qutblarga ajraladi — xromosomalar soni kamayadi."],
    ["Meyoz I — telofaza I", "2 ta hujayra, har birida <b>n</b> xromosoma (2 xromatidli)."],
    ["Meyoz II", "Mitozga o‘xshash: xromatidlar ajraladi."],
    ["Natija", "<b>4 ta gaploid (n)</b> hujayra — jinsiy hujayralar (gametalar). Har biri genetik jihatdan farqli."],
  ];
  W.mitosis = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧬 Hujayra bo‘linishi — fazalarni kuzating");
    let mode = p.mode === "meiosis" ? 1 : 0, st = 0, u = 0, play = true;
    const COL = ["#ef4444", "#3b82f6", "#f97316", "#22c55e"];
    const chrom = (c, x, y, col, two, rot = 0, len = 13, col2) => {
      c.save(); c.translate(x, y); c.rotate(rot); c.lineCap = "round"; c.lineWidth = 6;
      c.strokeStyle = col; c.beginPath(); c.moveTo(two ? -3 : 0, -len); c.lineTo(two ? -3 : 0, len); c.stroke();
      if (two) { c.strokeStyle = col2 || col; c.beginPath(); c.moveTo(3, -len); c.lineTo(3, len); c.stroke(); if (col2) { c.strokeStyle = col; c.beginPath(); c.moveTo(3, len * 0.4); c.lineTo(3, len); c.stroke(); } }
      c.fillStyle = "#fff"; c.beginPath(); c.arc(0, 0, 2.5, 0, TAU); c.fill(); c.restore(); c.lineCap = "butt";
    };
    animCanvas(stage, 440, 260, (c, dt) => {
      const S = mode ? MEI : MIT;
      if (play) { u += dt / 2.6; if (u >= 1) { u = 0; st = (st + 1) % S.length; info(); } }
      c.clearRect(0, 0, 440, 260);
      const e = u * u * (3 - 2 * u);
      const cell = (x, y, rx, ry, nuc) => { c.fillStyle = "rgba(251,207,232,.35)"; c.strokeStyle = "#db2777"; c.lineWidth = 2.5; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill(); c.stroke(); if (nuc) { c.strokeStyle = "rgba(124,58,237,.7)"; c.setLineDash([4, 3]); c.beginPath(); c.arc(x, y, nuc, 0, TAU); c.stroke(); c.setLineDash([]); } };
      const spindle = (x, y, w) => { c.strokeStyle = "rgba(148,163,184,.55)"; c.lineWidth = 1; for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(x - w, y); c.quadraticCurveTo(x, y + k * 12, x + w, y); c.stroke(); } c.fillStyle = "#a78bfa"; [x - w, x + w].forEach((q) => { c.beginPath(); c.arc(q, y, 5, 0, TAU); c.fill(); }); };
      if (!mode) {
        if (st === 0) { cell(220, 130, 110, 80, 48); for (let k = 0; k < 4; k++) { c.strokeStyle = COL[k]; c.lineWidth = 2; c.beginPath(); for (let i = 0; i < 30; i++) { const a = i * 0.7 + k, r = 8 + (i % 7) * 4; i ? c.lineTo(220 + Math.cos(a) * r, 130 + Math.sin(a) * r * 0.8) : c.moveTo(220 + Math.cos(a) * r, 130 + Math.sin(a) * r * 0.8); } c.stroke(); } }
        else if (st === 1) { cell(220, 130, 110, 80, 48 * (1 - e)); spindle(220, 130, 30 + e * 70); [[-24, -16], [20, -18], [-18, 18], [24, 16]].forEach(([dx, dy], k) => chrom(c, 220 + dx, 130 + dy, COL[k], true, k * 0.7)); }
        else if (st === 2) { cell(220, 130, 110, 80); spindle(220, 130, 100); [-36, -12, 12, 36].forEach((dy, k) => chrom(c, 220, 130 + dy, COL[k], true, PI / 2)); }
        else if (st === 3) { cell(220 , 130, 110 + e * 20, 80 - e * 6); spindle(220, 130, 100 + e * 20); [-36, -12, 12, 36].forEach((dy, k) => { chrom(c, 220 - 6 - e * 80, 130 + dy * 0.8, COL[k], false, PI / 2 + 0.3); chrom(c, 220 + 6 + e * 80, 130 + dy * 0.8, COL[k], false, PI / 2 - 0.3); }); }
        else if (st === 4) { const pinch = 1 - e * 0.5; c.fillStyle = "rgba(251,207,232,.35)"; c.strokeStyle = "#db2777"; c.lineWidth = 2.5; c.beginPath(); c.ellipse(220, 130, 130, 74 * pinch + 10, 0, 0, TAU); c.fill(); c.stroke(); [130, 310].forEach((x) => { c.strokeStyle = "rgba(124,58,237,.7)"; c.setLineDash([4, 3]); c.beginPath(); c.arc(x, 130, 16 + e * 18, 0, TAU); c.stroke(); c.setLineDash([]); [-15, -5, 5, 15].forEach((dy, k) => chrom(c, x + dy * 0.4, 130 + dy, COL[k], false, PI / 2 + 0.6, 10 * (1 - e * 0.5))); }); }
        else { [120 - e * 10, 320 + e * 10].forEach((x) => { cell(x, 130, 80, 64, 34); [-12, -4, 4, 12].forEach((dy, k) => { c.strokeStyle = COL[k]; c.lineWidth = 2; c.beginPath(); c.arc(x + dy, 130 + (k % 2 ? 6 : -6), 7, 0, TAU); c.stroke(); }); }); label(c, 220, 236, "2 ta qiz hujayra · har birida 2n = 4", "#f9a8d4", "rgba(0,0,0,.5)", 12); }
      } else {
        const pair = (x, y, sp, rot, cross) => { chrom(c, x - sp, y - 14, COL[0], true, rot, 11, cross ? COL[1] : null); chrom(c, x + sp, y - 14, COL[1], true, rot, 11, cross ? COL[0] : null); chrom(c, x - sp, y + 18, COL[2], true, rot, 9, cross ? COL[3] : null); chrom(c, x + sp, y + 18, COL[3], true, rot, 9, cross ? COL[2] : null); };
        if (st === 0) { cell(220, 130, 110, 80, 50); pair(220, 130, 6 + (1 - e) * 10, 0, e > 0.6); label(c, 220, 236, e > 0.6 ? "Krossingover: rangli bo‘laklar almashdi!" : "Gomologlar juftlashmoqda", "#fde68a", "rgba(0,0,0,.5)", 12); }
        else if (st === 1) { cell(220, 130, 110, 80); spindle(220, 130, 100); chrom(c, 210, 116, COL[0], true, PI / 2, 11, COL[1]); chrom(c, 230, 116, COL[1], true, PI / 2, 11, COL[0]); chrom(c, 210, 148, COL[2], true, PI / 2, 9, COL[3]); chrom(c, 230, 148, COL[3], true, PI / 2, 9, COL[2]); }
        else if (st === 2) { cell(220, 130, 110 + e * 20, 80); spindle(220, 130, 110); chrom(c, 210 - e * 80, 116, COL[0], true, PI / 2, 11, COL[1]); chrom(c, 230 + e * 80, 116, COL[1], true, PI / 2, 11, COL[0]); chrom(c, 210 - e * 80, 148, COL[2], true, PI / 2, 9, COL[3]); chrom(c, 230 + e * 80, 148, COL[3], true, PI / 2, 9, COL[2]); }
        else if (st === 3) { cell(120, 130, 80, 64, 30); cell(320, 130, 80, 64, 30); chrom(c, 120, 118, COL[0], true, 0.3, 11, COL[1]); chrom(c, 120, 144, COL[2], true, -0.3, 9, COL[3]); chrom(c, 320, 118, COL[1], true, 0.3, 11, COL[0]); chrom(c, 320, 144, COL[3], true, -0.3, 9, COL[2]); label(c, 220, 236, "2 hujayra · har birida n = 2 (2 xromatidli)", "#f9a8d4", "rgba(0,0,0,.5)", 12); }
        else if (st === 4) { [[120, [0, 2]], [320, [1, 3]]].forEach(([x, ks]) => { cell(x, 130, 80 + e * 10, 64); ks.forEach((k, j) => { const y = 118 + j * 26; chrom(c, x - 4 - e * 34, y, COL[k], false, PI / 2, j ? 9 : 11); chrom(c, x + 4 + e * 34, y, COL[k], false, PI / 2, j ? 9 : 11); }); }); }
        else { [55, 165, 275, 385].forEach((x, i) => { cell(x, 130, 46, 46, 20); chrom(c, x - 6, 124, COL[i < 2 ? 0 : 1], false, 0, 9); chrom(c, x + 7, 132, COL[i % 2 ? 2 : 3], false, 0.4, 7); }); label(c, 220, 236, "4 ta gameta · har birida n = 2", "#f9a8d4", "rgba(0,0,0,.5)", 12); }
      }
      const S2 = mode ? MEI : MIT; label(c, 220, 18, `${st + 1}/${S2.length} · ${S2[st][0]}`, "#fff", "rgba(219,39,119,.75)", 13);
    });
    function info() { const S = mode ? MEI : MIT; out.innerHTML = `<b>${S[st][0]}</b> — ${S[st][1]}`; }
    controls.append(buttons(["Mitoz", "Meyoz"], (i) => { mode = i; st = 0; u = 0; info(); }, mode),
      button("⏮ Oldingi", () => { const n = (mode ? MEI : MIT).length; st = (st + n - 1) % n; u = 0.99; play = false; info(); }),
      button("⏯ Pauza / davom", () => (play = !play)),
      button("⏭ Keyingi", () => { const n = (mode ? MEI : MIT).length; st = (st + 1) % n; u = 0.99; play = false; info(); }));
    info();
  };

  // ===================================================================
  // 2. MENDEL CHATISHTIRISHLARI — Pennet katagi
  // ===================================================================
  const TRAITS = {
    noxat: { name: "No‘xat urug‘i", genes: [["A", "a", "🟡 sariq", "🟢 yashil"], ["B", "b", "⚪ silliq", "🟤 burishgan"]] },
    namozshomgul: { name: "Namozshomgul guli (chala dominantlik)", incomplete: true, genes: [["A", "a", "🔴 qizil", "⚪ oq", "🌸 pushti"]] },
  };
  const phen = (tr, gt) => tr.genes.map((g, i) => { const a = gt[i * 2], b = gt[i * 2 + 1], d1 = a === g[0], d2 = b === g[0]; if (tr.incomplete && d1 !== d2) return g[4]; return d1 || d2 ? g[2] : g[3]; }).join(" ");
  const sortG = (x, y, D) => (x === D ? x + y : y === D ? y + x : x + y);
  W.punnett = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧬 Mendel qonunlari — Pennet katagi va avlod simulyatsiyasi");
    let tk = p.trait || "noxat", di = !!p.di, P1 = p.p1 || "Aa", P2 = p.p2 || "Aa";
    const box = h("div", { class: "bio-pun" }), sim = h("div", { class: "bio-sim" }); stage.append(box, sim);
    const tr = () => TRAITS[tk];
    const gametes = (g) => (g.length === 2 ? [g[0], g[1]] : [g[0] + g[2], g[0] + g[3], g[1] + g[2], g[1] + g[3]]);
    const child = (a, b) => { if (a.length === 1) return sortG(a, b, tr().genes[0][0]); return sortG(a[0], b[0], tr().genes[0][0]) + sortG(a[1], b[1], tr().genes[1][0]); };
    function draw() {
      const g1 = [...new Set(gametes(P1))], g2 = [...new Set(gametes(P2))], all = gametes(P1).flatMap((a) => gametes(P2).map((b) => child(a, b)));
      let t = `<table><tr><th>♀ \\ ♂</th>${g2.map((g) => `<th>${g}</th>`).join("")}</tr>`;
      g1.forEach((a) => { t += `<tr><th>${a}</th>${g2.map((b) => { const c = child(a, b); return `<td title="${phen(tr(), c)}"><b>${c}</b><br><small>${phen(tr(), c)}</small></td>`; }).join("")}</tr>`; });
      box.innerHTML = `<div class="bio-cross"><b>P:</b> ${P1} <small>(${phen(tr(), P1)})</small> × ${P2} <small>(${phen(tr(), P2)})</small></div>` + t + "</table>";
      const cnt = {}; all.forEach((c) => { const k = phen(tr(), c); cnt[k] = (cnt[k] || 0) + 1; });
      const gc = {}; all.forEach((c) => (gc[c] = (gc[c] || 0) + 1));
      const gcd = (a, b) => (b ? gcd(b, a % b) : a); const G = Object.values(cnt).reduce(gcd); const Gg = Object.values(gc).reduce(gcd);
      out.innerHTML = `<b>Fenotip bo‘yicha:</b> ${Object.entries(cnt).map(([k, v]) => `${k} — ${v / G}`).join(" : ")}<br><b>Genotip bo‘yicha:</b> ${Object.entries(gc).map(([k, v]) => `${k} — ${v / Gg}`).join(" : ")}` + (tr().incomplete ? "<br>🌸 <b>Chala dominantlik</b>: geterozigota oraliq belgiga ega." : P1 === P2 && P1 === (di ? "AaBb" : "Aa") ? `<br>💡 Bu — Mendelning <b>${di ? "uchinchi (mustaqil irsiylanish) — 9:3:3:1" : "ikkinchi (ajralish) — 3:1"}</b> qonuni.` : P1.length === 2 && ((P1 === "AA" && P2 === "aa") || (P1 === "aa" && P2 === "AA")) ? "<br>💡 Mendelning <b>birinchi qonuni</b> — F₁ bir xil (dominantlik)." : "");
      sim.innerHTML = "";
    }
    function simulate(n) {
      const g1 = gametes(P1), g2 = gametes(P2), cnt = {};
      for (let i = 0; i < n; i++) { const c = child(g1[Math.floor(Math.random() * g1.length)], g2[Math.floor(Math.random() * g2.length)]); const k = phen(tr(), c); cnt[k] = (cnt[k] || 0) + 1; }
      const mx = Math.max(...Object.values(cnt));
      sim.innerHTML = `<b>🎲 ${n} ta avlod “ekildi”:</b>` + Object.entries(cnt).map(([k, v]) => `<div class="bio-bar"><span>${k}</span><i style="width:${(v / mx) * 100}%"></i><b>${v}</b></div>`).join("") + `<small>Ko‘p avlodda nisbat nazariyaga yaqinlashadi — Mendel 8000 dan ortiq no‘xat o‘simligini o‘rgangan!</small>`;
    }
    const opts = () => (di ? ["AABB", "AaBb", "aabb", "AaBB", "AABb", "aaBb"] : ["AA", "Aa", "aa"]);
    const selWrap = h("div", { class: "bio-sel" });
    function sels() {
      selWrap.innerHTML = "";
      const mk = (lab, val, set) => { const sl = h("select", { "aria-label": lab }); opts().forEach((o) => sl.append(h("option", { value: o }, o))); sl.value = val; sl.onchange = () => { set(sl.value); draw(); }; return h("label", {}, lab + " ", sl); };
      selWrap.append(mk("♀ Ona:", P1, (v) => (P1 = v)), mk("♂ Ota:", P2, (v) => (P2 = v)));
    }
    controls.append(buttons(["Monoduragay (A)", "Diduragay (A, B)", "Chala dominantlik"], (i) => { tk = i === 2 ? "namozshomgul" : "noxat"; di = i === 1; P1 = P2 = di ? "AaBb" : "Aa"; sels(); draw(); }, tk === "namozshomgul" ? 2 : di ? 1 : 0), selWrap,
      button("🎲 100 ta avlod", () => simulate(100)), button("🎲 1000 ta", () => simulate(1000)));
    sels(); draw();
  };

  // ===================================================================
  // 3. DNK — qo'sh spiral, komplementarlik, oqsil sintezi
  // ===================================================================
  const CODON = (() => { const b = "UCAG", aa = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG", m = {}; let i = 0; for (const x of b) for (const y of b) for (const z of b) m[x + y + z] = aa[i++]; return m; })();
  const AA = { F: "Fen", L: "Ley", S: "Ser", Y: "Tir", C: "Sis", W: "Tri", P: "Pro", H: "Gis", Q: "Gln", R: "Arg", I: "Ile", M: "Met", T: "Tre", N: "Asn", K: "Liz", V: "Val", A: "Ala", D: "Asp", E: "Glu", G: "Gli", "*": "STOP" };
  const BC = { A: "#ef4444", T: "#3b82f6", G: "#22c55e", C: "#f59e0b", U: "#a855f7" };
  W.dna = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧬 DNK: qo‘sh spiral va oqsil biosintezi");
    let seq = p.seq || "TACGGATTCACG", stage2 = 0;
    const comp = { A: "T", T: "A", G: "C", C: "G" }, rna = { A: "U", T: "A", G: "C", C: "G" };
    animCanvas(stage, 440, 160, (c, dt, t) => {
      c.clearRect(0, 0, 440, 160);
      const n = seq.length, dx = 400 / n;
      for (let i = 0; i < n; i++) {
        const x = 20 + i * dx + dx / 2, ph = i * 0.62 + t * 1.2, y1 = 80 + Math.sin(ph) * 46, y2 = 80 - Math.sin(ph) * 46, front = Math.cos(ph) > 0;
        const b1 = seq[i], b2 = comp[b1];
        c.globalAlpha = front ? 1 : 0.45;
        c.strokeStyle = BC[b1]; c.lineWidth = 5; c.beginPath(); c.moveTo(x, y1); c.lineTo(x, 80); c.stroke();
        c.strokeStyle = BC[b2]; c.beginPath(); c.moveTo(x, 80); c.lineTo(x, y2); c.stroke();
        c.fillStyle = "#e2e8f0"; c.beginPath(); c.arc(x, y1, 4, 0, TAU); c.arc(x, y2, 4, 0, TAU); c.fill();
        if (Math.abs(Math.sin(ph)) > 0.5) { c.globalAlpha = 1; c.font = "700 10px system-ui"; c.fillStyle = "#fff"; c.textAlign = "center"; c.fillText(b1, x, y1 + (y1 < 80 ? -7 : 15)); c.fillText(b2, x, y2 + (y2 < 80 ? -7 : 15)); }
      }
      c.globalAlpha = 1;
    });
    const tab = h("div", { class: "bio-dna" }); stage.append(tab);
    function draw() {
      const c2 = [...seq].map((b) => comp[b]).join(""), m = [...seq].map((b) => rna[b]).join("");
      const cod = m.match(/.{1,3}/g) || [];
      const pep = []; for (const k of cod) { if (k.length < 3) break; const a = CODON[k]; pep.push(AA[a]); if (a === "*") break; }
      tab.innerHTML = `<div><small>DNK (matritsa zanjiri)</small><code>${[...seq].map((b) => `<i style="--c:${BC[b]}">${b}</i>`).join("")}</code></div>` +
        `<div><small>Komplementar zanjir</small><code>${[...c2].map((b) => `<i style="--c:${BC[b]}">${b}</i>`).join("")}</code></div>` +
        (stage2 >= 1 ? `<div><small>i-RNK (transkripsiya)</small><code>${cod.map((k) => `<span>${[...k].map((b) => `<i style="--c:${BC[b]}">${b}</i>`).join("")}</span>`).join(" ")}</code></div>` : "") +
        (stage2 >= 2 ? `<div><small>Oqsil (translyatsiya)</small><code>${pep.map((a) => `<em class="${a === "STOP" ? "stop" : ""}">${a}</em>`).join("–")}</code></div>` : "");
      out.innerHTML = ["<b>Komplementarlik:</b> A — T (2 vodorod bog‘), G — C (3 bog‘). Chargaff qoidasi: A = T, G = C.", "<b>Transkripsiya</b> (yadroda): DNK asosida i-RNK sintezlanadi; T o‘rniga <b>U (uratsil)</b>.", "<b>Translyatsiya</b> (ribosomada): har 3 nukleotid — <b>kodon</b> — bitta aminokislotani belgilaydi. STOP-kodon sintezni to‘xtatadi."][stage2];
    }
    const inp = h("input", { class: "bio-inp", value: seq, maxlength: 24, "aria-label": "DNK ketma-ketligi" });
    inp.oninput = () => { const v = inp.value.toUpperCase().replace(/[^ATGC]/g, ""); if (v.length >= 3) { seq = v; draw(); } };
    controls.append(inp, buttons(["DNK", "→ i-RNK", "→ Oqsil"], (i) => { stage2 = i; draw(); }, 0), button("🎲 Tasodifiy gen", () => { seq = "TAC" + Array.from({ length: 9 }, () => "ATGC"[Math.floor(Math.random() * 4)]).join(""); inp.value = seq; draw(); }));
    draw();
  };

  // ===================================================================
  // 4. OZIQ ZANJIRI VA EKOLOGIK PIRAMIDA
  // ===================================================================
  const ECO = {
    "🏜 Cho‘l (Qizilqum)": { org: [["🌾", "Saksovul va o‘tlar", 0], ["🦗", "Chigirtka", 1], ["🐭", "Qumsichqon", 1], ["🦎", "Kaltakesak", 2], ["🐍", "Ilon (charxilon)", 3], ["🦅", "Burgut", 4]], eat: { 1: [0], 2: [0], 3: [1], 4: [2, 3], 5: [2, 4] } },
    "🏞 Ko‘l": { org: [["🟢", "Fitoplankton (suvo‘tlar)", 0], ["🦐", "Zooplankton", 1], ["🐟", "Mayda baliq", 2], ["🐊", "Laqqa baliq", 3], ["🦩", "Qarqara", 4]], eat: { 1: [0], 2: [1], 3: [2], 4: [2, 3] } },
    "🌳 O‘rmon (Zomin)": { org: [["🌳", "Archa va o‘tlar", 0], ["🐛", "Qurt", 1], ["🐿", "Olmaxon", 1], ["🐦", "Chumchuq", 2], ["🦊", "Tulki", 3], ["🐺", "Bo‘ri", 4]], eat: { 1: [0], 2: [0], 3: [1], 4: [2, 3], 5: [2, 4] } },
  };
  W.foodweb = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔗 Oziq zanjirini tuzing — energiya qayerga ketadi?");
    let ek = Object.keys(ECO)[0], chain = [], E0 = 10000;
    const area = h("div", { class: "bio-fw" }), pyr = h("div", { class: "bio-pyr" }); stage.append(area, pyr);
    function draw() {
      const E = ECO[ek]; area.innerHTML = "";
      const row = h("div", { class: "bio-chain" }, ...chain.map((i, k) => h("span", {}, (k ? "→ " : "") + E.org[i][0] + " " + E.org[i][1])));
      if (!chain.length) row.append(h("span", { class: "muted" }, "Zanjirni <b>produtsent</b>dan (o‘simlikdan) boshlang…"));
      area.append(row);
      const cards = h("div", { class: "bio-cards" });
      E.org.forEach(([em, n], i) => cards.append(h("button", { type: "button", class: "ks-bin" + (chain.includes(i) ? " used" : ""), onclick: () => pick(i) }, em + " " + n)));
      area.append(cards);
      pyr.innerHTML = chain.map((_, k) => { const e = E0 / 10 ** k; return `<div style="width:${Math.max(18, 100 - k * 18)}%"><b>${chain.length ? ECO[ek].org[chain[k]][0] : ""}</b> ${e >= 1 ? Math.round(e).toLocaleString("uz") : e.toFixed(2)} kJ</div>`; }).reverse().join("");
    }
    function pick(i) {
      const E = ECO[ek];
      if (chain.includes(i)) return;
      if (!chain.length) { if (E.org[i][2] !== 0) { out.innerHTML = "❌ Zanjir har doim <b>produtsent</b> — yashil o‘simlikdan boshlanadi (u Quyosh energiyasini to‘playdi)."; return; } chain.push(i); }
      else { const prev = chain[chain.length - 1]; if (!(E.eat[i] || []).includes(prev)) { out.innerHTML = `❌ ${E.org[i][0]} ${E.org[i][1]} — ${E.org[prev][1].toLowerCase()} bilan oziqlanmaydi. Boshqasini tanlang.`; return; } chain.push(i); }
      draw();
      const lvl = ["produtsent", "I tartibli konsument", "II tartibli konsument", "III tartibli konsument", "IV tartibli konsument"];
      out.innerHTML = `✅ ${E.org[i][0]} — <b>${lvl[chain.length - 1]}</b>. ` + (chain.length > 1 ? `<b>10 % qoidasi:</b> har bir pog‘onaga oldingisining faqat ~10 % energiyasi o‘tadi, qolgani nafas olish va issiqlikka sarflanadi.` : "Endi uni kim yeydi?");
    }
    controls.append(buttons(Object.keys(ECO), (i) => { ek = Object.keys(ECO)[i]; chain = []; draw(); out.innerHTML = "Ekosistema tanlandi. Zanjirni tuzing."; }, 0), button("↺ Qaytadan", () => { chain = []; draw(); }),
      slider({ label: "Produtsentlar to‘plagan energiya", min: 1000, max: 100000, step: 1000, value: E0, fmt: (v) => v.toLocaleString("uz") + " kJ", onInput: (v) => { E0 = v; draw(); } }));
    draw(); out.innerHTML = "Organizmlarni <b>“kim kimni yeydi”</b> tartibida bosing. Pastda <b>ekologik piramida</b> quriladi.";
  };

  // ===================================================================
  // 5. YIRTQICH — O'LJA (populyatsiyalar dinamikasi)
  // ===================================================================
  W.ecosim = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🐇🐺 Populyatsiyalar: o‘t — quyon — bo‘ri");
    let R, Wv, grass, hist, hunt = 0, tAcc = 0;
    const reset = () => { R = []; Wv = []; grass = new Float32Array(22 * 14).fill(1); hist = []; for (let i = 0; i < 30; i++) R.push(ag()); for (let i = 0; i < 4; i++) Wv.push(ag(60)); };
    const ag = (e = 30) => ({ x: Math.random() * 440, y: Math.random() * 210, a: Math.random() * TAU, e });
    reset();
    animCanvas(stage, 440, 300, (c, dt) => {
      dt = Math.min(dt, 0.04);
      for (let i = 0; i < grass.length; i++) grass[i] = Math.min(1, grass[i] + dt * 0.08);
      const gi = (x, y) => clamp(Math.floor(y / 15), 0, 13) * 22 + clamp(Math.floor(x / 20), 0, 21);
      const move = (q, v) => { q.a += (Math.random() - 0.5) * dt * 4; q.x += Math.cos(q.a) * v * dt; q.y += Math.sin(q.a) * v * dt; if (q.x < 0 || q.x > 440) { q.a = PI - q.a; q.x = clamp(q.x, 0, 440); } if (q.y < 0 || q.y > 210) { q.a = -q.a; q.y = clamp(q.y, 0, 210); } };
      for (let i = R.length - 1; i >= 0; i--) { const r = R[i]; move(r, 30); r.e -= dt * 4; const k = gi(r.x, r.y); if (grass[k] > 0.4) { grass[k] -= 0.4; r.e += 6; } if (r.e > 45 && R.length < 260) { r.e -= 22; R.push({ ...r, e: 18, a: Math.random() * TAU }); } if (r.e <= 0) R.splice(i, 1); }
      for (let i = Wv.length - 1; i >= 0; i--) { const w = Wv[i]; let tgt = null, bd = 60; for (const r of R) { const d = Math.hypot(r.x - w.x, r.y - w.y); if (d < bd) { bd = d; tgt = r; } } if (tgt) w.a = Math.atan2(tgt.y - w.y, tgt.x - w.x); move(w, 38); w.e -= dt * 3.2; if (tgt && bd < 7) { R.splice(R.indexOf(tgt), 1); w.e += 20; } if (w.e > 80 && Wv.length < 60) { w.e -= 40; Wv.push({ ...w, e: 35 }); } if (w.e <= 0 || (hunt && Math.random() < dt * 0.15 * hunt)) Wv.splice(i, 1); }
      if (!R.length && Math.random() < dt) R.push(ag());
      tAcc += dt; if (tAcc > 0.25) { tAcc = 0; hist.push([R.length, Wv.length]); if (hist.length > 220) hist.shift(); }
      c.clearRect(0, 0, 440, 300);
      for (let i = 0; i < grass.length; i++) { c.fillStyle = `rgba(34,197,94,${0.12 + grass[i] * 0.45})`; c.fillRect((i % 22) * 20, Math.floor(i / 22) * 15, 20, 15); }
      c.font = "12px system-ui"; c.textAlign = "center"; c.textBaseline = "middle"; for (const r of R) c.fillText("🐇", r.x, r.y); c.font = "16px system-ui"; for (const w of Wv) c.fillText("🐺", w.x, w.y);
      c.fillStyle = "rgba(2,6,23,.75)"; c.fillRect(0, 212, 440, 88);
      const mx = Math.max(40, ...hist.map((x) => x[0]));
      [[0, "#fbbf24"], [1, "#94a3b8"]].forEach(([k, col]) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); hist.forEach((q, i) => { const x = 4 + i * 2, y = 294 - (q[k] * (k ? 6 : 1) / mx) * 76; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); });
      label(c, 360, 226, `🐇 ${R.length}  🐺 ${Wv.length}`, "#fff", "rgba(0,0,0,.5)", 12);
    });
    controls.append(button("🐇 +10 quyon", () => { for (let i = 0; i < 10; i++) R.push(ag()); }), button("🐺 +3 bo‘ri", () => { for (let i = 0; i < 3; i++) Wv.push(ag(60)); }),
      buttons(["Ovchilik yo‘q", "🔫 Bo‘rilarni ovlash"], (i) => (hunt = i), 0), button("↺ Qaytadan", reset));
    out.innerHTML = "Quyonlar o‘t yeb ko‘payadi, bo‘rilar quyonlarni ovlaydi. Grafikda (🟡 quyonlar, ⚪ bo‘rilar ×6) <b>populyatsiya to‘lqinlari</b> paydo bo‘ladi: o‘lja ko‘paysa — yirtqich ko‘payadi, keyin o‘lja kamayadi… Bo‘rilarni ovlab ko‘ring — quyonlar o‘tni yeb bitiradi! Bu <b>ekologik muvozanat</b>.";
  };

  // ===================================================================
  // 6. ANIQLAGICH (dixotomik kalit)
  // ===================================================================
  const KEY_ANIMALS = { q: "Umurtqa pog‘onasi bormi?", y: { q: "Tanasi pat bilan qoplanganmi?", y: "🐦 Qushlar", n: { q: "Bolasini sut bilan boqadimi?", y: "🐄 Sutemizuvchilar", n: { q: "Jabra bilan nafas oladimi (butun umr)?", y: "🐟 Baliqlar", n: { q: "Terisi quruq, shoxsimon tangachali-mi?", y: "🦎 Sudralib yuruvchilar (reptiliyalar)", n: "🐸 Suvda va quruqlikda yashovchilar (amfibiyalar)" } } } }, n: { q: "Oyoqlari bo‘g‘imli-mi?", y: { q: "Oyoqlari 3 juftmi (6 ta)?", y: "🐞 Hasharotlar", n: { q: "Oyoqlari 4 juftmi (8 ta)?", y: "🕷 O‘rgimchaksimonlar", n: "🦞 Qisqichbaqasimonlar" } }, n: { q: "Tanasi chig‘anoq ichidami yoki yumshoqmi?", y: "🐌 Mollyuskalar", n: { q: "Tanasi bo‘g‘imlarga (halqalarga) bo‘linganmi?", y: "🪱 Halqali chuvalchanglar", n: "🪼 Kovakichlilar va boshqa umurtqasizlar" } } } };
  const KEY_PLANTS = { q: "Gul va meva hosil qiladimi?", y: { q: "Urug‘ida 2 ta urug‘palla bormi, barg tomirlari to‘rsimonmi?", y: "🌻 Ikki urug‘pallalilar", n: "🌾 Bir urug‘pallalilar" }, n: { q: "Urug‘i bormi (qubbalarda)?", y: "🌲 Ochiq urug‘lilar (qarag‘ay, archa)", n: { q: "Ildizi va o‘tkazuvchi to‘qimasi bormi?", y: "🌿 Qirqquloqsimonlar, qirqbo‘g‘imlar", n: "🟩 Yo‘sinlar" } } };
  W.dkey = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔎 Aniqlagich — savollarga javob berib, organizm guruhini toping");
    const KEY = p.plants ? KEY_PLANTS : KEY_ANIMALS;
    const tests = p.tests || (p.plants ? [["🌹", "Atirgul"], ["🌽", "Makkajo‘xori"], ["🌲", "Qarag‘ay"], ["🌿", "Qirqquloq"], ["🟩", "Funariya yo‘sini"], ["🍎", "Olma"]] : [["🐬", "Delfin"], ["🦇", "Ko‘rshapalak"], ["🐧", "Pingvin"], ["🐢", "Toshbaqa"], ["🐸", "Baqa"], ["🦂", "Chayon"], ["🦋", "Kapalak"], ["🐙", "Sakkizoyoq"], ["🦀", "Krab"], ["🦈", "Akula"]]);
    let node = KEY, path = [], cur = 0;
    const card = h("div", { class: "bio-key" }); stage.append(card);
    function draw() {
      const [em, nm] = tests[cur];
      if (typeof node === "string") { card.innerHTML = `<div class="bio-key-o">${em}</div><b>${nm}</b> → <span class="ok">${node}</span><small>${path.join(" → ")}</small>`; controls.innerHTML = ""; controls.append(button("➡ Keyingi organizm", () => { cur = (cur + 1) % tests.length; node = KEY; path = []; draw(); })); out.innerHTML = "Javobingizni darslik bilan tekshiring. 💡 Ko‘rinishiga aldanmang: delfin — baliq emas, ko‘rshapalak — qush emas!"; return; }
      card.innerHTML = `<div class="bio-key-o">${em}</div><b>${nm}</b><p>❓ ${node.q}</p><small>${path.join(" → ")}</small>`;
      controls.innerHTML = ""; controls.append(button("✅ Ha", () => { path.push("Ha"); node = node.y; draw(); }), button("❌ Yo‘q", () => { path.push("Yo‘q"); node = node.n; draw(); }), button("⏭ Boshqa organizm", () => { cur = (cur + 1) % tests.length; node = KEY; path = []; draw(); }));
      out.innerHTML = "<b>Dixotomik kalit</b> — har qadamda ikki javobli savol. Olimlar yangi turlarni shunday aniqlaydi (K. Linney tizimi).";
    }
    draw();
  };

  // ===================================================================
  // 7. ODAM ORGANLAR SISTEMALARI
  // ===================================================================
  const SYS = {
    "🦴 Tayanch-harakat": [["Bosh suyagi", 200, 40, "Miyani himoya qiladi; 23 ta suyakdan iborat."], ["Umurtqa pog‘onasi", 200, 150, "33–34 umurtqa; 4 ta egrilik — yurganda zarbani yumshatadi."], ["Qovurg‘alar", 175, 120, "12 juft — yurak va o‘pkani himoya qiladi."], ["Son suyagi", 185, 245, "Eng uzun va mustahkam suyak."], ["Biseps", 132, 140, "Qo‘lni bukuvchi muskul."]],
    "❤️ Qon aylanish": [["Yurak", 212, 120, "4 kamerali nasos — kuniga ~100 ming marta qisqaradi."], ["Aorta", 200, 100, "Eng yirik arteriya — chap qorinchadan chiqadi."], ["Kapillyarlar", 140, 200, "Eng ingichka tomirlar — gaz va moddalar almashinuvi shu yerda."]],
    "🫁 Nafas": [["Traxeya", 200, 80, "Kekirdak — tog‘ay halqali havo yo‘li."], ["O‘pkalar", 180, 120, "~700 mln alveola; yuzasi ~100 m²."], ["Diafragma", 200, 160, "Nafas olishdagi asosiy muskul."]],
    "🍽 Hazm": [["Oshqozon", 215, 170, "Kislotali shira, pepsin — oqsillar parchalanadi."], ["Jigar", 180, 160, "Eng katta bez (~1,5 kg); o‘t ishlab chiqaradi, zaharlarni zararsizlantiradi."], ["Ingichka ichak", 200, 200, "~5–6 m; oziq moddalar qonga so‘riladi."], ["Yo‘g‘on ichak", 230, 210, "Suv so‘riladi."]],
    "🧠 Nerv": [["Bosh miya", 200, 32, "~86 mlrd neyron; fikrlash, xotira, boshqaruv markazi."], ["Orqa miya", 200, 140, "Umurtqa kanalida; reflekslar markazi va o‘tkazuvchi yo‘l."], ["Nervlar", 140, 230, "Signallarni 120 m/s gacha tezlikda o‘tkazadi."]],
    "🧪 Endokrin (bezlar)": [["Gipofiz", 200, 44, "“Bezlar qiroli” — boshqa bezlarni boshqaradi; o‘sish gormoni."], ["Qalqonsimon bez", 200, 76, "Tiroksin — moddalar almashinuvi; yod yetishmasa — buqoq."], ["Ayrisimon bez", 200, 100, "Immunitet (T-limfotsitlar) — bolalikda faol."], ["Buyrakusti bezlari", 185, 180, "Adrenalin — xavf va hayajonda yurak tezlashadi."], ["Oshqozonosti bezi", 210, 185, "Insulin — qondagi qandni kamaytiradi; yetishmasa — qandli diabet."]],
    "💧 Ayirish": [["Buyraklar", 185, 185, "Kuniga ~180 l birlamchi siydik filtrlaydi, ~1,5 l chiqaradi."], ["Siydik qopi", 200, 235, "Siydik vaqtincha to‘planadi."], ["Teri", 130, 110, "Ter bilan suv, tuzlar ajraladi; harorat boshqariladi."]],
  };
  W.body = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧍 Odam organizmi — sistemani tanlang, organni bosing");
    const g = svg(400, 290, "fz-svg bio-body"); stage.append(g);
    let sk = p.sys || Object.keys(SYS)[0];
    function draw() {
      g.innerHTML = "";
      s("path", { d: "M200 10 a26 28 0 1 1 -0.1 0 Z M170 66 h60 q22 4 30 30 l20 90 q3 14 -10 14 l-12 -60 l-6 60 l4 130 h-26 l-10 -110 h-0 l-10 110 h-26 l4 -130 l-6 -60 l-12 60 q-13 0 -10 -14 l20 -90 q8 -26 30 -30 Z", fill: "rgba(148,163,184,.18)", stroke: "#94a3b8", "stroke-width": 2 }, g);
      SYS[sk].forEach(([n, x, y, d], i) => {
        const gg = s("g", { class: "tx-pin", transform: `translate(${x},${y})` }, g);
        s("circle", { r: 13, class: "tx-hit" }, gg); s("circle", { r: 7, class: "bio-dot", style: `--d:${i * 0.2}s` }, gg);
        const right = x >= 200; s("text", { x: right ? 12 : -12, y: 4, "text-anchor": right ? "start" : "end", class: "tx-lab", text: n }, gg);
        gg.addEventListener("click", () => { g.querySelectorAll(".on").forEach((e) => e.classList.remove("on")); gg.classList.add("on"); out.innerHTML = `<b>${n}</b> — ${d}`; });
      });
    }
    controls.append(buttons(Object.keys(SYS), (i) => { sk = Object.keys(SYS)[i]; draw(); out.innerHTML = "Nuqtani bosing — organ haqida ma’lumot."; }, Object.keys(SYS).indexOf(sk)));
    draw(); out.innerHTML = "Sistemani tanlang va nuqtalarni bosing. <b>Barcha sistemalar birgalikda</b> ishlab, organizm yaxlitligini ta’minlaydi — ularni <b>nerv</b> va <b>gumoral (gormonlar)</b> boshqaruv bog‘laydi.";
  };

  // ===================================================================
  // 8. BAKTERIYALAR KO'PAYISHI
  // ===================================================================
  W.growth = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧫 Petri likopchasi — bakteriyalar qanday tez ko‘payadi?");
    let temp = 37, soap = 0, food = 1, tm = 0, play = true, N = 1;
    const col = []; const R = rng(77); for (let i = 0; i < 26; i++) col.push([(R() - 0.5) * 2, (R() - 0.5) * 2, R()]);
    const k = () => (Math.exp(-((temp - 37) ** 2) / 120) * (temp < 4 || temp > 60 ? 0 : 1) * food * (soap ? 0.05 : 1) * Math.log(2)) / 20; // daqiqasiga
    animCanvas(stage, 440, 260, (c, dt) => {
      if (play) { tm += dt * 30; N = Math.min(1e12, N * Math.exp(k() * dt * 30)); if (soap && N > 1) N *= Math.exp(-dt * 0.9); }
      c.clearRect(0, 0, 440, 260);
      c.fillStyle = "#fef3c7"; c.strokeStyle = "#cbd5e1"; c.lineWidth = 4; c.beginPath(); c.arc(130, 130, 110, 0, TAU); c.fill(); c.stroke();
      const cover = clamp(Math.log10(Math.max(1, N)) / 10, 0, 1);
      col.forEach(([x, y, s0], i) => { if (i / col.length > cover * 1.3) return; const len = Math.hypot(x, y); if (len > 1) return; const r = 4 + cover * 22 * s0; c.fillStyle = `rgba(234,179,8,${0.55 + s0 * 0.3})`; c.beginPath(); c.arc(130 + x * 90, 130 + y * 90, r, 0, TAU); c.fill(); });
      const pl = (v) => 230 - (Math.log10(Math.max(1, v)) / 12) * 200;
      c.strokeStyle = "#475569"; c.lineWidth = 1; c.strokeRect(270, 30, 160, 200);
      c.fillStyle = "#fbbf24"; c.beginPath(); c.arc(270 + Math.min(160, tm / 6), pl(N), 4, 0, TAU); c.fill();
      label(c, 350, 18, "lg N (bakteriya soni)", "#cbd5e1", "rgba(0,0,0,0)", 10);
      label(c, 130, 250, `⏱ ${Math.floor(tm / 60)} soat ${Math.floor(tm % 60)} daq`, "#fff", "rgba(0,0,0,.5)", 12);
      label(c, 350, 246, `N ≈ ${N < 1e4 ? Math.round(N) : N.toExponential(1).replace("e+", "·10^")}`, "#fde68a", "rgba(0,0,0,.5)", 12);
    });
    const info = () => (out.innerHTML = `Qulay sharoitda (37 °C, oziq yetarli) bakteriya <b>har ~20 daqiqada ikkiga bo‘linadi</b>: 1 → 2 → 4 → 8… 10 soatda bittasidan <b>milliardlab</b>! Sovuq (muzlatgich) va issiq (qaynatish) ko‘payishni to‘xtatadi, <b>sovun va antiseptik</b> ularni yo‘q qiladi. Shuning uchun qo‘l yuvish va oziq-ovqatni sovuqda saqlash muhim.`);
    controls.append(slider({ label: "🌡 Harorat", min: 0, max: 70, value: temp, fmt: (v) => v + " °C" + (v <= 5 ? " (muzlatgich)" : v >= 60 ? " (issiq)" : ""), onInput: (v) => (temp = v) }),
      slider({ label: "🍲 Oziq muhit", min: 0, max: 1, step: 0.1, value: food, fmt: (v) => Math.round(v * 100) + " %", onInput: (v) => (food = v) }),
      buttons(["Sovunsiz", "🧼 Sovun / antiseptik"], (i) => (soap = i), 0), button("↺ 1 ta bakteriyadan qayta", () => { N = 1; tm = 0; }), button("⏯", () => (play = !play)));
    info();
  };

  // ===================================================================
  // 9. EKOLOGIK OMIL VA CHIDAMLILIK CHEGARASI
  // ===================================================================
  const TOL = { "🐪 Tuya": [-25, 22, 52], "🐧 Pingvin": [-60, -5, 25], "🐟 Forel (baliq)": [0, 13, 25], "🌵 Kaktus": [-5, 35, 60], "🧑 Odam (kiyimsiz)": [5, 27, 45] };
  W.tolerance = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌡 Ekologik omil — optimum va chidamlilik chegaralari (Shelford qonuni)");
    let ok = Object.keys(TOL)[0], T = 20;
    const box = h("div"); stage.append(box);
    function draw() {
      const [mn, op, mx] = TOL[ok], P = plot(-60, 70, 0, 1.15, 380, 200, ["harorat, °C", "hayotiylik"]);
      const f = (x) => (x <= mn || x >= mx ? 0 : x < op ? Math.sin(((x - mn) / (op - mn)) * PI / 2) : Math.cos(((x - op) / (mx - op)) * PI / 2));
      P.area(f, mn, mx, "rgba(34,197,94,.25)"); P.curve(f, "#22c55e"); P.dot(T, f(T), f(T) > 0.7 ? "#22c55e" : f(T) > 0.2 ? "#f59e0b" : "#ef4444", 7);
      P.text(mn, 0.05, "min", "#ef4444", "middle"); P.text(op, 1.08, "optimum", "#22c55e", "middle"); P.text(mx, 0.05, "max", "#ef4444", "middle");
      box.innerHTML = ""; box.append(P.g);
      const v = f(T); out.innerHTML = `${ok} — ${T} °C da: ${v > 0.7 ? "😊 <b>Optimum zonasi</b> — hayot faoliyati eng yaxshi." : v > 0.2 ? "😐 <b>Pessimum (ezilish) zonasi</b> — yashaydi, lekin qiynaladi, ko‘paymaydi." : v > 0 ? "😟 Chegaraga yaqin — juda og‘ir." : "☠️ <b>Chidamlilik chegarasidan tashqarida</b> — organizm halok bo‘ladi."}<br>Chidamlilik oralig‘i: <b>${mn}…${mx} °C</b>. Keng oraliqli turlar — <b>evriterm</b>, tor oraliqli — <b>stenoterm</b>.`;
    }
    controls.append(buttons(Object.keys(TOL), (i) => { ok = Object.keys(TOL)[i]; draw(); }, 0), slider({ label: "🌡 Muhit harorati", min: -60, max: 70, value: T, fmt: (v) => v + " °C", onInput: (v) => { T = v; draw(); } }));
    draw();
  };
})();
