// ═══════════ NAVBAR SCROLL + SCROLLSPY ═══════════
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const navActions = document.getElementById('nav-actions');
const spySections = ['how-it-works', 'features', 'employers', 'about', 'download']
  .map(id => document.getElementById(id)).filter(Boolean);

function updateNav() {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 50);

  if (navActions) {
    const hero = document.getElementById('hero');
    navActions.classList.toggle('nav-actions-visible', hero ? scrollY > hero.offsetHeight * 0.8 : scrollY > 400);
  }

  const mid = window.innerHeight * 0.35;
  let active = null;
  spySections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= mid) active = sec;
  });

  navLinks.forEach(a => {
    const matches = active && a.getAttribute('href') === '#' + active.id;
    a.classList.toggle('nav-active', matches);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ═══════════ MOBILE MENU ═══════════
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('active'));
});

// ═══════════ SMOOTH SCROLL FOR NAV LINKS ═══════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const sel = anchor.getAttribute('href');
    if (!sel || sel === '#') return; // bare hash — nechat auth handlery pracovat
    try {
      const target = document.querySelector(sel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (_) { /* invalid selector — skip */ }
  });
});

// ═══════════ COUNTER ANIMATION ═══════════
function animateCounters() {
  const counters = document.querySelectorAll('.hero-stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      counter.textContent = target >= 1000 ? current.toLocaleString('cs-CZ') : current;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ═══════════ SCROLL REVEAL ═══════════
function setupReveal() {
  const revealElements = document.querySelectorAll(
    '.step-card, .feature-card, .testimonial-card, .download-card, .section-header'
  );
  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
        entry.target.addEventListener('transitionend', () => {
          entry.target.style.willChange = 'auto';
        }, { once: true });
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => observer.observe(el));
}

// ═══════════ HERO COUNTER TRIGGER ═══════════
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ═══════════ DASHBOARD PREVIEW MODAL ═══════════
function initDashboardPreview() {
  const overlay = document.getElementById('dash-overlay');
  const closeBtn = document.getElementById('dash-close');
  const openBtn  = document.getElementById('dashboard-preview-btn');
  const regBtn   = document.getElementById('dash-register-btn');
  if (!overlay) return;

  function open()  { overlay.classList.add('active');    document.body.style.overflow = 'hidden'; }
  function close() { overlay.classList.remove('active'); document.body.style.overflow = ''; }

  if (openBtn) openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  if (regBtn) regBtn.addEventListener('click', e => { e.preventDefault(); close(); });
}

// ═══════════ MINI-CARD DESCRIPTIONS ═══════════
const MC_DESCS = {
  'Číšník': 'Hledáš práci, která nebude každý den stejná? Přidej se k nám — nabízíme pravidelnou mzdu, bonusy, tréninky a kariérní rozvoj bez stropu.\n\nKoho hledáme?\nLidi, kteří se rádi učí a zvládají ranní, odpolední i noční směny.\n\nCo nabízíme:\n• Nástupní mzda 34 100 Kč (po roce 37 900 Kč)\n• Nápoje na směnách zdarma\n• Příplatky za noční, svátky a víkendy\n• Benefit karta (McDonald\'s + partneři)\n• Výplata do 10. dne v měsíci\n• Neomezený kariérní rozvoj',
};

// ── sdílená pomocná funkce pro backdrop ──
const _isTouch = 'ontouchstart' in window;
function openPopup(popup) {
  popup.classList.add('visible');
  if (_isTouch) {
    const bd = document.getElementById('popup-backdrop');
    if (bd) bd.classList.add('visible');
  }
}
function closePopup(popup) {
  popup.classList.remove('visible');
  if (_isTouch) {
    const bd = document.getElementById('popup-backdrop');
    if (bd) bd.classList.remove('visible');
  }
}

// ═══════════ MINI-CARD POPUP ═══════════
function initMcPopup() {
  const isTouch = 'ontouchstart' in window;
  const popup    = document.getElementById('mc-popup');
  if (!popup) return;
  const titleEl  = document.getElementById('mc-popup-title');
  const salaryEl = document.getElementById('mc-popup-salary');
  const descEl   = document.getElementById('mc-popup-desc');
  const tagEl    = document.getElementById('mc-popup-tag');
  const dppEl    = document.getElementById('mc-popup-dpp');
  const hppEl    = document.getElementById('mc-popup-hpp');
  const badgesEl = document.getElementById('mc-popup-badges');

  const BADGE_DEFS = {
    urgent:   { label: 'Spěchá',    cls: 'mc-badge-urgent' },
    featured: { label: 'Topováno',  cls: 'mc-badge-featured' },
  };

  function fillPopup(card) {
    const title = card.dataset.title || '';
    const type  = card.dataset.type  || 'Brigáda';
    titleEl.textContent  = title;
    salaryEl.textContent = card.dataset.salary || '';
    tagEl.textContent    = type;
    descEl.textContent   = MC_DESCS[title] || card.dataset.desc || '';
    const contract = card.dataset.contract || '';
    dppEl.style.display  = type === 'Brigáda' ? 'inline-block' : 'none';
    if (type === 'Full-time' && contract) {
      hppEl.textContent   = contract;
      hppEl.style.display = 'inline-block';
    } else {
      hppEl.style.display = 'none';
    }
    badgesEl.innerHTML = '';
    (card.dataset.badges || '').split(',').filter(Boolean).forEach(key => {
      const def = BADGE_DEFS[key.trim()];
      if (!def) return;
      const span = document.createElement('span');
      span.className = `mc-badge ${def.cls}`;
      span.textContent = def.label;
      badgesEl.appendChild(span);
    });
    badgesEl.style.display = badgesEl.children.length ? 'flex' : 'none';
  }

  if (isTouch) {
    document.addEventListener('click', e => {
      if (e.target.closest('.popup-close-btn') && e.target.closest('#mc-popup')) {
        closePopup(popup); return;
      }
      const card = e.target.closest('.mini-card');
      if (card) { fillPopup(card); openPopup(popup); return; }
    });
    document.getElementById('popup-backdrop')?.addEventListener('click', () => closePopup(popup));
  } else {
    let activeCard = null;
    document.addEventListener('mouseover', e => {
      const card = e.target.closest('.mini-card');
      if (!card) return;
      if (card === activeCard) return;
      activeCard = card;
      fillPopup(card);
      openPopup(popup);
    });
    document.addEventListener('mouseout', e => {
      if (!e.target.closest('.mini-card')) return;
      if (e.relatedTarget && e.relatedTarget.closest('.mini-card')) return;
      activeCard = null;
      closePopup(popup);
    });
  }
}

// ═══════════ REWARDS FEATURE POPUP ═══════════
function initOdPopup() {
  const isTouch = 'ontouchstart' in window;
  const popup = document.getElementById('od-popup');
  if (!popup) return;

  if (isTouch) {
    document.addEventListener('click', e => {
      if (e.target.closest('.popup-close-btn') && e.target.closest('#od-popup')) { closePopup(popup); return; }
      if (e.target.closest('[data-feature-popup="rewards"]')) { openPopup(popup); return; }
    });
    document.getElementById('popup-backdrop')?.addEventListener('click', () => closePopup(popup));
  } else {
    let active = false;
    document.addEventListener('mouseover', e => {
      if (!e.target.closest('[data-feature-popup="rewards"]')) return;
      if (active) return;
      active = true;
      openPopup(popup);
    });
    document.addEventListener('mouseout', e => {
      const card = e.target.closest('[data-feature-popup="rewards"]');
      if (!card) return;
      if (e.relatedTarget && e.relatedTarget.closest('[data-feature-popup="rewards"]')) return;
      active = false;
      closePopup(popup);
    });
  }
}

// ═══════════ REVIEWS FEATURE POPUP ═══════════
function initRvPopup() {
  const isTouch = 'ontouchstart' in window;
  const popup = document.getElementById('rv-popup');
  if (!popup) return;

  if (isTouch) {
    document.addEventListener('click', e => {
      if (e.target.closest('.popup-close-btn') && e.target.closest('#rv-popup')) { closePopup(popup); return; }
      if (e.target.closest('[data-feature-popup="reviews"]')) { openPopup(popup); return; }
    });
    document.getElementById('popup-backdrop')?.addEventListener('click', () => closePopup(popup));
  } else {
    let active = false;
    document.addEventListener('mouseover', e => {
      if (!e.target.closest('[data-feature-popup="reviews"]')) return;
      if (active) return;
      active = true;
      openPopup(popup);
    });
    document.addEventListener('mouseout', e => {
      const card = e.target.closest('[data-feature-popup="reviews"]');
      if (!card) return;
      if (e.relatedTarget && e.relatedTarget.closest('[data-feature-popup="reviews"]')) return;
      active = false;
      closePopup(popup);
    });
  }
}

// ═══════════ VERIFY FEATURE POPUP ═══════════
function initVfPopup() {
  const isTouch = 'ontouchstart' in window;
  const popup = document.getElementById('vf-popup');
  if (!popup) return;

  if (isTouch) {
    document.addEventListener('click', e => {
      if (e.target.closest('.popup-close-btn') && e.target.closest('#vf-popup')) { closePopup(popup); return; }
      if (e.target.closest('[data-feature-popup="verify"]')) { openPopup(popup); return; }
    });
    document.getElementById('popup-backdrop')?.addEventListener('click', () => closePopup(popup));
  } else {
    let active = false;
    document.addEventListener('mouseover', e => {
      if (!e.target.closest('[data-feature-popup="verify"]')) return;
      if (active) return;
      active = true;
      openPopup(popup);
    });
    document.addEventListener('mouseout', e => {
      const card = e.target.closest('[data-feature-popup="verify"]');
      if (!card) return;
      if (e.relatedTarget && e.relatedTarget.closest('[data-feature-popup="verify"]')) return;
      active = false;
      closePopup(popup);
    });
  }
}

// ═══════════ COMPANY POPUP ═══════════
function initCoPopup() {
  const isTouch = 'ontouchstart' in window;
  const popup  = document.getElementById('co-popup');
  if (!popup) return;
  const nameEl   = document.getElementById('co-popup-name');
  const badgeEl  = document.getElementById('co-popup-badge');
  const ratingEl = document.getElementById('co-popup-rating');
  const cityEl   = document.getElementById('co-popup-city');
  const descEl   = document.getElementById('co-popup-desc');
  const mapsEl   = document.getElementById('co-popup-maps');

  function fillCo(item) {
    const name = item.childNodes[0].textContent.trim();
    const city = item.dataset.city || '';
    nameEl.textContent    = name;
    ratingEl.textContent  = item.dataset.rating || '';
    cityEl.textContent    = city;
    descEl.textContent    = item.dataset.desc   || '';
    badgeEl.style.display = item.dataset.verified ? 'inline' : 'none';
    if (mapsEl) mapsEl.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' ' + city);
  }

  if (isTouch) {
    document.addEventListener('click', e => {
      if (e.target.closest('.popup-close-btn') && e.target.closest('#co-popup')) { closePopup(popup); return; }
      const item = e.target.closest('.logo-item');
      if (item) { fillCo(item); openPopup(popup); return; }
    });
    document.getElementById('popup-backdrop')?.addEventListener('click', () => closePopup(popup));
  } else {
    let activeItem = null;
    document.addEventListener('mouseover', e => {
      const item = e.target.closest('.logo-item');
      if (!item) return;
      if (item === activeItem) return;
      activeItem = item;
      fillCo(item);
      openPopup(popup);
    });
    document.addEventListener('mouseout', e => {
      if (!e.target.closest('.logo-item')) return;
      if (e.relatedTarget && e.relatedTarget.closest('.logo-item')) return;
      activeItem = null;
      closePopup(popup);
    });
  }
}

