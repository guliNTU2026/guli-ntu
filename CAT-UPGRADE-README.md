# The cat upgrade — what is happening, and what you need to do

This document is for **you**, the person maintaining the site. It is written
for someone who is not a programmer. Nobody visiting the website sees it.

---

## The plan in one paragraph

Right now `pet-shared.js` shows a pet made of **emoji** (🐱 🐈). We are
replacing that with a **pixel-art cat living in a small room** that the user
furnishes using the coins they already earn from the quiz and the meal-pairing
game. The coins, the saved data, the daily check-in and the seasonal frames all
stay exactly as they are — we are swapping the *picture* of the pet, not the
economy behind it.

We are doing this in **five steps, stopping after each one so you can test.**
Nothing goes live until you are happy.

| Step | What it does | Status |
|---|---|---|
| 1 | Show one pixel-art frame on screen; set up the editable animation list | ✅ **done — test it now** |
| 1.5 | Feeding loop (food **and** water) + seasonal items | ✅ **done — test it now** |
| 1.6 | Owning several cats at once, and where they stand | ✅ **done — test it now** |
| 2 | The cat animates in place; four colours to adopt | ⏳ needs `cat-frames.js` filled in |
| 3 | The room, the shop, the furniture | ⏳ needs the item PNGs uploaded |
| 4 | "The cat moved while you were away" | ⏳ |
| 5 | Seasonal photo frame for Valentine's | ⏳ (holiday itself is already added) |

---

## How the cat actually works (the one idea to understand)

The artist gave you **one big picture per cat colour**. It is 352 × 1696 pixels
— think of a contact sheet at a photo lab, with **583 tiny photos** printed on
it in a grid of **11 across and 53 down**. Each tiny photo is 32 × 32 pixels.

The website **never cuts that picture up.** Instead it lays a small 32×32
window over it and slides the picture around behind the window:

```
   show row 6, column 0  →  cat with mouth closed
   show row 6, column 1  →  cat with mouth open
   show row 6, column 2  →  cat chewing
   ... fast, in a loop   →  the cat is eating
```

That is genuinely the whole technique. Everything else is bookkeeping.

The bookkeeping — *which row is the eating animation?* — lives in a file called
**`cat-frames.js`**. It is a plain list of addresses, heavily commented, and it
is one of only two files you ever need to edit.

---

## The two files you will edit, forever

| File | What lives in it |
|---|---|
| **`cat-items.js`** | Every buyable thing: cats, beds, bowls, toys, collars, prices, names in Chinese and English. You already have this. |
| **`cat-frames.js`** | Which row of the big picture holds which animation. **New — and it needs filling in.** |

Everything else is machinery you can ignore.

---

## ⚠️ YOUR TO-DO LIST (in order)

### 1. Put the picture files in the folders

Two new folders now exist. Each has its own `README.md` explaining what goes in
it, but in short:

- **`sprites/`** — the four cat sheets, original filenames unchanged
  (`cat 1 16x16 animation.png`, `cat 2 …`, `cat 4 …`, `cat 10 …`)
- **`items/`** — the 64 item PNGs (beds, bowls, posts, carriers, toys, collars, hats…)

You can upload them by dragging them onto the folder in GitHub, or however you
normally add files to the site.

> **Check as you go:** open a few item PNGs. Behind the object you want to see a
> **grey-and-white checkerboard** (= transparent). If you see **solid white**,
> that item will show up as an ugly white box on the room floor. Tell me which
> ones and we will deal with them.

### 2. Fill in `cat-frames.js` using the workbench

Your `sprite-inventory-TEMPLATE.md` came back **blank**, so I do not know which
row is eating, which is sleeping, and so on. Rather than guess — a wrong guess
means the cat scratches when it should sleep — I built you a tool.

**Double-click `sprite-lab.html`.** It opens in your browser and it:

1. lets you pick a cat PNG **off your own computer** (nothing is uploaded, not
   to the website and not to any AI),
2. checks the picture divides evenly by 32 (the check that prevents most bugs),
3. lists all 53 rows and **counts the frames in each one for you**,
4. plays any row so you can *watch* what the cat is doing,
5. prints the finished line, ready to copy and paste into `cat-frames.js`.

