/* Informatika uchun jonli tajribalar: mini Excel, HTML/JS muharriri, robot-labirint, toshbaqa grafikasi,
   shifrlash, ikkilik kod, fayl hajmi, parol va havola tekshiruvi, ma'lumotlar bazasi so'rovi, diagramma,
   tarmoq, tasvir tahriri, rasm chizish, matn muharriri, slaydlar, elektron pochta, qidiruv, algoritm izi,
   Gantt, ovoz, video montaj, sensorlar, validatsiya, ekspert tizim, siqish, bog'langan jadvallar,
   klaviatura mashqi, ommaviy xat (mail merge). */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, W, COLORS } = window.AK;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const PAL = COLORS || ["#22c55e", "#38bdf8", "#f472b6", "#fde047", "#a78bfa", "#fb923c", "#2dd4bf", "#f87171"];
  const fmtBytes = (b) => {
    if (!isFinite(b)) return "—";
    const u = ["bayt", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
    return num(Math.round(b * 100) / 100) + " " + u[i];
  };

  // =====================================================================
  // 1. Mini elektron jadval (Excel): formulalar, $-murojaat, funksiyalar, diagramma
  // =====================================================================
  W.sheet = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📊 Mini Excel — katakni bosing va formula yozing");
    const COLS = p.cols || 5, ROWS = p.rows || 6;
    const L = "ABCDEFGH".slice(0, COLS);
    const data = {};
    (p.data || []).forEach((row, r) => row.forEach((v, c) => { if (v !== null && v !== undefined && v !== "") data[L[c] + (r + 1)] = String(v); }));
    let sel = p.select || "A1";
    const ref = (a) => a.replace(/\$/g, "").toUpperCase();
    function range(a, b) {
      a = ref(a); b = ref(b);
      const c1 = L.indexOf(a[0]), c2 = L.indexOf(b[0]), r1 = +a.slice(1), r2 = +b.slice(1);
      const outv = [];
      for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) outv.push(L[c] + r);
      return outv;
    }
    function val(addr, depth = 0) {
      const raw = data[ref(addr)];
      if (raw === undefined || raw === "") return 0;
      if (raw[0] !== "=") { const n = Number(String(raw).replace(",", ".")); return isNaN(n) ? raw : n; }
      if (depth > 20) return "#AYLANMA!";
      return evalF(raw.slice(1), depth + 1);
    }
    function evalF(f, depth) {
      try {
        let e = f.replace(/"[^"]*"|[^"]+/g, (m) => (m[0] === '"' ? m : m.toUpperCase()));
        const nums = (args) => args.flatMap((a) => (a.includes(":") ? range(...a.split(":")).map((x) => val(x, depth)) : [calc(a)])).filter((x) => typeof x === "number");
        const calc = (expr) => evalF(expr, depth);
        // funksiyalar
        const fn = {
          SUM: (a) => nums(a).reduce((x, y) => x + y, 0), SUMMA: (a) => nums(a).reduce((x, y) => x + y, 0),
          AVERAGE: (a) => { const n = nums(a); return n.length ? n.reduce((x, y) => x + y, 0) / n.length : 0; },
          MAX: (a) => Math.max(...nums(a)), MIN: (a) => Math.min(...nums(a)), COUNT: (a) => nums(a).length,
          ROUND: (a) => { const v = calc(a[0]), d = calc(a[1] || "0"); return Math.round(v * 10 ** d) / 10 ** d; },
          ROUNDUP: (a) => { const d = calc(a[1] || "0"); return Math.ceil(calc(a[0]) * 10 ** d) / 10 ** d; },
          ROUNDDOWN: (a) => { const d = calc(a[1] || "0"); return Math.floor(calc(a[0]) * 10 ** d) / 10 ** d; },
          ABS: (a) => Math.abs(calc(a[0])), SQRT: (a) => Math.sqrt(calc(a[0])), INT: (a) => Math.floor(calc(a[0])),
          IF: (a) => (calc(a[0]) ? calc(a[1]) : calc(a[2] || "0")),
          COUNTIF: (a) => { const cells = range(...a[0].split(":")); const c = a[1].replace(/"/g, ""); const m = c.match(/^(>=|<=|<>|>|<|=)?(.*)$/); const op = m[1] || "=", t = m[2]; return cells.filter((x) => { const v = val(x, depth), tv = isNaN(Number(t)) ? t : Number(t); return op === ">" ? v > tv : op === "<" ? v < tv : op === ">=" ? v >= tv : op === "<=" ? v <= tv : op === "<>" ? v != tv : v == tv; }).length; },
          SUMIF: (a) => { const cells = range(...a[0].split(":")); const c = a[1].replace(/"/g, ""); const m = c.match(/^(>=|<=|<>|>|<|=)?(.*)$/); const op = m[1] || "=", t = Number(m[2]); return cells.reduce((sum, x) => { const v = val(x, depth); const ok = op === ">" ? v > t : op === "<" ? v < t : op === ">=" ? v >= t : op === "<=" ? v <= t : op === "<>" ? v != t : v == t; return sum + (ok && typeof v === "number" ? v : 0); }, 0); }
        };
        // ichki funksiyalarni ichidan tashqariga hisoblash
        let guard = 0;
        const re = /([A-Z]+)\(([^()]*)\)/;
        while (re.test(e) && guard++ < 50) {
          e = e.replace(re, (m0, name, args) => {
            const parts = [];
            let depthQ = 0, cur = "";
            for (const ch of args) { if (ch === '"') depthQ ^= 1; if ((ch === ";" || ch === ",") && !depthQ) { parts.push(cur.trim()); cur = ""; } else cur += ch; }
            if (cur.trim() !== "") parts.push(cur.trim());
            if (!fn[name]) throw new Error("#ИМЯ? (" + name + " — noma’lum funksiya)");
            const r = fn[name](parts);
            return typeof r === "number" ? "(" + r + ")" : JSON.stringify(r);
          });
        }
        e = e.replace(/\$?([A-H])\$?(\d+)/g, (m0, c, r) => { const v = val(c + r, depth); return typeof v === "number" ? "(" + v + ")" : JSON.stringify(v); });
        e = e.replace(/<>/g, "!=").replace(/(^|[^<>!=])=([^=])/g, "$1==$2").replace(/\^/g, "**").replace(/,/g, ".");
        if (/[^0-9+\-*/().\s<>=!"a-zA-Z_ʻ‘’']/.test(e)) throw new Error("#XATO");
        const r = Function('"use strict";return (' + e + ")")();
        if (typeof r === "number" && !isFinite(r)) return "#ДЕЛ/0!";
        return typeof r === "boolean" ? r : typeof r === "number" ? Math.round(r * 1e6) / 1e6 : r;
      } catch (err) { return String(err.message || "#XATO").startsWith("#") ? err.message : "#XATO"; }
    }
    const show = (v) => (typeof v === "number" ? num(v, 4) : v === true ? "ROST" : v === false ? "YOLG‘ON" : esc(v));
    const bar = h("div", { class: "wi-fbar" });
    const addrEl = h("b", {}, sel);
    const input = h("input", { type: "text", "aria-label": "Formula qatori", spellcheck: "false" });
    bar.append(addrEl, h("span", {}, "fx"), input);
    function render() {
      let t = `<table class="wi-sheet"><tr><th></th>${[...L].map((c) => `<th>${c}</th>`).join("")}</tr>`;
      for (let r = 1; r <= ROWS; r++) {
        t += `<tr><th>${r}</th>`;
        for (const c of L) {
          const a = c + r, raw = data[a];
          const v = raw && raw[0] === "=" ? val(a) : raw;
          t += `<td data-a="${a}" class="${a === sel ? "sel" : ""} ${raw && raw[0] === "=" ? "f" : ""} ${typeof v === "string" && v.startsWith("#") ? "err" : ""} ${typeof val(a) === "number" ? "n" : ""}">${raw === undefined ? "" : show(v)}</td>`;
        }
        t += "</tr>";
      }
      stage.innerHTML = t + "</table>";
      stage.prepend(bar);
      stage.querySelectorAll("td").forEach((td) => (td.onclick = () => { sel = td.dataset.a; addrEl.textContent = sel; input.value = data[sel] || ""; render(); input.focus(); }));
      const raw = data[sel];
      out.innerHTML = raw && raw[0] === "="
        ? `<b>${sel}</b> = <code>${esc(raw)}</code> → <b class="big">${show(val(sel))}</b>${/\$/.test(raw) ? `<div class="muted">$ belgisi — <b>absolyut murojaat</b>: formula nusxalanganda bu manzil o‘zgarmaydi.</div>` : ""}`
        : `<span class="muted">${p.hint || "Katakni tanlang. Formula “=” bilan boshlanadi: =A1+B1, =SUM(A1:A5), =AVERAGE(B1:B5), =MAX(…), =IF(A1>50;\"ha\";\"yo‘q\"), =COUNTIF(A1:A5;\">3\")"}</span>`;
      if (p.chart) drawChart();
    }
    function drawChart() {
      const col = p.chart.col || "B", lab = p.chart.label || "A";
      const vals = [], labs = [];
      for (let r = p.chart.from || 2; r <= (p.chart.to || ROWS); r++) { const v = val(col + r); if (typeof v === "number") { vals.push(v); labs.push(String(val(lab + r))); } }
      if (!vals.length) return;
      const el = svg(360, 170), mx = Math.max(...vals, 1), bw = 320 / vals.length;
      vals.forEach((v, i) => {
        const hh = (v / mx) * 120;
        s("rect", { x: 30 + i * bw + 6, y: 140 - hh, width: bw - 12, height: hh, rx: 4, fill: PAL[i % PAL.length] }, el);
        s("text", { x: 30 + i * bw + bw / 2, y: 136 - hh, "text-anchor": "middle", fill: "#e2e8f0", "font-size": 11, text: num(v) }, el);
        s("text", { x: 30 + i * bw + bw / 2, y: 158, "text-anchor": "middle", fill: "#94a3b8", "font-size": 10, text: labs[i].slice(0, 9) }, el);
      });
      s("line", { x1: 30, y1: 140, x2: 350, y2: 140, stroke: "#64748b" }, el);
      const wrap = h("div", { class: "wi-chart" });
      wrap.append(el);
      stage.append(wrap);
    }
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") commit(); });
    input.addEventListener("change", commit);
    function commit() { const v = input.value.trim(); if (v === "") delete data[sel]; else data[sel] = v; render(); }
    if (p.tips) controls.append(buttons(p.tips.map((t) => t[0]), (i) => { const [, a, f] = p.tips[i]; sel = a; data[a] = f; addrEl.textContent = a; input.value = f; render(); }, -1));
    input.value = data[sel] || "";
    render();
  };

  // =====================================================================
  // 2. HTML / CSS / JavaScript jonli muharriri
  // =====================================================================
  W.htmlLive = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || (p.mode === "js" ? "⌨️ JavaScript — kodni o‘zgartiring va “Ishga tushirish”ni bosing" : "🌐 HTML muharriri — chapda kod, o‘ngda natija"));
    const ta = h("textarea", { class: "wi-code", spellcheck: "false", wrap: "off", "aria-label": "Kod" });
    ta.value = p.code || "";
    const frameEl = h("iframe", { class: "wi-prev", sandbox: "allow-scripts", title: "Natija" });
    const con = h("pre", { class: "wi-console" });
    stage.classList.add("wi-split");
    stage.append(ta, p.mode === "js" ? con : frameEl);
    function run() {
      if (p.mode === "js") {
        con.textContent = "";
        const logs = [];
        const fake = { log: (...a) => logs.push(a.map((x) => (typeof x === "object" ? JSON.stringify(x) : String(x))).join(" ")) };
        try {
          const started = Date.now();
          const fnc = new Function("console", "alert", "prompt", '"use strict";\n' + ta.value);
          const answers = (p.inputs || []).slice();
          fnc(fake, (m) => logs.push("🔔 " + m), (q) => { if (!answers.length) throw new Error("Kiritish uchun javoblar tugadi (prompt)"); const a = answers.shift(); logs.push("❓ " + q + " → " + a); return a; });
          if (Date.now() - started > 1500) logs.push("⏱ Juda uzoq ishladi");
          con.textContent = logs.join("\n") || "(hech narsa chiqarilmadi — console.log(...) yozing)";
          con.classList.remove("err");
        } catch (e) { con.textContent = "❌ Xato: " + e.message; con.classList.add("err"); }
      } else {
        frameEl.srcdoc = `<!doctype html><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;margin:12px;color:#111;background:#fff}</style>` + ta.value;
      }
      out.innerHTML = p.note || "";
    }
    controls.append(button("▶ Ishga tushirish", run));
    if (p.presets) controls.append(buttons(p.presets.map((x) => x[0]), (i) => { ta.value = p.presets[i][1]; run(); }));
    controls.append(button("↺ Asl kod", () => { ta.value = p.code || ""; run(); }, "ghost"));
    if (p.mode !== "js") ta.addEventListener("input", () => { clearTimeout(ta.t); ta.t = setTimeout(run, 400); });
    run();
  };

  // =====================================================================
  // 3. Robot labirintda (algoritm, Scratch harakati, takrorlash, debaglash)
  // =====================================================================
  W.robot = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🤖 Robotni bayroqqa olib boring — buyruqlardan dastur tuzing");
    const MAP = p.map || ["S..#....", ".#.#.##.", ".#...#..", ".####.#.", "......#F"];
    const R = MAP.length, C = MAP[0].length;
    let start, flag;
    MAP.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === "S") start = [r, c]; if (ch === "F") flag = [r, c]; }));
    let prog = [], running = false;
    const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const NAMES = { F: "⬆ Oldinga", L: "↶ Chapga buril", R: "↷ O‘ngga buril" };
    let bot = { r: start[0], c: start[1], d: p.dir ?? 0 }, trail = [];
    function draw(msg) {
      const cs = 40, el = svg(C * cs, R * cs);
      MAP.forEach((row, r) => [...row].forEach((ch, c) => {
        s("rect", { x: c * cs + 1, y: r * cs + 1, width: cs - 2, height: cs - 2, rx: 6, fill: ch === "#" ? "#334155" : "rgba(148,163,184,.08)" }, el);
        if (ch === "F") s("text", { x: c * cs + cs / 2, y: r * cs + 28, "text-anchor": "middle", "font-size": 22, text: "🏁" }, el);
      }));
      trail.forEach(([r, c]) => s("circle", { cx: c * cs + cs / 2, cy: r * cs + cs / 2, r: 4, fill: "#22c55e", opacity: 0.5 }, el));
      const g = s("g", { transform: `translate(${bot.c * cs + cs / 2},${bot.r * cs + cs / 2}) rotate(${bot.d * 90})` }, el);
      s("circle", { r: 14, fill: "#38bdf8" }, g);
      s("path", { d: "M4,-7 L14,0 L4,7 Z", fill: "#fde047" }, g);
      stage.innerHTML = "";
      stage.append(el);
      const list = h("div", { class: "wi-prog" });
      list.innerHTML = prog.length ? prog.map((x, i) => `<span class="${i === running ? "on" : ""}">${i + 1}. ${x.rep ? `🔁 ${x.rep} marta: ${x.body.map((b) => NAMES[b].split(" ")[0]).join(" ")}` : NAMES[x]}</span>`).join("") : "<em>Dastur bo‘sh — pastdagi tugmalar bilan buyruq qo‘shing</em>";
      stage.append(list);
      if (msg !== undefined) out.innerHTML = msg;
    }
    const flat = () => prog.flatMap((x) => (x.rep ? Array.from({ length: x.rep }, () => x.body).flat() : [x]));
    async function run() {
      if (running !== false) return;
      bot = { r: start[0], c: start[1], d: p.dir ?? 0 }; trail = [];
      const steps = flat();
      running = 0;
      for (let i = 0; i < steps.length; i++) {
        const cmd = steps[i];
        if (cmd === "L") bot.d = (bot.d + 3) % 4;
        else if (cmd === "R") bot.d = (bot.d + 1) % 4;
        else {
          const nr = bot.r + DIRS[bot.d][0], nc = bot.c + DIRS[bot.d][1];
          if (nr < 0 || nc < 0 || nr >= R || nc >= C || MAP[nr][nc] === "#") { running = false; draw(`💥 <b>${i + 1}-qadamda</b> robot devorga urildi! Xatoni toping va tuzating (debaglash).`); return; }
          trail.push([bot.r, bot.c]); bot.r = nr; bot.c = nc;
        }
        draw(`Bajarilmoqda: ${i + 1} / ${steps.length}`);
        await new Promise((r) => setTimeout(r, 260));
      }
      running = false;
      const win = bot.r === flag[0] && bot.c === flag[1];
      draw(win ? `🎉 <b>Barakalla!</b> Robot manzilga yetdi. Dastur ${prog.length} ta qatordan, jami ${steps.length} ta qadamdan iborat.${prog.some((x) => x.rep) ? " Takrorlash bloki dasturni qisqartirdi!" : " Takrorlash (🔁) bilan dasturni qisqartirib ko‘ring."}` : "🤔 Robot to‘xtadi, lekin bayroqqa yetmadi. Dasturni davom ettiring.");
    }
    controls.append(buttons(["⬆ Oldinga", "↶ Chapga", "↷ O‘ngga"], (i) => { if (running !== false) return; prog.push("FLR"[i]); draw(""); }, -1));
    const repN = slider({ label: "🔁 Takrorlash soni", min: 2, max: 6, value: 3, onInput: () => {} });
    controls.append(repN, button("🔁 Oxirgi 2 buyruqni takrorlash", () => {
      let n = 0;
      while (n < 2 && prog.length - 1 - n >= 0 && !prog[prog.length - 1 - n].rep) n++;
      if (!n) return;
      const body = prog.splice(-n);
      prog.push({ rep: Number(repN.input.value), body });
      draw("");
    }, "ghost"));
    controls.append(button("▶ Ishga tushirish", run), button("⌫ O‘chirish", () => { prog.pop(); draw(""); }, "ghost"), button("↺ Tozalash", () => { prog = []; bot = { r: start[0], c: start[1], d: p.dir ?? 0 }; trail = []; draw(""); }, "ghost"));
    draw("Robot ko‘k doira, sariq uchburchak — u qaragan tomon. Kulrang kataklar — devor.");
  };

  // =====================================================================
  // 4. Toshbaqa grafikasi (Scratch PEN, takrorlash bilan shakl chizish)
  // =====================================================================
  W.turtle = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🐢 Qalam (PEN) bilan chizish: “N marta takrorla: L qadam yur, A° buril”");
    const st = { n: p.n || 4, len: p.len || 90, ang: p.ang || 90, rep2: 1 };
    function render() {
      const el = svg(320, 260);
      let x = 0, y = 0, a = -90, d = `M0,0`;
      const pts = [[0, 0]];
      for (let k = 0; k < st.rep2; k++) {
        for (let i = 0; i < st.n; i++) { x += st.len * Math.cos((a * Math.PI) / 180); y += st.len * Math.sin((a * Math.PI) / 180); d += ` L${x.toFixed(1)},${y.toFixed(1)}`; pts.push([x, y]); a += st.ang; }
        a += 360 / st.rep2;
      }
      const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
      const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
      const sc = Math.min(280 / Math.max(maxx - minx, 1), 220 / Math.max(maxy - miny, 1), 1.6);
      const g = s("g", { transform: `translate(${160 - ((minx + maxx) / 2) * sc},${130 - ((miny + maxy) / 2) * sc}) scale(${sc})` }, el);
      s("path", { d, fill: "none", stroke: "#22c55e", "stroke-width": 3 / sc, "stroke-linejoin": "round" }, g);
      s("text", { x: x, y: y, "font-size": 20 / sc, "text-anchor": "middle", text: "🐢" }, g);
      stage.innerHTML = ""; stage.append(el);
      const total = st.n * st.ang;
      out.innerHTML = `<div class="wi-codeblock">${st.rep2 > 1 ? `takrorla ${st.rep2} marta:<br>&nbsp;&nbsp;` : ""}takrorla <b>${st.n}</b> marta:<br>${st.rep2 > 1 ? "&nbsp;&nbsp;" : ""}&nbsp;&nbsp;&nbsp;&nbsp;yur <b>${st.len}</b> qadam<br>${st.rep2 > 1 ? "&nbsp;&nbsp;" : ""}&nbsp;&nbsp;&nbsp;&nbsp;buril <b>${st.ang}°</b>${st.rep2 > 1 ? `<br>&nbsp;&nbsp;buril ${num(360 / st.rep2)}°` : ""}</div>
        <div>Jami burilish: ${st.n} × ${st.ang}° = <b>${total}°</b>. ${total % 360 === 0 ? "✅ 360° ning karralisi — shakl yopiladi." : "Shakl yopilmadi: yopiq ko‘pburchak uchun burchak = 360° : N."}</div>`;
    }
    controls.append(
      slider({ label: "Takrorlash N", min: 3, max: 12, value: st.n, onInput: (v) => { st.n = v; render(); } }),
      slider({ label: "Qadam L", min: 20, max: 140, value: st.len, step: 5, onInput: (v) => { st.len = v; render(); } }),
      slider({ label: "Burilish A°", min: 10, max: 180, value: st.ang, step: 1, onInput: (v) => { st.ang = v; render(); } }),
      slider({ label: "Tashqi takrorlash (gul)", min: 1, max: 12, value: 1, onInput: (v) => { st.rep2 = v; render(); } }),
      buttons(["▲ Uchburchak", "■ Kvadrat", "⬢ Oltiburchak", "★ Yulduz", "● Aylana"], (i) => { const [n, a, l] = [[3, 120, 100], [4, 90, 90], [6, 60, 60], [5, 144, 120], [36, 10, 16]][i]; st.n = n; st.ang = a; st.len = l; render(); }, -1)
    );
    render();
  };

  // =====================================================================
  // 5. Ikkilik sanoq sistemasi, bayt, kodlash (ASCII/Unicode)
  // =====================================================================
  W.binary = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔢 Ikkilik kod — bitlarni bosib yoqing/o‘chiring");
    let bits = [0, 1, 0, 0, 0, 0, 0, 1];
    const txt = h("input", { type: "text", value: p.text || "Salom", class: "wi-in", "aria-label": "Matn" });
    function render() {
      const v = bits.reduce((a, b) => a * 2 + b, 0);
      stage.innerHTML = `<div class="wi-bits">${bits.map((b, i) => `<button data-i="${i}" class="${b ? "on" : ""}"><b>${b}</b><small>${2 ** (7 - i)}</small></button>`).join("")}</div>`;
      stage.querySelectorAll("[data-i]").forEach((btn) => (btn.onclick = () => { bits[+btn.dataset.i] ^= 1; render(); }));
      const t = txt.value;
      const codes = [...t].slice(0, 12).map((ch) => { const c = ch.codePointAt(0); return `<span class="wi-ch"><b>${esc(ch)}</b><small>${c}</small><code>${c < 256 ? c.toString(2).padStart(8, "0") : c.toString(2)}</code></span>`; }).join("");
      const bytes = new TextEncoder().encode(t).length;
      out.innerHTML = `<div class="big-num">${bits.join("")}₂ = ${v}₁₀ = ${v.toString(16).toUpperCase()}₁₆ ${v >= 32 && v < 127 ? `→ “${String.fromCharCode(v)}”` : ""}</div>
        <div class="muted">8 bit = 1 bayt. Bir bayt 0 dan 255 gacha (256 ta) qiymatni saqlaydi.</div>
        <div class="wi-chars">${codes}</div>
        <div>“${esc(t.slice(0, 40))}” matni: <b>${[...t].length}</b> belgi → UTF-8 da <b>${bytes}</b> bayt = <b>${bytes * 8}</b> bit.</div>`;
    }
    txt.addEventListener("input", render);
    controls.append(h("label", { class: "ctl wide" }, h("span", {}, "Matnni kodlash:"), txt));
    controls.append(slider({ label: "Sonni kiriting (0–255)", min: 0, max: 255, value: 65, onInput: (v) => { bits = v.toString(2).padStart(8, "0").split("").map(Number); render(); } }));
    bits = (65).toString(2).padStart(8, "0").split("").map(Number);
    render();
  };

  // =====================================================================
  // 6. Shifrlash: Sezar (simmetrik) va ochiq/yopiq kalit g'oyasi
  // =====================================================================
  W.cipher = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔐 Sezar shifri — simmetrik shifrlash (bir xil kalit)");
    const AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let k = 3, mode = 0;
    const ta = h("input", { type: "text", class: "wi-in", value: p.text || "MAKTABDA DARS BOR", "aria-label": "Xabar" });
    const shift = (t, n) => t.toUpperCase().replace(/[A-Z]/g, (c) => AB[(AB.indexOf(c) + n + 26 * 10) % 26]);
    function render() {
      const src = ta.value, res = shift(src, mode ? -k : k);
      stage.innerHTML = `<div class="wi-abc"><div>${[...AB].map((c) => `<span>${c}</span>`).join("")}</div><div>${[...AB].map((c, i) => `<span class="on">${AB[(i + k) % 26]}</span>`).join("")}</div></div>`;
      out.innerHTML = `<div>${mode ? "Shifrlangan" : "Ochiq"} matn: <code>${esc(src.toUpperCase())}</code></div>
        <div class="big-num">${mode ? "🔓 Ochildi" : "🔒 Shifr"}: ${esc(res)}</div>
        <div class="muted">Kalit = <b>${k}</b>. Har bir harf alifboda ${k} ta ${mode ? "orqaga" : "oldinga"} suriladi. Jo‘natuvchi va qabul qiluvchida <b>bir xil kalit</b> bo‘lishi kerak — bu <b>simmetrik</b> shifrlash. <b>Asimmetrik</b> shifrlashda esa ikki kalit bor: <i>ochiq kalit</i> bilan shifrlanadi, faqat <i>yopiq (maxfiy) kalit</i> bilan ochiladi.</div>`;
    }
    ta.addEventListener("input", render);
    controls.append(h("label", { class: "ctl wide" }, h("span", {}, "Xabar:"), ta), slider({ label: "Kalit (siljish)", min: 1, max: 25, value: 3, onInput: (v) => { k = v; render(); } }), buttons(["🔒 Shifrlash", "🔓 Deshifrlash"], (i) => { mode = i; render(); }));
    render();
  };

  // =====================================================================
  // 7. Fayl hajmi kalkulyatori (tasvir, ovoz, video, matn, uzatish vaqti, xotira)
  // =====================================================================
  W.fileSize = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "💾 Fayl hajmini hisoblash");
    const kinds = ["🖼 Tasvir", "🎵 Ovoz", "🎬 Video", "📄 Matn", "📶 Uzatish vaqti"];
    let kind = p.kind || 0;
    const st = { w: 1920, h: 1080, depth: 24, sec: 60, rate: 44100, bitsS: 16, ch: 2, fps: 30, chars: 2000, size: 50, speed: 20, comp: 1 };
    function render() {
      controls.innerHTML = "";
      controls.append(buttons(kinds, (i) => { kind = i; render(); }, kind));
      const sl = (label, key, min, max, step = 1, f) => controls.append(slider({ label, min, max, step, value: st[key], fmt: f || ((v) => num(v)), onInput: (v) => { st[key] = v; calc(); } }));
      if (kind === 0) { sl("Eni (piksel)", "w", 100, 4000, 10); sl("Bo‘yi (piksel)", "h", 100, 3000, 10); sl("Rang chuqurligi (bit)", "depth", 1, 32, 1); sl("Siqish (marta)", "comp", 1, 20, 1); }
      if (kind === 1) { sl("Davomiyligi (soniya)", "sec", 1, 600); sl("Diskretlash chastotasi (Gs)", "rate", 8000, 96000, 100); sl("Bit chuqurligi", "bitsS", 8, 32, 8); sl("Kanallar (1 mono, 2 stereo)", "ch", 1, 2); }
      if (kind === 2) { sl("Eni", "w", 320, 3840, 10); sl("Bo‘yi", "h", 240, 2160, 10); sl("Kadr/soniya", "fps", 10, 60); sl("Davomiyligi (s)", "sec", 1, 600); sl("Siqish (marta)", "comp", 1, 200); }
      if (kind === 3) { sl("Belgilar soni", "chars", 10, 100000, 10); }
      if (kind === 4) { sl("Fayl hajmi (MB)", "size", 1, 4000); sl("Internet tezligi (Mbit/s)", "speed", 1, 1000); }
      calc();
    }
    function calc() {
      let bytes = 0, steps = "";
      if (kind === 0) { bytes = (st.w * st.h * st.depth) / 8 / st.comp; steps = `${num(st.w)} × ${num(st.h)} piksel × ${st.depth} bit : 8 ${st.comp > 1 ? `: ${st.comp} (siqish)` : ""}`; }
      if (kind === 1) { bytes = (st.sec * st.rate * st.bitsS * st.ch) / 8; steps = `${st.sec} s × ${num(st.rate)} Gs × ${st.bitsS} bit × ${st.ch} kanal : 8`; }
      if (kind === 2) { bytes = (st.w * st.h * 24 * st.fps * st.sec) / 8 / st.comp; steps = `${st.w}×${st.h} × 24 bit × ${st.fps} kadr × ${st.sec} s : 8 : ${st.comp}`; }
      if (kind === 3) { bytes = st.chars; steps = `${num(st.chars)} belgi × 1 bayt (ASCII). Unicode (o‘zbekcha ʻ, kirill) belgilar 2–4 bayt.`; }
      if (kind === 4) {
        const sec = (st.size * 8 * 1024 * 1024) / (st.speed * 1000 * 1000);
        stage.innerHTML = `<div class="wi-meter"><i style="width:${Math.min(100, (st.speed / 1000) * 100)}%"></i></div>`;
        out.innerHTML = `<div>t = hajm × 8 : tezlik = ${num(st.size)} MB × 8 : ${st.speed} Mbit/s</div><div class="big-num">≈ ${sec < 60 ? num(Math.round(sec * 10) / 10) + " soniya" : num(Math.round(sec / 6) / 10) + " daqiqa"}</div><div class="muted">Tezlik <b>bit</b>larda (Mbit/s), hajm esa <b>bayt</b>larda (MB) o‘lchanadi — shuning uchun 8 ga ko‘paytiramiz.</div>`;
        return;
      }
      const flash = [["Disket", 1.44 * 1024 * 1024], ["CD", 700 * 1024 ** 2], ["DVD", 4.7 * 1024 ** 3], ["Fleshka 32 GB", 32 * 1024 ** 3]];
      stage.innerHTML = `<div class="wi-fits">${flash.map(([n, c]) => `<span>${n}: <b>${bytes ? num(Math.floor(c / bytes)) : "∞"}</b> ta fayl</span>`).join("")}</div>`;
      out.innerHTML = `<div>${steps}</div><div class="big-num">= ${fmtBytes(bytes)}</div><div class="muted">1 KB = 1024 bayt, 1 MB = 1024 KB, 1 GB = 1024 MB.</div>`;
    }
    render();
  };

  // =====================================================================
  // 8. Parol mustahkamligi va shubhali havola (phishing) tekshiruvi
  // =====================================================================
  W.password = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🛡 Xavfsizlik tekshiruvi");
    let mode = p.mode === "url" ? 1 : 0;
    const inp = h("input", { type: "text", class: "wi-in", "aria-label": "Tekshiriladigan matn", spellcheck: "false" });
    function render() {
      const v = inp.value;
      if (mode === 0) {
        const checks = [[v.length >= 12, "Kamida 12 ta belgi"], [/[a-z]/.test(v), "Kichik harf"], [/[A-Z]/.test(v), "Katta harf"], [/\d/.test(v), "Raqam"], [/[^A-Za-z0-9]/.test(v), "Maxsus belgi (!@#…)"], [!/(1234|qwerty|parol|password|0000|1111|abc)/i.test(v), "Mashhur ketma-ketlik emas"]];
        const score = checks.filter((c) => c[0]).length;
        const pool = (/[a-z]/.test(v) ? 26 : 0) + (/[A-Z]/.test(v) ? 26 : 0) + (/\d/.test(v) ? 10 : 0) + (/[^A-Za-z0-9]/.test(v) ? 32 : 0);
        const combos = Math.pow(Math.max(pool, 1), v.length), secs = combos / 1e10;
        const t = secs < 1 ? "bir zumda" : secs < 3600 ? Math.round(secs / 60) + " daqiqa" : secs < 86400 * 365 ? Math.round(secs / 86400) + " kun" : secs < 1e9 * 3e7 ? num(Math.round(secs / 3.15e7)) + " yil" : "milliardlab yil";
        stage.innerHTML = `<div class="wi-meter s${score}"><i style="width:${(score / 6) * 100}%"></i></div><div class="wi-checks">${checks.map(([ok, l]) => `<span class="${ok ? "ok" : ""}">${ok ? "✅" : "⬜"} ${l}</span>`).join("")}</div>`;
        out.innerHTML = `<div class="big-num">${["Juda zaif 😱", "Juda zaif 😱", "Zaif 😟", "O‘rtacha 😐", "Yaxshi 🙂", "Kuchli 💪", "Juda kuchli 🛡"][score]}</div><div>Kompyuter sekundiga 10 mlrd parolni sinab ko‘rsa, buzish uchun taxminan <b>${v ? t : "—"}</b> kerak.</div>`;
      } else {
        let u;
        const flags = [];
        try { u = new URL(/^https?:\/\//.test(v) ? v : "http://" + v); } catch (e) { u = null; }
        if (!u) { stage.innerHTML = ""; out.innerHTML = "Havolani kiriting."; return; }
        const host = u.hostname;
        if (u.protocol !== "https:") flags.push("🔓 HTTPS emas — ma’lumot shifrlanmaydi");
        if (/\d+\.\d+\.\d+\.\d+/.test(host)) flags.push("🔢 Nom o‘rniga IP-manzil");
        if (/@/.test(v)) flags.push("@ belgisi — haqiqiy manzil yashirilgan bo‘lishi mumkin");
        if ((host.match(/-/g) || []).length >= 2) flags.push("➖ Ko‘p chiziqchali shubhali nom");
        if (/(login|verify|secure|bonus|prize|free|yutuq|sovga|bank).*\.(xyz|top|click|info|ru\.com|tk)$/i.test(host) || /\.(xyz|top|click|tk)$/i.test(host)) flags.push("🎣 Shubhali domen zonasi va “jalb qiluvchi” so‘zlar");
        if (/(g00gle|paypa1|faceb00k|telegrarn|1nstagram|yandeks|cIick)/i.test(host)) flags.push("🎭 Mashhur saytga o‘xshatilgan nom (harf almashtirilgan)");
        if (host.split(".").length > 4) flags.push("🧩 Juda ko‘p subdomen");
        stage.innerHTML = `<div class="wi-url"><span class="${u.protocol === "https:" ? "ok" : "no"}">${u.protocol}//</span><b>${esc(host)}</b><span>${esc(u.pathname)}</span></div>`;
        out.innerHTML = flags.length ? `<div class="big-num" style="color:#f87171">⚠️ Shubhali (${flags.length})</div><ul>${flags.map((f) => `<li>${f}</li>`).join("")}</ul><div class="muted">Bunday havolaga parol, karta raqami yoki SMS kodni hech qachon kiritmang!</div>` : `<div class="big-num">✅ Aniq xavf belgisi topilmadi</div><div class="muted">Baribir manzilni diqqat bilan o‘qing va faqat rasmiy saytlardan foydalaning.</div>`;
      }
    }
    inp.addEventListener("input", render);
    controls.append(buttons(["🔑 Parol", "🔗 Havola (phishing)"], (i) => { mode = i; inp.value = i ? "http://bank-uz-secure-login.xyz/verify" : "salom123"; render(); }, mode), h("label", { class: "ctl wide" }, h("span", {}, "Kiriting:"), inp));
    inp.value = mode ? "http://bank-uz-secure-login.xyz/verify" : "salom123";
    render();
  };

  // =====================================================================
  // 9. Ma'lumotlar bazasi: jadval, so'rov (query), saralash, maydon turlari
  // =====================================================================
  const DB = {
    oquvchilar: { fields: [["ID", "son"], ["Ism", "matn"], ["Sinf", "son"], ["Ball", "son"], ["Shahar", "matn"], ["To‘garak", "ha/yo‘q"]],
      rows: [[1, "Aziza", 7, 92, "Oltinsoy", "ha"], [2, "Bekzod", 8, 75, "Denov", "yo‘q"], [3, "Dilnoza", 7, 88, "Termiz", "ha"], [4, "Jasur", 9, 64, "Oltinsoy", "ha"], [5, "Malika", 8, 97, "Sho‘rchi", "yo‘q"], [6, "Nodir", 9, 81, "Oltinsoy", "ha"], [7, "Sardor", 7, 58, "Denov", "yo‘q"], [8, "Zarina", 8, 90, "Termiz", "ha"]] },
    kitoblar: { fields: [["ID", "son"], ["Nomi", "matn"], ["Muallif", "matn"], ["Yil", "son"], ["Bet", "son"], ["Bor", "ha/yo‘q"]],
      rows: [[1, "O‘tkan kunlar", "A. Qodiriy", 1926, 400, "ha"], [2, "Kecha va kunduz", "Cho‘lpon", 1936, 320, "ha"], [3, "Sariq devni minib", "X. To‘xtaboyev", 1968, 250, "yo‘q"], [4, "Shum bola", "G‘. G‘ulom", 1936, 180, "ha"], [5, "Ufq", "S. Ahmad", 1974, 600, "yo‘q"], [6, "Dunyoning ishlari", "O‘. Hoshimov", 1982, 280, "ha"]] }
  };
  W.dbQuery = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🗃 Ma’lumotlar bazasi — so‘rov (query) tuzing");
    const T = DB[p.table || "oquvchilar"];
    const st = { f: p.field ?? 3, op: p.op || ">", v: p.value ?? "80", sort: -1, dir: 1 };
    const fSel = h("select", { class: "wi-sel", "aria-label": "Maydon" }, ...T.fields.map((f, i) => h("option", { value: i }, f[0])));
    const oSel = h("select", { class: "wi-sel", "aria-label": "Shart" }, ...["=", "≠", ">", "<", "≥", "≤", "o‘z ichiga oladi"].map((o) => h("option", { value: o }, o)));
    const vIn = h("input", { class: "wi-in", type: "text", "aria-label": "Qiymat" });
    fSel.value = st.f; oSel.value = st.op; vIn.value = st.v;
    function test(row) {
      const a = row[st.f], b = isNaN(Number(st.v)) ? st.v : Number(st.v);
      switch (st.op) { case "=": return String(a).toLowerCase() === String(b).toLowerCase(); case "≠": return String(a).toLowerCase() !== String(b).toLowerCase(); case ">": return a > b; case "<": return a < b; case "≥": return a >= b; case "≤": return a <= b; default: return String(a).toLowerCase().includes(String(st.v).toLowerCase()); }
    }
    function render() {
      let rows = T.rows.filter(test);
      if (st.sort >= 0) rows = rows.slice().sort((x, y) => (x[st.sort] > y[st.sort] ? 1 : -1) * st.dir);
      stage.innerHTML = `<table class="wi-db"><tr>${T.fields.map((f, i) => `<th data-s="${i}">${f[0]}<small>${f[1]}</small>${st.sort === i ? (st.dir > 0 ? " ▲" : " ▼") : ""}</th>`).join("")}</tr>
        ${T.rows.map((r) => `<tr class="${rows.includes(r) ? "hit" : "miss"}">${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table>`;
      stage.querySelectorAll("[data-s]").forEach((th) => (th.onclick = () => { const i = +th.dataset.s; st.dir = st.sort === i ? -st.dir : 1; st.sort = i; render(); }));
      const sql = `SELECT * FROM ${p.table || "oquvchilar"} WHERE ${T.fields[st.f][0]} ${({ "≠": "<>", "≥": ">=", "≤": "<=", "o‘z ichiga oladi": "LIKE" })[st.op] || st.op} ${st.op === "o‘z ichiga oladi" ? `'%${esc(st.v)}%'` : isNaN(Number(st.v)) ? `'${esc(st.v)}'` : esc(st.v)}${st.sort >= 0 ? ` ORDER BY ${T.fields[st.sort][0]} ${st.dir > 0 ? "ASC" : "DESC"}` : ""};`;
      out.innerHTML = `<div class="wi-codeblock">${sql}</div><div class="big-num">${rows.length} ta yozuv topildi <small>(${T.rows.length} tadan)</small></div><div class="muted">Yashil qatorlar — shartga mos. Ustun nomini bossangiz, saralanadi. Har bir qator — <b>yozuv</b>, har bir ustun — <b>maydon</b>; ID — <b>birlamchi kalit</b> (takrorlanmaydi).</div>`;
    }
    fSel.onchange = () => { st.f = +fSel.value; render(); };
    oSel.onchange = () => { st.op = oSel.value; render(); };
    vIn.oninput = () => { st.v = vIn.value; render(); };
    controls.append(h("div", { class: "wi-row" }, h("span", {}, "Qayerda:"), fSel, oSel, vIn));
    render();
  };

  // =====================================================================
  // 10. Bog'langan jadvallar (relyatsion baza, kalitlar, 1:N)
  // =====================================================================
  W.relations = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔗 Relyatsion baza — birlamchi va tashqi kalit");
    const sinf = [[1, "7-A", "Karimova N."], [2, "8-B", "Raufov A."], [3, "9-A", "Ibotov D."]];
    const oq = [[101, "Aziza", 1], [102, "Bekzod", 2], [103, "Dilnoza", 1], [104, "Jasur", 3], [105, "Malika", 2], [106, "Nodir", 3], [107, "Sardor", 1]];
    let sel = 1;
    function render() {
      stage.innerHTML = `<div class="wi-rel"><table class="wi-db"><caption>SINFLAR</caption><tr><th>🔑 SinfID</th><th>Nomi</th><th>Rahbar</th></tr>${sinf.map((r) => `<tr data-s="${r[0]}" class="${r[0] === sel ? "hit" : ""}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</table>
        <div class="wi-link">1 ⟶ ∞</div>
        <table class="wi-db"><caption>O‘QUVCHILAR</caption><tr><th>🔑 ID</th><th>Ism</th><th>🗝 SinfID</th></tr>${oq.map((r) => `<tr class="${r[2] === sel ? "hit" : "miss"}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</table></div>`;
      stage.querySelectorAll("[data-s]").forEach((tr) => (tr.onclick = () => { sel = +tr.dataset.s; render(); }));
      const n = oq.filter((r) => r[2] === sel).length;
      out.innerHTML = `<b>${sinf.find((r) => r[0] === sel)[1]}</b> sinfida <b>${n}</b> ta o‘quvchi. <div class="muted">SINFLAR.SinfID — <b>birlamchi kalit</b> (har bir sinf uchun yagona). O‘QUVCHILAR.SinfID — <b>tashqi kalit</b>: u boshqa jadvaldagi yozuvga ishora qiladi. Bitta sinfga ko‘p o‘quvchi — <b>“birga-ko‘p” (1:N)</b> bog‘lanish. Chapdagi sinfni bosing.</div>`;
    }
    render();
  };

  // =====================================================================
  // 11. Diagramma yaratish (ustunli, chiziqli, doiraviy)
  // =====================================================================
  W.chartMaker = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📈 Diagramma tuzing — qiymatlarni o‘zgartiring, turini tanlang");
    const data = (p.data || [["Dush", 12], ["Sesh", 18], ["Chor", 9], ["Pay", 22], ["Juma", 15]]).map((x) => x.slice());
    let type = p.chart || 0;
    function render() {
      const el = svg(380, 220);
      const mx = Math.max(...data.map((d) => d[1]), 1), tot = data.reduce((a, d) => a + d[1], 0);
      if (type === 2) {
        let a0 = -Math.PI / 2;
        data.forEach((d, i) => {
          const a1 = a0 + (d[1] / (tot || 1)) * Math.PI * 2, large = a1 - a0 > Math.PI ? 1 : 0;
          const x0 = 120 + 90 * Math.cos(a0), y0 = 110 + 90 * Math.sin(a0), x1 = 120 + 90 * Math.cos(a1), y1 = 110 + 90 * Math.sin(a1);
          s("path", { d: `M120,110 L${x0},${y0} A90,90 0 ${large} 1 ${x1},${y1} Z`, fill: PAL[i % PAL.length], stroke: "#0b1220", "stroke-width": 2 }, el);
          s("rect", { x: 240, y: 30 + i * 24, width: 14, height: 14, rx: 3, fill: PAL[i % PAL.length] }, el);
          s("text", { x: 260, y: 42 + i * 24, fill: "#e2e8f0", "font-size": 12, text: `${d[0]} — ${Math.round((d[1] / (tot || 1)) * 100)}%` }, el);
          a0 = a1;
        });
      } else {
        const bw = 330 / data.length;
        s("line", { x1: 36, y1: 190, x2: 370, y2: 190, stroke: "#64748b" }, el);
        s("line", { x1: 36, y1: 20, x2: 36, y2: 190, stroke: "#64748b" }, el);
        s("text", { x: 200, y: 214, fill: "#94a3b8", "font-size": 11, "text-anchor": "middle", text: p.xLabel || "X o‘qi (toifalar)" }, el);
        s("text", { x: 12, y: 105, fill: "#94a3b8", "font-size": 11, transform: "rotate(-90 12 105)", "text-anchor": "middle", text: p.yLabel || "Y o‘qi (qiymat)" }, el);
        let path = "";
        data.forEach((d, i) => {
          const hh = (d[1] / mx) * 150, x = 40 + i * bw;
          if (type === 0) s("rect", { x: x + 6, y: 190 - hh, width: bw - 12, height: hh, rx: 4, fill: PAL[i % PAL.length] }, el);
          else { path += `${i ? "L" : "M"}${x + bw / 2},${190 - hh} `; s("circle", { cx: x + bw / 2, cy: 190 - hh, r: 4.5, fill: "#fde047" }, el); }
          s("text", { x: x + bw / 2, y: 184 - hh, "text-anchor": "middle", fill: "#e2e8f0", "font-size": 11, text: d[1] }, el);
          s("text", { x: x + bw / 2, y: 203, "text-anchor": "middle", fill: "#94a3b8", "font-size": 10, text: d[0] }, el);
        });
        if (type === 1) s("path", { d: path, fill: "none", stroke: "#22c55e", "stroke-width": 3 }, el).parentNode.insertBefore(el.lastChild, el.children[2]);
      }
      s("text", { x: 200, y: 14, "text-anchor": "middle", fill: "#fff", "font-size": 13, "font-weight": 800, text: p.name || "Diagramma nomi" }, el);
      stage.innerHTML = ""; stage.append(el);
      const best = data.reduce((a, d) => (d[1] > a[1] ? d : a), data[0]), low = data.reduce((a, d) => (d[1] < a[1] ? d : a), data[0]);
      out.innerHTML = `<b>Xulosa:</b> eng katta — <b>${best[0]}</b> (${best[1]}), eng kichik — <b>${low[0]}</b> (${low[1]}), jami ${tot}, o‘rtacha ${num(Math.round((tot / data.length) * 10) / 10)}.<div class="muted">${["Ustunli diagramma toifalarni solishtirish uchun qulay.", "Chiziqli diagramma vaqt bo‘yicha o‘zgarishni (o‘sish/kamayish) ko‘rsatadi.", "Doiraviy diagramma butunning qismlarini (foizlarni) ko‘rsatadi."][type]}</div>`;
      inputs.innerHTML = "";
      data.forEach((d, i) => inputs.append(slider({ label: d[0], min: 0, max: p.max || 30, value: d[1], onInput: (v) => { d[1] = v; render(); } })));
    }
    const inputs = h("div", { class: "wi-row wrap" });
    controls.append(buttons(["📊 Ustunli", "📈 Chiziqli", "🥧 Doiraviy"], (i) => { type = i; render(); }, type), inputs);
    render();
  };

  // =====================================================================
  // 12. Tarmoq topologiyasi va paket yo'li
  // =====================================================================
  W.network = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌐 Tarmoq — topologiyani tanlang, qurilmani “buzib” ko‘ring");
    let topo = p.topo || 0, broken = -1;
    const N = 6;
    const pos = (i, cx = 190, cy = 120, r = 90) => [cx + r * Math.cos((i / N) * Math.PI * 2 - Math.PI / 2), cy + r * Math.sin((i / N) * Math.PI * 2 - Math.PI / 2)];
    function edges() {
      if (topo === 0) return Array.from({ length: N }, (_, i) => [i, "C"]);
      if (topo === 1) return Array.from({ length: N }, (_, i) => [i, (i + 1) % N]);
      if (topo === 2) return Array.from({ length: N }, (_, i) => [i, "B" + i]);
      const e = []; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if ((i + j) % 2 || j === i + 1) e.push([i, j]); return e;
    }
    function connected() {
      const E = edges(), alive = new Set();
      const adj = {};
      const add = (a, b) => { (adj[a] = adj[a] || []).push(b); (adj[b] = adj[b] || []).push(a); };
      E.forEach(([a, b]) => add(String(a), String(b)));
      if (topo === 2) for (let i = 0; i < N - 1; i++) add("B" + i, "B" + (i + 1));
      const start = topo === 0 ? "C" : String(broken === 0 ? 1 : 0);
      if (topo === 0 && broken === 99) return new Set();
      const q = [start]; alive.add(start);
      while (q.length) { const x = q.shift(); (adj[x] || []).forEach((y) => { if (!alive.has(y) && String(broken) !== y && !(broken === 99 && y === "C")) { alive.add(y); q.push(y); } }); }
      return alive;
    }
    function render() {
      const el = svg(380, 250), al = connected();
      const P = (k) => (k === "C" ? [190, 120] : String(k).startsWith("B") ? [40 + +String(k).slice(1) * 60, 228] : pos(+k));
      if (topo === 2) s("line", { x1: 30, y1: 228, x2: 350, y2: 228, stroke: "#94a3b8", "stroke-width": 5 }, el);
      edges().forEach(([a, b]) => { const [x1, y1] = topo === 2 ? [40 + a * 60, 150] : P(a), [x2, y2] = P(b); s("line", { x1, y1, x2, y2, stroke: al.has(String(a)) && al.has(String(b)) ? "#22c55e" : "#475569", "stroke-width": 3, "stroke-dasharray": al.has(String(a)) ? "" : "5 5" }, el); });
      if (topo === 0) { const g = s("g", { style: "cursor:pointer" }, el); s("rect", { x: 165, y: 105, width: 50, height: 30, rx: 6, fill: broken === 99 ? "#7f1d1d" : "#0ea5e9" }, g); s("text", { x: 190, y: 125, "text-anchor": "middle", fill: "#fff", "font-size": 11, "font-weight": 800, text: "SWITCH" }, g); g.onclick = () => { broken = broken === 99 ? -1 : 99; render(); }; }
      for (let i = 0; i < N; i++) {
        const [x, y] = topo === 2 ? [40 + i * 60, 150] : pos(i);
        const g = s("g", { style: "cursor:pointer" }, el);
        s("circle", { cx: x, cy: y, r: 20, fill: broken === i ? "#7f1d1d" : al.has(String(i)) ? "#14532d" : "#334155", stroke: broken === i ? "#f87171" : "#22c55e", "stroke-width": 2 }, g);
        s("text", { x, y: y + 6, "text-anchor": "middle", "font-size": 18, text: broken === i ? "💥" : "💻" }, g);
        g.onclick = () => { broken = broken === i ? -1 : i; render(); };
      }
      stage.innerHTML = ""; stage.append(el);
      const ok = [...Array(N).keys()].filter((i) => i !== broken && al.has(String(i))).length;
      const info = [["Yulduz", "Hammasi markaziy kommutatorga (switch) ulanadi. Bitta kompyuter buzilsa — qolganlari ishlaydi. Markaz buzilsa — butun tarmoq to‘xtaydi."], ["Halqa", "Har bir kompyuter ikki qo‘shnisiga ulanadi. Bitta qurilma uzilsa, ma’lumot boshqa yo‘ldan aylanib o‘tadi (ikki yo‘nalishli halqada)."], ["Shina", "Hammasi bitta umumiy kabelga ulanadi. Arzon, lekin kabel uzilsa — tarmoq ishdan chiqadi, to‘qnashuvlar ko‘p."], ["To‘rsimon (mesh)", "Qurilmalar bir-biriga ko‘p yo‘l bilan ulangan. Juda ishonchli, lekin qimmat. Internetning asosiy qismi shunday."]][topo];
      out.innerHTML = `<b>${info[0]}</b>: ${info[1]}<div class="big-num">${ok} / ${N - (broken >= 0 && broken < N ? 1 : 0)} ta kompyuter aloqada</div><div class="muted">Kompyuterni (yoki switchni) bosib, uni “buzing”.</div>`;
    }
    controls.append(buttons(["⭐ Yulduz", "⭕ Halqa", "➖ Shina", "🕸 Mesh"], (i) => { topo = i; broken = -1; render(); }, topo));
    render();
  };

  // =====================================================================
  // 13. Tasvir tahriri (yorqinlik, kontrast, aylantirish, qirqish, oq-qora)
  // =====================================================================
  W.imageEdit = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🖼 Tasvirni tahrirlash — slayderlarni suring");
    const st = { br: 100, ct: 100, sat: 100, rot: 0, flip: 1, crop: 0, blur: 0, gray: 0, w: 100 };
    const pic = `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#bae6fd"/></linearGradient></defs><rect width="300" height="200" fill="url(#sky)"/><circle cx="235" cy="45" r="24" fill="#fde047"/><path d="M0 150 L70 80 L130 140 L190 70 L300 160 L300 200 L0 200Z" fill="#16a34a"/><path d="M0 170 Q150 130 300 175 L300 200 L0 200Z" fill="#15803d"/><rect x="40" y="135" width="40" height="32" fill="#f8fafc"/><path d="M36 137 L60 115 L84 137Z" fill="#dc2626"/><rect x="54" y="150" width="11" height="17" fill="#92400e"/><circle cx="160" cy="165" r="10" fill="#f472b6"/><circle cx="175" cy="170" r="8" fill="#fb923c"/></svg>`;
    function render() {
      const filter = `brightness(${st.br}%) contrast(${st.ct}%) saturate(${st.sat}%) grayscale(${st.gray}%) blur(${st.blur}px)`;
      const inset = st.crop;
      stage.innerHTML = `<div class="wi-img" style="width:${Math.round(3 * st.w)}px;max-width:100%"><div style="filter:${filter};transform:rotate(${st.rot}deg) scaleX(${st.flip});clip-path:inset(${inset}% ${inset}% ${inset}% ${inset}%)">${pic}</div></div>`;
      const W0 = 3000, H0 = 2000;
      const cw = Math.round((W0 * (100 - 2 * inset)) / 100 * st.w / 100), chh = Math.round((H0 * (100 - 2 * inset)) / 100 * st.w / 100);
      out.innerHTML = `Asl o‘lcham: 3000 × 2000 piksel. Hozirgi: <b>${cw} × ${chh}</b> piksel (tomonlar nisbati 3:2 saqlangan). Taxminiy hajm: <b>${fmtBytes(cw * chh * 3)}</b> (siqilmagan).<div class="muted">CSS filtr: <code>${filter}</code></div>`;
    }
    const sl = (label, key, min, max, step = 1) => controls.append(slider({ label, min, max, step, value: st[key], onInput: (v) => { st[key] = v; render(); } }));
    sl("☀️ Yorqinlik %", "br", 20, 200); sl("◐ Kontrast %", "ct", 20, 200); sl("🎨 To‘yinganlik %", "sat", 0, 250); sl("⚫ Oq-qora %", "gray", 0, 100); sl("💧 Xiralik (blur)", "blur", 0, 6, 0.5); sl("✂️ Qirqish %", "crop", 0, 30); sl("↔ O‘lcham %", "w", 30, 100); sl("⟳ Aylantirish°", "rot", -180, 180, 15);
    controls.append(button("⇋ Ko‘zgu (teskari o‘girish)", () => { st.flip *= -1; render(); }, "ghost"), button("↺ Asl holat", () => { Object.assign(st, { br: 100, ct: 100, sat: 100, rot: 0, flip: 1, crop: 0, blur: 0, gray: 0, w: 100 }); controls.querySelectorAll("label.ctl").forEach((l, i) => l.set && l.set([100, 100, 100, 0, 0, 0, 100, 0][i])); render(); }, "ghost"));
    render();
  };

  // =====================================================================
  // 14. Rasm chizish (Paint): qalam, chiziq, to'rtburchak, ellips, o'chirg'ich
  // =====================================================================
  W.paint = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🎨 Grafik muharrir — uskunani tanlab chizing");
    const cv = h("canvas", { width: 520, height: 300, class: "wi-canvas" });
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 520, 300);
    let tool = 0, color = "#16a34a", width = 4, start = null, snap = null, clip = null;
    const TOOLS = ["✏️ Pencil", "🖌 Brush", "📏 Line", "▭ Rectangle", "◯ Ellipse", "🧽 Eraser", "🪣 Fill", "✂️ Nusxa/qo‘yish"];
    const posOf = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 520, ((e.clientY - r.top) / r.height) * 300]; };
    cv.style.touchAction = "none";
    cv.onpointerdown = (e) => {
      cv.setPointerCapture(e.pointerId);
      start = posOf(e);
      snap = ctx.getImageData(0, 0, 520, 300);
      if (tool === 6) { ctx.fillStyle = color; ctx.fillRect(0, 0, 0, 0); floodFill(start); start = null; }
      if (tool === 7) { if (clip) { ctx.putImageData(clip, start[0] - clip.width / 2, start[1] - clip.height / 2); out.innerHTML = "📋 Nusxa joylashtirildi (Paste). Yana bosib, yana joylashingiz mumkin."; start = null; } }
      ctx.beginPath(); ctx.moveTo(...(start || [0, 0]));
    };
    cv.onpointermove = (e) => {
      if (!start) return;
      const [x, y] = posOf(e);
      ctx.strokeStyle = tool === 5 ? "#fff" : color; ctx.lineWidth = tool === 0 ? Math.max(1, width / 2) : tool === 5 ? width * 4 : width; ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (tool <= 1 || tool === 5) { ctx.lineTo(x, y); ctx.stroke(); return; }
      ctx.putImageData(snap, 0, 0);
      ctx.beginPath();
      if (tool === 2) { ctx.moveTo(...start); ctx.lineTo(x, y); }
      if (tool === 3 || tool === 7) { ctx.setLineDash(tool === 7 ? [6, 4] : []); ctx.rect(start[0], start[1], x - start[0], y - start[1]); }
      if (tool === 4) ctx.ellipse((start[0] + x) / 2, (start[1] + y) / 2, Math.abs(x - start[0]) / 2, Math.abs(y - start[1]) / 2, 0, 0, Math.PI * 2);
      ctx.stroke(); ctx.setLineDash([]);
    };
    cv.onpointerup = (e) => {
      if (!start) return;
      if (tool === 7 && !clip) {
        const [x, y] = posOf(e);
        ctx.putImageData(snap, 0, 0);
        const w = Math.abs(x - start[0]), hh = Math.abs(y - start[1]);
        if (w > 4 && hh > 4) { clip = ctx.getImageData(Math.min(x, start[0]), Math.min(y, start[1]), w, hh); out.innerHTML = "✂️ Qism nusxalandi (Copy). Endi rasmning istalgan joyini bosing — joylashtiriladi (Paste)."; }
      }
      start = null;
    };
    function floodFill([x0, y0]) {
      const img = ctx.getImageData(0, 0, 520, 300), d = img.data;
      const idx = (x, y) => (y * 520 + x) * 4;
      x0 = Math.floor(x0); y0 = Math.floor(y0);
      const t = d.slice(idx(x0, y0), idx(x0, y0) + 4);
      const c = [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)];
      if (Math.abs(t[0] - c[0]) + Math.abs(t[1] - c[1]) + Math.abs(t[2] - c[2]) < 10) return;
      const st2 = [[x0, y0]];
      let guard = 0;
      while (st2.length && guard++ < 200000) {
        const [x, y] = st2.pop();
        if (x < 0 || y < 0 || x >= 520 || y >= 300) continue;
        const i = idx(x, y);
        if (Math.abs(d[i] - t[0]) + Math.abs(d[i + 1] - t[1]) + Math.abs(d[i + 2] - t[2]) > 60) continue;
        d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
        st2.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
      ctx.putImageData(img, 0, 0);
    }
    stage.append(cv);
    const colors = h("div", { class: "wi-colors" });
    ["#111827", "#ef4444", "#f59e0b", "#fde047", "#16a34a", "#38bdf8", "#6366f1", "#ec4899", "#ffffff"].forEach((c) => {
      const b = h("button", { type: "button", style: `background:${c}`, "aria-label": c });
      b.onclick = () => { color = c; colors.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); };
      colors.append(b);
    });
    controls.append(buttons(TOOLS, (i) => { tool = i; clip = null; out.innerHTML = ["Pencil — ingichka erkin chiziq.", "Brush — qalin mo‘yqalam.", "Line — to‘g‘ri chiziq: bosib, torting.", "Rectangle — to‘rtburchak.", "Ellipse — ellips/aylana.", "Eraser — o‘chirg‘ich (fon rangi bilan bo‘yaydi).", "Fill — yopiq sohani bo‘yash.", "Avval sohani belgilang (nusxa olinadi), keyin joylashtirish uchun bosing."][i]; }), colors, slider({ label: "Chiziq qalinligi", min: 1, max: 20, value: 4, onInput: (v) => { width = v; } }),
      button("🗑 Tozalash", () => { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 520, 300); }, "ghost"),
      button("💾 Saqlash (PNG)", () => { const a = document.createElement("a"); a.download = "rasm.png"; a.href = cv.toDataURL("image/png"); a.click(); out.innerHTML = "💾 Rasm <b>rasm.png</b> nomi bilan saqlandi. PNG — sifatni yo‘qotmaydigan format."; }, "ghost"));
    out.innerHTML = "Uskunani tanlang va oq maydonda chizing.";
  };

  // =====================================================================
  // 15. Matn muharriri (Word): belgilash, formatlash, tekislash, ro'yxat, izlash
  // =====================================================================
  W.textEdit = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📝 Matn muharriri — matnni belgilang va tugmalarni bosing");
    const ed = h("div", { class: "wi-doc", contenteditable: "true", spellcheck: "true" });
    ed.innerHTML = p.html || "<h3>Mening maktabim</h3><p>Bizning maktabimiz Oltinsoy tumanida joylashgan. Maktabda kompyuter xonasi, kutubxona va sport zali bor.</p><p>Men informatika fanini juda yaxshi koʻraman, chunki kompyuterda ishlashni oʻrganyapman.</p>";
    const tb = h("div", { class: "wi-tb" });
    const cmd = (c, v) => { ed.focus(); document.execCommand(c, false, v); stat(); };
    [["<b>B</b>", "bold", "Qalin (Ctrl+B)"], ["<i>I</i>", "italic", "Kursiv (Ctrl+I)"], ["<u>U</u>", "underline", "Tagiga chizilgan (Ctrl+U)"], ["⬅", "justifyLeft", "Chapga"], ["⬌", "justifyCenter", "Markazga"], ["➡", "justifyRight", "O‘ngga"], ["☰", "justifyFull", "Eni bo‘yicha"], ["• Ro‘yxat", "insertUnorderedList", "Belgili ro‘yxat"], ["1. Ro‘yxat", "insertOrderedList", "Raqamli ro‘yxat"], ["↶", "undo", "Bekor qilish (Ctrl+Z)"], ["↷", "redo", "Qaytarish (Ctrl+Y)"]].forEach(([l, c, t]) => { const b = h("button", { type: "button", title: t }); b.innerHTML = l; b.onmousedown = (e) => e.preventDefault(); b.onclick = () => cmd(c); tb.append(b); });
    const size = h("select", { class: "wi-sel", "aria-label": "Shrift o‘lchami" }, ...[["2", "10"], ["3", "12"], ["4", "14"], ["5", "18"], ["6", "24"], ["7", "32"]].map(([v, t]) => h("option", { value: v }, t + " pt")));
    size.value = "3"; size.onchange = () => cmd("fontSize", size.value);
    const font = h("select", { class: "wi-sel", "aria-label": "Shrift" }, ...["Arial", "Times New Roman", "Georgia", "Courier New", "Comic Sans MS"].map((f) => h("option", { value: f }, f)));
    font.onchange = () => cmd("fontName", font.value);
    const col = h("input", { type: "color", value: "#16a34a", "aria-label": "Matn rangi" });
    col.oninput = () => cmd("foreColor", col.value);
    tb.append(font, size, col);
    stage.append(tb, ed);
    const find = h("input", { class: "wi-in", placeholder: "Topish…", "aria-label": "Topish" });
    const rep = h("input", { class: "wi-in", placeholder: "Almashtirish…", "aria-label": "Almashtirish" });
    controls.append(h("div", { class: "wi-row" }, find, rep, button("Barchasini almashtirish", () => {
      if (!find.value) return;
      const re = new RegExp(find.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      let n = 0;
      const walk = (node) => { if (node.nodeType === 3) { node.textContent = node.textContent.replace(re, () => { n++; return rep.value; }); } else node.childNodes.forEach(walk); };
      walk(ed);
      out.innerHTML = `🔁 <b>${n}</b> ta almashtirildi.`;
    }, "ghost")));
    function stat() {
      const t = ed.innerText.trim();
      const w = t ? t.split(/\s+/).length : 0;
      const errs = (t.match(/\b(\w+) \1\b/gi) || []).length;
      out.innerHTML = `So‘zlar: <b>${w}</b> · Belgilar: <b>${t.length}</b> · Xatboshilar: <b>${ed.querySelectorAll("p,li,h3").length}</b>${errs ? ` · ⚠️ Takror so‘z: ${errs}` : ""}<div class="muted">Matnni sichqoncha bilan belgilang (yoki Shift+strelka), keyin formatlash tugmasini bosing. Delete — o‘ngdagi, Backspace — chapdagi belgini o‘chiradi.</div>`;
    }
    ed.addEventListener("input", stat);
    stat();
  };

  // =====================================================================
  // 16. Slayd: o'tish effektlari va animatsiya
  // =====================================================================
  W.slides = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🎞 Taqdimot — o‘tish effekti va animatsiyani tanlang");
    const S = p.slides || [["🌍 Bizning sayyora", "Yer — Quyosh sistemasidagi uchinchi sayyora"], ["💧 Suv", "Yer yuzasining 71% i suv bilan qoplangan"], ["🌳 Tabiatni asraylik", "Har bir daraxt — toza havo manbai"]];
    let i = 0, tr = 0, an = 0, dur = 0.8, auto = 0, timer = null;
    const TR = ["Fade (paydo bo‘lish)", "Push (surish)", "Zoom (kattalashish)", "Flip (aylanish)", "Yo‘q"], AN = ["Fly in (uchib kirish)", "Bounce (sakrash)", "Wipe (ochilish)", "Yo‘q"];
    function show() {
      const [t, b] = S[i];
      stage.innerHTML = `<div class="wi-slide tr${tr}" style="--d:${dur}s"><h3>${t}</h3><p class="an${an}" style="--d:${dur}s">${b}</p><small>${i + 1} / ${S.length}</small></div>`;
      out.innerHTML = `O‘tish: <b>${TR[tr]}</b> · Animatsiya: <b>${AN[an]}</b> · Davomiyligi: <b>${dur} s</b>${auto ? ` · Avto: har ${auto} s da keyingi slayd` : ""}<div class="muted"><b>O‘tish (transition)</b> — slayddan slaydga o‘tish effekti. <b>Animatsiya</b> — slayd ichidagi obyektning harakati. Effektlarni me’yorida ishlating — asosiysi mazmun!</div>`;
    }
    const go = (d) => { i = (i + d + S.length) % S.length; show(); };
    controls.append(button("◀", () => go(-1), "ghost"), button("Keyingi ▶", () => go(1)),
      h("label", { class: "ctl" }, h("span", {}, "O‘tish"), (() => { const x = h("select", { class: "wi-sel" }, ...TR.map((t, k) => h("option", { value: k }, t))); x.onchange = () => { tr = +x.value; show(); }; return x; })()),
      h("label", { class: "ctl" }, h("span", {}, "Animatsiya"), (() => { const x = h("select", { class: "wi-sel" }, ...AN.map((t, k) => h("option", { value: k }, t))); x.onchange = () => { an = +x.value; show(); }; return x; })()),
      slider({ label: "Davomiylik (s)", min: 0.2, max: 2, step: 0.1, value: dur, onInput: (v) => { dur = v; show(); } }),
      slider({ label: "Avto o‘tish (s, 0 — qo‘lda)", min: 0, max: 6, value: 0, onInput: (v) => { auto = v; clearInterval(timer); if (v) timer = setInterval(() => { if (!root.isConnected) clearInterval(timer); else go(1); }, v * 1000); show(); } }));
    show();
  };

  // =====================================================================
  // 17. Elektron pochta: xat yozish va tekshirish
  // =====================================================================
  W.email = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "✉️ Elektron xat yozing — tizim tekshiradi");
    stage.innerHTML = `<div class="wi-mail">
      <label>Kimga:<input data-k="to" value="ustoz@maktab.uz"></label>
      <label>Nusxa (CC):<input data-k="cc" placeholder="ixtiyoriy"></label>
      <label>Mavzu:<input data-k="sub" value="Uy vazifasi"></label>
      <textarea data-k="body" rows="5">Assalomu alaykum, ustoz!\nUy vazifamni ilova qilib yubordim.\nHurmat bilan, Aziza.</textarea>
      <div class="wi-att"><button type="button" data-att>📎 Fayl ilova qilish</button><span data-files></span></div>
      <div class="wi-mail-btns"><button type="button" class="dbtn" data-send>📤 Yuborish</button><button type="button" class="dbtn ghost" data-reply>↩ Javob berish</button><button type="button" class="dbtn ghost" data-fwd>➡ Uzatish (Forward)</button></div></div>`;
    const files = [];
    const g = (k) => stage.querySelector(`[data-k="${k}"]`);
    stage.querySelector("[data-att]").onclick = () => { const n = ["vazifa.docx", "rasm.jpg", "jadval.xlsx", "taqdimot.pptx"][files.length % 4]; files.push(n); stage.querySelector("[data-files]").textContent = files.join(", "); };
    const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    stage.querySelector("[data-send]").onclick = () => {
      const errs = [], to = g("to").value.split(/[,;]\s*/).filter(Boolean);
      if (!to.length) errs.push("“Kimga” maydoni bo‘sh");
      to.forEach((a) => { if (!emailRe.test(a)) errs.push(`“${esc(a)}” — noto‘g‘ri manzil (ism@domen.uz ko‘rinishida bo‘lishi kerak)`); });
      if (!g("sub").value.trim()) errs.push("Mavzu yozilmagan — qabul qiluvchi xat nima haqidaligini bilmaydi");
      if (/ilova|biriktir|yubordim/i.test(g("body").value) && !files.length) errs.push("Matnda “ilova” deyilgan, lekin fayl biriktirilmagan!");
      out.innerHTML = errs.length ? `<b style="color:#f87171">Yuborilmadi:</b><ul>${errs.map((e) => `<li>${e}</li>`).join("")}</ul>` : `<div class="big-num">✅ Xat yuborildi!</div><div>📤 “Yuborilganlar” (Sent) papkasiga tushdi. Qabul qiluvchilar: ${to.length + (g("cc").value ? g("cc").value.split(/[,;]/).length : 0)} ta. Ilovalar: ${files.length}.</div>`;
    };
    stage.querySelector("[data-reply]").onclick = () => { g("sub").value = "Re: " + g("sub").value.replace(/^(Re|Fwd): /, ""); g("to").value = "aziza@maktab.uz"; g("body").value = "Rahmat, Aziza! Vazifang qabul qilindi.\n\n> " + g("body").value.split("\n")[0]; out.innerHTML = "↩ <b>Reply</b> — faqat jo‘natuvchiga javob. Mavzu oldiga “Re:” qo‘shiladi."; };
    stage.querySelector("[data-fwd]").onclick = () => { g("sub").value = "Fwd: " + g("sub").value.replace(/^(Re|Fwd): /, ""); g("to").value = ""; out.innerHTML = "➡ <b>Forward</b> — xatni (ilovalari bilan) boshqa odamga uzatish. Endi “Kimga”ni yozing."; };
    out.innerHTML = "<span class=muted>Manzil formati: <b>foydalanuvchi@domen.uz</b>. @ — “at” (kuchukcha) belgisi.</span>";
  };

  // =====================================================================
  // 18. Qidiruv tizimi simulyatori (kalit so'z, "aniq ibora", -istisno, site:)
  // =====================================================================
  W.search = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔎 Qidiruv tizimi — so‘rovni o‘zgartirib ko‘ring");
    const PAGES = [["uz.wikipedia.org", "Amir Temur — Vikipediya", "Amir Temur (1336–1405) — davlat arbobi, sarkarda, Temuriylar davlati asoschisi.", 5],
      ["gov.uz", "Amir Temur xiyoboni — rasmiy portal", "Toshkentdagi Amir Temur xiyoboni tarixi va bugungi holati.", 5],
      ["kun.uz", "Amir Temur haqida 10 ta qiziqarli fakt", "Sohibqiron hayotidan qiziqarli faktlar va tarixiy manbalar.", 4],
      ["blog-xyz.top", "Amir Temur xazinasi topildi!!!", "Shoshilinch! Bu yerni bosing va yutuqni oling...", 1],
      ["ziyouz.com", "Temur tuzuklari — elektron kitob", "Temur tuzuklari matni, tarjimasi va izohlari.", 4],
      ["uz.wikipedia.org", "Samarqand — Vikipediya", "Samarqand — qadimiy shahar, Amir Temur davlatining poytaxti.", 5],
      ["kun.uz", "Futbol: Temur ismli hujumchi gol urdi", "Kecha bo‘lib o‘tgan o‘yinda Temur ikki gol urdi.", 3],
      ["edu.uz", "Informatika darsligi 7-sinf", "Qidiruv tizimlari, brauzer va internet xavfsizligi mavzulari.", 5]];
    const inp = h("input", { class: "wi-in", value: p.q || "Amir Temur", "aria-label": "Qidiruv so‘rovi" });
    function render() {
      const q = inp.value.toLowerCase();
      const phrases = [...q.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
      const minus = [...q.matchAll(/-(\S+)/g)].map((m) => m[1]);
      const site = (q.match(/site:(\S+)/) || [])[1];
      const words = q.replace(/"[^"]+"/g, " ").replace(/-\S+/g, " ").replace(/site:\S+/g, " ").split(/\s+/).filter(Boolean);
      const res = PAGES.map((pg) => {
        const text = (pg[1] + " " + pg[2]).toLowerCase();
        if (site && !pg[0].endsWith(site)) return null;
        if (minus.some((m) => text.includes(m))) return null;
        if (phrases.some((ph) => !text.includes(ph))) return null;
        const score = words.reduce((a, w) => a + (text.includes(w) ? 1 : 0), 0) + phrases.length * 2;
        return score > 0 ? [pg, score] : null;
      }).filter(Boolean).sort((a, b) => b[1] - a[1] || b[0][3] - a[0][3]);
      stage.innerHTML = `<div class="wi-serp">${res.map(([pg]) => `<div class="wi-hit"><small>https://${pg[0]} <i class="r${pg[3]}">${pg[3] >= 4 ? "✅ ishonchli" : pg[3] >= 3 ? "🟡 tekshiring" : "⛔ shubhali"}</i></small><b>${esc(pg[1])}</b><span>${esc(pg[2])}</span></div>`).join("") || "<em>Hech narsa topilmadi</em>"}</div>`;
      out.innerHTML = `Topildi: <b>${res.length}</b> ta sahifa.<div class="muted">Sinab ko‘ring: <code>"Amir Temur" -futbol</code>, <code>Temur site:wikipedia.org</code>. Qo‘shtirnoq — aniq ibora, minus — istisno, site: — faqat shu sayt. Ishonchli manba: rasmiy (gov.uz, edu.uz), ensiklopediya, tanilgan nashrlar.</div>`;
    }
    inp.oninput = render;
    controls.append(h("label", { class: "ctl wide" }, h("span", {}, "So‘rov:"), inp), buttons(["Amir Temur", "\"Amir Temur\" -futbol", "Temur site:wikipedia.org", "Samarqand"], (i) => { inp.value = ["Amir Temur", "\"Amir Temur\" -futbol", "Temur site:wikipedia.org", "Samarqand"][i]; render(); }, -1));
    render();
  };

  // =====================================================================
  // 19. Algoritm izi (trace): blok-sxema qadamlari va o'zgaruvchilar jadvali
  // =====================================================================
  const ALGOS = {
    sum: { name: "1 dan N gacha yig‘indi", lines: ["N ni kirit", "S ← 0, i ← 1", "i ≤ N ? (shart)", "S ← S + i", "i ← i + 1", "S ni chiqar"],
      run(N) { const t = []; let S = 0, i = 1; t.push([0, { N }]); t.push([1, { N, S, i }]); while (true) { t.push([2, { N, S, i, "shart": i <= N ? "ha" : "yo‘q" }]); if (i > N) break; S += i; t.push([3, { N, S, i }]); i++; t.push([4, { N, S, i }]); } t.push([5, { N, S, i, "natija": S }]); return t; } },
    even: { name: "Juft yoki toq (tarmoqlanish)", lines: ["N ni kirit", "N mod 2 = 0 ? (shart)", "“Juft” deb chiqar", "“Toq” deb chiqar"],
      run(N) { return [[0, { N }], [1, { N, "N mod 2": N % 2 }], [N % 2 ? 3 : 2, { N, natija: N % 2 ? "toq" : "juft" }]]; } },
    fact: { name: "Faktorial N!", lines: ["N ni kirit", "F ← 1, i ← 1", "i ≤ N ?", "F ← F · i", "i ← i + 1", "F ni chiqar"],
      run(N) { const t = []; let F = 1, i = 1; t.push([0, { N }]); t.push([1, { N, F, i }]); while (true) { t.push([2, { N, F, i, shart: i <= N ? "ha" : "yo‘q" }]); if (i > N) break; F *= i; t.push([3, { N, F, i }]); i++; t.push([4, { N, F, i }]); } t.push([5, { N, F, natija: F }]); return t; } },
    max: { name: "Uch sonning kattasi", lines: ["a, b, c ni kirit", "M ← a", "b > M ? → M ← b", "c > M ? → M ← c", "M ni chiqar"],
      run(N) { const a = N, b = (N * 7) % 10, c = (N * 3 + 4) % 10; let M = a; const t = [[0, { a, b, c }], [1, { a, b, c, M }]]; if (b > M) M = b; t.push([2, { a, b, c, M }]); if (c > M) M = c; t.push([3, { a, b, c, M }]); t.push([4, { a, b, c, M, natija: M }]); return t; } }
  };
  W.trace = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧭 Algoritmni qadamma-qadam bajaring");
    let algo = p.algo || "sum", N = p.n || 4, trace = [], k = 0;
    function reset() { trace = ALGOS[algo].run(N); k = 0; render(); }
    function render() {
      const A = ALGOS[algo], [line, vars] = trace[k];
      stage.innerHTML = `<div class="wi-flow">${A.lines.map((l, i) => `<div class="${i === line ? "on" : ""} ${/\?/.test(l) ? "dia" : i === 0 || i === A.lines.length - 1 ? "io" : ""}">${esc(l)}</div>`).join("")}</div>
        <table class="wi-db small"><tr>${Object.keys(vars).map((x) => `<th>${x}</th>`).join("")}</tr><tr>${Object.values(vars).map((x) => `<td>${x}</td>`).join("")}</tr></table>`;
      out.innerHTML = `Qadam <b>${k + 1}</b> / ${trace.length}. ${k === trace.length - 1 ? "✅ Algoritm tugadi." : ""}<div class="muted">Romb (◇) — shart (tarmoqlanish), parallelogramm — kiritish/chiqarish, to‘rtburchak — amal. Takrorlash: shart bajarilguncha bir xil qadamlar qayta bajariladi.</div>`;
    }
    controls.append(buttons(Object.values(ALGOS).map((a) => a.name), (i) => { algo = Object.keys(ALGOS)[i]; reset(); }, Object.keys(ALGOS).indexOf(algo)),
      slider({ label: "Kirish qiymati N", min: 1, max: 8, value: N, onInput: (v) => { N = v; reset(); } }),
      button("⏮", () => { k = 0; render(); }, "ghost"), button("◀ Orqaga", () => { k = Math.max(0, k - 1); render(); }, "ghost"), button("Keyingi qadam ▶", () => { k = Math.min(trace.length - 1, k + 1); render(); }));
    reset();
  };

  // =====================================================================
  // 20. Gantt diagrammasi va kritik yo'l
  // =====================================================================
  W.gantt = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📅 Loyiha rejasi — Gantt diagrammasi");
    const T = (p.tasks || [["Tahlil", 3, []], ["Dizayn", 4, [0]], ["Dasturlash", 6, [1]], ["Kontent", 3, [1]], ["Sinov", 2, [2, 3]], ["Ishga tushirish", 1, [4]]]).map((x) => x.slice());
    function render() {
      const st = [], fin = [];
      T.forEach((t, i) => { st[i] = t[2].length ? Math.max(...t[2].map((d) => fin[d])) : 0; fin[i] = st[i] + t[1]; });
      const total = Math.max(...fin);
      const crit = new Set();
      let cur = fin.indexOf(total);
      while (cur >= 0) { crit.add(cur); const deps = T[cur][2]; cur = deps.length ? deps.reduce((a, d) => (fin[d] > fin[a] ? d : a), deps[0]) : -1; if (cur >= 0 && fin[cur] !== st[[...crit].pop()]) { /* bo'sh */ } }
      const sc = 300 / total;
      stage.innerHTML = `<div class="wi-gantt">${T.map((t, i) => `<div class="row"><span>${esc(t[0])}</span><div class="track"><i class="${crit.has(i) ? "crit" : ""}" style="left:${st[i] * sc}px;width:${t[1] * sc}px">${t[1]}k</i></div></div>`).join("")}<div class="row axis"><span></span><div class="track">${Array.from({ length: total + 1 }, (_, d) => `<b style="left:${d * sc}px">${d}</b>`).join("")}</div></div></div>`;
      out.innerHTML = `Loyiha davomiyligi: <b>${total} kun</b>. Kritik yo‘l (qizil): <b>${[...crit].reverse().map((i) => T[i][0]).join(" → ")}</b>.<div class="muted">Kritik yo‘ldagi ish kechiksa — butun loyiha kechikadi. Boshqa ishlarda zaxira vaqt bor. Davomiylikni o‘zgartirib ko‘ring.</div>`;
    }
    T.forEach((t) => controls.append(slider({ label: t[0] + " (kun)", min: 1, max: 10, value: t[1], onInput: (v) => { t[1] = v; render(); } })));
    render();
  };

  // =====================================================================
  // 21. Ovoz: chastota, balandlik, tezlik, reverberatsiya (Web Audio)
  // =====================================================================
  W.audio = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🎧 Ovoz to‘lqini — tinglang va sozlang");
    const st = { f: 440, vol: 50, speed: 1, rev: 0, type: 0 };
    const TYPES = ["sine", "square", "triangle", "sawtooth"];
    function render() {
      const el = svg(380, 140);
      let d = "";
      for (let x = 0; x <= 380; x += 2) {
        const t = (x / 380) * 0.01 * st.speed, ph = 2 * Math.PI * st.f * t;
        let y = st.type === 0 ? Math.sin(ph) : st.type === 1 ? Math.sign(Math.sin(ph)) : st.type === 2 ? (2 / Math.PI) * Math.asin(Math.sin(ph)) : 2 * (ph / (2 * Math.PI) - Math.floor(ph / (2 * Math.PI) + 0.5));
        const env = st.rev ? 1 - (x / 380) * (1 - st.rev / 100) * 0.3 : 1;
        d += `${x ? "L" : "M"}${x},${70 - y * (st.vol / 100) * 60 * env} `;
      }
      s("line", { x1: 0, y1: 70, x2: 380, y2: 70, stroke: "#334155" }, el);
      s("path", { d, fill: "none", stroke: "#22c55e", "stroke-width": 2.5 }, el);
      stage.innerHTML = ""; stage.append(el);
      out.innerHTML = `Chastota: <b>${Math.round(st.f * st.speed)} Gs</b> ${st.f * st.speed < 300 ? "(past/yo‘g‘on ovoz)" : st.f * st.speed > 900 ? "(baland/ingichka ovoz)" : ""} · Balandlik (amplituda): <b>${st.vol}%</b> · Tezlik: <b>${st.speed}×</b> · Reverb: <b>${st.rev}%</b><div class="muted">Chastota — to‘lqinning 1 soniyadagi tebranishlar soni (balandlik/pastlik). Amplituda — ovoz kuchi. Tezlikni oshirsak, ovoz ham ingichkalashadi. Reverberatsiya — “aks-sado” (zal effekti).</div>`;
    }
    let ctx;
    function play() {
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = TYPES[st.type]; o.frequency.value = st.f * st.speed;
        g.gain.setValueAtTime((st.vol / 100) * 0.2, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6 + st.rev / 40);
        o.connect(g); g.connect(ctx.destination);
        if (st.rev) { const dl = ctx.createDelay(); dl.delayTime.value = 0.12; const fb = ctx.createGain(); fb.gain.value = st.rev / 140; g.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(ctx.destination); }
        o.start(); o.stop(ctx.currentTime + 0.7 + st.rev / 40);
      } catch (e) { out.innerHTML += "<div>Brauzer ovozni qo‘llamaydi.</div>"; }
    }
    controls.append(slider({ label: "Chastota (Gs)", min: 100, max: 1500, step: 10, value: 440, onInput: (v) => { st.f = v; render(); } }), slider({ label: "Balandlik %", min: 0, max: 100, value: 50, onInput: (v) => { st.vol = v; render(); } }), slider({ label: "Tezlik ×", min: 0.5, max: 2, step: 0.25, value: 1, onInput: (v) => { st.speed = v; render(); } }), slider({ label: "Reverb %", min: 0, max: 100, step: 10, value: 0, onInput: (v) => { st.rev = v; render(); } }),
      buttons(["Sinus", "Kvadrat", "Uchburchak", "Arra"], (i) => { st.type = i; render(); }), button("🔊 Tinglash", play));
    render();
  };

  // =====================================================================
  // 22. Video montaj vaqt chizig'i (kesish, tezlik, titr, eksport)
  // =====================================================================
  W.timeline = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🎬 Video montaj — kliplarni kesing va birlashtiring");
    const clips = (p.clips || [["🎥 Kirish", 12, "#38bdf8"], ["🏫 Maktab", 20, "#22c55e"], ["⚽ Sport", 15, "#f472b6"], ["🎵 Yakun", 8, "#fde047"]]).map(([n, d, c]) => ({ n, d, c, a: 0, b: d, sp: 1 }));
    let fmt = 0, res = 1, title = true;
    const FMT = [["MP4 (H.264)", 1], ["WEBM", 0.8], ["AVI", 4], ["GIF", 6]], RES = [["480p", 0.4], ["720p", 1], ["1080p", 2.2], ["4K", 8]];
    function render() {
      const len = clips.reduce((a, c) => a + (c.b - c.a) / c.sp, 0) + (title ? 3 : 0);
      stage.innerHTML = `<div class="wi-tl">${title ? `<i style="flex:3;background:#a78bfa">T</i>` : ""}${clips.map((c) => `<i style="flex:${(c.b - c.a) / c.sp};background:${c.c}">${c.n}<small>${Math.round((c.b - c.a) / c.sp)}s</small></i>`).join("")}</div>`;
      const mb = len * 0.6 * FMT[fmt][1] * RES[res][1];
      out.innerHTML = `Umumiy davomiylik: <b>${Math.floor(len / 60)}:${String(Math.round(len % 60)).padStart(2, "0")}</b> · Eksport: <b>${FMT[fmt][0]}, ${RES[res][0]}</b> → ≈ <b>${num(Math.round(mb))} MB</b><div class="muted">Montaj — keraksiz qismlarni kesish (trim), kliplarni ketma-ket birlashtirish, titr, effekt va ovoz qo‘shish. Tezlik 2× — klip 2 marta qisqaradi. Eksport formati va o‘lchami fayl hajmini belgilaydi.</div>`;
    }
    clips.forEach((c) => {
      controls.append(slider({ label: `${c.n}: boshi (s)`, min: 0, max: c.d - 1, value: 0, onInput: (v) => { c.a = Math.min(v, c.b - 1); render(); } }), slider({ label: `${c.n}: oxiri (s)`, min: 1, max: c.d, value: c.d, onInput: (v) => { c.b = Math.max(v, c.a + 1); render(); } }), slider({ label: `${c.n}: tezlik ×`, min: 0.5, max: 3, step: 0.5, value: 1, onInput: (v) => { c.sp = v; render(); } }));
    });
    controls.append(buttons(FMT.map((f) => f[0]), (i) => { fmt = i; render(); }), buttons(RES.map((r) => r[0]), (i) => { res = i; render(); }, 1), button("Titr ✔/✖", () => { title = !title; render(); }, "ghost"));
    render();
  };

  // =====================================================================
  // 23. Sensorlar va mikroprotsessorli boshqaruv
  // =====================================================================
  W.sensor = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📡 Sensor + mikroprotsessor — avtomatik boshqaruv");
    const SENS = [["🌡 Harorat", "°C", 0, 45, 22, 26, "❄️ Konditsioner yoqildi", "Konditsioner o‘chiq"], ["💡 Yorug‘lik", "lyuks", 0, 1000, 600, 200, "💡 Chiroq yoqildi", "Chiroq o‘chiq", true], ["💧 Namlik", "%", 0, 100, 55, 35, "🚿 Sug‘orish yoqildi", "Sug‘orish o‘chiq", true], ["🚶 Harakat", "m", 0, 10, 8, 2, "🚨 Signal! Eshik ochildi", "Qo‘riqlash rejimi", true], ["🧭 Bosim", "kPa", 90, 110, 101, 106, "⚠️ Bosim yuqori — klapan ochildi", "Bosim me’yorda"]];
    let k = p.k || 0, v = SENS[k][4], thr = SENS[k][5];
    function render() {
      const S = SENS[k], on = S[8] ? v < thr : v > thr;
      stage.innerHTML = `<div class="wi-loop"><div><b>${S[0]}</b><span>${v} ${S[1]}</span><small>SENSOR</small></div><em>→ ADC →</em><div class="cpu"><b>🧠 MP</b><span>${v} ${S[8] ? "&lt;" : "&gt;"} ${thr} ?</span><small>MIKROPROTSESSOR</small></div><em>→</em><div class="${on ? "act" : ""}"><b>${on ? "✅" : "⏸"}</b><span>${on ? S[6] : S[7]}</span><small>AKTUATOR</small></div></div>`;
      out.innerHTML = `Sensor qiymati analog signal — <b>ADC</b> (analog-raqamli o‘zgartirgich) uni raqamga aylantiradi. Mikroprotsessor uni chegaraviy qiymat (${thr} ${S[1]}) bilan solishtiradi va qurilmani boshqaradi. Bu jarayon <b>uzluksiz takrorlanadi</b> (teskari aloqa).`;
    }
    const sv = slider({ label: "Muhit qiymati", min: SENS[k][2], max: SENS[k][3], value: v, onInput: (x) => { v = x; render(); } });
    const st = slider({ label: "Chegaraviy qiymat", min: SENS[k][2], max: SENS[k][3], value: thr, onInput: (x) => { thr = x; render(); } });
    controls.append(buttons(SENS.map((x) => x[0]), (i) => { k = i; v = SENS[i][4]; thr = SENS[i][5]; sv.setRange(SENS[i][2], SENS[i][3]); st.setRange(SENS[i][2], SENS[i][3]); sv.set(v); st.set(thr); render(); }, k), sv, st);
    render();
  };

  // =====================================================================
  // 24. Ma'lumotlarni tekshirish: validatsiya va verifikatsiya
  // =====================================================================
  W.validate = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "✔️ Validatsiya — kiritilgan ma’lumotni qoidalar bilan tekshirish");
    const F = [["Ism", "Aziza", "Mavjudlik (bo‘sh emas) va uzunlik 2–30", (x) => x.trim().length >= 2 && x.trim().length <= 30],
      ["Yosh", "13", "Diapazon: 6 dan 18 gacha butun son", (x) => /^\d+$/.test(x) && +x >= 6 && +x <= 18],
      ["Telefon", "+998901234567", "Format: +998 va 9 ta raqam", (x) => /^\+998\d{9}$/.test(x.replace(/\s/g, ""))],
      ["Email", "aziza@maktab.uz", "Format: nom@domen.zona", (x) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(x)],
      ["Sana", "2012-09-01", "Tur: haqiqiy sana (YYYY-MM-DD)", (x) => /^\d{4}-\d{2}-\d{2}$/.test(x) && !isNaN(new Date(x))],
      ["Baho", "5", "Ro‘yxatdan tanlash: 2, 3, 4, 5", (x) => ["2", "3", "4", "5"].includes(x.trim())]];
    stage.innerHTML = `<div class="wi-form">${F.map((f, i) => `<label><span>${f[0]}</span><input data-i="${i}" value="${f[1]}"><small>${f[2]}</small><b data-r="${i}"></b></label>`).join("")}<label><span>Parol (ikki marta)</span><input data-p1 type="password" value="Maktab#2026"><input data-p2 type="password" value="Maktab#2026"><small>Verifikatsiya: ikki marta kiritish</small><b data-v></b></label></div>`;
    function check() {
      let bad = 0;
      F.forEach((f, i) => { const ok = f[3](stage.querySelector(`[data-i="${i}"]`).value); stage.querySelector(`[data-r="${i}"]`).textContent = ok ? "✅" : "❌"; if (!ok) bad++; });
      const same = stage.querySelector("[data-p1]").value === stage.querySelector("[data-p2]").value;
      stage.querySelector("[data-v]").textContent = same ? "✅" : "❌ mos emas";
      out.innerHTML = `${bad || !same ? `⚠️ <b>${bad + (same ? 0 : 1)}</b> ta maydonda xato — forma qabul qilinmaydi.` : "✅ Barcha tekshiruvlardan o‘tdi — ma’lumot bazaga yoziladi."}<div class="muted"><b>Validatsiya</b> — ma’lumot <i>qoidaga mosligini</i> kompyuter tekshiradi (diapazon, format, tur, uzunlik, mavjudlik). U ma’lumot <i>to‘g‘riligini</i> kafolatlamaydi: “Yosh 13” deb noto‘g‘ri yozsangiz ham o‘tadi. <b>Verifikatsiya</b> — asl manba bilan solishtirish: ikki marta kiritish yoki ko‘z bilan tekshirish.</div>`;
    }
    stage.querySelectorAll("input").forEach((i) => (i.oninput = check));
    check();
  };

  // =====================================================================
  // 25. Ekspert tizim (bilimlar bazasi + xulosa mexanizmi)
  // =====================================================================
  W.expert = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧠 Ekspert tizim — “Kompyuterim nega ishlamayapti?”");
    const KB = {
      q0: ["Kompyuter yoqilganda chiroqchasi yonadimi?", "q1", "a0"],
      q1: ["Ekranda tasvir bormi?", "q2", "q3"],
      q2: ["Kompyuter juda sekin ishlayaptimi?", "q4", "q5"],
      q3: ["Monitor kabeli ulanganmi va monitor yoqilganmi?", "a1", "a2"],
      q4: ["Bir vaqtda ko‘p dastur ochiqmi?", "a3", "a4"],
      q5: ["Internetga ulanmayaptimi?", "a5", "a6"],
      a0: "🔌 Elektr ta’minotini tekshiring: vilka, uzaytirgich, quvvat bloki.", a1: "🖥 Videokarta yoki monitor nosoz bo‘lishi mumkin — ustaga murojaat qiling.",
      a2: "🔗 Monitor kabelini ulang va monitorni yoqing.", a3: "📉 Keraksiz dasturlarni yoping, kompyuterni qayta yuklang.",
      a4: "🦠 Antivirus bilan tekshiring va diskda bo‘sh joy borligini ko‘ring.", a5: "📶 Router/Wi‑Fi ni qayta yoqing, kabel va parolni tekshiring.", a6: "👍 Kompyuter yaxshi ishlayapti!"
    };
    let node = "q0", path = [];
    function render() {
      const x = KB[node];
      if (typeof x === "string") {
        stage.innerHTML = `<div class="wi-exp done"><b>Xulosa:</b><p>${x}</p></div>`;
      } else {
        stage.innerHTML = `<div class="wi-exp"><p>${x[0]}</p><div><button class="dbtn" data-y>Ha</button><button class="dbtn ghost" data-n>Yo‘q</button></div></div>`;
        stage.querySelector("[data-y]").onclick = () => { path.push(x[0] + " → Ha"); node = x[1]; render(); };
        stage.querySelector("[data-n]").onclick = () => { path.push(x[0] + " → Yo‘q"); node = x[2]; render(); };
      }
      out.innerHTML = `${path.length ? `<b>Xulosa zanjiri:</b><ol>${path.map((p0) => `<li>${esc(p0)}</li>`).join("")}</ol>` : ""}<div class="muted">Ekspert tizim qismlari: <b>bilimlar bazasi</b> (faktlar va “AGAR … U HOLDA …” qoidalari), <b>xulosa mexanizmi</b> (qoidalarni qo‘llab javob topadi), <b>foydalanuvchi interfeysi</b> (savol-javob) va <b>tushuntirish</b> (nega shunday xulosa).</div>`;
    }
    controls.append(button("↺ Boshidan", () => { node = "q0"; path = []; render(); }, "ghost"));
    render();
  };

  // =====================================================================
  // 26. Siqish: RLE va takrorlanuvchi naqshlar
  // =====================================================================
  W.compress = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🗜 Siqish — RLE (takrorlarni sanash) usuli");
    const inp = h("input", { class: "wi-in", value: p.text || "AAAAAABBBCCCCCCCCDDA", "aria-label": "Ma’lumot" });
    function render() {
      const t = inp.value;
      let enc = "", i = 0;
      const parts = [];
      while (i < t.length) { let j = i; while (j < t.length && t[j] === t[i]) j++; parts.push([t[i], j - i]); enc += (j - i) + t[i]; i = j; }
      const ratio = t.length ? Math.round((enc.length / t.length) * 100) : 0;
      stage.innerHTML = `<div class="wi-rle">${parts.map(([c, n], k) => `<span style="background:${PAL[k % PAL.length]}33;border-color:${PAL[k % PAL.length]}"><b>${n}</b>${esc(c)}</span>`).join("")}</div>`;
      out.innerHTML = `Asl: <b>${t.length}</b> belgi → Siqilgan: <code>${esc(enc)}</code> = <b>${enc.length}</b> belgi (${ratio}%).<div class="big-num">${ratio < 100 ? `📉 ${100 - ratio}% tejaldi` : "📈 Siqish foyda bermadi"}</div><div class="muted">RLE — <b>yo‘qotishsiz</b> siqish: ma’lumot to‘liq tiklanadi (ZIP, PNG ham shunday). JPEG, MP3 esa <b>yo‘qotishli</b>: ko‘z/quloq sezmaydigan qismlarni tashlab, hajmni ancha kamaytiradi. Takror kam bo‘lsa (masalan “ABCD”), RLE hajmni oshirib yuboradi.</div>`;
    }
    inp.oninput = render;
    controls.append(h("label", { class: "ctl wide" }, h("span", {}, "Ma’lumot (piksellar qatori):"), inp), buttons(["Fon tasvir", "Matn", "Bayroq qatori"], (i) => { inp.value = ["WWWWWWWWWWWWBWWWWWWWWWWWW", "ASSALOMU ALAYKUM", "KKKKKKKKOOOOOOOOYYYYYYYY"][i]; render(); }, -1));
    render();
  };

  // =====================================================================
  // 27. Klaviatura va sichqoncha mashqi
  // =====================================================================
  W.typing = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⌨️ Klaviatura mashqi — matnni xatosiz tering");
    const LINES = p.lines || ["men informatika fanini sevaman", "kompyuter bilim olishga yordam beradi", "Shift tugmasi katta harf yozadi!", "Probel so‘zlar orasini ajratadi"];
    let k = 0, t0 = 0;
    const inp = h("input", { class: "wi-in big", "aria-label": "Matnni tering", autocomplete: "off", spellcheck: "false" });
    function render() {
      const target = LINES[k], v = inp.value;
      stage.innerHTML = `<div class="wi-type">${[...target].map((c, i) => `<span class="${i < v.length ? (v[i] === c ? "ok" : "no") : i === v.length ? "cur" : ""}">${c === " " ? "␣" : esc(c)}</span>`).join("")}</div>`;
      stage.append(inp);
      const errs = [...v].filter((c, i) => c !== target[i]).length;
      if (v.length === 1 && !t0) t0 = Date.now();
      if (v === target) {
        const sec = (Date.now() - t0) / 1000, wpm = Math.round((target.length / 5) / (sec / 60));
        out.innerHTML = `🎉 Barakalla! Tezlik: <b>${wpm}</b> so‘z/daqiqa, vaqt: ${sec.toFixed(1)} s. <button class="dbtn" type="button" data-next>Keyingi qator ▶</button>`;
        out.querySelector("[data-next]").onclick = () => { k = (k + 1) % LINES.length; inp.value = ""; t0 = 0; render(); inp.focus(); };
      } else out.innerHTML = `Xatolar: <b>${errs}</b>. <span class="muted">Backspace (⌫) — chapdagi belgini o‘chiradi. Shift + harf — katta harf. Ikki qo‘l bilan, “ASDF — JKL;” qatoridan boshlab yozing.</span>`;
    }
    inp.oninput = render;
    render();
  };

  // =====================================================================
  // 28. Ommaviy xat (Mail Merge): shablon + ma'lumotlar manbai
  // =====================================================================
  W.mailMerge = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📨 Mail Merge — bitta shablondan ko‘p shaxsiy xat");
    const rows = [["Aziza", "7-A", 92, "a’lo"], ["Bekzod", "8-B", 75, "yaxshi"], ["Malika", "8-B", 97, "a’lo"]];
    const ta = h("textarea", { class: "wi-code small", rows: 4, "aria-label": "Shablon" });
    ta.value = p.template || "Hurmatli «Ism» (« Sinf»)!\nSiz informatika olimpiadasida «Ball» ball to‘plab, «Natija» natija ko‘rsatdingiz.\nTabriklaymiz!";
    let k = 0;
    function render() {
      const r = rows[k];
      const doc = ta.value.replace(/«\s*Ism\s*»/g, `<mark>${r[0]}</mark>`).replace(/«\s*Sinf\s*»/g, `<mark>${r[1]}</mark>`).replace(/«\s*Ball\s*»/g, `<mark>${r[2]}</mark>`).replace(/«\s*Natija\s*»/g, `<mark>${r[3]}</mark>`).replace(/\n/g, "<br>");
      stage.innerHTML = `<table class="wi-db small"><caption>Ma’lumotlar manbai</caption><tr><th>Ism</th><th>Sinf</th><th>Ball</th><th>Natija</th></tr>${rows.map((x, i) => `<tr class="${i === k ? "hit" : ""}">${x.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table><div class="wi-letter">${doc}</div>`;
      out.innerHTML = `Yozuv <b>${k + 1}</b> / ${rows.length}. <span class="muted">«Maydon» — o‘zgaruvchi maydon: har bir yozuv uchun jadvaldagi qiymat qo‘yiladi. Shablonni tahrirlang — barcha xatlar birdan o‘zgaradi.</span>`;
    }
    ta.oninput = render;
    controls.append(h("label", { class: "ctl wide" }, h("span", {}, "Shablon (asosiy hujjat):"), ta), button("◀", () => { k = (k + rows.length - 1) % rows.length; render(); }, "ghost"), button("Keyingi yozuv ▶", () => { k = (k + 1) % rows.length; render(); }));
    render();
  };

  // =====================================================================
  // 29. Ikki marta kiritish / nazorat raqami (check digit, paritet)
  // =====================================================================
  W.checkDigit = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔎 Nazorat raqami va juftlik biti — xatoni avtomatik topish");
    const inp = h("input", { class: "wi-in", value: "978943601234", "aria-label": "Kod" });
    function render() {
      const d = inp.value.replace(/\D/g, "").slice(0, 12).split("").map(Number);
      const sum = d.reduce((a, x, i) => a + x * (i % 2 ? 3 : 1), 0), cd = (10 - (sum % 10)) % 10;
      const bits = (d.reduce((a, x) => a + x, 0) % 256).toString(2).padStart(8, "0");
      const ones = bits.split("").filter((b) => b === "1").length;
      stage.innerHTML = `<div class="wi-isbn">${d.map((x) => `<span>${x}</span>`).join("")}<span class="cd">${cd}</span></div><div class="wi-bits small">${bits.split("").map((b) => `<span class="${b === "1" ? "on" : ""}">${b}</span>`).join("")}<span class="cd">${ones % 2}</span></div>`;
      out.innerHTML = `ISBN-13 / shtrix-kod: og‘irliklar 1,3,1,3… → yig‘indi ${sum} → nazorat raqami <b>${cd}</b>.<br>Juftlik (paritet) biti: ${ones} ta “1” → paritet biti <b>${ones % 2}</b> (birlar soni juft bo‘lsin).<div class="muted">Bitta raqam xato kiritilsa yoki uzatishda bitta bit buzilsa — nazorat raqami mos kelmaydi va xato aniqlanadi.</div>`;
    }
    inp.oninput = render;
    controls.append(h("label", { class: "ctl wide" }, h("span", {}, "12 xonali kod:"), inp));
    render();
  };
})();
