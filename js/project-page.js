/* ════════════════════════════════════════════════════════════════
   PROJECT-PAGE.JS
   Renders an individual project's detail page: hero showcase panels, related projects, and the main project page renderer (openProject).
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       HERO SHOWCASE (floating panels on the project page)
    ════════════════════════════════════════════════════════════════ */
    function buildHeroShowcase(p) {
      const items = p.showcase || [];
      const mainItem = items[0] || null;
      const leftItem = items[1] || null;
      const rightItem = items[2] || items[0] || null;

      // Render a panel — supports image or video
      const panelMedia = (item, letter, sub) => {
        if (!item) {
          return `<div class="showcase-panel-placeholder"><div class="sp-letter">${letter}</div><div class="sp-sub">${sub}</div></div>`;
        } else if (isVideoItem(item)) {
          return `<video src="${item.src}" ${item.poster ? `poster="${item.poster}"` : ''} muted loop autoplay playsinline style="width:100%;height:100%;object-fit:cover"></video>`;
        } else {
          return `<img src="${item}" alt="${p.title}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">
              <div class="showcase-panel-placeholder" style="display:none"><div class="sp-letter">${letter}</div><div class="sp-sub">${sub}</div></div>`;
        }
      };

      const particles = Array.from({ length: 12 }, (_, i) => {
        const size = 2 + Math.random() * 3;
        const left = 10 + Math.random() * 80;
        const dur = 4 + Math.random() * 6;
        const delay = Math.random() * 5;
        const drift = (Math.random() - 0.5) * 60;
        const col = Math.random() > 0.5 ? 'rgba(184,134,11,0.5)' : 'rgba(192,57,43,0.4)';
        return `<div class="proj-showcase-particle" style="width:${size}px;height:${size}px;left:${left}%;bottom:5%;background:${col};animation-duration:${dur}s;animation-delay:${delay}s;--drift:${drift}px"></div>`;
      }).join('');

      return `
  <div class="proj-showcase">
    <div class="showcase-ambient"></div>
    <div class="proj-showcase-particles">${particles}</div>
    <div class="proj-showcase-inner">
      <div class="showcase-panel-wrap">
        <div class="showcase-panel float-left">${panelMedia(leftItem, p.title.charAt(0), 'Detail')}</div>
        <div class="showcase-panel main-panel">${panelMedia(mainItem, p.title.charAt(0), p.tagline)}</div>
        <div class="showcase-panel float-right">${panelMedia(rightItem, p.title.charAt(0), 'Preview')}</div>
      </div>
      <div class="showcase-caption">
        <div class="showcase-caption-title">${p.title}</div>
        <div class="showcase-caption-tag">${p.tagline} — ${p.category}</div>
      </div>
    </div>
  </div>`;
    }

    /* ════════════════════════════════════════════════════════════════
       RELATED PROJECTS
    ════════════════════════════════════════════════════════════════ */
    function buildRelatedProjects(p) {
      const related = PROJECTS
        .filter(r => !(r.id === p.id && r.title === p.title))
        .filter(r => r.category === p.category || r.tags.some(t => p.tags.includes(t)))
        .slice(0, 3);
      if (!related.length) return '';

      const cards = related.map(r => {
        const thumbEl = r.thumbnail
          ? `<img class="related-thumb-img" src="${r.thumbnail}" alt="${r.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : '';
        return `
    <div class="related-card" onclick="openProject(${JSON.stringify(r).replace(/"/g, '&quot;')})">
      <div class="related-thumb">
        ${thumbEl}
        <div class="related-thumb-overlay"></div>
        <div class="related-thumb-placeholder" style="display:${r.thumbnail ? 'none' : 'flex'}">${r.title.charAt(0)}</div>
        <div class="related-chip">${r.category}</div>
      </div>
      <div class="related-body">
        <div class="related-title">${r.title}</div>
        <div class="related-tagline">${r.tagline}</div>
        <div class="related-footer">
          <div class="related-tags">${r.tags.slice(0, 2).map(t => `<span class="related-tag">${t}</span>`).join('')}</div>
          <div class="related-explore">Explore
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </div>
        </div>
      </div>
    </div>`;
      }).join('');

      return `
  <div class="related-section reveal">
    <div class="section-label"><span></span>You May Also Like</div>
    <h2 class="section-head">Related <em>Services</em></h2>
    <div class="related-grid">${cards}</div>
  </div>`;
    }

    /* ════════════════════════════════════════════════════════════════
       PROJECT PAGE RENDERER
    ════════════════════════════════════════════════════════════════ */
    function openProject(p) {
      transitionTo(() => {
        showView('project');
        window.scrollTo(0, 0);
        document.getElementById('backBtn').style.display = 'flex';
        setTimeout(() => document.getElementById('stickyCTA').classList.add('show'), 1000);

        document.getElementById('view-project').innerHTML = `
      <div class="proj-hero">
        <div class="proj-hero-inner">
          <div class="proj-meta">
            <span class="proj-meta-chip">${p.category}</span>
            ${p.tags.map(t => `<span class="proj-meta-chip">${t}</span>`).join('')}
          </div>
          <h1 class="proj-title">${p.title}</h1>
          <p class="proj-tagline">${p.tagline} — ${p.desc}</p>
        </div>
      </div>

      ${buildHeroShowcase(p)}

      <div class="proj-section reveal">
        <h2>What's Included</h2>
        <div class="info-box">
          ${p.deliverables.map((d, i) => `
            <div class="info-box-item">
              <div class="info-box-num">0${i + 1}</div>
              <div class="info-box-label">${d}</div>
              <div class="info-box-text"></div>
            </div>
            ${i < p.deliverables.length - 1 ? '<div class="info-box-divider"></div>' : ''}
          `).join('')}
        </div>
      </div>

      <div class="proj-section reveal">
        <h2>Key Features</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem">
          ${p.features.map(f => `
            <div style="padding:1.2rem 1.4rem;background:var(--glass);border:1px solid var(--border);border-radius:6px;display:flex;gap:.75rem;align-items:flex-start">
              <span style="color:${p.color};font-size:.65rem;margin-top:.25rem">◆</span>
              <span style="font-size:.85rem;color:var(--text);font-weight:400">${f}</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="proj-section reveal">
        <h2>How It Works</h2>
        <div style="display:flex;gap:0;flex-wrap:wrap;background:var(--glass);border:1px solid var(--border);border-radius:6px;overflow:hidden">
          ${['Brief & Discovery', 'Design & Creation', 'Review & Revisions', 'Final Delivery'].map((step, i) => `
            <div style="flex:1;min-width:160px;padding:1.75rem;${i < 3 ? 'border-right:1px solid var(--border)' : ''}">
              <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:600;color:${p.color};opacity:.22;margin-bottom:.5rem">0${i + 1}</div>
              <div style="font-weight:500;font-size:.88rem;margin-bottom:.3rem;color:var(--navy)">${step}</div>
              <div style="font-size:.78rem;color:var(--muted);line-height:1.6;font-weight:300"></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="proj-divider"></div>

      ${buildShowcaseGallery(p)}

      <div class="proj-divider"></div>

      ${buildRelatedProjects(p)}

      <div class="proj-divider" style="margin-bottom:0"></div>

      <div style="padding:3rem">
        <div class="cta-banner reveal">
          <div class="section-label" style="justify-content:center;margin-bottom:1rem"><span></span>Order Now</div>
          <h2>Love This <em style="color:${p.color};font-family:'Cormorant Garamond',serif;font-style:italic">Style?</em></h2>
          <p>Get your own ${p.title}-calibre deck crafted with the same level of precision and artistry.</p>
          <div class="cta-btns">
            <button class="btn-primary" style="background:${p.color};box-shadow:0 4px 20px ${p.color}33" onclick="openWA('project-cta-${p.id}')">Order on WhatsApp →</button>
            <button class="btn-ghost" onclick="navigateBack()">View All Projects</button>
          </div>
        </div>
      </div>

      <footer style="border-top:1px solid var(--border);padding:2rem 3rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <div style="font-family:'Cinzel',serif;font-size:1rem;font-weight:600;cursor:pointer;letter-spacing:.06em" onclick="navigateHome()">SLIDE<span style="color:var(--accent)">CRAFT</span></div>
        <a style="color:var(--muted);font-size:.82rem;text-decoration:none;cursor:pointer" onclick="navigateBack()">← Back to Portfolio</a>
        <p style="color:var(--muted);font-size:.75rem">© 2025 SlideCraft</p>
      </footer>`;

        // After HTML is injected, wire up the media slider
        setTimeout(() => initSlider(p), 0);
      });
    }