Work through these five, which is all Step 2 and Step 3 need:

| Nickname to fill in | What to look for |
|---|---|
| `idle` | the cat just sitting there (probably row 0 already — confirm it) |
| `wash-sit` | sitting and licking itself — **do this one first**, it is the fallback |
| `eat-front` | head down at a bowl |
| `sleep-lay-front-l` | curled up asleep |
| `itch-r` | scratching, facing right |

Roughly ten minutes. Any line you do not fill in stays `row: null`, which
simply means "the cat uses its normal idle pose instead" — nothing breaks, it
is just less lively. You can come back and finish later.

> 🚫 The sheet also contains an **angry hiss** (about rows 41–42) and a **sad
> cat** (about row 43). The workbench shades them orange. We are deliberately
> not using them — see "Why there is no sad cat" below.

### 3. Two small things on the art

- The **exact pack name** and its **itch.io link**, so I can finish `CREDITS.md`
  and add a credit line to `faq.html`.
- Consider sending Last Tick the short message drafted in `CREDITS.md`.
- Decide whether you want a **scratching post** (see the gap noted below).

---

## Why there is no sad cat

Your handoff was firm about this and I want it written down where the next
person will find it, because it is the kind of thing a well-meaning future
helper "improves" by accident.

This app is **addition-based and food-neutral**: no food is labelled good or
bad, and users are encouraged to *add* better choices, never to restrict. The
pet has to mirror that. A cat that looks sad, hisses, or goes hungry because
somebody did not open the app for a week is a **guilt mechanic** — and it would
sit inches away from health messaging that says the exact opposite.

So, permanently:

- no hunger, no sickness, no sadness, no penalty for being away
- an empty bowl costs the user nothing at all
- feeding is a friendly hello, never a chore
- the user can only ever **add** nice things

There is a comment block in `cat-frames.js` saying the same thing, right where
someone would be tempted to add those rows.

---

## Your three decisions — now built

### 1. The feeding loop: ✅ built, coins required, no sadness

Feeding **costs coins**, exactly as you wanted, so the cat gives the coins a
purpose and gives people a reason to come back and play the games. The bowl
empties over time. But an empty bowl costs the user **nothing at all** — no sad
cat, no hungry cat, no lost progress, no nagging.

**The numbers, and why they are what they are.** This is worth reading, because
it is the one place where "slow stakes" is actually decided:

| | |
|---|---|
| Feeding costs | **5 coins**, raises the bowl one level |
| Bowl drops a level every | **12 hours** |
| A full bowl lasts | **48 hours** (2 days) from full to empty |
| Keeping it permanently full costs | **10 coins a day** |
| The daily check-in gives | **10 coins a day** |

That last pair is the whole design. Someone who does nothing but open the app
breaks even and can always afford to feed. Anyone who answers a quiz question
or builds a meal earns *more* than the cat consumes, so there is always
surplus left over for furniture. **The cat is a reason to play; it can never
become a treadmill you fall behind on.**

Want it gentler? Change `decayHours` to `24` in `cat-items.js` and the cost
halves to 5 coins a day. Want it to bite more? Lower it. It is one number and
nothing else needs touching.

### 2. Hearts: ✅ on sale all year, **and** Valentine's added — you get both

- The three hearts are now ordinary shop items, available every day, priced at
  20 coins to match the bows. (They were free before only because they were
  seasonal.)
- `valentine` is now a real holiday in `foods-data.js`, running **10–15
  February every year**, which gives you the Valentine's photo frame you
  wanted — the frames and the seasonal items read the same list, so adding the
  holiday once did both jobs.

**One thing to know:** holidays are checked top to bottom and the first match
wins. In **2027 only**, the Lunar New Year range runs 4–14 February and
overlaps Valentine's. I put 春節 first, because in Taiwan it should win — so in
2027 the heart frame will only appear on 15 February. If you would rather
Valentine's take priority, move that block above the 春節 block in
`foods-data.js`; there is a comment there explaining exactly how.

