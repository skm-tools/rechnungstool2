/* Rechnung SKM: speichert nur die App-Dateien für den Offline-Start. Eingaben werden weder gespeichert noch gesendet. */
const CACHE = 'skm-rechnung-2026-10-31-2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('skm-rechnung-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Erst aus dem Speicher antworten, im Hintergrund die neueste Version holen. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(async (cache) => {
    const cached = await cache.match(req, { ignoreSearch: true });
    const fresh = fetch(req).then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => cached);
    return cached || fresh;
  }));
});
