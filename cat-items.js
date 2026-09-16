/* =====================================================================
   cat-items.js  —  THE FILE YOU EDIT for the cat's room
   =====================================================================
   Every buyable/placeable thing: cats, bowls, food, water, toys, beds,
   scratching posts, plants, and accessories (collars, bows, hats,
   hearts, antlers). Names/prices are PLACEHOLDERS — change freely.

   ---------------------------------------------------------------------
   HOW TO EDIT (no coding needed)
   ---------------------------------------------------------------------
   • Each item is one block between { and },
   • zh = Chinese name shown, en = English name shown. Change only the
     words inside "quotes"; keep the quotes.
   • price = coins (a plain number, no quotes). Free = price:0
   • file = the PNG you saved for it. Must match your real filename
     EXACTLY (case-sensitive), including .png
   • To ADD: copy a block, paste before the closing ], give it a unique id.
   • To REMOVE: delete the whole { ... }, block.
   • Broke the room after editing? You dropped a comma or quote — undo.
   ===================================================================== */


/* =====================================================================
   CAT COLORS — the animals a user can adopt.
   All four share the IDENTICAL sprite layout, so the code uses ONE
   shared frame-map and just swaps which file it reads.
   FRAME SIZE: 32x32, confirmed. (The "16x16" in the sheet filenames is
   the pack's naming only — real frames are 32x32; full sheet 352x1696,
   11 cols x 53 rows, no padding.)
   ===================================================================== */
const CAT_FRAME_SIZE = 32;   /* confirmed 32x32 — do not change */

const CAT_COLORS = [
  { id:"black", zh:"黑貓",   en:"Black cat",  file:"cat 1 16x16 animation.png" },
  { id:"gray",  zh:"灰貓",   en:"Gray cat",   file:"cat 2 16x16 animation.png" },
  { id:"brown", zh:"棕貓",   en:"Brown cat",  file:"cat 4 16x16 animation.png" },
  { id:"calico",zh:"三花貓", en:"Calico cat", file:"cat 10 16x16 animation.png" },
];
const EXTRA_CAT_PRICE = 40;  /* coins for each additional color; first is free */


/* =====================================================================
   BOWLS — the fill/deplete bowls. IMPORTANT: only the 2 bowls that were
   drawn with food-level frames can show progression, so those are the
   ones offered. Each bowl uses SEVERAL PNGs, one per fill level, named
   with the level number: e.g. green_bowl_0.png (empty) ... _4.png (full).
   List the level files in order, empty -> full. The code shows the PNG
   matching the current level.
   ===================================================================== */
const CAT_BOWLS = [
  { id:"bowl-green",  zh:"綠色碗", en:"Green bowl",  price:15, category:"bowl",
    levels:["green_bowl_0.png","green_bowl_1.png","green_bowl_2.png","green_bowl_3.png","green_bowl_4.png"] },
  { id:"bowl-purple", zh:"紫色碗", en:"Purple bowl", price:15, category:"bowl",
    levels:["purple_bowl_0.png","purple_bowl_1.png","purple_bowl_2.png","purple_bowl_3.png","purple_bowl_4.png"] },
];

/* =====================================================================
   FEED / DECAY timing — the feeding loop. ✏️ tune these freely.
   ---------------------------------------------------------------------
   HOW IT WORKS
   The bowl has 5 fill levels, 0 (empty) to 4 (full). Tapping Feed costs
   coins and raises it. Time passing lowers it. Nothing drains while
   someone is actually playing — the level is worked out once, on load,
   from how long they were away. So the bowl never empties in front of
   them; they just come back to a lower bowl.

   WHY THESE NUMBERS (the coin maths — worth understanding before you
   change them)
   At decayHours 12, the bowl drops 2 levels a day, so keeping it full
   costs 2 x 5 = 10 coins a day. The daily check-in bonus is also
   exactly 10 coins. That is deliberate:
     • someone who only opens the app breaks even and can always feed
     • anyone who answers a quiz or builds a meal earns MORE than the cat
       consumes, so there is always surplus left over for furniture
   The cat is therefore a reason to play, never a treadmill you can fall
   behind on.
     • want it slower / gentler?  raise decayHours (24 = half the cost)
     • want it to matter more?    lower decayHours or raise feedCost
   Changing one number here is safe; nothing else needs touching.
   ===================================================================== */
