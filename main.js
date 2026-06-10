/* =====================================================
   NEOCODE — MAIN JS
   ===================================================== */

/* ---------- 1. MATRIX CANVAS ANIMATION ---------- */
(function initMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chars = 'NeoCode01アイウエオカキクケコサシスセソPYTHONJAVASCRIPTRUSTGOCLOUD{}[]</>+=*#$@%';
  const cols = [];
  let animFrame;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor(canvas.width / 20);
    cols.length = 0;
    for (let i = 0; i < count; i++) {
      cols.push(Math.random() * -canvas.height / 16);
    }
  }

  const COLORS = ['#FFE600', '#9B5CF6', '#00FF9D', '#FF2D55'];

  function draw() {
    ctx.fillStyle = 'rgba(13,13,26,0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '13px "Courier New", monospace';

    for (let i = 0; i < cols.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.55;
      ctx.fillText(char, i * 20, cols[i] * 16);
      ctx.globalAlpha = 1;

      if (cols[i] * 16 > canvas.height && Math.random() > 0.975) {
        cols[i] = 0;
      }
      cols[i] += 0.5;
    }
    animFrame = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);

  // Pause animation when tab not visible (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animFrame);
    else draw();
  });
})();


/* ---------- 2. NAVBAR SCROLL EFFECT ---------- */
(function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ---------- 3. SANDWICH MENU (Courses hover/click) ---------- */
(function initSandwich() {
  const trigger   = document.getElementById('coursesDropdown');
  const toggle    = document.getElementById('coursesToggle');
  const panel     = document.getElementById('sandwichPanel');
  if (!trigger || !panel) return;

  let closeTimer = null;

  function openPanel() {
    clearTimeout(closeTimer);
    panel.classList.add('show');
    trigger.classList.add('open');
  }

  function closePanel() {
    closeTimer = setTimeout(() => {
      panel.classList.remove('show');
      trigger.classList.remove('open');
    }, 150);
  }

  // Hover behaviour (desktop)
  trigger.addEventListener('mouseenter', openPanel);
  trigger.addEventListener('mouseleave', closePanel);
  panel.addEventListener('mouseenter', openPanel);
  panel.addEventListener('mouseleave', closePanel);

  // Click toggle (mobile / keyboard)
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    panel.classList.contains('show') ? closePanel() : openPanel();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('show');
      trigger.classList.remove('open');
    }
  });

  // Close when clicking a sandwich link
  panel.querySelectorAll('.sandwich-item').forEach(item => {
    item.addEventListener('click', () => {
      panel.classList.remove('show');
      trigger.classList.remove('open');
    });
  });
})();


/* ---------- 4. SMOOTH SCROLL for nav links ---------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile navbar
      const navCollapse = document.getElementById('navbarMain');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
})();


/* ---------- 5. SCROLL-TO-TOP BUTTON ---------- */
(function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ---------- 6. SCROLL REVEAL ---------- */
(function initReveal() {
  // Add reveal class to target sections
  const targets = document.querySelectorAll(
    '.feat-card, .course-card, .review-card, .av-card, .section-label, .section-title, .about-text'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on element's order within parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 70}ms`;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
})();


/* ---------- 7. COUNTER ANIMATION ---------- */
(function initCounters() {
  const counters = document.querySelectorAll('.hstat-num');
  if (!counters.length) return;

  let started = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target.toLocaleString('ru');
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString('ru');
        }
      }, 16);
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        runCounters();
        io.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) io.observe(heroStats);
})();


/* ---------- 8. ACTIVE NAV LINK (scroll spy) ---------- */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sTop = section.offsetTop - 120;
      if (window.scrollY >= sTop) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${current}`) link.classList.add('active');
    });
  }, { passive: true });
})();
