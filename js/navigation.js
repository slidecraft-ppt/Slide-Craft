/* ════════════════════════════════════════════════════════════════
   NAVIGATION.JS
   Navigation helpers (view switching, scroll-to-section, back/home), the custom cursor, scroll effects (navbar/sticky CTA/nav indicator), and the mobile hamburger drawer.
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       NAVIGATION HELPERS
    ════════════════════════════════════════════════════════════════ */
    function navigateHome() {
      transitionTo(() => {
        showView('home');
        document.getElementById('backBtn').style.display = 'none';
        document.getElementById('stickyCTA').classList.remove('show');
        setTimeout(() => document.getElementById('portfolio-anchor').scrollIntoView({ behavior: 'smooth' }), 100);
      });
    }
    function navigateBack() {
      transitionTo(() => {
        showView('home');
        document.getElementById('backBtn').style.display = 'none';
        document.getElementById('stickyCTA').classList.remove('show');
        setTimeout(() => document.getElementById('portfolio-anchor').scrollIntoView({ behavior: 'smooth' }), 100);
      });
    }
    function scrollToSection(id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    function transitionTo(cb) {
      const pt = document.getElementById('page-transition');
      pt.className = 'entering';
      setTimeout(() => { cb(); pt.className = 'leaving'; setTimeout(() => pt.className = '', 500); }, 380);
    }
    function showView(name) {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active', 'visible'));
      const v = document.getElementById('view-' + name);
      v.classList.add('active');
      // Force a reflow so the browser registers display:block before
      // the opacity transition starts — without this the view stays invisible.
      void v.offsetHeight;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { v.classList.add('visible'); initReveal(); });
      });
    }

    /* ════════════════════════════════════════════════════════════════
       CUSTOM CURSOR
    ════════════════════════════════════════════════════════════════ */
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }, 50);
    });

    /* ════════════════════════════════════════════════════════════════
       SCROLL EFFECTS (navbar + sticky CTA + nav indicator)
    ════════════════════════════════════════════════════════════════ */

    /* Move the indicator pill to sit under the currently-active nav link */
    function updateNavIndicator() {
      const isHome = document.getElementById('view-home').classList.contains('active');
      const indicator = document.getElementById('navIndicator');
      const navLinks = document.getElementById('navLinks');
      if (!indicator || !navLinks) return;

      if (!isHome) {
        indicator.classList.remove('visible');
        return;
      }

      const sections = [
        { id: 'portfolio-anchor', section: 'portfolio-anchor' },
        { id: 'why-anchor', section: 'why-anchor' },
        { id: 'pricing-anchor', section: 'pricing-anchor' },
        { id: 'testimonials-anchor', section: 'testimonials-anchor' },
        { id: 'faq-anchor', section: 'faq-anchor' },
        { id: 'contact-anchor', section: 'contact-anchor' },
      ];

      const scrollY = window.scrollY + 60; // offset for fixed nav height
      let activeSection = null;

      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollY) activeSection = s.section;
      }

      if (!activeSection) {
        indicator.classList.remove('visible');
        return;
      }

      const activeLink = navLinks.querySelector(`[data-section="${activeSection}"]`);
      if (!activeLink) { indicator.classList.remove('visible'); return; }

      const navRect = navLinks.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      indicator.style.left = (linkRect.left - navRect.left) + 'px';
      indicator.style.width = linkRect.width + 'px';
      indicator.classList.add('visible');
    }

    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      nav.style.background = window.scrollY > 50
        ? 'rgba(245,237,224,0.95)'
        : 'rgba(245,237,224,0.8)';
      if (document.getElementById('view-home').classList.contains('active')) {
        document.getElementById('stickyCTA').classList.toggle('show', window.scrollY > 400);
      }
      updateNavIndicator();
    });

    /* ════════════════════════════════════════════════════════════════
       MOBILE HAMBURGER DRAWER
    ════════════════════════════════════════════════════════════════ */
    function toggleDrawer() {
      const drawer = document.getElementById('navDrawer');
      const hamburger = document.getElementById('navHamburger');
      const isOpen = drawer.classList.contains('open');
      drawer.classList.toggle('open', !isOpen);
      hamburger.classList.toggle('open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function drawerNav(sectionId) {
      toggleDrawer();
      // Small delay so drawer closes before scroll fires
      setTimeout(() => {
        const homeView = document.getElementById('view-home');
        if (!homeView.classList.contains('active')) {
          transitionTo(() => {
            showView('home');
            document.getElementById('backBtn').style.display = 'none';
            document.getElementById('stickyCTA').classList.remove('show');
            setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 150);
          });
        } else {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 320);
    }
