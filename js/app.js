/**
 * app.js — Eric Wachira Comics Reader
 * All navigation, reader, and UI logic lives here.
 * Comic data lives in js/comics.js
 */

// ── Security: Slug Validation ───────────────────────────────────────────────
function isValidSlug(slug) {
  if (typeof slug !== 'string') return false;
  return /^[a-z0-9\-_]+$/.test(slug) && slug.length > 0 && slug.length < 100;
}

function sanitizePath(slug, filename) {
  if (!isValidSlug(slug)) throw new Error('Invalid slug');
  if (!/^[\w\-\.]+\.jpg$/i.test(filename)) throw new Error('Invalid filename');
  return `${slug}/${filename}`;
}

// ── State ────────────────────────────────────────────────────────────────────
let activeComic   = null;   // the currently selected comic object
let currentPanel  = 0;      // zero-based panel index

// ── Screen switching ──────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

function showLibrary() {
  activeComic = null;
  showScreen('screen-library');
}

function showLanding(comic) {
  activeComic = comic;

  // Validate comic data
  if (!isValidSlug(comic.slug)) {
    console.error('Invalid comic slug');
    showLibrary();
    return;
  }

  // Update landing page content dynamically (textContent prevents XSS)
  document.getElementById('landing-eyebrow').textContent =
    `${comic.author} · ${comic.tag}`;
  document.getElementById('landing-title').textContent   = comic.title;
  document.getElementById('landing-desc').textContent    = comic.desc;
  document.getElementById('landing-panel-count').textContent = comic.panels;

  // Background cover image (sanitize URL)
  const bg = document.getElementById('landing-bg');
  const coverPath = sanitizePath(comic.slug, 'cover.jpg');
  bg.style.backgroundImage = `url('${coverPath}')`;

  showScreen('screen-landing');
}

function startReading() {
  if (!activeComic || activeComic.status !== 'available') return;
  currentPanel = 0;
  buildDots();
  renderPanel(currentPanel, 'none');
  showScreen('screen-reader');
}

// ── Library: build cards from COMICS data ────────────────────────────────────
function buildLibrary() {
  const grid = document.getElementById('lib-grid');
  grid.innerHTML = '';

  COMICS.forEach((comic, i) => {
    // Validate slug before using
    if (!isValidSlug(comic.slug)) {
      console.error(`Skipping comic with invalid slug: ${comic.slug}`);
      return;
    }

    const card = document.createElement('div');
    card.className = 'comic-card' + (comic.status === 'coming-soon' ? ' card-soon' : '');
    card.style.animationDelay = `${i * 0.1}s`;

    // Safe cover image
    let coverNode;
    if (comic.status === 'available') {
      coverNode = document.createElement('img');
      coverNode.className = 'card-cover';
      coverNode.src = sanitizePath(comic.slug, 'cover.jpg');
      coverNode.alt = `${comic.title} cover`;
    } else {
      coverNode = document.createElement('div');
      coverNode.className = 'card-cover-placeholder';
      const label = document.createElement('div');
      label.className = 'placeholder-label';
      label.textContent = 'Coming\nSoon';
      coverNode.appendChild(label);
    }

    // Card body
    const body = document.createElement('div');
    body.className = 'card-body';

    const tag = document.createElement('div');
    tag.className = 'card-tag';
    tag.textContent = comic.tag;

    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = comic.title;

    const author = document.createElement('div');
    author.className = 'card-author';
    author.textContent = `by ${comic.author}`;

    const desc = document.createElement('div');
    desc.className = 'card-desc';
    desc.textContent = comic.desc;

    const btn = document.createElement('button');
    btn.className = 'card-cta';
    btn.disabled = comic.status !== 'available';
    btn.textContent = comic.status === 'available' ? 'Read Now' : 'Coming Soon';

    // Add icon for "Read Now" button only
    if (comic.status === 'available') {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2.5');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M5 12h14M12 5l7 7-7 7');
      svg.appendChild(path);
      btn.appendChild(svg);
    }

    // Event listener instead of inline onclick
    if (comic.status === 'available') {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showLanding(comic);
      });
      card.addEventListener('click', () => showLanding(comic));
    }

    body.appendChild(tag);
    body.appendChild(title);
    body.appendChild(author);
    body.appendChild(desc);
    body.appendChild(btn);

    card.appendChild(coverNode);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

