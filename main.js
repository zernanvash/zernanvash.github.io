/* ═══════════════════════════════════════════════
   ZERNAN VASH ARIVE — PORTFOLIO SCRIPTS
   zernanvash.dev
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── BOOT SCREEN ── */
  const boot = document.getElementById('boot');
  function dismissBoot() {
    if (!boot) return;
    boot.style.opacity = '0';
    setTimeout(() => { boot.style.display = 'none'; }, 650);
  }
  setTimeout(dismissBoot, 2800);
  document.addEventListener('keydown', dismissBoot, { once: true });
  document.addEventListener('click', function bootClick() {
    dismissBoot();
    document.removeEventListener('click', bootClick);
  });

  /* ── LIVE CLOCK ── */
  const clockEl = document.getElementById('clock');
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  /* ── TYPEWRITER ANIMATION ── */
  const words = [
    "BS Computer Science Student",
    "DOST-SEI Merit Scholar",
    "Backend Software Engineer",
    "Game Developer & Visual Creator"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingEl = document.getElementById('typing-text');
  
  function type() {
    if (!typingEl) return;
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 30 : 60;
    
    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before starting next word
    }
    
    setTimeout(type, typeSpeed);
  }
  setTimeout(type, 3000); // Start typing after boot finishes

  /* ── SMOOTH NAV SCROLL ── */
  document.querySelectorAll('.nav-link, .nav-dir-link, .mobile-nav-link, .scroll-down-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = 60; // top-nav height
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* ── MOBILE NAV MENU TOGGLE ── */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobilePanel = document.getElementById('mobile-panel');
  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobilePanel.style.display = isExpanded ? 'none' : 'flex';
    });
    
    // Close panel on link click
    mobilePanel.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobilePanel.style.display = 'none';
      });
    });
  }

  /* ── FLOATING VIEWPORT CONTROLS ── */
  const btnTop = document.getElementById('btn-scroll-top');
  const btnBottom = document.getElementById('btn-scroll-bottom');
  const btnScanlines = document.getElementById('btn-toggle-scanlines');
  const scanlinesOverlay = document.getElementById('scan-lines');

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (btnBottom) {
    btnBottom.addEventListener('click', () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });
  }

  if (btnScanlines && scanlinesOverlay) {
    btnScanlines.addEventListener('click', () => {
      scanlinesOverlay.classList.toggle('disabled');
      if (scanlinesOverlay.classList.contains('disabled')) {
        btnScanlines.style.borderColor = 'var(--orange-dim)';
        btnScanlines.style.color = 'var(--orange)';
      } else {
        btnScanlines.style.borderColor = 'var(--blue-dim)';
        btnScanlines.style.color = 'var(--blue)';
      }
    });
  }

  /* ── SECTION FADE-IN ON SCROLL ── */
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(s => {
    s.style.transform = 'translateY(18px)';
    s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(s);
  });

  /* ── PROJECT FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, border-color 0.2s, box-shadow 0.2s';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── CONTACT FORM → MAILTO ── */
  const sendBtn = document.getElementById('send-btn');
  const formStatus = document.getElementById('form-status');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name    = document.getElementById('cf-name')?.value.trim() || '';
      const message = document.getElementById('cf-msg')?.value.trim() || '';

      if (!message) {
        if (formStatus) {
          formStatus.textContent = '> ERROR: message field empty.';
          setTimeout(() => { formStatus.textContent = ''; }, 2500);
        }
        return;
      }

      const subject = encodeURIComponent('Portfolio inquiry — Zernan Vash Arive');
      const body    = encodeURIComponent((name ? name + '\n\n' : '') + message);
      window.location.href = `mailto:zernanvasharive16@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.textContent = '> OK: opening mail client...';
        setTimeout(() => { formStatus.textContent = ''; }, 2500);
      }
    });
  }

  /* ── ACTIVE NAV HIGHLIGHT ON SCROLL ── */
  const navLinks = document.querySelectorAll('.nav-link, .nav-dir-link, .mobile-nav-link');
  const sectionIds = ['intro', 'about', 'skills', 'projects', 'events', 'awards', 'contact'];

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(btn => {
          const href = btn.getAttribute('href');
          if (href) {
            btn.classList.toggle('active', href === `#${id}`);
          }
        });
      }
    });
  }, { threshold: 0.15 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) navObs.observe(el);
  });

})();
