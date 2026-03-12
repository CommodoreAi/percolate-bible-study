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
   PERCOLATE BIBLE STUDY — Table Check-In
   ============================================ */

(function () {
  'use strict';

  var panel = document.getElementById('checkin-panel');
  if (!panel) return;

  var state = {
    friction: 'disconnection',
    desire: 'connection',
    format: 'coffee-catchup'
  };

  var resultMap = {
    connection: {
      week: 'Week 1',
      title: 'Made for Connection',
      href: 'week1.html',
      body: 'Start with connection when the goal is to lower the pressure, rebuild trust, and let the table feel human again.'
    },
    fear: {
      week: 'Week 2',
      title: "Don't Be Afraid",
      href: 'week2.html',
      body: 'Begin with courage when fear is quietly shaping what people are willing to say, ask, or admit.'
    },
    isolation: {
      week: 'Week 3',
      title: 'The Cost of Isolation',
      href: 'week3.html',
      body: 'Start here when distance, loneliness, or digital overconnection are making real intimacy harder to reach.'
    },
    renewal: {
      week: 'Week 4',
      title: 'Renew Your Mind',
      href: 'week4.html',
      body: 'Lead with renewal when the need is less about activity and more about reframing how life is being interpreted.'
    },
    anxiety: {
      week: 'Week 5',
      title: 'Suffering & Anxiety',
      href: 'week5.html',
      body: 'This is the right entry when people need honest language for anxiety, suffering, and compassionate presence.'
    },
    courage: {
      week: 'Week 6',
      title: 'Courage to Show Up',
      href: 'week6.html',
      body: 'Use this when the biggest need is for brave participation, visible care, and actually showing up.'
    },
    comparison: {
      week: 'Week 9',
      title: 'Beyond Comparison',
      href: 'week9.html',
      body: 'Start here when identity, self-measurement, and quiet insecurity are draining the possibility of honest community.'
    },
    presence: {
      week: 'Week 10',
      title: 'Practicing Presence',
      href: 'week10.html',
      body: 'This works best when the real hunger is for attention, rest, and a less distracted way of being together.'
    }
  };

  var weekEl = document.getElementById('checkin-week');
  var titleEl = document.getElementById('checkin-title');
  var bodyEl = document.getElementById('checkin-body');
  var linkEl = document.getElementById('checkin-link');
  var inviteEl = document.getElementById('invite-preview');
  var copyButton = document.getElementById('copy-invite');

  function chooseRecommendation() {
    if (state.friction === 'anxiety') return resultMap.anxiety;
    if (state.friction === 'comparison') return resultMap.comparison;
    if (state.friction === 'isolation') return resultMap.isolation;
    if (state.desire === 'presence') return resultMap.presence;
    if (state.desire === 'courage') return resultMap.courage;
    if (state.desire === 'renewal') return resultMap.renewal;
    if (state.format === 'one-on-one') return resultMap.fear;
    return resultMap.connection;
  }

  function inviteText(result) {
    return 'Want to meet for coffee and try ' + result.week + ' of Percolate with me? It is designed for real conversation, not pressure, and I think it could be a good starting point.';
  }

  function updateResult() {
    var result = chooseRecommendation();
    weekEl.textContent = result.week;
    titleEl.textContent = result.title;
    bodyEl.textContent = result.body;
    linkEl.setAttribute('href', result.href);
    inviteEl.textContent = inviteText(result);
  }

  panel.addEventListener('click', function (event) {
    var button = event.target.closest('.checkin-option');
    if (!button) return;

    var question = button.closest('.checkin-question');
    if (!question) return;

    var key = question.getAttribute('data-question');
    var value = button.getAttribute('data-value');
    if (!key || !value) return;

    state[key] = value;
    Array.prototype.forEach.call(question.querySelectorAll('.checkin-option'), function (item) {
      item.classList.toggle('is-selected', item === button);
    });
    updateResult();
  });

  if (copyButton) {
    copyButton.addEventListener('click', function () {
      var text = inviteEl.textContent || '';
      if (!text) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          copyButton.textContent = 'Invite copied';
          window.setTimeout(function () {
            copyButton.textContent = 'Copy invite text';
          }, 1800);
        });
      }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.checkin-question'), function (question) {
    var first = question.querySelector('.checkin-option');
    if (first) first.classList.add('is-selected');
  });

  updateResult();
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
    var all = document.querySelectorAll('.section-card, .key-verse-wrap, .dual-section, .next-week-cta, .esv-copyright, .completion-card');
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

  var targets = document.querySelectorAll('.section-card, .key-verse-wrap, .dual-section, .next-week-cta, .esv-copyright, .completion-card');
  for (var i = 0; i < targets.length; i++) {
    targets[i].setAttribute('data-reveal-delay', i * 60);
    observer.observe(targets[i]);
  }
})();