const BOWL_RULES = {
  feedStep:   1,    // levels the bowl rises per "feed" tap
  feedCost:   5,    // coins per feed tap
  decayHours: 12,   // real hours that pass to drop the bowl by 1 level
  maxLevel:   4,    // top level (matches the last file in "levels")

  /* ===================================================================
     🚫 PHILOSOPHY — THE LINE THAT MUST NOT BE CROSSED
     Feeding COSTS COINS. That part is intentional: it gives the coins a
     purpose and gives people a reason to come back and play the games.
     An empty bowl, however, costs the user NOTHING.

     Specifically, an empty bowl must never cause:
       • a sad, sick, hungry or angry cat
       • lost coins, lost progress, or a lost streak
       • a nagging message, a red badge, or a reminder
       • the cat leaving, or refusing to be petted

     The cat is always pleased to see you. The bowl is an opportunity to
     do something nice, never a debt you owe. This mirrors the whole
     project: food-neutral, addition-based, never guilt-based. A future
     maintainer adding "the cat is sad because you didn't feed it" would
     be contradicting the health message printed inches away in the same
     app. Please do not.
     =================================================================== */
};


/* =====================================================================
   FOOD & WATER — mostly buy-button flavor/icons. If your food doesn't
   change how the bowl looks, these are just cosmetic choices/icons.
   Keep 2-3 foods; 5 is more than needed.
   ===================================================================== */
const CAT_FOODS = [
  { id:"food-everyday", zh:"日常飼料", en:"Everyday food", price:5, file:"brown_food.png", category:"food" },
  { id:"food-premium",  zh:"高級餐",   en:"Premium meal",  price:8, file:"pink_food.png",  category:"food" },
  { id:"food-treat",    zh:"特別零食", en:"Special treat", price:8, file:"orange_food.png",category:"food" },
];
const CAT_WATER = [
  { id:"water", zh:"清水", en:"Fresh water", price:5, file:"water_bottle.png", category:"water" },
];

/* WATER TOP-UPS — the same idea as the food bowl, but its own settings so
   you can make water cheaper / slower / kinder than food independently.

   ⚠️ maxLevel is 1 because you only have ONE water picture
   (water_bottle.png), so water can only be "there" or "not there".
   If you later crop a set of level pictures (empty -> full), add them to
   the water item above exactly like the bowls do:

       { id:"water", zh:"清水", en:"Fresh water", price:5, category:"water",
         levels:["water_0.png","water_1.png","water_2.png"] },

   ...and set maxLevel below to the last index (2 in that example). The
   code handles both shapes on its own; nothing else needs changing.

   THE COIN MATHS (see the long note under BOWL_RULES for why this matters)
   Water at 24 hours costs 3 coins a day. Food at 12 hours costs 10. So
   keeping BOTH permanently topped up runs about 13 coins a day, against a
   10-coin daily check-in. Someone who only ever opens the app and never
   plays will therefore drift about 3 coins a day short of keeping both
   full — which is HARMLESS, because an empty dish has no penalty at all;
   they simply keep one topped up instead of two.
   Want the old "a passive visitor can keep everything full" property back?
   Change decayHours under BOWL_RULES from 12 to 24. That drops food to
   5/day, so food + water = 8/day, comfortably under the check-in. */
const WATER_RULES = {
  feedStep:   1,    // levels a top-up adds
  feedCost:   3,    // coins per top-up (cheaper than food on purpose)
  decayHours: 24,   // real hours to drop one level
  maxLevel:   1,    // 1 = simply full or empty (one picture)

  /* Same rule as the food bowl, and it is not negotiable: an empty water
     dish must never make the cat sad, sick, thirsty or unhappy. It is an
     opportunity to be kind, never a debt. */
};


/* =====================================================================
   TOYS — 1 mouse, 1 bee, 1 carrot, and 3-4 balls (pick your favorites;
   you don't need every ball color).
   ===================================================================== */
