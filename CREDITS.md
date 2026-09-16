# Art credits and licence

## The cat sprite pack

**Artist:** Last Tick — on [itch.io](https://itch.io)
**Pack name:** _(still needed — see "What's missing")_
**Licence, as stated by the artist:**

> Use in personal and commercial projects is allowed.
> Redistributing or reselling these materials separately is prohibited.

---

## Can we put the PNGs in a public GitHub repo?

You asked whether the files being publicly downloadable breaks the "redistributing
separately" clause. It is a fair thing to check, and the answer splits into two
different questions that are worth keeping apart.

### Question 1: does *showing* the art on the website break the terms? **No.**

There is no way to display an image on a web page without sending that image to
the visitor's browser. That is what a browser *is*. Every website, every browser
game, every itch.io game that runs in a browser works this way — the art is
always downloadable by anyone who opens the developer tools and saves it.

So if "the file can be downloaded from the site" counted as prohibited
redistribution, then the licence would forbid all use on the web — which would
directly contradict its own first line, *"use in personal and commercial
projects is allowed."* A licence cannot permit a use and forbid the only
mechanism by which that use is possible.

**Using the art on your site is use in a project. That is exactly what the
first line permits.** Nothing about how the cat is built goes beyond that.

### Question 2: is a *public repository* different from a website? **Slightly — and this is the bit worth acting on.**

This is the part of your instinct I think is right. A website *displays* files.
A public git repository *distributes* them: anyone can run one `git clone`
command and receive a tidy, organised folder of the original source PNGs — no
devtools, no effort, nothing removed. That is much closer in spirit to "here are
the materials" than "here is my website."

I want to be straight with you: **I do not think this crosses the line either**,
because the repo exists to build your site, not to hand out art. But it is
closer to the line than it needs to be, and the fix is cheap.

### What I recommend, in order

**1. Commit only the files the site actually uses.** This is the biggest and
cheapest win, and you should do it regardless of anything else.

- ✅ the **4** cat colours the site shows → `sprites/`
- ✅ the item PNGs you actually sell → `items/`
- ❌ **not** the pack's `.zip`
- ❌ **not** the pack's own readme, licence file, or preview/promo images
- ❌ **not** the other **9** cat colours the site never displays

A folder holding the complete pack *looks like a copy of the pack*. A folder
holding exactly what your site draws on screen looks like a website. Same files,
very different character.

**2. Credit the artist.** Not demanded by the wording above, but it costs
nothing, it is good practice for a public-health project from a university, and
it makes your intent obvious to anyone who wonders. See the bottom of this file.

**3. If you want the repository private as well — this is free and easy.**
GitHub Pages will not serve a private repo without a paid plan, but **Cloudflare
Pages** and **Netlify** both deploy from a private GitHub repository on their
free tiers. You would connect the repo once, and they publish the site at a URL
exactly as GitHub Pages does now. Your QR codes would need repointing (or you
move your custom domain across), so it is a small afternoon of work, not a
rebuild. Nothing about the code changes — it is still plain HTML/CSS/JS with no
build step.

This is the option I would pick **if the ambiguity is going to bother you**,
because it removes the clone-the-assets concern entirely at no cost.

**4. The one move that actually settles it: ask Last Tick.**

This is worth more than all of my reasoning above. Post a comment on the pack's
itch.io page or message them directly, something like:

> Hi! I'm using your pack in a non-profit public-health project at a university
> in Taiwan — a small website teaching students about balanced eating. The site
> is open-source on GitHub, which means the sprite PNGs sit in a public
> repository (only the few files the site actually displays — not the pack).
> Is that OK with you, or would you prefer I host the images somewhere that
> isn't publicly cloneable? Happy to credit you either way.

Artists on itch.io are usually quick to reply, and a great many would be pleased
to have their work in a university health project. A one-line "yeah that's
fine" from them is worth more than any amount of careful reading of the terms —
and if they say no, you find out now rather than later.

**I am not a lawyer, and this is my reading rather than legal advice.** Asking
the artist converts a judgement call into a definite answer.

### One thing NOT to do

Do not try to hide the art — merging everything into one scrambled atlas,
rendering only through canvas, and so on. It does not work (anyone determined
can still extract it), and it would wreck the thing that matters most about this
project: that a nutrition intern with no coding background can add a new item by
dropping a PNG in a folder. Obscurity is not a licence strategy, and here it
would cost you the maintainability you are explicitly optimising for.

---

## What's missing — please fill in

- the **exact pack name** on itch.io
- the **link** to its itch.io page
- whether Last Tick replies to the question above (and what they say)

Once I have those I will finish this file and add a credit line to `faq.html`.
I have deliberately **not** edited `faq.html` yet.

Suggested credit wording (edit freely):

> 貓咪像素圖：由 **Last Tick**《PACK NAME》提供，依其授權用於本專案。
> Cat pixel art by **Last Tick** (《PACK NAME》), used under the pack's licence.

---

## Everything else

The code, the food data, the quiz questions and the written content in this
repository are the project's own work.
