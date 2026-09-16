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
  decayHours: 12,   // real hours to drop the bowl by 1 level, with ONE cat
  maxLevel:   4,    // top level (matches the last file in "levels")

  /* MORE CATS EAT MORE.
     Each cat beyond the first makes the bowl empty faster. 0.25 means a
     quarter more appetite per extra cat:

        1 cat   bowl lasts 12h a level   ~10 coins a day
        2 cats                 ~9.6h     ~12 coins a day
        3 cats                   ~8h     ~15 coins a day
        4 cats                 ~6.9h     ~17 coins a day

     Deliberately kept gentle: even a full house of four never costs
     quite twice a single cat. Feeding should feel like a reason to play
     a round of the quiz, never like a bill arriving.

     So a full house genuinely needs you to play the games, rather than
     coasting on the daily check-in — which is the point. And because an
     empty bowl still costs nothing at all, a busy week just means a
     lower bowl, never an unhappy cat.
     Set this to 0 and extra cats eat nothing extra. */
  extraCatAppetite: 0.25,

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
  /* fills = how many bars of the bowl this food adds.
     The bigger tins cost more but LESS PER BAR, so saving up is the
     better deal. That is the point: it rewards playing a couple of extra
     quiz rounds instead of feeding one bar at a time.

        日常飼料  5 coins  -> 1 bar    5.0 per bar
        高級餐    9 coins  -> 2 bars   4.5 per bar
        特別零食 12 coins  -> 3 bars   4.0 per bar
        豪華大餐 14 coins  -> 4 bars   3.5 per bar   (fills an empty bowl)

     ⚠️ A bowl only holds BOWL_RULES.maxLevel bars. Feeding a 4-bar meal
     into a half-full bowl still costs the full price and the extra is
     simply lost, so the app shows what each one will actually add and
     nudges toward the one that fits. Nothing is ever blocked — it is a
     mild choice, never a punishment.

     ✏️ To add another tier: copy a line, give it a new id, set fills and
     price, and point file: at a PNG in items/.
     ⚠️ The 4-bar one below reuses brown_food.png as a placeholder, since
     only three food pictures were listed. Give it its own file when you
     have one. */
  { id:"food-everyday", zh:"日常飼料", en:"Everyday food", price:5,  fills:1, file:"brown_food.png",  category:"food" },
  { id:"food-premium",  zh:"高級餐",   en:"Premium meal",  price:9,  fills:2, file:"pink_food.png",   category:"food" },
  { id:"food-treat",    zh:"特別零食", en:"Special treat", price:12, fills:3, file:"orange_food.png", category:"food" },
  { id:"food-feast",    zh:"豪華大餐", en:"Big feast",     price:14, fills:4, file:"brown_food.png",  category:"food" },
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

  /* Extra cats do NOT drink faster, by choice — food already scales, and
     making everything scale at once turns a full house into a chore.
     Set it to 0.25 (like the food bowl) if you want water to scale too. */
  extraCatAppetite: 0,

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
  { id:"post-treehouse", zh:"貓跳台",     en:"Tree house",       price:60, file:"treehouse_post.png", category:"post",
    /* ✏️ CATS ON TOP — see the long note below. These two numbers per
       perch are the only thing you tune, and they are a first guess
       until the real artwork is on screen. */
    perches:[
      { dx:0,  dy:-26, pose:"curl-sleep" },   /* curled up on the top platform */
      { dx:-6, dy:-10, pose:"sit-front"  },   /* sitting in the cubby below */
    ] },
];


