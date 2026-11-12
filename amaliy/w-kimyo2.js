/* Kimyo uchun jonli tajribalar (2-qism): atom tuzilishi va izotoplar, davriy jadval, molyar massa kalkulyatori,
   tenglama tenglashtirish o'yini, oksidlanish darajasi, kimyoviy bog'lanish, organik molekula quruvchi, yadro reaksiyalari. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, W } = window.AK;
  const K = window.KIM;
  const { EL, BY, CAT, place, shells, cfgHTML, parse, mr, fml, balance, eqHTML, esc } = K;
  const SYM92 = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U".split(" ");
  const byZ = (z) => EL.find((e) => e.z === z);

  // ===================================================================
  // 1. Atom tuzilishi (Bor modeli), izotoplar va ionlar
  // ===================================================================
  W.atom = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⚛️ Atom quruvchi — proton, neytron va elektronlarni o‘zgartiring");
    let z = p.z || 6, n = null, e = null;
    const g = svg(320, 320, "kb-svg ka-atom"); stage.append(g);
    const maxZ = p.max || 36;
    const zs = slider({ label: "Protonlar (Z)", min: 1, max: maxZ, value: z, onInput: (v) => { z = v; n = null; e = null; draw(); } });
    const ctl = (lbl, f) => h("div", { class: "ka-pm" }, h("span", {}, lbl), button("−", () => f(-1), "ghost"), button("+", () => f(1), "ghost"));
    controls.append(zs, ctl("Neytron", (d) => { n = Math.max(0, (n ?? baseN()) + d); draw(); }), ctl("Elektron", (d) => { e = Math.max(0, Math.min(z + 3, (e ?? z) + d)); draw(); }));
    const baseN = () => Math.round(byZ(z).ar) - z;
    function draw() {
      const el = byZ(z), N = n ?? baseN(), E = e ?? z, A = z + N, q = z - E;
      // elektronlar soni bo'yicha qavatlar (ionlar uchun elektronni oxirgi qavatdan olamiz/qo'shamiz)
      let sh = shells(Math.max(1, E)); if (E === 0) sh = [];
      const R0 = 34, step = Math.min(30, 120 / Math.max(1, sh.length));
      let html = `<circle cx="160" cy="160" r="${R0 - 8}" fill="url(#kaN)"/>
        <defs><radialGradient id="kaN"><stop offset="0" stop-color="#fca5a5"/><stop offset="1" stop-color="#b91c1c"/></radialGradient></defs>`;
      // yadro: proton (qizil) va neytron (kulrang) sharchalari
      const nuc = Math.min(A, 40);
      for (let i = 0; i < nuc; i++) { const a = i * 2.4, r = 3.4 * Math.sqrt(i); html += `<circle cx="${160 + r * Math.cos(a)}" cy="${160 + r * Math.sin(a)}" r="4.2" fill="${i % (A / Math.max(1, z)) < 1 ? "#ef4444" : "#9ca3af"}" stroke="rgba(0,0,0,.25)"/>`; }
      sh.forEach((cnt, i) => {
        const r = R0 + 10 + step * (i + 1);
        html += `<circle cx="160" cy="160" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".28" stroke-dasharray="3 4"/><g class="ka-orbit" style="animation-duration:${8 + i * 5}s">`;
        for (let k = 0; k < cnt; k++) { const a = (k / cnt) * Math.PI * 2; html += `<circle cx="${160 + r * Math.cos(a)}" cy="${160 + r * Math.sin(a)}" r="4.6" fill="#38bdf8" stroke="#0c4a6e"/>`; }
        html += `</g><text x="${160 + r + 2}" y="156" class="ka-n">${cnt}</text>`;
      });
      g.innerHTML = html;
      const [per, grp] = place(z);
      const nat = n == null ? "" : N === baseN() ? "" : `<div>⚠️ Bu — <b>${el.sym}-${A}</b> izotopi (eng ko‘p tarqalgani ${el.sym}-${Math.round(el.ar)}). Izotoplarda proton soni bir xil, neytron soni har xil.</div>`;
      const ion = q === 0 ? "neytral atom" : `${q > 0 ? "musbat" : "manfiy"} ion: <b>${el.sym}<sup>${Math.abs(q) > 1 ? Math.abs(q) : ""}${q > 0 ? "+" : "−"}</sup></b> (${q > 0 ? "elektron berdi — kation" : "elektron oldi — anion"})`;
      out.innerHTML = `<div class="ka-card"><span class="ka-sym" style="--c:${CAT[el.cat][1]}"><small>${z}</small>${el.sym}<em>${num(el.ar)}</em></span>
        <div><b>${el.name}</b> · ${CAT[el.cat][0]} · ${per}-davr, ${grp <= 2 ? grp : grp >= 13 ? grp - 10 : grp}-guruh${grp >= 3 && grp <= 12 ? " (yonaki)" : ""}
        <div>p⁺ = <b>${z}</b> · n⁰ = <b>${N}</b> · e⁻ = <b>${E}</b> · A = p + n = <b>${A}</b></div>
        <div>Elektron formula: <span class="ka-cfg">${E ? cfgHTML(E) : "—"}</span></div>
        <div>Qavatlarda: ${sh.join(", ") || "—"} · ${ion}</div></div></div>${nat}`;
    }
    draw();
  };

  // ===================================================================
  // 2. Interaktiv davriy jadval
  // ===================================================================
  W.periodic = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧩 Davriy jadval — elementni bosing");
    const grid = h("div", { class: "kp-grid" });
    let mode = 0;
    const MODES = ["Turi bo‘yicha", "Elektromanfiylik", "Atom radiusi (taxminiy)", "Metall xossasi"];
    const radius = (e) => { const [per, grp] = place(e.z); return per * 0.55 + (grp <= 2 ? 0.6 : grp >= 13 ? (18 - grp) * 0.05 : 0.3); };
    const colorOf = (e) => {
      if (mode === 0) return CAT[e.cat][1];
      if (mode === 1) return e.en ? `hsl(${220 - e.en * 55} 80% ${70 - e.en * 6}%)` : "#64748b";
      if (mode === 2) { const r = radius(e); return `hsl(${200 - r * 30} 75% ${75 - r * 9}%)`; }
      return ["ak", "ae", "tm", "me"].includes(e.cat) ? "#f59e0b" : e.cat === "ym" ? "#2dd4bf" : "#38bdf8";
    };
    function draw() {
      grid.innerHTML = "";
      for (const e of EL) {
        const [per, grp] = place(e.z);
        const b = h("button", { type: "button", class: "kp-el", style: `grid-row:${per};grid-column:${grp};--c:${colorOf(e)}`, title: e.name }, h("small", {}, String(e.z)), h("b", {}, e.sym));
        b.onclick = () => { grid.querySelectorAll(".on").forEach((x) => x.classList.remove("on")); b.classList.add("on"); info(e); };
        grid.append(b);
      }
      for (let i = 1; i <= 18; i++) grid.append(h("span", { class: "kp-gh", style: `grid-row:7;grid-column:${i}` }, i <= 2 ? `${i}A` : i >= 13 ? `${i - 10}A` : i <= 7 ? `${i}B` : i <= 10 ? "8B" : `${i - 10}B`));
    }
    function info(e) {
      const [per, grp] = place(e.z), sh = shells(e.z);
      out.innerHTML = `<div class="ka-card"><span class="ka-sym" style="--c:${CAT[e.cat][1]}"><small>${e.z}</small>${e.sym}<em>${num(e.ar)}</em></span><div><b>${e.name}</b> — ${CAT[e.cat][0]}
        <div>${per}-davr · ${grp <= 2 ? grp + "A" : grp >= 13 ? grp - 10 + "A" : (grp <= 7 ? grp : grp <= 10 ? 8 : grp - 10) + "B"} guruh · elektronlar qavatlarda: ${sh.join(", ")}</div>
        <div>Elektron formula: <span class="ka-cfg">${cfgHTML(e.z)}</span></div>
        <div>Nisbiy atom massa: <b>${num(e.ar)}</b> · Elektromanfiylik: <b>${e.en || "—"}</b></div></div></div>`;
    }
    controls.append(buttons(MODES, (i) => { mode = i; draw(); legend(); }, 0));
    const lg = h("div", { class: "kp-legend" });
    function legend() {
      lg.innerHTML = mode === 0 ? Object.values(CAT).map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join("")
        : mode === 1 ? "→ davr bo‘ylab chapdan o‘ngga <b>ortadi</b>, ↓ guruhda yuqoridan pastga <b>kamayadi</b>. Eng elektromanfiy — <b>F</b>."
        : mode === 2 ? "→ davrda chapdan o‘ngga radius <b>kichrayadi</b> (yadro zaryadi ortadi), ↓ guruhda <b>kattalashadi</b> (qavatlar ko‘payadi)."
        : "Metallik xossa ↙ pastga-chapga kuchayadi (eng kuchli — Cs), metallmaslik ↗ yuqoriga-o‘ngga (eng kuchli — F).";
    }
    stage.append(h("div", { class: "kp-wrap" }, grid), lg);
    draw(); legend();
    out.innerHTML = "Elementni bosing — atom tuzilishi va xossalari chiqadi. Rang rejimini almashtirib, <b>davriy qonuniyatlarni</b> ko‘ring.";
  };

  // ===================================================================
  // 3. Molyar massa, massa ulushi, modda miqdori
  // ===================================================================
  W.molar = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⚖️ Formula kalkulyatori: Mr, massa ulushlari va modda miqdori");
    const PRE = p.presets || ["H2O", "CO2", "NaCl", "H2SO4", "CaCO3", "Ca(OH)2", "CuSO4·5H2O", "NH3", "C6H12O6", "Al2(SO4)3"];
    let f = p.f || PRE[0], m = p.m || 36, gas = false;
    const inp = h("input", { type: "text", class: "kb-input", value: f, "aria-label": "Formula", autocapitalize: "off", spellcheck: "false" });
    inp.oninput = () => { f = inp.value; draw(); };
    const pre = buttons(PRE.map(fml), (i) => { f = PRE[i]; inp.value = f; draw(); }, PRE.indexOf(f));
    const ms = slider({ label: "Massa, g", min: 1, max: 500, value: m, onInput: (v) => { m = v; draw(); } });
    const gb = h("label", { class: "kb-check" }, h("input", { type: "checkbox", onchange: (e) => { gas = e.target.checked; draw(); } }), " gaz (n.sh. hajmi)");
    controls.append(h("label", { class: "ctl wide" }, h("span", {}, "Formulani yozing (masalan: Fe2(SO4)3)"), inp), pre, ms, gb);
    function draw() {
      let c;
      try { c = parse(f); } catch (e) { stage.innerHTML = ""; out.innerHTML = `<span class="bad">⚠️ ${esc(e.message)}</span>`; return; }
      const M = mr(c), nn = m / M;
      const parts = Object.entries(c).map(([e, k], i) => [e, k, BY[e].ar * k, window.AK.COLORS[i % 10]]);
      stage.innerHTML = `<div class="km-bar">${parts.map(([e, k, w, col]) => `<i style="flex:${w};background:${col}" title="${e}">${(w / M) > 0.07 ? e : ""}</i>`).join("")}</div>`;
      out.innerHTML = `<div class="big-num">M<sub>r</sub>(${fml(f)}) = ${parts.map(([e, k]) => `${k > 1 ? k + "·" : ""}${num(BY[e].ar)}`).join(" + ")} = ${num(M)}</div>
        <div class="km-w">${parts.map(([e, k, w, col]) => `<span><i style="background:${col}"></i>ω(${e}) = ${num((w / M) * 100, 2)}%</span>`).join("")}</div>
        <div>M = <b>${num(M)} g/mol</b> · ${num(m)} g → n = m / M = <b>${num(nn, 3)} mol</b> · N = n·N<sub>A</sub> = <b>${num(nn * 6.02, 3)}·10²³</b> ta molekula${gas ? ` · V = n·22,4 = <b>${num(nn * 22.4, 2)} l</b> (n.sh.)` : ""}</div>`;
    }
    draw();
  };

  // ===================================================================
  // 4. Tenglama tenglashtirish o'yini
  // ===================================================================
  const EQS = [[["H2", "O2"], ["H2O"]], [["Al", "O2"], ["Al2O3"]], [["Fe", "Cl2"], ["FeCl3"]], [["Na", "H2O"], ["NaOH", "H2"]], [["CH4", "O2"], ["CO2", "H2O"]],
    [["N2", "H2"], ["NH3"]], [["KClO3"], ["KCl", "O2"]], [["Al", "HCl"], ["AlCl3", "H2"]], [["Fe2O3", "CO"], ["Fe", "CO2"]], [["C3H8", "O2"], ["CO2", "H2O"]],
    [["P", "O2"], ["P2O5"]], [["Ca(OH)2", "H3PO4"], ["Ca3(PO4)2", "H2O"]], [["Fe", "O2"], ["Fe3O4"]], [["NH3", "O2"], ["NO", "H2O"]], [["Cu", "HNO3"], ["Cu(NO3)2", "NO", "H2O"]]];
  W.balance = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⚖️ Tenglamani tenglashtiring — koeffitsiyentlarni tanlang");
    const list = p.eqs || EQS;
    let cur = 0, k = [];
    const box = h("div", { class: "kq-eq" }), table = h("div", { class: "kq-tab" }), scale = svg(260, 90, "kq-scale");
    stage.append(box, scale, table);
    const sel = h("select", { class: "kb-select", "aria-label": "Tenglama" }, ...list.map(([l, r], i) => h("option", { value: i }, `${l.join(" + ")} → ${r.join(" + ")}`)));
    sel.onchange = () => { cur = +sel.value; reset(); };
    controls.append(h("label", { class: "ctl wide" }, h("span", {}, "Reaksiya"), sel), button("💡 Javobni ko‘rsat", () => { k = balance(...list[cur]).slice(); draw(); }, "ghost"), button("↺", () => reset(), "ghost"));
    function reset() { k = list[cur][0].concat(list[cur][1]).map(() => 1); draw(); }
    function draw() {
      const [L, Rr] = list[cur], sp = L.concat(Rr), comps = sp.map(parse);
      box.innerHTML = "";
      sp.forEach((f, i) => {
        if (i === L.length) box.append(h("span", { class: "kq-arrow" }, "→")); else if (i) box.append(h("span", { class: "kq-plus" }, "+"));
        const cell = h("span", { class: "kq-sp" }, h("button", { type: "button", class: "kq-k", onclick: () => { k[i] = k[i] % 20 + 1; draw(); }, oncontextmenu: (e) => { e.preventDefault(); k[i] = k[i] > 1 ? k[i] - 1 : 20; draw(); } }, String(k[i])), h("span", { html: fml(f) }));
        box.append(cell);
      });
      const els = [...new Set(comps.flatMap((c) => Object.keys(c)))];
      let ok = true, dl = 0;
      table.innerHTML = `<div class="kq-row kq-hd"><span>Element</span><span>Chapda</span><span>O‘ngda</span><span></span></div>` + els.map((e) => {
        const l = comps.slice(0, L.length).reduce((a, c, i) => a + (c[e] || 0) * k[i], 0), r = comps.slice(L.length).reduce((a, c, i) => a + (c[e] || 0) * k[L.length + i], 0);
        if (l !== r) ok = false; dl += l - r;
        return `<div class="kq-row ${l === r ? "ok" : "no"}"><span><b>${e}</b></span><span>${l}</span><span>${r}</span><span>${l === r ? "✅" : "❌"}</span></div>`;
      }).join("");
      const tilt = ok ? 0 : Math.max(-14, Math.min(14, -dl * 2));
      scale.innerHTML = `<g transform="rotate(${tilt} 130 40)"><line x1="40" y1="40" x2="220" y2="40" stroke="currentColor" stroke-width="4"/><path d="M40 40 l-22 30 h44 Z M220 40 l-22 30 h44 Z" fill="${ok ? "#22c55e" : "#f59e0b"}" opacity=".7"/><text x="40" y="66" text-anchor="middle" class="kt-ax">chap</text><text x="220" y="66" text-anchor="middle" class="kt-ax">o‘ng</text></g><path d="M130 40 l-12 46 h24 Z" fill="currentColor" opacity=".5"/>`;
      const g = k.reduce((a, b) => { while (b) [a, b] = [b, a % b]; return a; });
      out.innerHTML = ok ? (g > 1 ? `⚖️ Atomlar teng, lekin koeffitsiyentlarni <b>${g}</b> ga qisqartirish mumkin — eng kichik butun sonlarni yozing.` : `🎉 <b>To‘g‘ri!</b> ${eqHTML(L, Rr, k)} <div class="muted">Massa saqlanish qonuni: reaksiyaga kirgan va hosil bo‘lgan atomlar soni teng.</div>`)
        : "Koeffitsiyent tugmasini bosing (+1). Chap va o‘ng tomonda har bir element atomlari soni teng bo‘lishi kerak. <span class=\"muted\">Sichqonchaning o‘ng tugmasi — kamaytirish.</span>";
    }
    reset();
  };

  // ===================================================================
  // 5. Oksidlanish darajasini aniqlash
  // ===================================================================
  const OXP = ["H2SO4", "KMnO4", "K2Cr2O7", "NH3", "HNO3", "Fe2O3", "Fe3O4", "H2O2", "NaH", "Cl2", "KClO3", "SO4^2-", "NH4^+", "Cr2O7^2-", "Na2S2O3", "CH4", "C2H5OH", "OF2"];
  const FIX = { F: -1, Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, Be: 2, Mg: 2, Ca: 2, Sr: 2, Ba: 2, Zn: 2, Al: 3, Ag: 1 };
  function oxStates(f) {
    const m = /^(.*?)(?:\^(\d*)([+-]))?$/.exec(f.trim()); const body = m[1]; const charge = m[3] ? (m[3] === "+" ? 1 : -1) * (Number(m[2]) || 1) : 0;
    const c = parse(body), els = Object.keys(c);
    if (els.length === 1) return { st: { [els[0]]: charge / c[els[0]] }, charge };
    const st = {};
    els.forEach((e) => { if (FIX[e] != null) st[e] = FIX[e]; });
    const metal = els.some((e) => ["ak", "ae"].includes(BY[e].cat));
    if (c.H && st.H == null) st.H = metal && els.length === 2 ? -1 : 1;
    if (c.O && st.O == null) {
      if (c.F) st.O = 2;
      else if (/^(H2O2|Na2O2|K2O2|BaO2|CaO2)$/.test(body)) st.O = -1;
      else st.O = -2;
    }
    ["Cl", "Br", "I"].forEach((x) => { if (c[x] && st[x] == null && els.length === 2 && !c.O && !c.F) st[x] = -1; });
    if (c.S && st.S == null && els.length === 2 && !c.O && !c.F && !c.Cl) st.S = -2;
    const un = els.filter((e) => st[e] == null);
    if (un.length !== 1) return null;
    const known = els.filter((e) => st[e] != null).reduce((a, e) => a + st[e] * c[e], 0);
    st[un[0]] = (charge - known) / c[un[0]];
    return { st, charge, un: un[0] };
  }
  W.oxstate = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔢 Oksidlanish darajasini topish");
    let f = p.f || "H2SO4";
    const inp = h("input", { type: "text", class: "kb-input", value: f, "aria-label": "Formula", autocapitalize: "off", spellcheck: "false" });
    inp.oninput = () => { f = inp.value; draw(); };
    controls.append(h("label", { class: "ctl wide" }, h("span", {}, "Formula (ion uchun: SO4^2-)"), inp), buttons(OXP.map(fml), (i) => { f = OXP[i]; inp.value = f; draw(); }, OXP.indexOf(f)));
    const sg = (v) => (Number.isInteger(v) ? (v > 0 ? "+" + v : v < 0 ? "−" + -v : "0") : (v > 0 ? "+" : "−") + num(Math.abs(v), 2));
    function draw() {
      let r; try { r = oxStates(f); } catch (e) { stage.innerHTML = ""; out.innerHTML = `<span class="bad">⚠️ ${esc(e.message)}</span>`; return; }
      if (!r) { stage.innerHTML = ""; out.innerHTML = "Bu formulada noma’lumlar ko‘p — ularni qoida bilan aniqlab bo‘lmaydi (masalan, organik moddalarda har bir uglerod alohida hisoblanadi)."; return; }
      const c = parse(f.replace(/\^.*$/, ""));
      stage.innerHTML = `<div class="kx-f">${Object.keys(c).map((e) => `<span><sup class="${r.st[e] > 0 ? "pos" : r.st[e] < 0 ? "neg" : ""}">${sg(r.st[e])}</sup><b>${e}</b>${c[e] > 1 ? `<sub>${c[e]}</sub>` : ""}</span>`).join("")}${r.charge ? `<span class="kx-q">${Math.abs(r.charge) > 1 ? Math.abs(r.charge) : ""}${r.charge > 0 ? "+" : "−"}</span>` : ""}</div>`;
      out.innerHTML = r.un ? `<div>Molekula${r.charge ? " (ion)" : ""}dagi oksidlanish darajalari yig‘indisi = <b>${r.charge}</b>:</div><div class="big-num">${Object.keys(c).map((e) => `${c[e] > 1 ? c[e] : ""}${e === r.un ? "x" : `(${sg(r.st[e])})`}`).join(" + ")} = ${r.charge} → x = ${sg(r.st[r.un])}</div>
        <div class="muted">Qoidalar: O — odatda −2 (peroksidlarda −1), H — +1 (metall gidridlarida −1), F — doim −1, ishqoriy metallar +1, ishqoriy-yer metallar +2, Al +3. Oddiy moddada — 0.</div>`
        : `Oddiy modda (yoki bir xil atomli ion): oksidlanish darajasi <b>${sg(Object.values(r.st)[0])}</b>.`;
    }
    draw();
  };

  // ===================================================================
  // 6. Kimyoviy bog'lanish turi (elektromanfiylik farqi)
  // ===================================================================
  const BPAIRS = [["H", "H"], ["Cl", "Cl"], ["H", "Cl"], ["H", "O"], ["C", "H"], ["C", "O"], ["N", "H"], ["Na", "Cl"], ["K", "F"], ["Mg", "O"], ["Ca", "Cl"], ["Li", "F"]];
  W.bond = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔗 Bog‘ turi — ikki elementni tanlang");
    let a = "H", b = "Cl";
    const pool = EL.filter((e) => e.en > 0);
    const mk = (v, on) => { const sl = h("select", { class: "kb-select" }, ...pool.map((e) => h("option", { value: e.sym }, `${e.sym} — ${e.name} (${e.en})`))); sl.value = v; sl.onchange = () => { on(sl.value); draw(); }; return sl; };
    const sa = mk(a, (v) => (a = v)), sb = mk(b, (v) => (b = v));
    controls.append(h("label", { class: "ctl" }, h("span", {}, "1-element"), sa), h("label", { class: "ctl" }, h("span", {}, "2-element"), sb),
      buttons(BPAIRS.map(([x, y]) => `${x}–${y}`), (i) => { [a, b] = BPAIRS[i]; sa.value = a; sb.value = b; draw(); }, 2));
    const g = svg(320, 170, "kb-svg"); stage.append(g);
    function draw() {
      const A = BY[a], B = BY[b], d = Math.abs(A.en - B.en), more = A.en >= B.en ? A : B;
      const type = a === b ? ["Kovalent qutbsiz", "#22c55e"] : d < 0.4 ? ["Kovalent (deyarli qutbsiz)", "#22c55e"] : d < 1.7 ? ["Kovalent qutbli", "#f59e0b"] : ["Ionli", "#ef4444"];
      const metalBond = ["ak", "ae", "tm", "me"].includes(A.cat) && ["ak", "ae", "tm", "me"].includes(B.cat);
      const shift = a === b ? 0 : Math.min(1, d / 2.2) * (A.en > B.en ? -1 : 1);
      const ionic = d >= 1.7;
      g.innerHTML = `
        <ellipse cx="${160 + shift * 55}" cy="80" rx="${ionic ? 46 : 92 - Math.abs(shift) * 25}" ry="${ionic ? 46 : 42}" fill="#38bdf8" opacity=".22"/>
        ${ionic ? `<ellipse cx="${A.en > B.en ? 110 : 210}" cy="80" rx="48" ry="48" fill="#38bdf8" opacity=".25"/>` : ""}
        <circle cx="110" cy="80" r="30" fill="${CAT[A.cat][1]}" opacity=".9"/><text x="110" y="87" text-anchor="middle" class="kbd-s">${a}</text>
        <circle cx="210" cy="80" r="30" fill="${CAT[B.cat][1]}" opacity=".9"/><text x="210" y="87" text-anchor="middle" class="kbd-s">${b}</text>
        ${a === b ? "" : `<text x="110" y="38" text-anchor="middle" class="kbd-d">${A.en > B.en ? (ionic ? "−" : "δ−") : ionic ? "+" : "δ+"}</text><text x="210" y="38" text-anchor="middle" class="kbd-d">${B.en > A.en ? (ionic ? "−" : "δ−") : ionic ? "+" : "δ+"}</text>`}
        <circle cx="${160 + shift * 45}" cy="80" r="4" fill="#fff"/><circle cx="${160 + shift * 45 + 8}" cy="80" r="4" fill="#fff"/>
        <rect x="20" y="140" width="280" height="8" rx="4" fill="url(#kbdG)"/><defs><linearGradient id="kbdG"><stop offset="0" stop-color="#22c55e"/><stop offset=".25" stop-color="#f59e0b"/><stop offset=".55" stop-color="#ef4444"/></linearGradient></defs>
        <circle cx="${20 + Math.min(1, d / 3.3) * 280}" cy="144" r="7" fill="#fff" stroke="#000" stroke-opacity=".4"/><text x="20" y="165" class="kt-ax">0</text><text x="${20 + (1.7 / 3.3) * 280}" y="165" text-anchor="middle" class="kt-ax">1,7</text><text x="300" y="165" text-anchor="end" class="kt-ax">3,3</text>`;
      out.innerHTML = `ΔEM = |${A.en} − ${B.en}| = <b>${num(d, 2)}</b> → <b style="color:${type[1]}">${metalBond ? "Metall bog‘ (ikkala element metall)" : type[0]}</b>.
        <div class="muted">${a === b ? "Bir xil atomlar: umumiy elektron jufti o‘rtada turadi." : ionic ? `Elektron <b>${more.sym}</b> ga butunlay o‘tadi: ionlar hosil bo‘ladi va bir-biriga tortiladi.` : `Umumiy elektron jufti elektromanfiyroq <b>${more.sym}</b> tomon siljigan — qisman zaryadlar (δ) paydo bo‘ladi.`} Chegara: ΔEM &lt; 0,4 — qutbsiz, 0,4–1,7 — qutbli, &gt; 1,7 — ionli.</div>`;
    }
    draw();
  };

  // ===================================================================
  // 7. Organik molekula quruvchi (gomologik qatorlar)
  // ===================================================================
  const ROOT = ["met", "et", "prop", "but", "pent", "geks", "gept", "okt", "non", "dek"];
  const ALKBP = [-162, -89, -42, -0.5, 36, 69, 98, 126, 151, 174];
  const SERIES = [
    { id: "alkan", n: "Alkanlar", gen: "CₙH₂ₙ₊₂", min: 1, f: (n) => [n, 2 * n + 2, 0], name: (n) => ROOT[n - 1] + "an", trivial: { 1: "metan (botqoq gazi)" }, bond: 1 },
    { id: "alken", n: "Alkenlar", gen: "CₙH₂ₙ", min: 2, f: (n) => [n, 2 * n, 0], name: (n) => ROOT[n - 1] + (n > 3 ? "en-1" : "en"), trivial: { 2: "etilen", 3: "propilen" }, bond: 2 },
    { id: "alkin", n: "Alkinlar", gen: "CₙH₂ₙ₋₂", min: 2, f: (n) => [n, 2 * n - 2, 0], name: (n) => ROOT[n - 1] + (n > 3 ? "in-1" : "in"), trivial: { 2: "atsetilen" }, bond: 3 },
    { id: "siklo", n: "Sikloalkanlar", gen: "CₙH₂ₙ", min: 3, max: 8, f: (n) => [n, 2 * n, 0], name: (n) => "siklo" + ROOT[n - 1] + "an", ring: true },
    { id: "spirt", n: "Spirtlar", gen: "CₙH₂ₙ₊₁OH", min: 1, f: (n) => [n, 2 * n + 2, 1], name: (n) => ROOT[n - 1] + "anol" + (n > 2 ? "-1" : ""), trivial: { 1: "metil spirt (zaharli!)", 2: "etil spirt" }, fg: "OH" },
    { id: "aldegid", n: "Aldegidlar", gen: "CₙH₂ₙO", min: 1, f: (n) => [n, 2 * n, 1], name: (n) => ROOT[n - 1] + "anal", trivial: { 1: "formaldegid (chumoli aldegidi)", 2: "sirka aldegidi" }, fg: "CHO" },
    { id: "kislota", n: "Karbon kislotalar", gen: "CₙH₂ₙO₂", min: 1, f: (n) => [n, 2 * n, 2], name: (n) => ROOT[n - 1] + "an kislota", trivial: { 1: "chumoli kislota", 2: "sirka kislota", 3: "propion kislota", 4: "moy kislota" }, fg: "COOH" },
  ];
  const sub = (n) => String(n).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[d]);
  W.organic = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧬 Organik molekula quruvchi — qatorni va uglerodlar sonini tanlang");
    const list = p.series ? SERIES.filter((x) => p.series.includes(x.id)) : SERIES;
    let si = 0, n = p.n || 2;
    const g = svg(360, 180, "kb-svg ko-mol"); stage.append(g);
    const ns = slider({ label: "Uglerod atomlari soni", min: 1, max: 10, value: n, onInput: (v) => { n = v; draw(); } });
    controls.append(buttons(list.map((x) => x.n), (i) => { si = i; draw(); }, 0), ns);
    function draw() {
      const S = list[si]; const mn = S.min, mx = S.max || 10;
      if (n < mn) n = mn; if (n > mx) n = mx; ns.setRange(mn, mx); ns.set(n);
      const [c, hh, o] = S.f(n);
      const formula = `C${c > 1 ? c : ""}H${hh}${o ? "O" + (o > 1 ? o : "") : ""}`;
      const M = c * 12 + hh + o * 16;
      // tuzilish: zigzag yoki halqa
      let html = "", pts = [];
      if (S.ring) { const R = 52; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; pts.push([180 + R * Math.cos(a), 92 + R * Math.sin(a)]); } }
      else { const dx = Math.min(34, 300 / Math.max(1, n)); for (let i = 0; i < n; i++) pts.push([180 - ((n - 1) * dx) / 2 + i * dx, 92 + (i % 2 ? 16 : -16)]); }
      const bondLine = (a, b, k) => { let s2 = ""; for (let j = 0; j < k; j++) { const off = (j - (k - 1) / 2) * 5; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * off, ny = dx / L * off; s2 += `<line x1="${a[0] + nx}" y1="${a[1] + ny}" x2="${b[0] + nx}" y2="${b[1] + ny}" stroke="currentColor" stroke-width="2.5"/>`; } return s2; };
      for (let i = 0; i < pts.length - 1; i++) html += bondLine(pts[i], pts[i + 1], i === 0 && S.bond > 1 ? S.bond : 1);
      if (S.ring) html += bondLine(pts[pts.length - 1], pts[0], 1);
      // funksional guruh oxirgi atomga
      const last = pts[pts.length - 1];
      if (S.fg) {
        const fx = last[0] + 30, fy = last[1] - 18;
        if (S.fg === "OH") html += `<line x1="${last[0]}" y1="${last[1]}" x2="${fx}" y2="${fy}" stroke="currentColor" stroke-width="2.5"/><circle cx="${fx}" cy="${fy}" r="13" fill="#ef4444"/><text x="${fx}" y="${fy + 5}" text-anchor="middle" class="ko-a">OH</text>`;
        else { html += `${bondLine(last, [fx, fy], 2)}<circle cx="${fx}" cy="${fy}" r="12" fill="#ef4444"/><text x="${fx}" y="${fy + 5}" text-anchor="middle" class="ko-a">O</text>`;
          if (S.fg === "COOH") html += `<line x1="${last[0]}" y1="${last[1]}" x2="${last[0] + 26}" y2="${last[1] + 26}" stroke="currentColor" stroke-width="2.5"/><circle cx="${last[0] + 30}" cy="${last[1] + 30}" r="13" fill="#ef4444"/><text x="${last[0] + 30}" y="${last[1] + 35}" text-anchor="middle" class="ko-a">OH</text>`;
          else html += `<text x="${last[0] + 22}" y="${last[1] + 26}" class="ko-h">H</text>`; }
      }
      pts.forEach(([x, y]) => (html += `<circle cx="${x}" cy="${y}" r="12" fill="#334155" stroke="#94a3b8"/><text x="${x}" y="${y + 5}" text-anchor="middle" class="ko-a">C</text>`));
      g.innerHTML = html;
      // yonish tenglamasi
      const comb = balance([formula, "O2"], ["CO2", "H2O"]);
      const nm = S.name(n), triv = S.trivial && S.trivial[n];
      const state = S.id === "alkan" ? (n <= 4 ? "gaz" : n <= 16 ? "suyuqlik" : "qattiq") + `, t<sub>qay</sub> ≈ ${ALKBP[n - 1]} °C` : S.id === "spirt" || S.id === "kislota" ? (n <= 11 ? "suyuqlik" : "qattiq") : S.id === "aldegid" ? (n === 1 ? "gaz" : "suyuqlik") : n <= 4 ? "gaz" : "suyuqlik";
      out.innerHTML = `<div class="big-num">${nm}${triv ? ` <small>(${triv})</small>` : ""}</div>
        <div>Molekulyar formula: <b>${fml(formula)}</b> · umumiy formula: <b>${S.gen}</b> · M<sub>r</sub> = <b>${M}</b> · xona haroratida: ${state}</div>
        <div>Yonish: ${eqHTML([formula, "O2"], ["CO2", "H2O"], comb)}</div>
        <div class="muted">Gomologik farq: har bir keyingi a’zo <b>–CH₂–</b> guruhga farq qiladi (+14 Mr). ${S.bond === 2 ? "Qo‘shbog‘ (σ + π) — bromli suvni rangsizlantiradi." : S.bond === 3 ? "Uchbog‘ (σ + 2π) — juda reaksiyaga moyil." : S.ring ? "Halqali (siklik) tuzilish — alkenlarga izomer." : ""}</div>`;
      void sub;
    }
    draw();
  };

  // ===================================================================
  // 8. Yadro reaksiyalari: α va β yemirilish
  // ===================================================================
  W.decay = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "☢️ Radioaktiv yemirilish — α yoki β ni bosing");
    let Z = p.z || 92, A = p.a || 238; const log = [];
    const card = h("div", { class: "kd-card" }); stage.append(card);
    const nm = (z) => SYM92[z - 1] || "?";
    function draw(msg) {
      card.innerHTML = `<div class="kd-nuc"><sup>${A}</sup><sub>${Z}</sub><b>${nm(Z)}</b></div><div class="kd-pn">p⁺ = ${Z} · n⁰ = ${A - Z}</div><div class="kd-log">${log.slice(-6).map((l) => `<div>${l}</div>`).join("")}</div>`;
      out.innerHTML = msg || "α-yemirilish: yadro <b>⁴₂He</b> (geliy yadrosi) chiqaradi → A 4 ga, Z 2 ga kamayadi. β-yemirilish: neytron protonga aylanib, elektron chiqadi → A o‘zgarmaydi, Z 1 ga ortadi.";
    }
    const step = (t) => {
      const z0 = Z, a0 = A;
      if (t === "a") { Z -= 2; A -= 4; } else if (t === "b") Z += 1; else if (t === "g") { /* γ — o'zgarmaydi */ }
      log.push(`<sup>${a0}</sup><sub>${z0}</sub>${nm(z0)} → <sup>${A}</sup><sub>${Z}</sub>${nm(Z)} + ${t === "a" ? "<sup>4</sup><sub>2</sub>He (α)" : t === "b" ? "<sup>0</sup><sub>−1</sub>e (β)" : "γ"}`);
      draw(t === "g" ? "γ-nurlanish — yuqori energiyali elektromagnit to‘lqin: A va Z o‘zgarmaydi." : nm(Z) === "Pb" ? "🏁 Barqaror qo‘rg‘oshin izotopiga yetdik — uran qatori shu yerda tugaydi." : null);
    };
    controls.append(h("div", { class: "kb-row" }, button("α yemirilish", () => step("a")), button("β yemirilish", () => step("b")), button("γ", () => step("g"), "ghost"), button("↺", () => { Z = p.z || 92; A = p.a || 238; log.length = 0; draw(); }, "ghost")));
    draw();
  };
})();
