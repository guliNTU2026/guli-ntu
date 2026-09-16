/* =====================================================================
   cat-frames.js  —  THE MAP OF "WHICH PICTURES MAKE WHICH ANIMATION"
   =====================================================================
   WHAT IS THIS FILE? (plain English)

   Your cat is ONE big picture file (a "sprite sheet"). Think of it as a
   contact sheet at the photo shop: 583 tiny photos printed on one page,
   in a neat grid of 11 across and 53 down. Each tiny photo is 32x32
   pixels.

   The website never cuts that picture up. Instead it puts a little
   32x32 "window" over the big picture and slides the window around.
   Show the photo at row 6, column 0... then column 1... then column 2,
   quickly — and the cat appears to eat. That's the whole trick.

   This file is the LIST OF ADDRESSES. It says "the eating animation
   lives on row 6, starting at column 0, and is 6 photos long."
   That's all. No logic, no cleverness — just addresses.

   ---------------------------------------------------------------------
   HOW TO READ ONE LINE
   ---------------------------------------------------------------------
       "eat-front": { row: 6, from: 0, count: 6, fps: 8, loop: "once" },
        ^^^^^^^^^     ^^^^^^  ^^^^^^^  ^^^^^^^^  ^^^^^^  ^^^^^^^^^^^^
        the nickname  which   which    how many  how     how it plays
        the code uses row     column   photos    fast
                      (0 =    it       in this   (photos
                      top     starts   animation per
                      row)    at                 second)

   • row     0 is the TOP row. Row 52 is the bottom row.
   • from    0 is the LEFTMOST column. Almost always 0.
   • count   how many photos the animation actually uses. An idle pose
             is usually just 1. A walk might be 8.
   • fps     "frames per second" = speed. 8 is a normal walk-ish speed,
             4 is slow and sleepy, 12 is fast. Ignored when count is 1.
   • loop    one of these four words, in quotes:
               "single-still" = one photo, never moves (a pose)
               "loop"         = plays over and over, forever
               "loop-slow"    = same, but gently (use a low fps)
               "once"         = plays through one time, then holds on
                                the last photo

   ---------------------------------------------------------------------
   HOW DO I FIND OUT THE ROW NUMBERS?  ← READ THIS
   ---------------------------------------------------------------------
   You do NOT count rows by hand and you do NOT need to upload the
   artist's files anywhere. Open the file `sprite-lab.html` in this
   folder by double-clicking it. It is a little workbench that:
     1. lets you pick the cat PNG off your own computer,
     2. plays any row so you can SEE what that row does,
     3. counts the photos in the row for you,
     4. prints the finished line, ready to copy and paste down below.
   Ten minutes with that page and this file is filled in.

   ---------------------------------------------------------------------
   RULES OF THE ROAD (things that break the site if you get them wrong)
   ---------------------------------------------------------------------
   • Every line ends with a comma.
   • Nicknames and the loop word are wrapped in "double quotes".
     Numbers are NOT: row: 6   ✅      row: "6"   ❌
   • Never change a nickname on the LEFT of the colon unless you also
     change every place that uses it (cat-items.js uses some of them).
     Renaming "eat-front" will quietly stop the eating pose working.
   • Broke it? The cat vanishes and the browser console shows a red
     error. Undo your last edit — it is almost always a missing comma
     or a missing quote.

   ---------------------------------------------------------------------
   ⚠️  UNVERIFIED ROWS — the important bit right now
   ---------------------------------------------------------------------
   Any line below with  row: null  means "we have not looked up this
   address yet." Nothing is broken: the cat simply falls back to its
   normal idle pose instead. Fill them in using sprite-lab.html and the
   poses switch on by themselves. There is no other step.
   ===================================================================== */


/* =====================================================================
   THE SHEET ITSELF — the shape of the big picture.
   These numbers were confirmed already: 352 x 1696 pixels total,
   which is 11 columns x 53 rows of 32x32 photos, with no gaps.
   (352 / 32 = 11 exactly. 1696 / 32 = 53 exactly. Both whole numbers,
   which is the sign that there are no gaps between photos.)
   Only change these if you swap in a DIFFERENT artist's sheet.
   ===================================================================== */
const CAT_SHEET = {
  folder: "sprites/",  // the folder the cat PNG files live in
  frame:  32,          // each little photo is 32 x 32 pixels
  cols:   11,          // photos across
  rows:   53,          // photos down
};


