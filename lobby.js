/* Jonli efirlar ro'yxati: ustoz doskada efir boshlasa, o'quvchilarga xabar chiqadi (kod kiritmasdan kirish).
   Kanal: Supabase Realtime "sofi-doska-lobby" (doska.js bilan bir xil), ?net=local — BroadcastChannel. */
window.SofiLobby = (() => {
  const LOCAL = /[?&]net=local\b/.test(location.search);
  const live = new Map(), subs = [];
  let started = false, send = () => {};
  const list = () => [...live.values()].sort((a, b) => a.t0 - b.t0);
  const emit = () => subs.forEach((f) => { try { f(list()); } catch (e) { /* bo'sh */ } });
  function onMsg(m) {
    if (!m || !m.code) return;
    if (m.t === "live") { const old = live.get(m.code); live.set(m.code, { code: m.code, title: m.title || "Jonli dars", n: m.n || 0, screen: !!m.screen, t0: old ? old.t0 : Date.now(), ts: Date.now() }); emit(); }
    else if (m.t === "off" && live.delete(m.code)) emit();
  }
  function start() {
    if (started) return; started = true;
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    if (!LOCAL && window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
      try {
        const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false, storageKey: "sofi-lobby" } });
        const ch = sb.channel("sofi-doska-lobby", { config: { broadcast: { self: false } } });
        ch.on("broadcast", { event: "s" }, ({ payload }) => onMsg(payload));
        send = (d) => ch.send({ type: "broadcast", event: "s", payload: d });
        ch.subscribe((s) => { if (s === "SUBSCRIBED") send({ t: "who" }); });
      } catch (e) { /* internet yo'q — xabar chiqmaydi */ }
    } else if (window.BroadcastChannel) {
      const bc = new BroadcastChannel("sofi-doska-lobby");
      bc.onmessage = (e) => onMsg(e.data); send = (d) => bc.postMessage(d); send({ t: "who" });
    }
    // 12 soniya xabar kelmasa — efir tugagan deb hisoblaymiz
    setInterval(() => { let ch = false; const now = Date.now(); for (const [k, v] of live) if (now - v.ts > 12000) { live.delete(k); ch = true; } if (ch) emit(); }, 3000);
  }
  function watch(fn) { subs.push(fn); start(); fn(list()); }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  /** Sahifa pastida suzib turuvchi "🔴 Jonli efir" xabari */
  function banner() {
    const el = document.createElement("div");
    el.className = "sofi-live-banner"; el.hidden = true;
    const css = document.createElement("style");
    css.textContent = `.sofi-live-banner{position:fixed;z-index:10000;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);display:grid;gap:6px;width:min(440px,calc(100% - 24px))}
.sofi-live-banner[hidden]{display:none}
.sofi-live-banner a{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:16px;background:linear-gradient(120deg,#7f1d1d,#1e1b4b);border:1px solid rgba(248,113,113,.7);color:#fff;text-decoration:none;font:600 14px system-ui,sans-serif;box-shadow:0 12px 34px rgba(0,0,0,.45);animation:sofiLiveIn .4s ease}
.sofi-live-banner .dot{width:11px;height:11px;flex:none;border-radius:50%;background:#ef4444;box-shadow:0 0 0 0 rgba(239,68,68,.7);animation:sofiLivePulse 1.4s infinite}
.sofi-live-banner span{flex:1;min-width:0;line-height:1.3}.sofi-live-banner small{display:block;color:#fecaca;font-weight:500;font-size:12px}
.sofi-live-banner b.go{flex:none;padding:7px 12px;border-radius:10px;background:#ef4444;color:#fff;font-size:13px}
@keyframes sofiLivePulse{70%{box-shadow:0 0 0 10px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}
@keyframes sofiLiveIn{from{opacity:0;transform:translateY(12px)}}`;
    document.head.append(css); document.body.append(el);
    const q = LOCAL ? "&net=local" : "";
    let last = "";
    const place = () => { // pastki menyu bo'lsa — uning ustida turadi
      const nav = document.getElementById("bottomNav"), r = nav && nav.getBoundingClientRect();
      el.style.bottom = r && r.height && r.top < innerHeight ? Math.round(innerHeight - r.top + 10) + "px" : "";
    };
    addEventListener("resize", place);
    const mine = () => { try { return localStorage.getItem("sofi_my_efir") || ""; } catch (e) { return ""; } };
    watch((all) => {
      const my = mine(), l = all.filter((e) => e.code !== my); // ustozning o'z efiri unga (va ulashilgan ekranga) chiqmasin
      el.hidden = !l.length; place();
      const html = l.slice(0, 3).map((e) => `<a href="doska.html?watch=${e.code}${q}"><i class="dot"></i><span>🔴 Jonli efir bo‘lyapti: <b>${esc(e.title)}</b><small>${e.screen ? "🖥 ekran ulashilmoqda · " : ""}👥 ${e.n} ko‘rmoqda · kod ${e.code}</small></span><b class="go">Kirish →</b></a>`).join("");
      if (html !== last) { last = html; el.innerHTML = html; } // faqat o'zgarganda qayta chizamiz
    });
  }
  return { watch, banner, esc };
})();
