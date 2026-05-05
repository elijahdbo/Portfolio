/**
 * main.js — Elijah Dabo Portfolio
 * Comportements globaux partagés entre toutes les pages
 */

/* ============================================================
   NAVBAR — Active state automatique selon l'URL courante
============================================================ */
(function () {
  const links = document.querySelectorAll('.nav-links a');
  const path  = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    // Correspondance exacte ou page index (accueil)
    if (
      href === path ||
      (path === '' && href === 'index.html') ||
      (path === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();


/* ============================================================
   NAVBAR — Ombre légère au scroll
============================================================ */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 1px 20px rgba(22,36,59,.06)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // état initial
})();


/* ============================================================
   MENU MOBILE — Toggle (si hamburger ajouté ultérieurement)
   La navbar se cache à < 600px via CSS (display:none sur .nav-links)
   Ce bloc prépare l'infrastructure pour un éventuel menu burger.
============================================================ */
(function () {
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open);
  });

  // Fermer au clic sur un lien
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Fermer au clic en dehors
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ============================================================
   SMOOTH SCROLL — Ancres internes (#section)
============================================================ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 64;

      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   IMAGES MANQUANTES — Fallback silencieux
   Empêche les <img> cassés d'afficher l'icône "image brisée"
   en injectant un placeholder si le src ne charge pas.
============================================================ */
(function () {
  // Traiter les images déjà dans le DOM
  function handleBrokenImage(img) {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = 'true';

    // Si l'image a déjà un onerror inline, on laisse le HTML gérer
    if (img.getAttribute('onerror')) return;

    img.style.display = 'none';
  }

  document.querySelectorAll('img').forEach(img => {
    if (!img.complete || img.naturalWidth === 0) {
      img.addEventListener('error', () => handleBrokenImage(img), { once: true });
    }
  });

  // Observer les images ajoutées dynamiquement (modales)
  if (window.MutationObserver) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          const imgs = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
          imgs.forEach(img => {
            img.addEventListener('error', () => handleBrokenImage(img), { once: true });
          });
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();


/* ============================================================
   ANIMATION — Intersection Observer (fadeUp au scroll)
   Ajoute la classe .is-visible aux éléments [data-animate]
   quand ils entrent dans le viewport.
   Usage HTML : <div data-animate> … </div>
============================================================ */
(function () {
  if (!window.IntersectionObserver) return;

  const style = document.createElement('style');
  style.textContent = `
    [data-animate],
    .section-header,
    .info-row,
    .parcours-timeline .parcours-step,
    .timeline .timeline-item,
    .stack-grid .stack-category,
    .cards-2 .card, .cards-3 .card,
    .projets-grid .projet-card,
    .articles-grid .article-card,
    .perspectives-grid .perspective-card,
    .synthese-grid .synthese-cell,
    .competences-grid .competence-cell,
    .missions-grid .mission-item,
    .apprentissages-grid .apprentissage-cell,
    .env-grid .env-cell,
    .highlight-box,
    .quote-block,
    .contact-strip .contact-title,
    .contact-strip .contact-links {
      opacity: 0;
      transform: translateY(22px);
      transition: opacity .5s ease, transform .5s ease;
    }
    [data-animate].is-visible,
    .section-header.is-visible,
    .info-row.is-visible,
    .parcours-timeline .parcours-step.is-visible,
    .timeline .timeline-item.is-visible,
    .stack-grid .stack-category.is-visible,
    .cards-2 .card.is-visible, .cards-3 .card.is-visible,
    .projets-grid .projet-card.is-visible,
    .articles-grid .article-card.is-visible,
    .perspectives-grid .perspective-card.is-visible,
    .synthese-grid .synthese-cell.is-visible,
    .competences-grid .competence-cell.is-visible,
    .missions-grid .mission-item.is-visible,
    .apprentissages-grid .apprentissage-cell.is-visible,
    .env-grid .env-cell.is-visible,
    .highlight-box.is-visible,
    .quote-block.is-visible,
    .contact-strip .contact-title.is-visible,
    .contact-strip .contact-links.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  const selectors = [
    '[data-animate]',
    '.section-header',
    '.info-row',
    '.parcours-timeline .parcours-step',
    '.timeline .timeline-item',
    '.stack-grid .stack-category',
    '.cards-2 .card', '.cards-3 .card',
    '.projets-grid .projet-card',
    '.articles-grid .article-card',
    '.perspectives-grid .perspective-card',
    '.synthese-grid .synthese-cell',
    '.competences-grid .competence-cell',
    '.missions-grid .mission-item',
    '.apprentissages-grid .apprentissage-cell',
    '.env-grid .env-cell',
    '.highlight-box',
    '.quote-block',
    '.contact-strip .contact-title',
    '.contact-strip .contact-links',
  ];

  document.querySelectorAll(selectors.join(',')).forEach((el, i) => {
    // Décalage en cascade pour les éléments dans la même grille
    el.style.transitionDelay = `${(i % 4) * 0.07}s`;
    observer.observe(el);
  });
})();