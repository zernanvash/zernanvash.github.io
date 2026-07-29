const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Element reveals on scroll
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('visible'));
}

// Header behavior on scroll & Scroll Progress Bar
const header = document.querySelector('[data-header]');
const progress = document.querySelector('.scroll-progress');
let previousScroll = scrollY;

addEventListener('scroll', () => {
  const currentScroll = scrollY;
  
  // Header hide/reveal
  if (header) {
    header.classList.toggle('hidden', currentScroll > previousScroll && currentScroll > 160);
  }
  previousScroll = currentScroll;

  // Scroll Progress
  if (progress) {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progress.style.width = scrolled + '%';
  }
}, { passive: true });

// Mouse Tracking for Ambient Glow Grid
document.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--mx', `${e.clientX}px`);
  document.body.style.setProperty('--my', `${e.clientY}px`);
});

// Custom Cursor Interpolation Physics
const dot = document.querySelector('.custom-cursor-dot');
const circle = document.querySelector('.custom-cursor-circle');

if (dot && circle && !reducedMotion) {
  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;
  let isMoving = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot instantly
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    if (!isMoving) {
      dot.style.opacity = '1';
      circle.style.opacity = '1';
      isMoving = true;
    }
  });

  // Smooth lerp loop for the outer circle
  const tick = () => {
    const delay = 6;
    circleX += (mouseX - circleX) / delay;
    circleY += (mouseY - circleY) / delay;
    
    circle.style.left = `${circleX}px`;
    circle.style.top = `${circleY}px`;
    
    requestAnimationFrame(tick);
  };
  tick();

  // Mouse leave viewport behaviors
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    circle.style.opacity = '0';
    isMoving = false;
  });

  // Hover triggers for interactive elements
  const hoverables = 'a, button, .project-visual, .nav a, .contact-email-btn, #copy-email-btn';
  
  const setupHoverListeners = () => {
    document.querySelectorAll(hoverables).forEach((el) => {
      // Remove any duplicate listeners
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });
  };

  const onMouseEnter = () => {
    dot.classList.add('hovered');
    circle.classList.add('hovered');
  };

  const onMouseLeave = () => {
    dot.classList.remove('hovered');
    circle.classList.remove('hovered');
  };

  setupHoverListeners();

  // Re-run hover binds if DOM changes
  const mutationObserver = new MutationObserver(setupHoverListeners);
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

// Text Decoder / Matrix Scrambler Effect
function decodeText(element) {
  const originalText = element.getAttribute('data-text') || element.innerText;
  element.setAttribute('data-text', originalText);
  
  const chars = '01#%&@*?[]{}$+=XYZ<>!^';
  let iterations = 0;
  const speed = 2.5; 
  
  const interval = setInterval(() => {
    element.innerText = originalText.split('')
      .map((char, index) => {
        if (index < iterations) {
          return originalText[index];
        }
        if (char === ' ' || char === '\n') return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
    
    if (iterations >= originalText.length) {
      clearInterval(interval);
      element.innerText = originalText; // Ensure exact final text
    }
    iterations += 1 / speed;
  }, 25);
}

// Setup decode effects
const decodeElements = document.querySelectorAll('.decode-text, .decode-trigger');
decodeElements.forEach((el) => {
  // Set data-text if not preset
  if (!el.getAttribute('data-text')) {
    el.setAttribute('data-text', el.innerText);
  }

  el.addEventListener('mouseenter', () => {
    decodeText(el);
  });
});

// Auto-run decode on hero title load
const heroItalic = document.querySelector('.hero h1 em');
if (heroItalic) {
  setTimeout(() => {
    decodeText(heroItalic);
  }, 400);
}

// Live CCTV Camera Clock Ticker
const cctvTime = document.querySelector('[data-cctv-time]');
if (cctvTime) {
  const updateCCTVTime = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    cctvTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };
  updateCCTVTime();
  setInterval(updateCCTVTime, 1000);
}

// Email copy utility and toast trigger
const copyBtn = document.getElementById('copy-email-btn');
const toast = document.getElementById('toast');

if (copyBtn && toast) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('zernanvasharive16@gmail.com').then(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    });
  });
}

// Copyright year updates
const yearEl = document.querySelector('[data-year]');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
