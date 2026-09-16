# How to test everything

Written for someone who does not code. Nothing here can break the live site.

---

## First: why the website still shows the old version

**Nothing I have built is on your live site yet, on purpose.**

GitHub keeps separate copies of a project, called *branches*. Your live site is
published from the branch called **`main`**. All of my work is sitting on a
different branch:

```
claude/pet-shared-to-cat-migration-rwtgzk
```

There are **7 commits** waiting there. GitHub Pages does not know about them,
because it only publishes `main`. So the live site is showing exactly what it
showed before — which is the correct and safe behaviour. Nothing goes live until
you decide it should.

To see where your site publishes from: **your repo → Settings → Pages → "Build
and deployment" → Source**. It will name a branch, almost certainly `main`.

### ⚠️ And one expectation to set now

**Putting this live will NOT show cats yet.** The cat files exist and work, but
they are not connected to your real pages — `index.html`, `pair-it.html`,
`showdown.html` and `faq.html` still load only `foods-data.js` and
`pet-shared.js`. That is Step 2/3, which needs the artwork first.

So if you publish today, visitors would see:

- ✅ the funding statement bar on every page
- ✅ the four square-emoji foods gone
- ✅ social links (once you give me the addresses)
- ⬜ the **emoji** Campus Buddy, exactly as now — no pixel cat yet

---

## Can I test before uploading the PNGs? **Yes — all of it.**

| What | Needs PNGs? | How it behaves without them |
|---|---|---|
| Funding bar | no | works fully |
| Hidden foods | no | works fully |
| Social links | no | needs your URLs, not images |
| `cat-bowl-demo.html` — feeding, water, coins, buying cats, the room | **no** | bowls draw as bars, cats as coloured circles |
| `sprite-lab.html` — checking the animations | no upload | you pick the PNG off your own computer |
| Seeing the actual pixel cat | **yes** | falls back to circles until the sheets are in `sprites/` |

**Short version: you can test every rule and behaviour today. Only the pictures
are missing.**

---

## The easiest way to test: download and open (nothing goes live)

This is the safest option. You are not uploading anything and not changing the
website.

1. Go to
   **https://github.com/guliNTU2026/guli-ntu/tree/claude/pet-shared-to-cat-migration-rwtgzk**
2. Click the green **Code** button → **Download ZIP**.
3. Unzip it. You get a folder with all the files in it.
4. **Double-click `index.html`.** It opens in your browser and works completely
   — it is a plain website with no build step, exactly as designed.

Now walk through these:

### A. The funding statement — on every page
Scroll to the bottom of `index.html`. You should see a bordered white box with
**經費由國民健康署運用菸品健康福利捐支應** in it, at full strength — not faded
grey small print. Check it is also on `pair-it.html`, `showdown.html` and
`faq.html`. Press the **EN** button: the Chinese stays (it is the official
wording) and an English line appears underneath.

### B. The removed foods
Open `pair-it.html`. The four foods that used to show as coloured squares
(蘿蔔糕, 豆干, 嫩豆腐, 海帶) should appear **nowhere** — not in the food chips,
not in "browse all", not in the suggestions. Play a round of
`showdown.html` too; they will never come up as quiz questions.

### C. The cat's rules — `cat-bowl-demo.html`
Double-click it. This is a test page only; visitors never see it.

1. **Reset the cat only** → **+50 test coins** → **Place green bowl**
2. Press **Feed** a few times. Coins go down, the bowl fills.
3. Feed until full — it must refuse and **not** take your coins.
4. Press **+12 hours**, then **+72 hours**. The bowl empties and *nothing bad
   happens* — no sad cat, no penalty. That is the point.
5. Press **Place water** and top it up. Water is on a slower, cheaper timer.
6. Click the four cat colours. First free, the rest 40 coins. Watch the room —
   every cat you own appears, each in its own spot.
7. Press **Next visit** a few times: the cats rearrange.
8. Press **Empty the room**: they still all have somewhere sensible to be.

> Bowls appear as **bars with a dashed outline** and cats as **coloured
> circles**. That is the intended stand-in until the PNGs arrive — not a bug.

### D. The animations — `sprite-lab.html`
Double-click it, click the file picker, choose one of your cat PNGs **from your
own computer**. Nothing is uploaded anywhere. You should see the measurements,
a green "✓ Divides evenly", a big pixel cat, and all 53 rows listed. Click a row
and press **Play**.

Since you have already sent me the row numbers, this is now just a spot-check —
try row 20 (eating), row 36 (washing), row 18 (sleeping) and confirm the cat is
doing what the name says.

### E. On your phone, especially the LINE browser
This matters more than anything else on the list, because that is how most
students will arrive. The easiest way is to test it after publishing (below),
since you cannot easily open downloaded files in the LINE browser.

---

## When you are ready to publish

Two ways, both fine:

**Option 1 — I open a pull request.** You get a page listing every change, you
read it, press **Merge**, and the site updates a minute later. Nothing happens
until you press the button. Just ask me.

**Option 2 — you merge it yourself.** On GitHub, open the branch, press
**Compare & pull request**, then **Merge pull request**.

### If the site still looks old after merging

Almost always your browser showing a saved copy. Try, in order:

1. Wait 2 minutes — GitHub Pages takes a moment to rebuild.
2. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac).
3. Open the site in a private/incognito window.
4. Check **Settings → Pages** actually says `main`, and look for a green tick.

The LINE in-app browser caches especially aggressively. If it looks stale there,
add `?v=2` to the end of the address to force a fresh copy.

---

## What to upload, and where

Only needed for the pictures to appear. Drag the files into the folder on
GitHub, or add them to your unzipped copy.

| Folder | What goes in | How many |
|---|---|---|
| `sprites/` | the cat sheets, original filenames unchanged | **4** |
| `items/` | bowls, beds, posts, carriers, toys, collars, hats… | **64** |
| `images/` | `hpa-logo.png`, `ntu-logo.png` (optional) | 2 |

Each folder has its own `README.md` listing exactly which filenames are
expected. If a logo is missing it hides itself, so nothing looks broken.

**You do not have to do all 64 at once.** Any item whose PNG is missing simply
falls back to a stand-in. Start with the four cat sheets and one bowl — that is
enough to see the real cat eating from a real bowl.

⚠️ Before uploading, re-read the short section in `CREDITS.md` about which files
to commit — the short version is **only the files the site actually uses**, not
the whole artist's pack.
