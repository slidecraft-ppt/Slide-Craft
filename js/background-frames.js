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

       CUSTOMIZE:
       1. FRAME_FOLDER → put your images/frames/frame_001.jpg … files here
       2. FRAME_COUNT  → set this to the exact number of frames you have
       3. FRAME_PAD    → digits in the filename number (frame_001 → 3)
       4. FRAME_EXT    → file extension of your frames
    ════════════════════════════════════════════════════════════════ */
    const FRAME_FOLDER = 'images/scroll-frames/';
    const FRAME_PREFIX = 'frame_';
    const FRAME_COUNT = 660;   // CUSTOMIZE: total number of frame images you have
    const FRAME_PAD = 3;     // frame_001.jpg → 3 digits
    const FRAME_EXT = '.jpg';

    (function scrollFramesInit() {
      const canvas = document.getElementById('scroll-frames');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // On mobile / touch / small-viewport / data-saver / reduced-motion,
      // downloading and scroll-scrubbing 660 images is unnecessarily heavy
      // (large data usage, battery drain, and scroll jank on lower-end
      // devices). Those visitors get a single static frame instead — the
      // ambient gradient/noise/vignette layers still provide the rest of
      // the background look.
      const isSmallViewport = window.matchMedia('(max-width: 768px)').matches;
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isDataSaver = !!(navigator.connection && navigator.connection.saveData);
      const useLightweightMode = isSmallViewport || isCoarsePointer || prefersReducedMotion || isDataSaver;

      const frames = [];
      let loadedCount = 0;
      let currentFrame = 0;
      let ticking = false;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);

      function framePath(i) {
        const n = String(i + 1).padStart(FRAME_PAD, '0');
        return `${FRAME_FOLDER}${FRAME_PREFIX}${n}${FRAME_EXT}`;
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
        return Math.min(FRAME_COUNT - 1, Math.round(pct * (FRAME_COUNT - 1)));
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
        // Lightweight path: load frame 1 only, draw once, no scroll redraws.
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

      // Full path (desktop / fine-pointer / no data-saver): preload every
      // frame; canvas fades in once the sequence is usable.
      for (let i = 0; i < FRAME_COUNT; i++) {
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

