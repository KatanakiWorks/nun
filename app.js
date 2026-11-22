import { RECITERS, VERSES, NAMES_AR, NAMES_LATIN, surahTone, CREDITS } from './data.js';

// ---------- Outils ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad3 = (n) => String(n).padStart(3, '0');
const clampSurah = (n) => Math.min(114, Math.max(1, Math.round(n) || 1));
const RBY = Object.fromEntries(RECITERS.map((r) => [r.id, r]));
const BISM = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
const BISM_FR = "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.";
const hasBism = (s) => s !== 1 && s !== 9;
const today = () => new Date().toISOString().slice(0, 10);

const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible : on continue sans */ } }
};

// ---------- Préférences et données locales (rien n'est envoyé) ----------
const DEFAULTS = { theme: 'auto', reciter: 'alafasy', size: 28, font: 0, spacing: 1, tr: true, follow: true, chain: true, flow: false, followed: ['alafasy', 'husary', 'muaiqly', 'minshawi'] };
const prefs = { ...DEFAULTS, ...ls.get('nun.prefs', {}) };
if (!RBY[prefs.reciter]) prefs.reciter = 'alafasy';
const savePrefs = () => ls.set('nun.prefs', prefs);
let last = ls.get('nun.last', null);
if (last && (!RBY[last.r] || !VERSES[last.s - 1])) last = null;
const downloaded = new Set(ls.get('nun.dl', []));
const marks = new Set(ls.get('nun.marks', [])); // « sourate:verset »
const stats = ls.get('nun.stats', { days: {}, verses: 0 });

const FONTS = [["'Amiri Quran', Amiri, serif", 'Amiri'], ["'Scheherazade New', serif", 'Scheherazade'], ["'Noto Naskh Arabic', serif", 'Naskh']];
const SIZES = [24, 28, 32, 36];
const SPACING = [['Serré', 1.9], ['Normal', 2.25], ['Aéré', 2.6]];

function applyTheme() {
  const h = new Date().getHours();
  const t = prefs.theme === 'auto' ? (h >= 6 && h < 18 ? 'jour' : 'nuit') : prefs.theme;
  document.documentElement.dataset.theme = t;
  $('meta[name="theme-color"]').content = t === 'nuit' ? '#0b0b0d' : '#f3eee7';
}