// ── Reader: dots ──────────────────────────────────────────────────────────────
function buildDots() {
  const c = document.getElementById('dots-container');
  c.innerHTML = '';
  const total = activeComic.captions.length;
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    const panelIndex = i; // Capture index safely
    d.addEventListener('click', () => goTo(panelIndex));
    c.appendChild(d);
  }
}

function updateDots(idx) {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

// ── Reader: render panel ──────────────────────────────────────────────────────
function renderPanel(idx, direction) {
  const total   = activeComic.captions.length;
  const img     = document.getElementById('panel-img');
  const narrEl  = document.getElementById('reader-title-text');
  const capEl   = document.getElementById('reader-caption-text');
  const data    = activeComic.captions[idx];
  const panelNum = String(idx + 1).padStart(2, '0');
  
  // Validate and sanitize panel path
  let newSrc;
  try {
    newSrc = sanitizePath(activeComic.slug, `panel-${panelNum}.jpg`);
  } catch (e) {
    console.error('Invalid panel path', e);
    return;
  }

  // Slide animation
  const outClass = direction === 'next' ? 'slide-out-left'  : 'slide-out-right';
  const inClass  = direction === 'next' ? 'slide-in-left'   : 'slide-in-right';

  if (direction !== 'none') {
    img.classList.add(outClass);
    setTimeout(() => {
      img.src = newSrc;
      narrEl.textContent = data.title;
      capEl.textContent  = data.caption;
      img.classList.remove(outClass);
      img.classList.add(inClass);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        img.classList.remove(inClass);
      }));
    }, 200);
  } else {
    img.src = newSrc;
    narrEl.textContent = data.title;
    capEl.textContent  = data.caption;
  }

  // Progress UI
  document.getElementById('progress-label').textContent = `${idx + 1} / ${total}`;
  document.getElementById('progress-bar').style.width   = `${(idx + 1) / total * 100}%`;
  document.getElementById('btn-prev').disabled = (idx === 0);
  document.getElementById('btn-next').disabled = (idx === total - 1);
  document.getElementById('reader-comic-title').textContent = activeComic.title.toUpperCase();

  // Preload next panel
  if (idx + 1 < total) {
    const pre = new Image();
    const nextPanelNum = String(idx + 2).padStart(2, '0');
    try {
      pre.src = sanitizePath(activeComic.slug, `panel-${nextPanelNum}.jpg`);
    } catch (e) {
      console.error('Failed to preload next panel', e);
    }
  }

  updateDots(idx);
}

function nextPanel() {
  const total = activeComic.captions.length;
  if (currentPanel < total - 1) {
    currentPanel++;
    renderPanel(currentPanel, 'next');
  }
}

function prevPanel() {
  if (currentPanel > 0) {
    currentPanel--;
    renderPanel(currentPanel, 'prev');
  }
}

function goTo(idx) {
  if (idx === currentPanel) return;
  const dir = idx > currentPanel ? 'next' : 'prev';
  currentPanel = idx;
  renderPanel(currentPanel, dir);
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (!document.getElementById('screen-reader').classList.contains('active')) return;
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextPanel(); }
  if (e.key === 'ArrowLeft')                   { e.preventDefault(); prevPanel(); }
  if (e.key === 'Escape')                        showLanding(activeComic);
});

// ── Touch / swipe ─────────────────────────────────────────────────────────────
let touchStartX = 0;
const imgArea = document.getElementById('img-area');

imgArea.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

imgArea.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) nextPanel();
    else        prevPanel();
  }
}, { passive: true });

// ── Init ──────────────────────────────────────────────────────────────────────
buildLibrary();