// ═══════════ LOCATION MODAL ═══════════
function initLtModal() {
  const modal     = document.getElementById('lt-modal');
  if (!modal) return;
  const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';
  const overlay     = document.getElementById('lt-modal-overlay');
  const closeBtn    = document.getElementById('lt-modal-close');
  const cityInput   = document.getElementById('lt-city-input');
  const radiusSel   = document.getElementById('lt-radius-select');
  const locateBtn   = document.getElementById('lt-locate-btn');
  const pinBtn      = document.getElementById('lt-pin-btn');
  const noteEl      = document.getElementById('lt-modal-note');
  const suggestList = document.getElementById('lt-suggestions');

  let map = null, circle = null, marker = null;
  let debounceTimer = null;
  let suggestions = [];
  let pinMode = false;

  function setPinMode(on) {
    pinMode = on;
    pinBtn.classList.toggle('active', on);
    const mapEl = document.getElementById('lt-map');
    if (mapEl) mapEl.classList.toggle('pin-mode', on);
    noteEl.textContent = on ? 'Klikni na mapu pro nastavení středu.' : '';
  }

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (!map) initMap(50.0755, 14.4378);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

function initMap(lat, lng) {
    map = L.map('lt-map', { zoomControl: false, attributionControl: false }).setView([lat, lng], 12);
    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`, { maxZoom: 22, tileSize: 512, zoomOffset: -1 }).addTo(map);
    const r = parseInt(radiusSel.value) * 1000;
    marker = L.circleMarker([lat, lng], { radius: 7, color: '#e02020', fillColor: '#e02020', fillOpacity: 1, weight: 2 }).addTo(map);
    circle = L.circle([lat, lng], { radius: r, color: '#1a6fba', fillColor: '#1a6fba', fillOpacity: 0.12, weight: 2 }).addTo(map);
    map.fitBounds(circle.getBounds());

    map.on('click', async e => {
      if (!pinMode) return;
      const { lat, lng } = e.latlng;
      setPinMode(false);
      updateCircle(lat, lng);
      try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place,locality,neighborhood&language=cs&access_token=${MAPBOX_TOKEN}`);
        const d = await res.json();
        cityInput.value = d.features?.[0]?.text || '';
        noteEl.textContent = '';
      } catch {}
    });
  }

  function updateCircle(lat, lng) {
    const r = parseInt(radiusSel.value) * 1000;
    if (marker) marker.setLatLng([lat, lng]);
    if (circle) { circle.setLatLng([lat, lng]); circle.setRadius(r); map.fitBounds(circle.getBounds()); }
  }

  function hideSuggestions() {
    suggestList.classList.remove('visible');
    suggestList.innerHTML = '';
  }

  function showSuggestions(features) {
    suggestList.innerHTML = '';
    if (!features.length) { hideSuggestions(); return; }
    features.forEach(feature => {
      const li = document.createElement('li');
      li.className = 'lt-suggestion-item';
      const name = feature.text;
      const sub  = feature.place_name.split(',').slice(1, 3).join(',').trim();
      li.innerHTML = `<span class="lt-suggestion-name">${name}</span>${sub ? `<span class="lt-suggestion-sub">${sub}</span>` : ''}`;
      li.addEventListener('mousedown', e => {
        e.preventDefault();
        cityInput.value = name;
        hideSuggestions();
        updateCircle(feature.center[1], feature.center[0]);
      });
      suggestList.appendChild(li);
    });
    suggestList.classList.add('visible');
  }

  async function fetchSuggestions(query) {
    try {
      const proximity = marker ? `${marker.getLatLng().lng},${marker.getLatLng().lat}` : '15.4749,49.8175';
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place,locality,neighborhood,postcode,address&language=cs&country=cz,sk&limit=5&proximity=${proximity}&access_token=${MAPBOX_TOKEN}`);
      const data = await res.json();
      const features = data.features || [];
      showSuggestions(features);
      if (features.length) {
        updateCircle(features[0].center[1], features[0].center[0]);
      } else {
        noteEl.textContent = 'Místo nenalezeno.';
      }
    } catch { noteEl.textContent = 'Chyba při hledání.'; }
  }

  // Click on feature card
  document.addEventListener('click', e => {
    if (e.target.closest('[data-location-modal]')) openModal();
    if (!e.target.closest('.lt-input-wrap')) hideSuggestions();
  });

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.getElementById('lt-save-btn').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  cityInput.addEventListener('input', () => {
    noteEl.textContent = '';
    clearTimeout(debounceTimer);
    const q = cityInput.value.trim();
    if (!q) { hideSuggestions(); return; }
    debounceTimer = setTimeout(() => fetchSuggestions(q), 320);
  });

  cityInput.addEventListener('blur', () => {
    setTimeout(hideSuggestions, 150);
  });

  radiusSel.addEventListener('change', () => {
    if (circle && marker) {
      const r = parseInt(radiusSel.value) * 1000;
      circle.setRadius(r);
      map.fitBounds(circle.getBounds());
    }
  });

  pinBtn.addEventListener('click', () => {
    if (!map) return;
    setPinMode(!pinMode);
  });

  locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) { noteEl.textContent = 'Geolokace není podporována.'; return; }
    noteEl.textContent = 'Zjišťuji polohu…';
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        noteEl.textContent = '';
        if (!map) initMap(lat, lng);
        else updateCircle(lat, lng);
        try {
          const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place,locality,neighborhood&language=cs&access_token=${MAPBOX_TOKEN}`);
          const d = await res.json();
          cityInput.value = d.features?.[0]?.text || '';
        } catch {}
      },
      () => { noteEl.textContent = 'Polohu se nepodařilo získat. Povol přístup v prohlížeči.'; }
    );
  });
}

