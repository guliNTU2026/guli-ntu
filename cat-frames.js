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

  /* ---- The everyday pose. This is the safety net: whenever any other
     pose is missing or still says null, the cat shows this instead.
     Rows 0-3 are the still/idle poses in this pack, so row 0 is a safe
     starting guess — but check it in sprite-lab.html anyway. ---- */
  "idle":        { row: 0, from: 0, count: 1, fps: 0, loop: "single-still" },

  /* ---- A gentle breathing loop, if the pack has one. Leave as null and
     the cat just sits perfectly still, which is also fine. ---- */
  "idle-breathe":{ row: null, from: 0, count: 4, fps: 3, loop: "loop-slow" },

  /* ---- USED BY cat-items.js → ROOM_SPOTS "by-bowl". Plays when the
     cat is standing at its food bowl. ---- */
  "eat-front":   { row: null, from: 0, count: 6, fps: 7, loop: "loop" },

  /* ---- USED BY cat-items.js → ROOM_SPOTS "at-water". The cat drinking.
     If the pack has no drinking row, leave this null forever — the cat
     will sit normally at the water dish, which looks perfectly fine. ---- */
  "drink-front": { row: null, from: 0, count: 6, fps: 6, loop: "loop" },

  /* ---- USED BY cat-items.js → ROOM_SPOTS "in-bed". The cat curled up
     asleep, facing front, lying on its left. ---- */
  "sleep-lay-front-l": { row: null, from: 0, count: 4, fps: 2, loop: "loop-slow" },

  /* ---- CURRENTLY UNUSED, but kept on purpose.
     Scratching posts are decoration for now (the cat would not sit on
     one convincingly). If you later find a post whose artwork works
     with a cat on top, cat-items.js explains the two-line change that
     switches this back on — so it is worth filling in if you spot the
     row. ---- */
  "itch-r":      { row: null, from: 0, count: 4, fps: 8, loop: "loop" },

  /* ---- USED BY cat-items.js → ROOM_SPOTS "center". Sitting and
     washing/licking itself. This is the always-available fallback spot,
     so it is worth filling in first. ---- */
  "wash-sit":    { row: null, from: 0, count: 6, fps: 6, loop: "loop" },

  /* ---- CURRENTLY UNUSED. Toys are decoration (a cat standing on a
     mouse toy would hide it completely). Kept in case you want a
     playing spot later. ---- */
  "play":        { row: null, from: 0, count: 4, fps: 8, loop: "loop" },

  /* ---- Optional extras. Nice to have, not required. Fill in later
     (or delete the lines entirely — nothing depends on them). ---- */
  /* USED BY cat-items.js → ROOM_SPOTS "lounge-right". A good all-round
     pose, so it is worth filling in early. */
  "sit-front":   { row: null, from: 0, count: 1, fps: 0, loop: "single-still" },
  /* USED BY cat-items.js → ROOM_SPOTS "lounge-left". */
  "lying":       { row: null, from: 0, count: 1, fps: 0, loop: "single-still" },
  /* USED BY cat-items.js → ROOM_SPOTS "lounge-back". */
  "stretch":     { row: null, from: 0, count: 6, fps: 7, loop: "once" },

  /* =====================================================================
     🚫 DELIBERATELY LEFT OUT — PLEASE DO NOT ADD THESE
     The artist's sheet also contains an angry "hiss" (around rows 41-42)
     and a "sad idle" (around row 43). They are not listed here ON
     PURPOSE.

     Why: this app is addition-based and food-neutral. Nothing in it
     tells a user they did something wrong. A pet that looks sad or
     hisses because someone did not open the app for a week is a guilt
     mechanic, and it would sit inches away from health messaging that
     says the opposite. Adding these rows would quietly contradict the
     whole project.

     If a future maintainer wants "the cat is happy to see you", use a
     stretch or a wash animation on arrival. Never a sad or angry one.
     ===================================================================== */
};


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