/* =====================================================================
   THE ANIMATIONS.
   Left of the colon = the nickname the code asks for.
   The four nicknames marked "USED BY cat-items.js" must keep their
   spelling, because ROOM_SPOTS in cat-items.js asks for them by name.
   ===================================================================== */
const CAT_FRAMES = {

  /* ================= STILL POSES (rows 0-3) =================
     These rows hold single still pictures, several to a row — so unlike
     the animation rows, `from` matters here: it picks WHICH picture.
     row 0 = sitting, row 1 = standing, row 2 = lying, row 3 = curled up.
     Within rows 0-2 the columns are directions:
       0 front · 1 back · 2 left · 3 right · 4 front-left · 5 front-right
     ========================================================== */

  /* The everyday pose, and the safety net: if any other pose is missing,
     the cat falls back to this one. */
  "idle":          { row: 0, from: 0, count: 1, fps: 0, loop: "single-still" },

  "sit-front":     { row: 0, from: 0, count: 1, fps: 0, loop: "single-still" },
  "sit-left":      { row: 0, from: 2, count: 1, fps: 0, loop: "single-still" },
  "sit-right":     { row: 0, from: 3, count: 1, fps: 0, loop: "single-still" },
  "stand-front":   { row: 1, from: 0, count: 1, fps: 0, loop: "single-still" },

  /* USED BY cat-items.js → ROOM_SPOTS "lounge-left". */
  "lying":         { row: 2, from: 0, count: 1, fps: 0, loop: "single-still" },
  "lying-left":    { row: 2, from: 2, count: 1, fps: 0, loop: "single-still" },

  /* Curled up. Lovely for a cat tucked into a bed or a cubby. */
  "curl-left":     { row: 3, from: 0, count: 1, fps: 0, loop: "single-still" },
  "curl-right":    { row: 3, from: 1, count: 1, fps: 0, loop: "single-still" },
  "curl-sleep":    { row: 3, from: 6, count: 1, fps: 0, loop: "single-still" },
  "sprawl-sleep":  { row: 3, from: 8, count: 1, fps: 0, loop: "single-still" },


  /* ================= ANIMATIONS (rows 4+) =================
     These run left to right from column 0, so `from` is always 0.
     ========================================================= */

  /* ---- USED BY cat-items.js → ROOM_SPOTS "by-bowl" ---- */
  "eat-front":     { row: 20, from: 0, count: 8, fps: 8, loop: "loop" },

  /* ---- USED BY cat-items.js → ROOM_SPOTS "at-water".
     ⚠️ The sheet has NO drinking animation, so this borrows an eating
     one — head down at a dish, which reads fine for drinking. I picked
     the front-left angle (row 24) rather than plain front (row 20) so
     the water cat does not look identical to the food-bowl cat sitting
     next to it. If you prefer them the same, change 24 to 20. ---- */
  "drink-front":   { row: 24, from: 0, count: 8, fps: 7, loop: "loop" },

  /* ---- USED BY cat-items.js → ROOM_SPOTS "in-bed".
     Only 2 frames, so a low fps makes it a slow, sleepy breath rather
     than a twitch. ---- */
  "sleep-lay-front-l": { row: 18, from: 0, count: 2, fps: 1, loop: "loop-slow" },
  "sleep-head-up":     { row: 12, from: 0, count: 2, fps: 1, loop: "loop-slow" },
  "sleep-head-down":   { row: 16, from: 0, count: 2, fps: 1, loop: "loop-slow" },

  /* ---- USED BY cat-items.js → ROOM_SPOTS "center".
     The nicest all-round idle animation in the pack. ---- */
  "wash-sit":      { row: 36, from: 0, count: 9, fps: 8, loop: "loop" },
  "wash-lay":      { row: 38, from: 0, count: 9, fps: 8, loop: "loop" },

  /* ---- USED BY cat-items.js → ROOM_SPOTS "lounge-back".
     A big slow yawn — reads as a contented, sleepy cat. ---- */
  "yawn-sit":      { row: 32, from: 0, count: 8, fps: 6, loop: "loop" },
  "yawn-lay":      { row: 34, from: 0, count: 8, fps: 6, loop: "loop" },

  /* Scratching. Used only if you switch the scratching post from
     decoration back into a place the cat sits — see cat-items.js. */
  "itch-r":        { row: 40, from: 0, count: 11, fps: 10, loop: "loop" },
  "itch-l":        { row: 39, from: 0, count: 11, fps: 10, loop: "loop" },

  /* Batting a paw. Available if you ever make toys interactive. */
  "play":          { row: 44, from: 0, count: 9, fps: 8, loop: "loop" },
  "play-left":     { row: 47, from: 0, count: 7, fps: 8, loop: "loop" },
  "play-right":    { row: 46, from: 0, count: 7, fps: 8, loop: "loop" },
  "hind-legs":     { row: 52, from: 0, count: 4, fps: 7, loop: "loop" },

  /* A little meow. Sweet for a one-off greeting when the room opens. */
  "meow-sit":      { row: 28, from: 0, count: 3, fps: 4, loop: "once" },
  "meow-lay":      { row: 30, from: 0, count: 3, fps: 4, loop: "once" },

  /* Walking. NOT used — the cats cut between spots rather than walking,
     which is deliberate (no pathfinding, nothing to go wrong). Listed so
     the rows are recorded if anyone ever wants them. */
  "walk-down":     { row:  4, from: 0, count: 4, fps: 8, loop: "loop" },
  "walk-up":       { row:  5, from: 0, count: 4, fps: 8, loop: "loop" },
  "walk-right":    { row:  6, from: 0, count: 8, fps: 10, loop: "loop" },
  "walk-left":     { row:  7, from: 0, count: 8, fps: 10, loop: "loop" },

  /* =====================================================================
     🚫 DELIBERATELY LEFT OUT — PLEASE DO NOT ADD THESE
     The sheet also contains:
        rows 41-42  hiss-l / hiss-r   (an angry, hissing cat)
        row  43     idle-sad          (a visibly sad cat)

     They are not listed here ON PURPOSE.

     Why: this app is addition-based and food-neutral. Nothing in it
     tells a user they did something wrong. A pet that looks sad or
     hisses because someone did not open the app for a week is a guilt
     mechanic, and it would sit inches away from health messaging that
     says the opposite. Adding these rows would quietly contradict the
     whole project.

     If a future maintainer wants "the cat is happy to see you", use
     meow-sit, yawn-sit or wash-sit on arrival. Never a sad or angry one.
     ===================================================================== */
};


