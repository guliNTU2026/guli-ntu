/* =====================================================================
   pet-shared.js — 校園小夥伴 Campus Buddy (shared pet + coin system)
   =====================================================================
   Both apps load this file. Because both apps are hosted in the SAME
   folder on the SAME website, they share one saved pet: coins earned
   in 營養大對決 can feed the same animal as coins from 配什麼好.

   Data is saved in the visitor's own browser (localStorage) — nothing
   is sent to a server, no accounts, no cost to you. If the visitor
   clears their browser data or switches phones, the pet resets.
   (A determined person could cheat by editing their own browser
   storage — that only affects their own pet and costs you nothing.)

   ─── WHAT YOU MIGHT WANT TO EDIT ───
   1. EARN — how many coins each action gives + daily caps (anti-abuse)
   2. SPECIES — the animals and their growth stages (emoji)
   3. SHOP — accessories and prices
   4. FEED_COST / STAGE_XP — how fast pets grow
   Everything else can be left alone.

   NOTE: the pixel-art cat lives in its own files (cat-items.js,
   cat-frames.js, cat-state.js) and talks to this one through the
   three small doors near "EXTENSION API" below. The emoji pet in this
   file is untouched and still works — existing visitors keep their
   saved buddy.
   ===================================================================== */

(function () {
  "use strict";

  /* ============ 1. COIN EARNING RULES (EDIT HERE) ============
     amount   = coins given per action
     dailyCap = max coins from that source per calendar day
                (this is what stops someone farming coins) */
  const EARN = {
    login:   { amount: 10, dailyCap: 10 },  // first visit of the day (either app)
    answer:  { amount: 2,  dailyCap: 30 },  // per correct 大對決 answer
    pairing: { amount: 5,  dailyCap: 15 },  // per completed 配什麼好 meal
    share:   { amount: 5,  dailyCap: 5  },  // sharing to social media
  };

  /* ============ USAGE TRACKING (EDIT HERE) ============
     Free, privacy-friendly visit counting via GoatCounter.
     1. Make a free account at goatcounter.com and pick a code
        (e.g. "hpa-ntu" gives you the site hpa-ntu.goatcounter.com)
     2. Put that code inside the quotes below.
     Leave it empty ("") and no tracking happens at all.
     What gets counted: page visits (split by which QR code was
     scanned, via ?src=... in the URL) and anonymous "Nth-day
     return visit" events. No names, no cookies, no personal data. */
  const ANALYTICS = {
    goatcounterCode: "gulintu2026",   /* ✏️ EDIT HERE, e.g. "hpa-ntu" */
  };

  const FEED_COST = 10;                  // coins per feeding
  const PET_PRICE = 40;                  // ✏️ EDIT HERE: coins to adopt each ADDITIONAL animal (first one is free)
  const STAGE_XP  = [0, 5, 15, 30];      // feedings needed to reach stage 1/2/3/4

  /* ============ 2. ANIMALS (EDIT HERE) ============
     stages = emoji shown at each growth stage (young → grown).
     Add or remove animals freely; keep at least one. */
  const SPECIES = [
    { id: "chick",  zh: "小雞", en: "Chick",  stages: ["🥚", "🐣", "🐤", "🐔"] },
    { id: "cat",    zh: "小貓", en: "Cat",    stages: ["🐱", "😺", "😸", "🐈"] },
    { id: "dog",    zh: "小狗", en: "Dog",    stages: ["🐶", "🐕", "🦮", "🐩"] },
    { id: "rabbit", zh: "兔子", en: "Rabbit", stages: ["🐰", "🐇", "🐇", "🐰"] },
    { id: "fish",   zh: "小魚", en: "Fish",   stages: ["🫧", "🐟", "🐠", "🐡"] },
  ];

  /* ============ 3. ACCESSORY SHOP (EDIT HERE) ============ */
  const SHOP = [
    { id: "hat",     emoji: "🎩", zh: "紳士帽", en: "Top hat",   price: 30 },
    { id: "bow",     emoji: "🎀", zh: "蝴蝶結", en: "Bow",       price: 25 },
    { id: "glasses", emoji: "🕶️", zh: "墨鏡",   en: "Shades",    price: 35 },
    { id: "crown",   emoji: "👑", zh: "皇冠",   en: "Crown",     price: 60 },
    { id: "flower",  emoji: "🌻", zh: "小花",   en: "Sunflower", price: 20 },
  ];

  /* ============ UI text (zh/en) — edit wording if you like ============ */
  const T = {
    title:      { zh: "校園小夥伴", en: "Campus Buddy" },
    coins:      { zh: "金幣",       en: "coins" },
    feed:       { zh: "餵食 🍚 −" + FEED_COST, en: "Feed 🍚 −" + FEED_COST },
    notEnough:  { zh: "金幣不夠，先去答題或配餐賺金幣吧！", en: "Not enough coins — play the games to earn more!" },
    pick:       { zh: "選一隻小夥伴吧！（第一隻免費）", en: "Pick your buddy! (First one is free)" },
    myPets:     { zh: "我的小夥伴們", en: "My buddies" },
    adopt:      { zh: "領養", en: "Adopt" },
    adopted:    { zh: "歡迎新夥伴！🎉", en: "A new buddy joins! 🎉" },
    stage:      { zh: "成長", en: "Level" },
    maxed:      { zh: "已經長大囉！", en: "All grown up!" },
    shop:       { zh: "小舖", en: "Shop" },
    owned:      { zh: "已擁有", en: "Owned" },
    wear:       { zh: "穿戴", en: "Wear" },
    remove:     { zh: "脫下", en: "Take off" },
    loginBonus: { zh: "每日簽到 +", en: "Daily check-in +" },
    fedMsg:     { zh: "好好吃～", en: "Yum!" },
    grewMsg:    { zh: "長大了！🎉", en: "It grew! 🎉" },
    capMsg:     { zh: "今天這類金幣已達上限，明天再來！", en: "Daily cap reached for this — come back tomorrow!" },
    close:      { zh: "關閉", en: "Close" },
    otherApp:   { zh: "兩個小遊戲共用同一隻小夥伴喔！", en: "Both games feed the same buddy!" },
    photo:      { zh: "📸 拍照分享 (+5 🪙)", en: "📸 Photo share (+5 🪙)" },
    frameOn:    { zh: "限定框上線中！", en: "seasonal frame is live!" },
    saved:      { zh: "圖片已下載，快分享吧！", en: "Image downloaded — share away!" },
    tipsTitle:  { zh: "小知識收集簿", en: "Tips collected" },
    tipsBtn:    { zh: "📖 小知識", en: "📖 Tips" },
    tipsCount:  { zh: "已收集 {a} / {b}", en: "{a} of {b} collected" },
    tipsLocked: { zh: "還沒遇過", en: "Not found yet" },
    tipsHow:    { zh: "答對題目、每天看看貓咪，就會遇到新的小知識。",
                  en: "Answer quiz questions and visit the cat each day to find more." },
    tipsAll:    { zh: "全部收集完成了！🎉", en: "You've collected them all! 🎉" },
    tipsNew:    { zh: "發現新的小知識！📖", en: "New tip found! 📖" },
  };

  /* ==================================================================
     Storage — saved under one key so both apps see the same pet.
     Falls back to in-memory if localStorage is blocked (e.g. some
     private-browsing modes) — the pet just won't persist there.
     ================================================================== */
  const KEY = "hpa_buddy_v1";
  let mem = null;
  function load() {
    let d = null;
    try { const raw = localStorage.getItem(KEY); if (raw) d = JSON.parse(raw); } catch (e) {}
    if (!d) d = mem;
    if (!d) d = {
      coins: 0, totalEarned: 0,
      pet: { active: null, pets: {}, accessories: [], worn: [] },
      daily: { date: "", login: 0, answer: 0, pairing: 0, share: 0 },
    };
    /* migrate old saves (single pet: {species, xp}) to the roster format */
    if (d.pet && d.pet.species !== undefined) {
      const pets = {}; if (d.pet.species) pets[d.pet.species] = { xp: d.pet.xp || 0 };
      d.pet = { active: d.pet.species || null, pets, accessories: d.pet.accessories || [], worn: d.pet.worn || [] };
    }
    return d;
  }
  function save(d) {
    mem = d;
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function today() { return new Date().toISOString().slice(0, 10); }
  function rollDay(d) {
    if (d.daily.date !== today()) d.daily = { date: today(), login: 0, answer: 0, pairing: 0, share: 0 };
    return d;
  }

  let lang = "zh";
  const tx = (k) => (T[k] ? T[k][lang] : k);
  const $ = (sel) => document.querySelector(sel);

  /* ---------- holiday photo frames ---------- */
  const DEFAULT_THEME = { zh: "校園小夥伴", en: "Campus Buddy", deco: "🌾✨🍚", color: "#F3B72B",
    msg: { zh: "外食也能吃得好！", en: "Eating out can be balanced!" } };

  function activeTheme() {
    if (typeof HOLIDAYS === "undefined") return null;
    const now = new Date(), pad = n => String(n).padStart(2, "0");
    const full = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const md = full.slice(5);
    for (const h of HOLIDAYS) for (const [a, b] of h.ranges) {
      if (a.length === 5) { if (md >= a && md <= b) return h; }
      else { if (full >= a && full <= b) return h; }
    }
    return null;
  }

  /* Draws the shareable pet card on a canvas. Returns a PNG data URL. */
  function shareCardDataURL() {
    const d = load();
    const ap = activePet(d);
    if (!ap) return null;
    const sp = ap.sp;
    const th = activeTheme() || DEFAULT_THEME;
    const stg = Math.min(stageOf(ap.data.xp), sp.stages.length - 1);
    const worn = d.pet.worn.map(id => (SHOP.find(s => s.id === id) || {}).emoji || "").join(" ");
    const tag = (typeof SHARE !== "undefined") ? SHARE.hashtag : "";

    const W = 720, H = 900;
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    const FONT = "'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif";

    ctx.fillStyle = "#FAF5EA"; ctx.fillRect(0, 0, W, H);
    /* outer frame in the theme color */
    ctx.strokeStyle = th.color; ctx.lineWidth = 16;
    roundRect(ctx, 22, 22, W - 44, H - 44, 34); ctx.stroke();
    /* inner dashed ink line */
    ctx.strokeStyle = "rgba(51,40,31,.35)"; ctx.lineWidth = 3; ctx.setLineDash([14, 10]);
    roundRect(ctx, 48, 48, W - 96, H - 96, 22); ctx.stroke(); ctx.setLineDash([]);
    /* corner decorations from the theme */
    const deco = Array.from(th.deco);
    ctx.font = "52px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const spots = [[95, 100], [W - 95, 100], [95, H - 100], [W - 95, H - 100], [W / 2, 100]];
    spots.forEach((p, i) => { if (deco[i % deco.length]) ctx.fillText(deco[i % deco.length], p[0], p[1]); });

    ctx.fillStyle = "#3A3029";
    ctx.font = "700 26px " + FONT;
    ctx.fillText((lang === "zh" ? th.zh : th.en), W / 2, 175);
    if (worn) { ctx.font = "54px " + FONT; ctx.fillText(worn, W / 2, 300); }
    ctx.font = "190px " + FONT; ctx.fillText(sp.stages[stg], W / 2, 460);
    ctx.font = "900 40px " + FONT;
    ctx.fillText((lang === "zh" ? sp.zh : sp.en) + " · " + tx("stage") + " " + (stg + 1), W / 2, 610);
    /* wrapped theme message */
    ctx.font = "400 30px " + FONT;
    wrapText(ctx, (lang === "zh" ? th.msg.zh : th.msg.en), W / 2, 675, 540, 42);
    /* hashtag + date */
    ctx.fillStyle = th.color; ctx.font = "900 34px " + FONT;
    ctx.fillText(tag, W / 2, 780);
    ctx.fillStyle = "rgba(51,40,31,.55)"; ctx.font = "400 22px " + FONT;
    const appName = (typeof SHARE !== "undefined") ? (lang === "zh" ? SHARE.appName.zh : SHARE.appName.en) : "Campus Buddy";
    ctx.fillText(appName + " · " + new Date().toLocaleDateString(lang === "zh" ? "zh-TW" : "en-US"), W / 2, 826);
    return cv.toDataURL("image/png");
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function wrapText(ctx, text, x, y, maxW, lineH) {
    let line = "", yy = y;
    for (const ch of Array.from(text)) {
      if (ctx.measureText(line + ch).width > maxW) { ctx.fillText(line, x, yy); line = ch; yy += lineH; }
      else line += ch;
    }
    if (line) ctx.fillText(line, x, yy);
  }

  async function sharePhoto() {
    const url = shareCardDataURL();
    if (!url) { openPanel(); return; }
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], "campus-buddy.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        Buddy.addCoins("share");
      } else {
        const a = document.createElement("a"); a.href = url; a.download = "campus-buddy.png"; a.click();
        toast(tx("saved")); Buddy.addCoins("share");
      }
    } catch (e) { /* user cancelled the share sheet */ }
  }
  window.__bdPhoto = sharePhoto;

  function activePet(d) {
    if (!d.pet.active || !d.pet.pets[d.pet.active]) return null;
    return { sp: SPECIES.find(x => x.id === d.pet.active), data: d.pet.pets[d.pet.active] };
  }
  function stageOf(xp) {
    let s = 0;
    for (let i = 0; i < STAGE_XP.length; i++) if (xp >= STAGE_XP[i]) s = i;
    return s;
  }

  /* ==================================================================
     小知識 — the collectable tips book.
     ==================================================================
     Tips come from two places, and both end up in one book:
       • TIPS in foods-data.js   — the campaign / event messages
       • a food's `tip:` line    — facts tied to a particular food

     Which ones a visitor has met is remembered under its own branch of
     the save, so it survives alongside everything else and is never
     wiped by the cat or the pet.

     Nothing here expires and nothing is ever lost. The book only fills
     up — which is the point. It is a reason to come back that cannot
     turn into a reason to feel behind.
     ================================================================== */

  /* Every tip that exists, in a single shape the book can draw. */
  function allTips() {
    const out = [];
    if (typeof TIPS !== "undefined") {
      TIPS.forEach(t => out.push({
        id: "tip:" + t.id, icon: t.icon || "💡",
        zh: t.zh, en: t.en, from: null
      }));
    }
    if (typeof FOODS !== "undefined") {
      FOODS.filter(f => f.tip).forEach(f => out.push({
        id: "food:" + f.id, icon: f.emoji || "💡",
        zh: (f.tip.zh || f.tip.en), en: (f.tip.en || f.tip.zh),
        from: (lang === "zh" ? f.zh : f.en)
      }));
    }
    return out;
  }

  function seenList() {
    const d = load();
    return (d.tips && Array.isArray(d.tips.seen)) ? d.tips.seen : [];
  }

  /* Record that a tip has been met. Returns true only the FIRST time,
     so the caller can celebrate a genuinely new one. */
  function seeTip(id) {
    if (!id) return false;
    const d = load();
    if (!d.tips || !Array.isArray(d.tips.seen)) d.tips = { seen: [] };
    if (d.tips.seen.indexOf(id) >= 0) return false;
    d.tips.seen.push(id);
    save(d);
    return true;
  }

  /* Reveal one tip the visitor has not met yet. Used by the cat room,
     once a day. Returns the tip, or null when the book is complete. */
  function dropTip() {
    const seen = seenList();
    const left = allTips().filter(t => seen.indexOf(t.id) < 0);
    if (!left.length) return null;
    /* stable rather than random: the same day always reveals the same
       one, so reopening the page cannot be used to fish for a different
       tip, and two devices on the same day agree */
    const pick = left[Math.floor(Date.now() / 86400000) % left.length];
    seeTip(pick.id);
    return pick;
  }

  function tipsHTML() {
    const all = allTips(), seen = seenList();
    const got = all.filter(t => seen.indexOf(t.id) >= 0).length;
    const rows = all.map(t => {
      const has = seen.indexOf(t.id) >= 0;
      if (!has) {
        return `<div class="bd-tip locked"><span class="bd-tip-i">🔒</span>
          <span class="bd-tip-t">${tx("tipsLocked")}</span></div>`;
      }
      return `<div class="bd-tip"><span class="bd-tip-i">${t.icon}</span>
        <span class="bd-tip-t">${lang === "zh" ? t.zh : t.en}
        ${t.from ? `<i>— ${t.from}</i>` : ""}</span></div>`;
    }).join("");

    return `<div class="bd-h"><h2>📖 ${tx("tipsTitle")}</h2>
        <button class="bd-x" onclick="window.__bdCloseTips()">✕</button></div>
      <p class="bd-sub" style="text-align:center;font-weight:800;font-size:15px">
        ${tx("tipsCount").replace("{a}", got).replace("{b}", all.length)}</p>
      <div class="bd-tips">${rows}</div>
      <p class="bd-note">${got >= all.length ? tx("tipsAll") : tx("tipsHow")}</p>`;
  }

  function openTips() {
    let ov = $(".bd-tipsov");
    if (!ov) {
      ov = document.createElement("div");
      ov.className = "bd-overlay bd-tipsov";
      ov.innerHTML = `<div class="bd-panel"></div>`;
      ov.addEventListener("click", (e) => { if (e.target === ov) ov.classList.remove("on"); });
      document.body.appendChild(ov);
    }
    ov.querySelector(".bd-panel").innerHTML = tipsHTML();
    ov.classList.add("on");
  }
  window.__bdCloseTips = function () {
    const ov = $(".bd-tipsov"); if (ov) ov.classList.remove("on");
  };

  /* ==================================================================
     Public API
     ================================================================== */
  const Buddy = {
    setLang(l) { lang = l === "en" ? "en" : "zh"; render(); },

    /* Give coins from a source ("login" | "answer" | "pairing" | "share").
       Returns coins actually granted after the daily cap. */
    addCoins(source) {
      const rule = EARN[source]; if (!rule) return 0;
      const d = rollDay(load());
      const room = rule.dailyCap - d.daily[source];
      const grant = Math.max(0, Math.min(rule.amount, room));
      if (grant > 0) {
        d.daily[source] += grant;
        d.coins += grant; d.totalEarned += grant;
        save(d); render();
        toast("🪙 +" + grant);
      } else {
        toast(tx("capMsg"));
      }
      return grant;
    },

    coins() { return load().coins; },
    open() { openPanel(); },

    /* ---- 小知識 tips book (see the block above) ---- */
    openTips() { openTips(); },
    seeTip(id) { return seeTip(id); },     /* true only the first time */
    dropTip() { return dropTip(); },       /* reveal one new one */
    /* The text of one tip, by id — so the cat room can show today's. */
    tipText(id, l) {
      if (!id) return null;
      const t = allTips().find(x => x.id === id);
      if (!t) return null;
      return ((l || lang) === "zh" ? t.zh : t.en);
    },
    tipStats() {
      const all = allTips(), seen = seenList();
      return { total: all.length, seen: all.filter(t => seen.indexOf(t.id) >= 0).length };
    },

    /* ================================================================
       EXTENSION API — added for the cat. Do not delete.
       ----------------------------------------------------------------
       WHY THIS EXISTS (plain English)
       Everything about a visitor — coins, pets, daily caps — lives in
       ONE saved record in their browser. This file owns that record.
       The cat needs to read and write a little of it too (which cat is
       adopted, what is bought, how full the bowl is).

       Letting two files write to the same saved record independently is
       how saves get corrupted: both read it, both change their own bit,
       both write the whole thing back, and whoever writes last silently
       erases the other one's change.

       So instead, this file stays the ONLY writer, and hands out these
       three doors. cat-state.js goes through them and never touches
       localStorage itself.
       ================================================================ */

    /* Try to spend coins. Returns true if they could afford it (and the
       coins are now gone), false if they could not (and nothing changed).
       Always check the answer:  if (Buddy.spend(5)) { ...it worked... } */
    spend(n) {
      n = Math.max(0, Math.round(n || 0));
      const d = load();
      if (d.coins < n) return false;
      d.coins -= n;
      save(d); render();
      return true;
    },

    /* Read one named branch of the saved record, e.g. Buddy.get("cat").
       Returns null if nothing has been saved under that name yet.
       You get a COPY, so scribbling on it changes nothing until you
       hand it back with Buddy.set(). */
    get(branch) {
      const d = load();
      if (d[branch] === undefined || d[branch] === null) return null;
      try { return JSON.parse(JSON.stringify(d[branch])); }
      catch (e) { return null; }
    },

    /* Write one named branch back, e.g. Buddy.set("cat", myCatData).
       Only that branch is touched — coins, daily caps and the old emoji
       pet are all left exactly as they were. */
    set(branch, value) {
      const d = load();
      d[branch] = value;
      save(d); render();
      return true;
    },
    /* Fire a one-off analytics event, e.g. Buddy.track("cookbook-download").
       Silent no-op if GoatCounter isn't configured. */
    track(name) {
      try {
        if (!ANALYTICS.goatcounterCode) return;
        var safe = String(name).replace(/[^a-z0-9-]/gi, "");
        function send(){ try { window.goatcounter.count({ path: safe, event: true }); } catch(e){} }
        if (window.goatcounter && window.goatcounter.count) { send(); }
        else {
          var s2=document.createElement("script"); s2.async=true; s2.src="https://gc.zgo.at/count.js";
          s2.dataset.goatcounter="https://"+ANALYTICS.goatcounterCode+".goatcounter.com/count";
          window.goatcounter={no_onload:true}; s2.addEventListener("load",send);
          document.head.appendChild(s2);
        }
      } catch(e){}
    },
    shareCardDataURL() { return shareCardDataURL(); },
  };
  window.Buddy = Buddy;

  /* ==================================================================
     Floating widget + panel (injected into the page)
     ================================================================== */
  const css = `
  .bd-fab{position:fixed;right:14px;bottom:14px;z-index:900;display:flex;align-items:center;gap:6px;
    background:var(--card,#fff);border:2.5px solid var(--ink,#3A3029);border-radius:999px;
    padding:8px 14px 8px 10px;box-shadow:3px 3px 0 var(--ink,#3A3029);cursor:pointer;
    font-family:inherit;font-weight:700;font-size:16px;color:var(--ink,#3A3029)}
  .bd-fab:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink,#3A3029)}
  .bd-fab .bd-emoji{font-size:22px;line-height:1}
  .bd-overlay{position:fixed;inset:0;background:rgba(51,40,31,.45);z-index:950;display:none}
  .bd-overlay.on{display:flex;align-items:flex-end;justify-content:center}
  .bd-panel{background:var(--paper,#FAF5EA);width:100%;max-width:480px;border-radius:22px 22px 0 0;
    border:2.5px solid var(--ink,#3A3029);border-bottom:none;padding:18px 18px 26px;max-height:86vh;overflow:auto}
  .bd-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .bd-h h2{margin:0;font-size:20px}
  .bd-x{border:2px solid var(--ink,#3A3029);background:var(--card,#fff);border-radius:10px;
    padding:4px 10px;font-weight:700;cursor:pointer;box-shadow:2px 2px 0 var(--ink,#3A3029);font-family:inherit}
  .bd-stagebox{text-align:center;background:var(--card,#fff);border:2.5px solid var(--ink,#3A3029);
    border-radius:18px;box-shadow:3px 3px 0 var(--ink,#3A3029);padding:16px;margin:8px 0}
  .bd-pet{font-size:72px;line-height:1.1;display:inline-block;animation:bdIdle 2.6s ease-in-out infinite}
  @keyframes bdIdle{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  .bd-pet.eat{animation:bdEat .7s ease}
  @keyframes bdEat{0%{transform:scale(1) rotate(0deg)}30%{transform:scale(1.18) rotate(-7deg)}60%{transform:scale(1.12) rotate(7deg)}100%{transform:scale(1) rotate(0deg)}}
  .bd-acc{font-size:26px;letter-spacing:4px;min-height:30px}
  .bd-bar{height:12px;background:#eee2c8;border:2px solid var(--ink,#3A3029);border-radius:99px;overflow:hidden;margin:10px 12px 4px}
  .bd-bar i{display:block;height:100%;background:var(--yolk,#F3B72B)}
  .bd-sub{font-size:13px;opacity:.75}
  .bd-btn{display:inline-block;border:2.5px solid var(--ink,#3A3029);border-radius:14px;background:var(--yolk,#F3B72B);
    color:var(--ink,#3A3029);font-weight:800;font-size:16px;padding:10px 18px;margin-top:10px;cursor:pointer;
    box-shadow:3px 3px 0 var(--ink,#3A3029);font-family:inherit}
  .bd-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink,#3A3029)}
  .bd-btn.bd-ghost{background:var(--card,#fff);font-weight:700;font-size:13px;padding:7px 12px}
  .bd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:8px;margin-top:8px}
  .bd-cell{background:var(--card,#fff);border:2px solid var(--ink,#3A3029);border-radius:14px;
    box-shadow:2px 2px 0 var(--ink,#3A3029);padding:8px 4px;text-align:center;cursor:pointer;font-family:inherit}
  .bd-cell .e{font-size:30px}
  .bd-cell .n{font-size:12px;font-weight:700}
  .bd-cell .p{font-size:12px;opacity:.75}
  .bd-cell.sel{background:var(--yolk,#F3B72B)}
  .bd-note{font-size:12.5px;opacity:.75;text-align:center;margin-top:12px}
  .bd-tips{display:flex;flex-direction:column;gap:7px;margin-top:10px}
  .bd-tip{display:flex;gap:9px;align-items:flex-start;background:var(--card,#fff);
    border:2px solid var(--ink,#3A3029);border-radius:12px;padding:9px 11px;
    box-shadow:2px 2px 0 var(--ink,#3A3029)}
  .bd-tip.locked{opacity:.45;background:transparent;border-style:dashed;box-shadow:none}
  .bd-tip-i{font-size:19px;line-height:1.3;flex:none}
  .bd-tip-t{font-size:13.5px;font-weight:700;line-height:1.6}
  .bd-tip-t i{opacity:.65;font-weight:600;font-size:12px}
  .bd-toast{position:fixed;left:50%;bottom:84px;transform:translateX(-50%) rotate(-2deg);z-index:1000;
    background:var(--yolk,#F3B72B);border:2.5px solid var(--ink,#3A3029);border-radius:14px;
    box-shadow:3px 3px 0 var(--ink,#3A3029);padding:8px 16px;font-weight:800;font-size:16px;
    opacity:0;pointer-events:none;transition:opacity .2s, transform .2s}
  .bd-toast.on{opacity:1;transform:translateX(-50%) rotate(-2deg) translateY(-6px)}
  @media (prefers-reduced-motion:reduce){.bd-toast{transition:none}.bd-pet{animation:none}.bd-pet.eat{animation:none}}

  /* ---------- funding statement + social links (every page) ----------
     Deliberately NOT faded small print: this is a required funding
     acknowledgement, so it gets a real border, full opacity and a
     readable size. The bottom margin keeps it clear of the floating
     pet button, which sits fixed in the bottom-right corner. */
  .bd-fund{max-width:520px;margin:26px auto 0;padding:14px 16px;
    background:var(--card,#fff);border:2.5px solid var(--ink,#3A3029);border-radius:16px;
    box-shadow:3px 3px 0 var(--ink,#3A3029);text-align:center;
    font-family:inherit;color:var(--ink,#3A3029)}
  .bd-fund .bd-fund-logo{height:34px;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto}
  .bd-fund .bd-fund-zh{font-size:14px;font-weight:800;line-height:1.6}
  .bd-fund .bd-fund-en{font-size:12px;line-height:1.55;opacity:.8;margin-top:5px}
  .bd-fund .bd-social{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:12px}
  .bd-fund .bd-social a{display:inline-flex;align-items:center;gap:5px;
    border:2px solid var(--ink,#3A3029);border-radius:999px;background:var(--paper,#FAF5EA);
    padding:6px 13px;font-size:13px;font-weight:800;text-decoration:none;
    color:var(--ink,#3A3029);box-shadow:2px 2px 0 var(--ink,#3A3029)}
  .bd-fund .bd-social a:active{transform:translate(2px,2px);box-shadow:0 0 0 var(--ink,#3A3029)}
  /* A real spacer element, not a bottom margin. A trailing margin can
     collapse out of the document, which let the floating pet button sit
     on top of the social links and made them unclickable. An element
     with height always reserves its space. */
  .bd-fund-spacer{height:122px}
  @media (max-width:420px){ .bd-fund{margin:20px 12px 0} }
  `;

  let toastTimer = null;
  function toast(msg) {
    let el = $(".bd-toast");
    if (!el) { el = document.createElement("div"); el.className = "bd-toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("on"), 1800);
  }

  /* ------------------------------------------------------------------
     The funding statement + social links, shown at the bottom of every
     page. Both come from foods-data.js so there is ONE place to edit
     them, and they then appear everywhere automatically — including on
     any page added later.
     ------------------------------------------------------------------ */
  function fundingHTML() {
    if (typeof FUNDING === "undefined") return "";

    /* The Chinese line shows in BOTH languages: it is the official
       required wording, not a translation of something. */
    let html = "";
    /* An optional HPA logo. If images/hpa-logo.png is not there, the
       onerror hides it and nothing looks broken. */
    html += `<img class="bd-fund-logo" src="images/hpa-logo.png" alt=""
               onerror="this.style.display='none'">`;
    html += `<div class="bd-fund-zh">${FUNDING.zh}</div>`;
    if (lang === "en" && FUNDING.en) {
      html += `<div class="bd-fund-en">${FUNDING.en}</div>`;
    }

    /* Social links — only the ones that actually have an address yet. */
    if (typeof SOCIAL !== "undefined") {
      const live = SOCIAL.filter(x => x && x.url && x.url.trim() !== "");
      if (live.length) {
        html += `<div class="bd-social">` + live.map(x =>
          `<a href="${x.url}" target="_blank" rel="noopener"
              onclick="if(window.Buddy&&Buddy.track)Buddy.track('social-${x.id}')"
           >${x.icon || "🔗"} ${x.label}</a>`).join("") + `</div>`;
      }
    }
    return html;
  }

  function fab() {
    const d = load();
    const ap = activePet(d);
    const face = ap ? ap.sp.stages[Math.min(stageOf(ap.data.xp), ap.sp.stages.length - 1)] : "🐾";
    return `<span class="bd-emoji">${face}</span> 🪙 ${d.coins}`;
  }

  function render() {
    const f = $(".bd-fab"); if (f) f.innerHTML = fab();
    const fu = $(".bd-fund"); if (fu) fu.innerHTML = fundingHTML();
    const p = $(".bd-panel"); if (p && $(".bd-overlay").classList.contains("on")) p.innerHTML = panelHTML();
  }

  function panelHTML() {
    const d = rollDay(load()); save(d);
    const ap = activePet(d);

    if (!ap) { /* first visit: choose an animal (free) */
      return `<div class="bd-h"><h2>${tx("title")}</h2><button class="bd-x" onclick="document.querySelector('.bd-overlay').classList.remove('on')">✕</button></div>
        <p style="text-align:center;font-weight:700">${tx("pick")}</p>
        <div class="bd-grid">${SPECIES.map(s =>
          `<button class="bd-cell" onclick="window.__bdPick('${s.id}')"><div class="e">${s.stages[0]}</div><div class="n">${lang === "zh" ? s.zh : s.en}</div></button>`).join("")}
        </div>
        <p class="bd-note">${tx("otherApp")}</p>`;
    }

    const sp = ap.sp, xp = ap.data.xp;
    const stg = Math.min(stageOf(xp), sp.stages.length - 1);
    const maxStage = sp.stages.length - 1;
    const next = stg < maxStage ? STAGE_XP[stg + 1] : null;
    const prev = STAGE_XP[stg];
    const pct = next ? Math.round(((xp - prev) / (next - prev)) * 100) : 100;
    const worn = d.pet.worn.map(id => (SHOP.find(s => s.id === id) || {}).emoji || "").join("");

    return `<div class="bd-h"><h2>${tx("title")}</h2><button class="bd-x" onclick="document.querySelector('.bd-overlay').classList.remove('on')">✕</button></div>
      <div class="bd-stagebox">
        <div class="bd-acc">${worn}</div>
        <div class="bd-pet">${sp.stages[stg]}</div>
        <div><b>${lang === "zh" ? sp.zh : sp.en}</b> · ${tx("stage")} ${stg + 1}</div>
        <div class="bd-bar"><i style="width:${pct}%"></i></div>
        <div class="bd-sub">${next ? xp + " / " + next + " 🍚" : tx("maxed")}</div>
        <button class="bd-btn" onclick="window.__bdFeed()">${tx("feed")}</button>
        <button class="bd-btn bd-ghost" onclick="window.__bdPhoto()">${tx("photo")}</button>
        <button class="bd-btn bd-ghost" onclick="Buddy.openTips()">${tx("tipsBtn")} ${(function(){
          const s2 = Buddy.tipStats(); return s2.seen + "/" + s2.total; })()}</button>
        ${(function(){const th=activeTheme();return th?`<div class="bd-sub" style="color:${th.color};font-weight:800;margin-top:6px">🎉 ${lang==="zh"?th.zh:th.en} ${tx("frameOn")}</div>`:"";})()}
        <div class="bd-sub" style="margin-top:8px">🪙 ${d.coins} ${tx("coins")}</div>
      </div>
      <h3 style="margin:14px 0 2px">${tx("myPets")} 🐾</h3>
      <div class="bd-grid">${SPECIES.map(s2 => {
        const owned = !!d.pet.pets[s2.id];
        const on = d.pet.active === s2.id;
        const face2 = owned ? s2.stages[Math.min(stageOf(d.pet.pets[s2.id].xp), s2.stages.length - 1)] : s2.stages[0];
        const label = owned ? (tx("stage") + " " + (Math.min(stageOf(d.pet.pets[s2.id].xp), s2.stages.length - 1) + 1)) : (tx("adopt") + " 🪙" + PET_PRICE);
        return `<button class="bd-cell ${on ? "sel" : ""}" onclick="window.__bdRoster('${s2.id}')">
          <div class="e" style="${owned ? "" : "filter:grayscale(1);opacity:.55"}">${face2}</div>
          <div class="n">${lang === "zh" ? s2.zh : s2.en}</div><div class="p">${label}</div></button>`;
      }).join("")}</div>
      <h3 style="margin:14px 0 2px">${tx("shop")} 🛍️</h3>
      <div class="bd-grid">${SHOP.map(item => {
        const owned = d.pet.accessories.includes(item.id);
        const on = d.pet.worn.includes(item.id);
        const label = owned ? (on ? tx("remove") : tx("wear")) : ("🪙 " + item.price);
        return `<button class="bd-cell ${on ? "sel" : ""}" onclick="window.__bdShop('${item.id}')">
          <div class="e">${item.emoji}</div><div class="n">${lang === "zh" ? item.zh : item.en}</div><div class="p">${label}</div></button>`;
      }).join("")}</div>
      <p class="bd-note">${tx("otherApp")}</p>`;
  }

  window.__bdPick = function (id) { /* first animal — free */
    const d = load(); d.pet.pets[id] = { xp: 0 }; d.pet.active = id; save(d); render();
  };
  window.__bdRoster = function (id) {
    const d = load();
    if (d.pet.pets[id]) {                 /* already owned → switching is free */
      d.pet.active = id; save(d); render();
    } else {                              /* not owned → adopt for coins */
      if (d.coins < PET_PRICE) { toast(tx("notEnough")); return; }
      d.coins -= PET_PRICE; d.pet.pets[id] = { xp: 0 }; d.pet.active = id;
      save(d); render(); toast(tx("adopted"));
    }
  };
  window.__bdFeed = function () {
    const d = load(); const ap = activePet(d);
    if (!ap) return;
    if (d.coins < FEED_COST) { toast(tx("notEnough")); return; }
    const before = stageOf(ap.data.xp);
    d.coins -= FEED_COST; ap.data.xp += 1; save(d);
    toast(stageOf(ap.data.xp) > before ? tx("grewMsg") : tx("fedMsg"));
    render();
    const el = document.querySelector(".bd-pet");   /* munch animation */
    if (el) { el.classList.add("eat"); setTimeout(() => el.classList.remove("eat"), 750); }
  };
  window.__bdShop = function (id) {
    const d = load(); const item = SHOP.find(s => s.id === id); if (!item) return;
    if (!d.pet.accessories.includes(id)) {
      if (d.coins < item.price) { toast(tx("notEnough")); return; }
      d.coins -= item.price; d.pet.accessories.push(id); d.pet.worn.push(id);
    } else {
      const i = d.pet.worn.indexOf(id);
      if (i >= 0) d.pet.worn.splice(i, 1); else d.pet.worn.push(id);
    }
    save(d); render();
  };

  function openPanel() {
    $(".bd-overlay").classList.add("on");
    render();
  }

  /* ---- boot: inject styles + widget, grant daily login bonus ---- */
  function boot() {
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    /* Funding bar goes at the END of the page content, so it reads as a
       footer. Appending to <body> puts it after whatever wrapper the
       page uses, without each page needing its own copy. */
    if (typeof FUNDING !== "undefined") {
      const fu = document.createElement("div");
      fu.className = "bd-fund";
      fu.innerHTML = fundingHTML();
      document.body.appendChild(fu);
      /* keeps the floating pet button clear of the links above */
      const sp = document.createElement("div");
      sp.className = "bd-fund-spacer";
      document.body.appendChild(sp);
    }

    const b = document.createElement("button"); b.className = "bd-fab"; b.setAttribute("aria-label", "Campus Buddy");
    b.onclick = openPanel; document.body.appendChild(b);
    const ov = document.createElement("div"); ov.className = "bd-overlay";
    ov.innerHTML = `<div class="bd-panel"></div>`;
    ov.addEventListener("click", (e) => { if (e.target === ov) ov.classList.remove("on"); });
    document.body.appendChild(ov);

    const d = rollDay(load());
    /* count distinct visit days (used for the anonymous return-visit stats) */
    const firstOfDay = d.lastVisitDay !== today();
    if (firstOfDay) { d.visitDays = (d.visitDays || 0) + 1; d.lastVisitDay = today(); }
    save(d);
    if (d.daily.login === 0) {
      const g = Buddy.addCoins("login");
      if (g > 0) setTimeout(() => toast("📅 " + tx("loginBonus") + g + " 🪙"), 400);
    }
    render();
    bootAnalytics(firstOfDay, d.visitDays);
  }

  /* ---------- anonymous usage counting (only runs if a code is set) ---------- */
  function bootAnalytics(firstOfDay, visitDays) {
    try {
      if (!ANALYTICS.goatcounterCode) return;
      const src = (new URLSearchParams(location.search).get("src") || "").replace(/[^a-z0-9-]/gi, "");
      const page = (location.pathname.split("/").pop() || "index").replace(".html", "");
      window.goatcounter = { no_onload: true };
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://gc.zgo.at/count.js";
      s.dataset.goatcounter = "https://" + ANALYTICS.goatcounterCode + ".goatcounter.com/count";
      s.addEventListener("load", () => {
        try {
          /* one pageview, labeled by which QR code / link brought them here */
          window.goatcounter.count({ path: page + (src ? "-src-" + src : ""), title: document.title });
          /* once per day: an event recording that this is the visitor's Nth distinct day */
          if (firstOfDay) {
            const n = visitDays;
            const bucket = n === 1 ? "day-1" : n === 2 ? "day-2" : n <= 6 ? "day-3-6" : n <= 13 ? "day-7-13" : "day-14plus";
            window.goatcounter.count({ path: "return-" + bucket, event: true });
          }
        } catch (e) {}
      });
      document.head.appendChild(s);
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
