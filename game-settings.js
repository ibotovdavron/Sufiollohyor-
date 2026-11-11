/* O'yin sozlamalari (game-settings.sql): ustoz profil sahifasidan o'zgartiradi, o'yinlar o'qiydi.
   Supabase ulanmasa yoki jadval yaratilmagan bo'lsa — shu qurilmada (localStorage) saqlanadi. */
(() => {
  "use strict";
  const LK = "sofi_game_settings";
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
  const L = {
    get() { try { return JSON.parse(localStorage.getItem(LK)) || {}; } catch (e) { return {}; } },
    set(v) { try { localStorage.setItem(LK, JSON.stringify(v)); } catch (e) {} },
  };
  const missing = (e) => e && /does not exist|schema cache|relation|Could not find/i.test(e.message || "");
  const sha = async (t) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map((b) => b.toString(16).padStart(2, "0")).join("");

  window.SofiGameSettings = {
    /** Jadval bor-yo'qligi: true — internetda saqlanadi, false — faqat shu qurilmada */
    shared: null,
    async get(key) {
      const c = db();
      if (c) {
        try {
          const { data, error } = await c.from("game_settings").select("value, teacher, updated_at").eq("key", key).maybeSingle();
          if (!error) { this.shared = true; return data ? Object.assign({ _by: data.teacher, _at: data.updated_at }, data.value) : null; }
          if (!missing(error)) throw error;
        } catch (e) { console.warn("game_settings", e); }
      }
      this.shared = false;
      return L.get()[key] || null;
    },
    async set(pin, teacher, key, value) {
      const clean = JSON.parse(JSON.stringify(value)); delete clean._by; delete clean._at;
      const c = db();
      if (c) {
        const { error } = await c.rpc("gs_set", { p_pin: pin, p_teacher: teacher, p_key: key, p_value: clean });
        if (!error) { this.shared = true; return true; }
        if (!missing(error)) throw new Error(/Parol/.test(error.message) ? "Parol noto‘g‘ri" : error.message);
      }
      // mahalliy zaxira: parolni shu yerda tekshiramiz
      const D = window.CENTER_DATA || {}, h = await sha(String(pin || "").trim());
      if (!(h === D.teacherPinHash || (D.teachers || []).some((t) => t.pinHash === h))) throw new Error("Parol noto‘g‘ri");
      const all = L.get(); all[key] = clean; L.set(all); this.shared = false;
      return true;
    },
  };
})();
