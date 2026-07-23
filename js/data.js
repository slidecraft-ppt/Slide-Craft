/* ════════════════════════════════════════════════════════════════
   DATA.JS
   All editable content data: portfolio PROJECTS, WHY_CARDS, and pricing tiers (PPT_PRICING / PROJECT_PRICING).
════════════════════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════════════════════
       PROJECTS DATA
       ──────────────────────────────────────────────────────────────
       CUSTOMIZE: Edit this array to add/remove projects.
    
       Each project object has these fields:
       ─────────────────────────────────────
       id          — string, used in WhatsApp messages & related matching
       title       — displayed name of the project
       thumbnail   — path to the card thumbnail image (relative to HTML)
       video       — (OPTIONAL) path to an mp4 video; shown on card hover
                     e.g.  video: 'videos/my-ppt-preview.mp4'
                     Leave out or set to '' to show no video on the card.
       tagline     — short one-line subtitle
       category    — shown as the category chip (top-left of card)
       desc        — paragraph description of the project
       tags        — array of short tag labels shown on the card
       color       — primary accent color for this project page
       color2      — darker version of the accent (unused currently)
       bg          — rgba background for decorative elements
       deliverables— array of 4 deliverable labels (project page)
       features    — array of feature bullet points (project page)
       showcase    — array of media items for the project page slider.
                     ─────────────────────────────────────────────────
                     Each item can be:
                       • A string path to an IMAGE: 'images/foo.png'
                       • An OBJECT for a VIDEO:
                         {
                           type: 'video',
                           src:  'videos/foo.mp4',
                           poster: 'images/foo-poster.jpg'  ← optional
                         }
                     ─────────────────────────────────────────────────
                     Mix images and videos freely in the array.
                     Example:
                       showcase: [
                         'images/slide1.png',
                         { type:'video', src:'videos/demo.mp4', poster:'images/poster.jpg' },
                         'images/slide3.png',
                       ]
    ════════════════════════════════════════════════════════════════ */
    const PROJECTS = [
      {
        id: 'PPT',
        title: 'College Presentations',
        thumbnail: 'images/PPT.png',
        // CUSTOMIZE: Add a hover-preview video for this card:
        // video: 'videos/ppt-preview.mp4',
        video: '',
        tagline: 'Present Ideas That Get Remembered',
        category: 'Presentation',
        desc: 'Professional PPT presentations with modern visuals, clean layouts, animations, and impactful storytelling.',
        tags: ['Professional', 'Modern Slides', 'Animations'],
        color: '#c0392b', color2: '#962d22', bg: 'rgba(192,57,43,0.08)',
        deliverables: ['PowerPoint + PDF files', 'Custom slide designs', 'Animated transitions', 'Presentation assets'],
        features: ['Modern slide layouts', 'Infographics & charts', 'Animations & transitions', 'Professional storytelling'],
        // CUSTOMIZE: Add images and/or videos to the slider below.
        // Mix types freely — images shown as <img>, videos as <video>.
        showcase: [
          //'images/PPT.png',
          // Example video slide — uncomment and set your path:
          // { type: 'video', src: 'videos/ppt-showcase.mp4', poster: 'images/PPT.png' },
          { type: 'video', src: 'videos/PPT/ParkinngGate.mp4', poster: 'images/PPT/ParkinngGate.png' },
          { type: 'video', src: 'videos/PPT/macOStemplate.mp4', poster: 'images/PPT/macOS.png' },
          { type: 'video', src: 'videos/PPT/LiquidGlassV2.0.mp4', poster: 'images/PPT/LQGLV2.png' },
          { type: 'video', src: 'videos/PPT/LaserSecuritySystem.mp4', poster: 'images/PPT/LaserSecuritySystem.png' },
          { type: 'video', src: 'videos/PPT/wockhart.mp4', poster: 'images/PPT/wockhart.png' },
          { type: 'video', src: 'videos/PPT/Chandrayan.mp4', poster: 'images/PPT/Chandrayan.png' },
        ]
      },
      {
        id: 'Tech Service',
        title: 'Arduino Projects',
        thumbnail: 'images/Arduino.png',
        // CUSTOMIZE: Add a hover video for this card:
        // video: 'videos/arduino-preview.mp4',
        video: '',
        tagline: 'Where Innovation Meets Real-World Circuits',
        category: 'Technical',
        desc: 'Custom Arduino and embedded system projects with coding, circuit design, and hardware integration.',
        tags: ['Embedded Systems', 'Coding', 'Hardware'],
        color: '#1d2d44', color2: '#152233', bg: 'rgba(29,45,68,0.08)',
        deliverables: ['Circuit diagrams', 'Arduino source code', 'Project documentation', 'Component list'],
        features: ['Circuit design', 'Embedded coding', 'Sensor integration', 'Hardware prototyping'],
        showcase: [
          'images/Arduino.png',
          'images/Arduino/RFID3.jpg',
          'images/Arduino/RFID.png',
          'images/Arduino/RFID1.jpg',
          'images/Arduino/FSG.jpeg',
          'images/Arduino/FOOTSTEPGEN.png',
          'images/Arduino/Picture1.jpg',
        ]
      },
      {
        id: 'Design Service',
        title: 'Website Design',
        thumbnail: 'images/Site.png',
        // CUSTOMIZE: Add a hover video for this card:
        // video: 'videos/fest-preview.mp4',
        video: '',
        tagline: 'Websites That Capture Attention Instantly.',
        category: 'Design',
        desc: 'Custom modern websites with responsive layouts, premium visuals, and smooth user experience across all devices.',
        tags: ['Responsive', 'Modern UI', 'Interactive'],
        color: '#b8860b', color2: '#8b6508', bg: 'rgba(184,134,11,0.08)',
        deliverables: ['Complete website UI', 'Responsive HTML/CSS', 'Optimized assets', 'Deployment-ready files'],
        features: ['Smooth animations', 'Custom sections', 'SEO-friendly structure', 'Fast-loading pages'],
        showcase: [
          'images/Site.png',
          // CUSTOMIZE: Replace with a real video slide:
          { type: 'video', src: 'videos/Website/Slidecraft.mp4', poster: 'images/Site.png' },

        ]
      },
      {
        id: 'Academic',
        title: 'Final Year Project Report',
        thumbnail: 'images/Report.png',
        video: '',
        tagline: 'Professional Reports, Clearly Delivered.',
        category: 'Academics',
        desc: 'Well-structured academic and business reports with polished formatting and premium layouts.',
        tags: ['Structured', 'Clean Layout', 'Professional'],
        color: '#5a7a4a', color2: '#3d5c33', bg: 'rgba(90,122,74,0.08)',
        deliverables: ['Formatted report PDF', 'Editable DOCX file', 'Charts & tables', 'Print-ready layout'],
        features: ['Structured formatting', 'Clean typography', 'Charts & tables', 'Professional documentation'],
        showcase: [
          'images/Report.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-01.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-02.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-03.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-04.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-05.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-06.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-07.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-08.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-09.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-10.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-11.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-12.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-13.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-14.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-15.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-16.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-17.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-18.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-19.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-20.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-21.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-22.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-23.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-24.png',
          'images/RFID_Attendance_Report/RFID_Attendance_Report-25.png',
        ]
      },
      {
        id: 'Design Service',
        title: 'Restaurant Menu Card',
        thumbnail: 'images/Menu.png',
        video: '',
        tagline: 'Menus Crafted to Tempt at First Glance.',
        category: 'Design',
        desc: 'Elegant and modern menu designs crafted to enhance customer experience and brand appeal.',
        tags: ['Restaurant Branding', 'Elegant', 'Premium'],
        color: '#7b5ea7', color2: '#5c4080', bg: 'rgba(123,94,167,0.08)',
        deliverables: ['Menu card layouts', 'Print-ready PDF', 'Editable design source', 'Digital menu version'],
        features: ['Premium layouts', 'Food showcase sections', 'Elegant typography', 'Restaurant branding'],
        showcase: [
          'images/menu1.png',
          'images/menu2.png',
          'images/menu3.png',
          'images/menu4.png',
          'images/menu5.png',
        ]
      },
      {
        id: 'Branding',
        title: 'Startup Logo & Brand Identity',
        thumbnail: 'images/Logo.png',
        video: '',
        tagline: 'Brands Built to Lead.',
        category: 'Branding',
        desc: 'Unique and memorable logo designs tailored to reflect your startups vision and identity. Complete branding solutions including colors, typography, brand assets, and visual identity systems.',
        tags: ['Minimal', 'Memorable', 'Brand Identity', 'Brand Strategy', 'Visual System', 'Premium'],
        color: '#2980b9', color2: '#1a6090', bg: 'rgba(41,128,185,0.08)',
        deliverables: ['Brand guideline PDF', 'Typography system', 'Social media kit', 'Brand asset package', 'Logo PNG files', 'Transparent logo pack', 'Color variations'],
        features: ['Custom logo concepts', 'Minimal brand marks', 'Color palette selection', 'Scalable vector design', 'Typography system', 'Social media assets', 'Complete visual identity'],
        showcase: [

          'images/LOGO/Logo1.png',
          { type: 'video', src: 'videos/logo/outro.mp4', poster: 'images/LOGO/Logo1.png' },
          'images/LOGO/Tanwar Construction01.jpg',
          'images/LOGO/Tanwar Construction13.jpg',
          'images/LOGO/Tanwar Construction10.jpg',
        ]
      },
    ];

    /* ════════════════════════════════════════════════════════════════
       WHY US CARDS DATA
       CUSTOMIZE: Edit these 6 cards to describe your strengths.
    ════════════════════════════════════════════════════════════════ */
    const WHY_CARDS = [
      { icon: '✦', title: 'Strategic Clarity', desc: 'Every slide has a purpose. We structure your story for maximum impact and comprehension.' },
      { icon: '◈', title: 'Refined Aesthetics', desc: 'Beautiful, intentional design that reflects the quality of your brand and thinking.' },
      { icon: '◎', title: 'Fast Turnaround', desc: 'Professional results delivered within 48 hours without sacrificing an ounce of quality.' },
      { icon: '◇', title: 'Unlimited Revisions', desc: 'We iterate until every detail is precisely right. Your satisfaction is our benchmark.' },
      { icon: '▣', title: 'Bespoke for You', desc: 'No templates. Every deck is designed from scratch, tailored to your unique goals.' },
      { icon: '⬡', title: 'Ongoing Support', desc: 'Post-delivery guidance and editable source files so you can adapt decks with ease.' },
    ];

    /* ════════════════════════════════════════════════════════════════
       PRICING DATA
       CUSTOMIZE: Edit tiers, prices, features. Mark one as featured.
    ════════════════════════════════════════════════════════════════ */
    const PPT_PRICING = [
      {
        tier: 'Essential', price: '₹199', featured: false,
        desc: 'Perfect for focused, high-impact pitches.',
        features: ['Up to 10 slides', '2 revision rounds', 'PDF + PPTX', '1 custom colour scheme'],
      },
      {
        tier: 'Professional', price: '₹299', featured: true, /* CUSTOMIZE: set featured:true on your preferred plan */
        desc: 'Our most popular option for ambitious projects.',
        features: ['Up to 20 slides', 'Unlimited revisions', 'PDF + PPTX + Keynote', 'Custom illustration set', 'Data visualisation pack'],
      },
      {
        tier: 'Enterprise', price: '₹499', featured: false,
        desc: 'Comprehensive solutions for major presentations.',
        features: ['Including Ess. & Pro.', 'Unlimited slides', 'Dedicated designer', 'All formats included', 'Priority WhatsApp support'],
      }
    ]
    const PROJECT_PRICING = [
      {
        tier: 'Mini Project',
        price: '₹499',
        featured: false,
        desc: 'Suitable for first-year and diploma projects.',
        features: [
          'Ready-made Arduino project',
          'Source code included',
          'Circuit diagram',
          'Basic documentation',
          'Development charges only. Components billed separately.'
        ],
      },
      {
        tier: 'Academic Project',
        price: '₹999',
        featured: true,
        desc: 'Designed for college submissions and exhibitions. ',
        features: [
          'Custom project development',
          'Multiple sensors/modules',
          'Project report',
          'PPT for presentation',
          'Code explanation support',
          'Development charges only. Components billed separately.'
        ],
      },
      {
        tier: 'Competition Project',
        price: '₹1999+',
        featured: false,
        desc: 'Advanced projects for competitions and innovation challenges.',
        features: [
          'Custom hardware solution',
          'IoT integration',
          'Detailed documentation',
          'Testing & debugging',
          'Priority support',
          'Project optimization',
          'Development charges only. Components billed separately.'
        ],
      },
    ];


