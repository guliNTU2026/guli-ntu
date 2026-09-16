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

/* FEED / DECAY timing — how the bowl level changes. No live draining while
   someone is playing; it only drops based on time BETWEEN visits.
   ✏️ tune these freely. */
const BOWL_RULES = {
  feedStep:   1,    // levels the bowl rises per "feed" tap
  feedCost:   5,    // coins per feed tap
  decayHours: 12,   // real hours that pass to drop the bowl by 1 level
  maxLevel:   4,    // top level (matches the last file in "levels")
  // NOTE (philosophy): an empty bowl has NO penalty — no hunger, no sad
  // cat. Feeding is a friendly "hello", not a chore. Keep it that way.
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
   PLANTS — room decoration (add files as you crop them).
   ===================================================================== */
const CAT_PLANTS = [
  { id:"plant-1", zh:"盆栽", en:"Potted plant", price:20, file:"plant1.png", category:"plant" },
];


/* =====================================================================
   ACCESSORIES worn on the cat. Some are ANIMATED (bows, hearts, wings):
   for those, list frames in "frames" (in order) instead of a single
   "file". Seasonal ones use "season" to appear only in their holiday
   window (matches a holiday id in foods-data.js: "christmas","valentine").
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

  /* hearts — ANIMATED, Valentine's only */
  { id:"heart-yellow", zh:"黃愛心", en:"Yellow heart", price:0, category:"seasonal", season:"valentine",
    frames:["yellow_heart_0.png","yellow_heart_1.png"] },
  { id:"heart-red",    zh:"紅愛心", en:"Red heart",    price:0, category:"seasonal", season:"valentine",
    frames:["red_heart_0.png","red_heart_1.png"] },
  { id:"heart-pink",   zh:"粉愛心", en:"Pink heart",   price:0, category:"seasonal", season:"valentine",
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
  { id:"by-bowl", x:25, y:70, needs:"bowl", pose:"eat-front" },
  { id:"in-bed",  x:72, y:68, needs:"bed",  pose:"sleep-lay-front-l" },
  { id:"at-post", x:80, y:35, needs:"post", pose:"itch-r" },
  { id:"center",  x:50, y:75, needs:null,   pose:"wash-sit" },  /* always valid fallback */
];
