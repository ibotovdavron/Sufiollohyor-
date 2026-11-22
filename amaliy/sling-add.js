/* “Rogatka — haqiqiy fizika” tajribasini mos mavzularga birinchi tajriba qilib qo‘shish. */
(() => {
  const ADD = [
    ["7", "fizika", "tezlik", { title: "🏹 Rogatka: sharning tezligini kuzating — uchish davomida v qanday o‘zgaradi?" }],
    ["10", "fizika", "bir-necha-kuch", { title: "🏹 Rogatka: uchayotgan sharga ikki kuch ta’sir qiladi — og‘irlik (mg) va havo qarshiligi" }],
    ["10", "fizika", "qiya-fik", { title: "🏹 Rogatka: rezina energiyasining faqat 79 % i sharga o‘tadi (η) — energiya qayerga ketadi?" }],
    ["9", "algebra", "parabola-yasash", { title: "🏹 Rogatka: havo qarshiligini o‘chiring — shar aniq parabola chizadi", angle: 45 }],
  ];
  const DB = window.AMALIY;
  if (!DB) return;
  ADD.forEach(([c, s, t, opt]) => {
    const cls = DB.classes.find((x) => x.id === c), sub = cls && cls.subjects.find((x) => x.id === s), top = sub && sub.topics.find((x) => x.id === t);
    if (!top) return;
    top.demos = top.demos || [];
    if (!top.demos.some((d) => d.type === "sling")) top.demos.unshift({ type: "sling", ...opt });
  });
})();
