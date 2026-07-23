/* ════════════════════════════════════════════════════════════════
   PORTFOLIO.JS
   Builds the homepage portfolio cards grid, including hover-preview video handling.
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       HELPER: Is a showcase item a video?
    ════════════════════════════════════════════════════════════════ */
    function isVideoItem(item) {
      return item && typeof item === 'object' && item.type === 'video';
    }

    /* Returns the display src of a showcase item (string or object) */
    function itemSrc(item) { return isVideoItem(item) ? item.src : item; }
    function itemPoster(item) { return isVideoItem(item) ? (item.poster || '') : item; }

    /* ════════════════════════════════════════════════════════════════
       BUILD PORTFOLIO CARDS (home grid)
       ──────────────────────────────────────────────────────────────
       Supports:
         • Static thumbnail image (always shown)
         • Optional hover-preview video (crossfades in on card hover)
           — Add  video: 'videos/preview.mp4'  to a project object
    ════════════════════════════════════════════════════════════════ */
    function buildCards() {
      const grid = document.getElementById('cardsGrid');

      PROJECTS.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'project-card reveal';

        // ── Static thumbnail HTML ──
        const thumbImg = p.thumbnail
          ? `<img class="card-image" src="${p.thumbnail}" alt="${p.title}" onerror="this.style.display='none'">`
          : '';

        // ── Hover-preview video HTML (only if project.video is set) ──
        // CUSTOMIZE: Set  video: 'videos/your-file.mp4'  in the project object.
        // The video will fade in on hover and fade out when mouse leaves.
        const hoverVideo = p.video
          ? `<video class="card-video"
               src="${p.video}"
               muted playsinline loop preload="none"
               aria-hidden="true"></video>`
          : '';

        // ── "▶ Preview" badge shown when card is hovered (only if video exists) ──
        const videoBadge = p.video
          ? `<div class="card-video-badge">
           <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
           Preview
         </div>`
          : '';

        card.innerHTML = `
      <div class="card-thumb">
        ${thumbImg}
        ${hoverVideo}
        <div class="card-overlay"></div>
        ${videoBadge}
        <span class="card-tag">${p.category}</span>
        <span class="card-num">0${i + 1}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-desc">${p.tagline} — ${p.desc}</div>
        <div class="card-footer">
          <div class="card-tags">${p.tags.map(t => `<span class="card-badge">${t}</span>`).join('')}</div>
          <div class="card-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </div>
        </div>
      </div>`;

        // ── Wire up hover-video play/pause ──
        if (p.video) {

          const vid = card.querySelector('.card-video');

          // preload for smoother playback
          vid.load();

          card.addEventListener('mouseenter', async () => {

            if (!vid) return;

            try {

              vid.currentTime = 0;

              const playPromise = vid.play();

              if (playPromise !== undefined) {
                await playPromise;
              }

            } catch (err) {

              console.log('Video play failed:', err);

            }

          });

          card.addEventListener('mouseleave', () => {

            if (!vid) return;

            vid.pause();
            vid.currentTime = 0;

          });

        }
        card.onclick = () => openProject(p);

        grid.appendChild(card);

      });
    }
