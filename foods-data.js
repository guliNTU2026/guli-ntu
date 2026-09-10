/* =====================================================================
   foods-data.js  —  THE FILE YOU EDIT
   =====================================================================
   This file holds ALL the food data for both apps:
     • 配什麼好？ (pair-it.html)
     • 營養大對決 (showdown.html)

   ⚠️ IMPORTANT: All nutrition numbers below are ROUGH PLACEHOLDERS.
   Replace them with your verified values (Taiwan FDA food composition
   database / product labels) before publishing.

   HOW TO EDIT (no coding knowledge needed):
   1. Every food is one block that starts with { and ends with },
   2. Copy an existing block, paste it at the end of the list
      (before the closing ];  ), and change the values.
   3. Text goes inside "double quotes". Numbers do NOT get quotes.
   4. Every line inside a block ends with a comma.
   5. If the app goes blank after you edit, you probably deleted a
      comma or a quote. Undo your change and try again.

   TIP: keep a backup copy of this file before big edits.
   ===================================================================== */


/* ---------------------------------------------------------------
   VENUES — where food is bought. Used to group foods and to make
   sure suggested pairings are things sold at the SAME place.
   You can rename the labels (zh / en) freely.
   To ADD a venue: copy a line, give it a new id (lowercase, no
   spaces), then use that id in the foods below.
   --------------------------------------------------------------- */
const VENUES = [
  { id: "breakfast", zh: "早餐店",   en: "Breakfast shop",     emoji: "🍳" },
  { id: "conv",      zh: "便利商店", en: "Convenience store",  emoji: "🏪" },
  { id: "noodle",    zh: "麵店小吃", en: "Noodle shop",        emoji: "🍜" },
];


/* ---------------------------------------------------------------
   FOODS — the master food list. Each food has:

   id        short unique code (lowercase English, no spaces).
             Used to refer to this food elsewhere in this file.
   zh / en   display names in Chinese and English.
   emoji     the picture shown for this food.
   role      "main"  = can be chosen as the base of a meal
             "addon" = a side/addition suggested as a pairing
             "both"  = can be either
   venues    where it is sold — list one or more VENUE ids.
   nutrition per typical serving:
                protein (g), fiber (g), sodium (mg), calcium (mg)
   wholeGrain  true / false — counts as 全穀雜糧類 under Taiwan
               dietary guidelines (includes tubers like 地瓜).
   serving   optional note about the portion the numbers refer to.
   msg       OPTIONAL custom pop-up bubble when this food is added
             in 配什麼好 (zh + en). If you leave msg out, the app
             auto-generates one from the nutrition numbers.
   tip       OPTIONAL one-line fun fact shown after a 營養大對決
             question that uses this food.
   --------------------------------------------------------------- */
