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
    tipsBook:  { zh: "收集簿",     en: "Collection" },
    newTip:    { zh: "發現新的小知識！📖", en: "New tip found! 📖" },
    share:     { zh: "📸 拍照分享", en: "📸 Share a photo" },
    saved:     { zh: "圖片已下載，快分享吧！", en: "Image saved — share away!" },
    localOnly: { zh: "在自己電腦上直接開檔案時無法存圖，網站上線後就正常了。",
                 en: "Saving the photo doesn't work when opening the file directly — it works fine on the live site." },
    myCats:    { zh: "我的 {n} 隻貓", en: "My {n} cat{s}" },
    cardStyle: { zh: "卡片樣式", en: "Card style" },
    seasonal:  { zh: "限定", en: "Limited" },
    tabRoom:   { zh: "房間",       en: "Room" },
    feedWith:  { zh: "餵食",       en: "Feed" },
    bars:      { zh: "格",         en: "bars" },
    wasteHint: { zh: "碗裝不下，會浪費 {n} 格", en: "{n} bars would be wasted" },
  };

  /* ✏️ EDIT HERE — the little headings inside each shop tab.
     Without these, a tab with 22 things in it is one long wall of
     identical tiles; the headings break it into scannable groups. */
  const GROUPS = {
    bowl:    { zh: "碗",       en: "Bowls" },
    wall:    { zh: "壁紙",     en: "Wallpaper" },
    floor:   { zh: "地板",     en: "Flooring" },
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
  .cr-ghostbtn{background:var(--card,#fff);font-size:14px}
  .cr-btn .cr-sub{display:block;font-size:11.5px;font-weight:700;opacity:.8;margin-top:1px}

  /* ---------- shop ---------- */
  .cr-cards{margin-top:9px}
  .cr-cards-h{font-size:12px;font-weight:800;opacity:.7;margin-bottom:4px}
  .cr-cards-r{display:flex;gap:6px;overflow-x:auto;padding-bottom:3px}
  .cr-card{flex:none;border:3px solid;border-radius:10px;font-family:inherit;
    font-weight:800;font-size:11.5px;padding:6px 10px;cursor:pointer;
    display:flex;flex-direction:column;align-items:center;gap:1px;line-height:1.25}
  .cr-card.on{outline:2.5px solid var(--ink,#3A3029);outline-offset:1px}
  .cr-card i{font-style:normal;font-size:9px;opacity:.8;font-weight:800}
  .cr-feed{margin-top:10px}
  .cr-feed-h{font-size:13px;font-weight:800;margin-bottom:5px;display:flex;
    justify-content:space-between;align-items:baseline;gap:8px}
  .cr-feed-h span{font-weight:700;opacity:.7;font-size:11.5px;text-align:right}
  .cr-foods{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));gap:6px}
  .cr-food{border:2.5px solid var(--ink,#3A3029);border-radius:12px;background:var(--card,#fff);
    color:var(--ink,#3A3029);font-family:inherit;cursor:pointer;padding:7px 4px 6px;
    box-shadow:2px 2px 0 var(--ink,#3A3029);display:flex;flex-direction:column;gap:1px;align-items:center}
  .cr-food:active{transform:translate(1px,1px);box-shadow:1px 1px 0 var(--ink,#3A3029)}
  .cr-food[disabled]{opacity:.4;cursor:not-allowed}
  .cr-food.best{background:var(--yolk,#F3B72B)}
  .cr-food-n{font-size:14px;font-weight:900;line-height:1.1}
  .cr-food-nm{font-size:11px;font-weight:700;opacity:.85}
  .cr-food-p{font-size:11.5px;font-weight:800}
  .cr-food-w{font-size:9.5px;font-weight:700;color:#B4552C;line-height:1.2}
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
  .cr-swatch{border:2.5px solid;border-radius:7px;overflow:hidden;
    display:flex;flex-direction:column;justify-content:flex-start}
  .cr-swatch i{display:block;height:11px;width:100%}
  .cr-nm{font-size:12px;font-weight:800;line-height:1.25}
  .cr-pr{font-size:11.5px;opacity:.8;font-weight:700}
  .cr-group{margin-top:12px}
  .cr-group h4{margin:0 0 2px;font-size:13px;font-weight:800;opacity:.75;
    letter-spacing:.04em;display:flex;align-items:center;gap:8px}
  .cr-group h4::after{content:"";flex:1;height:2px;background:rgba(58,48,41,.16);border-radius:2px}
  .cr-note{font-size:12px;opacity:.72;text-align:center;margin-top:12px;line-height:1.6}
  .cr-cat{cursor:pointer}
  @media (prefers-reduced-motion:reduce){ .cr-cat{transition:none !important} }
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
  .cr-tip span{font-size:13.5px;font-weight:700;line-height:1.6;display:block}
  .cr-tipbtn{margin-top:9px;border:2px solid var(--ink,#3A3029);border-radius:10px;
    background:var(--paper,#FAF5EA);color:var(--ink,#3A3029);font-family:inherit;
    font-weight:800;font-size:12.5px;padding:5px 11px;cursor:pointer;
    box-shadow:2px 2px 0 var(--ink,#3A3029)}
  @media (prefers-reduced-motion:reduce){ .cr-cat{animation:none} .cr-pop{animation:none;opacity:0} }
  `;

  /* =====================================================================
     DRAWING THE ROOM BACKGROUND.
     Either the visitor's own picture, or bands of flat colour.
     ===================================================================== */
  function roomBackgroundHTML(cat) {
    const base = (typeof ROOM_STYLE !== "undefined") ? ROOM_STYLE : {};
    /* Start from the defaults, then paint over them with whatever
       wallpaper and flooring the visitor has bought. */
    const bought = CatState.decorStyle(cat);
    const st = Object.assign({}, base);
    if (bought.wall)  Object.assign(st, { wall: bought.wall.wall,
      wallShade: bought.wall.wallShade, skirting: bought.wall.skirting,
      pattern: bought.wall.pattern });
    if (bought.floor) Object.assign(st, { floor: bought.floor.floor,
      floorLine: bought.floor.floorLine });

    /* If a real background picture has been supplied, use it and stop. */
    if (st.image) {
      return `<div class="cr-layer" style="top:0;bottom:0;
        background:url('items/${encodeURIComponent(st.image)}') center/cover no-repeat"></div>`;
    }

    const top = st.floorTop || 52;
    let h = "";
    /* The wall. A pattern is drawn as repeating HARD-EDGED bands — the
       colour stops sit on top of each other so there is no soft fade.
       That keeps it looking printed rather than airbrushed, which is what
       lets it sit next to pixel art without looking out of place. */
    const wc = st.wall || "#EFE3C8";
    const ws = st.wallShade || "#E7D8B8";
    let pattern = "";
    if (st.pattern === "stripe") {
      pattern = `background-image:repeating-linear-gradient(90deg,
        ${ws} 0 6px, ${wc} 6px 20px);`;
    } else if (st.pattern === "check") {
      pattern = `background-image:repeating-linear-gradient(90deg, ${ws} 0 10px, transparent 10px 20px),
        repeating-linear-gradient(0deg, ${ws} 0 10px, ${wc} 10px 20px);`;
    }
    h += `<div class="cr-layer" style="top:0;height:${top}%;background:${wc};${pattern}"></div>`;
    if (!st.pattern || st.pattern === "plain") {
      h += `<div class="cr-layer" style="top:0;height:${Math.round(top * 0.28)}%;background:${ws}"></div>`;
    }

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
    room.innerHTML = roomBackgroundHTML(cat);

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

  /* ---------------------------------------------------------------------
     WALKING TO SOMETHING.

     Between visits the cats simply appear in new places — nobody is
     watching, so there is nothing to animate. But moving a cat WHILE
     someone is looking is different: teleporting across the room reads
     as a glitch.

     So a tap makes the cat walk. It is a straight slide from A to B
     (CSS does the moving) with the pack's own walking animation playing
     during the trip, and the cat facing the way it is going. That is not
     pathfinding — there is no route to work out, nothing to bump into,
     and no way for it to get stuck. If the walk frames were ever missing
     the cat would still slide there, just without its legs moving.
     --------------------------------------------------------------------- */
  const WALK_MS = 900;            /* ✏️ how long a trip takes */

  function walkTo(c, x, y, thenPose, holdMs, onArrive) {
    const fromX = parseFloat(c.el.style.left);
    const fromY = parseFloat(c.el.style.top);
    const dx = x - fromX, dy = y - fromY;
    if (!c.home) c.home = { x: fromX, y: fromY };

    /* face the way we are going: mostly sideways, or up/down if the trip
       is more vertical than horizontal */
    let walk = "walk-right";
    if (Math.abs(dx) < Math.abs(dy) * 0.75) walk = dy > 0 ? "walk-down" : "walk-up";
    else if (dx < 0) walk = "walk-left";

    /* how long, scaled a little by distance so short hops are quick */
    const dist = Math.hypot(dx, dy * 0.75);
    const ms = Math.max(260, Math.round(WALK_MS * Math.min(1, dist / 55)));

    react(c, walk, ms);
    c.el.style.transition = `left ${ms}ms linear, top ${ms}ms linear`;
    c.el.style.left = x + "%";
    c.el.style.top = y + "%";

    clearTimeout(c.arrive);
    c.arrive = setTimeout(function () {
      if (!c.el.isConnected) return;
      c.el.style.transition = "";
      if (thenPose) react(c, thenPose, holdMs || 2000);
      if (onArrive) onArrive();
    }, ms);
    return ms;
  }

  /* Send a cat back where it came from, walking again. */
  function walkHome(c) {
    if (!c.home || !c.el.isConnected) return;
    walkTo(c, c.home.x, c.home.y);
    c.home = null;
  }

  /* Play with a toy: the nearest cat walks over, plays with it, and
     walks back to where it was. */
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
    if (best.busy) return;                 /* already on its way */
    best.busy = true;

    const PLAY_MS = 3000;
    const trip = walkTo(best, x + 9, y, "play", PLAY_MS, function () {
      pop(room, x, y, "✨");
    });
    say(tx("playing"));

    clearTimeout(best.goHome);
    best.goHome = setTimeout(function () {
      walkHome(best);
      best.busy = false;
    }, trip + PLAY_MS);
  }

  /* =====================================================================
     THE SHOP
     ===================================================================== */
  const TABS = [
    { id: "cats",  label: "tabCats", cats: true },
    { id: "furn",  label: "tabFurn", of: ["bowl", "water", "bed", "post", "carrier", "plant"] },
    /* NOTE: "food" is deliberately NOT a shop tab. Food is not a thing
       you own — you buy a tin each time you feed, from the picker under
       the room, because that is where the choice actually matters. */
    { id: "toys",  label: "tabToys", of: ["toy"] },
    { id: "acc",   label: "tabAcc",  of: ["collar", "bow", "heart", "hat", "seasonal"] },
    { id: "room",  label: "tabRoom", of: ["wall", "floor"] },
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
          /* Wallpaper and flooring have no picture file — they ARE
             colours, so the tile shows the colours themselves. */
          let pic;
          if (i.category === "wall") {
            pic = `<div class="cr-pic cr-swatch" style="background:${i.wall};
                     border-color:${i.skirting}"><i style="background:${i.wallShade}"></i></div>`;
          } else if (i.category === "floor") {
            pic = `<div class="cr-pic cr-swatch" style="background:${i.floor};
                     border-color:${i.floorLine}"><i style="background:${i.floorLine};height:3px"></i></div>`;
          } else {
            const file = i.levels ? i.levels[i.levels.length - 1]
                       : i.frames ? i.frames[0] : i.file;
            pic = `<div class="cr-pic" data-img="${file || ""}"></div>`;
          }
          return cell("item:" + i.id, nm(i), label, on, !owned, pic);
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
      ${foodBarHTML(cat, hasBowl, foodFull, foodLvl)}
      <div class="cr-acts">
        <button class="cr-btn" data-act="feed:water" ${(!hasWater || waterFull) ? "disabled" : ""}>
          💧 ${hasWater ? tx("water") + " −" + WATER_RULES.feedCost : tx("needWater")}
          <span class="cr-sub">${sub(hasWater, waterFull, "water", waterLvl)}</span>
        </button>
        <button class="cr-btn cr-ghostbtn" data-act="share:room" ${mouths ? "" : "disabled"}>
          ${tx("share")}
        </button>
      </div>
      ${cardPickerHTML()}
      ${tipHTML()}
      ${shopHTML(cat)}
    </div>`;
  }

  /* =====================================================================
     THE FOOD PICKER.

     Each tin fills a different number of bars for a different price, and
     the bigger ones cost less per bar — so the interesting decision is
     "do I buy the big tin now, or the small one and save?". The tile
     shows what each one would ACTUALLY add, which is not always what it
     says on the label: a four-bar feast poured into a bowl with room for
     two only gives two. We say so plainly rather than letting someone
     find out after paying.
     ===================================================================== */
  function foodBarHTML(cat, hasBowl, foodFull, foodLvl) {
    if (typeof CAT_FOODS === "undefined" || !CAT_FOODS.length) return "";
    const coins = (typeof Buddy !== "undefined") ? Buddy.coins() : 0;

    if (!hasBowl) {
      return `<div class="cr-acts"><button class="cr-btn" disabled>🍚 ${tx("needBowl")}</button></div>`;
    }
    if (foodFull) {
      return `<div class="cr-acts"><button class="cr-btn" disabled>🍚 ${tx("full")}</button></div>`;
    }

    const tins = CAT_FOODS.map(f => {
      const e = CatState.foodEffect(cat, f.id);
      const afford = coins >= e.price;
      /* the best-value tin that still fits gets a quiet highlight */
      const perfect = e.wasted === 0 && e.gain > 1;
      return `<button class="cr-food ${perfect ? "best" : ""}" data-act="feed:food:${f.id}"
                ${afford ? "" : "disabled"}>
        <span class="cr-food-n">+${e.gain} ${tx("bars")}</span>
        <span class="cr-food-nm">${nm(f)}</span>
        <span class="cr-food-p">🪙 ${e.price}</span>
        ${e.wasted > 0 ? `<span class="cr-food-w">${tx("wasteHint").replace("{n}", e.wasted)}</span>` : ""}
      </button>`;
    }).join("");

    return `<div class="cr-feed">
      <div class="cr-feed-h">🍚 ${tx("feedWith")} <span>${
        foodLvl === 0 ? tx("emptyOk")
          : tx("nextDrop").replace("{h}", CatState.hoursUntilDrop(cat, "food", Date.now()) || 0)
      }</span></div>
      <div class="cr-foods">${tins}</div>
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
    if (typeof Buddy === "undefined" || !Buddy.dropTip) return "";

    /* ONE NEW TIP PER DAY.
       Opening the room on a day you have not opened it before reveals a
       tip you have not met. That is the whole return mechanic: come
       back tomorrow, learn one more thing. It cannot be farmed by
       reloading, and missing a day loses nothing — the tips simply wait. */
    const today = new Date().toISOString().slice(0, 10);
    const marker = Buddy.get("catTipDay");
    let shown = Buddy.get("catTipToday");

    if (marker !== today) {
      const fresh = Buddy.dropTip();       /* null once the book is full */
      Buddy.set("catTipDay", today);
      Buddy.set("catTipToday", fresh ? fresh.id : (shown || null));
      shown = fresh ? fresh.id : shown;
      if (fresh) setTimeout(function () { say(tx("newTip")); }, 700);
    }

    /* Show today's tip, or the most recent one collected if the book is
       already complete. */
    const stats = Buddy.tipStats();
    const all = Buddy.allTipList ? Buddy.allTipList() : null;
    const text = Buddy.tipText ? Buddy.tipText(shown, lang) : null;
    if (!text) return "";

    return `<div class="cr-tip">
      <b>${tx("tipTitle")}</b>
      <span>${text}</span>
      <button class="cr-tipbtn" data-act="tips:open">📖 ${tx("tipsBook")} ${stats.seen}/${stats.total}</button>
    </div>`;
  }

  /* =====================================================================
     SHARE A PHOTO OF THE ROOM.

     Paints the room onto a canvas and hands back a PNG the visitor can
     post. The room is redrawn with plain rectangles rather than screen-
     grabbed, because a browser cannot screenshot itself.

     The coins for sharing come from the EXISTING "share" source in
     pet-shared.js, with its existing daily cap. This is not a new way to
     earn — that rule stands.
     ===================================================================== */

  /* Load an image once and remember it, so drawing is instant later. */
  const loaded = {};
  function getImage(url) {
    return new Promise(function (done) {
      if (loaded[url] !== undefined) { done(loaded[url]); return; }
      const im = new Image();
      im.onload  = function () { loaded[url] = im; done(im); };
      im.onerror = function () { loaded[url] = null; done(null); };
      im.src = url;
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);         ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* The card styles available today: the everyday ones, plus any whose
     holiday is running. Reuses the same season check as the shop. */
  function cardStyles() {
    if (typeof CARD_STYLES === "undefined") return [];
    return CARD_STYLES.filter(c => CatState.inSeason(c));
  }
  function currentStyle() {
    const list = cardStyles();
    if (!list.length) return null;
    const saved = (typeof Buddy !== "undefined" && Buddy.get) ? Buddy.get("cardStyle") : null;
    return list.find(c => c.id === saved) || list[0];
  }

  async function shareCard() {
    const cat = CatState.load();
    const style = currentStyle() || { paper: "#FAF5EA", frame: "#F3B72B", ink: "#3A3029", deco: "" };
    const W = 720, H = 900;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    const FONT = "'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif";
    const INK = style.ink || "#3A3029";

    /* card background + border, in the chosen style */
    ctx.fillStyle = style.paper || "#FAF5EA"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = style.frame || "#F3B72B"; ctx.lineWidth = 16;
    roundRect(ctx, 22, 22, W - 44, H - 44, 34); ctx.stroke();

    /* the style's decorations, tucked into the corners */
    const deco = Array.from(style.deco || "");
    if (deco.length) {
      ctx.font = "40px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      /* Corners only. A fifth at the bottom centre would sit on top of
         the app name and date. */
      [[70, 66], [W - 70, 66], [66, H - 62], [W - 66, H - 62]]
        .forEach((pos, i) => { if (deco[i % deco.length]) ctx.fillText(deco[i % deco.length], pos[0], pos[1]); });
    }

    /* title */
    ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "900 32px " + FONT;
    ctx.fillText(tx("title"), W / 2, 92);

    /* ---- the room ---- */
    const RX = 70, RY = 132, RW = W - 140, RH = Math.round((W - 140) * 0.70);
    const st = Object.assign({}, (typeof ROOM_STYLE !== "undefined") ? ROOM_STYLE : {});
    const bought = CatState.decorStyle(cat);
    if (bought.wall)  Object.assign(st, bought.wall);
    if (bought.floor) Object.assign(st, bought.floor);

    ctx.save();
    roundRect(ctx, RX, RY, RW, RH, 18); ctx.clip();
    const topPct = (st.floorTop || 52) / 100;
    const floorY = RY + RH * topPct;
    ctx.fillStyle = st.wall || "#EFE3C8";   ctx.fillRect(RX, RY, RW, RH * topPct);
    ctx.fillStyle = st.wallShade || "#E7D8B8"; ctx.fillRect(RX, RY, RW, RH * topPct * 0.28);
    ctx.fillStyle = st.skirting || "#C8A87A";  ctx.fillRect(RX, floorY, RW, RH * 0.035);
    ctx.fillStyle = st.floor || "#E3CBA1";
    ctx.fillRect(RX, floorY + RH * 0.035, RW, RH - RH * topPct - RH * 0.035);
    ctx.fillStyle = st.floorLine || "#C9A87C";
    for (let i = 1; i <= 3; i++) {
      const y = floorY + RH * 0.035 + ((RH - RH * topPct - RH * 0.035) * i) / 4;
      ctx.globalAlpha = .55; ctx.fillRect(RX, y, RW, 2); ctx.globalAlpha = 1;
    }
    /* the rug, drawn before anything stands on it — same as on screen */
    if (st.rug) {
      ctx.save();
      ctx.globalAlpha = .55;
      ctx.fillStyle = st.rugColor || "#E2B9A0";
      ctx.beginPath();
      ctx.ellipse(RX + RW * 0.5, RY + RH * 0.80, RW * 0.31, RH * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (st.window) {
      ctx.fillStyle = st.windowGlass || "#CFE4E8";
      ctx.fillRect(RX + RW * 0.62, RY + RH * topPct * 0.18, RW * 0.26, RH * topPct * 0.52);
      ctx.strokeStyle = st.skirting || "#C8A87A"; ctx.lineWidth = 4;
      ctx.strokeRect(RX + RW * 0.62, RY + RH * topPct * 0.18, RW * 0.26, RH * topPct * 0.52);
    }

    /* furniture, decoration, then cats — back to front */
    const pt = (x, y) => [RX + RW * (x / 100), RY + RH * (y / 100)];

    for (const sp of ROOM_SPOTS) {
      if (!sp.needs || !cat.placed[sp.needs]) continue;
      let file = null;
      if (sp.needs === "bowl")       file = CatState.dishImage(cat, "food");
      else if (sp.needs === "water") file = CatState.dishImage(cat, "water");
      else { const it = CatState.item(cat.placed[sp.needs]); file = it && it.file; }
      if (!file) continue;
      const im = await getImage("items/" + encodeURIComponent(file));
      if (!im) continue;
      const s = RW * 0.18, [x, y] = pt(sp.ix || sp.x, sp.iy || sp.y);
      ctx.drawImage(im, x - s / 2, y - s / 2, s, s);
    }

    for (const d of CatState.decorLayout(cat)) {
      const slot = ROOM_DECOR.find(r => r.needs === d.category) || {};
      const im = await getImage("items/" + encodeURIComponent(d.file));
      if (!im) continue;
      const s = RW * ((slot.size || 16) / 100), [x, y] = pt(d.x, d.y);
      ctx.drawImage(im, x - s / 2, y - s / 2, s, s);
    }

    ctx.imageSmoothingEnabled = false;      /* keep pixel art crisp */
    for (const spot of CatState.arrangeCats(cat)) {
      const colour = CAT_COLORS.find(c => c.id === spot.colour);
      if (!colour) continue;
      const sheet = await getImage(catSheetURL(colour.file));
      const f = catFrame(spot.pose);
      const s = RW * 0.17, [x, y] = pt(spot.x, spot.y);
      if (sheet) {
        const F = CAT_SHEET.frame;
        ctx.drawImage(sheet, f.from * F, f.row * F, F, F, x - s / 2, y - s / 2, s, s);
      } else {
        /* no artwork yet — a plain marker, so the card still works */
        ctx.fillStyle = dotColour(colour.id);
        ctx.beginPath(); ctx.arc(x, y, s / 2.4, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
    ctx.strokeStyle = INK; ctx.lineWidth = 5;
    roundRect(ctx, RX, RY, RW, RH, 18); ctx.stroke();

    /* ---- caption ---- */
    const n = CatState.catCount(cat);
    ctx.fillStyle = INK; ctx.font = "900 36px " + FONT;
    ctx.fillText(tx("myCats").replace("{n}", n).replace("{s}", n === 1 ? "" : "s"),
                 W / 2, RY + RH + 52);

    const names = CatState.ownedCats(cat).map(c => nm(c)).join(" · ");
    ctx.font = "400 24px " + FONT; ctx.globalAlpha = .75; ctx.fillStyle = INK;
    ctx.fillText(names, W / 2, RY + RH + 90); ctx.globalAlpha = 1;

    /* ---- logo, hashtag, and the funding statement ----
       The funding line goes ON THE CARD, not just on the website. A
       shared picture travels a long way from the page it came from, and
       by the time someone's friend sees it there is no footer, no site
       and no context — so the acknowledgement has to travel with it. */
    let y = RY + RH + 150;

    /* the project logo, if it has been uploaded */
    if (typeof BRANDING !== "undefined" && BRANDING.logo) {
      const logo = await getImage(BRANDING.logo);
      if (logo && logo.width) {
        const lh = 46, lw = Math.round(logo.width * (lh / logo.height));
        ctx.drawImage(logo, W / 2 - lw / 2, y - lh / 2, lw, lh);
        y += 44;
      }
    }

    const tag = (typeof SHARE !== "undefined") ? SHARE.hashtag : "";
    ctx.fillStyle = style.frame || "#F3B72B"; ctx.font = "900 30px " + FONT;
    ctx.fillText(tag, W / 2, y);
    y += 36;

    /* The required funding acknowledgement, in the official Chinese
       wording. It stays Chinese in both language modes because that is
       the prescribed text, not a translation of something. */
    if (typeof FUNDING !== "undefined" && FUNDING.zh) {
      ctx.globalAlpha = .75; ctx.fillStyle = INK; ctx.font = "700 17px " + FONT;
      ctx.fillText(FUNDING.zh, W / 2, y);
      y += 26;
    }

    ctx.globalAlpha = .55; ctx.fillStyle = INK; ctx.font = "400 17px " + FONT;
    const app = (typeof SHARE !== "undefined")
      ? (lang === "zh" ? SHARE.appName.zh : SHARE.appName.en) : "Campus Buddy";
    ctx.fillText(app + " · " + new Date().toLocaleDateString(lang === "zh" ? "zh-TW" : "en-US"),
                 W / 2, y);
    ctx.globalAlpha = 1;

    /* ------------------------------------------------------------------
       Turning the canvas into a picture.

       A browser refuses to export a canvas that has had images drawn
       into it from a DIFFERENT origin — it calls the canvas "tainted".
       Opening these files straight off the disk (file://) counts as
       different for every image, so this throws locally even though it
       is perfectly fine once the site is served from a web address.

       So: catch it, say plainly what happened, and carry on. Never let
       it surface as an unexplained error.
       ------------------------------------------------------------------ */
    try {
      return cv.toDataURL("image/png");
    } catch (e) {
      return null;
    }
  }

  /* The row of card styles under the share button. Seasonal ones appear
     on their own during the holiday and are flagged as limited. */
  function cardPickerHTML() {
    const list = cardStyles();
    if (list.length < 2) return "";
    const now = currentStyle();
    return `<div class="cr-cards">
      <div class="cr-cards-h">${tx("cardStyle")}</div>
      <div class="cr-cards-r">${list.map(c => `
        <button class="cr-card ${now && c.id === now.id ? "on" : ""}" data-act="card:${c.id}"
          style="background:${c.paper};border-color:${c.frame};color:${c.ink}">
          <span>${nm(c)}</span>
          ${c.season ? `<i>${tx("seasonal")}</i>` : ""}
        </button>`).join("")}</div></div>`;
  }

  /* Offer the picture to the phone's share sheet, or download it. */
  async function sharePhoto() {
    let url = null;
    try {
      url = await shareCard();
    } catch (e) {
      url = null;
    }
    if (!url) { say(tx("localOnly")); return; }
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], "my-cat-room.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const a = document.createElement("a");
        a.href = url; a.download = "my-cat-room.png"; a.click();
        say(tx("saved"));
      }
      /* the EXISTING share reward, with its existing daily cap */
      if (typeof Buddy !== "undefined" && Buddy.addCoins) Buddy.addCoins("share");
      refresh();
    } catch (e) { /* the visitor closed the share sheet — nothing to do */ }
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
    const parts = act.split(":");
    const kind = parts[0], id = parts[1], extra = parts[2];

    if (kind === "tips")  { Buddy.openTips(); return; }
    if (kind === "card")  { Buddy.set("cardStyle", id); refresh(); return; }
    if (kind === "share") { sharePhoto(); return; }

    if (kind === "feed") {
      const r = CatState.feed(id, undefined, extra);
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
