// Service worker : l'app et les textes déjà ouverts restent disponibles hors-ligne.
// L'audio n'est pas géré ici : l'app le range elle-même dans le cache « nun-audio » quand on télécharge une sourate.
const SHELL = 'nun-shell-v11';
const ASSETS = [
  './', 'index.html', 'styles.css', 'app.js', 'data.js', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'portraits/alafasy.webp', 'portraits/husary.webp', 'portraits/muaiqly.webp',
  'portraits/dosari.webp', 'portraits/ghamdi.webp', 'portraits/minshawi.webp',
  'portraits/sudais.webp', 'portraits/shuraim.webp', 'portraits/ajmi.webp', 'portraits/juhany.webp', 'portraits/hudhaify.webp', 'portraits/jibreel.webp',
  'portraits/qatami.webp', 'portraits/mustafaismail.webp', 'portraits/budair.webp', 'portraits/jaber.webp', 'portraits/banna.webp', 'portraits/abdulbasit.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('nun-shell') && k !== SHELL).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'api.alquran.cloud') return e.respondWith(networkFirst(req, 'nun-text'));
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') return e.respondWith(cacheFirst(req, 'nun-fonts'));
  if (url.origin === self.location.origin) return e.respondWith(networkFirst(req, SHELL));
});

async function networkFirst(req, name) {
  try {
    // no-cache : on revérifie auprès du serveur pour toujours servir la dernière version quand il y a du réseau.
    const res = await (req.mode === 'navigate' ? fetch(req.url, { cache: 'no-cache' }) : fetch(req, { cache: 'no-cache' }));
    if (res.ok) (await caches.open(name)).put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await caches.match(req, { ignoreSearch: req.mode === 'navigate' });
    if (hit) return hit;
    if (req.mode === 'navigate') return caches.match('index.html');
    throw err;
  }
}

async function cacheFirst(req, name) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') (await caches.open(name)).put(req, res.clone());
  return res;
}