const FOODS = [

  /* ---------- 早餐店 Breakfast shop ---------- */
  { id: "danbing",   zh: "原味蛋餅",   en: "Egg crepe (dan bing)", emoji: "🫓",
    role: "main", venues: ["breakfast"],
    nutrition: { protein: 10, fiber: 1,   sodium: 600,  calcium: 60 },
    wholeGrain: false, serving: "1份" },

  { id: "congzhua",  zh: "蔥抓餅",     en: "Scallion pancake", emoji: "🥞",
    role: "main", venues: ["breakfast"],
    nutrition: { protein: 6,  fiber: 1.5, sodium: 550,  calcium: 20 },
    wholeGrain: false, serving: "1份" },

  { id: "shaobing",  zh: "燒餅",       en: "Sesame flatbread", emoji: "🥖",
    role: "main", venues: ["breakfast"],
    nutrition: { protein: 7,  fiber: 2,   sodium: 400,  calcium: 30 },
    wholeGrain: false, serving: "1個" },

  { id: "wwtoast",   zh: "全麥吐司(2片)", en: "Whole wheat toast (2 slices)", emoji: "🍞",
    role: "main", venues: ["breakfast", "conv"],
    nutrition: { protein: 8,  fiber: 4,   sodium: 300,  calcium: 40 },
    wholeGrain: true,
    tip: { zh: "「全麥」要看標示，全穀成分需≧51%喔！", en: "Check the label — 'whole wheat' should be ≥51% whole grain!" } },

  { id: "zwfantuan", zh: "紫米飯糰",   en: "Purple rice roll (fantuan)", emoji: "🍙",
    role: "main", venues: ["breakfast"],
    nutrition: { protein: 8,  fiber: 4,   sodium: 500,  calcium: 30 },
    wholeGrain: true },

  { id: "luobogao",  zh: "蘿蔔糕",     en: "Turnip cake", emoji: "◻️",
    role: "main", venues: ["breakfast"],
    nutrition: { protein: 4,  fiber: 1.5, sodium: 500,  calcium: 40 },
    wholeGrain: false, serving: "2片" },

  { id: "egg",       zh: "加蛋",       en: "Add an egg", emoji: "🍳",
    role: "addon", venues: ["breakfast", "noodle"],
    nutrition: { protein: 6,  fiber: 0,   sodium: 70,   calcium: 25 },
    wholeGrain: false },

  { id: "cheese",    zh: "加起司",     en: "Add cheese", emoji: "🧀",
    role: "addon", venues: ["breakfast"],
    nutrition: { protein: 4,  fiber: 0,   sodium: 250,  calcium: 150 },
    wholeGrain: false, serving: "1片" },

  { id: "tuna",      zh: "加鮪魚",     en: "Add tuna", emoji: "🐟",
    role: "addon", venues: ["breakfast"],
    nutrition: { protein: 12, fiber: 0,   sodium: 250,  calcium: 10 },
    wholeGrain: false },

  { id: "soymilk",   zh: "無糖豆漿",   en: "Unsweetened soy milk", emoji: "🥛",
    role: "addon", venues: ["breakfast", "conv"],
    nutrition: { protein: 14, fiber: 2,   sodium: 10,   calcium: 60 },
    wholeGrain: false, serving: "400ml" },

  { id: "ricemilk",  zh: "米漿",       en: "Rice milk", emoji: "🥤",
    role: "addon", venues: ["breakfast"],
    nutrition: { protein: 3,  fiber: 1,   sodium: 50,   calcium: 20 },
    wholeGrain: false, serving: "400ml" },

  /* ---------- 便利商店 Convenience store ---------- */
  { id: "onigiri",   zh: "鮪魚御飯糰", en: "Tuna onigiri", emoji: "🍙",
    role: "main", venues: ["conv"],
    nutrition: { protein: 6,  fiber: 1,   sodium: 400,  calcium: 20 },
    wholeGrain: false },

  { id: "instnoodle",zh: "泡麵",       en: "Instant noodles", emoji: "🍜",
    role: "main", venues: ["conv"],
    nutrition: { protein: 9,  fiber: 2,   sodium: 1600, calcium: 20 },
    wholeGrain: false, serving: "1碗(含湯)",
    tip: { zh: "泡麵的鈉大多在湯裡，少喝湯差很多！", en: "Most of the sodium is in the soup — leaving it makes a big difference!" } },

  { id: "sweetpotato", zh: "烤地瓜",   en: "Baked sweet potato", emoji: "🍠",
    role: "both", venues: ["conv"],
    nutrition: { protein: 2,  fiber: 3.5, sodium: 10,   calcium: 40 },
    wholeGrain: true, serving: "1條(中)",
    tip: { zh: "地瓜屬於「全穀雜糧類」，是很好的主食選擇！", en: "Sweet potato counts as a whole-grain-group staple in Taiwan's guidelines!" } },

  { id: "teaegg",    zh: "茶葉蛋",     en: "Tea egg", emoji: "🥚",
    role: "addon", venues: ["conv"],
    nutrition: { protein: 7,  fiber: 0,   sodium: 300,  calcium: 25 },
    wholeGrain: false },

  { id: "yogurt",    zh: "無糖優格",   en: "Plain yogurt", emoji: "🍶",
    role: "addon", venues: ["conv"],
    nutrition: { protein: 6,  fiber: 0,   sodium: 70,   calcium: 180 },
    wholeGrain: false },

  { id: "banana",    zh: "香蕉",       en: "Banana", emoji: "🍌",
    role: "addon", venues: ["conv"],
    nutrition: { protein: 1.5, fiber: 2.5, sodium: 0,   calcium: 10 },
    wholeGrain: false },

  { id: "salad",     zh: "生菜沙拉",   en: "Garden salad", emoji: "🥗",
    role: "addon", venues: ["conv"],
    nutrition: { protein: 2,  fiber: 2.5, sodium: 150,  calcium: 30 },
    wholeGrain: false, serving: "不含醬" },

  { id: "oatdrink",  zh: "燕麥飲",     en: "Oat drink", emoji: "🌾",
    role: "addon", venues: ["conv"],
    nutrition: { protein: 3,  fiber: 3,   sodium: 40,   calcium: 20 },
    wholeGrain: true, serving: "290ml" },

  { id: "daikon",    zh: "關東煮白蘿蔔", en: "Oden daikon", emoji: "🍢",
    role: "addon", venues: ["conv"],
    nutrition: { protein: 1,  fiber: 1.5, sodium: 350,  calcium: 25 },
    wholeGrain: false },

  { id: "corn",      zh: "香甜玉米",   en: "Sweet corn", emoji: "🌽",
    role: "addon", venues: ["conv"],
    nutrition: { protein: 4,  fiber: 4,   sodium: 5,    calcium: 5 },
    wholeGrain: true, serving: "1根" },

  /* ---------- 麵店小吃 Noodle shop ---------- */
  { id: "dumplings", zh: "水餃(10顆)", en: "Dumplings (10)", emoji: "🥟",
    role: "main", venues: ["noodle"],
    nutrition: { protein: 18, fiber: 2,   sodium: 800,  calcium: 40 },
    wholeGrain: false },

  { id: "drynoodle", zh: "乾麵",       en: "Dry noodles", emoji: "🍝",
    role: "main", venues: ["noodle"],
    nutrition: { protein: 10, fiber: 2,   sodium: 900,  calcium: 20 },
    wholeGrain: false },

  { id: "beefnoodle", zh: "牛肉麵",    en: "Beef noodle soup", emoji: "🍲",
    role: "main", venues: ["noodle"],
    nutrition: { protein: 25, fiber: 2,   sodium: 2000, calcium: 50 },
    wholeGrain: false, serving: "1碗(含湯)",
    tip: { zh: "一碗牛肉麵的湯就可能超過一天建議的鈉量一半！", en: "The broth alone can hold half a day's recommended sodium!" } },

  { id: "brownrice", zh: "糙米飯",     en: "Brown rice", emoji: "🍚",
    role: "both", venues: ["noodle"],
    nutrition: { protein: 4,  fiber: 3,   sodium: 5,    calcium: 10 },
    wholeGrain: true, serving: "1碗" },

  { id: "greens",    zh: "燙青菜",     en: "Blanched greens", emoji: "🥬",
    role: "addon", venues: ["noodle"],
    nutrition: { protein: 2,  fiber: 3,   sodium: 250,  calcium: 60 },
    wholeGrain: false },

  { id: "braisedegg", zh: "滷蛋",      en: "Braised egg", emoji: "🥚",
    role: "addon", venues: ["noodle"],
    nutrition: { protein: 7,  fiber: 0,   sodium: 250,  calcium: 25 },
    wholeGrain: false },

  { id: "dougan",    zh: "豆干",       en: "Dried tofu", emoji: "🟫",
    role: "addon", venues: ["noodle"],
    nutrition: { protein: 10, fiber: 1,   sodium: 300,  calcium: 150 },
    wholeGrain: false },

  { id: "seaweed",   zh: "海帶",       en: "Seaweed", emoji: "🪸",
    role: "addon", venues: ["noodle"],
    nutrition: { protein: 2,  fiber: 2,   sodium: 350,  calcium: 80 },
    wholeGrain: false },

  { id: "tofu",      zh: "嫩豆腐",     en: "Soft tofu", emoji: "⬜",
    role: "addon", venues: ["noodle", "conv"],
    nutrition: { protein: 8,  fiber: 0.5, sodium: 30,   calcium: 120 },
    wholeGrain: false },

  { id: "meatballsoup", zh: "貢丸湯",  en: "Meatball soup", emoji: "🍥",
    role: "addon", venues: ["noodle"],
    nutrition: { protein: 8,  fiber: 0,   sodium: 700,  calcium: 20 },
    wholeGrain: false },
];