const CAT_TOYS = [
  { id:"toy-mouse",  zh:"老鼠玩具", en:"Mouse toy",  price:12, file:"mouse_toy.png",  category:"toy" },
  { id:"toy-bee",    zh:"蜜蜂玩具", en:"Bee toy",    price:12, file:"bee_toy.png",    category:"toy" },
  { id:"toy-carrot", zh:"胡蘿蔔",   en:"Carrot toy", price:12, file:"carrot_toy.png", category:"toy" },
  { id:"ball-red",   zh:"紅球",     en:"Red ball",   price:10, file:"red_ball.png",   category:"toy" },
  { id:"ball-blue",  zh:"藍球",     en:"Blue ball",  price:10, file:"blue_ball.png",  category:"toy" },
  { id:"ball-yellow",zh:"黃球",     en:"Yellow ball",price:10, file:"yellow_ball.png",category:"toy" },
];


/* =====================================================================
   BEDS — you have 9. Listed all; trim any you don't want to sell.
   ===================================================================== */
const CAT_BEDS = [
  { id:"bed-tan",    zh:"米色床",   en:"Tan bed",         price:30, file:"tan_bed.png",    category:"bed" },
  { id:"bed-dgreen", zh:"墨綠床",   en:"Dark green bed",  price:30, file:"dgreen_bed.png", category:"bed" },
  { id:"bed-dpurple",zh:"深紫床",   en:"Dark purple bed", price:30, file:"dpurple_bed.png",category:"bed" },
  { id:"bed-mocha",  zh:"摩卡床",   en:"Mocha bed",       price:30, file:"mocha_bed.png",  category:"bed" },
  { id:"bed-blue",   zh:"藍色床",   en:"Blue bed",        price:30, file:"blue_bed.png",   category:"bed" },
  { id:"bed-gray",   zh:"灰色床",   en:"Gray bed",        price:30, file:"gray_bed.png",   category:"bed" },
  { id:"bed-yellow", zh:"黃色床",   en:"Yellow bed",      price:30, file:"yellow_bed.png", category:"bed" },
  { id:"bed-lgreen", zh:"淺綠床",   en:"Light green bed", price:30, file:"lgreen_bed.png", category:"bed" },
  { id:"bed-red",    zh:"紅色床",   en:"Red bed",         price:30, file:"red_bed.png",    category:"bed" },
];


/* =====================================================================
   SCRATCHING POSTS — you have 7. The cat scratches at whichever one is
   placed in the room (the "at-post" spot further down).
   The tree house is the big showpiece, so it is priced higher; the small
   brown one is the cheap starter. ✏️ change any price freely.
   ===================================================================== */
const CAT_POSTS = [
  { id:"post-sbrown",    zh:"小棕貓抓柱", en:"Small brown post", price:25, file:"sbrown_post.png",    category:"post" },
  { id:"post-bbrown",    zh:"大棕貓抓柱", en:"Big brown post",   price:35, file:"bbrown_post.png",    category:"post" },
  { id:"post-green",     zh:"綠貓抓柱",   en:"Green post",       price:30, file:"green_post.png",     category:"post" },
  { id:"post-tan",       zh:"米色貓抓柱", en:"Tan post",         price:30, file:"tan_post.png",       category:"post" },
  { id:"post-pink",      zh:"粉貓抓柱",   en:"Pink post",        price:30, file:"pink_post.png",      category:"post" },
  { id:"post-purple",    zh:"紫貓抓柱",   en:"Purple post",      price:30, file:"purple_post.png",    category:"post" },
  { id:"post-treehouse", zh:"貓跳台",     en:"Tree house",       price:60, file:"treehouse_post.png", category:"post" },
];


/* =====================================================================
   CARRIERS — the cat sits inside one. Two colours.
   ===================================================================== */
const CAT_CARRIERS = [
  { id:"carrier-pink",  zh:"粉色提籠", en:"Pink carrier",  price:35, file:"pink_carrier.png",  category:"carrier" },
  { id:"carrier-green", zh:"綠色提籠", en:"Green carrier", price:35, file:"green_carrier.png", category:"carrier" },
];


