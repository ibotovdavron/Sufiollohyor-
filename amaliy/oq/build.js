/* Oq to'plam: mundarija (skeleton) va mazmun (window.OQ) dan Amaliy dars bo'limini yig'ish. */
(() => {
  "use strict";
  const SK = window.OQ_SKELETON || [], C = window.OQ || {};
  const BOBS = {
    1: { id: "algebra", name: "Algebra", icon: "🔢", color: "#22c55e" },
    2: { id: "trigonometriya", name: "Trigonometriya va analiz", icon: "📈", color: "#3b82f6" },
    3: { id: "planimetriya", name: "Planimetriya", icon: "📐", color: "#a855f7" },
    4: { id: "stereometriya", name: "Stereometriya", icon: "🧊", color: "#f97316" }
  };
  Object.entries(BOBS).forEach(([n, b]) => {
    const rows = SK.filter((x) => x.bob === +n);
    const secs = new Set(rows.map((x) => x.secCode));
    const topics = rows.map((x) => {
      const c = C[x.code] || {};
      return {
        id: x.id, code: x.code, title: x.title, sec: `${x.secCode}. ${x.sec}`, p1: x.p1, p2: x.p2,
        tag: c.tag || `${x.sec} · Oq to‘plam, ${x.p1}-bet`,
        life: c.life, explain: c.explain || "<p>Mavzu tez orada to‘ldiriladi.</p>", rule: c.rule, tip: c.tip,
        demos: c.demos || [],
        examples: (c.ex || []).map(([q, steps, a]) => ({ q, steps, a })),
        quiz: (c.qz || []).map(([q, o, e]) => ({ q, o, e }))
      };
    });
    window.AMALIY_ADD("oq", "Oq to‘plam · DTM", { ...b, note: `${secs.size} bo‘lim · abituriyentlar uchun`, topics });
  });
})();
