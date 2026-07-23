/* ════════════════════════════════════════════════════════════════
   MAIN.JS
   Wires up all data-action attributes from the static HTML (replacing old inline onclick/onsubmit/onerror handlers) and runs page initialization on DOMContentLoaded. Load this file last.
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       STATIC MARKUP EVENT WIRING
       Replaces the onclick / onsubmit / onerror attributes that used
       to live directly in index.html. Static elements are wired up
       declaratively via a single data-action="type:param" attribute,
       dispatched here through one delegated click listener.
    ════════════════════════════════════════════════════════════════ */
    function initStaticEventWiring() {
      /* Delegated click handling for any element carrying data-action */
      document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-action]');
        if (!el) return;
        const [action, param] = el.dataset.action.split(':');
        switch (action) {
          case 'home': navigateHome(); break;
          case 'back': navigateBack(); break;
          case 'scroll': scrollToSection(param); break;
          case 'wa': openWA(param); break;
          case 'wa-drawer': openWA(param); toggleDrawer(); break;
          case 'drawer-toggle': toggleDrawer(); break;
          case 'drawer-nav': drawerNav(param); break;
          case 'faq-toggle': toggleFaq(el); break;
        }
      });

      /* Contact form → WhatsApp submit (was onsubmit="handleFormSubmit(event)") */
      const contactForm = document.getElementById('contactForm');
      if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);

      /* Loading screen logo: fall back to text logo if the image fails
         to load (was an inline onerror="..." handler) */
      const loaderLogoImg = document.getElementById('loaderLogoImg');
      if (loaderLogoImg) {
        loaderLogoImg.addEventListener('error', () => {
          loaderLogoImg.style.display = 'none';
          const fallback = document.querySelector('.loader-logo-fallback');
          if (fallback) fallback.classList.add('visible');
        });
      }
    }

    /* ════════════════════════════════════════════════════════════════
       INIT — runs on page load
    ════════════════════════════════════════════════════════════════ */
    document.addEventListener('DOMContentLoaded', () => {
      buildCards();
      buildWhy();
      buildPricingGrid(PPT_PRICING, 'ppt-pricing-grid');
      buildPricingGrid(PROJECT_PRICING, 'arduino-pricing-grid');
      showView('home');
      initStaticEventWiring();

      /* ── Loading screen: hide after 1 second ── */
      setTimeout(() => {
        const ls = document.getElementById('loading-screen');
        if (ls) ls.classList.add('hidden');
      }, 1100);
    });