/* =====================================================================
   PLANTS — room decoration (add files as you crop them).
   ===================================================================== */
const CAT_PLANTS = [
  { id:"plant-1", zh:"盆栽", en:"Potted plant", price:20, file:"plant1.png", category:"plant" },
];


/* =====================================================================
   ACCESSORIES worn on the cat. Some are ANIMATED (bows, hearts, wings):
   for those, list frames in "frames" (in order) instead of a single
   "file".

   An item with a "season" appears ONLY during that holiday's date window.
   The word must match a holiday id in HOLIDAYS in foods-data.js — right
   now those are: midautumn, double10, halloween, christmas, lny,
   dragonboat, valentine. An item with NO "season" is on sale all year.
   (Misspell the season and the item simply never shows up — that is the
   usual cause of "my item disappeared".)
   ===================================================================== */
const CAT_ACCESSORIES = [
  /* collars (static) */
  { id:"collar-blue",  zh:"藍色項圈", en:"Blue collar",  price:20, file:"blue_collar.png",  category:"collar" },
  { id:"collar-purple",zh:"紫色項圈", en:"Purple collar",price:20, file:"purple_collar.png",category:"collar" },
  { id:"collar-pink",  zh:"粉色項圈", en:"Pink collar",  price:20, file:"pink_collar.png",  category:"collar" },
  { id:"collar-green", zh:"綠色項圈", en:"Green collar", price:20, file:"green_collar.png", category:"collar" },

  /* bows — ANIMATED (replace frame filenames with your real ones, in order) */
  { id:"bow-green", zh:"綠蝴蝶結", en:"Green bow", price:20, category:"bow",
    frames:["green_bow_0.png","green_bow_1.png"] },
  { id:"bow-red",   zh:"紅蝴蝶結", en:"Red bow",   price:20, category:"bow",
    frames:["red_bow_0.png","red_bow_1.png"] },
  { id:"bow-blue",  zh:"藍蝴蝶結", en:"Blue bow",  price:20, category:"bow",
    frames:["blue_bow_0.png","blue_bow_1.png"] },
  { id:"bow-yellow",zh:"黃蝴蝶結", en:"Yellow bow",price:20, category:"bow",
    frames:["yellow_bow_0.png","yellow_bow_1.png"] },
  { id:"bow-pinktop",zh:"粉色頭頂結", en:"Pink top bow", price:20, category:"bow",
    frames:["pinktop_bow_0.png","pinktop_bow_1.png"] },

  /* hearts — ANIMATED, available ALL YEAR ROUND.
     These used to be Valentine's-only. They are now ordinary shop items
     on sale every day, priced to match the bows. (Valentine's still
     exists as a holiday — it now drives the seasonal PHOTO FRAME instead,
     see the "valentine" entry in HOLIDAYS in foods-data.js.)
     To make them seasonal again: add  season:"valentine",  to each line. */
  { id:"heart-yellow", zh:"黃愛心", en:"Yellow heart", price:20, category:"heart",
    frames:["yellow_heart_0.png","yellow_heart_1.png"] },
  { id:"heart-red",    zh:"紅愛心", en:"Red heart",    price:20, category:"heart",
    frames:["red_heart_0.png","red_heart_1.png"] },
  { id:"heart-pink",   zh:"粉愛心", en:"Pink heart",   price:20, category:"heart",
    frames:["pink_heart_0.png","pink_heart_1.png"] },

  /* christmas — static (antlers/hats). Free during the season. */
  { id:"antlers-green", zh:"綠馴鹿角", en:"Green antlers", price:0, file:"green_antlers.png", category:"hat", season:"christmas" },
  { id:"antlers-red",   zh:"紅馴鹿角", en:"Red antlers",   price:0, file:"red_antlers.png",   category:"hat", season:"christmas" },
  { id:"hat-blue",  zh:"藍聖誕帽", en:"Blue hat",  price:0, file:"blue_hat.png",  category:"hat", season:"christmas" },
  { id:"hat-green", zh:"綠聖誕帽", en:"Green hat", price:0, file:"green_hat.png", category:"hat", season:"christmas" },
  { id:"hat-red",   zh:"紅聖誕帽", en:"Red hat",   price:0, file:"red_hat.png",   category:"hat", season:"christmas" },
];


