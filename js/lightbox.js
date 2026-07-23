/* ════════════════════════════════════════════════════════════════
   LIGHTBOX.JS
   Fullscreen lightbox module for viewing slider media at full size.
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       FULLSCREEN LIGHTBOX MODULE
       ──────────────────────────────────────────────────────────────
       Opened when user clicks the main slider viewport.
       Supports both images and video in the lightbox.
       ESC key closes. Arrow keys navigate. Swipe on mobile.
    ════════════════════════════════════════════════════════════════ */
    let _lb = { items: [], idx: 0, p: null };

    function openPremiumLightbox(items, startIdx, p) {
      _lb.items = items && items.length > 0 ? items : [null];
      _lb.idx = startIdx || 0;
      _lb.p = p;
      renderLbThumbs();
      renderLbItem();
      document.getElementById('pslider-lightbox').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function renderLbItem() {
      const slot = document.getElementById('plbImgSlot');
      const title = document.getElementById('plbTitle');
      const ctr = document.getElementById('plbCounter');
      if (!slot) return;

      const item = _lb.items[_lb.idx];
      const p = _lb.p;

      if (!item) {
        slot.innerHTML = `<div class="plb-ph">
      <div class="plb-ph-letter">${p.title.charAt(0)}</div>
      <div class="plb-ph-text">${p.tagline}</div>
    </div>`;
      } else if (isVideoItem(item)) {
        // ── Video in lightbox: controls visible, click to play/pause ──
        slot.innerHTML = `
      <video class="plb-main-video"
             src="${item.src}"
             ${item.poster ? `poster="${item.poster}"` : ''}
             muted controls autoplay loop playsinline
             style="max-height:72vh;width:100%;background:rgba(20,14,8,.5)"></video>`;
      } else {
        slot.innerHTML = `
      <img class="plb-main-img" src="${item}" alt="${p.title}" draggable="false"
           onerror="this.parentNode.innerHTML='<div class=\\"plb-ph\\"><div class=\\"plb-ph-letter\\">${p.title.charAt(0)}</div><div class=\\"plb-ph-text\\">Image unavailable</div></div>'">`;
      }

      if (title) title.textContent = p.title;
      if (ctr) ctr.textContent = `${String(_lb.idx + 1).padStart(2, '0')} / ${String(_lb.items.length).padStart(2, '0')}`;

      // Sync thumbnail highlights
      document.getElementById('plbThumbs')?.querySelectorAll('.plb-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === _lb.idx);
        if (i === _lb.idx) t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      });
    }

    function renderLbThumbs() {
      const container = document.getElementById('plbThumbs');
      if (!container) return;

      container.innerHTML = _lb.items.map((item, i) => {
        let content = '';
        if (!item) {
          content = `<div class="plb-thumb-ph">${i + 1}</div>`;
        } else if (isVideoItem(item)) {
          content = item.poster
            ? `<img src="${item.poster}" loading="lazy" alt="Thumb ${i + 1}" draggable="false">
           <div class="plb-thumb-vid-icon">
             <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
           </div>`
            : `<div class="plb-thumb-ph">▶</div>`;
        } else {
          content = `
        <img src="${item}" loading="lazy" alt="Thumb ${i + 1}" draggable="false"
             onerror="this.style.display='none';this.nextSibling.style.display='flex'">
        <div class="plb-thumb-ph" style="display:none">${i + 1}</div>`;
        }
        return `<div class="plb-thumb${i === _lb.idx ? ' active' : ''}" data-idx="${i}" style="position:relative">${content}</div>`;
      }).join('');

      container.querySelectorAll('.plb-thumb').forEach((t, i) => {
        t.addEventListener('click', () => { _lb.idx = i; renderLbItem(); });
      });
    }

    function closePremiumLightbox() {
      document.getElementById('pslider-lightbox')?.classList.remove('open');
      document.body.style.overflow = '';
      // Stop any playing lightbox video
      document.getElementById('plbImgSlot')?.querySelectorAll('video').forEach(v => v.pause());
    }

    function lbPrev() { _lb.idx = ((_lb.idx - 1) + _lb.items.length) % _lb.items.length; renderLbItem(); }
    function lbNext() { _lb.idx = (_lb.idx + 1) % _lb.items.length; renderLbItem(); }

    /* Wire lightbox controls (runs once on load) */
    (function setupLightboxControls() {
      document.getElementById('pslider-lightbox')?.addEventListener('click', e => {
        if (e.target === document.getElementById('pslider-lightbox')) closePremiumLightbox();
      });
      document.getElementById('plbClose')?.addEventListener('click', closePremiumLightbox);
      document.getElementById('plbPrev')?.addEventListener('click', e => { e.stopPropagation(); lbPrev(); });
      document.getElementById('plbNext')?.addEventListener('click', e => { e.stopPropagation(); lbNext(); });

      document.addEventListener('keydown', e => {
        if (!document.getElementById('pslider-lightbox')?.classList.contains('open')) return;
        if (e.key === 'Escape') closePremiumLightbox();
        if (e.key === 'ArrowLeft') lbPrev();
        if (e.key === 'ArrowRight') lbNext();
      });

      // Touch swipe in lightbox
      const lbEl = document.getElementById('pslider-lightbox');
      let lbTX = 0, lbDrag = false;
      lbEl?.addEventListener('touchstart', e => { lbTX = e.touches[0].clientX; lbDrag = false; }, { passive: true });
      lbEl?.addEventListener('touchmove', e => {
        if (Math.abs(e.touches[0].clientX - lbTX) > 8) lbDrag = true;
      }, { passive: true });
      lbEl?.addEventListener('touchend', e => {
        if (!lbDrag) return;
        const dx = e.changedTouches[0].clientX - lbTX;
        if (dx < -40) lbNext();
        else if (dx > 40) lbPrev();
        lbDrag = false;
      }, { passive: true });
    })();

