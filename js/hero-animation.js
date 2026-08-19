/* ============================================================================
   SLIDECRAFT — HERO SCROLL ANIMATION
   Icon fountain (Canva/Figma/PowerPoint/Arduino/Word fly in) + title shrink,
   driven by scroll position while the hero is pinned. Merged from the
   standalone drop-in build into the real site's #navbar / .hero markup.

   FIXED (see audit):
   1. sizePinWrap() accounts for the pinned element's own 100vh, so the pin
      holds for the FULL scroll distance configured by iconStageHeight +
      infoFadeDistance instead of releasing at roughly half that distance.
   2. #navbar flies in (translateY + fade) during the same window the
      info-group fades in, instead of just sitting static on screen. It's
      hidden on load and only becomes interactive once faded in.
   3. TITLE ANCHORING REWORKED: the title group used to be animated with a
      small px `translateY` offset while sitting in normal flex flow inside
      #hero-inner. Combined with the pin + real page scroll, that let it
      drift/scroll off the top of the screen instead of staying put.
      #hero-title-group is now a direct child of #hero-viewport (see
      index.html) and absolutely positioned via `top: <percent>` — it starts
      anchored low ("fixed on the bottom") and eases to a slightly higher
      resting spot while shrinking (--ts), driven by the SAME iconProgress
      that drives the icon fountain, so title shrink / icon fly-in / and
      (indirectly, since background-frames.js reads real scroll position)
      the background-frame scrub all move together.

   Background frame sequence is left alone — already handled separately by
   background-frames.js + #scroll-frames, and it reads scroll position
   proportionally so it keeps working correctly with the larger pin height.
   ============================================================================
   QUICK CUSTOMIZATION GUIDE — everything below is cross-referenced here.
   ============================================================================
   ICON FILES         → HERO_ICONS                              ("ICON FILES" tag)
   ICON POSITION       → iconConfig[iconName].end.x / .end.y     ("ICON POSITION" tag)
   ICON SIZE           → iconConfig[iconName].end.scale          ("ICON SIZE" tag)
                          + .hero-icon { width / height } in css/hero-animation.css
   ICON SPREAD         → SPREAD_ORIGIN (where they burst FROM) + arcLift ("SPREAD" tag)
   ICON START SIZE     → SPREAD_ORIGIN.scale (how tiny icons are before bursting)
   TITLE POSITION       → HERO_ANIMATION_CONFIG.titleStartY / titleEndY   ("TITLE POSITION" tag)
                          — both are % of viewport HEIGHT (0=top, 100=bottom)
   TITLE SIZE           → HERO_ANIMATION_CONFIG.titleStartScale / titleEndScale
   MOBILE SPREAD       → spreadFactor() (how much the fan shrinks on phones)
   MOBILE ICON POSITION → iconConfig[iconName].mobile.x / .y / .scale / .rotation
                          ("MOBILE ICON POSITION" tag) — set per-icon, only used
                          at/under MOBILE_BREAKPOINT; leave an icon's "mobile"
                          key out to keep using the auto spreadFactor() scaling.
   MOBILE TITLE POSITION/SIZE → MOBILE_TITLE_CONFIG below ("MOBILE TITLE" tag)
   NAVBAR FLY-IN        → navEl gsap.set() calls below ("NAVBAR" tag)
   Search for the ALL-CAPS tags in quotes above to jump straight to each knob.
   ============================================================================ */
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================================
     SELECTORS — matches the real site's markup (index.html)
     ========================================================================== */
  const SEL = {
    pinWrap:    "#hero-pin-wrap",
    viewport:   "#hero-viewport",
    titleGroup: "#hero-title-group",
    infoGroup:  "#hero-info-group",
    navbar:     "#navbar"        // "NAVBAR" — the real site's fixed nav
  };

  if (!document.querySelector(SEL.pinWrap)) return; // hero not on this page/view

  /* =====================================================
     "ICON FILES" — replace these paths with your real icon
     images. Do NOT use downloaded/stock icons or emoji —
     these are placeholders only, clearly marked for swapping.
     ===================================================== */
  const HERO_ICONS = {
  canva:      "images/icons/canva.png",
  figma:      "images/icons/figma.png",
  powerpoint: "images/icons/ppt.webp",
  arduino:    "images/icons/arduino.webp",
  word:       "images/icons/word.png"
};

  Object.keys(HERO_ICONS).forEach(function (key) {
    const img = document.getElementById("icon-" + key + "-img");
    if (img) img.src = HERO_ICONS[key];
  });

  /* ==========================================================================
     ANIMATION CONFIG — tune the feel of the sequence here.
     ========================================================================== */
  const HERO_ANIMATION_CONFIG = {
    // How much scrolling (in viewport-heights) it takes to complete the icon
    // fly-in stage. Higher = slower, more deliberate scroll-scrub.
    iconStageHeight: 1.4,

    // How much additional scroll (in viewport-heights) the info-group fade-in
    // (and the navbar fly-in) consumes after icons finish, before the pin
    // releases.
    infoFadeDistance: 0.6,

    // Fraction of the icon-stage progress (0–1) reserved for icons to arrive
    // vs. hold still before the gate releases.
    iconArriveFraction: 0.7,

    // Per-icon stagger: each icon's own travel window is offset slightly so
    // they don't all move in perfect unison.
    iconStagger: 0.12,

    // Show GSAP ScrollTrigger markers while tuning. Set false before shipping.
    debugMarkers: false,

    // ---- Title group (badge + h1 + divider) ----
    // "TITLE POSITION" — both % of viewport HEIGHT (0=top edge, 100=bottom
    // edge). Title starts anchored low/near the bottom (matches the initial
    // hero look) and eases up slightly to its resting spot as icons finish
    // fountaining out.
    titleStartY: 70,   // anchor BEFORE you scroll — near the bottom
    titleEndY: 62,      // anchor AFTER the icon stage finishes

    // "TITLE SIZE" — scale multiplier (1 = 100%, 0.6 = shrunk to 60%),
    // applied on top of whatever font-size hero.css already sets.
    titleStartScale: 1,     // size BEFORE you scroll
    titleEndScale: 0.6      // size AFTER the icon stage finishes
  };

  /* ==========================================================================
     MOBILE BREAKPOINT — shared by icon position overrides and title
     position/scale overrides below.
     ========================================================================== */
  const MOBILE_BREAKPOINT = 768;
  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  /* --------------------------------------------------------------------------
     "MOBILE TITLE" — title group anchor/scale on phones (≤ MOBILE_BREAKPOINT).
     Same shape as titleStartY/titleEndY/titleStartScale/titleEndScale above,
     just a separate set of numbers used only on mobile. Set enabled:false to
     make mobile just reuse the desktop numbers.
     -------------------------------------------------------------------------- */
  const MOBILE_TITLE_CONFIG = {
    enabled: true,
    titleStartY: 84,
    titleEndY: 58,
    titleStartScale: 1,
    titleEndScale: 0.68
  };

  /* ==========================================================================
     ICON MOVEMENT CONFIG — CENTER-BURST MODEL
     All 5 icons originate from the CENTER of the hero viewport, stacked tiny
     on top of one another, then burst outward on scroll and land in a fan
     spread around the title.
     ========================================================================== */
  // "SPREAD" — the single point all 5 icons burst OUT FROM.
  const SPREAD_ORIGIN = {
    xPct: 50,
    yPct: 46,
    scale: 0.12,   // "ICON START SIZE"
    rotation: 0
  };

  /* ----------------------------------------------------------------------
     PER-ICON SETTINGS — this is the one you'll edit most.
       end.x / end.y   → "ICON POSITION": where it lands, in % of the
                          viewport (x: 0=left...100=right, y: 0=top...100=bottom)
       end.scale       → "ICON SIZE": size once landed (1.00 = the CSS
                          width/height in hero-animation.css, i.e. 110x110px)
       end.rotation    → resting tilt in degrees
       mobile          → "MOBILE ICON POSITION": optional hand-placed
                          { x, y, scale, rotation } used instead of the
                          automatic spreadFactor() scaling on phones. Delete
                          this key on an icon to go back to auto-scaling.
       arcLift         → "SPREAD" shape: how high the icon bows above a
                          straight line on its way out
       staggerIndex    → which of the 3 timing groups (0,1,2) this icon joins
     ---------------------------------------------------------------------- */
  const iconConfig = {
    figma: {
      start: { x: SPREAD_ORIGIN.xPct, y: SPREAD_ORIGIN.yPct, scale: SPREAD_ORIGIN.scale, rotation: 20 },
      end:   { x: 32, y: 20, scale: 1.30, rotation: -14 },   // upper-left
      mobile: { x: 22, y: 16, scale: 0.75, rotation: -14 },
      arcLift: 16,
      ease: "back.out(1.7)",
      staggerIndex: 0
    },
    powerpoint: {
      start: { x: SPREAD_ORIGIN.xPct, y: SPREAD_ORIGIN.yPct, scale: SPREAD_ORIGIN.scale, rotation: -15 },
      end:   { x: 70, y: 30, scale: 0.90, rotation: 14 },    // upper-right
      mobile: { x: 80, y: 18, scale: 0.58, rotation: 14 },
      arcLift: 16,
      ease: "back.out(1.7)",
      staggerIndex: 0
    },
    arduino: {
      start: { x: SPREAD_ORIGIN.xPct, y: SPREAD_ORIGIN.yPct, scale: SPREAD_ORIGIN.scale, rotation: -8 },
      end:   { x: 50, y: 32, scale: 0.72, rotation: 20 },     // top-center
      mobile: { x: 50, y: 26, scale: 0.48, rotation: 20 },
      arcLift: 20,
      ease: "back.out(1.6)",
      staggerIndex: 1
    },
    word: {
      start: { x: SPREAD_ORIGIN.xPct, y: SPREAD_ORIGIN.yPct, scale: SPREAD_ORIGIN.scale, rotation: -10 },
      end:   { x: 76, y: 58, scale: 0.72, rotation: -10 },    // mid-right
      mobile: { x: 84, y: 42, scale: 0.48, rotation: -10 },
      arcLift: 14,
      ease: "back.out(1.6)",
      staggerIndex: 2
    },
    canva: {
      start: { x: SPREAD_ORIGIN.xPct, y: SPREAD_ORIGIN.yPct, scale: SPREAD_ORIGIN.scale, rotation: 18 },
      end:   { x: 24, y: 58, scale: 0.90, rotation: -10 },   // mid-left
      mobile: { x: 16, y: 42, scale: 0.58, rotation: -10 },
      arcLift: 14,
      ease: "back.out(1.6)",
      staggerIndex: 2
    }
  };

  const iconEls = {};
  Object.keys(iconConfig).forEach(function (key) {
    iconEls[key] = document.getElementById("icon-" + key);
  });

  const easeFns = {};
  Object.keys(iconConfig).forEach(function (key) {
    easeFns[key] = gsap.parseEase(iconConfig[key].ease);
  });

  /* --------------------------------------------------------------------------
     Maps overall icon-stage progress (0–1) to each icon's own eased local
     progress, honoring the per-icon stagger. Pure function of scroll
     progress — nothing keeps moving once the user stops scrolling.
     -------------------------------------------------------------------------- */
  function localProgress(rawProgress, staggerIndex) {
    const staggerCount = 3;
    const offset = (staggerIndex / staggerCount) * HERO_ANIMATION_CONFIG.iconStagger;
    const arrive = HERO_ANIMATION_CONFIG.iconArriveFraction;
    const t = (rawProgress - offset) / Math.max(0.0001, (arrive - offset));
    return Math.max(0, Math.min(1, t));
  }

  /* --------------------------------------------------------------------------
     "MOBILE SPREAD" — how tightly the fan pulls in on small screens when an
     icon has no "mobile" override. 1024px+ = full desktop spread. 480px and
     below = pulled in to 55% of the desktop spread.
     -------------------------------------------------------------------------- */
  function spreadFactor() {
    const w = window.innerWidth;
    if (w >= 1024) return 1;
    if (w <= 480) return 0.55;
    return 0.55 + (w - 480) / (1024 - 480) * 0.45;
  }

  function responsiveEnd(cfg) {
    // "MOBILE ICON POSITION" — a hand-placed cfg.mobile wins outright on
    // phones, skipping the automatic proportional scaling below entirely.
    if (isMobile() && cfg.mobile) return cfg.mobile;

    const f = spreadFactor();
    if (f === 1) return cfg.end;
    return {
      x: 50 + (cfg.end.x - 50) * f,
      y: cfg.end.y,
      scale: cfg.end.scale * (0.75 + 0.25 * f),
      rotation: cfg.end.rotation
    };
  }

  function bezier(p0, control, p1, t) {
    const mt = 1 - t;
    return mt * mt * p0 + 2 * mt * t * control + t * t * p1;
  }

  /* --------------------------------------------------------------------------
     "ICON FADE-OUT" — same idea as the title's fade-out below: icons finish
     arriving by iconArriveFraction (0.7) of the icon stage and then just sit
     there fully opaque for the remaining hold window. That hold window is
     reused here to fade the icons OUT too, in sync with the title, so
     nothing from the icon-fountain stage is still on screen when
     #hero-info-group starts fading in.
     -------------------------------------------------------------------------- */
  function holdFadeOut(rawProgress) {
    const holdStart = HERO_ANIMATION_CONFIG.iconArriveFraction; // 0.7
    if (rawProgress <= holdStart) return 1;
    const t = (rawProgress - holdStart) / (1 - holdStart);
    return Math.max(0, 1 - t);
  }

  function updateIcons(rawProgress) {
    const fadeOut = holdFadeOut(rawProgress);
    Object.keys(iconConfig).forEach(function (key) {
      const cfg = iconConfig[key];
      const el = iconEls[key];
      if (!el) return;

      const end = responsiveEnd(cfg);
      const t = localProgress(rawProgress, cfg.staggerIndex);
      const eased = easeFns[key](t);

      const controlX = (cfg.start.x + end.x) / 2;
      const controlY = Math.min(cfg.start.y, end.y) - cfg.arcLift;

      const x = bezier(cfg.start.x, controlX, end.x, eased);
      const y = bezier(cfg.start.y, controlY, end.y, eased);
      const s = gsap.utils.interpolate(cfg.start.scale, end.scale, eased);
      const r = gsap.utils.interpolate(cfg.start.rotation, end.rotation, eased);
      const o = Math.max(0, Math.min(1, t / 0.2)) * fadeOut;

      el.style.setProperty("--x", x + "%");
      el.style.setProperty("--y", y + "%");
      el.style.setProperty("--s", s);
      el.style.setProperty("--r", r + "deg");
      el.style.setProperty("--o", o);
    });
  }

  /* --------------------------------------------------------------------------
     TITLE GROUP: anchored via `top: <percent of viewport height>` (see
     hero-animation.css — #hero-title-group is `position:absolute` against
     #hero-viewport now), NOT a px translateY offset. This is what keeps it
     "fixed on the bottom" and shrinking in place instead of scrolling off
     the top: at progress 0 it's near the bottom (titleStartY), and it only
     eases up to titleEndY (still comfortably on-screen) as the SAME
     iconProgress that drives the icon fountain advances. Uses
     MOBILE_TITLE_CONFIG's numbers on phones (unless disabled).
     -------------------------------------------------------------------------- */
  const titleEase = gsap.parseEase("power2.out");
  /* --------------------------------------------------------------------------
     "TITLE FADE-OUT" — the title only has iconArriveFraction (0–0.7) of the
     icon stage to travel/shrink; the remaining 0.7–1.0 is just a hold while
     the icons settle (see localProgress()). We reuse that hold window to
     fade the title group OUT, so by iconProgress===1 (icon stage fully
     complete) it's already invisible — BEFORE #hero-info-group starts
     fading in during the next (fade) phase. Without this the shrunk title
     was sitting at rest directly on top of the description/buttons/stats
     as they faded in underneath it.
     -------------------------------------------------------------------------- */
  function titleOpacityFor(iconProgress) {
    const holdStart = HERO_ANIMATION_CONFIG.iconArriveFraction; // 0.7
    if (iconProgress <= holdStart) return 1;
    const t = (iconProgress - holdStart) / (1 - holdStart);
    return Math.max(0, 1 - t);
  }
  function updateTitle(iconProgress) {
    const cfg = (isMobile() && MOBILE_TITLE_CONFIG.enabled) ? MOBILE_TITLE_CONFIG : HERO_ANIMATION_CONFIG;
    const eased = titleEase(iconProgress);
    const ty = gsap.utils.interpolate(cfg.titleStartY, cfg.titleEndY, eased);
    const ts = gsap.utils.interpolate(cfg.titleStartScale, cfg.titleEndScale, eased);
    const el = document.querySelector(SEL.titleGroup);
    if (!el) return;
    el.style.setProperty("--ty", ty + "%");
    el.style.setProperty("--ts", ts);
    el.style.opacity = titleOpacityFor(iconProgress);
  }

  /* --------------------------------------------------------------------------
     "NAVBAR" — fixed site nav (css/navigation.css). Hidden/translated above
     the viewport while icons are fountaining out, then flies in (translateY
     + fade) during the SAME window the info-group fades in (fadeProgress),
     i.e. only once the icon stage is fully complete and the user keeps
     scrolling. Left interaction-disabled while off-screen so it can't eat
     clicks/taps meant for content behind it.
     -------------------------------------------------------------------------- */
  const navEl = document.querySelector(SEL.navbar);
  const NAV_HIDDEN_YPCT = -160;
  if (navEl) {
    gsap.set(navEl, { yPercent: NAV_HIDDEN_YPCT, opacity: 0 });
    navEl.style.pointerEvents = "none";
  }
  function updateNavbar(fadeProgress) {
    if (!navEl) return;
    gsap.set(navEl, {
      yPercent: NAV_HIDDEN_YPCT + fadeProgress * Math.abs(NAV_HIDDEN_YPCT),
      opacity: fadeProgress
    });
    navEl.style.pointerEvents = fadeProgress > 0.05 ? "auto" : "none";
  }

  /* ==========================================================================
     SCROLLTRIGGER — SINGLE PIN, TWO PHASES
     Phase A — ICON SCROLL GATE: icons fly in / hold, title anchors up + shrinks.
     Phase B — INFO FADE: description/CTAs/stats fade in, navbar flies in.
     Icons + title hold their final spot. Pin releases once Phase B completes
     and normal page scroll continues (hero scrolls away naturally — no
     forced "exit" transform needed on top of that).
     ========================================================================== */
  const iconFrac = HERO_ANIMATION_CONFIG.iconStageHeight /
    (HERO_ANIMATION_CONFIG.iconStageHeight + HERO_ANIMATION_CONFIG.infoFadeDistance);

  const heroST = ScrollTrigger.create({
    trigger: SEL.pinWrap,
    start: "top top",
    end: "bottom bottom",
    pin: SEL.viewport,
    scrub: true,
    anticipatePin: 1,
    markers: HERO_ANIMATION_CONFIG.debugMarkers,
    onUpdate: function (self) {
      const overall = self.progress;

      const iconProgress = Math.max(0, Math.min(1, overall / iconFrac));
      updateIcons(iconProgress);
      updateTitle(iconProgress);

      const fadeProgress = Math.max(0, Math.min(1, (overall - iconFrac) / (1 - iconFrac)));
      const infoEl = document.querySelector(SEL.infoGroup);
      if (infoEl) gsap.set(infoEl, { opacity: fadeProgress });

      // Navbar flies in alongside the info-group, only after icons finish.
      updateNavbar(fadeProgress);
    }
  });

  /* --------------------------------------------------------------------------
     FIX: previously this set pinWrap height to just
     (iconStageHeight + infoFadeDistance) * 100vh, which made the ACTUAL
     scrollable pin distance (pinWrap.height − pinnedElement.height, since
     #hero-viewport is 100vh) only HALF of the intended distance — causing
     the pin to release early / the whole sequence to feel rushed.
     Adding the pinned element's own 1 (100vh) fixes the math so the real
     scroll distance matches iconStageHeight + infoFadeDistance exactly.
     -------------------------------------------------------------------------- */
  function sizePinWrap() {
    const totalVh = 1 + HERO_ANIMATION_CONFIG.iconStageHeight + HERO_ANIMATION_CONFIG.infoFadeDistance;
    const wrap = document.querySelector(SEL.pinWrap);
    if (!wrap) return;
    wrap.style.height = (totalVh * 100) + "vh";
    ScrollTrigger.refresh();
  }
  sizePinWrap();
  window.addEventListener("resize", sizePinWrap);

  // Initialize icons + title at rest (progress 0) before any scroll happens.
  updateIcons(0);
  updateTitle(0);
  updateNavbar(0);

})();
