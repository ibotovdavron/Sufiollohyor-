/* Amaliy darslar ro'yxati. Mavzular lessons-*.js fayllarida qo'shiladi. */
window.AMALIY = { classes: [] };
window.AMALIY_ADD = function (classId, className, subject) {
  let cls = window.AMALIY.classes.find((c) => c.id === classId);
  if (!cls) {
    cls = { id: classId, name: className, subjects: [] };
    window.AMALIY.classes.push(cls);
    window.AMALIY.classes.sort((a, b) => Number(a.id) - Number(b.id));
  }
  cls.subjects.push(subject);
};
