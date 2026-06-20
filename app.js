// ---------- Case data: prefer local admin edits (same browser), else bundled cases.js ----------
(function loadActiveCases(){
  try{
    const stored = localStorage.getItem('fireflies_admin_cases');
    if (stored){
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length){
        window.CASES = parsed;
      }
    }
  } catch(e){ /* fall through to bundled CASES from cases.js */ }
})();

// ---------- Firefly ambient canvas ----------
(function(){
  const canvas = document.getElementById('firefly-canvas');
  if (!canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext('2d');
  let w, h, fireflies;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeFirefly(){
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.4,
      baseAlpha: 0.15 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.25,
      driftX: (Math.random() - 0.5) * 0.15,
      driftY: (Math.random() - 0.5) * 0.12,
      flickerSpeed: 0.004 + Math.random() * 0.012
    };
  }

  function init(){
    resize();
    const count = Math.min(70, Math.floor((w * h) / 18000));
    fireflies = Array.from({length: count}, makeFirefly);
  }

  let t = 0;
  function tick(){
    t++;
    ctx.clearRect(0, 0, w, h);
    for (const f of fireflies){
      f.x += f.driftX;
      f.y += f.driftY;
      if (f.x < -10) f.x = w + 10;
      if (f.x > w + 10) f.x = -10;
      if (f.y < -10) f.y = h + 10;
      if (f.y > h + 10) f.y = -10;

      const flicker = (Math.sin(t * f.flickerSpeed + f.phase) + 1) / 2;
      const alpha = f.baseAlpha * (0.35 + flicker * 0.65);

      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 8);
      grad.addColorStop(0, `rgba(232, 217, 168, ${alpha})`);
      grad.addColorStop(1, 'rgba(232, 217, 168, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(245, 244, 240, ${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  init();
  requestAnimationFrame(tick);
})();

// ---------- Case rendering ----------
(function(){
  const grid = document.getElementById('case-grid');
  const emptyState = document.getElementById('empty-state');
  const filters = document.getElementById('filters');
  let activeFilter = 'all';

  const STATUS_LABEL = {
    found: 'Found & reunited',
    unresolved: 'Still missing',
    mystery: 'Unexplained'
  };

  function fmtAge(c){
    if (c.age === 0) return 'infant';
    return `age ${c.age}`;
  }

  function initials(name){
    return name
      .split(' ')
      .filter(w => w.length)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  function portraitMarkup(c){
    if (c.image){
      return `<div class="case-portrait">
        <img src="${c.image}" alt="${c.name}" loading="lazy"
             onerror="this.closest('.case-portrait').innerHTML='<div class=&quot;case-portrait-fallback&quot;>${initials(c.name)}</div>';">
      </div>`;
    }
    return `<div class="case-portrait"><div class="case-portrait-fallback">${initials(c.name)}</div></div>`;
  }

  function cardTemplate(c){
    return `
      <article class="case-card" data-id="${c.id}" tabindex="0" role="button" aria-label="View case: ${c.name}">
        ${portraitMarkup(c)}
        <div class="case-card-body">
        <div class="case-card-top">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span class="status-light ${c.status}"></span>
              <span class="case-status-text ${c.status}">${STATUS_LABEL[c.status]}</span>
            </div>
          </div>
        </div>
        <div class="case-name">${c.name}</div>
        <div class="case-meta mono">${fmtAge(c)} · ${c.date} · ${c.location}</div>
        <p class="case-summary">${c.summary}</p>
        <div class="case-tags">
          ${c.tags.map(tag => `<span class="case-tag">${tag}</span>`).join('')}
        </div>
        </div>
      </article>
    `;
  }

  function render(){
    const list = activeFilter === 'all'
      ? CASES
      : CASES.filter(c => c.status === activeFilter);

    grid.innerHTML = list.map(cardTemplate).join('');
    emptyState.style.display = list.length ? 'none' : 'block';

    // staggered reveal
    const cards = grid.querySelectorAll('.case-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('in-view'), i * 60);
      card.addEventListener('click', () => openOverlay(card.dataset.id));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openOverlay(card.dataset.id);
        }
      });
    });
  }

  function renderStats(){
    const counts = CASES.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});
    animateCount('stat-unresolved', counts.unresolved || 0);
    animateCount('stat-found', counts.found || 0);
    animateCount('stat-mystery', counts.mystery || 0);
  }

  function animateCount(id, target){
    const el = document.getElementById(id);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      cur = Math.min(target, cur + step);
      el.textContent = cur;
      if (cur >= target) clearInterval(interval);
    }, 30);
  }

  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });

  render();
  renderStats();

  // ---------- Overlay ----------
  const overlay = document.getElementById('overlay');
  const overlayBackdrop = document.getElementById('overlay-backdrop');
  const overlayClose = document.getElementById('overlay-close');

  window.openOverlay = function(id){
    const c = CASES.find(c => c.id === id);
    if (!c) return;

    const ovPortrait = document.getElementById('ov-portrait');
    const ovPortraitImg = document.getElementById('ov-portrait-img');
    if (c.image){
      ovPortraitImg.src = c.image;
      ovPortraitImg.alt = c.name;
      ovPortraitImg.onerror = function(){ ovPortrait.style.display = 'none'; };
      ovPortrait.style.display = 'block';
    } else {
      ovPortrait.style.display = 'none';
    }

    document.getElementById('ov-light').className = `status-light ${c.status}`;
    document.getElementById('ov-status-text').className = `case-status-text ${c.status}`;
    document.getElementById('ov-status-text').textContent = STATUS_LABEL[c.status];
    document.getElementById('ov-name').textContent = c.name;
    document.getElementById('ov-meta').innerHTML =
      `<strong>${fmtAge(c)}</strong> &nbsp;·&nbsp; <strong>${c.date}</strong> &nbsp;·&nbsp; <strong>${c.location}</strong>`;
    document.getElementById('ov-body').innerHTML =
      `<p>${c.summary}</p><p>${c.detail}</p>`;

    let sourceHtml = `Source: ${c.source}`;
    if (c.posterUrl){
      sourceHtml += ` &nbsp;·&nbsp; <a href="${c.posterUrl}" target="_blank" rel="noopener" style="color:var(--glow); text-decoration:underline;">View official NCMEC poster →</a>`;
    }
    document.getElementById('ov-source').innerHTML = sourceHtml;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeOverlay(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  overlayBackdrop.addEventListener('click', closeOverlay);
  overlayClose.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });
})();
