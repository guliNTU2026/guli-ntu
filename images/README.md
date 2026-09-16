# `images/` — logos

| File | What it is | If missing |
|---|---|---|
| `guli_logo.png` | your project logo | every place it would appear hides it |
| `hpa-logo.png` | 衛生福利部國民健康署 logo | hidden |
| `ntu-logo.png` | 國立臺灣大學 logo | hidden |

Nothing breaks when a logo is absent — each one hides itself — so you can
add them one at a time.

## Where `guli_logo.png` shows up

Once the file is here it appears automatically in three places:

1. the top of the landing page
2. the footer bar on **every** page, beside the HPA logo
3. the shared photo card of the cat's room

The filename is set once, in `BRANDING` at the top of `foods-data.js`. Change it
there if your file is called something else.

## What makes a good logo file

- **PNG with a transparent background.** Open it: you should see a grey-and-white
  checkerboard behind the logo, not solid white. A white box will be obvious on
  the cream background and on the dark photo-card styles.
- **Roughly 400–600px wide.** It is always shown small, so very fine detail and
  small text will disappear.
- **Readable at about 40px tall**, which is the size in the footer bar. If the
  logo has a tagline in small type, consider a second file without it.

> The photo card can be shared to social media, where it may be seen on a dark
> background. A logo that only works on white is worth checking there.