/* ---------------------------------------------------------------
   PRESET MEALS — the "pick a meal" shortcuts in 配什麼好.
   items = list of FOOD ids (must match the ids above exactly).
   To add a preset: copy a block and change the ids/names.
   --------------------------------------------------------------- */
const MEALS = [
  { id: "m1", zh: "經典早餐：蔥抓餅",   en: "Classic breakfast: scallion pancake", items: ["congzhua"] },
  { id: "m2", zh: "趕課早餐：御飯糰",   en: "Grab-and-go: onigiri",                items: ["onigiri"] },
  { id: "m3", zh: "宵夜：泡麵",         en: "Late-night: instant noodles",         items: ["instnoodle"] },
  { id: "m4", zh: "麵店晚餐：乾麵",     en: "Noodle-shop dinner: dry noodles",     items: ["drynoodle"] },
  { id: "m5", zh: "水餃(10顆)",         en: "Dumplings (10)",                      items: ["dumplings"] },
  { id: "m6", zh: "牛肉麵",             en: "Beef noodle soup",                    items: ["beefnoodle"] },
];


/* ---------------------------------------------------------------
   PAIRINGS — which add-ons to SUGGEST for each main dish.
   Left side  = the main dish id.
   Right side = list of addon ids, in the order you want them shown.
   Only suggest things sold at the SAME kind of place!
   Foods not listed here fall back to: any addon that shares a venue.
   --------------------------------------------------------------- */
