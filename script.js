/* ============================================
   PERCOLATE BIBLE STUDY — Home Page Interaction
   ============================================ */

(function () {
  'use strict';

  var previewPanel = document.getElementById('preview-panel');
  if (!previewPanel) return;

  var sessionCards = Array.prototype.slice.call(document.querySelectorAll('.session-card'));
  var previewWeek = document.getElementById('preview-week');
  var previewTitle = document.getElementById('preview-title');
  var previewSummary = document.getElementById('preview-summary');
  var previewThread = document.getElementById('preview-thread');
  var previewLink = document.getElementById('preview-link');
  var root = document.documentElement;
  var bg = document.querySelector('.page-bg');

  function setPreview(card) {
    if (!card) return;

    sessionCards.forEach(function (item) {
      item.classList.toggle('is-active', item === card);
    });

    previewWeek.textContent = card.getAttribute('data-week') || '';
    previewTitle.textContent = card.getAttribute('data-title') || '';
    previewSummary.textContent = card.getAttribute('data-summary') || '';
    previewThread.textContent = card.getAttribute('data-thread') || '';
    previewLink.setAttribute('href', card.getAttribute('href') || '#');

    var accent = getComputedStyle(card).getPropertyValue('--week-color').trim();
    if (accent) {
      root.style.setProperty('--active-week-color', accent);
    }

    if (bg) {
      var weekText = (card.getAttribute('data-week') || '').replace(/[^\d]/g, '');
      var weekIndex = Number(weekText || 1);
      var offsetX = ((weekIndex % 3) - 1) * 14;
      var offsetY = ((weekIndex % 4) - 1.5) * 10;
      bg.style.transform = 'scale(1.03) translate(' + offsetX + 'px, ' + offsetY + 'px)';
    }
  }

  sessionCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      setPreview(card);
    });

    card.addEventListener('focus', function () {
      setPreview(card);
    });

    card.addEventListener('click', function () {
      setPreview(card);
    });
  });

  setPreview(document.querySelector('.session-card.is-active') || sessionCards[0]);
})();

/* ============================================
   PERCOLATE BIBLE STUDY — Scripture Modal
   ============================================ */

(function () {
  'use strict';

  // ESV.org URL builder
  function esvUrl(reference) {
    // Convert "Genesis 2:18" -> "Genesis2:18"
    // Convert "Ecclesiastes 4:9-12" -> "Ecclesiastes4:9-12/"
    var ref = reference.trim();
    // Remove leading/trailing spaces, collapse book+chapter
    ref = ref.replace(/\s+(\d)/, '$1');
    return 'https://www.esv.org/' + encodeURIComponent(ref) + '/';
  }

  // Build modal DOM once
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Scripture reference');
  overlay.innerHTML =
    '<div class="modal-content">' +
      '<button class="modal-close" aria-label="Close modal">&times;</button>' +
      '<div class="modal-reference"></div>' +
      '<div class="modal-body">' +
        '<p>Scripture text is available at ESV.org. Click the link below to read the full passage.</p>' +
      '</div>' +
      '<a class="modal-esv-link" href="#" target="_blank" rel="noopener noreferrer">' +
        'Read on ESV.org &rarr;' +
      '</a>' +
    '</div>';
  document.body.appendChild(overlay);

  var refEl = overlay.querySelector('.modal-reference');
  var linkEl = overlay.querySelector('.modal-esv-link');
  var closeBtn = overlay.querySelector('.modal-close');

  function openModal(reference) {
    refEl.textContent = reference;
    linkEl.href = esvUrl(reference);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Bind all reading links
  document.addEventListener('click', function (e) {
    var link = e.target.closest('.reading-link');
    if (link) {
      e.preventDefault();
      var ref = link.getAttribute('data-ref') || link.textContent;
      openModal(ref);
    }
  });
})();

/* ============================================
   PERCOLATE BIBLE STUDY — Scroll Reveal
   ============================================ */

(function () {
  'use strict';

  if (!document.body.classList.contains('session-page')) return;
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    var all = document.querySelectorAll('.section-card, .key-verse-wrap, .dual-section, .next-week-cta, .esv-copyright');
    for (var i = 0; i < all.length; i++) all[i].classList.add('is-visible');
    return;
  }

  var delay = 0;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var d = el.getAttribute('data-reveal-delay') || 0;
        setTimeout(function () {
          el.classList.add('is-visible');
        }, Number(d));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  var targets = document.querySelectorAll('.section-card, .key-verse-wrap, .dual-section, .next-week-cta, .esv-copyright');
  for (var i = 0; i < targets.length; i++) {
    targets[i].setAttribute('data-reveal-delay', i * 60);
    observer.observe(targets[i]);
  }
})();
