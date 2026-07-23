/* ════════════════════════════════════════════════════════════════
   UI-INTERACTIONS.JS
   Small shared UI behaviors: scroll-reveal animations, the hex-to-rgb color helper, testimonials drag-to-scroll, and FAQ accordion toggling.
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       SCROLL REVEAL (intersection observer)
    ════════════════════════════════════════════════════════════════ */
    function initReveal() {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
      }, { threshold: 0.08 });
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => obs.observe(el));
    }

    /* ════════════════════════════════════════════════════════════════
       UTILITY: hex color → "r,g,b" string for rgba() usage
    ════════════════════════════════════════════════════════════════ */
    function hexToRgb(hex) {
      const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : null;
    }

    /* ════════════════════════════════════════════════════════════════
       TESTIMONIALS DRAG-TO-SCROLL
    ════════════════════════════════════════════════════════════════ */
    (function () {
      const track = document.getElementById('testiTrack');
      if (!track) return;
      let isDown = false, startX, scrollLeft;
      track.addEventListener('mousedown', e => {
        isDown = true;
        track.style.userSelect = 'none';
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });
      document.addEventListener('mouseup', () => { isDown = false; track.style.userSelect = ''; });
      track.addEventListener('mouseleave', () => { isDown = false; });
      track.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        track.scrollLeft = scrollLeft - (x - startX) * 1.2;
      });
    })();

    /* ════════════════════════════════════════════════════════════════
       FAQ TOGGLE
    ════════════════════════════════════════════════════════════════ */
    function toggleFaq(item) {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    }

