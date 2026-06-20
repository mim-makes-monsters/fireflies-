// ---------- Fireflies Admin ----------
// All data lives in localStorage until exported. No backend, no server calls.

const STORAGE_KEY = 'fireflies_admin_cases';
const ADMIN_KEY_STORAGE = 'fireflies_admin_key';

const STATUS_LABEL = {
  found: 'Found',
  unresolved: 'Still missing',
  mystery: 'Mysterious'
};

// ---------- Data layer ----------
function loadCases(){
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored){
    try { return JSON.parse(stored); }
    catch(e){ console.warn('Could not parse stored cases, falling back to cases.js'); }
  }
  // First run: seed from cases.js (loaded globally as CASES)
  return typeof CASES !== 'undefined' ? JSON.parse(JSON.stringify(CASES)) : [];
}

function saveCases(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  markDirty(true);
}

let cases = loadCases();
let editingId = null;
let activeFilter = 'all';
let searchTerm = '';
let sortKey = null;
let sortDir = 1;

// ---------- Auth (lightweight, local-only gate — not real security) ----------
function getAdminKey(){ return localStorage.getItem(ADMIN_KEY_STORAGE); }
function setAdminKey(key){ localStorage.setItem(ADMIN_KEY_STORAGE, key); }

function showLock(){
  document.getElementById('lock-screen').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}
function showDashboard(){
  document.getElementById('lock-screen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  renderAll();
}

(function initAuth(){
  const existingKey = getAdminKey();
  const sessionUnlocked = sessionStorage.getItem('fireflies_unlocked');

  if (!existingKey){
    // No key set yet — first-time setup happens via "Set a new admin key"
    showLock();
  } else if (sessionUnlocked === 'true'){
    showDashboard();
  } else {
    showLock();
  }

  document.getElementById('unlock-btn').addEventListener('click', attemptUnlock);
  document.getElementById('admin-key-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptUnlock();
  });

  document.getElementById('set-key-btn').addEventListener('click', () => {
    const newKey = prompt('Choose an admin key. You\'ll need to enter this each time you open the dashboard on this device.');
    if (newKey && newKey.trim()){
      setAdminKey(newKey.trim());
      sessionStorage.setItem('fireflies_unlocked', 'true');
      showToast('Admin key set for this browser');
      showDashboard();
    }
  });

  function attemptUnlock(){
    const input = document.getElementById('admin-key-input').value;
    const key = getAdminKey();
    if (!key){
      showToast('No admin key set yet — use "Set a new admin key" below');
      return;
    }
    if (input === key){
      sessionStorage.setItem('fireflies_unlocked', 'true');
      showDashboard();
    } else {
      showToast('That key doesn\'t match');
    }
  }

  document.getElementById('lock-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem('fireflies_unlocked');
    showLock();
  });
})();

// ---------- Dirty state / export banner ----------
function markDirty(isDirty){
  const banner = document.getElementById('export-banner');
  const title = document.getElementById('export-title');
  const desc = document.getElementById('export-desc');
  if (!banner) return;
  if (isDirty){
    banner.classList.add('dirty');
    title.textContent = 'You have unsaved changes';
    desc.innerHTML = 'These edits only exist in this browser right now. Export <span class="mono">cases.js</span> and upload it to your host to make them real.';
  } else {
    banner.classList.remove('dirty');
    title.textContent = 'Changes are saved in this browser only';
    desc.innerHTML = 'To make your edits go live on the real site, export <span class="mono">cases.js</span> and upload it to wherever Fireflies is hosted, replacing the old file.';
  }
}

// ---------- Rendering ----------
function renderAll(){
  renderPills();
  renderRows();
}

function renderPills(){
  const counts = cases.reduce((acc, c) => { acc[c.status] = (acc[c.status]||0)+1; return acc; }, {});
  const pills = document.getElementById('stat-pills');
  pills.innerHTML = `
    <div class="pill"><span class="dot" style="background:var(--ink-faint)"></span>${cases.length} total</div>
    <div class="pill"><span class="dot" style="background:var(--unresolved)"></span>${counts.unresolved||0} still missing</div>
    <div class="pill"><span class="dot" style="background:var(--found)"></span>${counts.found||0} found</div>
    <div class="pill"><span class="dot" style="background:var(--mystery)"></span>${counts.mystery||0} mysterious</div>
  `;
}

function getFilteredSorted(){
  let list = [...cases];
  if (activeFilter !== 'all') list = list.filter(c => c.status === activeFilter);
  if (searchTerm.trim()){
    const q = searchTerm.toLowerCase();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.location || '').toLowerCase().includes(q)
    );
  }
  if (sortKey){
    list.sort((a, b) => {
      let av = (a[sortKey] || '').toString().toLowerCase();
      let bv = (b[sortKey] || '').toString().toLowerCase();
      if (sortKey === 'date'){
        av = new Date(a.date).getTime() || 0;
        bv = new Date(b.date).getTime() || 0;
      }
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });
  }
  return list;
}

