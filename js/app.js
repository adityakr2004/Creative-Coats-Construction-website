/* ============================================================
   CREATIVE COATS — Premium JS
   ============================================================ */

(function () {
  'use strict';

  // 1. NAVBAR — Scroll behaviour + Mobile
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const backToTop = document.getElementById('back-to-top');

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openNav() {
    navMenu.classList.add('open');
    hamburger.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => navMenu.classList.contains('open') ? closeNav() : openNav());
  overlay.addEventListener('click', closeNav);
  navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => link.addEventListener('click', closeNav));

  // 2. BACK TO TOP — Scroll Progress & Visibility
  const progressCircle = document.querySelector('.progress-circle');
  const pathLength = progressCircle ? progressCircle.getTotalLength() : 157.08;

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressCircle.style.strokeDashoffset = pathLength;
  }

  function updateScrollProgress() {
    const scroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pathLength - (scroll * pathLength / height);
    if (progressCircle) progressCircle.style.strokeDashoffset = progress;
    
    navbar.classList.toggle('scrolled', scroll > 60);
    if (backToTop) backToTop.classList.toggle('show', scroll > 400);
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 3. HERO PARTICLES
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 10 + 4;
      particle.style.cssText = `width: ${size}px; height: ${size}px; left: ${Math.random() * 100}%; animation-duration: ${Math.random() * 10 + 12}s; animation-delay: ${Math.random() * 10}s; opacity: ${Math.random() * 0.4 + 0.1};`;
      particlesContainer.appendChild(particle);
    }
  }

  // 4. COUNTER ANIMATION
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    function update(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  // 5. SCROLL REVEAL & COUNTERS
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const counterEls = document.querySelectorAll('.counter[data-target], .stat-num[data-target]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  // 5.1 SCROLLSPY (Active Nav Link)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    // Only update if the section is truly visible enough to be considered "current"
    const visibleSections = entries.filter(e => e.isIntersecting);
    if (visibleSections.length > 0) {
      // Find the one that's most visible or highest up
      const currentSection = visibleSections.reduce((prev, curr) => 
        (curr.intersectionRatio > prev.intersectionRatio) ? curr : prev
      );
      
      const id = currentSection.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  }, { 
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5], // Multiple thresholds for smoother detection
    rootMargin: '-20% 0px -40% 0px'      // Focus detection on the top-middle part of viewport
  });

  sections.forEach(section => scrollSpyObserver.observe(section));

  // 6. TESTIMONIALS CAROUSEL (Pixel-based slider)
  const track     = document.getElementById('testimonials-track');
  const dotsWrap  = document.getElementById('carousel-dots');
  const prevBtn   = document.getElementById('carousel-prev');
  const nextBtn   = document.getElementById('carousel-next');
  const cards     = track ? track.querySelectorAll('.testimonial-card') : [];
  const dots      = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
  let current     = 0;
  let autoSlide;

  function goToSlide(idx) {
    if (!track) return;
    current = (idx + cards.length) % cards.length;
    const cardWidth = track.parentElement.offsetWidth;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      if (d.classList.contains('active')) { d.style.width = '24px'; d.style.borderRadius = '4px'; }
      else { d.style.width = '8px'; d.style.borderRadius = '50%'; }
    });
  }

  window.addEventListener('resize', () => { if (track) goToSlide(current); });

  function startAuto() { if (cards.length > 0) autoSlide = setInterval(() => goToSlide(current + 1), 5000); }
  function stopAuto()  { clearInterval(autoSlide); }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goToSlide(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goToSlide(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goToSlide(i); startAuto(); }));

  startAuto();

  // 7. PROJECT FILTER TABS
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  // 8. CONTACT FORM SUBMISSION (FormSubmit API)
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn   = document.getElementById('submit-btn');
  const btnText     = document.getElementById('btn-text');
  const btnLoading  = document.getElementById('btn-loading');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      btnText.style.display = 'none';
      btnLoading.style.display = 'block';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          formSuccess.innerHTML = '<i class="bi bi-check-circle-fill"></i> Thank you! Your message has been sent successfully.';
          formSuccess.style.color = '#4ade80';
          formSuccess.classList.add('show');
          contactForm.reset();
        } else { throw new Error('Fail'); }
      } catch (error) {
        formSuccess.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Oops! Something went wrong.';
        formSuccess.style.color = '#f87171';
        formSuccess.classList.add('show');
      } finally {
        btnText.style.display = 'flex';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }
    });
  }

  // 9. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // 10. SUBTLE PARALLAX
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
      }
    }, { passive: true });
  }

})();
