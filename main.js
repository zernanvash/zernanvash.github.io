/* ═══════════════════════════════════════════════
   ZERNAN VASH ARIVE — PORTFOLIO SCRIPTS (REDESIGN)
   zernanvash.dev
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── BOOT SCREEN ── */
  const boot = document.getElementById('boot');
  function dismissBoot() {
    if (!boot) return;
    boot.style.opacity = '0';
    setTimeout(() => { boot.style.display = 'none'; }, 550);
  }
  setTimeout(dismissBoot, 2600);
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

  /* ── SMOOTH NAV SCROLL ── */
  document.querySelectorAll('.nav-btn[href^="#"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(btn.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── ZSH PROMPT TYPING ANIMATION ── */
  function typeCmd(el) {
    const cmd = el.getAttribute('data-cmd') || '';
    if (!cmd || el.classList.contains('typed-done')) return;
    el.classList.add('typed-done');
    el.classList.add('typing-active');
    
    let index = 0;
    el.textContent = '';
    const interval = setInterval(() => {
      if (index < cmd.length) {
        el.textContent += cmd.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        el.classList.remove('typing-active');
      }
    }, 45); // comfortable reading type-speed
  }

  /* ── SECTION FADE-IN & TYPING ON SCROLL ── */
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Trigger zsh prompt command typing simulation
        const cmdEl = entry.target.querySelector('.prompt-cmd');
        if (cmdEl) {
          setTimeout(() => { typeCmd(cmdEl); }, 200);
        }
        
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  sections.forEach(s => {
    s.style.transform = 'translateY(16px)';
    s.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    s.style.opacity = '0'; // hide initially to enable clean fade-in
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
            card.style.transform = 'translateY(8px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.25s ease, transform 0.25s ease, border-color 0.2s, box-shadow 0.2s';
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
          formStatus.textContent = '[ERROR] message_payload is empty.';
          formStatus.style.color = 'var(--red-dot)';
          setTimeout(() => { formStatus.textContent = ''; }, 3000);
        }
        return;
      }

      const subject = encodeURIComponent('Portfolio inquiry — Zernan Vash Arive');
      const body    = encodeURIComponent((name ? 'From: ' + name + '\n\n' : '') + message);
      window.location.href = `mailto:zernanvasharive16@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.textContent = '[OK] launching mail client...';
        formStatus.style.color = 'var(--blue)';
        setTimeout(() => { formStatus.textContent = ''; }, 3000);
      }
    });
  }

  /* ── ACTIVE NAV HIGHLIGHT ON SCROLL ── */
  const navBtns = document.querySelectorAll('.nav-btn');
  const sectionIds = ['about', 'skills', 'projects', 'events', 'awards', 'contact'];

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navBtns.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.25 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) navObs.observe(el);
  });

})();
