/* ===========================
   AABHA BY LATHA — MAIN JS
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Loader ----
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 2200);
    document.body.style.overflow = 'hidden';
  }

  // ---- Custom Cursor ----
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverEls = document.querySelectorAll('a, button, .gallery-item, .service-card, .svc-item');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
  }

  // ---- Navigation ----
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }
  });

  if (hamburger && navLinks) {
    // Create overlay
    let overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      overlay.classList.toggle('show', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    overlay.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Scroll Reveal (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.reveal-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current);
          if (current >= target) clearInterval(timer);
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // ---- Testimonials Slider ----
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideTimer;

  function goToSlide(index) {
    cards.forEach((c, i) => c.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index));
      resetTimer();
    });
  });

  function autoSlide() {
    slideTimer = setInterval(() => {
      goToSlide((currentSlide + 1) % cards.length);
    }, 4500);
  }

  function resetTimer() {
    clearInterval(slideTimer);
    autoSlide();
  }

  if (cards.length > 0) autoSlide();

  // ---- Gallery Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          item.offsetHeight; // reflow
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Gallery item click → lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const thumb = item.querySelector('.gallery-thumb');
        const label = item.querySelector('.gallery-label');
        const svgArt = item.querySelector('.gallery-svg-art');

        if (svgArt) {
          lightboxContent.innerHTML = svgArt.innerHTML;
          lightboxContent.querySelector('svg').style.width = '300px';
          lightboxContent.querySelector('svg').style.height = '400px';
        }
        if (label) lightboxCaption.textContent = label.textContent;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ---- Contact Form ----
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('name');
      const phone = document.getElementById('phone');
      const nameErr = document.getElementById('name-error');
      const phoneErr = document.getElementById('phone-error');

      if (nameErr) nameErr.textContent = '';
      if (phoneErr) phoneErr.textContent = '';

      if (name && name.value.trim().length < 2) {
        if (nameErr) nameErr.textContent = 'Please enter your name.';
        valid = false;
      }
      if (phone && phone.value.trim().length < 7) {
        if (phoneErr) phoneErr.textContent = 'Please enter a valid phone number.';
        valid = false;
      }

      if (valid) {
        const btn = form.querySelector('.btn-primary');
        const btnText = btn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Sending…';
        btn.disabled = true;

        setTimeout(() => {
          const success = document.getElementById('form-success');
          if (success) success.classList.add('show');
          form.reset();
          if (btnText) btnText.textContent = 'Send Enquiry';
          btn.disabled = false;
          setTimeout(() => success && success.classList.remove('show'), 5000);
        }, 1200);
      }
    });
  }

  // ---- Parallax on Hero petals ----
  const hero = document.getElementById('hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const petals = hero.querySelectorAll('.petal');
      petals.forEach((p, i) => {
        p.style.transform = `translateY(${scrolled * (0.1 + i * 0.03)}px) rotate(${scrolled * 0.05}deg)`;
      });
    }, { passive: true });
  }

  // ---- Smooth page-in animation ----
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);

});

// Add CSS keyframes for gallery fadeIn dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(style);