/* ============================================
   PERCOLATE BIBLE STUDY — Notebook Chrome
   ============================================ */

(function () {
  'use strict';

  if (!document.body.classList.contains('session-page')) return;

  var body = document.body;
  var match = window.location.pathname.match(/week(\d+)\.html/i);
  var weekNumber = match ? Number(match[1]) : NaN;
  var patternClasses = ['pattern-dots', 'pattern-grid', 'pattern-waves', 'pattern-burst'];

  if (!Number.isNaN(weekNumber)) {
    body.classList.add(patternClasses[(weekNumber - 1) % patternClasses.length]);
    body.setAttribute('data-week-number', String(weekNumber));
  }

  if (!document.querySelector('.bookmark-fab')) {
    var fab = document.createElement('a');
    fab.className = 'bookmark-fab';
    fab.href = 'index.html';
    fab.setAttribute('aria-label', 'Return to Percolate home');
    fab.innerHTML = '<span>Home</span>';
    document.body.appendChild(fab);
  }

  var ticking = false;

  function updateNotebookMotion() {
    var drift = Math.min(window.scrollY * 0.04, 18);
    body.style.setProperty('--page-shift', drift.toFixed(2) + 'px');
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateNotebookMotion);
  }

  updateNotebookMotion();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================
   PERCOLATE BIBLE STUDY — Study Card Stage
   ============================================ */

(function () {
  'use strict';

  if (!document.body.classList.contains('session-page')) return;

  var match = window.location.pathname.match(/week(\d+)\.html/i);
  if (!match) return;

  var weekNumber = Number(match[1]);
  if (!weekNumber || weekNumber < 1 || weekNumber > 12) return;

  var weekPadded = String(weekNumber).padStart(2, '0');
  var cardSrc = 'cards/week-' + weekPadded + '.png';
  var progress = document.querySelector('.session-progress');
  if (!progress) return;

  document.body.classList.add('has-study-card');
  document.body.style.setProperty('--study-card-image', 'url("' + cardSrc + '")');

  if (!document.querySelector('.study-card-stage')) {
    var stage = document.createElement('section');
    stage.className = 'study-card-stage';
    stage.setAttribute('aria-label', 'Percolate study card artwork');
    stage.innerHTML =
      '<div class="study-card-shell">' +
        '<button class="study-card-zoom" type="button" aria-label="Zoom study card and rotate phone for landscape view">Zoom card</button>' +
        '<img class="study-card-image" src="' + cardSrc + '" alt="Percolate Week ' + weekNumber + ' study card">' +
      '</div>' +
      '<p class="study-card-caption">Tap artwork to zoom. Rotate your phone for the full card view.</p>';
    progress.insertAdjacentElement('afterend', stage);
  }

  var stageEl = document.querySelector('.study-card-stage');
  var shell = stageEl ? stageEl.querySelector('.study-card-shell') : null;
  var image = stageEl ? stageEl.querySelector('.study-card-image') : null;
  var zoomButton = stageEl ? stageEl.querySelector('.study-card-zoom') : null;

  if (!shell || !image || !zoomButton) return;

  var lightbox = document.querySelector('.study-card-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'study-card-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML =
      '<div class="study-card-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Zoomed Percolate study card">' +
        '<button class="study-card-lightbox-close" type="button" aria-label="Close zoomed card">&times;</button>' +
        '<p class="study-card-lightbox-tip">Rotate your phone for landscape. On supported browsers, full screen starts automatically.</p>' +
        '<img class="study-card-lightbox-image" alt="Zoomed Percolate study card">' +
      '</div>';
    document.body.appendChild(lightbox);
  }

  var lightboxDialog = lightbox.querySelector('.study-card-lightbox-dialog');
  var lightboxImage = lightbox.querySelector('.study-card-lightbox-image');
  var closeButton = lightbox.querySelector('.study-card-lightbox-close');

  function requestLandscapeFullscreen() {
    var isMobileViewport = window.matchMedia('(max-width: 820px)').matches;
    if (!isMobileViewport) return;

    var requestFullscreen =
      lightboxDialog.requestFullscreen ||
      lightboxDialog.webkitRequestFullscreen ||
      lightboxDialog.msRequestFullscreen;

    if (!requestFullscreen) return;

    Promise.resolve(requestFullscreen.call(lightboxDialog))
      .then(function () {
        if (screen.orientation && screen.orientation.lock) {
          return screen.orientation.lock('landscape').catch(function () {});
        }
      })
      .catch(function () {});
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('study-card-zoom-open');

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }

    if (screen.orientation && screen.orientation.unlock) {
      try {
        screen.orientation.unlock();
      } catch (error) {}
    }
  }

  function openLightbox() {
    lightboxImage.src = cardSrc;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('study-card-zoom-open');
    requestLandscapeFullscreen();
    closeButton.focus();
  }

  shell.addEventListener('click', function (event) {
    var clickedImage = event.target.closest('.study-card-image');
    var clickedZoom = event.target.closest('.study-card-zoom');
    if (!clickedImage && !clickedZoom) return;
    event.preventDefault();
    openLightbox();
  });

  closeButton.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox.classList.contains('is-active')) {
      closeLightbox();
    }
  });
})();