// ---------- Icônes ----------
const svg = (body, fill = false) => `<svg viewBox="0 0 24 24" aria-hidden="true" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"'}>${body}</svg>`;
const I = {
  play: svg('<path d="M8 5v14l11-7z"/>', true),
  pause: svg('<rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/>', true),
  prev: svg('<rect x="4" y="5" width="2.6" height="14" rx="1"/><path d="M20 5.6v12.8a.8.8 0 0 1-1.2.7L8.6 12.7a.8.8 0 0 1 0-1.4l10.2-6.4a.8.8 0 0 1 1.2.7z"/>', true),
  next: svg('<rect x="17.4" y="5" width="2.6" height="14" rx="1"/><path d="M4 5.6v12.8a.8.8 0 0 0 1.2.7l10.2-6.4a.8.8 0 0 0 0-1.4L5.2 4.9A.8.8 0 0 0 4 5.6z"/>', true),
  home: svg('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
  book: svg('<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5zM12 6v14.5"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5"/>'),
  moon: svg('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
  back: svg('<path d="M15 5l-7 7 7 7"/>'),
  fwd: svg('<path d="M9 5l7 7-7 7"/>'),
  down: svg('<path d="M6 9l6 6 6-6"/>'),
  repeat: svg('<path d="M17 2l3 3-3 3M3 11V9a4 4 0 0 1 4-4h13M7 22l-3-3 3-3M21 13v2a4 4 0 0 1-4 4H4"/>'),
  bubble: svg('<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>'),
  dl: svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7"/>'),
  sliders: svg('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
  timer: svg('<path d="M19 14.5A7 7 0 0 1 9.5 5a7 7 0 1 0 9.5 9.5z"/><path d="M15 3h4l-4 4h4"/>'),
  full: svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
  share: svg('<path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>'),
  copy: svg('<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'),
  mark: svg('<path d="M6 3h12v18l-6-4-6 4z"/>'),
  marked: svg('<path d="M6 3h12v18l-6-4-6 4z"/>', true),
  image: svg('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>'),
  logo: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 16a14 14 0 0 0 28 0" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="9" r="4" fill="var(--accent)"/></svg>'
};
const SIL = '<svg class="sil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><circle cx="50" cy="40" r="15" fill="rgba(0,0,0,.26)"/><path d="M12 100C14 72 30 61 50 61s36 11 38 39z" fill="rgba(0,0,0,.26)"/></svg>';
const portrait = (r) => (r.photo ? `<img class="portrait" src="${r.photo}" alt="">` : SIL);

// ---------- Texte (alquran.cloud : texte uthmani + traduction Hamidullah) ----------
const textCache = new Map();
function getSurah(n) {
  if (textCache.has(n)) return textCache.get(n);
  const p = fetch(`https://api.alquran.cloud/v1/surah/${n}/editions/quran-uthmani,fr.hamidullah`)
    .then((res) => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then((j) => {
      const [ar, fr] = j.data;
      return ar.ayahs.map((a, i) => ({
        ar: n !== 1 && i === 0 && a.text.startsWith(BISM) ? a.text.slice(BISM.length).trim() : a.text,
        fr: fr.ayahs[i].text, page: a.page, juz: a.juz
      }));
    });
  textCache.set(n, p);
  p.catch(() => textCache.delete(n));
  return p;
}

// Verset du jour : le même pour tout le monde ce jour-là, sans serveur.
function verseOfDay() {
  const d = new Date();
  const day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000) + d.getFullYear() * 366;
  let g = (day * 2654435761) % 6236; // mélange simple et stable
  let s = 0;
  while (g >= VERSES[s]) { g -= VERSES[s]; s++; }
  return { s: s + 1, i: g };
}

// ---------- Lecture audio continue (everyayah.com : un fichier par verset) ----------
// Deux lecteurs en alternance : pendant qu'un verset joue, le suivant est déjà chargé, donc pas de coupure.
const players = [$('#audio'), new Audio()];
players[1].preload = 'auto';
let curP = 0;
const A = () => players[curP];
const blobUrls = [null, null];
let preKey = null;
const st = { r: null, s: 1, i: 0, pre: false, rep: 1, repLeft: 1, timer: 0, timerId: 0, verses: null, vs: 0, open: false };
const audioUrl = (r, s, a) => `https://everyayah.com/data/${RBY[r].folder}/${pad3(s)}${pad3(a)}.mp3`;
const keyOf = (pre, s, i) => `${st.r}:${pre ? 'b' : s + ':' + i}`;

async function loadInto(k, u) {
  if (blobUrls[k]) { URL.revokeObjectURL(blobUrls[k]); blobUrls[k] = null; }
  try {
    const hit = 'caches' in window && await caches.match(u);
    if (hit) { blobUrls[k] = URL.createObjectURL(await hit.blob()); players[k].src = blobUrls[k]; return; }
  } catch { /* cache illisible : on lit en ligne */ }
  players[k].src = u;
}

function nextItem() {
  if (st.pre) return { pre: false, s: st.s, i: 0 };
  if (st.rep > 1) return null;
  if (st.i + 1 < VERSES[st.s - 1]) return { pre: false, s: st.s, i: st.i + 1 };
  return null;
}
function preloadNext() {
  const n = nextItem();
  if (!n) { preKey = null; return; }
  const key = keyOf(n.pre, n.s, n.i);
  if (preKey === key) return;
  preKey = key;
  const k = 1 - curP;
  loadInto(k, n.pre ? audioUrl(st.r, 1, 1) : audioUrl(st.r, n.s, n.i + 1)).then(() => players[k].load());
}

async function startAyah() {
  const token = (startAyah.n = (startAyah.n || 0) + 1);
  const key = keyOf(st.pre, st.s, st.i);
  if (preKey === key) { A().pause(); curP = 1 - curP; preKey = null; }
  else { A().pause(); await loadInto(curP, st.pre ? audioUrl(st.r, 1, 1) : audioUrl(st.r, st.s, st.i + 1)); }
  if (token !== startAyah.n) return; // un autre verset a été demandé entre-temps
  try { A().currentTime = 0; } catch { /* pas encore chargé */ }
  A().play().catch(() => sync());
  last = { r: st.r, s: st.s, i: st.i };
  ls.set('nun.last', last);
  sync();
  updateMedia();
  preloadNext();
}

function play(r, s, i = 0) {
  st.r = RBY[r] ? r : prefs.reciter;
  st.s = clampSurah(s);
  st.i = Math.min(Math.max(0, i), VERSES[st.s - 1] - 1);
  st.pre = st.i === 0 && hasBism(st.s);
  st.repLeft = st.rep;
  preKey = null;
  const s0 = st.s;
  getSurah(s0).then((v) => { st.verses = v; st.vs = s0; sync(); }).catch(() => {});
  startAyah();
}

function goAyah(i) {
  if (!st.r) return;
  const n = VERSES[st.s - 1];
  if (i < 0) { st.i = 0; st.pre = hasBism(st.s); }
  else if (i >= n) return nextSurah();
  else { st.i = i; st.pre = false; }
  st.repLeft = st.rep;
  startAyah();
}
function nextSurah() {
  if (prefs.chain && st.s < 114) return play(st.r, st.s + 1);
  A().pause();
  sync();
}
function toggle() {
  if (!st.r) { const l = last || { r: prefs.reciter, s: 1, i: 0 }; return play(l.r, l.s, l.i); }
  if (A().paused) A().play().catch(() => {}); else A().pause();
}

let lastT = 0;
players.forEach((p) => {
  p.addEventListener('ended', () => {
    if (p !== A()) return;
    if (!st.pre) { stats.verses++; saveStats(); }
    if (st.pre) { st.pre = false; return startAyah(); }
    if (st.repLeft > 1) { st.repLeft--; p.currentTime = 0; p.play().catch(() => {}); return; }
    goAyah(st.i + 1);
  });
  p.addEventListener('play', () => { if (p === A()) sync(); });
  p.addEventListener('pause', () => { if (p === A()) sync(); });
  p.addEventListener('timeupdate', () => {
    if (p !== A()) return;
    const t = p.currentTime;
    if (!p.paused && t > lastT && t - lastT < 2) { stats.days[today()] = (stats.days[today()] || 0) + (t - lastT); }
    lastT = t;
    progress();
  });
  p.addEventListener('error', () => { if (p === A() && p.src) toast('Audio indisponible. Vérifie ta connexion ou télécharge la sourate pour l’écouter hors-ligne.'); });
});
let statsTimer = 0;
function saveStats() { clearTimeout(statsTimer); statsTimer = setTimeout(() => ls.set('nun.stats', stats), 1500); }
setInterval(saveStats, 15000);

function setTimer() {
  const steps = [0, 15, 30, 60];
  st.timer = steps[(steps.indexOf(st.timer) + 1) % steps.length];
  clearTimeout(st.timerId);
  if (st.timer) st.timerId = setTimeout(() => { A().pause(); st.timer = 0; sync(); toast('Minuteur : la récitation est en pause.'); }, st.timer * 60000);
  toast(st.timer ? `Arrêt dans ${st.timer} minutes.` : 'Minuteur désactivé.');
  sync();
}
function setRep() {
  const steps = [1, 3, 5, 10];
  st.rep = steps[(steps.indexOf(st.rep) + 1) % steps.length];
  st.repLeft = st.rep;
  preKey = null;
  if (st.rep === 1) preloadNext();
  toast(st.rep > 1 ? `Chaque verset sera répété ${st.rep} fois.` : 'Répétition désactivée.');
  sync();
}

function updateMedia() {
  if (!('mediaSession' in navigator) || !st.r) return;
  const r = RBY[st.r];
  const art = r.photo ? { src: new URL(r.photo, location.href).href, sizes: '512x512', type: 'image/webp' } : { src: new URL('icons/icon-512.png', location.href).href, sizes: '512x512', type: 'image/png' };
  navigator.mediaSession.metadata = new MediaMetadata({ title: `${NAMES_LATIN[st.s - 1]} · verset ${st.i + 1}`, artist: r.name, album: 'Nūn', artwork: [art] });
}
if ('mediaSession' in navigator) {
  const ms = navigator.mediaSession;
  ms.setActionHandler('play', () => toggle());
  ms.setActionHandler('pause', () => A().pause());
  ms.setActionHandler('previoustrack', () => goAyah(st.i - 1));
  ms.setActionHandler('nexttrack', () => goAyah(st.i + 1));
}

// ---------- Partage, copie, carte image ----------
const appUrl = (hash = '') => location.origin + location.pathname + hash;
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; } catch { /* hors https : méthode de secours */ }
  const ta = document.createElement('textarea');
  ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
  document.body.append(ta); ta.select();
  const ok = document.execCommand('copy');
  ta.remove();
  return ok;
}
async function share(title, text, hash) {
  const url = appUrl(hash);
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  toast((await copyText(`${text}\n${url}`)) ? 'Lien copié : tu peux le coller où tu veux.' : url);
}

// Carte image d'un verset (1080 × 1350), prête pour les stories et messages.
function wrap(ctx, text, maxW) {
  const words = text.split(' '); const lines = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line);
  return lines;
}
async function verseCard(s, i) {
  const v = (await getSurah(s))[i];
  await document.fonts.load("56px 'Amiri Quran'").catch(() => {});
  await document.fonts.load("700 40px 'Bricolage Grotesque'").catch(() => {});
  const W = 1080, H = 1350, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
  g.addColorStop(0, surahTone(s)); g.addColorStop(1, '#0d0a08');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.3, 120, 0, W * 0.3, 120, 700);
  glow.addColorStop(0, 'rgba(255,214,170,.28)'); glow.addColorStop(1, 'rgba(255,214,170,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.fillStyle = '#fff4e8';
  let size = 64, lines;
  ctx.direction = 'rtl';
  do { ctx.font = `${size}px 'Amiri Quran', Amiri, serif`; lines = wrap(ctx, v.ar, W - 160); size -= 4; } while (lines.length * size * 1.9 > 620 && size > 34);
  let y = 300;
  for (const l of lines) { ctx.fillText(l, W / 2, y); y += size * 1.9; }
  ctx.direction = 'ltr';
  ctx.font = "400 34px 'Bricolage Grotesque', sans-serif"; ctx.fillStyle = 'rgba(255,244,232,.78)';
  y += 30;
  for (const l of wrap(ctx, v.fr, W - 200).slice(0, 6)) { ctx.fillText(l, W / 2, y); y += 50; }
  ctx.font = "700 40px 'Bricolage Grotesque', sans-serif"; ctx.fillStyle = '#f2b37a';
  ctx.fillText(`${NAMES_LATIN[s - 1]} · ${s}:${i + 1}`, W / 2, H - 150);
  ctx.font = "800 30px 'Bricolage Grotesque', sans-serif"; ctx.fillStyle = 'rgba(255,244,232,.6)';
  ctx.fillText('N Ū N', W / 2, H - 90);
  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  const file = new File([blob], `nun-${s}-${i + 1}.png`, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Nūn' }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  toast('Image du verset enregistrée.');
}

function toggleMark(s, i) {
  const k = s + ':' + i;
  if (marks.has(k)) { marks.delete(k); toast('Marque-page retiré.'); } else { marks.add(k); toast('Verset marqué.'); }
  ls.set('nun.marks', [...marks]);
}

// ---------- Téléchargements hors-ligne ----------
async function download(r, s, btn) {
  const key = r + ':' + s;
  if (downloaded.has(key)) return toast('Déjà disponible hors-ligne.');
  if (!('caches' in window)) return toast('Le téléchargement n’est pas disponible ici (il faut une adresse https).');
  const urls = [];
  if (hasBism(s)) urls.push(audioUrl(r, 1, 1));
  for (let a = 1; a <= VERSES[s - 1]; a++) urls.push(audioUrl(r, s, a));
  try {
    const cache = await caches.open('nun-audio');
    let done = 0;
    for (const u of urls) {
      if (!(await cache.match(u))) {
        const res = await fetch(u);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await cache.put(u, res);
      }
      done++;
      if (btn) btn.textContent = Math.round((done / urls.length) * 100) + '%';
    }
    await getSurah(s).catch(() => {});
    downloaded.add(key);
    ls.set('nun.dl', [...downloaded]);
    toast(`${NAMES_LATIN[s - 1]} est disponible hors-ligne.`);
  } catch {
    toast('Téléchargement interrompu. Réessaie avec une connexion.');
  }
  if (btn) { const on = downloaded.has(key); btn.classList.toggle('done', on); btn.innerHTML = on ? I.check : I.dl; }
}
async function clearDownloads() {
  if (!confirm('Supprimer toutes les sourates téléchargées de cet appareil ? Il faudra une connexion pour les réécouter.')) return;
  if ('caches' in window) await caches.delete('nun-audio');
  downloaded.clear();
  ls.set('nun.dl', []);
  toast('Téléchargements supprimés.');
  render();
}

// ---------- Vues ----------
const surahArt = (s) => `<span class="art" style="--tone:${surahTone(s)}" lang="ar" dir="rtl" aria-hidden="true">${NAMES_AR[s - 1]}</span>`;
const backBtn = (cls = 'icon-btn') => `<button class="${cls}" data-act="back" aria-label="Retour">${I.back}</button>`;
const greeting = () => { const h = new Date().getHours(); return h >= 4 && h < 12 ? 'Bonjour,' : h >= 12 && h < 18 ? 'Bon après-midi,' : 'Bonsoir,'; };

function homeView() {
  const cards = RECITERS.map((r, k) => `
    <a class="rcard ${k === 0 ? 'on' : ''}" href="#/recitateur/${r.id}" style="--tone:${r.tone}" aria-label="Voir les sourates de ${esc(r.name)}">
      ${portrait(r)}<span class="fade"></span>
      <span class="meta"><span class="ar" lang="ar" dir="rtl">${r.ar}</span><b>${esc(r.name)}</b><small>${r.country} · Coran complet</small></span>
    </a>`).join('');
  const resume = last ? `
    <button class="resume" data-act="resume">
      ${surahArt(last.s)}
      <span class="t"><small class="muted">Reprendre</small><b>${NAMES_LATIN[last.s - 1]} · verset ${last.i + 1}</b><small class="muted">${esc(RBY[last.r].name)}</small></span>
      <span class="go" aria-hidden="true">${I.play}</span>
    </button>` : '';
  const vd = verseOfDay();
  return `
    <header class="top only-phone"><span class="logo">${I.logo}NŪN</span>
      <span style="display:flex;gap:8px"><button class="icon-btn" data-act="share-app" aria-label="Partager l'app">${I.share}</button><button class="icon-btn" data-act="theme-cycle" aria-label="Changer de thème">${I.moon}</button></span></header>
    <div class="top"><h1 class="two" style="margin-top:22px">${greeting()}<br><span>quelle voix ce soir ?</span></h1>
      <span class="only-desk" style="gap:8px"><button class="icon-btn" data-act="share-app" aria-label="Partager l'app">${I.share}</button><button class="icon-btn" data-act="theme-cycle" aria-label="Changer de thème">${I.moon}</button></span></div>
    <section aria-label="Récitateurs"><div class="carousel hide-sb" id="car">${cards}</div>
      <div class="dots" aria-hidden="true">${RECITERS.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div></section>
    ${resume}
    <section class="vday" style="--tone:${surahTone(vd.s)}" aria-label="Verset du jour">
      <p class="vday-k">Verset du jour · ${NAMES_LATIN[vd.s - 1]} ${vd.s}:${vd.i + 1}</p>
      <p class="vday-ar" lang="ar" dir="rtl" id="vday-ar">…</p>
      <p class="vday-fr" id="vday-fr"></p>
      <div class="vday-act">
        <button class="btn-grad" data-act="playv" data-s="${vd.s}" data-i="${vd.i}">${I.play}Écouter</button>
        <button class="btn-glass" data-act="card" data-s="${vd.s}" data-i="${vd.i}">${I.image}Image</button>
        <button class="btn-glass" data-act="verse" data-s="${vd.s}" data-i="${vd.i}" aria-label="Plus d'actions">${I.share}</button>
      </div>
    </section>`;
}

function surahRows(r, q) {
  const needle = (q || '').trim().toLowerCase();
  const rows = [];
  for (let n = 1; n <= 114; n++) {
    const latin = NAMES_LATIN[n - 1], ar = NAMES_AR[n - 1];
    if (needle && !latin.toLowerCase().includes(needle) && String(n) !== needle && !ar.includes(q.trim())) continue;
    const on = st.r === r && st.s === n;
    const done = downloaded.has(r + ':' + n);
    rows.push(`<li>
      <button class="srow ${on ? 'on' : ''}" data-act="play" data-r="${r}" data-s="${n}" aria-label="Écouter ${latin}, sourate ${n}">
        <span class="n">${n}</span><span class="t"><b>${latin}</b><small>${VERSES[n - 1]} versets</small></span><span class="ar" lang="ar" dir="rtl">${ar}</span>
      </button>
      <button class="dl ${done ? 'done' : ''}" data-act="dl" data-r="${r}" data-s="${n}" aria-label="${done ? 'Disponible hors-ligne' : 'Télécharger ' + latin}">${done ? I.check : I.dl}</button>
    </li>`);
  }
  return rows.length ? rows.join('') : '<li class="empty">Aucune sourate ne correspond.</li>';
}

function reciterView(id) {
  const r = RBY[id] || RECITERS[0];
  const fol = prefs.followed.includes(r.id);
  return `
    <div class="rhero" style="--tone:${r.tone}">${portrait(r)}<span class="fade"></span>
      <div class="hero-bar">${backBtn('glass-btn')}<span style="display:flex;gap:8px"><button class="glass-btn" data-act="share-reciter" data-r="${r.id}" aria-label="Partager ce récitateur">${I.share}</button><button class="glass-btn" data-act="theme-cycle" aria-label="Changer de thème">${I.moon}</button></span></div>
      <div class="meta"><span class="ar" lang="ar" dir="rtl">${r.ar}</span><b>${esc(r.name)}</b><small>${r.country} · Hafs · 114 sourates</small></div>
    </div>
    <div class="actions">
      <button class="btn-grad" data-act="play" data-r="${r.id}" data-s="1">${I.play}Tout écouter</button>
      <button class="btn-line" data-act="follow" data-r="${r.id}" aria-pressed="${fol}">${fol ? 'Suivi' : 'Suivre'}</button>
    </div>
    <div class="rlist-head"><h2>Toutes les sourates</h2><span class="muted" style="font-size:13px">114 sourates</span></div>
    <label class="field">${I.search}<span class="sr">Chercher une sourate</span><input id="q" type="search" placeholder="Nom ou numéro de sourate" autocomplete="off" data-r="${r.id}"></label>
    <ul class="list" id="slist">${surahRows(r.id, '')}</ul>`;
}

function searchView() {
  return `
    <div class="top">${backBtn()}<span></span></div>
    <h1 class="two" style="margin-top:16px">Rechercher<br><span>une sourate ou une voix</span></h1>
    <label class="field" style="margin-top:20px">${I.search}<span class="sr">Recherche</span><input id="q" type="search" placeholder="Al-Kahf, 36, Alafasy…" autocomplete="off" data-r="${prefs.reciter}"></label>
    <div class="voices hide-sb" id="qvoices">${voiceChips('')}</div>
    <p class="muted" style="font-size:13px;margin:18px 0 0">Les sourates sont lues avec ta voix par défaut : ${esc(RBY[prefs.reciter].name)}.</p>
    <ul class="list" id="slist">${surahRows(prefs.reciter, '')}</ul>`;
}
function voiceChips(q) {
  const needle = q.trim().toLowerCase();
  return RECITERS.filter((r) => !needle || r.name.toLowerCase().includes(needle)).map((r) => `
    <a class="voice" href="#/recitateur/${r.id}"><span class="av" style="--tone:${r.tone}">${r.photo ? `<img src="${r.photo}" alt="">` : ''}</span>${esc(r.short)}</a>`).join('');
}

function readView(arg, verse) {
  const n = clampSurah(+arg || (st.r ? st.s : last ? last.s : 1));
  return `<div class="read-wrap">
    <div class="read-top">
      ${backBtn()}
      <div class="c"><b>${NAMES_LATIN[n - 1]}</b><small id="rmeta">Sourate ${n} · ${VERSES[n - 1]} versets</small></div>
      <button class="icon-btn" data-act="sheet" aria-label="Réglages de lecture">${I.sliders}</button>
    </div>
    <div class="seg" role="radiogroup" aria-label="Affichage du texte">
      ${[[false, 'Verset par verset'], [true, 'Texte continu']].map(([v, l]) => `<button role="radio" aria-checked="${prefs.flow === v}" data-act="set" data-k="flow" data-v="${v}">${l}</button>`).join('')}
    </div>
    <div id="rbody" data-s="${n}" data-goto="${verse ? +verse - 1 : ''}"><p class="spin">Chargement du texte…</p></div>
    <nav class="pager" aria-label="Sourates voisines">
      ${n > 1 ? `<a class="btn-line" href="#/lire/${n - 1}">${I.back}${NAMES_LATIN[n - 2]}</a>` : '<span></span>'}
      ${n < 114 ? `<a class="btn-line" href="#/lire/${n + 1}">${NAMES_LATIN[n]}${I.fwd}</a>` : ''}
    </nav></div>`;
}

function fillRead() {
  const box = $('#rbody');
  if (!box) return;
  const n = +box.dataset.s;
  getSurah(n).then((v) => {
    if (!box.isConnected) return;
    const style = `font-family:${FONTS[prefs.font][0]};font-size:${prefs.size}px;line-height:${SPACING[prefs.spacing][1]}`;
    const cur = st.r && st.s === n && prefs.follow && !st.pre ? st.i : -1;
    $('#rmeta').textContent = `Sourate ${n} · page ${v[0].page} · juz' ${v[0].juz}`;
    const head = `<h1 class="two" style="margin-top:26px;font-size:30px">${NAMES_LATIN[n - 1]}<br><span lang="ar" dir="rtl" class="ar">سورة ${NAMES_AR[n - 1]}</span></h1>
      ${hasBism(n) ? `<p class="bism-line ar" lang="ar" dir="rtl">${BISM}</p>` : ''}`;
    if (prefs.flow) {
      box.innerHTML = `${head}<p class="flow" lang="ar" dir="rtl" style="${style}">${v.map((a, i) => `<button class="fv ${i === cur ? 'on' : ''}" data-i="${i}" data-act="verse" data-s="${n}" aria-label="Verset ${i + 1}">${esc(a.ar)}<span class="fn" aria-hidden="true">${i + 1}</span></button>`).join(' ')}</p>
        ${prefs.tr ? `<p class="flow-fr">${v.map((a, i) => `<span><b>${i + 1}</b> ${esc(a.fr)}</span>`).join(' ')}</p>` : ''}`;
    } else {
      box.innerHTML = `${head}<ol class="vlist ${cur >= 0 ? 'follow' : ''}">${v.map((a, i) => `<li class="${i === cur ? 'on' : ''}" data-i="${i}">
          <div class="vhead"><button data-act="playv" data-s="${n}" data-i="${i}" aria-label="Écouter à partir du verset ${i + 1}">${String(i + 1).padStart(2, '0')}</button>${marks.has(n + ':' + i) ? `<span class="vmark" aria-label="Verset marqué">${I.marked}</span>` : ''}</div>
          <button class="vtext" data-act="verse" data-s="${n}" data-i="${i}" aria-label="Actions pour le verset ${i + 1}">
            <span class="arv" lang="ar" dir="rtl" style="${style}">${esc(a.ar)}</span>
            ${prefs.tr ? `<span class="fr">${esc(a.fr)}</span>` : ''}
          </button></li>`).join('')}</ol>`;
    }
    const go = box.dataset.goto;
    if (go !== '') {
      box.dataset.goto = '';
      const el = $(`[data-i="${go}"]`, box);
      if (el) { el.classList.add('flash'); el.scrollIntoView({ block: 'center' }); }
    }
  }).catch(() => {
    if (box.isConnected) box.innerHTML = '<p class="empty">Texte indisponible hors-ligne. Ouvre cette sourate une fois avec une connexion pour la garder.</p>';
  });
}

function profileView() {
  const sw = (k, label, hint) => `<div class="swrow"><span><b>${label}</b><small>${hint}</small></span><button class="switch" role="switch" aria-checked="${!!prefs[k]}" aria-label="${label}" data-act="flip" data-k="${k}"></button></div>`;
  const week = Object.entries(stats.days).filter(([d]) => (Date.now() - new Date(d)) / 86400000 < 7).reduce((a, [, s]) => a + s, 0);
  let streak = 0;
  for (let d = new Date(); stats.days[d.toISOString().slice(0, 10)] > 30; d.setDate(d.getDate() - 1)) streak++;
  const mk = [...marks].map((k) => k.split(':').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return `
    <div class="top">${backBtn()}<button class="icon-btn" data-act="share-app" aria-label="Partager l'app">${I.share}</button></div>
    <h1 class="two" style="margin-top:16px">Profil<br><span>et préférences</span></h1>
    <div class="idcard"><span class="av" aria-hidden="true">${I.logo.replace('currentColor', '#fff4e8')}</span>
      <span><b style="font-size:18px">Sans compte</b><br><small class="muted">Tes préférences restent sur ton appareil. Aucune donnée n'est collectée.</small></span></div>
    <div class="statgrid">
      <div><b>${Math.round(week / 60)}</b><small>minutes d'écoute cette semaine</small></div>
      <div><b>${stats.verses}</b><small>versets écoutés</small></div>
      <div><b>${streak}</b><small>jour${streak > 1 ? 's' : ''} d'affilée</small></div>
    </div>
    <h2 class="sec">Marque-pages</h2>
    ${mk.length ? `<ul class="list">${mk.map(([s, i]) => `<li><a class="srow" href="#/lire/${s}/${i + 1}"><span class="n">${s}:${i + 1}</span><span class="t"><b>${NAMES_LATIN[s - 1]}</b><small>verset ${i + 1}</small></span><span class="ar" lang="ar" dir="rtl">${NAMES_AR[s - 1]}</span></a></li>`).join('')}</ul>` : '<p class="muted" style="font-size:14px">Touche un verset dans Lire puis « Marquer » pour le retrouver ici.</p>'}
    <h2 class="sec">Apparence</h2>
    <div class="seg" role="radiogroup" aria-label="Thème">${[['nuit', 'Nuit'], ['jour', 'Jour'], ['auto', 'Auto']].map(([v, l]) => `<button role="radio" aria-checked="${prefs.theme === v}" data-act="set" data-k="theme" data-v="${v}">${l}</button>`).join('')}</div>
    <p class="muted" style="font-size:12px;margin:8px 2px 0">Auto : jour de 6 h à 18 h, nuit le reste du temps.</p>
    <h2 class="sec">Voix par défaut</h2>
    <div class="voices hide-sb" role="radiogroup" aria-label="Voix par défaut">${RECITERS.map((r) => `<button class="voice" role="radio" aria-checked="${prefs.reciter === r.id}" data-act="set" data-k="reciter" data-v="${r.id}"><span class="av" style="--tone:${r.tone}">${r.photo ? `<img src="${r.photo}" alt="">` : ''}</span>${esc(r.short)}</button>`).join('')}</div>
    <h2 class="sec">Écoute et lecture</h2>
    ${sw('chain', 'Enchaîner les sourates', "Dans l'ordre du Coran")}
    ${sw('follow', 'Suivre la récitation', 'Le verset récité est mis en avant dans Lire')}
    ${sw('tr', 'Traduction française', 'Muhammad Hamidullah')}
    <h2 class="sec">Stockage</h2>
    <div class="swrow"><span><b>Sourates hors-ligne</b><small id="storage">${downloaded.size} sourate(s) téléchargée(s)</small></span><button class="btn-line" data-act="clear-dl">Vider</button></div>
    <h2 class="sec">Partager Nūn</h2>
    <button class="btn-grad" data-act="share-app">${I.share}Envoyer l'app à un proche</button>
    <h2 class="sec">À propos</h2>
    <p class="credits">Nūn est gratuit, sans publicité et sans compte.<br>Texte : Tanzil (écriture uthmani) et traduction de Muhammad Hamidullah, via alquran.cloud. Audio : everyayah.com.</p>
    <p class="credits"><b>Photos</b> (Wikimedia Commons, fond retiré) :<br>${CREDITS.filter(([who]) => RECITERS.some((r) => r.photo && r.short === who)).map(([who, src]) => `${esc(who)} : ${esc(src)}`).join('<br>')}</p>`;
}

// ---------- Cadres communs ----------
const NAV = [['', 'Accueil', I.home], ['recherche', 'Rechercher', I.search], ['lire', 'Lire', I.book], ['profil', 'Profil', I.user]];
function renderSide(route) {
  $('#side').innerHTML = `<span class="logo">${I.logo}NŪN</span>
    <nav>${NAV.map(([p, l, ic]) => `<a href="#/${p}" ${route === p ? 'aria-current="page"' : ''}>${ic}${l}</a>`).join('')}</nav>
    <h3>Tes voix</h3>
    ${prefs.followed.filter((id) => RBY[id]).map((id) => { const r = RBY[id]; return `<a class="fv" href="#/recitateur/${r.id}"><i style="--tone:${r.tone}">${r.photo ? `<img src="${r.photo}" alt="">` : ''}</i><span>${esc(r.short)}<small>${r.country}</small></span></a>`; }).join('')}`;
}

function renderDock(route) {
  const cur = st.r ? st : last;
  const playing = st.r && !A().paused;
  $('#dock').innerHTML = `
    <div class="mini" ${cur ? '' : 'hidden'}>
      ${cur ? `<button class="open" data-act="open" aria-label="Ouvrir le lecteur"></button>
      ${surahArt(cur.s)}
      <span class="t"><b>${NAMES_LATIN[cur.s - 1]} · verset ${cur.i + 1}</b><small>${esc(RBY[cur.r].name)}</small></span>
      <span class="ctrls"><button data-act="prev" aria-label="Verset précédent">${I.prev}</button><button class="pp" data-act="toggle" aria-label="${playing ? 'Pause' : 'Lecture'}">${playing ? I.pause : I.play}</button><button data-act="next" aria-label="Verset suivant">${I.next}</button></span>
      <button class="pp" data-act="toggle" aria-label="${playing ? 'Pause' : 'Lecture'}">${playing ? I.pause : I.play}</button>
      <button class="imm only-desk" data-act="open">${I.full}Immersion</button>
      <span class="bar"><i class="js-fill"></i></span>` : ''}
    </div>
    <nav class="tabs" aria-label="Navigation principale">${NAV.map(([p, l, ic]) => `<a href="#/${p}" ${route === p ? 'aria-current="page"' : ''}>${ic}${l}</a>`).join('')}</nav>`;
}

function renderPlayer() {
  const el = $('#player');
  el.hidden = !st.open;
  if (!st.open) return;
  const cur = st.r ? st : last;
  if (!cur) { st.open = false; el.hidden = true; return; }
  const r = RBY[cur.r], n = VERSES[cur.s - 1];
  const v = st.verses && st.vs === cur.s ? st.verses[cur.i] : null;
  if (!v) getSurah(cur.s).then((vs) => { st.verses = vs; st.vs = cur.s; if (st.open) renderPlayer(); }).catch(() => {});
  const pre = st.r && st.pre;
  const ar = pre ? BISM : v ? v.ar : '…';
  const fr = pre ? BISM_FR : v ? v.fr : '';
  const paused = !st.r || A().paused;
  el.classList.toggle('paused', paused);
  el.innerHTML = `
    <div class="p-art" style="--tone:${surahTone(cur.s)}"><span class="glow"></span>
      <div class="names"><small lang="ar" dir="rtl">سورة</small><span lang="ar" dir="rtl">${NAMES_AR[cur.s - 1]}</span></div><span class="fade"></span></div>
    <div class="p-bar"><button class="glass-btn" data-act="close" aria-label="Fermer le lecteur">${I.down}</button>
      <span style="display:flex;gap:8px"><button class="glass-btn" data-act="share-surah" aria-label="Partager la sourate">${I.share}</button><button class="glass-btn only-desk" data-act="fullscreen" aria-label="Plein écran">${I.full}</button><button class="glass-btn" data-act="theme-cycle" aria-label="Changer de thème">${I.moon}</button></span></div>
    <div class="p-side">
      <button class="round" data-act="rep" aria-label="Répéter chaque verset (${st.rep} fois)">${I.repeat}${st.rep > 1 ? `<span class="badge">${st.rep}</span>` : ''}</button>
      <button class="round" data-act="flip" data-k="tr" aria-pressed="${prefs.tr}" aria-label="Traduction">${I.bubble}</button>
      <a class="round amber" href="#/lire/${cur.s}/${cur.i + 1}" data-act="close-go" aria-label="Lire le texte">${I.book}</a>
    </div>
    <div class="p-body">
      <div class="p-title"><h1>${NAMES_LATIN[cur.s - 1]}<br><a href="#/recitateur/${r.id}" data-act="close-go" class="p-reciter">${esc(r.name)}</a></h1></div>
      <button class="p-verse" data-act="verse" data-s="${cur.s}" data-i="${cur.i}" aria-label="Actions pour ce verset" ${pre ? 'disabled' : ''}><span class="arv" lang="ar" dir="rtl">${esc(ar)}</span>${prefs.tr && fr ? `<span class="fr">${esc(fr)}</span>` : ''}</button>
      <div>
        <div class="scrub"><span>${pre ? 'Basmala' : 'Verset ' + (cur.i + 1)}</span>
          <span class="track" data-act="seek" role="slider" tabindex="0" aria-label="Position dans la sourate" aria-valuemin="1" aria-valuemax="${n}" aria-valuenow="${cur.i + 1}"><span class="fill js-fill"></span><span class="knob js-knob"></span></span>
          <span>${n}</span></div>
      </div>
      <div class="transport">
        <button data-act="prev" aria-label="Verset précédent">${I.prev}</button>
        <button class="main" data-act="toggle" aria-label="${paused ? 'Lecture' : 'Pause'}">${paused ? I.play : I.pause}</button>
        <button data-act="next" aria-label="Verset suivant">${I.next}</button>
      </div>
      <div class="p-extra">
        <button class="chip only-desk" data-act="rep" aria-pressed="${st.rep > 1}">${I.repeat}Répéter ×${st.rep}</button>
        <button class="chip only-desk" data-act="flip" data-k="tr" aria-pressed="${prefs.tr}">${I.bubble}Traduction</button>
        <button class="chip" data-act="timer" aria-pressed="${!!st.timer}">${I.timer}${st.timer ? `Arrêt dans ${st.timer} min` : 'Minuteur'}</button>
        <button class="chip only-desk" data-act="close-go" data-href="#/lire/${cur.s}/${cur.i + 1}">${I.book}Lire</button>
      </div>
    </div>`;
  progress();
}

function renderSheet() {
  const opt = (k, v, inner, label) => `<button class="opt" role="radio" aria-checked="${prefs[k] === v}" data-act="set" data-k="${k}" data-v="${v}" aria-label="${label}">${inner}</button>`;
  const sw = (k, label, hint, disabled) => `<div class="swrow"><span><b>${label}</b><small>${hint}</small></span><button class="switch" role="switch" aria-checked="${!disabled && !!prefs[k]}" aria-disabled="${!!disabled}" aria-label="${label}" ${disabled ? '' : `data-act="flip" data-k="${k}"`}></button></div>`;
  $('#layer').innerHTML = `<div class="scrim" data-act="close-sheet"></div>
    <section class="sheet hide-sb" role="dialog" aria-modal="true" aria-label="Réglages de lecture">
      <span class="grab" aria-hidden="true"></span>
      <div class="top"><h2>Lecture</h2><button class="btn-grad" data-act="close-sheet">Terminé</button></div>
      <p class="lbl">Taille du texte</p><div class="opts" role="radiogroup" aria-label="Taille du texte">${SIZES.map((v, k) => opt('size', v, `<span class="ar" style="font-size:${14 + k * 5}px">ع</span>`, `Taille ${k + 1}`)).join('')}</div>
      <p class="lbl">Écriture arabe</p><div class="opts" role="radiogroup" aria-label="Écriture arabe">${FONTS.map(([f, l], k) => opt('font', k, `<span class="ar" style="font-family:${f}">بِسْمِ</span>${l}`, l)).join('')}</div>
      <p class="lbl">Interligne</p><div class="seg" style="margin:0" role="radiogroup" aria-label="Interligne">${SPACING.map(([l], k) => `<button role="radio" aria-checked="${prefs.spacing === k}" data-act="set" data-k="spacing" data-v="${k}">${l}</button>`).join('')}</div>
      <div style="margin-top:10px">
        ${sw('tr', 'Traduction', 'La traduction française sous le texte')}
        ${sw('follow', 'Suivre la récitation', 'Le verset récité est mis en avant')}
        ${sw('tajwid', 'Tajwid en couleur', 'Bientôt, depuis une source vérifiée', true)}
      </div>
    </section>`;
  $('.sheet button')?.focus();
}

// Feuille d'actions d'un verset : écouter, copier, partager, image, marquer.
function renderVerseSheet(s, i) {
  getSurah(s).then((v) => {
    const a = v[i];
    const marked = marks.has(s + ':' + i);
    $('#layer').innerHTML = `<div class="scrim" data-act="close-sheet"></div>
      <section class="sheet vsheet hide-sb" role="dialog" aria-modal="true" aria-label="Verset ${i + 1}" style="--tone:${surahTone(s)}">
        <span class="grab" aria-hidden="true"></span>
        <p class="vday-k">${NAMES_LATIN[s - 1]} · ${s}:${i + 1}</p>
        <p class="vs-ar" lang="ar" dir="rtl">${esc(a.ar)}</p>
        <p class="vs-fr">${esc(a.fr)}</p>
        <div class="vs-grid">
          <button data-act="playv" data-s="${s}" data-i="${i}">${I.play}<span>Écouter d'ici</span></button>
          <button data-act="copy-verse" data-s="${s}" data-i="${i}">${I.copy}<span>Copier</span></button>
          <button data-act="share-verse" data-s="${s}" data-i="${i}">${I.share}<span>Partager</span></button>
          <button data-act="card" data-s="${s}" data-i="${i}">${I.image}<span>Image</span></button>
          <button data-act="mark" data-s="${s}" data-i="${i}" aria-pressed="${marked}">${marked ? I.marked : I.mark}<span>${marked ? 'Marqué' : 'Marquer'}</span></button>
        </div>
      </section>`;
    $('.vsheet button')?.focus();
  }).catch(() => toast('Texte indisponible hors-ligne.'));
}
const closeSheet = () => { $('#layer').innerHTML = ''; };

// ---------- Mises à jour ----------
let route = '';
function render() {
  applyTheme();
  const [p, a, b] = location.hash.replace(/^#\/?/, '').split('/');
  route = ['recitateur', 'lire', 'recherche', 'profil'].includes(p) ? p : '';
  $('#view').innerHTML = route === 'recitateur' ? reciterView(a) : route === 'lire' ? readView(a, b) : route === 'recherche' ? searchView() : route === 'profil' ? profileView() : homeView();
  const navRoute = route === 'recitateur' ? '' : route;
  renderSide(navRoute);
  renderDock(navRoute);
  renderPlayer();
  if (route === 'lire') fillRead();
  if (route === '') { setupCarousel(); fillVerseOfDay(); }
  if (route === 'profil' && navigator.storage?.estimate) navigator.storage.estimate().then(({ usage }) => { const el = $('#storage'); if (el) el.textContent = `${downloaded.size} sourate(s) · ${(usage / 1048576).toFixed(0)} Mo utilisés`; });
}

function fillVerseOfDay() {
  const { s, i } = verseOfDay();
  getSurah(s).then((v) => {
    const ar = $('#vday-ar'), fr = $('#vday-fr');
    if (ar) ar.textContent = v[i].ar;
    if (fr) fr.textContent = v[i].fr;
  }).catch(() => { const ar = $('#vday-ar'); if (ar) ar.textContent = 'Disponible avec une connexion.'; });
}

function sync() {
  renderDock(route === 'recitateur' ? '' : route);
  renderPlayer();
  $$('.srow.on').forEach((b) => b.classList.remove('on'));
  if (st.r) $(`.srow[data-r="${st.r}"][data-s="${st.s}"]`)?.classList.add('on');
  const box = $('#rbody');
  if (box && st.r && +box.dataset.s === st.s && prefs.follow) {
    let target = null;
    $$('.vlist li, .fv', box).forEach((el) => { const on = +el.dataset.i === st.i && !st.pre; el.classList.toggle('on', on); if (on) target = el; });
    $('.vlist', box)?.classList.add('follow');
    if (target && !A().paused && sync.lastScrolled !== `${st.s}:${st.i}`) { sync.lastScrolled = `${st.s}:${st.i}`; target.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
}

function progress() {
  const cur = st.r ? st : last;
  if (!cur) return;
  const n = VERSES[cur.s - 1];
  const p = A();
  const part = st.r && p.duration ? p.currentTime / p.duration : 0;
  const pct = Math.min(100, ((cur.i + (st.pre ? 0 : part)) / n) * 100);
  $$('.js-fill').forEach((el) => { el.style.width = pct + '%'; });
  $$('.js-knob').forEach((el) => { el.style.left = pct + '%'; });
}

function setupCarousel() {
  const car = $('#car');
  if (!car) return;
  car.addEventListener('scroll', () => {
    const k = Math.max(0, Math.min(RECITERS.length - 1, Math.round(car.scrollLeft / 244)));
    $$('.rcard', car).forEach((c, j) => c.classList.toggle('on', j === k));
    $$('.dots i').forEach((d, j) => d.classList.toggle('on', j === k));
  }, { passive: true });
}

let toastTimer = 0;
function toast(msg) {
  let el = $('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.append(el); }
  el.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 3500);
}

// ---------- Actions ----------
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const d = el.dataset;
  const s = +d.s, i = +d.i;
  switch (d.act) {
    case 'play': play(d.r || (st.r && route !== 'recherche' ? st.r : prefs.reciter), s); break;
    case 'playv': closeSheet(); play(st.r || prefs.reciter, s, i); break;
    case 'resume': if (last) play(last.r, last.s, last.i); break;
    case 'toggle': toggle(); break;
    case 'prev': goAyah(st.pre ? -1 : st.i - 1); break;
    case 'next': goAyah(st.pre ? 0 : st.i + 1); break;
    case 'rep': setRep(); break;
    case 'timer': setTimer(); break;
    case 'open': st.open = true; renderPlayer(); $('#player [data-act="close"]')?.focus(); break;
    case 'close': st.open = false; if (document.fullscreenElement) document.exitFullscreen(); renderPlayer(); break;
    case 'close-go': e.preventDefault(); st.open = false; if (document.fullscreenElement) document.exitFullscreen(); location.hash = d.href || el.getAttribute('href'); renderPlayer(); break;
    case 'back': if (history.length > 1) history.back(); else location.hash = '#/'; break;
    case 'fullscreen': document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.().catch(() => {}); break;
    case 'seek': {
      if (!st.r) break;
      const rect = el.getBoundingClientRect();
      goAyah(Math.floor(((e.clientX - rect.left) / rect.width) * VERSES[st.s - 1]));
      break;
    }
    case 'verse': renderVerseSheet(s, i); break;
    case 'copy-verse': {
      const a = (await getSurah(s))[i];
      toast((await copyText(`${a.ar}\n${a.fr}\n— ${NAMES_LATIN[s - 1]} ${s}:${i + 1}`)) ? 'Verset copié.' : 'Impossible de copier ici.');
      closeSheet();
      break;
    }
    case 'share-verse': {
      const a = (await getSurah(s))[i];
      closeSheet();
      share(`${NAMES_LATIN[s - 1]} ${s}:${i + 1}`, `${a.ar}\n${a.fr}\n— ${NAMES_LATIN[s - 1]} ${s}:${i + 1}`, `#/lire/${s}/${i + 1}`);
      break;
    }
    case 'card': closeSheet(); toast('Création de l’image…'); verseCard(s, i).catch(() => toast('Impossible de créer l’image.')); break;
    case 'mark': toggleMark(s, i); closeSheet(); if (route === 'lire') fillRead(); break;
    case 'share-app': share('Nūn — Récitations du Coran', 'Nūn : écouter et lire le Coran avec les plus belles voix. Gratuit, sans pub, sans compte.', '#/'); break;
    case 'share-reciter': { const r = RBY[d.r]; share(r.name, `Écoute ${r.name} sur Nūn.`, `#/recitateur/${r.id}`); break; }
    case 'share-surah': { const cur = st.r ? st : last; if (cur) share(NAMES_LATIN[cur.s - 1], `${NAMES_LATIN[cur.s - 1]} récitée par ${RBY[cur.r].name}, sur Nūn.`, `#/lire/${cur.s}`); break; }
    case 'dl': download(d.r, s, el); break;
    case 'clear-dl': clearDownloads(); break;
    case 'follow': {
      const k = prefs.followed.indexOf(d.r);
      if (k >= 0) prefs.followed.splice(k, 1); else prefs.followed.push(d.r);
      savePrefs();
      el.setAttribute('aria-pressed', k < 0);
      el.textContent = k < 0 ? 'Suivi' : 'Suivre';
      renderSide(route);
      break;
    }
    case 'theme-cycle': prefs.theme = document.documentElement.dataset.theme === 'nuit' ? 'jour' : 'nuit'; savePrefs(); applyTheme(); if (route === 'profil') render(); break;
    case 'set': {
      const v = d.v === 'true' ? true : d.v === 'false' ? false : /^\d+$/.test(d.v) ? +d.v : d.v;
      prefs[d.k] = v;
      savePrefs();
      if ($('#layer .sheet')) { renderSheet(); fillRead(); $(`#layer [data-k="${d.k}"][data-v="${d.v}"]`)?.focus(); } else render();
      break;
    }
    case 'flip':
      prefs[d.k] = !prefs[d.k];
      savePrefs();
      if ($('#layer .sheet')) { renderSheet(); fillRead(); $(`#layer [data-k="${d.k}"]`)?.focus(); }
      else if (st.open) renderPlayer();
      else render();
      break;
    case 'sheet': renderSheet(); break;
    case 'close-sheet': closeSheet(); break;
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id !== 'q') return;
  const q = e.target.value;
  $('#slist').innerHTML = surahRows(e.target.dataset.r, q);
  const vs = $('#qvoices');
  if (vs) vs.innerHTML = voiceChips(q);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { if ($('#layer .sheet')) closeSheet(); else if (st.open) { st.open = false; renderPlayer(); } }
  if (e.target.matches?.('.track') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); goAyah(st.i + (e.key === 'ArrowRight' ? 1 : -1)); }
  if (e.key === ' ' && !e.target.matches('input, button, a, [role="slider"]') && st.r) { e.preventDefault(); toggle(); }
});

window.addEventListener('hashchange', () => { closeSheet(); render(); if (!/^#\/lire\/\d+\/\d+/.test(location.hash)) window.scrollTo(0, 0); });
window.addEventListener('pagehide', () => ls.set('nun.stats', stats));
setInterval(() => { if (prefs.theme === 'auto') applyTheme(); }, 60000);
render();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
