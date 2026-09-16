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
| 2 | The cat animates in place; four colours to adopt | ⏳ waiting on you |
| 3 | The room, the shop, the furniture | ⏳ |
| 4 | "The cat moved while you were away" | ⏳ |
| 5 | Seasonal hats and hearts | ⏳ |

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
- **`items/`** — the 55 item PNGs (beds, bowls, toys, collars, hats…)

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

### 3. Answer three questions for me

They are at the bottom of this file. I cannot build Steps 3 and 5 correctly
without them.

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

## What I need you to decide (3 questions)

**Q1 — The bowl. Your instructions contradict each other.**

Your handoff says both of these:

> *(Step 3b)* "each bowl has a `levels:` array … Feeding raises the level …
> time between visits lowers it by 1 level per `decayHours`"

> *(Hard constraints)* "**No feeding loop.** The bowl is static décor … it does
> not drain or need refilling."

Those cannot both be built. Your `cat-items.js` contains a full `BOWL_RULES`
block with `feedStep`, `feedCost` and `decayHours`, so my assumption is that
the "static décor" line is left over from an older draft and **the levelled
bowl is what you want**. Either is genuinely fine and neither breaks the
no-guilt rule. Just confirm which.

**Q2 — Valentine's Day does not exist yet.**

`cat-items.js` has three heart accessories set to `season:"valentine"`, but the
`HOLIDAYS` list in `foods-data.js` contains only: `midautumn`, `double10`,
`halloween`, `christmas`, `lny`, `dragonboat`. There is **no `valentine`**, so
those hearts would never appear.

The fix is four lines added to `HOLIDAYS` — which also gives you a Valentine's
photo frame for free, since the seasonal frames read the same list. I need a
Chinese and English greeting line in your project's voice. Something like
*"情人節快樂！和喜歡的人一起吃頓均衡的飯 💕"* — but your wording will be better
than mine.

**Q3 — The licence.**

The licence section of the inventory template was left blank. Please paste the
sprite pack's usage terms — even just the one sentence about commercial use and
credit. This is a public-health project on a public website, so it is worth
being certain before the artwork goes live. If the pack requires a credit line,
tell me and I will add it to the FAQ page.

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