/* =====================================================================
   NOTES FROM THE ORIGINAL SHEET INVENTORY
   ---------------------------------------------------------------------
   Kept so nobody has to measure the sheet again.

   • The pack has LEFT and RIGHT variants of most animations, usually on
     consecutive rows. Where the inventory listed the same name twice
     (meow-sit on rows 28 AND 29, yawn-sit on 32 AND 33, wash-sit on 36
     AND 37), those are the two facing directions. This file uses the
     first of each pair; swap to the other row if the cat ends up facing
     the wrong way once you see it in the room.

   • Eating has eight angles (rows 20-27): front, back, left, right, and
     four diagonals. If a cat looks wrong at its bowl, try another of
     those rows — the frame count is the same (8) for all of them.

   • Sleeping has eight variants too (rows 12-19), from head-up dozing to
     fully flat out. All are 2 frames.

   • There is NO drinking animation and NO stretching animation in this
     pack. Drinking borrows an eating angle; what was going to be a
     stretch is a yawn instead.
   ===================================================================== */


/* =====================================================================
   ↓↓↓ BELOW THIS LINE IS PLUMBING — you never need to edit it. ↓↓↓
   It is two small helpers so the rest of the site can ask questions
   like "where is the eating animation?" without worrying about typos
   or half-filled-in rows.
   ===================================================================== */

/* Look up an animation by nickname.
   Returns the idle pose instead if the nickname is unknown, or if the
   row is still null (not yet looked up). That is why a half-finished
   cat-frames.js still shows a working cat rather than a broken box. */
function catFrame(name) {
  const a = CAT_FRAMES[name];
  if (a && a.row !== null && a.row !== undefined) return a;
  const fallback = CAT_FRAMES["idle"];
  return (fallback && fallback.row !== null) ? fallback
       : { row: 0, from: 0, count: 1, fps: 0, loop: "single-still" };
}

/* Build a safe web address for a sprite file.
   The artist's filenames contain spaces ("cat 1 16x16 animation.png").
   Spaces are legal on your computer but not inside a web address, so
   this swaps them for the %20 code browsers expect. Without this the
   cat loads on a Mac but shows a broken image on some phones. */
function catSheetURL(filename) {
  return CAT_SHEET.folder + encodeURIComponent(filename);
}