You may also want to **check the Valentine's greeting I drafted** — I wrote it
food-neutral ("add a side of veg" rather than "don't eat the big meal"), but
your wording will be better than mine:

> 情人節快樂！約會吃大餐，再配杯無糖茶或加份蔬菜就更棒了 💕

### 3. Licence: ✅ recorded — and it is fine

"Personal and commercial use allowed; no redistributing or reselling
separately" **permits exactly what we are doing.** Using the art on your
website is use in a project, not redistribution.

I have written it up in **`CREDITS.md`**, along with one thing worth a moment's
thought (the repo is public, so the PNGs are publicly downloadable — normal and
unavoidable for any website, but there are two cheap habits that remove any
ambiguity) and **three details I still need from you**: the artist's name, the
pack's name, and the download link. I have deliberately **not** touched
`faq.html` yet, because a credit line naming the wrong person would be worse
than no credit at all.

---

## Round two: water, multiple cats, and the licence

### Water: ✅ built, with its own separate timer

Water works exactly like the food bowl but has its own settings in
`WATER_RULES`, so you can tune it independently. It is **cheaper and slower**
than food on purpose:

| | Food | Water |
|---|---|---|
| Costs | 5 🪙 | 3 🪙 |
| Empties a level every | 12 h | 24 h |
| Cost to keep full | 10 🪙/day | 3 🪙/day |

**One honest consequence you should know about.** Last time I made a point of
food costing exactly the 10-coin daily check-in, so a totally passive visitor
could break even. Adding water pushes the combined cost to **13 🪙/day**, which
is 3 above the check-in. A passive visitor now drifts slightly short of keeping
*both* topped up.

I think that is fine — an empty dish has no penalty, so they simply keep one
full instead of two, and a single quiz question covers the difference. But it is
your call, and it is one number: **change `decayHours` under `BOWL_RULES` from
12 to 24** and food drops to 5/day, making the pair 8/day and restoring the
break-even property. Say the word and I'll change it.

> ⚠️ **Your water art only has one picture** (`water_bottle.png`), so water is
> currently just *there* or *not there* (`maxLevel: 1`). If you ever crop a set
> of empty→full water pictures, add them as a `levels:` list exactly like the
> bowls and bump `maxLevel` — the code already handles both shapes, no changes
> needed.

### Multiple cats: ✅ built — and no, it isn't hard at all

To answer your actual question directly: **tracking how many cats someone owns
is easy.** The save already holds a list of owned colours, so counting them is
just counting that list. Each colour keeps its own progress, and switching
between ones you own is free.

I went one better than switching, because I think it is what you actually
wanted: **every cat you own is in the room at the same time**, each in its own
spot. Four cats, four different places, four different poses. Nobody overlaps.
If there are ever more cats than spots, the extras line up neatly along the
floor.

It also gave us Step 4 almost for free: the cats **rearrange between visits**,
so the room looks different each time it is opened — "the cat moved while you
were away", with no walking animation needed.

First cat free, extras cost 40 🪙 (`EXTRA_CAT_PRICE`), switching always free.

### Licence: my read is that we're fine — but there's one cheap thing to do

Short version, full reasoning in **`CREDITS.md`**:

- **Showing the art on the site is fine.** There is no way to display an image
  without sending it to the browser. If that counted as redistribution, the
  licence would forbid all web use — contradicting its own "commercial use is
  allowed" line.
- **The public *repo* is the greyer bit**, and your instinct was reasonable. A
  website *displays* files; a public repo *distributes* them — one `git clone`
  hands someone a tidy folder of source PNGs. I don't think it crosses the line,
  but it's closer than it needs to be.
- **Do this regardless:** commit only the 4 cat colours and the items you
  actually sell. Not the pack `.zip`, not its readme, not the other 9 colours. A
  folder holding the whole pack *looks like* a copy of the pack.
- **If you want the repo private too, it's free:** Cloudflare Pages and Netlify
  both deploy from a private GitHub repo on their free tiers. GitHub Pages
  needs a paid plan for that; those two don't.
- **The move that actually settles it: ask Last Tick.** There's a draft message
  in `CREDITS.md` you can paste. A one-line "sure, that's fine" is worth more
  than any amount of careful reading, and plenty of itch.io artists would be
  glad to be in a university public-health project.

