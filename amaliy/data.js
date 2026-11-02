/* Amaliy darslar ro'yxati. Mavzular lessons-*.js fayllarida qo'shiladi. */
window.AMALIY = { classes: [] };
window.AMALIY_ADD = function (classId, className, subject) {
  let cls = window.AMALIY.classes.find((c) => c.id === classId);
  if (!cls) {
    cls = { id: classId, name: className, subjects: [] };
    window.AMALIY.classes.push(cls);
    window.AMALIY.classes.sort((a, b) => (isNaN(a.id) ? 1e9 : Number(a.id)) - (isNaN(b.id) ? 1e9 : Number(b.id)));
  }
  cls.subjects.push(subject);
};
/** Yillik reja: mavjud fanga chorak bo'yicha mavzular qo'shish.
    T(id, title, tag, life, explain, rule, ex[[q, steps, a]], qz[[q, opts, e]], demos) */
window.AMALIY_YEAR = function (classId, subjectId, sec, list) {
  const cls = window.AMALIY.classes.find((c) => c.id === classId);
  const sub = cls && cls.subjects.find((s) => s.id === subjectId);
  if (!sub) return;
  sub.topics.forEach((t) => { if (!t.sec) t.sec = "I chorak"; });
  sub.note = "Yillik reja · 4 chorak";
  list.forEach((t) => {
    if (Array.isArray(t)) {
      const [id, title, tag, life, explain, rule, ex, qz, demos] = t;
      t = { id, title, tag, life, explain, rule, demos: demos || [],
        examples: (ex || []).map(([q, steps, a]) => ({ q, steps, a })),
        quiz: (qz || []).map(([q, o, e]) => ({ q, o, e })) };
    }
    sub.topics.push({ sec, ...t });
  });
};
