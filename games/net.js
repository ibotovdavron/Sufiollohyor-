/* O'yinlar uchun real vaqt aloqasi.
   Asosiy yo'l: Supabase Realtime (presence + broadcast).
   Supabase ulanmasa: BroadcastChannel (faqat shu qurilmadagi oynalar orasida). */
(() => {
  "use strict";

  const HEARTBEAT_MS = 2000;
  const EXPIRE_MS = 6500;

  function randomId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  // ---------- Supabase ----------
  function supabaseTransport(client) {
    return {
      kind: "online",
      join(topic, { meta, onMsg, onPresence }) {
        return new Promise((resolve, reject) => {
          const ch = client.channel("sofi-games-" + topic, {
            config: { broadcast: { self: false }, presence: { key: meta.cid } }
          });
          let current = meta;
          ch.on("broadcast", { event: "m" }, ({ payload }) => onMsg && onMsg(payload));
          ch.on("presence", { event: "sync" }, () => {
            const state = ch.presenceState();
            const list = Object.values(state).map((arr) => arr[arr.length - 1]);
            onPresence && onPresence(list);
          });
          let settled = false;
          const timer = setTimeout(() => {
            if (!settled) { settled = true; client.removeChannel(ch); reject(new Error("timeout")); }
          }, 7000);
          ch.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
              await ch.track(current);
              if (!settled) {
                settled = true;
                clearTimeout(timer);
                resolve({
                  send(data) { return ch.send({ type: "broadcast", event: "m", payload: data }); },
                  track(next) { current = next; return ch.track(next); },
                  leave() { return client.removeChannel(ch); }
                });
              }
            } else if ((status === "CHANNEL_ERROR" || status === "TIMED_OUT") && !settled) {
              settled = true;
              clearTimeout(timer);
              client.removeChannel(ch);
              reject(new Error(status));
            }
          });
        });
      }
    };
  }

  // ---------- Shu qurilma (BroadcastChannel) ----------
  function localTransport() {
    return {
      kind: "local",
      join(topic, { meta, onMsg, onPresence }) {
        const bc = new BroadcastChannel("sofi-games-" + topic);
        const peers = new Map();
        let current = meta;
        let alive = true;

        const emitPresence = () => {
          const now = Date.now();
          for (const [cid, p] of peers) if (now - p.seen > EXPIRE_MS) peers.delete(cid);
          const list = [current, ...[...peers.values()].map((p) => p.meta)];
          onPresence && onPresence(list);
        };
        const beat = () => alive && bc.postMessage({ k: "hb", meta: current });

        bc.onmessage = ({ data }) => {
          if (!alive || !data) return;
          if (data.k === "hb") {
            const isNew = !peers.has(data.meta.cid);
            peers.set(data.meta.cid, { meta: data.meta, seen: Date.now() });
            if (isNew) beat();
            emitPresence();
          } else if (data.k === "bye") {
            peers.delete(data.cid);
            emitPresence();
          } else if (data.k === "m") {
            onMsg && onMsg(data.payload);
          }
        };

        const hb = setInterval(() => { beat(); emitPresence(); }, HEARTBEAT_MS);
        const bye = () => alive && bc.postMessage({ k: "bye", cid: current.cid });
        window.addEventListener("pagehide", bye);
        beat();
        setTimeout(emitPresence, 50);

        return Promise.resolve({
          send(data) { bc.postMessage({ k: "m", payload: data }); return Promise.resolve(); },
          track(next) { current = next; beat(); emitPresence(); return Promise.resolve(); },
          leave() {
            bye();
            alive = false;
            clearInterval(hb);
            window.removeEventListener("pagehide", bye);
            bc.close();
            return Promise.resolve();
          }
        });
      }
    };
  }

  let transport = null;
  let client = null;

  async function init() {
    if (transport) return transport;
    const forceLocal = new URLSearchParams(location.search).get("net") === "local";
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    if (!forceLocal && window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
      try {
        client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
          auth: { persistSession: false },
          realtime: { params: { eventsPerSecond: 20 } }
        });
        const t = supabaseTransport(client);
        // Ulanishni tekshirish
        const probe = await t.join("probe", { meta: { cid: randomId() } });
        probe.leave();
        transport = t;
        return transport;
      } catch (e) {
        console.warn("Supabase Realtime ulanmadi, mahalliy rejim:", e);
      }
    }
    transport = localTransport();
    return transport;
  }

  window.SofiNet = {
    init,
    randomId,
    get kind() { return transport ? transport.kind : null; },
    // Yulduzlarni saqlash uchun (Realtime ishlamasa ham REST ishlashi mumkin)
    get db() { return client; },
    join(topic, opts) { return transport.join(topic, opts); }
  };
})();
