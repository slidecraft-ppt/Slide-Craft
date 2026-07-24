/* ════════════════════════════════════════════════════════════════
   BACKGROUND-FRAMES.JS
   Scroll-scrubbed image-sequence background (renders to the #scroll-frames canvas).
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       SCROLL-FRAMES BACKGROUND
       ──────────────────────────────────────────────────────────────
       Renders a full-bleed image sequence to the #scroll-frames canvas
       and scrubs through it as the visitor scrolls down the page —
       the site's entire background becomes a scroll-driven animation.

       Desktop and mobile use SEPARATE frame sequences (mobile's is
       meant to be a smaller/lighter set — fewer frames and/or smaller
       source images — since phones shouldn't download 660 desktop-res
       JPEGs). Both still scrub live with scroll.

       CUSTOMIZE:
       1. folder → put your images/frames/frame_001.jpg … files here
       2. count  → set this to the exact number of frames you have
       3. pad    → digits in the filename number (frame_001 → 3)
       4. ext    → file extension of your frames
       Do this for BOTH the desktop and mobile configs below.
    ════════════════════════════════════════════════════════════════ */
    const FRAME_CONFIG_DESKTOP = {
      folder: 'images/scroll-frames/',      // CUSTOMIZE: desktop frame folder
      prefix: 'frame_',
      count: 660,                           // CUSTOMIZE: total desktop frames
      pad: 3,                               // frame_001.jpg → 3 digits
      ext: '.jpg'
    };

    const FRAME_CONFIG_MOBILE = {
      folder: 'images/scroll-frames-mobile/', // CUSTOMIZE: mobile frame folder (smaller/lighter images)
      prefix: 'frame_',
      count: 655,                             // CUSTOMIZE: total mobile frames (fewer than desktop)
      pad: 3,                                 // frame_001.jpg → 3 digits
      ext: '.jpg'
    };

    // Viewport width below which the mobile frame set is used instead of desktop's.
    const MOBILE_BREAKPOINT = 768;

    (function scrollFramesInit() {
      const canvas = document.getElementById('scroll-frames');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // Pick the frame sequence for this device. Mobile gets its own
      // (smaller/lighter) set, but still scrubs frame-by-frame with
      // scroll just like desktop.
      const isSmallViewport = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
      const FRAME_CONFIG = isSmallViewport ? FRAME_CONFIG_MOBILE : FRAME_CONFIG_DESKTOP;

      // Accessibility / data-saver preferences still fall back to a single
      // static frame regardless of device — these are about respecting a
      // user preference, not about screen size.
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isDataSaver = !!(navigator.connection && navigator.connection.saveData);
      const useLightweightMode = prefersReducedMotion || isDataSaver;

      const frames = [];
      let loadedCount = 0;
      let currentFrame = 0;
      let ticking = false;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);

      function framePath(i) {
        const n = String(i + 1).padStart(FRAME_CONFIG.pad, '0');
        return `${FRAME_CONFIG.folder}${FRAME_CONFIG.prefix}${n}${FRAME_CONFIG.ext}`;
      }

      function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        drawFrame(currentFrame);
      }

      // Draws an image onto the canvas using "cover" fit, like CSS background-size:cover
      function drawFrame(index) {
        const img = frames[index];
        if (!img || !img.complete || !img.naturalWidth) return;
        const cw = canvas.width, ch = canvas.height;
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale, dh = ih * scale;
        const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      function frameForScroll() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
        return Math.min(FRAME_CONFIG.count - 1, Math.round(pct * (FRAME_CONFIG.count - 1)));
      }

      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          currentFrame = frameForScroll();
          drawFrame(currentFrame);
          ticking = false;
        });
      }

      if (useLightweightMode) {
        // Lightweight path: load frame 1 only (from whichever config was
        // picked above), draw once, no scroll redraws.
        const img = new Image();
        img.src = framePath(0);
        img.onload = () => {
          drawFrame(0);
          canvas.classList.add('is-ready');
        };
        img.onerror = () => {
          // Missing frame file — silently skip; ambient gradient layers
          // above the canvas still provide a background either way.
        };
        frames.push(img);
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });
        return;
      }

      // Full path: preload every frame in the selected sequence (desktop
      // or mobile); canvas fades in once the sequence is usable.
      for (let i = 0; i < FRAME_CONFIG.count; i++) {
        const img = new Image();
        img.src = framePath(i);
        img.onload = () => {
          loadedCount++;
          if (i === 0) drawFrame(0);
          if (loadedCount === 1) canvas.classList.add('is-ready');
        };
        img.onerror = () => {
          // Missing frame file — silently skip; ambient gradient layers
          // above the canvas still provide a background either way.
        };
        frames.push(img);
      }

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
    })();
