/* ════════════════════════════════════════════════════════════════
   CONFIG.JS
   Global site configuration: WhatsApp number and slider/media settings. Edit these constants to reconfigure the site.
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       SITE CONFIGURATION
    ════════════════════════════════════════════════════════════════ */

    // CUSTOMIZE: Replace with your WhatsApp number (country code + number, no + sign)
    const WA_NUMBER = '919998329419';
    const WA_BASE = `https://wa.me/${WA_NUMBER}?text=`;

    /* ════════════════════════════════════════════════════════════════
       SLIDER CONFIGURATION
       ──────────────────────────────────────────────────────────────
       CUSTOMIZE: Tweak these global slider/media settings.
    ════════════════════════════════════════════════════════════════ */
    const SLIDER_AUTOPLAY = false;  // set true to enable slide autoplay
    const SLIDER_AUTOPLAY_MS = 4500;   // autoplay interval in milliseconds
    const PARALLAX_STRENGTH = 12;     // px of parallax shift on mouse move
    const SLIDER_LOOP = true;   // infinite loop when navigating past last

