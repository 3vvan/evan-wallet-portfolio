/* ═══════════════════════════════════════════════════════
   MAIN.JS  — scroll reveals, nav behavior, parallax
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Utility: run after DOM ready ─────────────────────── */
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

/* ── NAV: add .scrolled class on scroll ──────────────── */
function initNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  let lastScrollY = window.scrollY;

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    const isScrolled = currentScrollY > 60;

    nav.classList.toggle('scrolled', isScrolled);

    if (isScrolled && currentScrollY > lastScrollY) {
      nav.classList.add('scrolled-down');
    } else {
      nav.classList.remove('scrolled-down');
    }
    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── SCROLL REVEAL: fade in work items ──────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.work-item');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay per item
        const delay = (Array.from(entry.target.parentNode.children).indexOf(entry.target)) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* ── PARALLAX: hero text slow drift on scroll ────────── */
function initHeroParallax() {
  const lines = document.querySelectorAll('.hero-line[data-speed]');
  if (!lines || lines.length === 0) return;

  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    lines.forEach(line => {
      const speed = parseFloat(line.dataset.speed) || 0.04;
      line.style.transform = `translateY(${scrollY * speed}px)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ── WORK FILTER (work.html only) ────────────────────── */
function initWorkFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sections   = document.querySelectorAll('.work-section[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide sections
      sections.forEach(section => {
        if (filter === 'all' || section.dataset.category === filter) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });
    });
  });
}

/* ── CONTACT FORM: simple validation + feedback ───────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn  = form.querySelector('.btn-submit');
    const note = form.querySelector('.form-note');
    const originalBtnText = btn.textContent;

    btn.textContent  = 'SENDING…';
    btn.disabled     = true;
    if (note) note.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
      });

      if (response.ok) {
        btn.textContent  = 'SENT ✓';
        if (note) note.textContent = 'Message received. I\'ll be in touch.';
        form.reset();
        // Keep button disabled after successful submission as a design choice.
      } else {
        // Handle server errors (e.g., validation) from Formspree
        const data = await response.json();
        if (data.errors) {
          note.textContent = data.errors.map(error => error.message).join(', ');
        } else {
          note.textContent = 'Oops! There was a problem. Please try again.';
        }
        btn.textContent = originalBtnText;
        btn.disabled = false;
      }
    } catch (error) {
      // Handle network errors
      if (note) note.textContent = 'Oops! A network error occurred. Please try again.';
      btn.textContent = originalBtnText;
      btn.disabled = false;
    }
  });
}

/* ── ACTIVE NAV LINK: highlight current page ─────────── */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === current) {
      link.classList.add('nav-link--active', 'nav-link--bold');
    } else {
      link.classList.remove('nav-link--active', 'nav-link--bold');
    }
  });
}

/* ── SCRAMBLE TEXT ON HOVER  ─────────── */
const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

// Select all scramble links on the page
document.querySelectorAll('.nav-link.nav-link--right').forEach(el => {
    // Store the original text and the target hover text from the HTML attribute
    const defaultText = el.innerText.trim();
    const hoverText = el.getAttribute('data-hover') || defaultText;
    
    // Give each element its own independent interval variable
    let interval = null;

    function scrambleTo(targetText) {
        let iteration = 0;
        clearInterval(interval);

        interval = setInterval(() => {
            el.innerText = targetText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return targetText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iteration >= targetText.length) {
                clearInterval(interval);
            }
            
            iteration += 1 / 2; 
        }, 30);
    }

    // Trigger on Hover
    el.addEventListener('mouseenter', () => scrambleTo(hoverText));

    // Trigger on Unhover
    el.addEventListener('mouseleave', () => scrambleTo(defaultText));
});

/* ── NAV ICONS: show on scroll down ─────────────────── */
function initIcons() {
  const nav = document.getElementById('site-nav');
  const icons = document.querySelectorAll('.nav-icon');
  if (!nav || !icons.length) return;

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const hasClass = nav.classList.contains('scrolled-down');
        icons.forEach(icon => icon.classList.toggle('scrolled-down', hasClass));
      }
    }
  });

  observer.observe(nav, { attributes: true });
}

/* ── SIGNATURE ANIMATION: draw signature on load ─────── */
function animateSignature() {
  const paths = document.querySelectorAll('#signature .sig-path');

  paths.forEach((path, index) => {
    // 1. Get the exact length of the path
    const length = path.getTotalLength();

    // 2. Temporarily disable transitions just to be safe
    path.style.transition = 'none';

    // 3. Set the dash array and offset to hide the stroke
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // 4. Force a browser reflow to register the hidden state
    path.getBoundingClientRect();

    // 5. Trigger the animation
    setTimeout(() => {
      // Re-apply the transition and set offset to 0 to draw it
      // Append to the existing transition to not override the hover effect from CSS
      path.style.transition += ', stroke-dashoffset 2s ease-in-out';
      path.style.strokeDashoffset = '0';
    }, 200 + (index * 100)); 
  });
}

/* ── FOOTER: set current year ───────────────────────── */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ── DYNAMIC NAV HEIGHT for sticky elements ─────────── */
function initNavHeight() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  const setNavHeight = () => {
    const navHeight = nav.offsetHeight;
    document.body.style.setProperty('--nav-height', `${navHeight}px`);
  };

  // Set initial height
  setNavHeight();

  // Update on resize or mutation
  const observer = new ResizeObserver(setNavHeight);
  observer.observe(nav);
  // We also observe childList to catch when links are hidden/shown
  observer.observe(nav, { childList: true, subtree: true });
}


/* ── LIGHTBOX FUNCTIONALITY FOR WORK ITEMS ───────────── */
document.addEventListener('DOMContentLoaded', () => {
    const workItems = document.querySelectorAll('.work-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox__close');

    if (!lightbox || !lightboxImage || !lightboxClose) {
        console.error('Lightbox elements not found!');
        return;
    }

    workItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // If the work-item is a link, prevent it from navigating
            e.preventDefault();

            // Find the image inside the clicked work-item
            const image = item.querySelector('.work-item__img-wrap img');
            if (image) {
                // Set the lightbox image source to the clicked image's source
                lightboxImage.src = image.src;

                // Show the lightbox and prevent body scrolling
                lightbox.classList.add('visible');
                document.body.classList.add('lightbox-open');
            }
        });
    });

    // Function to close the lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        document.body.classList.remove('lightbox-open');
    };

    // Close lightbox when the 'X' button is clicked
    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox when clicking on the background overlay
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with the Escape key for better accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
            closeLightbox();
        }
    });
});

/* ── INIT ─────────────────────────────────────────────── */
ready(() => {
  initNav();
  initScrollReveal();
  initHeroParallax();
  initWorkFilter();
  initContactForm();
  initActiveNav();
  initIcons();
  initFooterYear();
  initNavHeight();
  animateSignature();
});
