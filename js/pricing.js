/* ════════════════════════════════════════════════════════════════
   PRICING.JS
   Builds the pricing card grids (both Presentation and Arduino tiers).
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       BUILD PRICING CARDS
    ════════════════════════════════════════════════════════════════ */
    function buildPricingGrid(data, gridId) {
      const grid = document.getElementById(gridId);

      data.forEach(p => {
        const el = document.createElement('div');

        el.className =
          `pricing-card reveal${p.featured ? ' featured' : ''}`;

        el.innerHTML = `
      ${p.featured ? '<div class="pricing-badge">Most Popular</div>' : ''}
      <div class="pricing-tier">${p.tier}</div>
      <div class="pricing-price">${p.price}</div>
      <div class="pricing-desc">${p.desc}</div>

      <ul class="pricing-features">
        ${p.features.map(f =>
          `<li><span class="pricing-check">◆</span>${f}</li>`
        ).join('')}
      </ul>

      <button class="cta-learnmore" onclick="openWA('pricing-${p.tier.replace(/\s+/g, '-').toLowerCase()}')">
        <span class="circle" aria-hidden="true">
          <span class="icon arrow"></span>
        </span>
        <span class="button-text">Get Started</span>
      </button>
    `;

        grid.appendChild(el);
      });
    }