/* =====================================================================
   PUTTING CATS ON THE FURNITURE ("perches")
   =====================================================================
   Any decoration above can let cats sit ON it by adding a `perches:`
   list, like the tree house does. Each entry creates one place a cat can
   be. Leave `perches` off entirely and the item is plain decoration —
   which is what all the others do.

   Each perch has exactly three things:
     dx, dy  how far from the item's own position the cat sits, in
             percent of the room. NEGATIVE dy is UPWARDS. So dy:-26
             means "26% of the room height above where the post sits",
             i.e. up on the top platform.
     pose    any pose name from cat-frames.js. "curl-sleep",
             "sit-front", "lying" and "itch-r" all suit furniture.

   HOW TO TUNE IT (you do NOT do this by maths)
   Open cat-bowl-demo.html, place the tree house, and use the arrow
   buttons in the "Cats on furniture" box. They nudge the cat around on
   screen and print the finished dx/dy line for you to paste back here.
   About a minute per perch, done by eye.

   WHY IT IS SAFE
   If the numbers are wrong the cat just sits in a slightly odd place —
   it cannot crash anything, and a perch is never the ONLY spot a cat
   can use. Delete the `perches:` line and everything reverts to plain
   decoration instantly.

   ⚠️ Do this LAST, once the artwork is actually in items/. Positioning a
   cat against a picture you cannot see yet is guesswork; positioning it
   against one you CAN see takes a minute.
   ===================================================================== */


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
  /* x,y   = where the CAT stands (percent of the room; y counts DOWNWARDS)
     ix,iy = where the FURNITURE for this spot is drawn. The bowl sits in
             front of the cat; the bed sits under it.

     ⚠️ SPACING MATTERS. A cat is drawn about 15% of the room wide, so two
     spots closer than that will visibly overlap. The room is 4:3, which
     means 1% of HEIGHT is only 0.75% of WIDTH — so vertical gaps need to
     be bigger than horizontal ones to look the same.
     The seven spots below are laid out as three rows (back / middle /
     front), every pair at least 22% apart in width terms. If you move
     one, keep that much clearance or cats will sit on top of each other.

     Everything must also stay BELOW ROOM_STYLE.floorTop, or it looks
     like it is floating on the wall. */

  /* --- back row --- */
  { id:"at-water",     x:32, y:58, ix:32, iy:66, needs:"water", pose:"drink-front" },
  { id:"in-bed",       x:68, y:58, ix:68, iy:62, needs:"bed",   pose:"sleep-lay-front-l" },

  /* --- middle row --- */
  { id:"by-bowl",      x:14, y:76, ix:14, iy:86, needs:"bowl",  pose:"eat-front" },
  { id:"center",       x:50, y:76, needs:null,   pose:"wash-sit" },
  { id:"lounge-back",  x:80, y:78, needs:null,   pose:"yawn-sit" },

  /* --- front row --- */
  { id:"lounge-left",  x:32, y:94, needs:null,   pose:"lying" },
  { id:"lounge-right", x:68, y:94, needs:null,   pose:"sit-front" },

  /* Four of these need no furniture at all (center, lounge-back,
     lounge-left, lounge-right), matching the four cat colours — so even
     a visitor who owns every cat and has bought nothing still gets a
     proper spot for each, and the floor fallback never triggers. Add a
     5th colour to CAT_COLORS and you should add a 5th free spot here. */
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
   see it, which is the opposite of what a decorating game should do.

   x,y  = position, percent of the room.
   size = how wide to draw it, percent of the room width. Bump it up for
          big things like the tree house. ✏️ Tune these once the real
          artwork is in items/ — they are first guesses.
   ===================================================================== */
const ROOM_DECOR = [
  { needs:"post",    x:94, y:56, size:24 },   /* scratching post / tree house */
  { needs:"carrier", x:6,  y:56, size:16 },   /* cat carrier */
  { needs:"toy",     x:50, y:96, size:9  },   /* mouse, bee, ball... */
  { needs:"plant",   x:96, y:96, size:15 },   /* potted plant */
];


/* =====================================================================
   WALLPAPER & FLOORING — bought with coins, drawn with colour.
   =====================================================================
   These need NO artwork. The room is painted from flat colour bands, so
   a new wallpaper is just a few colour codes — which means you can add
   one in a minute without commissioning anything.

   They are named after whole grains and everyday foods on purpose, so
   even the decorating stays on theme.

   Each wall may have a pattern: "plain", "stripe" or "check". Those are
   drawn with hard-edged repeating bands — no soft gradients — so they
   sit properly next to 32x32 pixel art instead of looking airbrushed.

   ✏️ TO ADD ONE: copy a block, give it a new id, pick colours with any
   colour picker, set a price. It appears in the shop by itself.
   ===================================================================== */
