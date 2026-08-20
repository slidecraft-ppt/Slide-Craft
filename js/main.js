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

  /* NOTE: the loading-screen background video and its canplay/error
     wiring have been removed — the loading screen is now a static
     logo + progress bar only (see index.html / css/loading-screen.css). */
}

/* ════════════════════════════════════════════════════════════════
   INIT — runs on page load
════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* Lock scroll while the loading screen covers the page — otherwise
     any wheel/touch/keyboard scroll during the 3s intro silently
     advances the pinned hero ScrollTrigger behind it, so by the time
     the loading screen fades out you're dropped mid/end-animation
     instead of seeing the icon fountain play from the start. */
  document.body.style.overflow = 'hidden';

  buildCards();
  buildWhy();
  buildPricingGrid(PPT_PRICING, 'ppt-pricing-grid');
  buildPricingGrid(PROJECT_PRICING, 'arduino-pricing-grid');
  showView('home');
  initStaticEventWiring();

  /* The grids just built add a lot of height below the hero pin —
     resync ScrollTrigger's start/end distances now that the real
     document height is known (hero-animation.js calculated them
     earlier, before this content existed). */
  if (window.ScrollTrigger) ScrollTrigger.refresh();

  setTimeout(() => {
    const ls = document.getElementById('loading-screen');

    // Reset scroll BEFORE removing the overflow lock — the lock's
    // removal is itself a layout shift (scrollbar reappears, 100vh
    // values get re-measured), which can cause scroll-anchoring to
    // jump us into the middle of the pinned hero range.
    window.scrollTo(0, 0);
    document.body.style.overflow = '';
    if (ls) ls.classList.add('hidden');

    // Re-assert scroll position + resync ScrollTrigger once that
    // layout shift has actually finished settling.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });
    // main.js — inside the setTimeout, in the final rAF
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        if (window.__heroAnimReset) window.__heroAnimReset(); // <-- belt & suspenders
      });
    });
  }, 3000);
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizePinWrap, 150);
  });
});