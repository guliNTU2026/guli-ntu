/* =====================================================================
   cat-state.js  —  THE CAT'S MEMORY AND THE FEEDING LOOP
   =====================================================================
   WHAT IS THIS FILE?

   It remembers things about the cat between visits: which colour is
   adopted, what has been bought, what the cat is wearing, and how full
   the food bowl is. It also contains the feeding rules.

   You almost never need to edit this file. The knobs you would actually
   want to turn — prices, the feeding cost, how fast the bowl empties —
   all live in cat-items.js instead. This file just obeys them.

   ---------------------------------------------------------------------
   TWO DISHES, ONE SET OF RULES
   ---------------------------------------------------------------------
   The cat has a FOOD bowl and a WATER dish. They work identically, they
   just have their own settings (BOWL_RULES and WATER_RULES, both in
   cat-items.js). Everywhere below, "dish" means either one — the word
   "food" or the word "water".

   ---------------------------------------------------------------------
   THE ONE CLEVER BIT: HOW A DISH EMPTIES
   ---------------------------------------------------------------------
   The bowl does NOT tick down while someone is looking at it. That would
   be stressful, and it would mean the site has to keep running a timer.

   Instead we do the lazy, calm thing: we write down the level and the
   time whenever it changes, and then we only do the sum when the page
   next opens.

       "Bowl was at level 4. That was 30 hours ago.
        It drops a level every 12 hours. 30 ÷ 12 = 2 whole drops.
        So it is at level 2 now."

   That is the entire mechanic. Nobody watches it drain; they just come
   back to a lower bowl. The leftover 6 hours are kept, not thrown away,
   so the next drop happens 6 hours from now rather than a fresh 12.

   ---------------------------------------------------------------------
   AND THE THING THAT MUST NOT CHANGE
   ---------------------------------------------------------------------
   Feeding COSTS COINS — that is the point, it gives coins a purpose and
   gives people a reason to come back and play the games.

   An empty bowl COSTS NOTHING. No sad cat, no hungry cat, no lost
   progress, no nagging. The cat is always pleased to see you. See the
   long note in BOWL_RULES in cat-items.js for why this matters.
   ===================================================================== */

/* The whole file is wrapped in a "closure" — a box with a lid. Only the
   things listed at the very bottom escape the box. Everything else is
   private, so nothing on the rest of the site can accidentally reach in
   and break it. */
