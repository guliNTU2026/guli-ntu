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
   THE ONE CLEVER BIT: HOW THE BOWL EMPTIES
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
      bowl:    { level: 0, since: 0 },  // fill level, and when it reached that level
      lastSpot: null,  // where the cat was standing last visit (used in a later step)
      lastSeen: 0      // when the page was last opened
    };
  }

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

    /* Gently repair anything missing. A save written by an older version
       of this file might not have every field yet; rather than crash, we
       fill the gaps with blanks. */
    const fresh = blank();
    for (const key in fresh) {
      if (saved[key] === undefined || saved[key] === null) saved[key] = fresh[key];
    }
    if (!saved.bowl || typeof saved.bowl.level !== "number") saved.bowl = fresh.bowl;
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
  function settleBowl(cat, now) {
    const rules   = (typeof BOWL_RULES !== "undefined") ? BOWL_RULES : null;
    if (!rules) return 0;
    const periodMs = Math.max(1, rules.decayHours) * 60 * 60 * 1000;

    /* First time ever, or a save with no timestamp: start the clock now. */
    if (!cat.bowl.since) { cat.bowl.since = now; return 0; }

    const elapsed = now - cat.bowl.since;

    /* CLOCK WENT BACKWARDS. This really happens: people travel, change
       time zones, or fix a wrong clock on a cheap phone. Without this
       check a negative "elapsed" would divide into a negative number of
       drops and the bowl would magically REFILL itself. Just reset the
       clock and carry on. */
    if (elapsed < 0) { cat.bowl.since = now; return 0; }

    /* Not a whole period yet — nothing to do. */
    if (elapsed < periodMs) return 0;

    const drops  = Math.floor(elapsed / periodMs);
    const before = cat.bowl.level;
    cat.bowl.level = Math.max(0, cat.bowl.level - drops);

    /* Keep the remainder. If 30 hours passed and a period is 12, we used
       up 24 of them; the spare 6 hours carry forward so the next drop is
       6 hours away, not a fresh 12. */
    cat.bowl.since = cat.bowl.since + drops * periodMs;

    /* Once the bowl is empty there is nothing left to lose, so pin the
       clock to now. Otherwise "since" would sit months in the past and
       the very first feed would instantly decay away again. */
    if (cat.bowl.level === 0) cat.bowl.since = now;

    return before - cat.bowl.level;
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
      const lost = settleBowl(cat, now);
      cat.lastSeen = now;
      /* Only write back if something actually changed, to avoid pointless
         saving on every single page load. */
      if (lost > 0 || !cat.bowl.since) writeRaw(cat);
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
    feed(now) {
      now = now || Date.now();
      const rules = (typeof BOWL_RULES !== "undefined") ? BOWL_RULES : null;
      if (!rules) return { ok: false, reason: "no-rules" };

      const cat = readRaw();
      settleBowl(cat, now);

      /* You need a bowl in the room before you can put food in it. */
      if (!cat.placed || !cat.placed.bowl) return { ok: false, reason: "no-bowl" };

      /* Already full — don't take their coins for nothing. */
      if (cat.bowl.level >= rules.maxLevel) {
        return { ok: false, reason: "full", level: cat.bowl.level };
      }

      /* Try to pay. Buddy.spend returns false and changes nothing if
         they cannot afford it, so the order here is safe: we never raise
         the level unless the coins actually left. */
      const cost = rules.feedCost;
      if (typeof Buddy === "undefined" || !Buddy.spend || !Buddy.spend(cost)) {
        return { ok: false, reason: "broke", need: cost };
      }

      cat.bowl.level = Math.min(rules.maxLevel, cat.bowl.level + rules.feedStep);
      /* Restart the clock, so a feed always buys a full fresh period.
         Slightly generous on purpose — this is meant to feel kind. */
      cat.bowl.since = now;
      writeRaw(cat);

      return { ok: true, level: cat.bowl.level, spent: cost };
    },

    /* ----------------------------------------------------------------
       Which bowl picture to show right now.
       Returns the filename for the current fill level, or null if no
       bowl has been placed in the room yet.
       ---------------------------------------------------------------- */
    bowlImage(cat) {
      if (!cat || !cat.placed || !cat.placed.bowl) return null;
      if (typeof CAT_BOWLS === "undefined") return null;
      const bowl = CAT_BOWLS.find(b => b.id === cat.placed.bowl);
      if (!bowl || !bowl.levels || !bowl.levels.length) return null;
      /* Clamp, so a bad level number can never crash the page — it just
         shows the closest picture that does exist. */
      const i = Math.min(Math.max(cat.bowl.level, 0), bowl.levels.length - 1);
      return bowl.levels[i];
    },

    /* How many whole hours until the bowl drops another level.
       Handy for a gentle "next meal in about 7 hours" caption.
       Returns null when the bowl is already empty (nothing to count). */
    hoursUntilDrop(cat, now) {
      now = now || Date.now();
      const rules = (typeof BOWL_RULES !== "undefined") ? BOWL_RULES : null;
      if (!rules || !cat || cat.bowl.level <= 0) return null;
      const periodMs = Math.max(1, rules.decayHours) * 60 * 60 * 1000;
      const left = (cat.bowl.since + periodMs) - now;
      return Math.max(0, Math.round(left / (60 * 60 * 1000)));
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
      const groups = [
        typeof CAT_BOWLS       !== "undefined" ? CAT_BOWLS       : [],
        typeof CAT_FOODS       !== "undefined" ? CAT_FOODS       : [],
        typeof CAT_WATER       !== "undefined" ? CAT_WATER       : [],
        typeof CAT_TOYS        !== "undefined" ? CAT_TOYS        : [],
        typeof CAT_BEDS        !== "undefined" ? CAT_BEDS        : [],
        typeof CAT_PLANTS      !== "undefined" ? CAT_PLANTS      : [],
        typeof CAT_ACCESSORIES !== "undefined" ? CAT_ACCESSORIES : [],
      ];
      const all = [];
      groups.forEach(g => g.forEach(i => all.push(i)));
      return all.filter(i => CatState.inSeason(i, when));
    },

    /* Exposed for the test page only. Lets a test pretend that hours
       have passed without anyone waiting around for half a day. */
    _settleBowl: settleBowl,
    _blank: blank,
  };
})();