I'm not a lawyer and that's a reading, not legal advice — which is exactly why
asking is worth ten minutes.

### ✅ Posts and carriers: added, and decorative only

All 7 posts and both carriers are in the shop. Prices are placeholders:
posts 25–35 🪙 with the **tree house at 60**, carriers 35 🪙 each.

You were right about the cat not sitting on them, so **posts, carriers, toys
and plants are now pure decoration** — drawn in the room, never stood on. The
reasoning is written into `cat-items.js` so nobody undoes it later: a carrier is
small enough that a cat would hide it completely, and a toy even more so. You'd
be paying coins for something and then not being able to see it, which is the
opposite of what a decorating game should do.

I applied the same logic to **toys**, which you didn't mention — a cat standing
on a mouse toy would cover it entirely. Same problem, so same answer. Say the
word if you'd rather they stayed interactive.

Your note about some post artwork maybe working with a cat on top is recorded in
`cat-items.js` with the exact two-line change that switches it back on, and the
`itch-r` scratching pose is still in `cat-frames.js` waiting for it. Worth a try
once the real art is in — it's easy to undo.

**Cats now have 4 always-available spots**, deliberately matching the 4 cat
colours. That means even someone who owns every cat and has bought no furniture
at all still gets a proper spot for each one — the "line them up on the floor"
fallback never has to trigger. (A test catches this: if you ever add a 5th
colour, it'll tell you to add a 5th spot.)

I verified across 12 consecutive visits, in a bare room, a decoration-only room,
and a fully furnished one, that no cat ever overlaps another and no cat ever
lands on top of a decoration.

**Filenames:** I had to guess them (`sbrown_post.png`, `treehouse_post.png`,
`pink_carrier.png`…). Full list in `items/README.md` — rename your files to
match, or send me the real names.

---

## Testing all of it right now

Open **`cat-bowl-demo.html`**. It is a maintainer-only test bench that uses the
real rules and the real save file, so what you see is what visitors will get.

**For the cats:** press the colour tiles. The first is free, the rest cost 40.
Watch the room preview — every cat you own appears, each in its own spot. Press
**Next visit** a few times and watch them rearrange. Then press **Empty the
room** and confirm they all still have somewhere sensible to stand.

**For food and water:**

Try this, in order:

1. **Reset the cat only** → then **+50 test coins** → **Place green bowl**
2. Press **Feed** a few times. Watch the coins go down and the bowl fill up.
3. Feed until full — the button should refuse and say "Bowl is full". **It must
   not take your coins for nothing.**
4. Now the interesting part: press **+12 hours**. The bowl drops one level.
   Press **+72 hours**. It empties. Notice that nothing bad happens — no sad
   message, no penalty. That is the point.
5. Keep feeding until the coins run out. The button should say "Need 5 🪙"
   rather than letting you go negative.

> The bowl will show as a **stack of bars with a dashed outline** until you
> upload the real bowl PNGs to `items/`. That is the intended fallback, not a
> bug — it means you can test the whole loop before any art arrives.

**The "Reset the cat only" button is worth pressing deliberately.** It clears
the cat but leaves your coins, your daily check-in and the old emoji pet alone
— which is the proof that this upgrade will not wipe the saves of visitors who
already have a buddy.

---

## Testing Step 1 right now

1. Double-click **`sprite-lab.html`**.
2. Click the file picker and choose `cat 1 16x16 animation.png`.
3. You should see: the measurements, a green **"✓ Divides evenly"**, a big
   pixel cat, and a scrolling list of all 53 rows.
4. Click a few rows and press **▶ Play**. The cat should move.

If the cat is **blurry**, tell me — that is a browser setting I can fix.
If the picture does not load at all, tell me the exact filename you picked.

**Also please check it on your phone**, especially inside the **LINE in-app
browser**, since that is where most of your visitors will be. The real site has
to work there; the workbench is less critical, but it is a useful early signal.

Nothing in Step 1 touches the live website. `pet-shared.js` is completely
unchanged and the emoji pet is still running exactly as before.
