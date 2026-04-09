/**
 * app.js — Eric Wachira Comics Reader
 * All navigation, reader, and UI logic lives here.
 * Comic data lives in js/comics.js
 */

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

  // Update landing page content dynamically
  document.getElementById('landing-eyebrow').textContent =
    `${comic.author} · ${comic.tag}`;
  document.getElementById('landing-title').textContent   = comic.title;
  document.getElementById('landing-desc').textContent    = comic.desc;
  document.getElementById('landing-panel-count').textContent = comic.panels;

  // Background cover image
  const bg = document.getElementById('landing-bg');
  bg.style.backgroundImage = `url('${comic.slug}/cover.jpg')`;

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
    const card = document.createElement('div');
    card.className = 'comic-card' + (comic.status === 'coming-soon' ? ' card-soon' : '');
    card.style.animationDelay = `${i * 0.1}s`;

    const coverHTML = comic.status === 'available'
      ? `<img class="card-cover" src="${comic.slug}/cover.jpg" alt="${comic.title} cover">`
      : `<div class="card-cover-placeholder"><div class="placeholder-label">Coming<br>Soon</div></div>`;

    const btnHTML = comic.status === 'available'
      ? `<button class="card-cta" onclick="event.stopPropagation(); showLanding(COMICS[${i}])">
           Read Now
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
         </button>`
      : `<button class="card-cta" disabled>Coming Soon</button>`;

    card.innerHTML = `
      ${coverHTML}
      <div class="card-body">
        <div class="card-tag">${comic.tag}</div>
        <div class="card-title">${comic.title}</div>
        <div class="card-author">by ${comic.author}</div>
        <div class="card-desc">${comic.desc}</div>
        ${btnHTML}
      </div>`;

    if (comic.status === 'available') {
      card.onclick = () => showLanding(comic);
    }

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
    d.onclick   = () => goTo(i);
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
  const newSrc  = `${activeComic.slug}/panel-${String(idx + 1).padStart(2, '0')}.jpg`;

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
    pre.src = `${activeComic.slug}/panel-${String(idx + 2).padStart(2, '0')}.jpg`;
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
