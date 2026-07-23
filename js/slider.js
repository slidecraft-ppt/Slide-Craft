/* ════════════════════════════════════════════════════════════════
   SLIDER.JS
   Reusable image/video slider module used on individual project pages.
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       SLIDER MODULE
       ──────────────────────────────────────────────────────────────
       Renders a slide track that supports both <img> and <video>.
       Videos autoplay (muted) when their slide becomes active and
       pause when navigating away.
    
       MEDIA TYPES in showcase[]:
         • 'images/foo.png'             → standard image slide
         • { type:'video', src:'...' }  → video slide (autoplays)
    ════════════════════════════════════════════════════════════════ */

    let _sliderState = null;
    let _autoplayTimer = null;
    let _sliderKeyHandler = null;

    /**
     * buildInteractiveSlider(p)
     * Returns HTML string for the full media slider section.
     * Called from buildShowcaseGallery() → openProject().
     */
    function buildInteractiveSlider(p) {
      const items = p.showcase && p.showcase.length > 0 ? p.showcase : [null];
      const count = items.length;

      // ── Build each slide ──────────────────────────────────────
      const slidesHtml = items.map((item, i) => {
        let mediaEl = '';

        if (!item) {
          // Placeholder slide
          mediaEl = `<div class="pslide-placeholder">
        <div class="pslide-ph-letter">${p.title.charAt(0)}</div>
        <div class="pslide-ph-label">${p.tagline}</div>
      </div>`;
        } else if (isVideoItem(item)) {
          // ── VIDEO SLIDE ──
          // autoplay + loop + muted (required for autoplay in browsers)
          // poster is the first-frame preview image (optional but recommended)
          mediaEl = `
        <video class="pslide-video"
               src="${item.src}"
               ${item.poster ? `poster="${item.poster}"` : ''}
               muted playsinline loop preload="metadata"
               data-video-slide="true"></video>
        <div class="pslide-overlay"></div>
        <!-- VIDEO type badge (top-left, always visible) -->
        <div class="pslide-type-badge">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Video
        </div>
        <!-- Mute/unmute toggle (bottom-right) -->
        <div class="pslide-video-controls">
          <button class="pslide-mute-btn" onclick="toggleSlideVideoMute(this)" title="Toggle sound">
            <svg class="icon-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
            <svg class="icon-unmuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:none">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
            Muted
          </button>
        </div>`;
        } else {
          // ── IMAGE SLIDE ──
          mediaEl = `
        <img class="pslide-img"
             src="${item}"
             loading="${i === 0 ? 'eager' : 'lazy'}"
             alt="${p.title} — image ${i + 1}"
             draggable="false"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="pslide-placeholder" style="display:none">
          <div class="pslide-ph-letter">${p.title.charAt(0)}</div>
          <div class="pslide-ph-label">Image unavailable</div>
        </div>
        <div class="pslide-overlay"></div>`;
        }

        return `<div class="pslide${i === 0 ? ' active' : ''}" data-idx="${i}">${mediaEl}</div>`;
      }).join('');

      // ── Build thumbnail strip ────────────────────────────────
      const thumbsHtml = items.map((item, i) => {
        let thumbContent = '';

        if (!item) {
          thumbContent = `<div class="pthumb-ph">${i + 1}</div>`;
        } else if (isVideoItem(item)) {
          // Video thumbnail: show poster image or plain placeholder + play icon
          thumbContent = item.poster
            ? `<img src="${item.poster}" loading="lazy" alt="Video thumb ${i + 1}" draggable="false">
           <div class="pthumb-video-overlay">
             <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
           </div>`
            : `<div class="pthumb-ph">${i + 1}
             <div class="pthumb-video-overlay" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="color:rgba(29,45,68,0.5)"><path d="M8 5v14l11-7z"/></svg>
             </div>
           </div>`;
        } else {
          thumbContent = `
        <img src="${item}" loading="lazy" alt="Thumb ${i + 1}" draggable="false"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="pthumb-ph" style="display:none">${i + 1}</div>`;
        }

        return `<div class="pslider-thumb${i === 0 ? ' active' : ''}" data-idx="${i}" style="position:relative">${thumbContent}</div>`;
      }).join('');

      // Glow color from project accent
      const glowRgb = hexToRgb(p.color || '#b8860b');
      const glowBg = glowRgb ? `rgba(${glowRgb},0.12)` : 'rgba(184,134,11,0.1)';

      return `
  <div class="showcase-section reveal">
    <div class="showcase-section-head">
      <div>
        <div class="section-label"><span></span>Selected Work</div>
        <h2 class="section-head">Work <em>Examples</em></h2>
      </div>
      <div class="showcase-count">${String(count).padStart(2, '0')}</div>
    </div>
    <div class="pslider-wrap" id="psliderWrap">
      <div class="pslider-glow" style="background:${glowBg}"></div>
      <div class="pslider-viewport" id="psliderViewport">
        <div class="pslider-counter">
          <span id="psliderCurNum">01</span> / <span id="psliderTotNum">${String(count).padStart(2, '0')}</span>
        </div>
        <button class="pslider-arrow prev" id="psliderPrev" aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div class="pslider-track" id="psliderTrack">${slidesHtml}</div>
        <button class="pslider-arrow next" id="psliderNext" aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div class="pslider-thumbs" id="psliderThumbs">${thumbsHtml}</div>
    </div>
  </div>`;
    }

    /**
     * Toggle mute on a video slide from its button.
     * Called by the inline onclick on .pslide-mute-btn.
     */
    function toggleSlideVideoMute(btn) {
      const slide = btn.closest('.pslide');
      const vid = slide && slide.querySelector('video');
      if (!vid) return;
      vid.muted = !vid.muted;
      btn.querySelector('.icon-muted').style.display = vid.muted ? '' : 'none';
      btn.querySelector('.icon-unmuted').style.display = vid.muted ? 'none' : '';
      btn.childNodes[btn.childNodes.length - 1].textContent = vid.muted ? ' Muted' : ' Sound on';
    }

    /**
     * initSlider(p)
     * Wires all slider interactivity after HTML is injected.
     */
    function initSlider(p) {
      const items = p.showcase && p.showcase.length > 0 ? p.showcase : [null];
      const viewport = document.getElementById('psliderViewport');
      const track = document.getElementById('psliderTrack');
      const thumbsEl = document.getElementById('psliderThumbs');
      if (!viewport || !track) return;

      _sliderState = { p, items, total: items.length, cur: 0, isAnimating: false };
      clearAutoplay();

      // ── Helper: pause all video slides ──────────────────────
      function pauseAllVideos() {
        track.querySelectorAll('video').forEach(v => v.pause());
      }

      // ── Helper: play video on the active slide if it's a video ──
      function playActiveVideo(idx) {
        const activeSlide = track.querySelector(`.pslide[data-idx="${idx}"]`);
        const vid = activeSlide && activeSlide.querySelector('video');
        if (vid) vid.play().catch(() => { });
      }

      // ── goTo: move the track to a given index ────────────────
      function goTo(idx, animate = true) {
        if (_sliderState.isAnimating && animate) return;
        const s = _sliderState;

        if (SLIDER_LOOP) idx = ((idx % s.total) + s.total) % s.total;
        else idx = Math.max(0, Math.min(idx, s.total - 1));

        // Pause all, then play the newly active one (if video)
        pauseAllVideos();

        track.style.transition = animate
          ? 'transform var(--slider-speed) var(--slider-ease)'
          : 'none';

        requestAnimationFrame(() => { track.style.transform = `translateX(-${idx * 100}%)`; });

        track.querySelectorAll('.pslide').forEach((sl, i) => sl.classList.toggle('active', i === idx));

        updateThumbs(idx);
        updateCounter(idx);

        s.cur = idx;
        if (animate) {
          s.isAnimating = true;
          setTimeout(() => {
            if (_sliderState) _sliderState.isAnimating = false;
            playActiveVideo(idx); // play after transition completes
          }, 600);
        } else {
          playActiveVideo(idx);
        }
      }

      function updateThumbs(idx) {
        if (!thumbsEl) return;
        thumbsEl.querySelectorAll('.pslider-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
        const active = thumbsEl.querySelector('.pslider-thumb.active');
        if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }

      function updateCounter(idx) {
        const el = document.getElementById('psliderCurNum');
        if (el) el.textContent = String(idx + 1).padStart(2, '0');
      }

      // ── Arrow buttons ────────────────────────────────────────
      document.getElementById('psliderPrev')?.addEventListener('click', e => {
        e.stopPropagation(); goTo(_sliderState.cur - 1); resetAutoplay();
      });
      document.getElementById('psliderNext')?.addEventListener('click', e => {
        e.stopPropagation(); goTo(_sliderState.cur + 1); resetAutoplay();
      });

      // ── Click viewport → open lightbox ───────────────────────
      viewport.addEventListener('click', () => {
        openPremiumLightbox(_sliderState.items, _sliderState.cur, p);
      });

      // ── Thumbnail clicks ─────────────────────────────────────
      thumbsEl?.querySelectorAll('.pslider-thumb').forEach((t, i) => {
        t.addEventListener('click', e => { e.stopPropagation(); goTo(i); resetAutoplay(); });
      });

      // ── Keyboard navigation ──────────────────────────────────
      if (_sliderKeyHandler) document.removeEventListener('keydown', _sliderKeyHandler);
      _sliderKeyHandler = e => {
        if (document.getElementById('pslider-lightbox')?.classList.contains('open')) return;
        if (e.key === 'ArrowLeft') { goTo(_sliderState.cur - 1); resetAutoplay(); }
        if (e.key === 'ArrowRight') { goTo(_sliderState.cur + 1); resetAutoplay(); }
      };
      document.addEventListener('keydown', _sliderKeyHandler);

      // ── Touch/swipe ──────────────────────────────────────────
      let touchX = 0, touchY = 0, isSwiping = false;
      viewport.addEventListener('touchstart', e => {
        touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; isSwiping = false;
      }, { passive: true });
      viewport.addEventListener('touchmove', e => {
        const dx = Math.abs(e.touches[0].clientX - touchX);
        const dy = Math.abs(e.touches[0].clientY - touchY);
        if (dx > dy && dx > 8) isSwiping = true;
      }, { passive: true });
      viewport.addEventListener('touchend', e => {
        if (!isSwiping) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (dx < -40) { goTo(_sliderState.cur + 1); resetAutoplay(); }
        else if (dx > 40) { goTo(_sliderState.cur - 1); resetAutoplay(); }
        isSwiping = false;
        e.preventDefault();
      }, { passive: false });

      // ── Parallax on mouse move ───────────────────────────────
      const wrap = document.getElementById('psliderWrap');
      wrap?.addEventListener('mousemove', e => {
        const rect = viewport.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        const media = track.querySelector('.pslide.active .pslide-img, .pslide.active .pslide-video');
        if (media) media.style.transform = `scale(1.06) translate(${cx * PARALLAX_STRENGTH}px, ${cy * PARALLAX_STRENGTH}px)`;
      });
      wrap?.addEventListener('mouseleave', () => {
        const media = track.querySelector('.pslide.active .pslide-img, .pslide.active .pslide-video');
        if (media) media.style.transform = 'scale(1) translate(0,0)';
      });

      // ── Autoplay (disabled by default; set SLIDER_AUTOPLAY=true) ─
      function startAutoplay() {
        if (!SLIDER_AUTOPLAY || _sliderState.total <= 1) return;
        _autoplayTimer = setInterval(() => goTo(_sliderState.cur + 1), SLIDER_AUTOPLAY_MS);
      }
      function resetAutoplay() { clearAutoplay(); startAutoplay(); }
      startAutoplay();
      viewport.addEventListener('mouseenter', clearAutoplay);
      viewport.addEventListener('mouseleave', () => { if (SLIDER_AUTOPLAY) startAutoplay(); });

      // Play first slide if it's a video
      playActiveVideo(0);
    }

    function clearAutoplay() {
      if (_autoplayTimer) { clearInterval(_autoplayTimer); _autoplayTimer = null; }
    }

    /* Convenience wrapper called by openProject() */
    function buildShowcaseGallery(p) { return buildInteractiveSlider(p); }

