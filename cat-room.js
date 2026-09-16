/* =====================================================================
   cat-room.js  —  THE SCREEN PEOPLE ACTUALLY SEE
   =====================================================================
   This draws the cat's room and the shop. It is the real visitor-facing
   interface — not to be confused with cat-bowl-demo.html or
   sprite-lab.html, which are workbenches for you and are never shown to
   anybody.

   It does not decide any RULES. Prices, timings, what exists and where
   it sits all live in cat-items.js; the sums live in cat-state.js. This
   file only paints the picture and handles taps.

   ---------------------------------------------------------------------
   THE ROOM HAS NO BACKGROUND PICTURE
   ---------------------------------------------------------------------
   There is no illustrated background, so the room is drawn from flat
   bands of colour: a wall, a skirting board, a floor, and optionally a
   simple window and rug. Hard edges, no soft gradients, so it sits
   properly next to pixel art instead of fighting it.

   All of those colours are in ROOM_STYLE in cat-items.js. If you ever
   get a real painted background, put the file in items/ and write its
   name into ROOM_STYLE.image — this file will use it instead and ignore
   the colours. Nothing else needs changing.
   ===================================================================== */

const CatRoom = (function () {
  "use strict";

  /* =====================================================================
     ✏️ EDIT HERE — all the wording on screen, Chinese and English.
     Change what is inside the "quotes" only.
     ===================================================================== */
  const T = {
    title:     { zh: "我的貓房間",   en: "My cat's room" },
    coins:     { zh: "金幣",         en: "coins" },
    feed:      { zh: "餵食",         en: "Feed" },
    water:     { zh: "加水",         en: "Water" },
    full:      { zh: "已經滿了",     en: "Already full" },
    needBowl:  { zh: "先買一個碗吧", en: "Buy a bowl first" },
    needWater: { zh: "先買水吧",     en: "Buy water first" },
    noCoins:   { zh: "金幣不夠，去玩遊戲賺一點！", en: "Not enough coins — play a game to earn some!" },
    yum:       { zh: "好好吃～",     en: "Yum!" },
    fresh:     { zh: "清涼的水～",   en: "Fresh water!" },
    pickCat:   { zh: "選一隻貓咪吧！第一隻免費 🎉", en: "Pick a cat! The first one is free 🎉" },
    shop:      { zh: "小舖",         en: "Shop" },
    tabCats:   { zh: "貓咪",         en: "Cats" },
    tabFurn:   { zh: "家具",         en: "Furniture" },
    tabToys:   { zh: "玩具",         en: "Toys" },
    tabAcc:    { zh: "配件",         en: "Accessories" },
    owned:     { zh: "已擁有",       en: "Owned" },
    inRoom:    { zh: "使用中",       en: "In the room" },
    wearing:   { zh: "穿戴中",       en: "Worn" },
    active:    { zh: "陪伴中",       en: "Out now" },
    free:      { zh: "免費",         en: "Free" },
    bought:    { zh: "買好了！",     en: "Bought!" },
    switched:  { zh: "換貓咪囉～",   en: "Switched!" },
    emptyOk:   { zh: "空的也沒關係 🙂", en: "Empty is perfectly fine 🙂" },
    nextDrop:  { zh: "約 {h} 小時後少一格", en: "Drops a level in about {h}h" },
    petHint:   { zh: "點貓咪摸摸牠 · 點玩具陪牠玩", en: "Tap a cat to pet it · tap a toy to play" },
    purr:      { zh: "呼嚕呼嚕～", en: "Purr…" },
    playing:   { zh: "玩得好開心！", en: "So much fun!" },
    dressing:  { zh: "正在打扮：", en: "Dressing: " },
    dressHint: { zh: "每隻貓可以穿不同的配件，去「貓咪」分頁換一隻。",
                 en: "Each cat wears its own things — switch cats in the Cats tab." },
    appetite:  { zh: "{n} 隻貓，吃得比較快", en: "{n} cats — the bowl empties faster" },
    tipTitle:  { zh: "今日小知識", en: "Today's tip" },
  };

  /* ✏️ EDIT HERE — the little headings inside each shop tab.
     Without these, a tab with 22 things in it is one long wall of
     identical tiles; the headings break it into scannable groups. */
  const GROUPS = {
    bowl:    { zh: "碗",       en: "Bowls" },
    water:   { zh: "水",       en: "Water" },
    bed:     { zh: "床",       en: "Beds" },
    post:    { zh: "貓抓柱",   en: "Scratching posts" },
    carrier: { zh: "提籠",     en: "Carriers" },
    plant:   { zh: "植物",     en: "Plants" },
    toy:     { zh: "玩具",     en: "Toys" },
    food:    { zh: "零食",     en: "Treats" },
    collar:  { zh: "項圈",     en: "Collars" },
    bow:     { zh: "蝴蝶結",   en: "Bows" },
    heart:   { zh: "愛心",     en: "Hearts" },
    hat:     { zh: "帽子",     en: "Hats" },
    seasonal:{ zh: "節慶",     en: "Seasonal" },
  };

  let lang = "zh";
  let host = null;            // the element we draw into
  let toastFn = null;         // borrowed from pet-shared.js so messages match
  const tx = (k) => (T[k] ? T[k][lang] : k);
  const nm = (o) => (lang === "zh" ? o.zh : o.en);

  /* Remembers which image files exist, so a missing PNG is probed once
     rather than on every repaint. */
  const imgOK = {};

  /* =====================================================================
     STYLES. Injected once. Kept here so this file is self-contained.
     ===================================================================== */
  const CSS = `
  .cr-wrap{font-family:inherit;color:var(--ink,#3A3029)}
  .cr-top{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}
  .cr-top h2{margin:0;font-size:19px}
  .cr-coins{font-weight:900;font-size:16px;white-space:nowrap}

  /* ---------- the room ---------- */
  .cr-room{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;
    border:2.5px solid var(--ink,#3A3029);border-radius:16px;
    box-shadow:3px 3px 0 var(--ink,#3A3029);background:#EFE3C8}
  .cr-layer{position:absolute;left:0;right:0}
  .cr-thing{position:absolute;transform:translate(-50%,-50%);
    image-rendering:pixelated;image-rendering:crisp-edges;
    background-repeat:no-repeat;background-position:center bottom;background-size:contain}
  .cr-cat{position:absolute;transform:translate(-50%,-50%);
    image-rendering:pixelated;image-rendering:crisp-edges;background-repeat:no-repeat}
  /* stand-in shown only while a PNG is still missing */
  .cr-ghost{border-radius:8px;background:rgba(58,48,41,.16);
    border:2px dashed rgba(58,48,41,.35)}
  .cr-catghost{border-radius:50%;border:2.5px solid var(--ink,#3A3029);
    display:flex;align-items:center;justify-content:center;
    font-weight:900;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.45)}
  .cr-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
    text-align:center;padding:18px;font-weight:800;font-size:15px;line-height:1.6}

  /* ---------- action buttons under the room ---------- */
  .cr-acts{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
  .cr-btn{flex:1;min-width:120px;border:2.5px solid var(--ink,#3A3029);border-radius:14px;
    background:var(--yolk,#F3B72B);color:var(--ink,#3A3029);font-family:inherit;
    font-weight:800;font-size:15px;padding:10px 12px;cursor:pointer;
    box-shadow:3px 3px 0 var(--ink,#3A3029)}
  .cr-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink,#3A3029)}
  .cr-btn[disabled]{opacity:.45;cursor:not-allowed;box-shadow:2px 2px 0 rgba(58,48,41,.4)}
  .cr-btn .cr-sub{display:block;font-size:11.5px;font-weight:700;opacity:.8;margin-top:1px}

  /* ---------- shop ---------- */
  .cr-shop{margin-top:16px}
  .cr-tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch}
  .cr-tab{flex:none;border:2.5px solid var(--ink,#3A3029);border-radius:999px;
    background:var(--card,#fff);color:var(--ink,#3A3029);font-family:inherit;
    font-weight:800;font-size:13.5px;padding:7px 14px;cursor:pointer;
    box-shadow:2px 2px 0 var(--ink,#3A3029);white-space:nowrap}
  .cr-tab.on{background:var(--yolk,#F3B72B)}
  .cr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));
    gap:8px;margin-top:6px}
  .cr-cell{background:var(--card,#fff);border:2px solid var(--ink,#3A3029);border-radius:14px;
    box-shadow:2px 2px 0 var(--ink,#3A3029);padding:8px 5px 7px;text-align:center;
    cursor:pointer;font-family:inherit;color:inherit;display:flex;flex-direction:column;
    align-items:center;gap:4px}
  .cr-cell:active{transform:translate(1px,1px);box-shadow:1px 1px 0 var(--ink,#3A3029)}
  .cr-cell.on{background:var(--yolk,#F3B72B)}
  .cr-cell.locked{opacity:.92}
  .cr-pic{width:42px;height:42px;image-rendering:pixelated;image-rendering:crisp-edges;
    background-repeat:no-repeat;background-position:center;background-size:contain;flex:none}
  .cr-pic.cr-ghost{border-radius:8px}
  .cr-nm{font-size:12px;font-weight:800;line-height:1.25}
  .cr-pr{font-size:11.5px;opacity:.8;font-weight:700}
  .cr-group{margin-top:12px}
  .cr-group h4{margin:0 0 2px;font-size:13px;font-weight:800;opacity:.75;
    letter-spacing:.04em;display:flex;align-items:center;gap:8px}
  .cr-group h4::after{content:"";flex:1;height:2px;background:rgba(58,48,41,.16);border-radius:2px}
  .cr-note{font-size:12px;opacity:.72;text-align:center;margin-top:12px;line-height:1.6}
  .cr-cat{cursor:pointer}
  .cr-thing.cr-playable{cursor:pointer}
  /* the little heart that floats up when you pet a cat */
  .cr-pop{position:absolute;transform:translate(-50%,-50%);z-index:400;
    font-size:20px;pointer-events:none;animation:crPop 1.1s ease-out forwards}
  @keyframes crPop{
    0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}
    25%{opacity:1;transform:translate(-50%,-110%) scale(1.15)}
    100%{opacity:0;transform:translate(-50%,-230%) scale(1)}}
  .cr-hint{font-size:12px;opacity:.7;text-align:center;margin-top:7px}
  /* today's nutrition tip, from foods-data.js */
  .cr-tip{margin-top:12px;border:2.5px solid var(--ink,#3A3029);border-radius:14px;
    background:var(--card,#fff);box-shadow:3px 3px 0 var(--ink,#3A3029);padding:11px 13px}
  .cr-tip b{display:block;font-size:12px;opacity:.7;margin-bottom:3px}
  .cr-tip span{font-size:13.5px;font-weight:700;line-height:1.6}
  @media (prefers-reduced-motion:reduce){ .cr-cat{animation:none} .cr-pop{animation:none;opacity:0} }
  `;

  /* =====================================================================
     DRAWING THE ROOM BACKGROUND.
     Either the visitor's own picture, or bands of flat colour.
     ===================================================================== */
  function roomBackgroundHTML() {
    const st = (typeof ROOM_STYLE !== "undefined") ? ROOM_STYLE : {};

    /* If a real background picture has been supplied, use it and stop. */
    if (st.image) {
      return `<div class="cr-layer" style="top:0;bottom:0;
        background:url('items/${encodeURIComponent(st.image)}') center/cover no-repeat"></div>`;
    }

    const top = st.floorTop || 52;
    let h = "";
    /* wall, with a slightly darker band up top for a bit of depth */
    h += `<div class="cr-layer" style="top:0;height:${top}%;background:${st.wall || "#EFE3C8"}"></div>`;
    h += `<div class="cr-layer" style="top:0;height:${Math.round(top * 0.28)}%;background:${st.wallShade || "#E7D8B8"}"></div>`;

    /* a simple window: frame, glass, and one cross bar */
    if (st.window) {
      h += `<div style="position:absolute;left:62%;top:${Math.round(top * 0.18)}%;
        width:26%;height:${Math.round(top * 0.52)}%;background:${st.windowGlass || "#CFE4E8"};
        border:3px solid ${st.skirting || "#C8A87A"};border-radius:3px"></div>`;
      h += `<div style="position:absolute;left:74.5%;top:${Math.round(top * 0.18)}%;
        width:3px;height:${Math.round(top * 0.52)}%;background:${st.skirting || "#C8A87A"}"></div>`;
    }

    /* skirting board where wall meets floor */
    h += `<div class="cr-layer" style="top:${top}%;height:3.5%;background:${st.skirting || "#C8A87A"}"></div>`;
    /* the floor */
    h += `<div class="cr-layer" style="top:${top + 3.5}%;bottom:0;background:${st.floor || "#E3CBA1"}"></div>`;
    /* a few floorboard lines, evenly spaced */
    for (let i = 1; i <= 3; i++) {
      const y = top + 3.5 + ((100 - top - 3.5) * i) / 4;
      h += `<div class="cr-layer" style="top:${y}%;height:2px;background:${st.floorLine || "#C9A87C"};opacity:.55"></div>`;
    }
    /* a soft rug, so the middle of the floor is not bare */
    if (st.rug) {
      h += `<div style="position:absolute;left:50%;top:80%;width:62%;height:26%;
        transform:translate(-50%,-50%);border-radius:50%;
        background:${st.rugColor || "#E2B9A0"};opacity:.55"></div>`;
    }
    return h;
  }

  /* =====================================================================
     THE SPRITE TRICK — one 32x32 window onto the whole cat sheet.
     Explained at length in cat-frames.js; this is the same idea.
     ===================================================================== */
  function catSpriteStyle(colour, frame, col, sizePx) {
    const F = CAT_SHEET.frame;
    const scale = sizePx / F;
    return `width:${sizePx}px;height:${sizePx}px;` +
      `background-image:url('${catSheetURL(colour.file)}');` +
      `background-size:${CAT_SHEET.cols * F * scale}px ${CAT_SHEET.rows * F * scale}px;` +
      `background-position:${-col * F * scale}px ${-frame.row * F * scale}px;`;
  }

  /* Check whether an image file is really there. Used so a missing PNG
     shows a neutral stand-in instead of a broken-image icon. */
  function probe(url, onDone) {
    if (imgOK[url] !== undefined) { onDone(imgOK[url]); return; }
    const im = new Image();
    im.onload  = function () { imgOK[url] = true;  onDone(true); };
    im.onerror = function () { imgOK[url] = false; onDone(false); };
    im.src = url;
  }

  const dotColour = (id) =>
    ({ black: "#3A3029", gray: "#8B8B8B", brown: "#8B5E3C", calico: "#D98B45" })[id] || "#8A7A66";

  /* =====================================================================
     PAINTING THE ROOM
     ===================================================================== */
  let cats = [];      // the sprites currently animating
  let raf = null;

  function paintRoom(cat) {
    const room = host.querySelector(".cr-room");
    if (!room) return;
    room.innerHTML = roomBackgroundHTML();

    const roomW = room.getBoundingClientRect().width || 320;
    const catPx = Math.max(24, Math.round(roomW * 0.17));

    /* nobody adopted yet */
    if (CatState.catCount(cat) === 0) {
      room.insertAdjacentHTML("beforeend",
        `<div class="cr-empty">${tx("pickCat")}</div>`);
      cats = [];
      return;
    }

    /* ---- furniture that belongs to a spot (bowl, water, bed) ---- */
    ROOM_SPOTS.forEach(sp => {
      if (!sp.needs || !cat.placed[sp.needs]) return;
      let file = null;
      if (sp.needs === "bowl")       file = CatState.dishImage(cat, "food");
      else if (sp.needs === "water") file = CatState.dishImage(cat, "water");
      else {
        const it = CatState.item(cat.placed[sp.needs]);
        file = it && it.file;
      }
      if (!file) return;   /* e.g. an empty water dish draws nothing */
      addThing(room, file, sp.ix || sp.x, sp.iy || sp.y, 18, roomW);
    });

    /* ---- decoration ---- */
    CatState.decorLayout(cat).forEach(d => {
      const slot = ROOM_DECOR.find(r => r.needs === d.category) || {};
      const el = addThing(room, d.file, d.x, d.y, slot.size || 16, roomW);
      /* toys can be played with; other decoration is just scenery */
      if (d.category === "toy") {
        el.classList.add("cr-playable");
        el.addEventListener("click", function (ev) {
          ev.stopPropagation(); playWithToy(d.x, d.y);
        });
      }
    });

    /* ---- the cats ---- */
    cats = [];
    CatState.arrangeCats(cat).forEach(spot => {
      const colour = CAT_COLORS.find(c => c.id === spot.colour);
      if (!colour) return;
      const frame = catFrame(spot.pose);

      const el = document.createElement("div");
      el.className = "cr-cat";
      el.style.left = spot.x + "%";
      el.style.top  = spot.y + "%";
      el.style.zIndex = 5 + Math.round(spot.y);   /* nearer the front = on top */
      room.appendChild(el);

      const url = catSheetURL(colour.file);
      probe(url, function (ok) {
        if (ok) {
          el.style.cssText += catSpriteStyle(colour, frame, frame.from, catPx);
          const c = { el: el, colour: colour, frame: frame, base: frame, i: 0, t: 0, size: catPx };
          cats.push(c);
          el.addEventListener("click", function (ev) { ev.stopPropagation(); petCat(c); });
        } else {
          /* no sheet uploaded yet — a friendly stand-in */
          el.className = "cr-cat cr-catghost";
          el.style.width = catPx + "px";
          el.style.height = catPx + "px";
          el.style.fontSize = Math.round(catPx * 0.4) + "px";
          el.style.background = dotColour(colour.id);
          el.textContent = (colour.en || "?").charAt(0);
          el.addEventListener("click", function (ev) {
            ev.stopPropagation();
            pop(room, spot.x, spot.y, "💛");
            say(tx("purr"));
          });
        }
      });

      /* each cat wears its OWN accessories, so all of them show */
      paintWorn(room, cat, spot, catPx);
    });

    startTicker();
  }

  /* Draw one piece of furniture or decoration. */
  function addThing(room, file, x, y, sizePct, roomW) {
    const el = document.createElement("div");
    el.className = "cr-thing";
    const px = Math.round(roomW * (sizePct / 100));
    el.style.left = x + "%";
    el.style.top = y + "%";
    el.style.width = px + "px";
    el.style.height = px + "px";
    el.style.zIndex = Math.round(y);
    room.appendChild(el);
    const url = "items/" + encodeURIComponent(file);
    probe(url, function (ok) {
      if (ok) el.style.backgroundImage = `url('${url}')`;
      else el.classList.add("cr-ghost");   /* stand-in until the PNG exists */
    });
    return el;
  }

  /* Accessories worn by the cat that is currently out. */
  function paintWorn(room, cat, spot, catPx) {
    CatState.wornBy(cat, spot.colour).forEach(id => {
      const item = CatState.item(id);
      if (!item) return;
      const file = item.frames ? item.frames[0] : item.file;
      if (!file) return;
      const el = document.createElement("div");
      el.className = "cr-thing";
      el.style.left = spot.x + "%";
      el.style.top = (spot.y - 6) + "%";       /* ✏️ nudge: how high it sits */
      el.style.width = Math.round(catPx * 0.6) + "px";
      el.style.height = Math.round(catPx * 0.6) + "px";
      el.style.zIndex = 200;
      room.appendChild(el);
      const url = "items/" + encodeURIComponent(file);
      probe(url, function (ok) { if (ok) el.style.backgroundImage = `url('${url}')`; else el.remove(); });
    });
  }

  /* =====================================================================
     THE ANIMATION LOOP.
     ONE loop drives every cat, rather than a timer each. Each cat keeps
     its own position in its own animation and advances at its own speed.
     ===================================================================== */
  function startTicker() {
    if (raf) cancelAnimationFrame(raf);
    let last = 0;
    function step(now) {
      const dt = last ? now - last : 0;
      last = now;
      cats.forEach(c => {
        if (c.frame.count <= 1 || !c.frame.fps) return;   /* a still pose */
        c.t += dt;
        const per = 1000 / c.frame.fps;
        while (c.t >= per) {
          c.t -= per;
          c.i++;
          if (c.i >= c.frame.count) c.i = (c.frame.loop === "once") ? c.frame.count - 1 : 0;
          applyFrame(c);
        }
      });
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function stopTicker() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  /* Put one frame on screen. Used when an animation is swapped. */
  function applyFrame(c) {
    const F = CAT_SHEET.frame, scale = c.size / F;
    c.el.style.backgroundPosition =
      `${-(c.frame.from + c.i) * F * scale}px ${-c.frame.row * F * scale}px`;
  }

  /* =====================================================================
     REACTIONS — petting and playing.
     Both are FREE and give no coins. They exist purely so the room is
     nice to touch. Coins stay tied to the nutrition games, which is a
     deliberate rule of this project, not an oversight.
     ===================================================================== */

  /* Temporarily swap a cat's animation, then put it back. */
  function react(c, poseName, ms) {
    const f = catFrame(poseName);
    if (!f) return;
    if (!c.base) c.base = c.frame;
    c.frame = f; c.i = 0; c.t = 0;
    applyFrame(c);
    clearTimeout(c.revert);
    c.revert = setTimeout(function () {
      c.frame = c.base; c.i = 0; c.t = 0;
      if (c.el.isConnected) applyFrame(c);
    }, ms);
  }

  /* A little symbol floating up from a point in the room. */
  function pop(room, xPct, yPct, symbol) {
    const el = document.createElement("div");
    el.className = "cr-pop";
    el.style.left = xPct + "%";
    el.style.top = yPct + "%";
    el.textContent = symbol;
    room.appendChild(el);
    setTimeout(function () { el.remove(); }, 1200);
  }

  /* Pet a cat: it purrs and looks pleased. Free, always available. */
  function petCat(c) {
    const room = host.querySelector(".cr-room");
    react(c, "meow-sit", 1500);
    pop(room, parseFloat(c.el.style.left), parseFloat(c.el.style.top), "💛");
    say(tx("purr"));
  }

  /* Play with a toy: the nearest cat CUTS over to it, plays, and cuts
     back. Cutting rather than walking is the same trick the room already
     uses between visits — no pathfinding, nothing to go wrong. */
  function playWithToy(x, y) {
    if (!cats.length) return;
    const room = host.querySelector(".cr-room");

    /* whichever cat is nearest the toy joins in */
    let best = cats[0], bestD = 1e9;
    cats.forEach(c => {
      const d = Math.hypot(parseFloat(c.el.style.left) - x,
                           (parseFloat(c.el.style.top) - y) * 0.75);
      if (d < bestD) { bestD = d; best = c; }
    });

    const homeX = best.el.style.left, homeY = best.el.style.top;
    best.el.style.left = (x + 9) + "%";        /* stand beside it, not on it */
    best.el.style.top = y + "%";
    react(best, "play", 3200);
    pop(room, x, y, "✨");
    say(tx("playing"));

    clearTimeout(best.goHome);
    best.goHome = setTimeout(function () {
      if (best.el.isConnected) { best.el.style.left = homeX; best.el.style.top = homeY; }
    }, 3200);
  }

  /* =====================================================================
     THE SHOP
     ===================================================================== */
  const TABS = [
    { id: "cats",  label: "tabCats", cats: true },
    { id: "furn",  label: "tabFurn", of: ["bowl", "water", "bed", "post", "carrier", "plant"] },
    { id: "toys",  label: "tabToys", of: ["toy", "food"] },
    { id: "acc",   label: "tabAcc",  of: ["collar", "bow", "heart", "hat", "seasonal"] },
  ];
  let tab = "cats";

  function shopHTML(cat) {
    const tabs = TABS.map(t =>
      `<button class="cr-tab ${t.id === tab ? "on" : ""}" data-tab="${t.id}">${tx(t.label)}</button>`
    ).join("");

    const def = TABS.find(t => t.id === tab) || TABS[0];
    let cells = "";

    if (def.cats) {
      cells = CatState.catRoster(cat).map(c => {
        const label = c.owned ? (c.active ? tx("active") : tx("owned"))
                              : (c.price ? "🪙 " + c.price : tx("free"));
        return cell("cat:" + c.id, nm(c), label, c.active, !c.owned,
                    `<div class="cr-pic cr-catghost" style="background:${dotColour(c.id)};
                       font-size:16px">${c.en.charAt(0)}</div>`);
      }).join("");
      cells = `<div class="cr-grid">${cells}</div>`;
    } else {
      const items = CatState.catalogue().filter(i => def.of.indexOf(i.category) >= 0);

      /* Split into groups (bowls, beds, posts...) and give each a small
         heading, in the order the tab lists its categories. A single
         un-broken grid of 22 tiles is hard to read and looks unfinished. */
      /* Accessories belong to one cat, so say which one is being dressed. */
      let who = "";
      if (def.id === "acc") {
        const active = CAT_COLORS.find(c => c.id === cat.active);
        who = active
          ? `<div class="cr-hint" style="margin:6px 0 0"><b>${tx("dressing")}${nm(active)}</b><br>${tx("dressHint")}</div>`
          : "";
      }

      cells = who + def.of.map(category => {
        const group = items.filter(i => i.category === category);
        if (!group.length) return "";
        const heading = GROUPS[category] ? nm(GROUPS[category]) : category;
        const tiles = group.map(i => {
          const owned = CatState.owns(cat, i.id);
          const wearable = CatState.isWearable(i);
          const on = wearable ? CatState.wornBy(cat).indexOf(i.id) >= 0
                              : cat.placed[i.category] === i.id;
          const label = !owned ? "🪙 " + (i.price || 0)
                       : on ? (wearable ? tx("wearing") : tx("inRoom"))
                       : tx("owned");
          const file = i.levels ? i.levels[i.levels.length - 1]
                     : i.frames ? i.frames[0] : i.file;
          return cell("item:" + i.id, nm(i), label, on, !owned,
                      `<div class="cr-pic" data-img="${file || ""}"></div>`);
        }).join("");
        return `<div class="cr-group"><h4>${heading}</h4>
                  <div class="cr-grid">${tiles}</div></div>`;
      }).join("");
    }

    return `<div class="cr-shop">
      <h3 style="margin:0 0 8px;font-size:16px">${tx("shop")} 🛍️</h3>
      <div class="cr-tabs">${tabs}</div>
      ${cells}
    </div>`;
  }

  function cell(action, name, label, on, locked, pic) {
    return `<button class="cr-cell ${on ? "on" : ""} ${locked ? "locked" : ""}"
      data-act="${action}">${pic}
      <div class="cr-nm">${name}</div><div class="cr-pr">${label}</div></button>`;
  }

  /* =====================================================================
     THE WHOLE PANEL
     ===================================================================== */
  function html(cat) {
    const foodLvl  = cat.dishes.food.level;
    const waterLvl = cat.dishes.water.level;
    const hasBowl  = !!cat.placed.bowl;
    const hasWater = !!cat.placed.water;
    const coins    = (typeof Buddy !== "undefined") ? Buddy.coins() : 0;

    const mouths    = CatState.catCount(cat);
    const foodFull  = hasBowl  && foodLvl  >= BOWL_RULES.maxLevel;
    const waterFull = hasWater && waterLvl >= WATER_RULES.maxLevel;

    const sub = (has, full, rules, lvl) =>
      !has  ? "" :
      full  ? tx("full") :
      lvl === 0 ? tx("emptyOk")
                : tx("nextDrop").replace("{h}", CatState.hoursUntilDrop(cat, rules, Date.now()) || 0);

    return `<div class="cr-wrap">
      <div class="cr-top">
        <h2>${tx("title")}</h2>
        <span class="cr-coins">🪙 ${coins}</span>
      </div>
      <div class="cr-room"></div>
      <div class="cr-hint">${tx("petHint")}${mouths > 1 ? " · " + tx("appetite").replace("{n}", mouths) : ""}</div>
      <div class="cr-acts">
        <button class="cr-btn" data-act="feed:food" ${(!hasBowl || foodFull) ? "disabled" : ""}>
          🍚 ${hasBowl ? tx("feed") + " −" + BOWL_RULES.feedCost : tx("needBowl")}
          <span class="cr-sub">${sub(hasBowl, foodFull, "food", foodLvl)}</span>
        </button>
        <button class="cr-btn" data-act="feed:water" ${(!hasWater || waterFull) ? "disabled" : ""}>
          💧 ${hasWater ? tx("water") + " −" + WATER_RULES.feedCost : tx("needWater")}
          <span class="cr-sub">${sub(hasWater, waterFull, "water", waterLvl)}</span>
        </button>
      </div>
      ${tipHTML()}
      ${shopHTML(cat)}
    </div>`;
  }

  /* =====================================================================
     TODAY'S TIP.
     Picks one of the `tip` lines already written on the foods in
     foods-data.js, and shows the same one all day. It costs nothing to
     run, gives a small reason to look in daily, and — more to the point
     — every time someone opens the room to pet a cat they read one line
     of nutrition. That is the whole purpose of the pet.

     ✏️ TO ADD MORE TIPS: open foods-data.js and add a `tip` to any food.
     Only a handful have one so far, so the same few will repeat. This is
     an easy and genuinely useful job for a nutrition person — no coding.
     ===================================================================== */
  function tipHTML() {
    if (typeof FOODS === "undefined") return "";
    const pool = FOODS.filter(f => f.tip && (f.tip.zh || f.tip.en));
    if (!pool.length) return "";
    /* same tip all day: pick by the date, not at random, so it does not
       flicker to a different one every time the panel is reopened */
    const day = Math.floor(Date.now() / 86400000);
    const f = pool[day % pool.length];
    const text = (lang === "zh") ? (f.tip.zh || f.tip.en) : (f.tip.en || f.tip.zh);
    return `<div class="cr-tip"><b>${tx("tipTitle")} ${f.emoji}</b><span>${text}</span></div>`;
  }

  /* =====================================================================
     TAPS. One listener for the whole panel, reading data-act, rather
     than a separate handler on every button.
     ===================================================================== */
  function onTap(e) {
    const tabBtn = e.target.closest("[data-tab]");
    if (tabBtn) { tab = tabBtn.getAttribute("data-tab"); refresh(); return; }

    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.getAttribute("data-act");
    const [kind, id] = act.split(":");

    if (kind === "feed") {
      const r = CatState.feed(id);
      if (r.ok) say(id === "water" ? tx("fresh") : tx("yum"));
      else if (r.reason === "broke") say(tx("noCoins"));
      else if (r.reason === "full") say(tx("full"));
      refresh(); return;
    }

    if (kind === "cat") {
      const r = CatState.adopt(id);
      if (!r.ok) say(r.reason === "broke" ? tx("noCoins") : "");
      else say(r.switched ? tx("switched") : tx("bought"));
      refresh(); return;
    }

    if (kind === "item") {
      const cat = CatState.load();
      const item = CatState.item(id);
      if (!item) return;
      if (!CatState.owns(cat, id)) {
        const r = CatState.buy(id);
        say(r.ok ? tx("bought") : tx("noCoins"));
      } else if (CatState.isWearable(item)) {
        CatState.wear(id);          /* dresses the cat that is currently out */
      } else {
        CatState.place(id);
      }
      refresh();
    }
  }

  function say(msg) {
    if (!msg) return;
    if (toastFn) toastFn(msg);
  }

  /* Fill in the little shop thumbnails once we know which files exist. */
  function paintThumbs() {
    host.querySelectorAll(".cr-pic[data-img]").forEach(el => {
      const file = el.getAttribute("data-img");
      if (!file) { el.classList.add("cr-ghost"); return; }
      const url = "items/" + encodeURIComponent(file);
      probe(url, function (ok) {
        if (ok) el.style.backgroundImage = `url('${url}')`;
        else el.classList.add("cr-ghost");
      });
    });
  }

  function refresh() {
    if (!host) return;
    const cat = CatState.load();
    host.innerHTML = html(cat);
    paintThumbs();
    paintRoom(cat);
  }

  /* =====================================================================
     PUBLIC
     ===================================================================== */
  return {
    /* Draw the room into an element. Call once; then refresh() as needed. */
    mount(el, language, toast) {
      host = el;
      lang = (language === "en") ? "en" : "zh";
      toastFn = toast || null;
      if (!document.getElementById("cr-css")) {
        const st = document.createElement("style");
        st.id = "cr-css"; st.textContent = CSS;
        document.head.appendChild(st);
      }
      host.addEventListener("click", onTap);
      CatState.noteVisit();      /* a new visit: the cats move about */
      refresh();
      /* redraw on rotate / resize so sprite sizes stay right */
      window.addEventListener("resize", debounce(refresh, 200));
    },
    setLang(l) { lang = (l === "en") ? "en" : "zh"; refresh(); },
    refresh: refresh,
    stop: stopTicker,
  };

  function debounce(fn, ms) {
    let t = null;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }
})();
