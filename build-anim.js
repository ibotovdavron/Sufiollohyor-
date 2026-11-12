/* “Sahifa quriladi” animatsiyasi — barcha sahifalarda, har bir sahifaga o'tganda:
   ko'k chizma, uchqunlar, o'lchov chiziqlari, kulrang bloklar o'z joyiga tushib haqiqiy elementga aylanadi.
   Bosish, tugma yoki klaviatura bilan o'tkazib yuboriladi. ?build=0 — o'chirilgan holda ochish. */
(() => {
  "use strict";
  if (/[?&]build=0/.test(location.search) || window.top !== window) return;
  const root = document.documentElement;

  const css = document.createElement("style");
  css.textContent = `
  html.sb-pre body > main, html.sb-pre body > header, html.sb-pre body > footer, html.sb-pre .bottom-nav { opacity: 0; }
  body.sb-on { overflow: hidden; }
  body.sb-on .sb-t { opacity: 0; }
  body.sb-on .sb-c { background: transparent !important; border-color: transparent !important; box-shadow: none !important; backdrop-filter: none !important; }
  body.sb-on .sb-c::before, body.sb-on .sb-c::after { opacity: 0 !important; }
  .sb-c { transition: background-color .5s, border-color .5s, box-shadow .5s; }
  .sb-t.sb-in { opacity: 1 !important; animation: sbIn .5s cubic-bezier(.2,.9,.3,1) both; }
  @keyframes sbIn { 0% { opacity: 0; filter: saturate(0) brightness(1.6) blur(3px); clip-path: inset(0 100% 0 0); } 60% { opacity: 1; filter: saturate(.4) brightness(1.2); } 100% { opacity: 1; filter: none; clip-path: inset(0 0 0 0); } }
  .sb-bg { position: fixed; inset: 0; z-index: 1; pointer-events: none; transition: opacity .6s ease;
    background-color: #0b3c99;
    background-image: linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px),
      linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px),
      radial-gradient(circle at 50% 40%, #1452c4, #082c74 75%);
    background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px, 100% 100%; }
  .sb-fx { position: fixed; inset: 0; z-index: 2147483000; pointer-events: none; overflow: hidden; transition: opacity .45s ease; font: 700 10px/1 ui-monospace, Menlo, monospace; }
  .sb-p { position: absolute; width: 4px; height: 4px; margin: -2px; border-radius: 50%; background: #fff; box-shadow: 0 0 8px 2px rgba(160,210,255,.9); }
  .sb-p.r { background: #ff8a8a; box-shadow: 0 0 8px 2px rgba(255,120,120,.8); }
  .sb-gh { position: absolute; left: 0; top: 0; background: rgba(205,214,230,.35); border: 1.5px solid #7fb2ff; box-shadow: 0 0 0 1px rgba(255,255,255,.15) inset;
    transition: transform .55s cubic-bezier(.2,.9,.25,1.05), opacity .3s ease, background .3s; }
  .sb-gh::before, .sb-gh::after, .sb-gh i { content: ""; position: absolute; width: 7px; height: 7px; background: #fff; border: 1.5px solid #3d8bff; }
  .sb-gh::before { left: -4px; top: -4px; } .sb-gh::after { right: -4px; bottom: -4px; } .sb-gh i.a { right: -4px; top: -4px; } .sb-gh i.b { left: -4px; bottom: -4px; }
  .sb-gh b { position: absolute; left: 50%; bottom: -17px; transform: translateX(-50%); padding: 2px 5px; border-radius: 3px; background: #2f7bff; color: #fff; white-space: nowrap; }
  .sb-gh.done { background: rgba(255,255,255,0); border-color: rgba(127,178,255,.35); } .sb-gh.gone { opacity: 0; }
  .sb-lh, .sb-lv { position: absolute; background: #ff5a5a; opacity: .85; transition: transform .4s ease, opacity .45s ease; }
  .sb-lh { left: 0; right: 0; height: 1px; transform: scaleX(0); transform-origin: left; } .sb-lv { top: 0; bottom: 0; width: 1px; transform: scaleY(0); transform-origin: top; }
  .sb-lh.b, .sb-lv.b { background: #8ec5ff; }
  .sb-lh.on { transform: scaleX(1); } .sb-lv.on { transform: scaleY(1); } .sb-lh.off, .sb-lv.off { opacity: 0; }
  .sb-skip { position: fixed; z-index: 2147483001; right: 14px; bottom: 96px; padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,.35); background: rgba(8,30,80,.6); color: #fff; font: 700 13px Inter, system-ui, sans-serif; cursor: pointer; }
  .sb-tag { position: fixed; z-index: 2147483001; left: 50%; top: 16%; transform: translateX(-50%); color: #cfe3ff; font: 800 12px/1.2 ui-monospace, Menlo, monospace; letter-spacing: .2em; text-shadow: 0 0 10px #3d8bff; white-space: nowrap; transition: opacity .4s; pointer-events: none; }`;
  document.head.append(css);
  root.classList.add("sb-pre");
  const failSafe = setTimeout(() => root.classList.remove("sb-pre"), 4000);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rnd = (a, b) => a + Math.random() * (b - a);

  const shells = [], decor = []; // decor: matnsiz bezaklar (fon dog'lari) — chizmasiz, oxirida paydo bo'ladi
  const decorative = (el) => {
    const pos = getComputedStyle(el).position;
    return (pos === "absolute" || pos === "fixed") && !el.textContent.trim() && !el.querySelector("img, svg, canvas, video, input, button") && !/^(IMG|SVG|CANVAS|VIDEO)$/i.test(el.tagName);
  }; // bo'lingan konteynerlar: animatsiya paytida foni shaffof
  /** Ekranda ko'rinib turgan bloklar: katta konteynerlar ichidagi kartalarga bo'linadi */
  function blocks() {
    const H = innerHeight, out = [];
    shells.length = 0; decor.length = 0;
    const vis = (el) => {
      const r = el.getBoundingClientRect();
      if (!(r.width > 10 && r.height > 6 && r.bottom > 0 && r.top < H)) return false;
      const cs = getComputedStyle(el); return cs.display !== "none" && cs.visibility !== "hidden";
    };
    const split = (el, depth) => {
      if (out.length >= 28 || !vis(el)) return;
      const kids = [...el.children].filter((k) => !/^(SCRIPT|STYLE|TEMPLATE|BR)$/.test(k.tagName) && vis(k));
      const h = el.getBoundingClientRect().height;
      if (depth < 5 && kids.length && ((kids.length >= 2 && (h > H * 0.3 || kids.length >= 3)) || h > H * 0.5)) { shells.push(el); kids.forEach((k) => split(k, depth + 1)); }
      else if (decorative(el)) decor.push(el);
      else out.push(el);
    };
    const hdr = document.querySelector("body > header"); if (hdr && vis(hdr)) out.push(hdr);
    const main = document.querySelector("body > main") || document.querySelector("main");
    if (main) { shells.push(main); [...main.children].forEach((k) => split(k, 0)); }
    const nav = document.querySelector(".bottom-nav"); if (nav && vis(nav)) out.push(nav);
    return out;
  }

  let running = false;
  async function run() {
    if (running) return; running = true;
    // ma'lumoti keyin chiziladigan sahifalar (masalan, do'kon kartalari)
    for (let i = 0; i < 30 && document.getElementById("shopGrid") && !document.querySelector("#shopGrid .sh-card"); i++) await wait(50);
    const W = innerWidth, H = innerHeight;
    const all = blocks();
    if (all.length < 2) { root.classList.remove("sb-pre"); running = false; return; }
    const layers = [document.querySelector("body > header"), document.querySelector("body > main"), document.querySelector("body > footer")].filter(Boolean);
    const restore = layers.map((el) => [el, el.style.position, el.style.zIndex]);
    layers.forEach((el) => { if (getComputedStyle(el).position === "static") el.style.position = "relative"; el.style.zIndex = "2"; });
    const dec = decor.slice();
    [...all, ...dec].forEach((el) => el.classList.add("sb-t"));
    const sh = shells.slice(); sh.forEach((el) => el.classList.add("sb-c"));
    document.body.classList.add("sb-on");
    root.classList.remove("sb-pre"); clearTimeout(failSafe);

    const bg = document.createElement("div"); bg.className = "sb-bg"; document.body.append(bg);
    const fx = document.createElement("div"); fx.className = "sb-fx"; document.body.append(fx);
    const tag = document.createElement("div"); tag.className = "sb-tag";
    tag.textContent = "BUILDING · " + (document.title.split(/[—|·-]/)[0].trim().toUpperCase().slice(0, 28) || "SO‘FI OLLOHYOR"); document.body.append(tag);
    const skip = document.createElement("button"); skip.className = "sb-skip"; skip.type = "button"; skip.textContent = "O‘tkazib yuborish ⏭"; document.body.append(skip);
    let stop = false;
    const finish = () => {
      if (stop) return; stop = true;
      [...all, ...dec].forEach((el) => el.classList.add("sb-in"));
      bg.style.opacity = "0"; fx.style.opacity = "0"; tag.style.opacity = "0"; skip.remove();
      document.removeEventListener("pointerdown", onDown, true); document.removeEventListener("keydown", finish);
      setTimeout(() => {
        bg.remove(); fx.remove(); tag.remove(); document.body.classList.remove("sb-on");
        [...all, ...dec].forEach((el) => el.classList.remove("sb-t", "sb-in")); sh.forEach((el) => el.classList.remove("sb-c"));
        restore.forEach(([el, p, z]) => { el.style.position = p; el.style.zIndex = z; });
        running = false;
      }, 650);
    };
    // istalgan joyga bosish animatsiyani to'xtatadi (bosilgan tugma ham ishlayveradi)
    const onDown = () => finish();
    skip.onclick = finish;
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", finish);

    // 1) uchqunlar markazga uchadi
    const parts = [];
    for (let i = 0; i < 24; i++) {
      const p = document.createElement("i"); p.className = "sb-p" + (i % 5 === 0 ? " r" : "");
      p.style.left = rnd(0, W) + "px"; p.style.top = rnd(0, H) + "px"; p.style.transition = `transform ${rnd(0.4, 0.7)}s cubic-bezier(.3,.8,.3,1), opacity .4s`;
      fx.append(p); parts.push(p);
    }
    await wait(30);
    parts.forEach((p) => { const x = parseFloat(p.style.left), y = parseFloat(p.style.top); p.style.transform = `translate(${W / 2 + rnd(-90, 90) - x}px, ${H * 0.42 + rnd(-60, 60) - y}px)`; });
    await wait(330); if (stop) return;

    // 2) o'lchov chiziqlari va bloklar
    const line = (cls, pos, key) => { const l = document.createElement("i"); l.className = cls; l.style[key] = pos + "px"; fx.append(l); requestAnimationFrame(() => l.classList.add("on")); return l; };
    const lines = [];
    const step = Math.max(30, Math.min(90, 950 / all.length));
    for (let k = 0; k < all.length; k++) {
      if (stop) return;
      const el = all[k], r = el.getBoundingClientRect();
      if (k < 12) lines.push(line("sb-lh" + (k % 2 ? " b" : ""), r.top, "top"), line("sb-lv" + (k % 2 ? "" : " b"), r.left, "left"));
      const gh = document.createElement("div"); gh.className = "sb-gh";
      gh.innerHTML = `<i class="a"></i><i class="b"></i>${r.width > 60 && r.height > 24 ? `<b>${Math.round(r.width)} × ${Math.round(r.height)}</b>` : ""}`;
      gh.style.width = r.width + "px"; gh.style.height = r.height + "px";
      const pr = parts[k % parts.length].getBoundingClientRect();
      gh.style.transform = `translate(${pr.left - r.width / 2}px, ${pr.top - r.height / 2}px) scale(.15) rotate(${rnd(-14, 14)}deg)`;
      fx.append(gh);
      parts[k % parts.length].style.opacity = "0";
      requestAnimationFrame(() => requestAnimationFrame(() => { gh.style.transform = `translate(${r.left}px, ${r.top}px)`; }));
      setTimeout(() => { if (stop) return; el.classList.add("sb-in"); gh.classList.add("done"); setTimeout(() => gh.classList.add("gone"), 350); setTimeout(() => gh.remove(), 800); }, 360);
      await wait(step);
    }
    await wait(380);
    lines.forEach((l) => l.classList.add("off"));
    parts.forEach((p) => (p.style.opacity = "0"));
    await wait(180);
    finish();
  }

  const start = () => setTimeout(run, 40);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  // “Orqaga” tugmasi bilan qaytilganda ham (brauzer keshidan) qayta quriladi
  addEventListener("pageshow", (e) => { if (e.persisted) { root.classList.add("sb-pre"); start(); } });
})();
