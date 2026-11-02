(() => {
  "use strict";

  const D = window.CENTER_DATA || {};

  // Pastki menyu
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a4 4 0 0 1-4 4M7 5H4v2a4 4 0 0 0 4 4"/>',
    cap: '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    game: '<rect x="2" y="7" width="20" height="12" rx="6"/><path d="M7 11v4M5 13h4"/><circle cx="16" cy="12" r="1.2" fill="currentColor"/><circle cx="18.5" cy="14.5" r="1.2" fill="currentColor"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/>',
    bag: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    question: '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>'
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  // [manzil, ikonka, nom, telefondagi qisqa nom]
  const pages = [
    ["index.html", "home", "Bosh sahifa", "Asosiy"],
    ["competitions.html", "trophy", "Musobaqalar", "Tanlov"],
    ["teachers.html", "cap", "Ustozlar", "Ustozlar"],
    ["ranking.html", "chart", "Reyting", "Reyting"],
    ["games.html", "game", "O‘yinlar", "O‘yinlar"],
    ["kurslar.html", "book", "Kurslar", "Kurslar"],
    ["shop.html", "bag", "Do‘kon", "Do‘kon"],
    ["amaliy.html", "flask", "Amaliy dars", "Amaliy"],
    ["profile.html", "user", "Profil", "Profil"],
    ["contact.html", "phone", "Aloqa", "Aloqa"]
  ];

  const path =
    location.pathname.split("/").pop() || "index.html";

  const nav = document.getElementById("bottomNav");

  if (nav) {
    nav.innerHTML = `
      <div class="nav-bar">
        ${pages.map(([url, ic, label, short]) => `
          <a
            class="navitem ${url === "games.html" ? "play" : ""} ${path === url ? "active" : ""}"
            href="${url}"
            aria-label="${label}"
            ${path === url ? 'aria-current="page"' : ""}
          >
            <span class="navicon">${icon(ic)}</span>
            <span class="navlabel"><span class="lg">${label}</span><span class="sm">${short}</span></span>
          </a>
        `).join("")}
      </div>`;
  }

  // Xavfsiz matn chiqarish
  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  // Markaz haqidagi ma'lumotlar
  document.querySelectorAll("[data-center]").forEach((el) => {
    const key = el.dataset.center;

    if (D[key] !== undefined) {
      el.textContent = D[key];
    }
  });

  // Bosh sahifadagi fanlar
  const subjects = document.getElementById("homeSubjects");

  if (subjects) {
    subjects.innerHTML = (D.subjects || []).map((s) => `
      <div class="subject">
        <span class="emoji">${esc(s.icon)}</span>
        <div>
          <b>${esc(s.name)}</b>
          <small>${esc(s.caption)}</small>
        </div>
      </div>
    `).join("");
  }

  // Bosh sahifa kartalari
  // Natijalar o'rniga Bilmasvoy
  const features = [
    [
      "competitions.html",
      "🏆",
      "Musobaqalar",
      "Bilimdonlar bellashuvi"
    ],
    [
      "ranking.html",
      "📊",
      "Reyting",
      "O‘quvchilar natijalari"
    ],
    [
      "teachers.html",
      "🧑‍🏫",
      "Ustozlar",
      "Tajribali va malakali"
    ],
    [
      "bilmasvoy.html",
      "🎮",
      "Bilmasvoy",
      "Bilimlar sarguzashti"
    ],
    [
      "kurslar.html",
      "📚",
      "Kurslar",
      "Narxlar va dars vaqtlari"
    ],
    [
      "shop.html",
      "🛍️",
      "Do‘kon",
      "Kitob, daftar va o‘quv qurollari"
    ]
  ];

  const homeFeatures = document.getElementById("homeFeatures");

  if (homeFeatures) {
    homeFeatures.innerHTML = features.map(
      ([href, icon, title, desc]) => `
        <a class="card" href="${href}">
          <div class="card-visual">${icon}</div>
          <div class="card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
            <span class="green">Ochish →</span>
          </div>
        </a>
      `
    ).join("");
  }

  // Reyting uchun o'quvchilarni saralash
  const getSortedStudents = () =>
    (D.students || []).slice().sort(
      (a, b) => (Number(b.stars) || 0) - (Number(a.stars) || 0)
    );

  // Bosh sahifadagi TOP 5
  const rankPreview = document.getElementById("rankPreview");

  if (rankPreview) {
    rankPreview.innerHTML = getSortedStudents()
      .slice(0, 5)
      .map((s, i) => `
        <div class="result-row">
          <div>
            <b>
              <span class="ranknum">${i + 1}.</span>
              ${esc(s.name)}
            </b>
            <div class="smallprint">${esc(s.group)}</div>
          </div>
          <strong class="stars">
            ⭐ ${Number(s.stars) || 0}
          </strong>
        </div>
      `).join("");
  }

  // Musobaqalar
  const comps = document.getElementById("competitionGrid");

  if (comps) {
    comps.innerHTML = (D.competitions || []).map((c) => `
      <article class="competition-card">
        <div class="avatar">${esc(c.icon)}</div>
        <span class="tag">${esc(c.status)}</span>
        <h3>${esc(c.name)}</h3>
        <b>${esc(c.type)}</b>
        <p class="muted">${esc(c.description)}</p>
      </article>
    `).join("");
  }

  // Ustozlar
  const teachers = document.getElementById("teacherGrid");

  if (teachers) {
    teachers.innerHTML = (D.teachers || []).map((t) => `
      <article class="teacher-card">
        <div class="avatar">${esc(t.icon || "🎓")}</div>
        <span class="tag">${esc(t.subject)}</span>
        <h3>${esc(t.name)}</h3>
        <p class="muted">${esc(t.bio)}</p>
      </article>
    `).join("");
  }

  // To'liq reyting jadvali
  const ranking = document.getElementById("rankingRows");

  if (ranking) {
    ranking.innerHTML = getSortedStudents().map((s, i) => `
      <tr>
        <td class="ranknum">${i + 1}</td>
        <td>${esc(s.name)}</td>
        <td>${esc(s.group)}</td>
        <td class="stars">⭐ ${Number(s.stars) || 0}</td>
        <td>${esc(s.result)}</td>
      </tr>
    `).join("");
  }

  // Natijalar ro'yxati (agar alohida sahifada ishlatilsa)
  const results = document.getElementById("resultsList");

  if (results) {
    results.innerHTML = getSortedStudents().map((s) => `
      <div class="result-row">
        <div>
          <b>${esc(s.name)}</b>
          <div class="smallprint">
            ${esc(s.group)} · ${esc(s.result)}
          </div>
        </div>
        <strong class="stars">
          ⭐ ${Number(s.stars) || 0}
        </strong>
      </div>
    `).join("");
  }

  // Yulduz berish qoidalari
  const rules = document.getElementById("starRules");

  if (rules) {
    rules.innerHTML = (D.starRules || []).map((r) => `
      <div class="result-row">
        <span>${esc(r.title)}</span>
        <b class="stars">+${Number(r.stars) || 0} ⭐</b>
      </div>
    `).join("");
  }

  // O'quvchilarni qidirish
  const search = document.getElementById("studentSearch");

  if (search && ranking) {
    search.addEventListener("input", () => {
      const q = search.value.toLowerCase().trim();

      ranking.querySelectorAll("tr").forEach((row) => {
        row.classList.toggle(
          "hidden",
          !row.textContent.toLowerCase().includes(q)
        );
      });
    });
  }

  // Musobaqalarni qidirish
  const compSearch = document.getElementById("competitionSearch");

  if (compSearch && comps) {
    compSearch.addEventListener("input", () => {
      const q = compSearch.value.toLowerCase().trim();

      [...comps.children].forEach((card) => {
        card.classList.toggle(
          "hidden",
          !card.textContent.toLowerCase().includes(q)
        );
      });
    });
  }

  // Ustozlarni qidirish
  const teacherSearch = document.getElementById("teacherSearch");

  if (teacherSearch && teachers) {
    teacherSearch.addEventListener("input", () => {
      const q = teacherSearch.value.toLowerCase().trim();

      [...teachers.children].forEach((card) => {
        card.classList.toggle(
          "hidden",
          !card.textContent.toLowerCase().includes(q)
        );
      });
    });
  }

  // Telefon raqami
  document.querySelectorAll("[data-phone]").forEach((el) => {
    el.href = "tel:" + String(D.phone || "").replace(/\s/g, "");
  });

  // Telegram
  document.querySelectorAll("[data-telegram]").forEach((el) => {
    el.href =
      D.telegram || "https://t.me/sufi_ollohyor_uquv_markaz";
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  // Instagram
  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.href =
      D.instagram || "https://www.instagram.com/sufiollohyor/";
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  // Raqamlarni sanab chiqish animatsiyasi
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(D[el.dataset.count] ?? el.textContent) || 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = target;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1200);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // Sahifa sarlavhasini bezash
  const head = document.querySelector(".pagehead");
  if (head && !head.querySelector(".pagehead-art")) {
    const eyebrow = head.querySelector(".eyebrow");
    const icon = eyebrow ? [...eyebrow.textContent.trim()][0] : "✨";
    head.insertAdjacentHTML("beforeend", `
      <div class="pagehead-art" aria-hidden="true">
        <span class="ph-ring"></span>
        <span class="ph-icon">${esc(icon)}</span>
        <span class="ph-dot d1"></span><span class="ph-dot d2"></span><span class="ph-dot d3"></span>
      </div>`);
  }

  // Ekranga chiqqanda paydo bo'lish animatsiyasi
  const revealSel = [
    ".panel", ".stat", ".subject", ".card", ".value", ".competition-card",
    ".teacher-card", ".product-card", ".result-row", ".g-rules > div",
    ".contact-item", ".shop-card", ".daily-card", ".daily-intro", "tbody tr"
  ].join(",");
  const revealAll = () => {
    const items = [...document.querySelectorAll(revealSel)].filter((el) => !el.classList.contains("reveal") && !el.closest("#amaliyApp, .g-stage, .g-modal"));
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    items.forEach((el) => {
      const siblings = el.parentElement ? [...el.parentElement.children] : [];
      el.style.setProperty("--i", Math.min(siblings.indexOf(el), 8));
      el.classList.add("reveal");
      io.observe(el);
    });
  };
  revealAll();
  // Keyinroq chiziladigan kartalar uchun (masalan, reyting Supabase'dan kelganda)
  new MutationObserver(() => {
    clearTimeout(revealAll.t);
    revealAll.t = setTimeout(revealAll, 60);
  }).observe(document.body, { childList: true, subtree: true });

  // Matematika Telegram kanali
  document.querySelectorAll("[data-math-telegram]").forEach((el) => {
    el.href =
      D.mathTelegram || "https://t.me/matematika144";
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });


  // ===== Ilova (PWA): telefonga o'rnatish =====
  (() => {
    const head = document.head;
    const addLink = (rel, href, extra = {}) => {
      if (head.querySelector(`link[rel="${rel}"]`)) return;
      const l = document.createElement("link");
      l.rel = rel; l.href = href;
      Object.entries(extra).forEach(([k, v]) => l.setAttribute(k, v));
      head.appendChild(l);
    };
    addLink("manifest", "manifest.webmanifest");
    addLink("apple-touch-icon", "assets/icons/apple-touch-icon.png");
    [["apple-mobile-web-app-capable", "yes"], ["mobile-web-app-capable", "yes"],
     ["apple-mobile-web-app-title", "So‘fi Ollohyor"], ["apple-mobile-web-app-status-bar-style", "black-translucent"]]
      .forEach(([n, c]) => { if (!head.querySelector(`meta[name="${n}"]`)) { const m = document.createElement("meta"); m.name = n; m.content = c; head.appendChild(m); } });

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
    }

    const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    if (standalone) { document.documentElement.classList.add("is-app"); return; }

    const store = {
      get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
      set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* bo'sh */ } }
    };
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let deferred = null;

    const css = document.createElement("style");
    css.textContent = `
      .pwa-pill{position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom));z-index:1100;transform:translate(-50%,20px);opacity:0;
        display:flex;align-items:center;gap:10px;padding:8px 8px 8px 10px;border-radius:999px;max-width:calc(100% - 32px);
        background:linear-gradient(135deg,#0f2a22,#0b1d33);border:1px solid rgba(245,200,76,.5);box-shadow:0 14px 40px rgba(0,0,0,.5);
        color:#fff;font:600 .9rem system-ui,sans-serif;transition:.4s cubic-bezier(.3,1.4,.5,1)}
      .pwa-pill.on{transform:translate(-50%,0);opacity:1}
      .pwa-pill img{width:34px;height:34px;border-radius:10px;background:#fff;flex:none}
      .pwa-pill span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .pwa-pill .go{border:0;border-radius:999px;padding:9px 14px;font:800 .85rem system-ui,sans-serif;cursor:pointer;color:#1a1300;
        background:linear-gradient(135deg,#fde68a,#f5c84c);white-space:nowrap}
      .pwa-pill .no{border:0;background:none;color:#9ca3af;font-size:1rem;cursor:pointer;padding:4px 6px}
      .pwa-ios{position:fixed;inset:0;z-index:1250;display:grid;align-items:end;background:rgba(0,0,0,.6);padding:16px}
      .pwa-ios>div{max-width:440px;margin:0 auto;width:100%;padding:20px;border-radius:22px;background:#0f1a2e;color:#e5e7eb;
        border:1px solid rgba(245,200,76,.4);font:500 .95rem/1.55 system-ui,sans-serif}
      .pwa-ios b{color:#fde68a}.pwa-ios ol{padding-left:20px;margin:10px 0 14px}
      .pwa-ios button{width:100%;padding:12px;border:0;border-radius:12px;font:800 1rem system-ui,sans-serif;background:#f5c84c;color:#1a1300}
      @media (min-width:900px){.pwa-pill{bottom:110px}}`;
    head.appendChild(css);

    const showIOSHelp = () => {
      const m = document.createElement("div");
      m.className = "pwa-ios";
      m.innerHTML = `<div><b>📲 Ilovani iPhone'ga o‘rnatish</b>
        <ol><li>Safari pastidagi <b>“Ulashish”</b> tugmasini bosing (kvadrat va yuqoriga strelka ⬆️).</li>
        <li>Ro‘yxatdan <b>“Bosh ekranga qo‘shish”</b> (Add to Home Screen) ni tanlang.</li>
        <li><b>“Qo‘shish”</b> ni bosing — ekraningizda markaz belgisi paydo bo‘ladi.</li></ol>
        <button type="button">Tushunarli</button></div>`;
      m.addEventListener("click", (e) => { if (e.target === m || e.target.tagName === "BUTTON") m.remove(); });
      document.body.appendChild(m);
    };

    const pill = () => {
      if (document.querySelector(".pwa-pill") || store.get("pwaHide") === "1") return;
      const el = document.createElement("div");
      el.className = "pwa-pill";
      el.innerHTML = `<img src="assets/icons/icon-192.png" alt=""><span>Telefonga ilova</span>
        <button class="go" type="button">📲 O‘rnatish</button><button class="no" type="button" aria-label="Yopish">✕</button>`;
      el.querySelector(".no").onclick = () => { store.set("pwaHide", "1"); el.remove(); };
      el.querySelector(".go").onclick = async () => {
        if (deferred) {
          deferred.prompt();
          const r = await deferred.userChoice.catch(() => ({}));
          deferred = null;
          if (r && r.outcome === "accepted") el.remove();
        } else if (isIOS) showIOSHelp();
      };
      document.body.appendChild(el);
      setTimeout(() => el.classList.add("on"), 1200);
    };

    window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; pill(); });
    window.addEventListener("appinstalled", () => { store.set("pwaHide", "1"); document.querySelector(".pwa-pill")?.remove(); });
    if (isIOS && /safari/i.test(ua) && !/crios|fxios/i.test(ua)) pill();

    // Istalgan sahifadagi [data-install] tugmasi
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-install]");
      if (!b) return;
      e.preventDefault();
      if (deferred) { deferred.prompt(); deferred = null; }
      else if (isIOS) showIOSHelp();
      else alert("Brauzer menyusidan (⋮) “Ilovani o‘rnatish” yoki “Bosh ekranga qo‘shish” ni tanlang.");
    });
  })();


  // ===== O'quvchi va ustoz kirishi (parol bilan) =====
  (() => {
    const KEY = "sofi_me_v1";
    const sha = async (t) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map((b) => b.toString(16).padStart(2, "0")).join("");
    const loadHashes = () => window.SOFI_PW ? Promise.resolve(window.SOFI_PW) : new Promise((res) => {
      const sc = document.createElement("script");
      sc.src = "auth-data.js?v=1";
      sc.onload = () => res(window.SOFI_PW || {});
      sc.onerror = () => res({});
      document.head.appendChild(sc);
    });
    const students = () => (D.students || []).map((s) => ({ name: s.name, cls: s.group, role: "student" }));
    const teachers = () => (D.teachers || []).filter((t) => !/^Ustoz \d+$/.test(t.name)).map((t) => ({ name: t.name, cls: "Ustoz", role: "teacher" }));
    const Auth = {
      me() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } },
      save(u) { try { localStorage.setItem(KEY, JSON.stringify({ name: u.name, cls: u.cls, role: u.role || "student", at: Date.now() })); } catch (e) { /* bo'sh */ } document.dispatchEvent(new CustomEvent("sofi:auth")); },
      logout() { try { localStorage.removeItem(KEY); } catch (e) { /* bo'sh */ } document.dispatchEvent(new CustomEvent("sofi:auth")); },
      async verify(person, pw) {
        pw = String(pw || "").trim();
        if (!pw) return false;
        if (person.role === "teacher") return !!D.teacherPinHash && (await sha(pw)) === D.teacherPinHash;
        const H = await loadHashes();
        const h = H[person.name];
        if (!h) return false;
        return (await sha("sofi|" + person.name + "|" + pw.toLowerCase())) === h;
      },
      /** Kirish oynasi. Natija: foydalanuvchi yoki null. */
      open({ title = "Kirish", teachers: allowT = true } = {}) {
        return new Promise((resolve) => {
          if (!document.getElementById("saStyle")) {
            const st = document.createElement("style");
            st.id = "saStyle";
            st.textContent = `
              .sa{position:fixed;inset:0;z-index:2000;display:grid;place-items:center;padding:14px;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);animation:saF .25s}
              @keyframes saF{from{opacity:0}}
              .sa-card{width:min(520px,100%);max-height:calc(100vh - 28px);overflow:auto;padding:20px;border-radius:24px;background:linear-gradient(170deg,#0b2a1e,#04140c);border:1px solid rgba(0,245,155,.35);color:#fff;box-shadow:0 30px 80px rgba(0,0,0,.6);font-family:inherit}
              .sa-card h2{margin:0 0 4px;font-size:22px}.sa-card p{margin:0 0 12px;color:#9fc5b3;font-size:14px}
              .sa-tabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
              .sa-tabs button{padding:7px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#cfe;font:inherit;font-weight:800;cursor:pointer}
              .sa-tabs button.on{background:#00f59b;color:#02130c;border-color:#00f59b}
              .sa-search{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(0,0,0,.3);color:#fff;font:inherit;font-size:16px;margin-bottom:8px}
              .sa-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;max-height:260px;overflow:auto}
              .sa-list button{padding:9px 10px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#fff;font:inherit;font-size:13px;text-align:left;cursor:pointer}
              .sa-list button:hover{border-color:#00f59b}
              .sa-pw{display:grid;gap:8px;margin-top:6px}
              .sa-pw b{font-size:17px}.sa-pw input{padding:12px;border-radius:12px;border:1px solid rgba(0,245,155,.5);background:rgba(0,0,0,.35);color:#fff;font:inherit;font-size:18px;letter-spacing:.12em}
              .sa-row{display:flex;gap:8px}.sa-row button{flex:1;padding:12px;border-radius:12px;border:0;font:inherit;font-weight:900;cursor:pointer}
              .sa-go{background:linear-gradient(135deg,#00f59b,#0ea5e9);color:#02130c}.sa-back{background:rgba(255,255,255,.08);color:#fff}
              .sa-err{color:#fca5a5;font-size:14px;min-height:1.2em}
              .sa-x{float:right;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.1);color:#fff;font-size:16px;cursor:pointer}`;
            document.head.appendChild(st);
          }
          const all = students().concat(allowT ? teachers() : []);
          const tabs = [...new Set(all.map((p) => p.cls))];
          let tab = tabs[0];
          const el = document.createElement("div");
          el.className = "sa";
          document.body.appendChild(el);
          const done = (v) => { el.remove(); resolve(v); };
          const list = () => {
            el.innerHTML = `<div class="sa-card" role="dialog" aria-modal="true"><button class="sa-x" data-x aria-label="Yopish">✕</button>
              <h2>🔐 ${esc(title)}</h2><p>Sinfingizni va ismingizni tanlang, so‘ng parolingizni kiriting.</p>
              <div class="sa-tabs">${tabs.map((t) => `<button data-tab="${esc(t)}" class="${t === tab ? "on" : ""}">${t === "Ustoz" ? "👨‍🏫 Ustozlar" : esc(t)}</button>`).join("")}</div>
              <input class="sa-search" type="search" placeholder="🔎 Ism qidirish..." aria-label="Ism qidirish">
              <div class="sa-list">${all.filter((p) => p.cls === tab).map((p) => `<button data-n="${esc(p.name)}">${esc(p.name)}</button>`).join("")}</div></div>`;
            const inp = el.querySelector(".sa-search");
            inp.oninput = () => el.querySelectorAll("[data-n]").forEach((b) => (b.hidden = !b.textContent.toLowerCase().includes(inp.value.toLowerCase())));
          };
          const pwStep = (person) => {
            el.innerHTML = `<div class="sa-card" role="dialog" aria-modal="true"><button class="sa-x" data-x aria-label="Yopish">✕</button>
              <h2>🔐 Parol</h2><p>${person.role === "teacher" ? "Ustoz paroli" : "Sizga berilgan shaxsiy parol (7 belgi)"}</p>
              <form class="sa-pw"><b>${esc(person.name)}</b><input type="password" autocomplete="current-password" autocapitalize="off" spellcheck="false" placeholder="Parol" aria-label="Parol">
              <div class="sa-err" role="alert"></div>
              <div class="sa-row"><button type="button" class="sa-back" data-back>← Orqaga</button><button type="submit" class="sa-go">Kirish</button></div></form></div>`;
            const f = el.querySelector("form"), i = f.querySelector("input");
            setTimeout(() => i.focus(), 50);
            f.onsubmit = async (e) => {
              e.preventDefault();
              if (await Auth.verify(person, i.value)) { Auth.save(person); done(person); }
              else { f.querySelector(".sa-err").textContent = "Parol noto‘g‘ri. Qaytadan urinib ko‘ring."; i.value = ""; i.focus(); }
            };
          };
          el.addEventListener("click", (e) => {
            if (e.target === el || e.target.closest("[data-x]")) return done(null);
            const t = e.target.closest("[data-tab]"); if (t) { tab = t.dataset.tab; return list(); }
            if (e.target.closest("[data-back]")) return list();
            const n = e.target.closest("[data-n]"); if (n) return pwStep(all.find((p) => p.name === n.dataset.n));
          });
          list();
        });
      }
    };
    window.SofiAuth = Auth;
  })();

})();