function initials(name){
  return (name || '?').split(' ').filter(w=>w.length).slice(0,2).map(w=>w[0]).join('').toUpperCase();
}

function renderRows(){
  const tbody = document.getElementById('case-rows');
  const list = getFilteredSorted();

  if (!list.length){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No cases match. Try a different search or filter — or add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(c => `
    <tr draggable="true" data-id="${c.id}">
      <td><span class="drag-handle" title="Drag to reorder">⠿</span></td>
      <td>
        ${c.image
          ? `<img class="row-thumb" src="${c.image}" alt="" onerror="this.outerHTML='<div class=&quot;row-thumb-fallback&quot;>${initials(c.name)}</div>'">`
          : `<div class="row-thumb-fallback">${initials(c.name)}</div>`}
      </td>
      <td>
        <div class="row-name">${c.name}</div>
        <div class="row-meta mono">${c.age === 0 ? 'infant' : 'age ' + c.age}</div>
      </td>
      <td>
        <span class="status-badge ${c.status}"><span class="dot" style="background:currentColor"></span>${STATUS_LABEL[c.status]}</span>
      </td>
      <td class="mono" style="font-size:0.78rem; color:var(--ink-dim);">${c.date}</td>
      <td style="font-size:0.82rem; color:var(--ink-dim);">${c.location}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn edit-btn" data-id="${c.id}" title="Edit">✎</button>
          <button class="icon-btn danger del-btn" data-id="${c.id}" title="Delete">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-btn').forEach(btn =>
    btn.addEventListener('click', () => openDrawer(btn.dataset.id)));
  tbody.querySelectorAll('.del-btn').forEach(btn =>
    btn.addEventListener('click', () => deleteCase(btn.dataset.id)));

  setupDragSort(tbody);
}

// ---------- Drag to reorder ----------
function setupDragSort(tbody){
  let dragEl = null;

  tbody.querySelectorAll('tr[draggable="true"]').forEach(row => {
    row.addEventListener('dragstart', () => {
      dragEl = row;
      row.classList.add('dragging');
    });
    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      dragEl = null;
      // Commit new order to `cases` array based on DOM order of visible ids
      const visibleIds = [...tbody.querySelectorAll('tr[data-id]')].map(r => r.dataset.id);
      const reordered = visibleIds.map(id => cases.find(c => c.id === id)).filter(Boolean);
      const remaining = cases.filter(c => !visibleIds.includes(c.id));
      cases = [...reordered, ...remaining];
      saveCases(cases);
    });
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      const after = getRowAfter(tbody, e.clientY);
      if (!dragEl) return;
      if (after == null){
        tbody.appendChild(dragEl);
      } else {
        tbody.insertBefore(dragEl, after);
      }
    });
  });
}

function getRowAfter(tbody, y){
  const rows = [...tbody.querySelectorAll('tr[draggable="true"]:not(.dragging)')];
  return rows.reduce((closest, row) => {
    const box = row.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset){
      return { offset, element: row };
    }
    return closest;
  }, { offset: -Infinity, element: null }).element;
}

// ---------- Drawer (add/edit form) ----------
const drawer = document.getElementById('drawer');
const drawerBackdrop = document.getElementById('drawer-backdrop');
let currentTags = [];

function openDrawer(id){
  editingId = id || null;
  const c = id ? cases.find(c => c.id === id) : null;

  document.getElementById('drawer-title').textContent = c ? 'Edit case' : 'Add a case';
  document.getElementById('delete-case-btn').style.display = c ? 'block' : 'none';

  document.getElementById('f-name').value = c?.name || '';
  document.getElementById('f-age').value = c?.age ?? '';
  document.getElementById('f-date').value = c?.date || '';
  document.getElementById('f-location').value = c?.location || '';
  document.getElementById('f-image').value = c?.image || '';
  document.getElementById('f-posterUrl').value = c?.posterUrl || '';
  document.getElementById('f-summary').value = c?.summary || '';
  document.getElementById('f-detail').value = c?.detail || '';
  document.getElementById('f-source').value = c?.source || '';

  currentTags = c?.tags ? [...c.tags] : [];
  renderTags();
  updateImagePreview();

  const status = c?.status || 'unresolved';
  document.querySelectorAll('.status-radio').forEach(r => {
    r.classList.toggle('checked', r.dataset.status === status);
    r.querySelector('input').checked = r.dataset.status === status;
  });

  drawer.classList.add('open');
  drawerBackdrop.classList.add('open');
}

function closeDrawer(){
  drawer.classList.remove('open');
  drawerBackdrop.classList.remove('open');
  editingId = null;
}

document.getElementById('add-case-btn').addEventListener('click', () => openDrawer(null));
document.getElementById('drawer-close').addEventListener('click', closeDrawer);
document.getElementById('cancel-edit-btn').addEventListener('click', closeDrawer);
drawerBackdrop.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

document.querySelectorAll('.status-radio').forEach(r => {
  r.addEventListener('click', () => {
    document.querySelectorAll('.status-radio').forEach(x => {
      x.classList.remove('checked');
      x.querySelector('input').checked = false;
    });
    r.classList.add('checked');
    r.querySelector('input').checked = true;
  });
});

document.getElementById('f-image').addEventListener('input', updateImagePreview);
function updateImagePreview(){
  const url = document.getElementById('f-image').value.trim();
  const preview = document.getElementById('f-image-preview');
  if (!url){
    preview.innerHTML = 'no image yet';
    return;
  }
  preview.innerHTML = `<img src="${url}" onerror="this.parentElement.innerHTML='could not load that url'">`;
}

// Tags
function renderTags(){
  const area = document.getElementById('tag-area');
  const input = document.getElementById('f-tag-input');
  area.querySelectorAll('.tag-chip').forEach(el => el.remove());
  currentTags.forEach((tag, i) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `${tag} <button type="button" data-i="${i}">✕</button>`;
    chip.querySelector('button').addEventListener('click', () => {
      currentTags.splice(i, 1);
      renderTags();
    });
    area.insertBefore(chip, input);
  });
}
document.getElementById('f-tag-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.value.trim()){
    e.preventDefault();
    currentTags.push(e.target.value.trim());
    e.target.value = '';
    renderTags();
  }
});

// Save
document.getElementById('save-case-btn').addEventListener('click', () => {
  const name = document.getElementById('f-name').value.trim();
  if (!name){
    showToast('A case needs a name, at least');
    return;
  }
  const statusEl = document.querySelector('.status-radio.checked');
  const status = statusEl ? statusEl.dataset.status : 'unresolved';

  const payload = {
    id: editingId || slugify(name) + '-' + Date.now().toString(36),
    name,
    status,
    age: parseInt(document.getElementById('f-age').value, 10) || 0,
    date: document.getElementById('f-date').value.trim(),
    location: document.getElementById('f-location').value.trim(),
    image: document.getElementById('f-image').value.trim(),
    posterUrl: document.getElementById('f-posterUrl').value.trim(),
    summary: document.getElementById('f-summary').value.trim(),
    detail: document.getElementById('f-detail').value.trim(),
    source: document.getElementById('f-source').value.trim(),
    tags: [...currentTags]
  };

  if (editingId){
    const idx = cases.findIndex(c => c.id === editingId);
    if (idx > -1) cases[idx] = payload;
  } else {
    cases.unshift(payload);
  }

  saveCases(cases);
  closeDrawer();
  renderAll();
  showToast(editingId ? 'Case updated' : 'Case added');
});

document.getElementById('delete-case-btn').addEventListener('click', () => {
  if (!editingId) return;
  if (confirm('Delete this case? This can\'t be undone here (but you can re-add it manually).')){
    cases = cases.filter(c => c.id !== editingId);
    saveCases(cases);
    closeDrawer();
    renderAll();
    showToast('Case deleted');
  }
});

function deleteCase(id){
  const c = cases.find(c => c.id === id);
  if (!c) return;
  if (confirm(`Delete "${c.name}"? This can't be undone here.`)){
    cases = cases.filter(c => c.id !== id);
    saveCases(cases);
    renderAll();
    showToast('Case deleted');
  }
}

function slugify(str){
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---------- Search / filter / sort controls ----------
document.getElementById('search-box').addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderRows();
});

