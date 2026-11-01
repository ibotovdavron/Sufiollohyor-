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
