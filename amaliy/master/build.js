/* Matematika MASTER: modullarni Amaliy dars bo'limiga qo'shish va Oq to'plamga havolalar. */
(() => {
  "use strict";
  const MODS = {
    1: { id: "arifmetika", name: "Arifmetika va sonlar nazariyasi", icon: "🔢", color: "#22c55e" },
    2: { id: "algebra", name: "Algebra va tenglamalar", icon: "✖️", color: "#3b82f6" },
    3: { id: "funksiyalar", name: "Funksiyalar va progressiyalar", icon: "📈", color: "#a855f7" },
    4: { id: "analiz", name: "Matematik analiz elementlari", icon: "∫", color: "#ec4899" },
    5: { id: "kombinatorika", name: "Kombinatorika va to‘plamlar", icon: "🎲", color: "#f59e0b" },
    6: { id: "planimetriya", name: "Geometriya: planimetriya", icon: "📐", color: "#14b8a6" },
    7: { id: "stereometriya", name: "Geometriya: stereometriya", icon: "🧊", color: "#f97316" },
    8: { id: "vektorlar", name: "Koordinatalar va vektorlar", icon: "➡️", color: "#06b6d4" }
  };
  const OQ_SUB = { 1: "algebra", 2: "trigonometriya", 3: "planimetriya", 4: "stereometriya" };
  const SK = window.OQ_SKELETON || [];
  const link = (code) => { const r = SK.find((x) => x.code === code); return r ? [`#oq/${OQ_SUB[r.bob]}/${r.id}`, `${r.code} ${r.title}`] : null; };
  let n = 0;
  Object.entries(MODS).forEach(([m, mod]) => {
    const list = (window.MASTER || []).filter((t) => t.mod === +m);
    const topics = list.map((t) => {
      n++;
      return {
        id: t.id, code: String(n), title: t.title, tag: t.tag, life: t.life, explain: t.explain, rule: t.rule, tip: t.tip,
        demos: t.demos || [],
        examples: (t.ex || []).map(([q, steps, a]) => ({ q, steps, a })),
        quiz: (t.qz || []).map(([q, o, e]) => ({ q, o, e })),
        see: (t.see || []).map(link).filter(Boolean)
      };
    });
    if (topics.length) window.AMALIY_ADD("master", "Matematika MASTER", { ...mod, note: `${topics.length} ta mavzu · to‘liq konspekt`, topics });
  });
})();