const PAIRINGS = {
  congzhua:    ["egg", "tuna", "cheese", "soymilk"],
  danbing:     ["tuna", "cheese", "soymilk", "ricemilk"],
  shaobing:    ["egg", "soymilk"],
  luobogao:    ["egg", "soymilk"],
  wwtoast:     ["egg", "cheese", "tuna", "soymilk"],
  zwfantuan:   ["soymilk", "ricemilk"],
  onigiri:     ["teaegg", "soymilk", "salad", "banana"],
  instnoodle:  ["teaegg", "salad", "soymilk", "corn"],
  sweetpotato: ["teaegg", "yogurt", "soymilk"],
  dumplings:   ["greens", "seaweed", "dougan"],
  drynoodle:   ["greens", "braisedegg", "dougan", "seaweed"],
  beefnoodle:  ["greens", "seaweed", "tofu"],
  brownrice:   ["greens", "braisedegg", "dougan"],
};


/* ---------------------------------------------------------------
   AUTO-BUBBLE RULES — thresholds for the pop-up stickers in
   配什麼好 when a food has no custom msg. Change the numbers if
   your final data uses different serving sizes.
   --------------------------------------------------------------- */
const BUBBLE_RULES = {
  protein: 5,     // ≥ this many g  → "+X g 蛋白質！"
  fiber:   2,     // ≥ this many g  → "+X g 膳食纖維！"
  calcium: 100,   // ≥ this many mg → "+X mg 鈣質！"
  sodiumWatch: 500, // ≥ this many mg → gentle heads-up (not a "bad food" label)
};


/* ---------------------------------------------------------------
   營養大對決 GAME SETTINGS
   --------------------------------------------------------------- */
const GAME_SETTINGS = {
  questionsPerGame: 8,   // total questions per round
  wholeGrainQuestions: 2, // how many of those are "spot the whole grain"
  /* Nutrients used in comparison questions. NEVER includes calories
     by design. Remove a line to stop asking about that nutrient. */
  nutrients: [
    { key: "protein", zh: "蛋白質", en: "protein", unit: "g",  higherWins: true  },
    { key: "fiber",   zh: "膳食纖維", en: "fiber",  unit: "g",  higherWins: true  },
    { key: "sodium",  zh: "鈉",     en: "sodium",  unit: "mg", higherWins: false }, // LESS sodium wins
    { key: "calcium", zh: "鈣質",   en: "calcium", unit: "mg", higherWins: true  },
  ],
  /* Two foods are only compared when their values differ enough
     to have a clear answer (avoids "trick" questions). */
  minRatio: 1.4,
};


/* ---------------------------------------------------------------
   SHARING SETTINGS — used on the 營養大對決 result card and the
   pet photo card.
   --------------------------------------------------------------- */
