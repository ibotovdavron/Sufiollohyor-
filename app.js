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
    bag: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    question: '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    menu: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  // [manzil, ikonka, nom, telefonda pastki qatorda ko'rinadimi]
  const pages = [
    ["index.html", "home", "Bosh sahifa", true],
    ["competitions.html", "trophy", "Musobaqalar", false],
    ["teachers.html", "cap", "Ustozlar", false],
    ["ranking.html", "chart", "Reyting", true],
    ["games.html", "game", "O‘yinlar", true],
    ["schedule.html", "calendar", "Jadval", false],
    ["shop.html", "bag", "Do‘kon", true],
    ["about.html", "question", "Kunlik savol", false],
    ["contact.html", "phone", "Aloqa", false]
  ];

  const path =
    location.pathname.split("/").pop() || "index.html";

  const nav = document.getElementById("bottomNav");

  if (nav) {
    const inSheet = pages.some(([url, , , main]) => !main && url === path);
    nav.innerHTML = `
      <div class="nav-bar">
        ${pages.map(([url, ic, label, main]) => `
          <a
            class="navitem ${main ? "main" : "extra"} ${url === "games.html" ? "play" : ""} ${path === url ? "active" : ""}"
            href="${url}"
            ${path === url ? 'aria-current="page"' : ""}
          >
            <span class="navicon">${icon(ic)}</span>
            <span class="navlabel">${url === "index.html" ? '<span class="lg">Bosh sahifa</span><span class="sm">Asosiy</span>' : label}</span>
          </a>
        `).join("")}
        <button class="navitem more ${inSheet ? "active" : ""}" type="button" aria-expanded="false" aria-controls="navSheet">
          <span class="navicon">${icon("menu")}</span>
          <span class="navlabel">Menyu</span>
        </button>
      </div>`;

    const sheet = document.createElement("div");
    sheet.className = "nav-sheet";
    sheet.id = "navSheet";
    sheet.hidden = true;
    sheet.innerHTML = `
      <div class="nav-sheet-card" role="dialog" aria-label="Barcha bo‘limlar">
        <span class="nav-sheet-grip"></span>
        <h3>Barcha bo‘limlar</h3>
        <div class="nav-sheet-grid">
          ${pages.map(([url, ic, label], i) => `
            <a class="sheet-item ${path === url ? "active" : ""}" href="${url}" style="--i:${i}">
              <span class="navicon">${icon(ic)}</span>
              <span>${label}</span>
            </a>
          `).join("")}
        </div>
      </div>`;
    document.body.appendChild(sheet);

    const moreBtn = nav.querySelector(".more");
    const setSheet = (open) => {
      moreBtn.setAttribute("aria-expanded", String(open));
      if (open) {
        sheet.hidden = false;
        requestAnimationFrame(() => sheet.classList.add("open"));
      } else {
        sheet.classList.remove("open");
        setTimeout(() => { if (!sheet.classList.contains("open")) sheet.hidden = true; }, 300);
      }
    };
    moreBtn.addEventListener("click", () => setSheet(sheet.hidden));
    sheet.addEventListener("click", (e) => { if (e.target === sheet) setSheet(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setSheet(false); });

    // Pastga aylantirganda menyu yashirinadi, tepaga qaytganda chiqadi
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      nav.classList.toggle("tucked", y > lastY && y > 120 && sheet.hidden);
      lastY = y;
    }, { passive: true });
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
      "schedule.html",
      "🗓️",
      "Dars jadvali",
      "Darslar va guruhlar"
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
    const items = [...document.querySelectorAll(revealSel)].filter((el) => !el.classList.contains("reveal"));
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

})();