/* =====================================================================
   ROOM SLOTS — where things sit and which cat pose plays there.
   On each visit the cat CUTS to one valid spot (no walking).
   x,y are % of the room (0-100). pose must match a cat action name.
   ===================================================================== */
const ROOM_SPOTS = [
  /* --- spots that need a piece of furniture before they exist --- */
  { id:"by-bowl",      x:20, y:72, needs:"bowl",  pose:"eat-front" },
  { id:"at-water",     x:34, y:78, needs:"water", pose:"drink-front" },
  { id:"in-bed",       x:74, y:70, needs:"bed",   pose:"sleep-lay-front-l" },

  /* --- spots that are ALWAYS available, furniture or not, so the room
     never looks empty and every cat has somewhere nice to be.
     There are FOUR of these on purpose: there are four cat colours, so
     four is the most cats anyone can own. That means even a visitor who
     has bought every cat and no furniture at all still gets a proper
     spot for each one, and the "line them up on the floor" fallback
     never has to happen. If you ever add a 5th colour to CAT_COLORS,
     add a 5th spot here too. --- */
  { id:"lounge-left",  x:30, y:56, needs:null,    pose:"lying" },
  { id:"lounge-right", x:66, y:86, needs:null,    pose:"sit-front" },
  { id:"lounge-back",  x:40, y:38, needs:null,    pose:"stretch" },
  { id:"center",       x:50, y:70, needs:null,    pose:"wash-sit" },
];


/* =====================================================================
   DECORATION — things the cat does NOT stand on or in.
   =====================================================================
   Scratching posts, carriers, toys and plants are drawn in the room but
   the cat never occupies them. That is deliberate:

     • a carrier is small, so a cat placed there would hide it completely
     • a post is tall and thin, and the cat would not sit on it convincingly
     • a toy is tiny, and a cat standing on it would cover it entirely

   In each case you would pay coins for something and then not be able to
   see it, which is the opposite of what a decorating game should do. So
   these items simply sit in the room and look nice.

   x,y are percentages of the room (0-100), same as ROOM_SPOTS. ✏️ Move
   anything by changing its numbers. The positions below are chosen to
   stay clear of the cat spots above so nothing covers anything else.
   ===================================================================== */
const ROOM_DECOR = [
  { needs:"post",    x:88, y:44 },   /* scratching post / tree house */
  { needs:"carrier", x:12, y:48 },   /* cat carrier */
  { needs:"toy",     x:60, y:56 },   /* mouse, bee, ball... */
  { needs:"plant",   x:7,  y:26 },   /* potted plant */
];


/* HOW A CAT SPOT BECOMES AVAILABLE
   A spot in ROOM_SPOTS only counts if the thing it "needs" is actually
   placed in the room. The word after `needs:` must match an item's
   `category:`. A spot with `needs:null` is always available, which is
   why an empty room still works.

   Every cat the visitor owns gets its OWN spot, so nobody overlaps. With
   3 always-available spots plus up to 3 more from furniture, there is
   room for several cats before any of them have to line up on the floor.

   WANT THE CAT ON THE SCRATCHING POST AFTER ALL?
   You mentioned some of the post artwork might work with a cat sitting
   on top. If you try it and like it, add this line back into ROOM_SPOTS
   and it switches on immediately:

       { id:"at-post", x:88, y:30, needs:"post", pose:"itch-r" },

   ...and delete the `post` line from ROOM_DECOR so it is not drawn
   twice. The "itch-r" pose is still listed in cat-frames.js ready for
   exactly this. Worth testing once the real art is in place — it is a
   two-line change either way.

   NOTE ABOUT "drink-front"
   That pose is not in cat-frames.js with a real row yet, so the cat will
   use its normal idle pose at the water. If you spot a drinking row in
   sprite-lab.html, add it as "drink-front" and it switches on by itself. */