const SHARE = {
  hashtag: "#外食也能吃得好",   /* ✏️ EDIT HERE: your campaign hashtag */
  appName: { zh: "校園小夥伴", en: "Campus Buddy" },
};


/* ---------------------------------------------------------------
   HOLIDAY FRAMES — seasonal photo frames for the pet share card.
   They turn on and off BY DATE automatically; no upkeep needed
   except one task each year (see ⚠️ notes).

   Each holiday has:
     zh / en   name shown in the app
     deco      emoji used to decorate the frame (3-4 emoji)
     color     frame color (hex code)
     msg       message printed on the shared photo (zh + en)
     ranges    when the frame is active. TWO formats:
               ["MM-DD","MM-DD"]         → repeats EVERY year (fixed dates)
               ["YYYY-MM-DD","YYYY-MM-DD"] → one specific year only
   ⚠️ Lunar-calendar holidays move every year, so they use the
   specific-year format — once a year, add the next year's dates
   as another range on the same line, e.g.:
     ranges: [["2027-02-04","2027-02-14"], ["2028-01-24","2028-02-02"]]
   If two holidays overlap, the one HIGHER in this list wins.
   --------------------------------------------------------------- */
const HOLIDAYS = [
  { id: "midautumn", zh: "中秋節", en: "Mid-Autumn Festival", deco: "🥮🌕🐇✨", color: "#F3B72B",
    msg: { zh: "中秋快樂！配顆柚子、試試全穀月餅 🥮", en: "Happy Mid-Autumn! Pair a pomelo or try a whole-grain mooncake 🥮" },
    ranges: [["2026-09-21", "2026-09-27"]] },   /* ⚠️ lunar — add next year's dates yearly */

  { id: "double10", zh: "雙十節", en: "National Day", deco: "🎆🎇✨", color: "#ED7848",
    msg: { zh: "雙十連假出遊，便利商店也能配出好營養！", en: "Holiday weekend! Even a convenience store can make a balanced meal 🏪" },
    ranges: [["10-05", "10-11"]] },             /* fixed — repeats every year automatically */

  { id: "halloween", zh: "萬聖節", en: "Halloween", deco: "🎃👻🍬", color: "#ED7848",
    msg: { zh: "不給糖就搗蛋！南瓜也是全穀雜糧類喔 🎃", en: "Trick or treat! Pumpkin counts in the whole-grain group 🎃" },
    ranges: [["10-25", "10-31"]] },             /* fixed — repeats every year */

  { id: "christmas", zh: "聖誕節", en: "Christmas", deco: "🎄🎅❄️", color: "#247A5A",
    msg: { zh: "聖誕快樂！來片燕麥薑餅最應景 🎄", en: "Merry Christmas! Oat gingerbread is right on theme 🎄" },
    ranges: [["12-18", "12-26"]] },             /* fixed — repeats every year */

  { id: "lny", zh: "春節", en: "Lunar New Year", deco: "🧧🐐🍊", color: "#ED7848",
    msg: { zh: "新年快樂！年菜加點糙米雜糧，五穀豐收好兆頭 🧧", en: "Happy Lunar New Year! Whole grains in the feast for good fortune 🧧" },
    ranges: [["2027-02-04", "2027-02-14"]] },   /* ⚠️ lunar — verify & add dates yearly */

  { id: "dragonboat", zh: "端午節", en: "Dragon Boat Festival", deco: "🐉🛶🌾", color: "#247A5A",
    msg: { zh: "端午安康！今年試試紫米粽或五穀粽 🛶", en: "Happy Dragon Boat Festival! Try a purple-rice or multigrain zongzi 🛶" },
    ranges: [["2027-06-06", "2027-06-10"]] },   /* ⚠️ lunar — verify & add dates yearly */

  /* Template for Ramadan / Eid al-Fitr — Islamic-calendar dates shift ~11 days
     earlier each year, so VERIFY the dates first, fill them in, then remove
     the slash-star marks around this block to activate it:
  { id: "eid", zh: "開齋節", en: "Eid al-Fitr", deco: "🌙⭐🕌", color: "#247A5A",
    msg: { zh: "開齋節快樂！Eid Mubarak!", en: "Eid Mubarak! 🌙" },
    ranges: [["2027-03-09", "2027-03-12"]] },
  */
];