/* ============================================
   PERCOLATE BIBLE STUDY — Visited Weeks Tracker
   ============================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'percolate-visited';

  function getVisited() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function markVisited(weekNum) {
    var visited = getVisited();
    if (!visited[weekNum]) {
      visited[weekNum] = Date.now();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(visited)); } catch (e) {}
    }
  }

  // On a week page, mark it as visited
  var weekMatch = window.location.pathname.match(/week(\d+)\.html/i);
  if (weekMatch) {
    markVisited(Number(weekMatch[1]));
  }

  // On the home page, show visited state
  if (!document.body.classList.contains('home-page')) return;

  var visited = getVisited();
  var visitedCount = Object.keys(visited).length;

  // Mark index items
  var indexItems = document.querySelectorAll('.index-item');
  for (var i = 0; i < indexItems.length; i++) {
    var href = indexItems[i].getAttribute('href') || '';
    var m = href.match(/week(\d+)\.html/i);
    if (m && visited[Number(m[1])]) {
      indexItems[i].classList.add('is-visited');
    }
  }

  // Mark session cards
  var sessionCards = document.querySelectorAll('.session-card');
  for (var j = 0; j < sessionCards.length; j++) {
    var cardHref = sessionCards[j].getAttribute('href') || '';
    var cm = cardHref.match(/week(\d+)\.html/i);
    if (cm && visited[Number(cm[1])]) {
      sessionCards[j].classList.add('is-visited');
    }
  }

  // Add progress bar above journal index if any weeks visited
  if (visitedCount > 0) {
    var indexSection = document.getElementById('journal-index');
    if (indexSection) {
      var bar = document.createElement('div');
      bar.className = 'study-progress-bar';
      var pct = Math.round((visitedCount / 12) * 100);
      bar.innerHTML =
        '<span>' + visitedCount + ' of 12 brewed</span>' +
        '<span class="progress-track"><span class="progress-fill" style="width:' + pct + '%"></span></span>';
      var indexList = indexSection.querySelector('.index-list');
      if (indexList) {
        indexSection.insertBefore(bar, indexList);
      }
    }
  }
})();
