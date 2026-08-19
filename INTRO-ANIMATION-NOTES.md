# Opening animation — implementation notes

Recreated from frame-by-frame analysis of `Presentation1.mp4` (1920×1080,
5.77s / 175 frames). Drop these files into your existing SlideCraft project,
overwriting `index.html` and the matching files in `css/` and `js/`. Nothing
else in your project needs to change — all your existing sections, data,
and behavior are untouched.

## New / changed files
- `css/intro.css` — **new**. Pinned hero stage, icon layer, intro title.
- `js/intro-animation.js` — **new**. GSAP + ScrollTrigger timeline.
- `index.html` — hero section replaced with the scroll-pinned intro
  sequence; navbar given a `navbar-intro-hidden` starting class; GSAP
  loaded via CDN in `<head>`; two fonts added (Caveat, Yellowtail) for
  the intro-only title.
- Every other file is byte-identical to what you uploaded.

## What the video actually does (so you can sanity-check my read)
- **0.0–0.9s** — title established, small ambient shapes float (not the
  5 app icons — those appear later).
- **0.9–1.6s** — the 5 tool icons fade/scale/rotate in from a clustered
  point near center and spread to their floating positions, each on a
  slightly different path with a small overshoot before settling.
- **1.6–2.5s** — icons hold, static.
- **2.5–2.9s** — a *fast scene cut* (not a slow crossfade): icons and
  the intro title vanish, the navbar drops in, and the final navy/orange
  hero title + description + CTAs + stats all resolve within ~0.3s.
- **After ~4.4s** — just the background B-roll (a rotating paper stack)
  — this is the part you said to ignore/replace, so I didn't recreate it.

## Choices I made that go beyond a literal 1:1 copy
1. **Compressed the 1.6–2.5s hold.** On a fixed-length video a static
   beat like that reads fine; under user-controlled scroll it feels
   dead (nothing happens no matter how much you scroll). I shortened it
   in `T.SETTLE_HOLD_END` — everything else preserves the reference's
   relative ordering.
2. **Title font-swap is a crossfade, not an animated font.** `font-family`
   can't be tweened, and the reference itself does a hard cut here, not
   a morph — so I built it as two layers (the handwritten/script intro
   title, and your site's real Cormorant Garamond hero title) that
   crossfade into each other right as the navbar enters.
3. **Icons are hand-built SVG/CSS glyphs, not official logo files** —
   recognizable (colors, shapes, wordmarks) without redistributing
   trademarked brand assets. Swap `#iconFigma`/`#iconPpt`/etc. in
   `index.html` for real SVG logo files any time if you have licensed
   ones.
4. **Background is a placeholder gradient** (`.intro-bg-placeholder` in
   `intro.css`), per your instruction to ignore the real background for
   now. Your existing `js/background-frames.js` frame-sequence system
   already does exactly what you described for the eventual background
   — I left it untouched.

## Tuning
- **Timing** — `T` object at the top of `js/intro-animation.js`. Every
  value is a 0→1 fraction of the pinned scroll distance.
- **Icon final positions** — `--fx`/`--fy` custom properties on
  `#iconFigma`, `#iconPpt`, etc. in `css/intro.css` (desktop values near
  the top of the file, a tighter mobile set at the bottom).
- **Icon rotation/overshoot/stagger** — `ICONS` array in
  `js/intro-animation.js`.
- **Pin scroll distance** (300–400vh range) — `.intro-scroll-space`
  height in `css/intro.css` (340vh desktop / 300vh mobile).
- **Debug mode** — open the page with `?debug=1` to get GSAP markers on
  both ScrollTriggers and a console log of live progress, for visually
  lining values up against the reference video while you scroll.

## One thing I couldn't verify myself
This sandbox has no network access, so I could not load the GSAP CDN in
a real browser to eyeball the motion. I checked HTML/CSS/JS structure
and syntax carefully by hand, and cross-checked every element ID the
script references against the markup, but please load the page and
scroll through it before treating the timing as final — nudge `T` and
the icon configs to taste.
