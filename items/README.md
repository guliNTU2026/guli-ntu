# `items/` — the furniture, food and accessory pictures go here

Every item in `cat-items.js` names a PNG file, and that file must sit in
this folder with **exactly** the same name (capital letters matter).

## Three shapes of item

| Shape | What it looks like in `cat-items.js` | Files needed |
|---|---|---|
| Ordinary item (bed, toy, collar, plant) | `file:"red_bed.png"` | 1 |
| Bowl with fill levels | `levels:["green_bowl_0.png", ... ]` | one per level, empty → full |
| Animated accessory (bow, heart) | `frames:["red_bow_0.png","red_bow_1.png"]` | one per frame, in order |

## The one rule that matters: transparent backgrounds

Open a PNG. Behind the object you should see a **grey-and-white checkerboard**,
which means "transparent — let the room show through".

If you see **solid white** instead, that item will appear on the cream-coloured
room floor as an obvious white rectangle. It looks broken. Fix it by deleting
the white background in any image editor and re-saving as PNG, or pick a
different item.

## The filenames I have assumed

`cat-items.js` names every file it expects. For the newest items I had to
**guess** the filenames, following the naming style already used by the rest
(`tan_bed.png`, `dgreen_bed.png`, and so on). Either rename your files to match
this list, or tell me your real names and I will change `cat-items.js` instead —
whichever is less work for you.

**Scratching posts (7):**

| Your description | Expected filename |
|---|---|
| small brown | `sbrown_post.png` |
| big brown | `bbrown_post.png` |
| green | `green_post.png` |
| tan | `tan_post.png` |
| pink | `pink_post.png` |
| purple | `purple_post.png` |
| tree house | `treehouse_post.png` |

**Carriers (2):** `pink_carrier.png`, `green_carrier.png`

Prices are placeholders: posts are 25–35 coins, with the tree house at 60 as
the showpiece, and carriers at 35. All easy to change in `cat-items.js`.

## Adding a new item later

1. Save the picture here, e.g. `orange_bed.png`.
2. Open `cat-items.js`, copy an existing block, paste it, change the
   `id`, the names, the price and the `file`.
3. Reload the page. That is all — no other file needs touching.

If the item does not appear, it is almost always a filename typo. Check
capital letters and the `.png` ending.