document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderRows();
  });
});

document.querySelectorAll('.case-table th[data-sort]').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (sortKey === key){ sortDir *= -1; }
    else { sortKey = key; sortDir = 1; }
    renderRows();
  });
});

// ---------- Export / Import ----------
document.getElementById('export-btn').addEventListener('click', () => {
  const fileContent = buildCasesFile(cases);
  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cases.js';
  a.click();
  URL.revokeObjectURL(url);
  markDirty(false);
  showToast('cases.js downloaded — upload it to your host to go live');
});

function buildCasesFile(list){
  const header = `// Fireflies — case archive data\n// Exported from the admin dashboard.\n// Status values: "unresolved" | "found" | "mystery"\n\nconst CASES = `;
  const footer = `;\n`;
  return header + JSON.stringify(list, null, 2) + footer;
}

document.getElementById('import-btn').addEventListener('click', () => {
  document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const text = evt.target.result;
      const match = text.match(/const\s+CASES\s*=\s*(\[[\s\S]*\]);?/);
      if (!match) throw new Error('Could not find CASES array in file');
      const imported = JSON.parse(match[1]);
      if (!Array.isArray(imported)) throw new Error('Not a valid case list');
      cases = imported;
      saveCases(cases);
      renderAll();
      showToast(`Imported ${imported.length} cases`);
    } catch(err){
      showToast('Could not read that file — is it a valid cases.js?');
      console.error(err);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// ---------- Toast ----------
let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  document.getElementById('toast-text').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