const CatState = (function () {
  "use strict";

  /* The name of our branch inside the visitor's saved record. The emoji
     pet uses a branch called "pet"; we use one called "cat". They sit
     side by side and never touch each other, which is why upgrading
     does not wipe anybody's existing buddy. */
  const BRANCH = "cat";

  /* A brand-new cat record. This is what a first-time visitor gets. */
  function blank() {
    return {
      version: 1,      // lets a future version recognise and upgrade old saves
      active:  null,   // which colour is currently out ("black" etc), null = none yet
      cats:    {},     // every colour they own: { black: { adoptedAt: 1699... } }
      owned:   [],     // ids of everything bought, from cat-items.js
      placed:  {},     // what is out in the room: { bowl:"bowl-green", bed:"bed-red" }
      worn:    [],     // accessory ids currently on the cat
      /* One entry per dish. "level" is how full it is, "since" is when it
         reached that level. See settleDish() below. */
      dishes: {
        food:  { level: 0, since: 0 },
        water: { level: 0, since: 0 }
      },
      visits:   0,     // how many times the room has been opened (used to move the cats about)
      lastSeen: 0      // when the page was last opened
    };
  }

  /* Which rules apply to which dish. Returns null if cat-items.js has not
     loaded, which makes every dish operation a harmless no-op rather than
     a crash. */
  function rulesFor(dish) {
    if (dish === "water") return (typeof WATER_RULES !== "undefined") ? WATER_RULES : null;
    return (typeof BOWL_RULES !== "undefined") ? BOWL_RULES : null;
  }

  /* Which "placed" slot holds the item for this dish. The food bowl is
     stored under placed.bowl, the water under placed.water. */
  function slotFor(dish) { return dish === "water" ? "water" : "bowl"; }

  /* ------------------------------------------------------------------
     Reading and writing.
     We go through Buddy (pet-shared.js) rather than touching the
     browser's storage ourselves, so there is only ever ONE file writing
     the saved record. See "EXTENSION API" in pet-shared.js for why.
     ------------------------------------------------------------------ */
  function readRaw() {
    /* If pet-shared.js has not loaded yet, fall back to a blank cat so
       nothing explodes — the page just shows a fresh cat for now. */
    if (typeof Buddy === "undefined" || !Buddy.get) return blank();
    const saved = Buddy.get(BRANCH);
    if (!saved) return blank();

    /* MIGRATION FIRST, REPAIRS SECOND. The order matters and is the kind
       of thing that is easy to get backwards: an earlier version of this
       file stored a single bowl as `bowl: {level, since}`. If we filled
       in the missing `dishes` field BEFORE looking for that old `bowl`,
       the old bowl would never be spotted and the visitor's food level
       would silently reset to empty. So: rescue the old shape first. */
    if (saved.bowl && !saved.dishes) {
      saved.dishes = { food: saved.bowl, water: { level: 0, since: 0 } };
      delete saved.bowl;
    }

    /* Now gently repair anything still missing. A save written by an
       older version might not have every field yet; rather than crash,
       we fill the gaps with blanks. */
    const fresh = blank();
    for (const key in fresh) {
      if (saved[key] === undefined || saved[key] === null) saved[key] = fresh[key];
    }

    /* Repair the dishes if anything is missing or the wrong shape. */
    if (!saved.dishes || typeof saved.dishes !== "object") saved.dishes = fresh.dishes;
    ["food", "water"].forEach(function (d) {
      if (!saved.dishes[d] || typeof saved.dishes[d].level !== "number") {
        saved.dishes[d] = { level: 0, since: 0 };
      }
    });
    return saved;
  }

  function writeRaw(cat) {
    if (typeof Buddy === "undefined" || !Buddy.set) return false;
    return Buddy.set(BRANCH, cat);
  }

  /* ------------------------------------------------------------------
     THE BOWL SUM — described at the top of this file.
     Given a cat record and what time it is now, work out the real
     current level. Changes the record in place and returns how many
     levels were lost (so the page can say "the bowl is emptier than you
     left it" if it wants to).
     ------------------------------------------------------------------ */
  function settleDish(cat, dish, now) {
    const rules = rulesFor(dish);
    if (!rules) return 0;
    const d = cat.dishes[dish];
    if (!d) return 0;
    const periodMs = Math.max(1, rules.decayHours) * 60 * 60 * 1000;

    /* First time ever, or a save with no timestamp: start the clock now. */
    if (!d.since) { d.since = now; return 0; }

    const elapsed = now - d.since;

    /* CLOCK WENT BACKWARDS. This really happens: people travel, change
       time zones, or fix a wrong clock on a cheap phone. Without this
       check a negative "elapsed" would divide into a negative number of
       drops and the bowl would magically REFILL itself. Just reset the
       clock and carry on. */
    if (elapsed < 0) { d.since = now; return 0; }

    /* Not a whole period yet — nothing to do. */
    if (elapsed < periodMs) return 0;

    const drops  = Math.floor(elapsed / periodMs);
    const before = d.level;
    d.level = Math.max(0, d.level - drops);

    /* Keep the remainder. If 30 hours passed and a period is 12, we used
       up 24 of them; the spare 6 hours carry forward so the next drop is
       6 hours away, not a fresh 12. */
    d.since = d.since + drops * periodMs;

    /* Once the dish is empty there is nothing left to lose, so pin the
       clock to now. Otherwise "since" would sit months in the past and
       the very first top-up would instantly decay away again. */
    if (d.level === 0) d.since = now;

    return before - d.level;
  }

  /* Settle both dishes at once. Returns how many levels were lost in total. */
  function settleAll(cat, now) {
    return settleDish(cat, "food", now) + settleDish(cat, "water", now);
  }

  /* ================================================================
     THE PUBLIC DOORS — the only things the rest of the site can use.
     ================================================================ */
  return {

    /* Load the cat, with the bowl already brought up to date.
       Call this whenever you need to know the current state. */
    load(now) {
      now = now || Date.now();
      const cat = readRaw();
      const lost = settleAll(cat, now);
      cat.lastSeen = now;
      /* Only write back if something actually changed, to avoid pointless
         saving on every single page load. */
      if (lost > 0 || !cat.dishes.food.since || !cat.dishes.water.since) writeRaw(cat);
      return cat;
    },

    /* Count this as a new visit. Call once when the room is opened — it is
       what makes the cats stand somewhere different each time. */
    noteVisit(now) {
      const cat = readRaw();
      settleAll(cat, now || Date.now());
      cat.visits = (cat.visits || 0) + 1;
      cat.lastSeen = now || Date.now();
      writeRaw(cat);
      return cat;
    },

    /* Save a cat record you have changed. */
    save(cat) { return writeRaw(cat); },

    /* ----------------------------------------------------------------
       FEEDING. This is the loop.

       Returns an object saying what happened, so the page can show the
       right message:
         { ok:true,  level:3, spent:5 }            fed successfully
         { ok:false, reason:"no-bowl" }            nothing to feed into
         { ok:false, reason:"full",   level:4 }    already full
         { ok:false, reason:"broke",  need:5 }     not enough coins
       ---------------------------------------------------------------- */
    feed(dish, now) {
      dish = (dish === "water") ? "water" : "food";
      now  = now || Date.now();
      const rules = rulesFor(dish);
      if (!rules) return { ok: false, reason: "no-rules" };

      const cat = readRaw();
      settleAll(cat, now);

      /* You need the dish in the room before you can put anything in it. */
      const slot = slotFor(dish);
      if (!cat.placed || !cat.placed[slot]) return { ok: false, reason: "no-dish", dish: dish };

      /* Already full — don't take their coins for nothing. */
      if (cat.dishes[dish].level >= rules.maxLevel) {
        return { ok: false, reason: "full", dish: dish, level: cat.dishes[dish].level };
      }

      /* Try to pay. Buddy.spend returns false and changes nothing if they
         cannot afford it, so the order here is safe: we never raise the
         level unless the coins actually left. */
      const cost = rules.feedCost;
      if (typeof Buddy === "undefined" || !Buddy.spend || !Buddy.spend(cost)) {
        return { ok: false, reason: "broke", dish: dish, need: cost };
      }

      cat.dishes[dish].level = Math.min(rules.maxLevel, cat.dishes[dish].level + rules.feedStep);
      /* Restart the clock, so a top-up always buys a full fresh period.
         Slightly generous on purpose — this is meant to feel kind. */
      cat.dishes[dish].since = now;
      writeRaw(cat);

      return { ok: true, dish: dish, level: cat.dishes[dish].level, spent: cost };
    },

    /* ----------------------------------------------------------------
       Which picture to show for a dish right now.

       Bowls have one picture per fill level, so we pick the matching one.
       The water dish currently has only a single picture, so it is either
       shown (level above 0) or not shown at all (level 0). If you later
       add a "levels" list to the water item, it automatically starts
       behaving like the bowls — no code change needed.
       Returns null when there is nothing to draw.
       ---------------------------------------------------------------- */
    dishImage(cat, dish) {
      dish = (dish === "water") ? "water" : "food";
      if (!cat || !cat.placed) return null;
      const slot = slotFor(dish);
      const placedId = cat.placed[slot];
      if (!placedId) return null;

      const list = (dish === "water")
        ? (typeof CAT_WATER !== "undefined" ? CAT_WATER : [])
        : (typeof CAT_BOWLS !== "undefined" ? CAT_BOWLS : []);
      const item = list.find(b => b.id === placedId);
      if (!item) return null;

      const level = cat.dishes[dish].level;

      /* Shape A: a list of pictures, one per level. */
      if (item.levels && item.levels.length) {
        /* Clamp, so a bad level number can never crash the page — it just
           shows the closest picture that does exist. */
        const i = Math.min(Math.max(level, 0), item.levels.length - 1);
        return item.levels[i];
      }

      /* Shape B: a single picture. Empty means show nothing. */
      if (!item.file) return null;
      return level > 0 ? item.file : null;
    },

    /* How many whole hours until this dish drops another level.
       Handy for a gentle "next meal in about 7 hours" caption.
       Returns null when the dish is already empty (nothing to count). */
    hoursUntilDrop(cat, dish, now) {
      dish = (dish === "water") ? "water" : "food";
      now = now || Date.now();
      const rules = rulesFor(dish);
      if (!rules || !cat || !cat.dishes[dish] || cat.dishes[dish].level <= 0) return null;
      const periodMs = Math.max(1, rules.decayHours) * 60 * 60 * 1000;
      const left = (cat.dishes[dish].since + periodMs) - now;
      return Math.max(0, Math.round(left / (60 * 60 * 1000)));
    },

    /* ================================================================
       THE CAT ROSTER — owning more than one cat
       ================================================================
       Short answer to "is this too hard to track?": no, not at all. The
       save already holds a list of every colour owned, so counting them
       is just counting that list. Each colour is remembered separately,
       so switching between them loses nothing.

       The FIRST cat is free. Every extra colour costs EXTRA_CAT_PRICE
       coins (set in cat-items.js). Switching between cats you already
       own is always free.
       ================================================================ */

    /* How many cats does this visitor own? */
    catCount(cat) {
      if (!cat || !cat.cats) return 0;
      return Object.keys(cat.cats).length;
    },

    /* The full list of owned cats, as entries from CAT_COLORS, in the
       order they were adopted. Each gets an `owned` and `active` flag so
       a shop screen can draw the whole roster in one pass. */
    ownedCats(cat) {
      if (typeof CAT_COLORS === "undefined") return [];
      if (!cat || !cat.cats) return [];
      return Object.keys(cat.cats)
        .sort((a, b) => (cat.cats[a].adoptedAt || 0) - (cat.cats[b].adoptedAt || 0))
        .map(id => {
          const colour = CAT_COLORS.find(c => c.id === id);
          if (!colour) return null;   // colour deleted from cat-items.js — skip it
          return Object.assign({}, colour, { owned: true, active: cat.active === id });
        })
        .filter(Boolean);
    },

    /* What the shop should show: every colour, marked owned or not, with
       the price of the next one worked out. */
    catRoster(cat) {
      if (typeof CAT_COLORS === "undefined") return [];
      const owned = (cat && cat.cats) ? cat.cats : {};
      const isFirst = Object.keys(owned).length === 0;
      const price = isFirst ? 0
        : (typeof EXTRA_CAT_PRICE !== "undefined" ? EXTRA_CAT_PRICE : 0);
      return CAT_COLORS.map(c => ({
        id: c.id, zh: c.zh, en: c.en, file: c.file,
        owned:  !!owned[c.id],
        active: cat ? cat.active === c.id : false,
        /* what it would cost to get this one right now; 0 if already owned */
        price:  owned[c.id] ? 0 : price
      }));
    },

    /* ----------------------------------------------------------------
       Adopt a colour, or switch to one already owned.
       Returns:
         { ok:true, spent:0,  count:1, switched:false }   first cat, free
         { ok:true, spent:40, count:2, switched:false }   bought another
         { ok:true, spent:0,  count:2, switched:true  }   switched, free
         { ok:false, reason:"broke",   need:40 }
         { ok:false, reason:"unknown-colour" }
       ---------------------------------------------------------------- */
    adopt(colourId, now) {
      now = now || Date.now();
      if (typeof CAT_COLORS === "undefined") return { ok: false, reason: "no-colours" };
      if (!CAT_COLORS.some(c => c.id === colourId)) {
        return { ok: false, reason: "unknown-colour" };
      }

      const cat = readRaw();

      /* Already own it — just bring it to the front. Always free. */
      if (cat.cats[colourId]) {
        cat.active = colourId;
        writeRaw(cat);
        return { ok: true, spent: 0, count: Object.keys(cat.cats).length, switched: true };
      }

      /* First cat is free; the rest cost coins. */
      const isFirst = Object.keys(cat.cats).length === 0;
      const price = isFirst ? 0
        : (typeof EXTRA_CAT_PRICE !== "undefined" ? EXTRA_CAT_PRICE : 0);

      if (price > 0) {
        if (typeof Buddy === "undefined" || !Buddy.spend || !Buddy.spend(price)) {
          return { ok: false, reason: "broke", need: price };
        }
      }

      cat.cats[colourId] = { adoptedAt: now };
      cat.active = colourId;
      writeRaw(cat);
      return { ok: true, spent: price, count: Object.keys(cat.cats).length, switched: false };
    },

    /* ----------------------------------------------------------------
       WHERE EVERY CAT STANDS.

       Works out a spot for each cat the visitor owns, so they can all be
       in the room together rather than one at a time.

       A spot from ROOM_SPOTS only counts if the thing it needs is
       actually in the room — no bed means no sleeping spot. "center"
       needs nothing, so there is always at least one place to stand.

       Cats never share a spot. If there are more cats than spots, the
       extras line up along the floor, evenly spaced, in their idle pose.

       The `visits` count rotates who stands where, so the room looks
       different each time it is opened — that is the cheap version of
       "the cat moved while you were away", with no walking to animate.

       Returns: [ { colour, file, x, y, pose, spot } ]  (x,y are % of the room)
       ---------------------------------------------------------------- */
    arrangeCats(cat, spin) {
      if (typeof ROOM_SPOTS === "undefined" || typeof CAT_COLORS === "undefined") return [];
      const owned = this.ownedCats(cat);
      if (!owned.length) return [];

      /* Which spots are usable right now? */
      const placed = (cat && cat.placed) ? cat.placed : {};
      const usable = ROOM_SPOTS.filter(sp => !sp.needs || placed[sp.needs]);
      if (!usable.length) return [];

      /* Rotate the starting point so the arrangement changes per visit. */
      const rot = Math.abs(Math.round(
        (spin === undefined || spin === null) ? (cat.visits || 0) : spin
      )) % usable.length;

      const overflow = Math.max(0, owned.length - usable.length);
      let overflowSeen = 0;

      return owned.map((colour, i) => {
        if (i < usable.length) {
          const sp = usable[(i + rot) % usable.length];
          return { colour: colour.id, file: colour.file,
                   x: sp.x, y: sp.y, pose: sp.pose, spot: sp.id };
        }
        /* More cats than spots: spread the rest along the floor so they
           never sit exactly on top of each other. */
        overflowSeen++;
        return { colour: colour.id, file: colour.file,
                 x: Math.round(100 * overflowSeen / (overflow + 1)),
                 y: 88, pose: "idle", spot: "floor" };
      });
    },

    /* ----------------------------------------------------------------
       WHERE THE DECORATION GOES.

       Scratching posts, carriers, toys and plants are drawn in the room
       but the cat never stands on them (see the note in cat-items.js for
       why). This returns one entry per decorative item actually placed,
       ready to be drawn.

       Returns: [ { id, file, x, y, category } ]   x,y are % of the room
       ---------------------------------------------------------------- */
    decorLayout(cat) {
      if (typeof ROOM_DECOR === "undefined") return [];
      if (!cat || !cat.placed) return [];

      const out = [];
      ROOM_DECOR.forEach(slot => {
        const placedId = cat.placed[slot.needs];
        if (!placedId) return;                    // nothing of this kind placed

        /* Find the item in whichever list it lives in. */
        const item = this.allItems().find(i => i.id === placedId);
        if (!item || !item.file) return;          // unknown or has no picture

        out.push({ id: item.id, file: item.file, x: slot.x, y: slot.y,
                   category: slot.needs });
      });
      return out;
    },

    /* Every buyable thing from cat-items.js, seasons IGNORED. Used when we
       need to look an item up by id regardless of the date — someone who
       bought a Christmas hat in December still owns it in March. */
    allItems() {
      const groups = [
        typeof CAT_BOWLS       !== "undefined" ? CAT_BOWLS       : [],
        typeof CAT_FOODS       !== "undefined" ? CAT_FOODS       : [],
        typeof CAT_WATER       !== "undefined" ? CAT_WATER       : [],
        typeof CAT_TOYS        !== "undefined" ? CAT_TOYS        : [],
        typeof CAT_BEDS        !== "undefined" ? CAT_BEDS        : [],
        typeof CAT_POSTS       !== "undefined" ? CAT_POSTS       : [],
        typeof CAT_CARRIERS    !== "undefined" ? CAT_CARRIERS    : [],
        typeof CAT_PLANTS      !== "undefined" ? CAT_PLANTS      : [],
        typeof CAT_ACCESSORIES !== "undefined" ? CAT_ACCESSORIES : [],
      ];
      const all = [];
      groups.forEach(g => g.forEach(i => all.push(i)));
      return all;
    },

    /* ----------------------------------------------------------------
       SEASONAL FILTER — decides whether an item from cat-items.js should
       be on sale today.

       Items with no "season" are always available. Items WITH a season
       only appear during that holiday, reusing the exact same HOLIDAYS
       list and date logic that already drives the seasonal photo frames
       in pet-shared.js. One list, one set of dates, no duplication.
       ---------------------------------------------------------------- */
    inSeason(item, when) {
      if (!item || !item.season) return true;          // no season = always on sale
      if (typeof HOLIDAYS === "undefined") return false;

      const now = when ? new Date(when) : new Date();
      const pad = n => String(n).padStart(2, "0");
      const full = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
      const md   = full.slice(5);                       // just "MM-DD"

      const holiday = HOLIDAYS.find(h => h.id === item.season);
      if (!holiday) return false;   /* season name does not match any holiday —
                                       usually a typo. The item stays hidden. */
      return holiday.ranges.some(function (range) {
        const from = range[0], to = range[1];
        /* A 5-character date like "12-18" means "every year".
           A 10-character one like "2027-02-04" means that year only. */
        return (from.length === 5) ? (md >= from && md <= to)
                                   : (full >= from && full <= to);
      });
    },

    /* Everything currently purchasable, seasons applied. */
    catalogue(when) {
      return this.allItems().filter(i => CatState.inSeason(i, when));
    },

    /* Exposed for the test page only. Lets a test pretend that hours
       have passed without anyone waiting around for half a day. */
    _settleDish: settleDish,
    _blank: blank,
  };
})();