// ═══════════ SPEED VIZ ═══════════
function initSpeedViz() {
  const slider   = document.getElementById('speed-slider');
  const makejEl  = document.getElementById('speed-makej');
  const portalEl = document.getElementById('speed-portaly');
  if (!slider) return;

  function update() {
    const hours = parseInt(slider.value);
    const pct   = (hours / 168 * 100).toFixed(1) + '%';
    slider.style.setProperty('--pct', pct);
    makejEl.textContent  = Math.floor(hours / 2);
    portalEl.textContent = Math.floor(hours / 24);
  }

  slider.addEventListener('input', update);
  update();
}

// ─── Spustit hned — script je na konci body, DOM je připraven ───
initMcPopup();
initCoPopup();
initOdPopup();
initRvPopup();
initVfPopup();
initLtModal();
initSpeedViz();

// ═══════════ INIT ═══════════
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  initAuth();
  initDashboardPreview();
});

// ═══════════ AUTH / SUPABASE ═══════════
const SUPABASE_URL = 'https://cxegfwfbgcgpwerfbvra.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_N_BIwMCTD6ZOTrtBl3juyw_CGIQ_lvh';

function initAuth() {
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, storageKey: 'makej-auth' }
  });

  const overlay      = document.getElementById('modal-overlay');
  const loginModal   = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  let selectedRole = 'worker';

  // ─── Modal open/close ───
  function openModal(type, role) {
    overlay.classList.add('active');
    if (type === 'login') {
      loginModal.classList.add('active');
      registerModal.classList.remove('active');
      const p = document.getElementById('main-peeker');
      if (p) { p.style.animation = 'none'; requestAnimationFrame(() => { p.style.animation = 'peekerIn 0.45s cubic-bezier(.2,.8,.2,1) both'; }); }
    } else {
      registerModal.classList.add('active');
      loginModal.classList.remove('active');
      if (role) {
        applyRole(role);
        showRegStep(2);
      } else {
        showRegStep(1);
      }
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModals() {
    overlay.classList.remove('active');
    loginModal.classList.remove('active');
    registerModal.classList.remove('active');
    document.body.style.overflow = '';
    clearErrors();
  }

  function clearErrors() {
    ['login-error', 'register-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.remove('visible'); }
    });
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.add('visible');
    if (id === 'login-error') {
      const peeker = document.getElementById('main-peeker');
      if (peeker) {
        peeker.style.transition = 'none';
        peeker.style.animation = 'none';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          peeker.style.animation = 'peekerShake 0.55s ease-in-out both';
          peeker.addEventListener('animationend', () => {
            peeker.style.animation = '';
            peeker.style.transition = '';
          }, { once: true });
        }));
      }
    }
  }

  // ─── Register steps ───
  function showRegStep(n) {
    document.getElementById('reg-step-1').style.display = n === 1 ? 'block' : 'none';
    document.getElementById('reg-step-2').style.display = n === 2 ? 'block' : 'none';
  }

  function applyRole(role) {
    selectedRole = role;
    document.getElementById('reg-role-subtitle').textContent =
      role === 'worker' ? 'Brigádník' : 'Zaměstnavatel';
    document.getElementById('reg-company-group').style.display =
      role === 'employer' ? 'block' : 'none';
  }

  // ─── Nav update ───
  // Voláno z onAuthStateChange — jednoduše vymění obsah nav a přidá listenery na nové prvky
  function updateNavAuth(user) {
    const navActions    = document.querySelector('.nav-actions');
    const mobileActions = document.querySelector('.mobile-menu-actions');

    if (user) {
      navbar.classList.add('nav-logged-in');
      const name = user.user_metadata?.name || user.email.split('@')[0];
      const role = user.user_metadata?.role;
      const dashBtn = role === 'employer'
        ? `<a href="/employer/" class="btn-primary" id="dashboard-btn">
             <iconify-icon icon="solar:chart-square-bold" width="16"></iconify-icon>
             Dashboard
           </a>`
        : `<a href="/worker/" class="btn-primary" id="worker-btn">
             <iconify-icon icon="solar:case-round-bold" width="16"></iconify-icon>
             Moje brigády
           </a>`;
      navActions.innerHTML = `
        ${dashBtn}
        <span class="nav-user-greeting">Ahoj, ${name}!</span>
        <button class="btn-ghost" id="logout-btn">Odhlásit se</button>
      `;
      mobileActions.innerHTML = `
        ${role === 'employer'
          ? `<a href="/employer/" class="btn-primary">Dashboard</a>`
          : `<a href="/worker/" class="btn-primary">Moje brigády</a>`}
        <span class="nav-user-greeting">Ahoj, ${name}!</span>
        <button class="btn-ghost" id="logout-btn-mobile">Odhlásit se</button>
      `;
      document.getElementById('logout-btn').addEventListener('click', () => sb.auth.signOut());
      document.getElementById('logout-btn-mobile').addEventListener('click', () => sb.auth.signOut());
    } else {
      navbar.classList.remove('nav-logged-in');
      navActions.innerHTML = `
        <a href="javascript:void(0)" class="btn-ghost" id="nav-login-btn">Přihlásit se</a>
        <a href="javascript:void(0)" class="btn-primary" id="nav-register-btn">Vytvořit účet</a>
      `;
      mobileActions.innerHTML = `
        <a href="javascript:void(0)" class="btn-ghost" id="mobile-login-btn">Přihlásit se</a>
        <a href="javascript:void(0)" class="btn-primary" id="mobile-register-btn">Vytvořit účet</a>
      `;
      // Bind jen čerstvě vytvořené nav prvky (employer btn se binduje zvlášť, jen jednou)
      [
        ['nav-login-btn',      'login'],
        ['nav-register-btn',   'register'],
        ['mobile-login-btn',   'login'],
        ['mobile-register-btn','register'],
      ].forEach(([id, type]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', e => { e.preventDefault(); openModal(type); });
      });
    }
  }

  // ─── Nav-actions: event delegation — funguje i po přepsání innerHTML ───
  const navActionsEl = document.getElementById('nav-actions');
  if (navActionsEl) {
    navActionsEl.addEventListener('click', e => {
      const btn = e.target.closest('#nav-login-btn, #nav-register-btn');
      if (!btn) return;
      e.preventDefault();
      openModal(btn.id === 'nav-login-btn' ? 'login' : 'register');
    });
  }

  // ─── Statická tlačítka (nejsou nikdy přepisována) — bindujeme jen jednou ───
  const employerBtn = document.getElementById('employer-register-btn');
  if (employerBtn) {
    employerBtn.addEventListener('click', e => { e.preventDefault(); openModal('register', 'employer'); });
  }
  const heroLoginBtn    = document.getElementById('hero-login-btn');
  const heroRegisterBtn = document.getElementById('hero-register-btn');
  if (heroLoginBtn)    heroLoginBtn.addEventListener('click',    e => { e.preventDefault(); openModal('login'); });
  if (heroRegisterBtn) heroRegisterBtn.addEventListener('click', e => { e.preventDefault(); openModal('register'); });

  // Escape key zavře modál
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModals();
  });

  // ─── Modal UI events ───
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModals(); });
  document.getElementById('login-close').addEventListener('click', closeModals);
  document.getElementById('register-close').addEventListener('click', closeModals);
  document.getElementById('switch-to-register').addEventListener('click', e => { e.preventDefault(); openModal('register'); });
  document.getElementById('switch-to-login').addEventListener('click', e => { e.preventDefault(); openModal('login'); });
  document.getElementById('reg-back').addEventListener('click', () => showRegStep(1));

  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => {
      applyRole(card.dataset.role);
      showRegStep(2);
    });
  });

  // ─── Login form — stejná logika jako makej/src/app/(auth)/login/page.tsx ───
  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();
    const btn = document.getElementById('login-submit');
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    btn.disabled = true;
    btn.textContent = 'Přihlašování...';

    const { error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
      showError('login-error',
        error.message === 'Invalid login credentials'
          ? 'Nesprávný email nebo heslo'
          : translateAuthError(error.message)
      );
      btn.disabled = false;
      btn.textContent = 'Přihlásit se';
    } else {
      closeModals();
    }
  });

  // ─── Register form — stejná logika jako makej/src/app/(auth)/register/page.tsx ───
  document.getElementById('register-form').addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();
    const btn     = document.getElementById('register-submit');
    const name    = document.getElementById('reg-name').value.trim();
    const email   = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const company = document.getElementById('reg-company').value.trim();

    if (!name) {
      showError('register-error', 'Zadejte své jméno.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('register-error', 'Zadejte platný email.');
      return;
    }
    if (password.length < 6) {
      showError('register-error', 'Heslo musí mít alespoň 6 znaků.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Registrace...';

    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: selectedRole,
          company_name: selectedRole === 'employer' ? company : null,
        }
      }
    });

    if (error) {
      showError('register-error', translateAuthError(error.message));
      btn.disabled = false;
      btn.textContent = 'Vytvořit účet';
    } else {
      closeModals();
      showToast('Registrace proběhla! Zkontroluj svůj email pro potvrzení.');
    }
  });

  // ─── Google OAuth — stejný provider jako v makej ───
  document.getElementById('login-google').addEventListener('click', async () => {
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });
  });

  // ─── Auth state — Supabase v2 posílá INITIAL_SESSION při startu, getSession není potřeba ───
  sb.auth.onAuthStateChange((_event, session) => {
    updateNavAuth(session?.user || null);
  });
}

function translateAuthError(msg) {
  if (msg.includes('Invalid login credentials'))   return 'Nesprávný email nebo heslo.';
  if (msg.includes('missing') && (msg.includes('email') || msg.includes('phone'))) return 'Zadejte email a heslo.';
  if (msg.includes('Email not confirmed'))          return 'Nejdřív potvrď svůj email.';
  if (msg.includes('User already registered'))      return 'Tento email je již zaregistrovaný.';
  if (msg.includes('already been registered'))      return 'Tento email je již zaregistrovaný.';
  if (msg.includes('Password should be at least'))  return 'Heslo musí mít alespoň 6 znaků.';
  if (msg.includes('rate limit'))                   return 'Příliš mnoho pokusů, zkus to za chvíli.';
  return msg;
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'auth-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}
