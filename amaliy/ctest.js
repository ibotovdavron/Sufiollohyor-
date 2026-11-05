/* Sinf testlari: ustoz biriktiradi, o'quvchi topshiradi, o'yinlar sahifasi tekshiradi.
   Supabase (sinf-testlari.sql) ulanmasa — faqat shu qurilmada (localStorage) ishlaydi. */
(() => {
  "use strict";
  const LKEY = "sofi_ct_local";
  const COOLDOWN_MS = 10 * 60 * 1000;
  let client;

  function db() {
    if (client !== undefined) return client;
    client = null;
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    const local = new URLSearchParams(location.search).get("net") === "local";
    if (!local && window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
      try { client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false } }); } catch (e) { client = null; }
    }
    return client;
  }

  /* ---- Mahalliy zaxira ---- */
  const L = {
    get() { try { return JSON.parse(localStorage.getItem(LKEY)) || { tests: [], results: [], n: 1 }; } catch (e) { return { tests: [], results: [], n: 1 }; } },
    set(v) { try { localStorage.setItem(LKEY, JSON.stringify(v)); } catch (e) {} },
  };
  const D = () => window.CENTER_DATA || {};
  async function localPinOk(pin) {
    const sha = async (t) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map((b) => b.toString(16).padStart(2, "0")).join("");
    const h = await sha(String(pin || "").trim());
    return h === D().teacherPinHash || (D().teachers || []).some((t) => t.pinHash === h);
  }

  /** Jadval hali yaratilmagan bo'lsa — test yo'q deb hisoblaymiz (o'yinlar yopilib qolmasin). */
  const missing = (error) => error && /does not exist|schema cache|relation|Could not find/i.test(error.message || "");

  const API = {
    COOLDOWN_MS,
    get online() { return !!db(); },

    async listActive(cls) {
      const c = db();
      if (c) {
        let q = c.from("class_tests").select("id,cls,title,subject,topics,minutes,pass_pct,teacher,created_at").eq("active", true).order("created_at", { ascending: false });
        if (cls) q = q.eq("cls", cls);
        const { data, error } = await q;
        if (error) { if (missing(error)) return []; throw error; }
        return data || [];
      }
      return L.get().tests.filter((t) => t.active && (!cls || t.cls === cls)).sort((a, b) => b.id - a.id);
    },

    async get(id) {
      const c = db();
      if (c) {
        const { data, error } = await c.from("class_tests").select("*").eq("id", id).maybeSingle();
        if (error) throw error;
        return data;
      }
      return L.get().tests.find((t) => t.id === Number(id)) || null;
    },

    async results(testIds, student) {
      if (!testIds.length) return [];
      const c = db();
      if (c) {
        let q = c.from("class_test_results").select("test_id,student,score,total,pct,passed,secs,created_at").in("test_id", testIds).order("created_at", { ascending: true });
        if (student) q = q.eq("student", student);
        const { data, error } = await q;
        if (error) { if (missing(error)) return []; throw error; }
        return data || [];
      }
      return L.get().results.filter((r) => testIds.includes(r.test_id) && (!student || r.student === student));
    },

    /** O'quvchi hali o'tmagan faol testlar. */
    async pending(student, cls) {
      const tests = await API.listActive(cls);
      if (!tests.length) return [];
      const res = await API.results(tests.map((t) => t.id), student);
      return tests.filter((t) => !res.some((r) => r.test_id === t.id && r.passed));
    },

    async assign({ pin, teacher, classes, title, subject, topics, questions, minutes, pass }) {
      const c = db();
      if (c) {
        const { data, error } = await c.rpc("ct_assign", { p_pin: pin, p_teacher: teacher, p_classes: classes, p_title: title, p_subject: subject, p_topics: topics, p_questions: questions, p_minutes: minutes, p_pass: pass });
        if (error) throw new Error(missing(error) ? "Supabase’da sinf-testlari.sql hali ishga tushirilmagan." : error.message);
        return data;
      }
      if (!(await localPinOk(pin))) throw new Error("Parol noto‘g‘ri");
      const s = L.get();
      classes.forEach((cls) => s.tests.push({ id: s.n++, cls, title, subject, topics, questions, minutes, pass_pct: pass, teacher, active: true, created_at: new Date().toISOString() }));
      L.set(s);
      return classes.length;
    },

    async cancel(pin, id) {
      const c = db();
      if (c) {
        const { error } = await c.rpc("ct_cancel", { p_pin: pin, p_id: id });
        if (error) throw new Error(error.message);
        return true;
      }
      if (!(await localPinOk(pin))) throw new Error("Parol noto‘g‘ri");
      const s = L.get();
      const t = s.tests.find((x) => x.id === id);
      if (t) t.active = false;
      L.set(s);
      return true;
    },

    async submit(test, student, score, secs) {
      const c = db();
      if (c) {
        const { data, error } = await c.rpc("ct_submit", { p_test: test.id, p_student: student, p_score: score, p_secs: secs });
        if (error) throw new Error(error.message);
        return data;
      }
      const s = L.get();
      const total = test.questions.length;
      const pct = Math.floor((score * 100) / total);
      const r = { test_id: test.id, student, score, total, pct, passed: pct >= test.pass_pct, secs, created_at: new Date().toISOString() };
      s.results.push(r);
      L.set(s);
      return r;
    },
  };

  window.SofiTests = API;
})();
