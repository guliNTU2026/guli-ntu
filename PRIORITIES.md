# What still needs doing — in priority order

A running list, most important first. Ticked items are finished.

---

## 🔴 1. The nutrition numbers are still placeholders

**This is the most important thing on the list, by a distance.**

At the top of `foods-data.js`:

> ⚠️ IMPORTANT: All nutrition numbers below are ROUGH PLACEHOLDERS.
> Replace them with your verified values (Taiwan FDA food composition
> database / product labels) before publishing.

That warning is still true for all 31 foods. Every protein, fibre, sodium and
calcium figure is a guess.

Why this outranks everything else: this is a **public-health project from a
university**. The quiz tells students which of two foods has more sodium, and
the pairing app tells them what a meal adds up to. If the numbers are wrong,
the site is confidently teaching incorrect nutrition — which is worse than not
existing. Every other item on this list is cosmetic next to it.

It is also the one job nobody else can do for you: it needs someone who can
read the Taiwan FDA food composition database and judge portion sizes.

---

## 🔴 2. Placeholder names are visible on the live site right now

`faq.html` currently shows, to anyone who visits:

```
執行單位：國立臺灣大學公共衛生學院〔研究室名稱〕
計畫主持人：〔林先和〕教授 · 計畫執行：〔你的名字〕
```

The 〔brackets〕 are on the real page today. Fill in the lab name, confirm the
PI's name is right, and either add your own name or delete that half of the
line. Search `faq.html` for `CREDITS`.

---

## 🔴 3. Six dead links in the FAQ

In `faq.html`, `LINKS` still has `"#"` for:
`hpaMain`, `hpaGrains`, `hpaSodium`, `instagram`, `facebook`, `cookbook`.

A `"#"` link is visible and clickable and goes nowhere. Either paste the real
address or delete that line so the button disappears.

---

## 🟠 4. Upload the artwork

- `sprites/` — the 4 cat sheets
- `items/` — 64 item PNGs
- `images/` — `guli_logo.png`, and the HPA / NTU logos if you have them

Until these arrive the cats are coloured circles and the furniture is dashed
grey squares. Nothing breaks; it just looks unfinished.

Start with the four cat sheets and one bowl — that alone turns the room real.

⚠️ Check `CREDITS.md` first for which files to commit (only the ones the site
actually uses, not the whole artist's pack).

---

## 🟠 5. Wire the cat into the live pages

Everything cat-related currently lives in `cat-preview.html`. No visitor can
reach it — `index.html`, `pair-it.html`, `showdown.html` and `faq.html` still
show the emoji pet.

This is deliberate: there is no point switching over before the artwork is in.
Once it is, turning the cat on is adding a few script tags. Tell me when you
are ready and it is a small job.

---

## 🟠 6. Test on a phone, in the LINE browser

Not done, and I cannot do it for you. Most of your visitors will arrive by
scanning a QR code and land in LINE's in-app browser, which is the least
forgiving one out there.

Worth checking: the room, the shop scrolling, the feed buttons, the photo share
(LINE handles the share sheet differently), and the funding bar.

---

## 🟡 7. Write the tips

`TIPS` in `foods-data.js` has 10 starters **in my wording, not yours**. They
should be your campaign's and your event's messages.

Also: only **4 of 31 foods** have a `tip:` line. The collection book has 14
entries; filling in the rest would roughly triple it, and the book is one of
the main reasons someone comes back tomorrow.

No coding involved — it is writing, which is the thing you actually have that
I do not.

---

## 🟡 8. Social media addresses

`SOCIAL` in `foods-data.js` has four empty entries. An empty one hides itself,
so nothing is broken — they just do not appear. Paste the addresses in and the
buttons show up next to the funding statement.

---

## 🟡 9. The artist's details, and a message to them

`CREDITS.md` still needs the pack name and its itch.io link, and there is a
draft message to Last Tick asking about the public repository. Worth ten
minutes before launch.

---

## 🟢 10. Lunar holiday dates — a yearly job, forever

Three holidays move every year and are hard-coded:

| Holiday | Currently set to |
|---|---|
| 中秋節 | 2026-09-21 → 09-27 |
| 春節 | 2027-02-04 → 02-14 |
| 端午節 | 2027-06-06 → 06-10 |

After those dates pass the holiday silently stops appearing. Put a recurring
calendar reminder somewhere — this is the one piece of upkeep that will
outlive everyone currently on the project, so it belongs in a handover note,
not in someone's head.

---

## ✅ Done

- feeding loop with food tiers, water, and appetite scaling by cat count
- multiple cats, per-cat accessories, petting and playing
- the room, the shop, wallpaper and flooring
- collectable tips book, shared across both games
- seasonal freebies and photo-card styles
- funding statement on every page **and on the shared card**
- project logo on the landing page, the footer and the card
- foods with no proper emoji hidden; seaweed and the breakfast icons fixed
