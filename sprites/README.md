# `sprites/` — the cat picture files go here

Drop the **four cat sprite sheets** in this folder, keeping the artist's
original filenames exactly as they are, spaces and all:

```
cat 1 16x16 animation.png     ← black cat
cat 2 16x16 animation.png     ← gray cat
cat 4 16x16 animation.png     ← brown cat
cat 10 16x16 animation.png    ← calico cat
```

**Do not rename or crop them.** The website slides a small window over
the whole picture rather than cutting it up, so the file must stay
exactly as the artist made it — same size, same order.

If you *do* want different filenames, change them here **and** in the
`file:` lines at the top of `cat-items.js`. The two must match, including
capital letters and the `.png` ending.

> The names say "16x16" but the frames are really 32x32. That is just how
> the artist named the pack. Nothing is wrong.

## Adding a fifth colour later

The pack has 13 colours and they all share the identical layout. To add
one: drop the PNG in here, then add one line to `CAT_COLORS` in
`cat-items.js`. That is the entire job — you do **not** need to touch
`cat-frames.js`, because every colour uses the same row numbers.
