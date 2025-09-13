// ===== Optimized Animations Script =====

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    observerOptions: {
      root: null,
      threshold: 0.1,
      rootMargin: '50px'
    },
    selectors: {
      animatedElements: '.hidden, .feat, .srv, .special-heading, .project-modern',
      landingSection: '.landing',
      projectImages: '.main-project-img, .vision-hero-img img, .vision-img img, .section-img'
    }
  };

  // ===== Intersection Observer for General Animations =====
  function createGeneralObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing after first animation for performance
          observer.unobserve(entry.target);
        }
      });
    }, CONFIG.observerOptions);

    return observer;
  }

  // ===== Intersection Observer for Projects (repeatable animations) =====
  function createProjectObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          // Allow re-animation when element leaves viewport
          entry.target.classList.remove('visible');
        }
      });
    }, CONFIG.observerOptions);

    return observer;
  }

  // ===== Initialize Observers =====
  function initObservers() {
    const generalObserver = createGeneralObserver();
    const projectObserver = createProjectObserver();

    // Observe general animated elements
    document.querySelectorAll(CONFIG.selectors.animatedElements).forEach(element => {
      if (element.classList.contains('project-modern')) {
        projectObserver.observe(element);
      } else {
        generalObserver.observe(element);
      }
    });

    // Special handling for headings and their following paragraphs
    document.querySelectorAll('.special-heading').forEach(heading => {
      generalObserver.observe(heading);
      const nextElement = heading.nextElementSibling;
      if (nextElement && nextElement.tagName === 'P') {
        generalObserver.observe(nextElement);
      }
    });
  }

  // ===== Landing Animation =====
  function animateLanding() {
    const landingSection = document.querySelector(CONFIG.selectors.landingSection);
    if (landingSection) {
      landingSection.classList.add('loaded');
    }
    document.body.classList.add('loaded');
  }

  // ===== Project Images Animation =====
  function animateProjectImages() {
    document.querySelectorAll(CONFIG.selectors.projectImages).forEach(img => {
      // Add visible class with slight delay for staggered effect
      setTimeout(() => {
        img.classList.add('visible');
      }, Math.random() * 200);
    });
  }

  // ===== Performance Optimizations =====
  function optimizePerformance() {
    // Reduce motion for users who prefer it
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition', '0.01s');
      return;
    }

    // Use requestAnimationFrame for smooth animations
    function rafThrottle(fn) {
      let ticking = false;
      return function(...args) {
        if (!ticking) {
          requestAnimationFrame(() => {
            fn.apply(this, args);
            ticking = false;
          });
          ticking = true;
        }
      };
    }

    // Throttle scroll-based animations
    const throttledScroll = rafThrottle(() => {
      // Any scroll-based animations can be added here
    });

    window.addEventListener('scroll', throttledScroll, { passive: true });
  }

  // ===== Error Handling =====
  function handleErrors() {
    window.addEventListener('error', (e) => {
      console.warn('Animation error:', e.error);
    });
  }

  // ===== Initialize Everything =====
  function init() {
    try {
      // Check for browser support
      if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers - just show all elements
        document.querySelectorAll(CONFIG.selectors.animatedElements).forEach(el => {
          el.classList.add('visible');
        });
        return;
      }

      initObservers();
      optimizePerformance();
      handleErrors();

      // Landing animation on page load
      if (document.readyState === 'loading') {
        window.addEventListener('load', animateLanding);
      } else {
        animateLanding();
      }

      // Project images animation on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animateProjectImages);
      } else {
        animateProjectImages();
      }

    } catch (error) {
      console.warn('Animation initialization failed:', error);
      // Fallback - show all elements
      document.querySelectorAll(CONFIG.selectors.animatedElements).forEach(el => {
        el.classList.add('visible');
      });
    }
  }

  // ===== Auto-initialize =====
  init();

})();