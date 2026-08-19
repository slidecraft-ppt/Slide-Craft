/* ════════════════════════════════════════════════════════════════
   WHY.JS
   Builds the "Why SlideCraft" cards grid.
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       BUILD WHY-US CARDS
    ════════════════════════════════════════════════════════════════ */
    function buildWhy() {
      const grid = document.getElementById('whyGrid');
      WHY_CARDS.forEach(w => {
        const el = document.createElement('div');
        el.className = 'why-card reveal';
        el.innerHTML = `
    
      <div class="why-title">${w.title}</div>
      <div class="why-desc">${w.desc}</div>`;
        grid.appendChild(el);
      });
    }


