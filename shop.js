/* Bilim do'koni: turkumlar, saralash, savat va o'quvchi yulduzlari. */
(() => {
  "use strict";

  const D = window.CENTER_DATA || {};
  const PRODUCTS = (D.products || []).map((p, i) => ({ ...p, id: i, stars: Math.max(0, Number(p.stars) || 0) }));
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const CATS = {
    "Kanselyariya": ["✏️", "#10b981", "#0f766e"],
    "Kitoblar": ["📚", "#3b82f6", "#1e3a8a"],
    "Sport": ["⚽", "#f97316", "#9a3412"],
    "Texnika": ["🎧", "#a855f7", "#4c1d95"],
    "Sovg‘alar": ["🎁", "#ec4899", "#831843"]
  };
  const catStyle = (c) => {
    const [, a, b] = CATS[c] || ["", "#22c55e", "#14532d"];
    return `--a:${a};--b:${b}`;
  };
  const BADGE = { "Top": "🔥 Top", "Yangi": "✨ Yangi", "Bosh sovrin": "👑 Bosh sovrin" };

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  let cat = "all";
  let cart = store.get("sofi_cart_v1", {});
  let likes = store.get("sofi_likes_v1", {});
  let me = store.get("sofi_shop_me_v1", null); // { name }
  let balance = null; // jami yulduzlar

  // ---------- Yulduzlar balansi ----------
  const norm = (v) => String(v || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("uz");
  let bonus = null;
  async function loadBonus() {
    if (bonus) return bonus;
    bonus = {};
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    if (!window.supabase || !cfg.SUPABASE_URL) return bonus;
    try {
      const db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false } });
      for (const table of ["question_winners", "game_stars"]) {
        const { data, error } = await db.from(table).select("student_name, stars");
        if (error) continue;
        (data || []).forEach((r) => { const k = norm(r.student_name); bonus[k] = (bonus[k] || 0) + Number(r.stars || 0); });
      }
    } catch (e) { console.warn("Yulduzlarni yuklab bo‘lmadi", e); }
    return bonus;
  }
  async function computeBalance() {
    if (!me) { balance = null; renderWallet(); render(); return; }
    const st = (D.students || []).find((s) => s.name === me.name);
    const base = Number(st && st.stars) || 0;
    balance = base;
    renderWallet();
    render();
    const b = await loadBonus();
    balance = base + (b[norm(me.name)] || 0);
    renderWallet();
    render();
  }
  function renderWallet() {
    const btn = $("#walletBtn");
    btn.innerHTML = me
      ? `⭐ <b>${balance == null ? "…" : fmt(balance)}</b><span>${esc(me.name.split(" ")[1] || me.name)}</span>`
      : `⭐ <span>Yulduzlarim</span>`;
    btn.classList.toggle("on", !!me);
  }

  // ---------- Kartalar ----------
  function progress(p) {
    if (balance == null) return "";
    const pct = Math.min(100, Math.round((balance / Math.max(1, p.stars)) * 100));
    const need = p.stars - balance;
    return `<div class="sh-prog ${need <= 0 ? "ok" : ""}"><i style="width:${pct}%"></i></div>
      <small class="sh-need">${need <= 0 ? "✅ Yulduzingiz yetadi!" : `Yana ${fmt(need)} ⭐ kerak`}</small>`;
  }
  function card(p, i) {
    const inCart = cart[p.id] || 0;
    return `
      <article class="sh-card" style="${catStyle(p.category)};--d:${Math.min(i, 12) * 50}ms" data-id="${p.id}">
        <div class="sh-img" data-open>
          ${p.badge ? `<span class="sh-badge b-${esc(p.badge).replace(/\s/g, "")}">${BADGE[p.badge] || esc(p.badge)}</span>` : ""}
          <button class="sh-like ${likes[p.id] ? "on" : ""}" data-like aria-label="Yoqtirish">${likes[p.id] ? "❤️" : "🤍"}</button>
          <span class="sh-emoji">${esc(p.icon || "🎁")}</span>
        </div>
        <div class="sh-info">
          <small class="sh-cat">${esc(p.category)}</small>
          <h3 data-open>${esc(p.name)}</h3>
          <div class="sh-price"><span>⭐</span>${fmt(p.stars)}</div>
          ${progress(p)}
          <button class="sh-add ${inCart ? "in" : ""}" data-add>${inCart ? `✓ Savatda (${inCart})` : "🛒 Savatga"}</button>
        </div>
      </article>`;
  }

  function list() {
    const q = $("#productSearch").value.trim().toLowerCase();
    const sort = $("#sortSelect").value;
    let items = PRODUCTS.filter((p) => (cat === "all" || (cat === "liked" ? likes[p.id] : p.category === cat))
      && `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q));
    const rank = (p) => ({ "Bosh sovrin": 0, "Top": 1, "Yangi": 2 })[p.badge] ?? 3;
    if (sort === "cheap") items.sort((a, b) => a.stars - b.stars);
    else if (sort === "expensive") items.sort((a, b) => b.stars - a.stars);
    else if (sort === "afford") {
      if (balance == null) { askName(); $("#sortSelect").value = "popular"; }
      else items = items.filter((p) => p.stars <= balance).sort((a, b) => b.stars - a.stars);
    } else items.sort((a, b) => rank(a) - rank(b));
    return items;
  }

  function render() {
    const items = list();
    $("#shopGrid").innerHTML = items.map(card).join("") || `<p class="sh-empty">Hech narsa topilmadi 🙁</p>`;
    $("#shopStatus").textContent = `${items.length} ta mahsulot`;
    renderCartCount();
  }

  function renderCats() {
    const counts = {};
    PRODUCTS.forEach((p) => (counts[p.category] = (counts[p.category] || 0) + 1));
    const chips = [["all", "🛍️", "Hammasi", PRODUCTS.length], ...Object.keys(CATS).filter((c) => counts[c]).map((c) => [c, CATS[c][0], c, counts[c]]), ["liked", "❤️", "Yoqqanlar", ""]];
    $("#cats").innerHTML = chips.map(([id, ic, label, n]) => `<button class="sh-chip ${cat === id ? "on" : ""}" data-cat="${esc(id)}"><span>${ic}</span>${esc(label)}${n !== "" ? `<small>${n}</small>` : ""}</button>`).join("");
  }

  // ---------- Reklama slayderi ----------
  function renderSlides() {
    const prize = PRODUCTS.filter((p) => p.badge === "Bosh sovrin").sort((a, b) => a.stars - b.stars)[0];
    const fresh = PRODUCTS.find((p) => p.badge === "Yangi");
    const top = PRODUCTS.find((p) => p.badge === "Top");
    const slides = [
      prize && { cls: "s1", kicker: "👑 Bosh sovrin", title: prize.name, text: `${fmt(prize.stars)} yulduz to‘plang — u sizniki!`, icon: prize.icon, id: prize.id },
      fresh && { cls: "s2", kicker: "✨ Yangi keldi", title: fresh.name, text: fresh.description, icon: fresh.icon, id: fresh.id },
      top && { cls: "s3", kicker: "🔥 Eng ko‘p tanlanadi", title: top.name, text: `${fmt(top.stars)} ⭐ evaziga`, icon: top.icon, id: top.id },
      { cls: "s4", kicker: "🎮 Yulduz yig‘ing", title: "O‘yinlarda yutib, yulduz oling", text: "Har o‘yindan kuniga 2 ⭐ gacha", icon: "🏆", href: "games.html" }
    ].filter(Boolean);
    $("#slides").innerHTML = slides.map((s) => `
      <div class="sh-slide ${s.cls}">
        <div><span class="sh-kicker">${s.kicker}</span><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p>
          ${s.href ? `<a class="sh-cta" href="${s.href}">O‘ynash →</a>` : `<button class="sh-cta" data-show="${s.id}">Ko‘rish →</button>`}</div>
        <span class="sh-slide-art">${s.icon}</span>
      </div>`).join("");
    $("#dots").innerHTML = slides.map((_, i) => `<button data-dot="${i}" aria-label="${i + 1}-slayd"></button>`).join("");
    const box = $("#slides");
    const sync = () => {
      const i = Math.round(box.scrollLeft / box.clientWidth);
      [...$("#dots").children].forEach((d, j) => d.classList.toggle("on", i === j));
    };
    box.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    $("#dots").addEventListener("click", (e) => { const d = e.target.closest("[data-dot]"); if (d) box.scrollTo({ left: d.dataset.dot * box.clientWidth, behavior: "smooth" }); });
    let paused = false;
    box.addEventListener("pointerdown", () => (paused = true));
    setInterval(() => {
      if (paused || document.hidden) return;
      const i = Math.round(box.scrollLeft / box.clientWidth);
      box.scrollTo({ left: ((i + 1) % slides.length) * box.clientWidth, behavior: "smooth" });
    }, 4500);
    sync();
  }

  // ---------- Pastdan chiquvchi oyna ----------
  function openSheet(html) {
    const sh = $("#sheet");
    sh.innerHTML = `<div class="sh-sheet-card" role="dialog"><button class="sh-x" data-close aria-label="Yopish">✕</button>${html}</div>`;
    sh.hidden = false;
    requestAnimationFrame(() => sh.classList.add("open"));
    document.body.classList.add("sh-lock");
  }
  function closeSheet() {
    const sh = $("#sheet");
    sh.classList.remove("open");
    document.body.classList.remove("sh-lock");
    setTimeout(() => { if (!sh.classList.contains("open")) { sh.hidden = true; sh.innerHTML = ""; } }, 280);
  }

  function showProduct(id) {
    const p = PRODUCTS[id];
    openSheet(`
      <div class="sh-detail" style="${catStyle(p.category)}">
        <div class="sh-detail-img">${p.badge ? `<span class="sh-badge b-${p.badge.replace(/\s/g, "")}">${BADGE[p.badge] || p.badge}</span>` : ""}<span class="sh-emoji">${esc(p.icon)}</span></div>
        <small class="sh-cat">${esc(p.category)}</small>
        <h2>${esc(p.name)}</h2>
        <p>${esc(p.description)}</p>
        <div class="sh-price big"><span>⭐</span>${fmt(p.stars)} <small>yulduz</small></div>
        ${progress(p) || `<button class="sh-link" data-wallet>⭐ Ismingizni tanlab, yulduzlaringizni ko‘ring</button>`}
        <button class="sh-add wide" data-add="${p.id}">🛒 Savatga qo‘shish</button>
      </div>`);
  }

  function askName() {
    const groups = {};
    (D.students || []).forEach((s) => (groups[s.group] = groups[s.group] || []).push(s.name));
    openSheet(`
      <h2 class="sh-sheet-title">⭐ Ismingizni tanlang</h2>
      <p class="sh-muted">Yulduzlaringiz reytingdagi ma’lumotlardan hisoblanadi.</p>
      <input class="sh-name-search" type="search" placeholder="🔎 Ism qidirish..." aria-label="Ism qidirish">
      <div class="sh-names">${Object.entries(groups).map(([g, names]) => `<h4>${esc(g)}</h4>${names.map((n) => `<button data-name="${esc(n)}">${esc(n)}</button>`).join("")}`).join("")}</div>
      ${me ? `<button class="sh-link" data-logout>Chiqish (${esc(me.name)})</button>` : ""}`);
    const input = $(".sh-name-search");
    input.addEventListener("input", () => {
      const q = input.value.toLowerCase();
      document.querySelectorAll(".sh-names button").forEach((b) => (b.hidden = !b.textContent.toLowerCase().includes(q)));
    });
  }

  // ---------- Savat ----------
  function renderCartCount() {
    const n = Object.values(cart).reduce((a, b) => a + b, 0);
    const el = $("#cartCount");
    el.hidden = !n;
    el.textContent = n;
  }
  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    store.set("sofi_cart_v1", cart);
    toast(`🛒 “${PRODUCTS[id].name}” savatga qo‘shildi`);
    const btn = $("#cartBtn");
    btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    render();
  }
  function showCart() {
    const rows = Object.entries(cart).filter(([, q]) => q > 0);
    const total = rows.reduce((s, [id, q]) => s + PRODUCTS[id].stars * q, 0);
    if (!rows.length) {
      openSheet(`<div class="sh-empty-cart"><span>🛒</span><h2>Savat bo‘sh</h2><p class="sh-muted">Yoqqan sovg‘alarni savatga qo‘shing.</p><button class="sh-add wide" data-close>Xarid qilish</button></div>`);
      return;
    }
    const ok = balance == null ? null : balance >= total;
    openSheet(`
      <h2 class="sh-sheet-title">🛒 Savatingiz</h2>
      <div class="sh-cart">${rows.map(([id, q]) => { const p = PRODUCTS[id]; return `
        <div class="sh-cart-row" style="${catStyle(p.category)}">
          <span class="sh-cart-img">${esc(p.icon)}</span>
          <div><b>${esc(p.name)}</b><small>⭐ ${fmt(p.stars)}</small></div>
          <div class="sh-qty"><button data-dec="${id}" aria-label="Kamaytirish">−</button><b>${q}</b><button data-inc="${id}" aria-label="Ko‘paytirish">+</button></div>
        </div>`; }).join("")}</div>
      <div class="sh-total"><span>Jami</span><b>⭐ ${fmt(total)}</b></div>
      ${ok === null ? `<button class="sh-link" data-wallet>⭐ Yulduzim yetadimi? Ismni tanlang</button>`
        : ok ? `<p class="sh-ok">✅ Yulduzingiz yetadi (sizda ${fmt(balance)} ⭐)</p>` : `<p class="sh-bad">Yana ${fmt(total - balance)} ⭐ kerak (sizda ${fmt(balance)} ⭐)</p>`}
      <button class="sh-add wide" data-order>✈️ Telegram orqali buyurtma berish</button>
      <a class="sh-link" href="tel:${esc(D.phone || "+998990616472")}">📞 Yoki qo‘ng‘iroq qiling</a>`);
  }
  function order() {
    const rows = Object.entries(cart).filter(([, q]) => q > 0);
    const total = rows.reduce((s, [id, q]) => s + PRODUCTS[id].stars * q, 0);
    const text = `Assalomu alaykum! Bilim do‘konidan buyurtma:\n${rows.map(([id, q]) => `• ${PRODUCTS[id].name} × ${q} — ${PRODUCTS[id].stars * q} ⭐`).join("\n")}\nJami: ${total} ⭐${me ? `\nO‘quvchi: ${me.name}` : ""}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(location.origin + location.pathname)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  }

  let toastTimer;
  function toast(t) {
    const el = $("#toast");
    el.textContent = t;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  // ---------- Hodisalar ----------
  document.addEventListener("click", (e) => {
    const t = e.target;
    const cardEl = t.closest(".sh-card");
    if (t.closest("[data-like]") && cardEl) {
      const id = cardEl.dataset.id;
      likes[id] = !likes[id];
      store.set("sofi_likes_v1", likes);
      render();
      return;
    }
    if (t.closest("[data-add]")) {
      const b = t.closest("[data-add]");
      addToCart(Number(b.dataset.add !== "" && b.dataset.add !== undefined ? b.dataset.add : cardEl.dataset.id));
      if (b.classList.contains("wide")) closeSheet();
      return;
    }
    if (t.closest("[data-open]") && cardEl) { showProduct(Number(cardEl.dataset.id)); return; }
    const show = t.closest("[data-show]");
    if (show) { showProduct(Number(show.dataset.show)); return; }
    const chip = t.closest("[data-cat]");
    if (chip) { cat = chip.dataset.cat; renderCats(); render(); return; }
    if (t.closest("#cartBtn")) { showCart(); return; }
    if (t.closest("#walletBtn") || t.closest("[data-wallet]")) { askName(); return; }
    const nm = t.closest("[data-name]");
    if (nm) { me = { name: nm.dataset.name }; store.set("sofi_shop_me_v1", me); closeSheet(); computeBalance(); toast(`Salom, ${me.name}! 👋`); return; }
    if (t.closest("[data-logout]")) { me = null; store.set("sofi_shop_me_v1", null); closeSheet(); computeBalance(); return; }
    const inc = t.closest("[data-inc]"), dec = t.closest("[data-dec]");
    if (inc || dec) {
      const id = (inc || dec).dataset[inc ? "inc" : "dec"];
      cart[id] = Math.max(0, (cart[id] || 0) + (inc ? 1 : -1));
      if (!cart[id]) delete cart[id];
      store.set("sofi_cart_v1", cart);
      render();
      showCart();
      return;
    }
    if (t.closest("[data-order]")) { order(); return; }
    if (t.closest("[data-close]") || t.id === "sheet") closeSheet();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });
  $("#productSearch").addEventListener("input", render);
  $("#sortSelect").addEventListener("change", render);

  renderSlides();
  renderCats();
  renderWallet();
  render();
  computeBalance();
})();