const ROOM_WALLS = [
  { id:"wall-oat",     zh:"燕麥米白", en:"Oat",          price:0,  category:"wall", pattern:"plain",
    wall:"#F1E6CF", wallShade:"#E6D5B2", skirting:"#B39061" },
  { id:"wall-soymilk", zh:"豆漿白",   en:"Soy milk",     price:35, category:"wall", pattern:"stripe",
    wall:"#F6F0E2", wallShade:"#EBE2CE", skirting:"#C2AE86" },
  { id:"wall-matcha",  zh:"抹茶綠",   en:"Matcha",       price:45, category:"wall", pattern:"plain",
    wall:"#DCE6CE", wallShade:"#CBD9B6", skirting:"#7E9463" },
  { id:"wall-purple",  zh:"紫米紫",   en:"Purple rice",  price:45, category:"wall", pattern:"check",
    wall:"#DED5E4", wallShade:"#CEC2D8", skirting:"#8A7796" },
  { id:"wall-sweetpo", zh:"地瓜橘",   en:"Sweet potato", price:45, category:"wall", pattern:"stripe",
    wall:"#F5DFC4", wallShade:"#EACFAC", skirting:"#C18B57" },
  { id:"wall-redbean", zh:"紅豆紅",   en:"Red bean",     price:55, category:"wall", pattern:"plain",
    wall:"#EBD2CC", wallShade:"#DCBDB5", skirting:"#9E6A5E" },

  /* ---- SEASONAL, and FREE while their holiday is on ----
     These cost nothing and appear only during their date window, which
     comes from HOLIDAYS in foods-data.js — the same list that drives the
     photo frames. That means a seasonal freebie needs NO ARTWORK at all:
     it is four colour codes. Miss the window and it simply goes back in
     the cupboard; anyone who claimed it keeps it forever.
     ✏️ To add one for another holiday, copy a line and change `season`
     to that holiday's id (midautumn, double10, halloween, christmas,
     lny, dragonboat, valentine). */
  { id:"wall-halloween", zh:"萬聖節", en:"Halloween", price:0, category:"wall", season:"halloween",
    pattern:"stripe", wall:"#3B2F45", wallShade:"#2E2436", skirting:"#E08A33" },
  { id:"wall-christmas", zh:"聖誕節", en:"Christmas", price:0, category:"wall", season:"christmas",
    pattern:"check",  wall:"#E4EDE2", wallShade:"#CFE0CD", skirting:"#247A5A" },
  { id:"wall-lny",       zh:"新年",   en:"Lunar New Year", price:0, category:"wall", season:"lny",
    pattern:"plain",  wall:"#F0D9D2", wallShade:"#E4C4BA", skirting:"#C0392B" },
  { id:"wall-midautumn", zh:"中秋",   en:"Mid-Autumn", price:0, category:"wall", season:"midautumn",
    pattern:"plain",  wall:"#2E3A52", wallShade:"#263145", skirting:"#F3B72B" },
];

const ROOM_FLOORS = [
  { id:"floor-brownrice", zh:"糙米棕",   en:"Brown rice",   price:0,  category:"floor",
    floor:"#D8B98A", floorLine:"#C3A075" },
  { id:"floor-oatmilk",   zh:"燕麥奶",   en:"Oat milk",     price:35, category:"floor",
    floor:"#E8DCC2", floorLine:"#D2C3A3" },
  { id:"floor-buckwheat", zh:"蕎麥灰",   en:"Buckwheat",    price:40, category:"floor",
    floor:"#C9C2B4", floorLine:"#B0A899" },
  { id:"floor-blackrice", zh:"黑米深棕", en:"Black rice",   price:50, category:"floor",
    floor:"#9C8266", floorLine:"#856D54" },
  { id:"floor-millet",    zh:"小米黃",   en:"Millet",       price:40, category:"floor",
    floor:"#E9D49A", floorLine:"#D4BC7F" },

  /* ---- SEASONAL, free while the holiday is on (see the walls above) ---- */
  { id:"floor-halloween", zh:"萬聖節", en:"Halloween", price:0, category:"floor", season:"halloween",
    floor:"#6B4A2F", floorLine:"#523823" },
  { id:"floor-christmas", zh:"聖誕節", en:"Christmas", price:0, category:"floor", season:"christmas",
    floor:"#C8B39A", floorLine:"#A8927A" },
];


/* =====================================================================
   THE ROOM ITSELF — colours, not pictures.
   =====================================================================
   There is no illustrated background, so the room is DRAWN WITH COLOUR
   BANDS: a wall across the top, a skirting board, and a floor below.
   Flat colours with hard edges, to sit properly alongside pixel art.

   ✏️ Change any colour below and the room changes. Colours are written
   as #RRGGBB — use any colour picker to get one.

   floorTop = how far down the wall ends and the floor begins, as a
   percentage. Raise it for a taller wall, lower it for more floor.
   ⚠️ If you change it, check nothing in ROOM_SPOTS or ROOM_DECOR is
   left floating above the floor line.

   GOT A REAL BACKGROUND PICTURE LATER?
   Put the file in items/ and write its name in `image` below, e.g.
       image: "room_background.png",
   The drawn room is then replaced by your picture automatically and all
   the colours here are ignored. Set it back to "" to return to colours.
   ===================================================================== */
const ROOM_STYLE = {
  image:      "",          /* optional background PNG in items/ — "" = use the colours below */
  wall:       "#F1E6CF",   /* upper part of the room */
  wallShade:  "#E6D5B2",   /* a slightly darker band at the top, adds depth */
  skirting:   "#B39061",   /* the board where the wall meets the floor */
  floor:      "#D8B98A",   /* the floorboards */
  floorLine:  "#C3A075",   /* floorboard lines */
  floorTop:   52,          /* percent down the room where the floor starts */
  window:     true,        /* draw a simple window on the wall? true / false */
  windowGlass:"#CFE4E8",   /* the sky colour seen through it */
  rug:        true,        /* draw a soft rug on the floor? true / false */
  rugColor:   "#E2B9A0",
};


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
